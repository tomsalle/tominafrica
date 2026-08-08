import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { hasLocale } from 'next-intl';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ExpositionPopIn } from '@/components/layout/ExpositionPopIn';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { languageAlternates } from '@/i18n/alternates';
import { routing, type Locale } from '@/i18n/routing';
import { publicEnv } from '@/lib/env';
import '../globals.css';

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

const OG_LOCALE: Record<Locale, string> = { fr: 'fr_FR', en: 'en_US' };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const otherLocales = routing.locales.filter((l) => l !== locale);

  return {
    metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL),
    title: {
      default: t('title'),
      template: `%s — ${t('siteName')}`,
    },
    description: t('description'),
    alternates: { languages: languageAlternates('/') },
    openGraph: {
      type: 'website',
      locale: OG_LOCALE[locale as Locale],
      alternateLocale: otherLocales.map((l) => OG_LOCALE[l as Locale]),
      siteName: t('siteName'),
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations('layout');

  return (
    <html lang={locale} className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-dvh antialiased">
        <NextIntlClientProvider>
          <a
            href="#contenu"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
          >
            {t('skipToContent')}
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
