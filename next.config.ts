import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    // Les dérivés sont pré-générés à l'import (script sharp) et servis tels
    // quels par le CDN Supabase. On utilise donc un loader personnalisé
    // (src/lib/image-loader.ts) plutôt que l'optimiseur Vercel : aucune
    // transformation facturée, et le CDN sert directement le bon fichier.
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
    remotePatterns: supabaseHost
      ? [{ protocol: 'https', hostname: supabaseHost, pathname: '/storage/v1/object/public/**' }]
      : [],
    formats: ['image/avif', 'image/webp'],
  },

  // Photos de l'expo renommées le 20/11/2026 (avant l'impression des QR
  // codes) : les anciennes adresses mènent toujours à la bonne page.
  async redirects() {
    const renamed: [string, string][] = [
      ['benin', 'kandji'], ['la-cabine', 'yellow-cabine'], ['le-chapeau-de-paille', 'kodjo'],
      ['sous-la-feuille', 'ekoue'], ['silhouette-bleue', 'ayawa'], ['le-palmier', 'on-a-joue-ensemble'],
      ['robe-blanche', 'kemi'], ['la-cour', 'retour-du-marche'], ['dsf9479', 'hacen'],
      ['dsf9016', 'sur-la-colline'], ['ruine', 'devant-la-fenetre'], ['turban', 'blase'],
      ['dsf9605', 'sekou'], ['dsf9045', 'yao'], ['le-passant-au-bonnet-bleu', 'l-attente'],
      ['la-maisonnette-dans-le-desert', 'sirocco'], ['la-fenetre-en-ruine', 'tu-passais-par-la'],
      ['double-exposition', 'amy-sow'], ['les-choristes', 'la-chorale'],
    ];
    return [
      // L'adresse technique de Vercel mène au vrai domaine : Google ne doit
      // connaître qu'une seule adresse par page. Sauf /api : les webhooks
      // (Stripe…) peuvent viser cette adresse et ne suivent pas de redirection.
      {
        source: '/:path((?!api/).*)',
        has: [{ type: 'host' as const, value: 'tominafrica.vercel.app' }],
        destination: 'https://www.tominafrica.com/:path',
        permanent: true,
      },
      ...renamed.flatMap(([from, to]) => [
        { source: `/photo/${from}`, destination: `/photo/${to}`, permanent: true },
        { source: `/en/photo/${from}`, destination: `/en/photo/${to}`, permanent: true },
      ]),
    ];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
