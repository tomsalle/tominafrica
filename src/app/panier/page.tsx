import type { Metadata } from 'next';
import { CartView } from '@/components/cart/CartView';
import { Container } from '@/components/ui/Container';
import { isCheckoutEnabled } from '@/lib/env';

export const metadata: Metadata = {
  title: 'Panier',
  robots: { index: false, follow: false },
};

export default function CartPage() {
  // Évalué côté serveur : le navigateur n'a pas à connaître l'état des clés.
  const checkoutEnabled = isCheckoutEnabled();

  return (
    <div className="pt-32 pb-28 sm:pt-40">
      <Container>
        <h1 className="font-display text-5xl leading-none font-light sm:text-6xl">Panier</h1>

        <div className="mt-16">
          <CartView checkoutEnabled={checkoutEnabled} />
        </div>
      </Container>
    </div>
  );
}
