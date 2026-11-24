/**
 * Tirages de l'exposition « 1 Mère, 1 Fils, 1 Rêve » (vernissage le
 * 27 novembre 2026) : les photos accrochées à l'expo, en vente sur le site
 * aux prix de l'affiche « Les tirages ».
 *
 *   npx tsx scripts/import-expo-tirages.ts [--dry-run] [--seul=slug]
 *
 * - Les photos déjà au catalogue gardent leur fiche ; seul le nom du fichier
 *   haute définition (master_filename) est aligné sur ~/Desktop/SELECTION EXPO.
 * - Les nouvelles sont importées (dérivés avif 480/960/1600/2400), masquées.
 * - Pour toutes : les anciens formats sont remplacés par ceux de l'affiche.
 *   Format carré pour les photos carrées, format 2:3 pour les autres.
 *
 * Rien n'est publié ici : la mise en ligne se fait à part, le jour J.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import exifr from 'exifr';
import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import type { Database, PhotoInsert } from '../src/types/database';

config({ path: '.env.local', quiet: true });

const SOURCE_DIR = join(homedir(), 'Desktop', 'SELECTION EXPO');
const SERIES_SLUG = '1-mere-1-fils-1-reve';
const DERIVATIVE_WIDTHS = [480, 960, 1600, 2400];
const PAPER = 'Hahnemühle Bright White 310g';

// Prix de l'affiche « Les tirages » (TTC, en centimes), revus par Tom le
// 23/11/2026 ; le 30 × 30 est retiré. Éditions limitées (24/11/2026) :
// 30 exemplaires pour le petit format, 15 pour le moyen, 10 pour le grand.
const FORMATS = {
  normal: [
    { w: 20, h: 30, price: 6800, edition: 30 },
    { w: 40, h: 60, price: 23000, edition: 15 },
    { w: 60, h: 90, price: 42000, edition: 10 },
  ],
  square: [
    { w: 40, h: 40, price: 19000, edition: 30 },
    { w: 60, h: 60, price: 38000, edition: 15 },
    { w: 80, h: 80, price: 48000, edition: 10 },
  ],
} as const;

type Entry = {
  slug: string;
  /** Fichier HD dans SELECTION EXPO (null : photo déjà en ligne sans fichier local). */
  file: string | null;
  square?: boolean;
  /** Régénère les dérivés web depuis le fichier HD (photo existante). */
  refresh?: boolean;
  /** Dossier des dérivés (par défaut le slug) : un nouveau nom évite de servir l'ancienne image en cache. */
  imagePath?: string;
  /** Présent = nouvelle photo à importer. */
  create?: { title: string; blackAndWhite?: boolean };
};

const EXPO: Entry[] = [
  // --- déjà au catalogue ---------------------------------------------------
  { slug: 'habi', file: 'MAROC2O25370.jpg', square: true },
  { slug: 'kandji', file: 'Bénin2O25285.jpg', square: true },
  { slug: 'yellow-cabine', file: '_DSF9727.jpeg' },
  { slug: 'kodjo', file: '_DSF9647.jpeg' },
  { slug: 'nene', file: '_DSF9254.jpeg' },
  { slug: 'ekoue', file: '_DSF9038.jpeg' },
  { slug: 'ayawa', file: 'Silhouette.jpg' },
  { slug: 'les-jumelles', file: 'Les jumelles - Togo.JPG' },
  { slug: 'on-a-joue-ensemble', file: "Le palmier - Cote D'ivoire.JPG" },
  { slug: 'kemi', file: '_DSF9956.jpeg' },
  { slug: 'retour-du-marche', file: '_DSF9151.jpeg' },
  // Pas de fichier HD dans SELECTION EXPO : seuls ses formats sont gérés ici.
  { slug: 'les-maillots-rouges', file: null, square: true },
  { slug: 'hacen', file: '_DSF9479.jpg' },
  { slug: 'sur-la-colline', file: '_DSF9016.jpg' },
  // Le dérivé en ligne ne faisait que 960 px : on le régénère depuis la HD.
  { slug: 'devant-la-fenetre', file: "Ruine - Cote d'Ivoire.png", refresh: true, imagePath: 'ruine' },
  // Photo remplacée le 24/11 (fichier de 1 500 px envoyé par Tom).
  { slug: 'blase', file: 'Blase - Togo.jpg', refresh: true, imagePath: 'blase' },
  { slug: 'sekou', file: '_DSF9605.jpg' }, // Sékou
  { slug: 'yao', file: '_DSF9045.jpg' }, // Yao
  // Version noir et blanc tirée pour l'expo : remplace l'image couleur.
  { slug: 'les-chanteuses', file: 'La chorale NB - Angola.jpg', refresh: true, imagePath: 'la-chorale-nb' },

  // --- nouvelles -------------------------------------------------------------
  { slug: 'la-foret-rose', file: '2093-04-1.jpeg', square: true, create: { title: 'La forêt rose' } },
  { slug: 'l-attente', file: '_DSF9489.jpeg', create: { title: 'Le passant au bonnet bleu' } },
  { slug: 'sirocco', file: '_DSF9466.jpeg', create: { title: 'La maisonnette dans le désert' } },
  { slug: 'aissata', file: '_DSF9225.jpeg', create: { title: 'Aïssata' } },
  { slug: 'tu-passais-par-la', file: '_DSF9204NB.jpeg', create: { title: 'La fenêtre en ruine', blackAndWhite: true } },
  { slug: 'le-foulard-rouge', file: '_DSF9638.jpeg', create: { title: 'Le foulard rouge' } },
  // Envoyées par Tom le 18/11 (fichiers de 2000 px, suffisants pour le site).
  { slug: 'samba', file: 'Samba - Paris.jpg', create: { title: 'Samba' } },
  { slug: 'ruben', file: 'Ruben - Paris.jpg', square: true, create: { title: 'Ruben' } },
  { slug: 'amy-sow', file: 'Double exposition.jpg', square: true, create: { title: 'Double exposition' } },
  { slug: 'la-chorale', file: 'Les choristes NB - Angola.jpg', create: { title: 'Les choristes', blackAndWhite: true } },
  // Envoyée par Tom le 24/11 (fichier de 1 426 px).
  { slug: 'le-voisin-du-garagiste', file: "Le voisin du garagiste - Cote d'Ivoire.webp", create: { title: 'Le voisin du garagiste' } },
];

