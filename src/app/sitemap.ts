import type { MetadataRoute } from 'next';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { publicEnv } from '@/lib/env';
import { getAllPhotoSlugs } from '@/lib/queries/photos';
import { getAllSeriesSlugs } from '@/lib/queries/series';

// Rafraîchi toutes les 10 minutes : les photos de l'expo y entrent le soir du vernissage.
export const revalidate = 600;

/** Entrée bilingue : une URL par langue, avec les alternates hreflang qui vont avec. */
function bilingualEntry(
  base: string,
  href: string,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
  priority: number,
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, `${base}${getPathname({ locale, href })}`]),
  );

  return routing.locales.map((locale) => ({
    url: languages[locale] as string,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = publicEnv.NEXT_PUBLIC_SITE_URL;
  const [seriesSlugs, photoSlugs] = await Promise.all([getAllSeriesSlugs(), getAllPhotoSlugs()]);

  return [
    // Pages traduites : une entrée fr + une entrée en, liées entre elles.
    ...bilingualEntry(base, '/', 'monthly', 1),
    ...bilingualEntry(base, '/notre-aventure', 'monthly', 0.9),
    ...bilingualEntry(base, '/notre-aventure/exposition', 'weekly', 0.9),
    ...bilingualEntry(base, '/precommande-livre', 'weekly', 0.9),
    ...bilingualEntry(base, '/precommande-livre/formules', 'weekly', 0.8),
    ...bilingualEntry(base, '/videos', 'monthly', 0.5),

    // Galerie et fiches photo : traduites aussi (récits en français et en anglais).
    ...seriesSlugs.flatMap((slug) => bilingualEntry(base, `/series/${slug}`, 'weekly', 0.8)),
    ...photoSlugs.flatMap((slug) => bilingualEntry(base, `/photo/${slug}`, 'monthly', 0.7)),

    // Pages légales : uniquement en français.
    { url: `${base}/mentions-legales`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/cgv`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/confidentialite`, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
