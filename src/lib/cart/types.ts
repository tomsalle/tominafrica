import { z } from 'zod';

/**
 * Le panier vit dans le navigateur (localStorage).
 *
 * Il contient deux natures de données, à ne pas confondre :
 *
 *  - `optionId` et `quantity` : la seule information qui fait autorité. C'est
 *    tout ce qui est envoyé au serveur lors du passage en caisse.
 *
 *  - le reste (titre, libellé, prix, visuel) : un simple instantané d'affichage,
 *    pour que la page panier se rende immédiatement sans aller-retour réseau.
 *    Il n'est JAMAIS utilisé pour calculer un montant réel : le serveur relit
 *    les prix en base avant de créer la session Stripe. Un panier trafiqué ne
 *    peut donc pas changer le prix payé, seulement l'affichage local.
 */

export const cartItemSchema = z.object({
  optionId: z.uuid(),
  quantity: z.number().int().min(1).max(10),

  // Instantané d'affichage
  photoSlug: z.string(),
  photoTitle: z.string(),
  imagePath: z.string(),
  optionLabel: z.string(),
  unitPriceCents: z.number().int().positive(),
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const cartSchema = z.array(cartItemSchema);

/** Ce que l'API de checkout accepte — volontairement réduit au minimum. */
export const checkoutRequestSchema = z.object({
  items: z
    .array(
      z.object({
        optionId: z.uuid(),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1, 'Le panier est vide')
    .max(20, 'Trop d’articles dans le panier'),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

export function cartSubtotalCents(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