// ---------------------------------------------------------------------------

async function buildDerivatives(buffer: Buffer) {
  const sourceWidth = (await sharp(buffer, { failOn: 'none' }).rotate().metadata()).width ?? 0;
  const derivatives: { width: number; body: Buffer }[] = [];
  for (const width of DERIVATIVE_WIDTHS) {
    // Léger agrandissement toléré (×1,25 au plus) : un fichier de 1 339 px
    // donne ainsi un dérivé de 1 600 px au lieu de s'arrêter à 960.
    if (sourceWidth > 0 && width > sourceWidth * 1.25 && width !== DERIVATIVE_WIDTHS[0]) continue;
    const body = await sharp(buffer, { failOn: 'none' })
      .rotate()
      .resize({ width })
      .toColorspace('srgb')
      .avif({ quality: 78, effort: 4 })
      .toBuffer();
    derivatives.push({ width, body });
  }
  const blur = await sharp(buffer, { failOn: 'none' }).rotate().resize({ width: 16 }).webp({ quality: 55 }).toBuffer();
  const largestMeta = await sharp(derivatives.at(-1)!.body).metadata();
  return {
    derivatives,
    width: largestMeta.width ?? null,
    height: largestMeta.height ?? null,
    blurDataUrl: `data:image/webp;base64,${blur.toString('base64')}`,
  };
}

async function uploadDerivatives(
  supabase: ReturnType<typeof createClient<Database>>,
  slug: string,
  derivatives: { width: number; body: Buffer }[],
) {
  for (const d of derivatives) {
    const { error } = await supabase.storage
      .from('photos')
      .upload(`${slug}/${d.width}.avif`, d.body, { contentType: 'image/avif', cacheControl: '31536000', upsert: true });
    if (error) throw new Error(`Téléversement ${slug}/${d.width} : ${error.message}`);
  }
}

