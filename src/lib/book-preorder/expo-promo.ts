import 'server-only';

import { randomInt } from 'node:crypto';

// Sans 0/O ni 1/I/L : le code se lit à voix haute ou sur un écran sans confusion.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/**
 * Code offert à chaque achat (livre ou formule) : -10 % sur un tirage photo
 * acheté sur place, à l'exposition uniquement. Un code unique par précommande.
 */
export function generateExpoPromoCode(): string {
  let suffix = '';
  for (let i = 0; i < 6; i += 1) suffix += ALPHABET[randomInt(ALPHABET.length)];
  return `EXPO10-${suffix}`;
}
