'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FundingProgress } from '@/components/book-preorder/FundingProgress';
import { formatPrice } from '@/lib/format';

type HeroPanelProps = {
  count: number;
  goal: number;
  pledgesCount: number;
  minPriceCents: number;
};

/**
 * Panneau collant du haut de page : jauge + appel à l'action + partage —
 * équivalent du bloc de droite d'une collecte Ulule (jauge, bouton
 * « Contribuer », partage).
 */
export function HeroPanel({ count, goal, pledgesCount, minPriceCents }: HeroPanelProps) {
  const t = useTranslations('bookPreorder.progress');
  const [shared, setShared] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ url });
      } catch {
        // Partage annulé par la personne — rien à faire.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // Presse-papiers indisponible — rien à faire de plus sans API de partage.
    }
  }

  return (
    <div className="border border-ink-line p-7">
      <FundingProgress count={count} goal={goal} pledgesCount={pledgesCount} />

      <a
        href="#contreparties"
        className="mt-7 flex w-full items-center justify-center gap-2 bg-brand px-6 py-3.5 text-[0.6875rem] font-medium tracking-[0.24em] text-paper uppercase transition-[background-color,transform] duration-300 hover:bg-brand-hover active:scale-[0.97]"
      >
        {t('ctaFrom', { price: formatPrice(minPriceCents) })}
      </a>

      <p className="mt-4 text-center text-xs text-paper-faint">{t('secureNote')}</p>

      <button
        type="button"
        onClick={handleShare}
        className="mt-5 w-full border border-ink-line py-2.5 text-xs tracking-wide text-paper-dim uppercase transition-[color,border-color,transform] duration-300 hover:border-paper hover:text-paper active:scale-[0.97]"
      >
        <span className="inline-grid">
          <span
            className={`col-start-1 row-start-1 transition-opacity duration-200 ${shared ? 'opacity-0' : 'opacity-100'}`}
            aria-hidden={shared}
          >
            {t('share')}
          </span>
          <span
            className={`col-start-1 row-start-1 transition-opacity duration-200 ${shared ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden={!shared}
          >
            ✓
          </span>
        </span>
      </button>
    </div>
  );
}
