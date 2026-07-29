/**
 * Import de photos depuis un dossier local.
 *
 *   npx tsx scripts/import-photos.ts <dossier> --serie <slug-de-la-serie>
 *
 * Options :
 *   --serie <slug>   Série à laquelle rattacher les photos (obligatoire sauf --dry-run)
 *   --dry-run        N'écrit rien : affiche ce qui serait fait
 *   --with-master    Téléverse aussi l'original dans le bucket privé `masters`
 *   --publier        Publie immédiatement (par défaut : brouillon, à relire)
 *
 * Pour chaque image, le script :
 *   1. lit les métadonnées EXIF — dont les COORDONNÉES GPS, qui remplissent
 *      automatiquement la carte de la page produit — et la date de prise de vue ;
 *   2. génère les dérivés AVIF en 480 / 960 / 1600 / 2400 px ;
 *   3. produit une miniature floue en base64 (chargement sans à-coup) ;
 *   4. téléverse le tout dans le bucket public `photos` ;
 *   5. insère ou met à jour la ligne correspondante en base.
 *
 * Le script est idempotent : le relancer sur le même dossier met à jour au lieu
 * de dupliquer, et ne remet jamais à zéro un compteur de ventes.
 *
 * ---------------------------------------------------------------------------
 * Fichier d'accompagnement (optionnel mais recommandé)
 * ---------------------------------------------------------------------------
 * À côté de `deadvlei.jpg`, un fichier `deadvlei.txt` (ou `.md`) permet de
 * fournir le contenu éditorial sans passer par l'interface Supabase :
 *
 *     Titre: Deadvlei, à l'aube
 *     Lieu: Deadvlei, Sossusvlei, Namibie
 *     Date: 2024-06-14
 *     Legende: Acacias morts depuis neuf cents ans
 *     Zoom: 11
 *     ---
 *     Il faut partir de Sesriem à quatre heures du matin…
 *
 *     (paragraphes séparés par une ligne vide)
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import exifr from 'exifr';
import { readdir, readFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import sharp from 'sharp';
import type { Database, PhotoInsert } from '../src/types/database';

config({ path: '.env.local', quiet: true });

const DERIVATIVE_WIDTHS = [480, 960, 1600, 2400];
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.webp']);
const SIDECAR_EXTENSIONS = ['.txt', '.md'];

// ---------------------------------------------------------------------------

type Options = {
  directory: string;
  seriesSlug?: string;
  dryRun: boolean;
  withMaster: boolean;
  publish: boolean;
};

function parseArgs(argv: string[]): Options {
  const positional = argv.filter((arg) => !arg.startsWith('--'));
  const flag = (name: string) => argv.includes(`--${name}`);
  const value = (name: string) => {
    const index = argv.indexOf(`--${name}`);
    return index !== -1 ? argv[index + 1] : undefined;
  };

  const directory = positional[0];
  if (!directory) {
    console.error(
      'Usage : npx tsx scripts/import-photos.ts <dossier> --serie <slug> [--dry-run] [--publier] [--with-master]',
    );
    process.exit(1);
  }

  return {
    directory,
    seriesSlug: value('serie'),
    dryRun: flag('dry-run'),
    withMaster: flag('with-master'),
    publish: flag('publier'),
  };
}

// ---------------------------------------------------------------------------

/** « DSC_4821 Deadvlei à l'aube.jpg » → « deadvlei-a-l-aube » */
function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // supprime les accents
    .toLowerCase()
    .replace(/^(dsc|img|_dsc|p)[-_]?\d+[-_\s]*/i, '') // préfixes d'appareil photo
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** « deadvlei-a-l-aube » → « Deadvlei a l aube » (titre par défaut, à relire) */
function humanize(slug: string): string {
  const spaced = slug.replace(/-/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

type Sidecar = {
  title?: string;
  locationName?: string;
  takenAt?: string;
  caption?: string;
  mapZoom?: number;
  story?: string;
};

async function readSidecar(directory: string, stem: string): Promise<Sidecar> {
  for (const extension of SIDECAR_EXTENSIONS) {
    try {
      const raw = await readFile(join(directory, stem + extension), 'utf8');
      return parseSidecar(raw);
    } catch {
      // Fichier absent : on essaie l'extension suivante.
    }
  }
  return {};
}

function parseSidecar(raw: string): Sidecar {
  const [header, ...rest] = raw.split(/^---\s*$/m);
  const story = rest.join('---').trim() || undefined;
  const sidecar: Sidecar = { story };

  for (const line of (header ?? '').split('\n')) {
    const match = /^\s*([A-Za-zÀ-ÿ]+)\s*:\s*(.+?)\s*$/.exec(line);
    if (!match) continue;

    const key = match[1]!
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    const value = match[2]!;

    if (key === 'titre' || key === 'title') sidecar.title = value;
    else if (key === 'lieu' || key === 'location') sidecar.locationName = value;
    else if (key === 'date') sidecar.takenAt = value;
    else if (key === 'legende' || key === 'caption') sidecar.caption = value;
    else if (key === 'zoom') sidecar.mapZoom = Number.parseInt(value, 10) || undefined;
  }

  // Si aucun séparateur `---` n'a été trouvé, tout le contenu est le récit.
  if (rest.length === 0 && !sidecar.title) {
    sidecar.story = raw.trim() || undefined;
  }

  return sidecar;
}

// ---------------------------------------------------------------------------

async function main() {
  const options = parseArgs(process.argv.slice(2));

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!options.dryRun && (!url || !serviceKey)) {
    console.error(
      '✗ NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définies dans .env.local.\n' +
        '  La clé service_role se trouve dans Supabase → Project Settings → API.',
    );
    process.exit(1);
  }

  const supabase =
    options.dryRun && (!url || !serviceKey)
      ? null
      : createClient<Database>(url!, serviceKey!, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

  // --- Série ---------------------------------------------------------------
  let seriesId: string | null = null;

  if (options.seriesSlug && supabase) {
    const { data, error } = await supabase
      .from('series')
      .select('id, title')
      .eq('slug', options.seriesSlug)
      .maybeSingle();

    if (error) throw new Error(`Lecture de la série : ${error.message}`);
    if (!data) {
      console.error(
        `✗ Aucune série avec le slug « ${options.seriesSlug} ».\n` +
          '  Crée-la d’abord dans Supabase (table `series`), ou vérifie l’orthographe.',
      );
      process.exit(1);
    }

    seriesId = data.id;
    console.log(`Série : ${data.title} (${options.seriesSlug})\n`);
  } else if (!options.dryRun) {
    console.error('✗ --serie <slug> est obligatoire (sauf en --dry-run).');
    process.exit(1);
  }

  // --- Fichiers ------------------------------------------------------------
  const entries = await readdir(options.directory, { withFileTypes: true });
  const images = entries
    .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort();

  if (images.length === 0) {
    console.error(`✗ Aucune image trouvée dans ${options.directory}`);
    console.error(`  Extensions reconnues : ${[...IMAGE_EXTENSIONS].join(', ')}`);
    process.exit(1);
  }

  console.log(`${images.length} image(s) à traiter${options.dryRun ? ' (simulation)' : ''}\n`);

  let position = 0;
  let imported = 0;

  for (const filename of images) {
    position += 1;
    const filePath = join(options.directory, filename);
    const stem = basename(filename, extname(filename));
    const slug = slugify(stem);

    if (!slug) {
      console.warn(`  ⚠ ${filename} — nom de fichier inexploitable, ignoré`);
      continue;
    }

    process.stdout.write(`[${position}/${images.length}] ${slug} … `);

    const buffer = await readFile(filePath);
    const image = sharp(buffer, { failOn: 'none' });
    const metadata = await image.metadata();

    // --- EXIF : coordonnées GPS et date ------------------------------------
    let latitude: number | null = null;
    let longitude: number | null = null;
    let takenAt: string | null = null;

    try {
      const exif = await exifr.parse(buffer, { gps: true, pick: ['DateTimeOriginal'] });
      if (typeof exif?.latitude === 'number' && typeof exif?.longitude === 'number') {
        latitude = Number(exif.latitude.toFixed(6));
        longitude = Number(exif.longitude.toFixed(6));
      }
      if (exif?.DateTimeOriginal instanceof Date) {
        takenAt = exif.DateTimeOriginal.toISOString().slice(0, 10);
      }
    } catch {
      // Pas d'EXIF exploitable : les coordonnées seront à saisir à la main.
    }

    const sidecar = await readSidecar(options.directory, stem);

    // --- Dérivés -----------------------------------------------------------
    const sourceWidth = metadata.width ?? 0;
    const derivatives: { width: number; body: Buffer }[] = [];

    for (const width of DERIVATIVE_WIDTHS) {
      // On n'agrandit jamais : inutile et visuellement pire que l'original.
      if (sourceWidth > 0 && width > sourceWidth && width !== DERIVATIVE_WIDTHS[0]) continue;

      const body = await sharp(buffer, { failOn: 'none' })
        .rotate() // applique l'orientation EXIF
        .resize({ width, withoutEnlargement: true })
        .toColorspace('srgb')
        .avif({ quality: 78, effort: 4 })
        .toBuffer();

      derivatives.push({ width, body });
    }

    // Miniature floue : 16 px de large, encodée en base64 dans la page.
    const blurBuffer = await sharp(buffer, { failOn: 'none' })
      .rotate()
      .resize({ width: 16 })
      .webp({ quality: 55 })
      .toBuffer();
    const blurDataUrl = `data:image/webp;base64,${blurBuffer.toString('base64')}`;

    const largest = derivatives.at(-1)!;
    const largestMeta = await sharp(largest.body).metadata();

    if (options.dryRun) {
      console.log(
        `simulation — ${derivatives.length} dérivé(s), ` +
          `${latitude !== null ? `GPS ${latitude}, ${longitude}` : 'pas de GPS'}` +
          `${takenAt ? `, ${takenAt}` : ''}`,
      );
      continue;
    }

    // --- Téléversement -----------------------------------------------------
    for (const derivative of derivatives) {
      const { error } = await supabase!.storage
        .from('photos')
        .upload(`${slug}/${derivative.width}.avif`, derivative.body, {
          contentType: 'image/avif',
          cacheControl: '31536000', // un an : le contenu d'un chemin ne change pas
          upsert: true,
        });

      if (error) throw new Error(`Téléversement ${slug}/${derivative.width} : ${error.message}`);
    }

    if (options.withMaster) {
      const { error } = await supabase!.storage
        .from('masters')
        .upload(`${slug}${extname(filename)}`, buffer, { upsert: true });

      if (error) console.warn(`\n  ⚠ master non téléversé (${error.message})`);
    }

    // --- Base de données ---------------------------------------------------
    const row: PhotoInsert = {
      series_id: seriesId,
      slug,
      title: sidecar.title ?? humanize(slug),
      caption: sidecar.caption ?? null,
      story: sidecar.story ?? null,
      location_name: sidecar.locationName ?? null,
      latitude,
      longitude,
      map_zoom: sidecar.mapZoom ?? 8,
      taken_at: sidecar.takenAt ?? takenAt,
      image_path: slug,
      image_width: largestMeta.width ?? null,
      image_height: largestMeta.height ?? null,
      blur_data_url: blurDataUrl,
      master_filename: filename,
      position,
      published: options.publish,
    };

    const { error } = await supabase!.from('photos').upsert(row, { onConflict: 'slug' });
    if (error) throw new Error(`Enregistrement de ${slug} : ${error.message}`);

    imported += 1;
    console.log(
      `${derivatives.length} dérivé(s)` +
        `${latitude !== null ? `, GPS ✓` : ', GPS absent'}` +
        `${sidecar.story ? ', récit ✓' : ''}`,
    );
  }

  console.log(`\n✓ ${imported} photo(s) importée(s).`);

  if (!options.publish && !options.dryRun) {
    console.log(
      '  Elles sont en brouillon : relis les titres, récits et coordonnées dans Supabase,\n' +
        '  puis passe `published` à true pour les rendre visibles.',
    );
  }
}

main().catch((error: unknown) => {
  console.error('\n✗', error instanceof Error ? error.message : error);
  process.exit(1);
});
