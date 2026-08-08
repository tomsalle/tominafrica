import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { CartView } from '@/components/cart/CartView';
import { Container } from '@/components/ui/Container';
import { isCheckoutEnabled } from '@/lib/env';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'panier' });
  return { title: t('title'), robots: { index: false, follow: false } };
}

export default async function CartPage() {
  const t = await getTranslations('panier');
  // Évalué côté serveur : le navigateur n'a pas à connaître l'état des clés.
  const checkoutEnabled = isCheckoutEnabled();

  return (
    <div className="pt-32 pb-28 sm:pt-40">
      <Container>
        <h1 className="font-display text-5xl leading-none font-light sm:text-6xl">
          {t('title')}
        </h1>

        <div className="mt-16">
          <Suspense fallback={<div className="h-64 animate-pulse bg-ink-soft" aria-hidden />}>
            <CartView checkoutEnabled={checkoutEnabled} />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}
