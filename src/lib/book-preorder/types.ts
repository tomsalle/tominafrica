import { z } from 'zod';

/**
 * Ce que l'API de précommande du livre accepte — volontairement réduit au
 * minimum, même principe que `checkoutRequestSchema` (src/lib/cart/types.ts) :
 * le client n'envoie qu'un identifiant de palier et une quantité. Le prix est
 * toujours relu en base côté serveur, jamais fait confiance au client.
 *
 * `customAmountCents` n'a de sens que pour le palier « Don » (montant libre) —
 * la route rejette toute valeur envoyée pour un autre palier.
 */
export const bookPreorderCheckoutRequestSchema = z.object({
  tierId: z.uuid(),
  quantity: z.number().int().min(1).max(10).default(1),
  customAmountCents: z.number().int().min(100).max(1_000_000).optional(),
  locale: z.enum(['fr', 'en']).optional(),
  // Affichés publiquement dans la liste des contributions — facultatifs.
  publicName: z.string().trim().max(60).optional(),
  publicMessage: z.string().trim().max(280).optional(),
});

export type BookPreorderCheckoutRequest = z.infer<typeof bookPreorderCheckoutRequestSchema>;