async function readExif(buffer: Buffer) {
  try {
    const exif = await exifr.parse(buffer, { gps: true, pick: ['DateTimeOriginal'] });
    return {
      latitude: typeof exif?.latitude === 'number' ? Number(exif.latitude.toFixed(6)) : null,
      longitude: typeof exif?.longitude === 'number' ? Number(exif.longitude.toFixed(6)) : null,
      takenAt: exif?.DateTimeOriginal instanceof Date ? exif.DateTimeOriginal.toISOString().slice(0, 10) : null,
    };
  } catch {
    return { latitude: null, longitude: null, takenAt: null };
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error('NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis dans .env.local');

  const supabase = createClient<Database>(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

  const { data: series } = await supabase.from('series').select('id').eq('slug', SERIES_SLUG).single();
  if (!series) throw new Error(`Série introuvable : ${SERIES_SLUG}`);
  const { data: last } = await supabase
    .from('photos')
    .select('position')
    .order('position', { ascending: false })
    .limit(1)
    .single();
  let nextPosition = (last?.position ?? 0) + 1;

  const only = process.argv.find((arg) => arg.startsWith('--seul='))?.slice('--seul='.length);
  const entries = only ? EXPO.filter((entry) => entry.slug === only) : EXPO;
  if (only && entries.length === 0) throw new Error(`Photo inconnue : ${only}`);

  for (const entry of entries) {
    process.stdout.write(`${entry.create ? '[nouvelle]' : '[existante]'} ${entry.slug} … `);
    const buffer = entry.file ? await readFile(join(SOURCE_DIR, entry.file)) : null;
    if (!buffer && (entry.create || entry.refresh)) throw new Error(`Fichier HD requis pour ${entry.slug}`);

    // Déjà importée lors d'un passage précédent : on garde sa fiche (titre,
    // date, pays corrigés à la main) et on ne touche qu'aux formats.
    const { data: existing } = await supabase.from('photos').select('id').eq('slug', entry.slug).maybeSingle();

    let photoId: string;
    if (entry.create && !existing) {
      const { derivatives, width, height, blurDataUrl } = await buildDerivatives(buffer!);
      const { latitude, longitude, takenAt } = await readExif(buffer!);
      if (dryRun) {
        console.log(`simulation — ${derivatives.length} dérivé(s), ${width}×${height}${takenAt ? `, ${takenAt}` : ''}`);
        continue;
      }
      await uploadDerivatives(supabase, entry.slug, derivatives);
      const row: PhotoInsert = {
        series_id: series.id,
        slug: entry.slug,
        title: entry.create.title,
        latitude,
        longitude,
        taken_at: takenAt,
        image_path: entry.slug,
        image_width: width,
        image_height: height,
        blur_data_url: blurDataUrl,
        master_filename: entry.file!,
        is_black_and_white: entry.create.blackAndWhite ?? false,
        position: nextPosition++,
        published: false,
      };
      const { data, error } = await supabase.from('photos').upsert(row, { onConflict: 'slug' }).select('id').single();
      if (error || !data) throw new Error(`Insertion de ${entry.slug} : ${error?.message}`);
      photoId = data.id;
    } else {
      const { data, error } = await supabase.from('photos').select('id').eq('slug', entry.slug).single();
      if (error || !data) throw new Error(`Photo introuvable : ${entry.slug}`);
      if (dryRun) {
        console.log('simulation — fichier vérifié');
        continue;
      }
      let imageFields = {};
      if (entry.refresh) {
        const { derivatives, width, height, blurDataUrl } = await buildDerivatives(buffer!);
        const imagePath = entry.imagePath ?? entry.slug;
        await uploadDerivatives(supabase, imagePath, derivatives);
        imageFields = { image_path: imagePath, image_width: width, image_height: height, blur_data_url: blurDataUrl };
      }
      const { error: updateError } = await supabase
        .from('photos')
        .update({ ...(entry.file ? { master_filename: entry.file } : {}), ...imageFields })
        .eq('id', data.id);
      if (updateError) throw new Error(`Mise à jour de ${entry.slug} : ${updateError.message}`);
      photoId = data.id;
    }

    // Formats de l'affiche, à la place des anciens.
    const { error: deleteError } = await supabase.from('print_options').delete().eq('photo_id', photoId);
    if (deleteError) throw new Error(`Suppression des anciens formats de ${entry.slug} : ${deleteError.message}`);
    const formats = entry.square ? FORMATS.square : FORMATS.normal;
    const { error: insertError } = await supabase.from('print_options').insert(
      formats.map((f, index) => ({
        photo_id: photoId,
        sku: `${entry.slug.toUpperCase()}-${f.w}X${f.h}`,
        label: `${f.w} × ${f.h} cm`,
        width_cm: f.w,
        height_cm: f.h,
        paper: PAPER,
        framed: false,
        price_cents: f.price,
        edition_size: f.edition,
        position: index + 1,
      })),
    );
    if (insertError) throw new Error(`Formats de ${entry.slug} : ${insertError.message}`);
    console.log(`${formats.length} formats${entry.square ? ' (carré)' : ''}`);
  }

  console.log(`\n✓ ${entries.length} photo(s) prête(s)${dryRun ? ' (simulation)' : ''}.`);
}

main().catch((error: unknown) => {
  console.error('\n✗', error instanceof Error ? error.message : error);
  process.exit(1);
});
