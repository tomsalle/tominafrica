import 'server-only';

import type { PublicContribution } from '@/lib/book-preorder/queries';

/**
 * Simulation LOCALE de la précommande (`?simulation=72` dans l'URL), pour
 * vérifier l'affichage à chaque étape sans paiement ni écriture en base.
 * Ne fonctionne qu'en `next dev` : en production, le paramètre est ignoré.
 */
export function readSimulation(value: string | string[] | undefined): number | null {
  if (process.env.NODE_ENV !== 'development' || typeof value !== 'string') return null;
  const count = Number.parseInt(value, 10);
  return Number.isFinite(count) && count >= 0 ? Math.min(count, 1000) : null;
}

const SAMPLE: Omit<PublicContribution, 'createdAt'>[] = [
  { publicName: 'Marie', publicMessage: 'Trop hâte de découvrir ce livre, bravo à vous deux !', tierSlug: 'pack-duo', isDonation: false },
  { publicName: null, publicMessage: null, tierSlug: 'livre', isDonation: false },
  { publicName: 'Paul & Léa', publicMessage: 'On sera au vernissage !', tierSlug: 'livre-cartes-postales', isDonation: false },
  { publicName: 'Sophie', publicMessage: null, tierSlug: 'early-bird', isDonation: false },
  { publicName: null, publicMessage: 'Merci pour ces images.', tierSlug: 'don', isDonation: true },
  { publicName: 'Antoine', publicMessage: null, tierSlug: 'pack-soutien', isDonation: false },
];

/** Progression et contributions fictives cohérentes avec `units` livres. */
export function simulatePreorder(units: number) {
  // ~1,2 livre par contribution en moyenne (quelques Pack Duo) ; au moins 1 si > 0.
  const pledgesCount = units === 0 ? 0 : Math.max(1, Math.round(units / 1.2));
  const now = Date.now();
  const contributions: PublicContribution[] = Array.from({ length: Math.min(pledgesCount, 12) }, (_, i) => ({
    ...SAMPLE[i % SAMPLE.length]!,
    createdAt: new Date(now - (i * 7 + 2) * 3_600_000).toISOString(),
  }));

  return {
    progress: { bookUnitsTotal: units, raisedCents: units * 4_000, pledgesCount },
    contributions,
  };
}
