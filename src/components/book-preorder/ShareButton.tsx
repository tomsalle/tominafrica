'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { CheckIcon, ShareIcon } from '@/components/book-preorder/icons';

/** Bouton « Partager » en pastille, comme sous le visuel d'une collecte Ulule. */
export function ShareButton() {
  const t = useTranslations('bookPreorder.progress');
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ url });
      } catch {
        // Partage annulé — rien à faire.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Presse-papiers indisponible.
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-ink-line px-5 text-[0.6875rem] font-medium tracking-[0.14em] text-paper-dim uppercase transition-[color,border-color,transform] duration-200 hover:border-paper-dim hover:text-paper active:scale-[0.97]"
    >
      {t('share')}
      {copied ? <CheckIcon className="size-3.5 text-paper" /> : <ShareIcon className="size-3.5" />}
    </button>
  );
}
