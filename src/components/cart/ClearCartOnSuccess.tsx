'use client';

import { useEffect } from 'react';
import { clearCart, useCartHydrated } from '@/lib/cart/store';

/**
 * Vide le panier à l'arrivée sur la page de confirmation.
 *
 * C'est le webhook Stripe qui fait foi pour la commande ; ce composant ne
 * s'occupe que de l'état local du navigateur. `clearCart` agit sur le magasin
 * externe, pas sur un état React — d'où l'absence de setState ici.
 */
export function ClearCartOnSuccess() {
  const hydrated = useCartHydrated();

  useEffect(() => {
    if (hydrated) clearCart();
  }, [hydrated]);

  return null;
}
