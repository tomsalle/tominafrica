import type { MetadataRoute } from 'next';
import { publicEnv } from '@/lib/env';
import { getAllPhotoSlugs } from '@/lib/queries/photos';
import { getAllSeriesSlugs } from '@/lib/queries/series';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = publicEnv.NEXT_PUBLIC_SITE_URL;
  const [seriesSlugs, photoSlugs] = await Promise.all([getAllSeriesSlugs(), getAllPhotoSlugs()]);

  return [
    { url: base, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/a-propos`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/mentions-legales`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/cgv`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/confidentialite`, changeFrequency: 'yearly', priority: 0.2 },
    ...seriesSlugs.map((slug) => ({
      url: `${base}/series/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...photoSlugs.map((slug) => ({
      url: `${base}/photo/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
