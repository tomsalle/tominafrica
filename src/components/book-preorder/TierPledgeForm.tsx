'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/format';
import type { BookPreorderTierRow } from '@/types/database';

type Status = 'idle' | 'submitting' | 'error';

type TierPledgeFormProps = {
  tier: BookPreorderTierRow;
  checkoutEnabled: boolean;
  soldOut: boolean;
};

/**
 * Un formulaire par palier : sélecteur de quantité pour les paliers à prix
 * fixe, montant libre pour le don. Même forme d'état (idle/submitting/error)
 * que ExpositionForm.tsx, même redirection que CartView.tsx.
 */
export function TierPledgeForm({ tier, checkoutEnabled, soldOut }: TierPledgeFormProps) {
  const t = useTranslations('bookPreorder.form');
  const common = useTranslations('bookPreorder.tierCommon');
  const locale = useLocale();

  const [quantity, setQuantity] = useState(1);
  const [donationAmount, setDonationAmount] = useState(tier.price_cents / 100);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const maxQuantity =
    tier.stock_limit !== null ? Math.max(0, tier.stock_limit - tier.claimed_count) : 10;

  async function handleSubmit() {
    setStatus('submitting');
    setError(null);

    try {
      const response = await fetch('/api/book-preorder/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierId: tier.id,
          quantity: tier.is_donation ? 1 : quantity,
          customAmountCents: tier.is_donation ? Math.round(donationAmount * 100) : undefined,
          locale,
        }),
      });

      const data = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;

      if (!response.ok || !data?.url) {
        setStatus('error');
        setError(data?.error ?? t('genericError'));
        return;
      }

      window.location.href = data.url;
    } catch {
      setStatus('error');
      setError(t('genericError'));
    }
  }

  if (!checkoutEnabled) {
    return <p className="border border-ink-line px-4 py-3 text-center text-xs text-paper-faint">{t('checkoutDisabled')}</p>;
  }

  if (soldOut) {
    return (
      <Button type="button" variant="outline" className="w-full" disabled>
        {common('soldOut')}
      </Button>
    );
  }

  return (
    <div>
      {tier.is_donation ? (
        <div className="mb-4 flex items-center gap-2 border border-ink-line px-3 py-2">
          <input
            type="number"
            min={tier.price_cents / 100}
            step={1}
            value={donationAmount}
            onChange={(event) => setDonationAmount(Number(event.target.value))}
            className="w-full bg-transparent text-sm text-paper focus:outline-none"
            aria-label={t('donationAmountLabel')}
          />
          <span className="text-sm text-paper-faint">€</span>
        </div>
      ) : (
        <div className="mb-4 flex items-center gap-4 border border-ink-line px-3 py-1.5">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-1 text-paper-dim transition-[color,transform] duration-150 hover:text-paper active:scale-90"
            aria-label={t('decreaseQuantity')}
          >
            −
          </button>
          <span className="min-w-4 text-center text-sm tabular-nums">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
            className="p-1 text-paper-dim transition-[color,transform] duration-150 hover:text-paper active:scale-90"
            aria-label={t('increaseQuantity')}
          >
            +
          </button>
          <span className="ml-auto font-display text-base tabular-nums text-paper-dim">
            {formatPrice(tier.price_cents * quantity)}
          </span>
        </div>
      )}

      {error ? <p className="mb-3 text-xs text-accent">{error}</p> : null}

      <Button
        type="button"
        onClick={handleSubmit}
        className="w-full"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? t('submitting') : tier.is_donation ? t('donate') : t('preorder')}
      </Button>
    </div>
  );
}
