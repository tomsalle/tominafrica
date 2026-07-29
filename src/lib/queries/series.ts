import { createClient } from '@/lib/supabase/server';
import type { PhotoRow, SeriesRow, SeriesWithCover } from '@/types/database';

/**
 * Lectures du catalogue.
 *
 * Toutes ces fonctions utilisent le client soumis à la RLS : le filtrage sur
 * `published` est appliqué par la base, pas seulement par ces requêtes. Un
 * oubli de `.eq('published', true)` ici ne peut donc pas exposer un brouillon.
 */

const SERIES_WITH_COVER = `
  id, slug, title, subtitle, description, location_label,
  cover_photo_id, position, published, created_at, updated_at,
  cover_photo:photos!series_cover_photo_id_fkey (*)
`;

/** Séries publiées, dans l'ordre défini par `position`. Alimente l'accueil. */
export async function getSeriesList(): Promise<SeriesWithCover[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('series')
    .select(SERIES_WITH_COVER)
    .order('position', { ascending: true });

  if (error) throw new Error(`Lecture des séries impossible : ${error.message}`);

  return (data ?? []) as unknown as SeriesWithCover[];
}

/** Une série et ses photos. `null` si le slug n'existe pas ou n'est pas publié. */
export async function getSeriesBySlug(
  slug: string,
): Promise<{ series: SeriesRow; photos: PhotoRow[] } | null> {
  const supabase = await createClient();

  const { data: series, error } = await supabase
    .from('series')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw new Error(`Lecture de la série impossible : ${error.message}`);
  if (!series) return null;

  const { data: photos, error: photosError } = await supabase
    .from('photos')
    .select('*')
    .eq('series_id', series.id)
    .order('position', { ascending: true });

  if (photosError) throw new Error(`Lecture des photos impossible : ${photosError.message}`);

  return { series, photos: photos ?? [] };
}

/**
 * Slugs des séries publiées, pour generateStaticParams et le sitemap.
 *
 * Ne lève jamais : si la base est injoignable au moment du build, on renvoie
 * une liste vide plutôt que de faire échouer le déploiement. Next bascule alors
 * ces pages en rendu à la demande (`dynamicParams` est actif par défaut), et
 * elles sont mises en cache dès la première visite. Une indisponibilité passagère
 * de la base ne doit pas empêcher de déployer.
 */
export async function getAllSeriesSlugs(): Promise<string[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('series').select('slug');

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => row.slug);
  } catch (error) {
    console.warn(
      `[build] catalogue des séries injoignable, prégénération ignorée : ${
        error instanceof Error ? error.message : error
      }`,
    );
    return [];
  }
}
