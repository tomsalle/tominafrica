import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ExpositionPopIn } from '@/components/layout/ExpositionPopIn';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { publicEnv } from '@/lib/env';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL),
  title: {
    default: 'Tom in Africa — Photographies et tirages d’art',
    template: '%s — Tom in Africa',
  },
  description:
    'Séries photographiques de Namibie, du Kenya, de Tanzanie et de Madagascar. Tirages d’art en édition limitée et non limitée, réalisés sur papier fine art.',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Tom in Africa',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-dvh antialiased">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
        >
          Aller au contenu
        </a>

        <SiteHeader />
        <main id="contenu">
          {/* Sentinelle observée par le header pour savoir s'il est en haut
              de page (voir SiteHeader) : plus fiable qu'un écouteur de
              scroll, qui s'exécute à chaque frame. */}
          <div id="scroll-sentinel" className="h-px" aria-hidden />
          {children}
        </main>
        <SiteFooter />
        <CartDrawer />
        <ExpositionPopIn />
      </body>
    </html>
  );
}
