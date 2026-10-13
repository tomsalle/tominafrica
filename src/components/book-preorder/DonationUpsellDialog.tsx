'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { HeartIcon } from '@/components/book-preorder/icons';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/format';

const PRESETS = [100, 500, 1000] as const; // 1 €, 5 €, 10 €
type Choice = (typeof PRESETS)[number] | 'other' | null;

/**
 * Juste avant le paiement : proposer d'ajouter un petit don pour l'installation
 * de l'exposition. Rien n'est présélectionné (donner reste un choix) ; le
 * bouton dit toujours ce qui va se passer (« sans don » ou « avec un don de… »).
 */
export function DonationUpsellDialog({
  open,
  orderLabel,
  orderCents,
  submitting,
  error,
  onClose,
  onConfirm,
}: {
  open: boolean;
  orderLabel: string;
  orderCents: number;
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: (extraDonationCents: number | null) => void;
}) {
  const t = useTranslations('bookPreorder.form.upsell');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const otherRef = useRef<HTMLInputElement>(null);
  const [choice, setChoice] = useState<Choice>(null);
  const [otherEuros, setOtherEuros] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (choice === 'other') otherRef.current?.focus();
  }, [choice]);

  const otherCents = Math.round(Number(otherEuros.replace(',', '.')) * 100);
  const otherValid = Number.isFinite(otherCents) && otherCents >= 100 && otherCents <= 100_000;
  const donationCents = choice === 'other' ? (otherValid ? otherCents : null) : choice;
  const invalidOther = choice === 'other' && otherEuros !== '' && !otherValid;

  function pick(value: Exclude<Choice, null>) {
    // Un second clic sur le montant choisi le retire : retour à « sans don ».
    setChoice((current) => (current === value ? null : value));
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        // Clic sur le fond (hors de la fenêtre) : on ferme.
        if (event.target === event.currentTarget) onClose();
      }}
      aria-labelledby="upsell-title"
      className="m-auto w-[min(92vw,28rem)] border border-ink-line bg-ink-soft p-0 text-paper opacity-100 transition-[opacity,scale] duration-200 ease-out backdrop:bg-black/70 starting:scale-[0.97] starting:opacity-0 motion-reduce:transition-none"
    >
      <div className="relative p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label={t('close')}
          className="absolute top-3 right-3 flex size-11 items-center justify-center text-paper-dim transition-colors duration-200 hover:text-paper"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <p className="eyebrow flex items-center gap-2 text-paper">
          <HeartIcon className="size-4 text-brand-text" />
          {t('eyebrow')}
        </p>
        <h2 id="upsell-title" className="mt-3 pr-8 font-display text-2xl leading-tight font-light sm:text-3xl">
          {t('title')}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-paper-dim">{t('body')}</p>

        <div role="radiogroup" aria-label={t('amountsLabel')} className="mt-6 grid grid-cols-4 gap-2">
          {[...PRESETS, 'other' as const].map((value) => {
            const selected = choice === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => pick(value)}
                className={`min-h-12 border px-2 text-sm tabular-nums transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.97] ${
                  selected
                    ? 'border-brand bg-brand/25 text-paper'
                    : 'border-ink-line text-paper-dim hover:border-paper-dim hover:text-paper'
                }`}
              >
                {value === 'other' ? t('other') : formatPrice(value)}
              </button>
            );
          })}
        </div>

        {choice === 'other' ? (
          <div className="mt-3">
            <label htmlFor="upsell-other" className="text-xs text-paper-dim">
              {t('otherLabel')}
            </label>
            <div className="mt-1.5 flex items-center gap-2 border border-ink-line px-3 focus-within:border-paper-dim">
              <input
                ref={otherRef}
                id="upsell-other"
                type="number"
                inputMode="decimal"
                min={1}
                max={1000}
                step={1}
                value={otherEuros}
                onChange={(event) => setOtherEuros(event.target.value)}
                aria-invalid={invalidOther || undefined}
                aria-describedby={invalidOther ? 'upsell-other-error' : undefined}
                className="min-h-11 w-full bg-transparent text-base text-paper focus:outline-none"
              />
              <span className="text-sm text-paper-faint">€</span>
            </div>
            {invalidOther ? (
              <p id="upsell-other-error" role="alert" className="mt-1.5 text-xs text-brand-text">
                {t('invalidAmount')}
              </p>
            ) : null}
          </div>
        ) : null}

        {/* Récapitulatif : ce qui sera payé, sans surprise. */}
        <dl className="mt-6 space-y-2 border-t border-ink-line pt-4 text-sm tabular-nums">
          <div className="flex justify-between gap-4">
            <dt translate="no" className="text-paper-dim">
              {orderLabel}
            </dt>
            <dd>{formatPrice(orderCents)}</dd>
          </div>
          {donationCents ? (
            <div className="flex justify-between gap-4">
              <dt className="text-paper-dim">{t('donationLine')}</dt>
              <dd>{formatPrice(donationCents)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-4 border-t border-ink-line pt-2 text-base">
            <dt>{t('total')}</dt>
            <dd>{formatPrice(orderCents + (donationCents ?? 0))}</dd>
          </div>
        </dl>

        {error ? (
          <p role="alert" className="mt-4 text-xs text-brand-text">
            {error}
          </p>
        ) : null}

        <Button
          type="button"
          variant="brand"
          className="mt-6 w-full"
          disabled={submitting || (choice === 'other' && !otherValid)}
          onClick={() => onConfirm(donationCents)}
        >
          {submitting
            ? t('submitting')
            : donationCents
              ? t('continueWith', { amount: formatPrice(donationCents) })
              : t('continueWithout')}
        </Button>
      </div>
    </dialog>
  );
}
