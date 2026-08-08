'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useCart, useCartOpen } from '@/lib/cart/store';
import { ButtonLink } from '@/components/ui/Button';
import { formatPrice } from '@/lib/format';
import { photoSrc, SIZES } from '@/lib/images';

export function CartDrawer() {
  const t = useTranslations('cartDrawer');
  const { items, closeCart, subtotalCents, setQuantity, removeItem } = useCart();
  const isOpen = useCartOpen();

  // Échap ferme le tiroir, et on bloque le défilement de la page derrière.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCart();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, closeCart]);

  return (
    <>
      <div
        onClick={closeCart}
        aria-hidden
        className={`fixed inset-0 z-60 bg-black/70 transition-opacity duration-400 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t('title')}
        className={`fixed inset-y-0 right-0 z-70 flex w-full max-w-md flex-col border-l border-ink-line bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink-line px-6 py-5">
          <h2 className="eyebrow text-paper">{t('title')}</h2>
          <button type="button" onClick={closeCart} className="eyebrow hover:text-paper">
            {t('close')}
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center px-6">
            <p className="text-sm text-paper-dim">{t('empty')}</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              <ul className="divide-y divide-ink-line">
                {items.map((item) => (
                  <li key={item.optionId} className="flex gap-4 py-5">
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-ink-soft">
                      <Image
                        src={photoSrc(item.imagePath, item.imageWidth)}
                        alt={item.photoTitle}
                        fill
                        sizes={SIZES.thumbnail}
                        className="object-cover"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <Link
                        href={`/photo/${item.photoSlug}`}
                        onClick={closeCart}
                        className="font-display text-lg leading-tight"
                      >
                        {item.photoTitle}
                      </Link>
                      <p className="mt-1 text-xs text-paper-dim">{item.optionLabel}</p>

                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center gap-3 border border-ink-line px-2 py-1">
                          <button
                            type="button"
                            onClick={() => setQuantity(item.optionId, item.quantity - 1)}
                            className="px-1 text-paper-dim hover:text-paper"
                            aria-label={t('decreaseQuantity')}
                          >
                            −
                          </button>
                          <span className="min-w-4 text-center text-sm tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity(item.optionId, item.quantity + 1)}
                            className="px-1 text-paper-dim hover:text-paper"
                            aria-label={t('increaseQuantity')}
                          >
                            +
                          </button>
                        </div>

                        <span className="text-sm tabular-nums">
                          {formatPrice(item.unitPriceCents * item.quantity)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.optionId)}
                        className="mt-2 self-start text-xs text-paper-faint underline-offset-4 hover:text-paper hover:underline"
                      >
                        {t('remove')}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {items.length > 1 ? (
                <div className="py-6">
                  <ButtonLink variant="primary" href="/panier?mur=1" onClick={closeCart}>
                    {t('viewOnWall')}
                  </ButtonLink>
                </div>
              ) : null}
            </div>

            <div className="border-t border-ink-line px-6 py-6">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow">{t('subtotal')}</span>
                <span className="font-display text-2xl tabular-nums">
                  {formatPrice(subtotalCents)}
                </span>
              </div>
              <p className="mt-2 text-xs text-paper-faint">{t('shippingNote')}</p>

              <Link
                href="/panier"
                onClick={closeCart}
                className="mt-5 flex w-full items-center justify-center bg-paper px-6 py-3.5 text-[0.6875rem] font-medium tracking-[0.24em] text-ink uppercase transition-colors hover:bg-white"
              >
                {t('viewCart')}
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
