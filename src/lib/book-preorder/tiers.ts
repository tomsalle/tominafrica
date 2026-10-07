import type { BookPreorderTierRow } from '@/types/database';

/**
 * Règle de Tom : tant que l'early bird a du stock, c'est la seule offre « livre
 * seul » visible ; « Le livre » n'apparaît qu'une fois l'early bird épuisé (qui
 * reste alors affiché, marqué épuisé). La même règle s'applique au paiement.
 */
export function isEarlyBirdAvailable(tiers: BookPreorderTierRow[]): boolean {
  const earlyBird = tiers.find((tier) => tier.slug === 'early-bird');
  if (!earlyBird) return false;
  return earlyBird.stock_limit === null || earlyBird.claimed_count < earlyBird.stock_limit;
}

export function visibleTiers(tiers: BookPreorderTierRow[]): BookPreorderTierRow[] {
  const hideBook = isEarlyBirdAvailable(tiers);
  return tiers.filter((tier) => !(hideBook && tier.slug === 'livre'));
}
