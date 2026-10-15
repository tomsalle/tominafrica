'use client';

import { Share_Tech_Mono } from 'next/font/google';
import { useTranslations } from 'next-intl';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import type { PreorderPhase } from '@/lib/book-preorder/config';
import { usePreorderPhase } from '@/lib/book-preorder/use-preorder-phase';

// Chiffres façon afficheur LED de minuterie de bombe.
const led = Share_Tech_Mono({ subsets: ['latin'], weight: '400', display: 'swap' });

function split(msLeft: number | null) {
  if (msLeft === null) return ['--', '--', '--'] as const;
  const total = Math.ceil(msLeft / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [String(h).padStart(2, '0'), String(m).padStart(2, '0'), String(s).padStart(2, '0')] as const;
}

function Colon() {
  return (
    <span aria-hidden className="countdown-blink">
      :
    </span>
  );
}

/**
 * Compte à rebours avant l'ouverture de la précommande, comme la minuterie
 * d'une bombe : chiffres LED rouges, « 88:88:88 » éteints en fond, deux-points
 * qui clignotent. « panel » : grand bloc ; « compact » : une ligne.
 */
export function PreorderCountdown({
  serverPhase,
  variant = 'panel',
}: {
  serverPhase: PreorderPhase;
  variant?: 'panel' | 'compact';
}) {
  const t = useTranslations('bookPreorder.countdown');
  const { msLeft } = usePreorderPhase(serverPhase);
  const [hh, mm, ss] = split(msLeft);
  const lastMinute = msLeft !== null && msLeft <= 60_000;
  const spoken = msLeft === null ? '' : t('srTime', { hours: Number(hh), minutes: Number(mm) });

  if (variant === 'compact') {
    return (
      <span className="inline-flex items-center gap-2 text-xs text-paper-dim">
        <span aria-hidden className="countdown-blink inline-block size-1.5 rounded-full bg-[#ff3b3b]" />
        <span className="sr-only">{spoken}</span>
        <span aria-hidden className={`${led.className} text-base text-[#ff4d4d] tabular-nums [text-shadow:0_0_8px_rgba(255,59,59,0.6)]`}>
          {hh}
          <Colon />
          {mm}
          <Colon />
          {ss}
        </span>
      </span>
    );
  }

  return (
    <div
      role="timer"
      aria-label={t('label')}
      className={`relative overflow-hidden border bg-black px-5 py-6 text-center ${
        lastMinute ? 'countdown-alarm border-[#ff3b3b]' : 'border-[#ff3b3b]/35'
      }`}
    >
      <p className="flex items-center justify-center gap-2 text-[0.6875rem] font-medium tracking-[0.24em] text-[#ff6b6b] uppercase">
        <span aria-hidden className="countdown-blink inline-block size-1.5 rounded-full bg-[#ff3b3b]" />
        {t('label')}
      </p>

      <p className="sr-only" aria-live="off">
        {spoken}
      </p>

      {/* Chiffres allumés par-dessus des « 88 » éteints, comme un vrai afficheur. */}
      <div aria-hidden className={`${led.className} mt-4 grid text-[3.25rem] leading-none tabular-nums sm:text-6xl`}>
        <span className="col-start-1 row-start-1 text-[#ff3b3b]/[0.09]">88:88:88</span>
        <span className="col-start-1 row-start-1 text-[#ff3b3b] [text-shadow:0_0_14px_rgba(255,59,59,0.75),0_0_2px_rgba(255,120,120,0.9)]">
          {hh}
          <Colon />
          {mm}
          <Colon />
          {ss}
        </span>
      </div>
      <div aria-hidden className="mx-auto mt-2 grid max-w-[16rem] grid-cols-3 text-[0.625rem] tracking-[0.2em] text-[#ff6b6b]/70 uppercase sm:max-w-[19rem]">
        <span>{t('hours')}</span>
        <span>{t('minutes')}</span>
        <span>{t('seconds')}</span>
      </div>

      <p className="mt-4 text-xs text-paper-dim">{t('date')}</p>
    </div>
  );
}

/**
 * Avant l'ouverture : affiche `fallback` (le compte à rebours) ; ensuite, le
 * contenu normal. Bascule toute seule à 12 h, avec un bref « flash » d'ouverture.
 */
export function PreorderGate({
  serverPhase,
  fallback,
  children,
}: {
  serverPhase: PreorderPhase;
  fallback: ReactNode;
  children: ReactNode;
}) {
  const { phase } = usePreorderPhase(serverPhase);
  const wasBefore = useRef(serverPhase === 'before');
  const [justOpened, setJustOpened] = useState(false);

  useEffect(() => {
    if (phase === 'before') {
      wasBefore.current = true;
    } else if (wasBefore.current) {
      wasBefore.current = false;
      setJustOpened(true);
    }
  }, [phase]);

  if (phase === 'before') return <>{fallback}</>;
  return justOpened ? <div className="countdown-boom">{children}</div> : <>{children}</>;
}
