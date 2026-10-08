import 'server-only';

import { randomInt } from 'node:crypto';
import { createAdminClient } from '@/lib/supabase/admin';

// Sans 0/O ni 1/I/L : le code se lit à voix haute ou sur un écran sans confusion.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export const EXPO_PROMO_PERCENT = 10;

// Annoncé « à l'exposition », mais aussi accepté au panier du site jusqu'au
// 31 décembre 2026 inclus (heure de Paris).
const EXPO_PROMO_ONLINE_UNTIL = new Date('2027-01-01T00:00:00+01:00');

/**
 * Code offert à chaque achat (livre ou formule) : -10 % sur un tirage photo.
 * Un code unique par précommande, utilisable une fois.
 */
export function generateExpoPromoCode(): string {
  let suffix = '';
  for (let i = 0; i < 6; i += 1) suffix += ALPHABET[randomInt(ALPHABET.length)];
  return `EXPO10-${suffix}`;
}

export function normalizeExpoPromoCode(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, '');
}

/** Le code existe, vient d'une précommande payée, n'a pas servi et n'a pas expiré. */
export async function isExpoPromoCodeRedeemable(code: string): Promise<boolean> {
  if (Date.now() >= EXPO_PROMO_ONLINE_UNTIL.getTime()) return false;

  const { data } = await createAdminClient()
    .from('book_preorder_pledges')
    .select('id')
    .eq('expo_promo_code', code)
    .eq('status', 'paid')
    .is('expo_promo_redeemed_at', null)
    .maybeSingle();

  return data !== null;
}

/** Marque le code comme utilisé (après un paiement confirmé par Stripe). */
export async function redeemExpoPromoCode(code: string): Promise<void> {
  const { error } = await createAdminClient()
    .from('book_preorder_pledges')
    .update({ expo_promo_redeemed_at: new Date().toISOString() })
    .eq('expo_promo_code', code)
    .is('expo_promo_redeemed_at', null);

  if (error) console.error(`[expo-promo] impossible de marquer ${code} comme utilisé : ${error.message}`);
}
