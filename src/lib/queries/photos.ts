import { catalogClient, visibleInCatalog } from '@/lib/catalog-preview';
import { createClient } from '@/lib/supabase/server';
import type { PhotoRow, PhotoWithOptions, PrintOptionRow } from '@/types/database';

const PHOTO_WITH_OPTIONS = `
  *,
  series:series!photos_series_id_fkey (id, slug, title),
  print_options (*)
`;

/** Une photo, sa série et ses options de tirage. Alimente la page produit. */
export async function getPhotoBySlug(slug: string): Promise<PhotoWithOptions | null> {
  const supabase = await catalogClient();

  const { data, error } = await supabase
    .from('photos')
    .select(PHOTO_WITH_OPTIONS)
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw new Error(`Lecture de la photo impossible : ${error.message}`);
  if (!data) return null;

  const photo = data as unknown as PhotoWithOptions;
  if (!visibleInCatalog(photo)) return null;

  // Postgrest ne garantit pas l'ordre des relations imbriquées : on trie ici.
  photo.print_options = [...(photo.print_options ?? [])]
    .filter((option) => option.available)
    .sort((a, b) => a.position - b.position || a.price_cents - b.price_cents);

  return photo;
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

export type JourneyPhoto = Pick<
  PhotoRow,
  'id' | 'slug' | 'title' | 'image_path' | 'image_width' | 'image_height' | 'blur_data_url' | 'taken_at' | 'country_code' | 'location_name'
>;

/**
 * Photos visibles dans l'ordre chronologique du voyage (les photos sans date
 * en dernier). Sert à la séquence de l'accueil et à la navigation
 * « jour précédent / jour suivant » de la page photo.
 */
export async function getJourneyPhotos(): Promise<JourneyPhoto[]> {
  const supabase = await catalogClient();

  const { data, error } = await supabase
    .from('photos')
    .select(
      'id, slug, title, image_path, image_width, image_height, blur_data_url, taken_at, country_code, location_name, published, position, print_options (available)',
    )
    .order('taken_at', { ascending: true, nullsFirst: false })
    .order('position', { ascending: true });

  if (error) throw new Error(`Lecture du parcours impossible : ${error.message}`);

  return (data ?? []).filter(visibleInCatalog).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    image_path: row.image_path,
    image_width: row.image_width,
    image_height: row.image_height,
    blur_data_url: row.blur_data_url,
    taken_at: row.taken_at,
    country_code: row.country_code,
    location_name: row.location_name,
  }));
}
