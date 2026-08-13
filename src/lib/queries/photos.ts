import { createClient } from '@/lib/supabase/server';
import type { PhotoRow, PhotoWithMinPrice, PhotoWithOptions, PrintOptionRow } from '@/types/database';

const PHOTO_WITH_OPTIONS = `
  *,
  series:series!photos_series_id_fkey (id, slug, title),
  print_options (*)
`;

/** Une photo, sa série et ses options de tirage. Alimente la page produit. */
export async function getPhotoBySlug(slug: string): Promise<PhotoWithOptions | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('photos')
    .select(PHOTO_WITH_OPTIONS)
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw new Error(`Lecture de la photo impossible : ${error.message}`);
  if (!data) return null;

  const photo = data as unknown as PhotoWithOptions;

  // Postgrest ne garantit pas l'ordre des relations imbriquées : on trie ici.
  photo.print_options = [...(photo.print_options ?? [])]
    .filter((option) => option.available)
    .sort((a, b) => a.position - b.position || a.price_cents - b.price_cents);

  return photo;
}

/** Photos d'une même série, hors celle affichée. Alimente « À voir aussi ». */
export async function getRelatedPhotos(
  seriesId: string | null,
  excludePhotoId: string,
  limit = 3,
): Promise<PhotoWithMinPrice[]> {
  if (!seriesId) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('photos')
    .select('*, print_options (*)')
    .eq('series_id', seriesId)
    .neq('id', excludePhotoId)
    .order('position', { ascending: true })
    .limit(limit);

  if (error) throw new Error(`Lecture des photos liées impossible : ${error.message}`);

  return (data ?? []).map((row) => {
    const { print_options, ...photo } = row as unknown as PhotoRow & {
      print_options: { price_cents: number; available: boolean }[];
    };
    const availablePrices = print_options.filter((o) => o.available).map((o) => o.price_cents);
    return { ...photo, minPriceCents: availablePrices.length > 0 ? Math.min(...availablePrices) : null };
  });
}

/**
 * Slugs des photos publiées, pour generateStaticParams et le sitemap.
 *
 * Ne lève jamais — voir getAllSeriesSlugs() pour le raisonnement.
 */
export async function getAllPhotoSlugs(): Promise<string[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('photos').select('slug');

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => row.slug);
  } catch (error) {
    console.warn(
      `[build] catalogue des photos injoignable, prégénération ignorée : ${
        error instanceof Error ? error.message : error
      }`,
    );
    return [];
  }
}

/**
 * Recharge les options de tirage depuis la base à partir de leurs identifiants.
 *
 * ⚠️ Point de sécurité central du checkout : le panier vit dans le navigateur
 * et ne contient QUE des identifiants et des quantités. Les prix, libellés et
 * disponibilités sont systématiquement relus ici, côté serveur, avant de créer
 * la session de paiement. Un panier client ne dicte jamais un prix.
 */
export async function getPrintOptionsByIds(
  ids: string[],
): Promise<
  Map<string, PrintOptionRow & { photo: Pick<PhotoRow, 'id' | 'slug' | 'title' | 'image_path' | 'image_width'> }>
> {
  const result = new Map<
    string,
    PrintOptionRow & { photo: Pick<PhotoRow, 'id' | 'slug' | 'title' | 'image_path' | 'image_width'> }
  >();

  if (ids.length === 0) return result;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('print_options')
    .select('*, photo:photos!print_options_photo_id_fkey (id, slug, title, image_path, image_width)')
    .in('id', ids);

  if (error) throw new Error(`Lecture des options de tirage impossible : ${error.message}`);

  for (const row of data ?? []) {
    const option = row as unknown as PrintOptionRow & {
      photo: Pick<PhotoRow, 'id' | 'slug' | 'title' | 'image_path' | 'image_width'> | null;
    };
    // Une option dont la photo a été dépubliée n'est plus visible via la RLS,
    // mais on se protège aussi du cas où la jointure ne remonte rien.
    if (option.photo) {
      result.set(option.id, { ...option, photo: option.photo });
    }
  }

  return result;
}
