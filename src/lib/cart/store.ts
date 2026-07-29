'use client';

import { useSyncExternalStore } from 'react';
import { cartSchema, cartCount, cartSubtotalCents, type CartItem } from '@/lib/cart/types';

/**
 * Panier — magasin externe, hors de React.
 *
 * Le panier est un état partagé par le header (compteur), le tiroir, la page
 * panier et le bouton d'ajout. `useSyncExternalStore` est l'outil prévu pour
 * ça : chaque composant s'abonne directement, sans provider ni effet de
 * synchronisation.
 *
 * C'est aussi ce qui règle proprement l'hydratation. React rend d'abord
 * l'instantané serveur (panier vide — le serveur ne connaît évidemment pas le
 * localStorage), puis bascule immédiatement sur l'instantané client. Aucun
 * écart d'hydratation possible, et aucun `setState` dans un `useEffect`.
 */

const STORAGE_KEY = 'tominafrica.cart.v1';

/** Référence stable : `getSnapshot` doit renvoyer la même identité tant que rien ne change. */
const EMPTY: CartItem[] = [];

let items: CartItem[] = EMPTY;
let isOpen = false;
let loaded = false;

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function readStorage(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;

    // Le localStorage n'est pas digne de confiance : il peut dater d'une version
    // antérieure du site, ou avoir été modifié à la main. On valide, et on repart
    // d'un panier vide plutôt que de planter.
    const parsed = cartSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : EMPTY;
  } catch {
    return EMPTY;
  }
}

function ensureLoaded() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  items = readStorage();
}

function commit(next: CartItem[]) {
  items = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Quota dépassé ou navigation privée : le panier reste utilisable dans l'onglet.
  }
  emit();
}

function subscribe(listener: () => void): () => void {
  ensureLoaded();
  listeners.add(listener);

  // Garde les onglets ouverts sur le même site synchronisés.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    items = readStorage();
    emit();
  };
  window.addEventListener('storage', onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

// --- Actions ---------------------------------------------------------------

export const MAX_QUANTITY = 10;

export function addItem(item: CartItem) {
  ensureLoaded();
  const existing = items.find((i) => i.optionId === item.optionId);

  commit(
    existing
      ? items.map((i) =>
          i.optionId === item.optionId
            ? { ...i, quantity: Math.min(MAX_QUANTITY, i.quantity + item.quantity) }
            : i,
        )
      : [...items, item],
  );

  openCart();
}

export function setQuantity(optionId: string, quantity: number) {
  ensureLoaded();
  commit(
    quantity <= 0
      ? items.filter((i) => i.optionId !== optionId)
      : items.map((i) =>
          i.optionId === optionId ? { ...i, quantity: Math.min(MAX_QUANTITY, quantity) } : i,
        ),
  );
}

export function removeItem(optionId: string) {
  ensureLoaded();
  commit(items.filter((i) => i.optionId !== optionId));
}

export function clearCart() {
  ensureLoaded();
  if (items.length > 0) commit(EMPTY);
}

export function openCart() {
  if (isOpen) return;
  isOpen = true;
  emit();
}

export function closeCart() {
  if (!isOpen) return;
  isOpen = false;
  emit();
}

// --- Hooks -----------------------------------------------------------------

export function useCartItems(): CartItem[] {
  return useSyncExternalStore(
    subscribe,
    () => {
      ensureLoaded();
      return items;
    },
    () => EMPTY,
  );
}

export function useCartOpen(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => isOpen,
    () => false,
  );
}

/**
 * `false` pendant le rendu serveur et la toute première passe d'hydratation,
 * `true` ensuite. Permet de n'afficher « votre panier est vide » qu'une fois le
 * localStorage réellement lu — sinon le message clignoterait à chaque visite.
 */
export function useCartHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function useCart() {
  const items = useCartItems();
  const hydrated = useCartHydrated();

  return {
    items,
    hydrated,
    count: cartCount(items),
    subtotalCents: cartSubtotalCents(items),
    addItem,
    setQuantity,
    removeItem,
    clear: clearCart,
    openCart,
    closeCart,
  };
}
