/**
 * Import ponctuel de la sélection expo (dossier ~/Desktop/selection expo).
 *
 * Contrairement à `import-photos.ts` (scan générique d'un dossier), ce script
 * est piloté par un manifeste explicite : chaque entrée dit précisément quel
 * fichier va sur quel slug, et si c'est une mise à jour (fichier remplacé,
 * tout le reste de la fiche conservé) ou une création (nouvelle photo).
 *
 *   npx tsx scripts/import-expo-selection.ts [--dry-run]
 *
 * Réutilise la même logique de dérivés que `import-photos.ts` (sharp,
 * 480/960/1600/2400 px, avif) et le même bucket Storage `photos`.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import exifr from 'exifr';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
import type { Database, PhotoInsert } from '../src/types/database';

config({ path: '.env.local', quiet: true });

const DERIVATIVE_WIDTHS = [480, 960, 1600, 2400];
const SOURCE_DIR = join(homedir(), 'Desktop', 'selection expo');
const SERIES_SLUG = '1-mere-1-fils-1-reve';

type ManifestEntry =
  | { mode: 'update'; slug: string; file: string; bwFile?: string }
  | {
      mode: 'insert';
      slug: string;
      file: string;
      bwFile?: string;
      title: string;
      countryCode?: string;
      locationName?: string;
    };

const MANIFEST: ManifestEntry[] = [
  // --- 16 mises à jour : même fiche, nouveau fichier -----------------------
  { mode: 'update', slug: 'benin', file: 'Bénin2O25285.jpg' },
  { mode: 'update', slug: 'le-palmier', file: "Le palmier - Cote D'ivoire.JPG" },
  { mode: 'update', slug: 'le-plongeur', file: 'Le plongeur - Fleuve Congo.JPG' },
  { mode: 'update', slug: 'les-jumelles', file: 'Les jumelles - Togo.JPG' },
  { mode: 'update', slug: 'maroc', file: 'MAROC2O25370.jpg' },
  { mode: 'update', slug: 'perdras-negras', file: 'Perdras Negras , Angola.JPG' },
  { mode: 'update', slug: 'turban', file: 'Turban - Togo.JPG' },
  { mode: 'update', slug: 'village-de-pecheur', file: 'Village de pecheur, Angola.JPG' },
  { mode: 'update', slug: 'enfant-du-fleuve-congo', file: 'enfant du fleuve Congo.JPG' },
  { mode: 'update', slug: 'dsf9016', file: '_DSF9016.jpg', bwFile: '_DSF9016NB.jpeg' },
  { mode: 'update', slug: 'dsf9254', file: '_DSF9254.tif' },
  { mode: 'update', slug: 'dsf9479', file: '_DSF9479.jpg' },
  { mode: 'update', slug: 'dsf9501', file: '_DSF9501.jpeg' },
  { mode: 'update', slug: 'dsf9569', file: '_DSF9569.jpg' },
  { mode: 'update', slug: 'dsf9605', file: '_DSF9605.jpg' },
  { mode: 'update', slug: 'dsf9822', file: '_DSF9822.jpg' },

  // --- 21 nouvelles photos ---------------------------------------------------
  { mode: 'insert', slug: 'l-envol', file: 'DSCF2812.JPG', title: "L'envol" },
  { mode: 'insert', slug: 'silhouette-bleue', file: 'Silhouette.jpg', title: 'Silhouette bleue' },
  { mode: 'insert', slug: 'filets-de-peche', file: '_DSF7258.jpg', title: 'Filets de pêche' },
  {
    mode: 'insert',
    slug: 'la-course-vers-la-mer',
    file: '_DSF7367.jpg',
    title: 'La course vers la mer',
  },
  { mode: 'insert', slug: 'face-aux-chutes', file: '_DSF7879.tif', title: 'Face aux chutes' },
  { mode: 'insert', slug: 'le-saut', file: '_DSF8252.JPG', title: 'Le saut' },
  {
    mode: 'insert',
    slug: 'sous-la-feuille',
    file: '_DSF9038.tif',
    bwFile: '_DSF9038NB.jpeg',
    title: 'Sous la feuille',
  },
  {
    mode: 'insert',
    slug: 'la-feuille-de-bananier',
    file: '_DSF9124.jpeg',
    bwFile: '_DSF9124NB.jpeg',
    title: 'La feuille de bananier',
  },
  { mode: 'insert', slug: 'la-cour', file: '_DSF9151.jpeg', title: 'La cour' },
  { mode: 'insert', slug: 'ruines-englouties', file: '_DSF9154.JPG', title: 'Ruines englouties' },
  { mode: 'insert', slug: 'le-ponton', file: '_DSF9270.jpg', title: 'Le ponton' },
  { mode: 'insert', slug: 'le-foulard', file: '_DSF9331NB2.jpeg', title: 'Le foulard' },
  {
    mode: 'insert',
    slug: 'sous-les-cocotiers',
    file: '_DSF9521NB.jpeg',
    title: 'Sous les cocotiers',
  },
  {
    mode: 'insert',
    slug: 'la-fenetre-sur-la-mer',
    file: '_DSF9573.jpg',
    title: 'La fenêtre sur la mer',
  },
  { mode: 'insert', slug: 'la-chorale', file: '_DSF9602 2.JPG', title: 'La chorale' },
  {
    mode: 'insert',
    slug: 'le-chapeau-de-paille',
    file: '_DSF9647.tif',
    title: 'Le chapeau de paille',
  },
  { mode: 'insert', slug: 'en-apesanteur', file: '_DSF9714 2.jpg', title: 'En apesanteur' },
  { mode: 'insert', slug: 'la-cabine', file: '_DSF9727.tif', title: 'La cabine' },
  {
    mode: 'insert',
    slug: 'ganvie',
    file: '_DSF9789_GANVIER.jpg',
    title: 'Ganvié',
    countryCode: 'bj',
  },
  { mode: 'insert', slug: 'robe-blanche', file: '_DSF9956.jpeg', title: 'Robe blanche' },
  { mode: 'insert', slug: 'robe-imprimee', file: '_DSF9974.jpeg', title: 'Robe imprimée' },
];

// Photos actuellement publiées mais absentes de la sélection : dépubliées
// (pas supprimées) une fois l'import terminé.
const ORPHANED_SLUGS = [
  'angola-photo-de-nous',
  'congo',
  'dsf9045',
  'dsf9139',
  'dsf9586',
  'dsf9613',
  'dsf9736-2',
  'dsf9738',
  'dsf9771',
  'ensemble',
  'jump',
  'l-eleveur',
  'la-corale',
  'linge-rouge',
  'palmier-mur-ocre',
  'le-pecheur',
  'les-plongeurs',
  'namibie',
  'portrait-aux-tissus',
  'ruine',
  'sapeur',
];

// ---------------------------------------------------------------------------

type Derivative = { width: number; body: Buffer };

async function buildDerivatives(buffer: Buffer): Promise<{
  derivatives: Derivative[];
  width: number | null;
  height: number | null;
  blurDataUrl: string;
}> {
  const source = sharp(buffer, { failOn: 'none' });
  const metadata = await source.metadata();
  const sourceWidth = metadata.width ?? 0;

  const derivatives: Derivative[] = [];
  for (const width of DERIVATIVE_WIDTHS) {
    if (sourceWidth > 0 && width > sourceWidth && width !== DERIVATIVE_WIDTHS[0]) continue;

    const body = await sharp(buffer, { failOn: 'none' })
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .toColorspace('srgb')
      .avif({ quality: 78, effort: 4 })
      .toBuffer();

    derivatives.push({ width, body });
  }

  const blurBuffer = await sharp(buffer, { failOn: 'none' })
    .rotate()
    .resize({ width: 16 })
    .webp({ quality: 55 })
    .toBuffer();
  const blurDataUrl = `data:image/webp;base64,${blurBuffer.toString('base64')}`;

  const largest = derivatives.at(-1)!;
  const largestMeta = await sharp(largest.body).metadata();

  return {
    derivatives,
    width: largestMeta.width ?? null,
    height: largestMeta.height ?? null,
    blurDataUrl,
  };
}

async function uploadDerivatives(
  supabase: ReturnType<typeof createClient<Database>>,
  storagePrefix: string,
  derivatives: Derivative[],
) {
  for (const derivative of derivatives) {
    const { error } = await supabase.storage
      .from('photos')
      .upload(`${storagePrefix}/${derivative.width}.avif`, derivative.body, {
        contentType: 'image/avif',
        cacheControl: '31536000',
        upsert: true,
      });
    if (error) throw new Error(`Téléversement ${storagePrefix}/${derivative.width} : ${error.message}`);
  }
}

async function readExif(buffer: Buffer): Promise<{ latitude: number | null; longitude: number | null; takenAt: string | null }> {
  try {
    const exif = await exifr.parse(buffer, { gps: true, pick: ['DateTimeOriginal'] });
    const latitude = typeof exif?.latitude === 'number' ? Number(exif.latitude.toFixed(6)) : null;
    const longitude = typeof exif?.longitude === 'number' ? Number(exif.longitude.toFixed(6)) : null;
    const takenAt =
      exif?.DateTimeOriginal instanceof Date ? exif.DateTimeOriginal.toISOString().slice(0, 10) : null;
    return { latitude, longitude, takenAt };
  } catch {
    return { latitude: null, longitude: null, takenAt: null };
  }
}

// ---------------------------------------------------------------------------

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error('✗ NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis dans .env.local');
    process.exit(1);
  }

  const supabase = createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: series, error: seriesError } = await supabase
    .from('series')
    .select('id, title')
    .eq('slug', SERIES_SLUG)
    .maybeSingle();
  if (seriesError) throw new Error(`Lecture de la série : ${seriesError.message}`);
  if (!series) throw new Error(`Série introuvable : ${SERIES_SLUG}`);
  console.log(`Série : ${series.title}\n`);

  const { data: maxPositionRow } = await supabase
    .from('photos')
    .select('position')
    .eq('series_id', series.id)
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle();
  let nextPosition = (maxPositionRow?.position ?? 0) + 1;

  let updated = 0;
  let inserted = 0;

  for (const entry of MANIFEST) {
    process.stdout.write(`[${entry.mode}] ${entry.slug} … `);

    const buffer = await readFile(join(SOURCE_DIR, entry.file));
    const { derivatives, width, height, blurDataUrl } = await buildDerivatives(buffer);
    const { latitude, longitude, takenAt } = await readExif(buffer);

    let bwFields: Pick<PhotoInsert, 'bw_image_path' | 'bw_image_width' | 'bw_image_height'> = {
      bw_image_path: null,
      bw_image_width: null,
      bw_image_height: null,
    };

    if (entry.bwFile) {
      const bwBuffer = await readFile(join(SOURCE_DIR, entry.bwFile));
      const bw = await buildDerivatives(bwBuffer);
      if (!dryRun) {
        await uploadDerivatives(supabase, `${entry.slug}/bw`, bw.derivatives);
      }
      bwFields = {
        bw_image_path: `${entry.slug}/bw`,
        bw_image_width: bw.width,
        bw_image_height: bw.height,
      };
    }

    if (dryRun) {
      console.log(
        `simulation — ${derivatives.length} dérivé(s)${entry.bwFile ? ' + N&B' : ''}` +
          `${latitude !== null ? `, GPS ${latitude},${longitude}` : ''}${takenAt ? `, ${takenAt}` : ''}`,
      );
      continue;
    }

    await uploadDerivatives(supabase, entry.slug, derivatives);

    if (entry.mode === 'update') {
      const { error } = await supabase
        .from('photos')
        .update({
          image_path: entry.slug,
          image_width: width,
          image_height: height,
          blur_data_url: blurDataUrl,
          master_filename: entry.file,
          ...bwFields,
        })
        .eq('slug', entry.slug);
      if (error) throw new Error(`Mise à jour de ${entry.slug} : ${error.message}`);
      updated += 1;
      console.log(`mis à jour${entry.bwFile ? ' (+ N&B)' : ''}`);
    } else {
      const row: PhotoInsert = {
        series_id: series.id,
        slug: entry.slug,
        title: entry.title,
        location_name: entry.locationName ?? null,
        country_code: entry.countryCode ?? null,
        latitude,
        longitude,
        taken_at: takenAt,
        image_path: entry.slug,
        image_width: width,
        image_height: height,
        blur_data_url: blurDataUrl,
        master_filename: entry.file,
        position: nextPosition,
        published: true,
        ...bwFields,
      };
      nextPosition += 1;

      const { error } = await supabase.from('photos').upsert(row, { onConflict: 'slug' });
      if (error) throw new Error(`Insertion de ${entry.slug} : ${error.message}`);
      inserted += 1;
      console.log(`créé${entry.bwFile ? ' (+ N&B)' : ''}`);
    }
  }

  if (dryRun) {
    console.log(`\n✓ Simulation terminée (${MANIFEST.length} photo(s)).`);
    return;
  }

  console.log(`\n✓ ${updated} mise(s) à jour, ${inserted} création(s).`);

  // --- Dépublication des photos absentes de la sélection --------------------
  const { error: unpublishError } = await supabase
    .from('photos')
    .update({ published: false })
    .in('slug', ORPHANED_SLUGS);
  if (unpublishError) throw new Error(`Dépublication : ${unpublishError.message}`);
  console.log(`✓ ${ORPHANED_SLUGS.length} photo(s) dépubliée(s).`);
}

main().catch((error: unknown) => {
  console.error('\n✗', error instanceof Error ? error.message : error);
  process.exit(1);
});
