'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/lib/cart/store';
import { CartWallPreview } from '@/components/cart/CartWallPreview';
import { Button, ButtonLink } from '@/components/ui/Button';
import { formatPrice } from '@/lib/format';
import { photoSrc, SIZES } from '@/lib/images';

export function CartView({ checkoutEnabled }: { checkoutEnabled: boolean }) {
  const { items, subtotalCents, setQuantity, removeItem, hydrated } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Le tiroir panier renvoie ici avec ?mur=1 plutôt que d'afficher l'aperçu
  // sur place : il n'a pas la place pour un aperçu mural correct.
  const searchParams = useSearchParams();
  const [showWall, setShowWall] = useState(() => searchParams.get('mur') === '1');

  async function handleCheckout() {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Seuls l'identifiant et la quantité partent : le serveur relit les
        // prix en base.
        body: JSON.stringify({
          items: items.map((item) => ({ optionId: item.optionId, quantity: item.quantity })),
        }),
      });

      const data: { url?: string; error?: string } = await response.json();

      if (!response.ok || !data.url) {
        setError(data.error ?? 'Le paiement n’a pas pu démarrer.');
        return;
      }

      window.location.href = data.url;
    } catch {
      setError('Connexion impossible. Vérifiez votre réseau et réessayez.');
    } finally {
      setSubmitting(false);
    }
  }

  // Avant lecture du localStorage, on n'affiche ni panier vide ni panier plein :
  // les deux seraient faux la moitié du temps.
  if (!hydrated) {
    return <div className="h-64 animate-pulse bg-ink-soft" aria-hidden />;
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-3xl font-light">Votre panier est vide.</p>
        <ButtonLink href="/" variant="outline" className="mt-10">
          Découvrir les séries
        </ButtonLink>
      </div>
    );
  }

  return (
    <div>
      {items.length > 1 ? (
        <div className="mb-14">
          <Button variant="primary" onClick={() => setShowWall((v) => !v)}>
            {showWall ? 'Masquer l’aperçu mural' : 'Voir ensemble sur un mur'}
          </Button>

          {showWall ? (
            <div className="mt-6">
              <CartWallPreview items={items} />
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-x-20 gap-y-14 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <ul className="divide-y divide-ink-line border-y border-ink-line">
          {items.map((item) => (
            <li key={item.optionId} className="flex gap-6 py-7">
              <Link
                href={`/photo/${item.photoSlug}`}
                className="relative h-32 w-24 shrink-0 overflow-hidden bg-ink-soft sm:h-40 sm:w-32"
              >
                <Image
                  src={photoSrc(item.imagePath, item.imageWidth)}
                  alt={item.photoTitle}
                  fill
                  sizes={SIZES.thumbnail}
                  className="object-cover"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <Link
                  href={`/photo/${item.photoSlug}`}
                  className="font-display text-2xl leading-tight font-light"
                >
                  {item.photoTitle}
                </Link>
                <p className="mt-1.5 text-sm text-paper-dim">{item.optionLabel}</p>
                <p className="mt-1 text-xs text-paper-faint">
                  {formatPrice(item.unitPriceCents)} l’unité
                </p>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-5">
                  <div className="flex items-center gap-4 border border-ink-line px-3 py-1.5">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.optionId, item.quantity - 1)}
                      className="text-paper-dim hover:text-paper"
                      aria-label="Diminuer la quantité"
                    >
                      −
                    </button>
                    <span className="min-w-4 text-center text-sm tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.optionId, item.quantity + 1)}
                      className="text-paper-dim hover:text-paper"
                      aria-label="Augmenter la quantité"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-display text-xl tabular-nums">
                    {formatPrice(item.unitPriceCents * item.quantity)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.optionId)}
                  className="mt-3 self-start text-xs text-paper-faint underline-offset-4 hover:text-paper hover:underline"
                >
                  Retirer
                </button>
              </div>
            </li>
          ))}
        </ul>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="eyebrow">Récapitulatif</h2>

          <dl className="mt-7 space-y-3 border-b border-ink-line pb-6 text-sm">
            <div className="flex justify-between">
              <dt className="text-paper-dim">Sous-total</dt>
              <dd className="tabular-nums">{formatPrice(subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-paper-dim">Livraison</dt>
              <dd className="text-paper-faint">Calculée au paiement</dd>
            </div>
          </dl>

          <div className="mt-6 flex items-baseline justify-between">
            <span className="eyebrow">Total</span>
            <span className="font-display text-3xl font-light tabular-nums">
              {formatPrice(subtotalCents)}
            </span>
          </div>

          {error ? (
            <p role="alert" className="mt-5 border border-accent/40 px-4 py-3 text-xs text-accent">
              {error}
            </p>
          ) : null}

          {checkoutEnabled ? (
            <Button className="mt-7 w-full" onClick={handleCheckout} disabled={submitting}>
              {submitting ? 'Redirection…' : 'Passer au paiement'}
            </Button>
          ) : (
            <div className="mt-7 border border-ink-line px-5 py-5">
              <p className="text-xs leading-relaxed text-paper-dim">
                Le paiement en ligne n’est pas encore activé. Vous pouvez composer votre
                sélection ; elle sera conservée dans ce navigateur.
              </p>
            </div>
          )}

          <p className="mt-5 text-xs leading-relaxed text-paper-faint">
            Paiement sécurisé par Stripe. Aucune donnée bancaire ne transite par ce site.
          </p>
        </aside>
      </div>
    </div>
  );
}
