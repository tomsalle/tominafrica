import type { MetadataRoute } from 'next';
import { publicEnv } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Ni le panier ni les pages de commande n'ont vocation à être indexés,
      // dans aucune langue.
      disallow: ['/panier', '/en/panier', '/commande/', '/en/commande/', '/api/'],
    },
    sitemap: `${publicEnv.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
