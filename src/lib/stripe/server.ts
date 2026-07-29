import 'server-only';

import Stripe from 'stripe';
import { serverEnv } from '@/lib/env';

/**
 * Client Stripe.
 *
 * Choix de Stripe Checkout plutôt que Payment Element : la page de paiement est
 * hébergée par Stripe, ce qui place la boutique en SAQ-A (le niveau de
 * conformité PCI le plus léger — aucune donnée de carte ne transite par ce
 * serveur). Checkout apporte aussi nativement la collecte d'adresse de
 * livraison, les frais de port par zone, Apple Pay / Google Pay / Link, et
 * Stripe Tax le jour où la TVA devient applicable.
 *
 * Instancié paresseusement : le site doit démarrer et se construire sans clé
 * Stripe (voir isCheckoutEnabled()).
 */
let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (cached) return cached;

  const { STRIPE_SECRET_KEY } = serverEnv();

  if (!STRIPE_SECRET_KEY) {
    throw new Error(
      "STRIPE_SECRET_KEY n'est pas configurée. Ajoute-la à .env.local " +
        '(Dashboard Stripe → Développeurs → Clés API) pour activer le paiement.',
    );
  }

  cached = new Stripe(STRIPE_SECRET_KEY, {
    typescript: true,
    appInfo: { name: 'Tom in Africa', url: 'https://tominafrica.com' },
  });

  return cached;
}

/**
 * Frais de port.
 *
 * Valeurs provisoires : à ajuster une fois les tarifs transporteur connus.
 * Les tirages partent sous tube rigide, dont le coût dépend surtout du format.
 */
export const SHIPPING_OPTIONS: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [
  {
    shipping_rate_data: {
      type: 'fixed_amount',
      fixed_amount: { amount: 1200, currency: 'eur' },
      display_name: 'France — Colissimo suivi',
      delivery_estimate: {
        minimum: { unit: 'business_day', value: 5 },
        maximum: { unit: 'business_day', value: 10 },
      },
    },
  },
  {
    shipping_rate_data: {
      type: 'fixed_amount',
      fixed_amount: { amount: 2500, currency: 'eur' },
      display_name: 'Union européenne — suivi et assuré',
      delivery_estimate: {
        minimum: { unit: 'business_day', value: 8 },
        maximum: { unit: 'business_day', value: 15 },
      },
    },
  },
];

/** Pays de livraison acceptés. À élargir selon les destinations souhaitées. */
export const SHIPPING_COUNTRIES: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] =
  ['FR', 'BE', 'CH', 'LU', 'DE', 'ES', 'IT', 'NL', 'PT', 'AT', 'IE'];
