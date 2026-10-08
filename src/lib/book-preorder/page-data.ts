import 'server-only';

import { getPreorderStepState } from '@/lib/book-preorder/config';
import { getBookPreorderProgress, getPublicContributions, getPublishedTiers } from '@/lib/book-preorder/queries';
import { readSimulation, simulatePreorder } from '@/lib/book-preorder/simulation';
import { isEarlyBirdAvailable, visibleTiers } from '@/lib/book-preorder/tiers';
import type { BookPreorderTierRow } from '@/types/database';

export type BookOffer = {
  /** Palier vendu comme « Le livre » en ce moment : l'early bird tant qu'il en reste. */
  tier: BookPreorderTierRow;
  priceCents: number;
  /** Prix barré (le prix normal du livre) pendant l'early bird. */
  compareAtCents: number | null;
  /** Exemplaires restants au prix early bird. */
  remaining: number | null;
};

export function isTierSoldOut(tier: BookPreorderTierRow): boolean {
  return tier.stock_limit !== null && tier.claimed_count >= tier.stock_limit;
}

/**
 * Données communes aux deux pages de précommande (présentation du livre et
 * choix de la formule). `simulation` : paramètre d'URL, lu en `next dev` seulement.
 */
export async function loadPreorderData(simulationParam: string | string[] | undefined) {
  const simulated = readSimulation(simulationParam);
  const [realTiers, realProgress, realContributions] = await Promise.all([
    getPublishedTiers(),
    getBookPreorderProgress(),
    getPublicContributions(),
  ]);

  const simulation = simulated !== null ? simulatePreorder(simulated) : null;
  const progress = simulation?.progress ?? realProgress;
  const contributions = simulation?.contributions ?? realContributions;
  // En simulation, l'early bird (stock limité) se remplit avec les préventes.
  const tiers =
    simulated !== null
      ? realTiers.map((tier) =>
          tier.stock_limit !== null ? { ...tier, claimed_count: Math.min(tier.stock_limit, simulated) } : tier,
        )
      : realTiers;

  const formulas = visibleTiers(tiers).filter((tier) => !tier.is_donation);
  const donationTier = tiers.find((tier) => tier.is_donation) ?? null;
  const stepState = getPreorderStepState(progress.bookUnitsTotal);

  const earlyBird = tiers.find((tier) => tier.slug === 'early-bird');
  const book = tiers.find((tier) => tier.slug === 'livre');
  let offer: BookOffer | null = null;
  if (earlyBird && isEarlyBirdAvailable(tiers)) {
    offer = {
      tier: earlyBird,
      priceCents: earlyBird.price_cents,
      compareAtCents: book && book.price_cents > earlyBird.price_cents ? book.price_cents : null,
      remaining: earlyBird.stock_limit !== null ? earlyBird.stock_limit - earlyBird.claimed_count : null,
    };
  } else if (book) {
    offer = { tier: book, priceCents: book.price_cents, compareAtCents: null, remaining: null };
  }

  return { simulated, progress, contributions, formulas, donationTier, stepState, offer };
}
