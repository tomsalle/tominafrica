'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { EXHIBITION, EXHIBITION_PATH, EXHIBITION_REGISTERED_KEY, isExhibitionUpcoming } from '@/lib/exhibition/event';

// v2 : les visiteurs qui l'avaient fermée avant la mise en avant de
// l'exposition la reverront une fois.
const STORAGE_KEY = 'tominafrica.exposition-popin.v2';
const ARRIVAL_DELAY_MS = 2500;
const SCROLL_DELAY_MS = 600;
// Fermée sans s'inscrire : elle revient après ce délai, pas à chaque page.
const SNOOZE_MS = 3 * 24 * 60 * 60 * 1000;

const POSTER = EXHIBITION.poster;

/**
 * Annonce de l'exposition. Revient tant que la personne ne s'est pas
 * inscrite (au plus une fois tous les trois jours), jamais pendant un achat
 * ni sur la page d'inscription elle-même, et plus du tout une fois
 * l'exposition passée.
 */
export function ExpositionPopIn() {
  const t = useTranslations('expositionPopIn');
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isExhibitionUpcoming()) return;
    if (/\/(panier|commande|precommande-livre|notre-aventure\/exposition)(\/|$)/.test(window.location.pathname)) return;

    try {
      if (window.localStorage.getItem(EXHIBITION_REGISTERED_KEY) === '1') return;
      const dismissedAt = Number(window.localStorage.getItem(STORAGE_KEY) ?? 0);
      if (dismissedAt && Date.now() - dismissedAt < SNOOZE_MS) return;
    } catch {
      // Stockage indisponible (navigation privée) : on l'affiche quand même.
    }

    // Un court moment pour voir la page d'abord, ou plus tôt si l'on défile.
    let timer = window.setTimeout(() => setMounted(true), ARRIVAL_DELAY_MS);
    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 0.4) return;
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setMounted(true), SCROLL_DELAY_MS);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [mounted]);

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // Rien à faire : au pire, elle réapparaîtra à la prochaine visite.
    }
  }

  useEffect(() => {
    if (!mounted) return;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      onClick={dismiss}
      aria-hidden={!visible}
      className={`fixed inset-0 z-80 flex items-center justify-center bg-black/75 p-5 transition-opacity duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('dialogLabel')}
        onClick={(event) => event.stopPropagation()}
        onTransitionEnd={(event) => {
          if (event.target !== event.currentTarget || visible) return;
          setMounted(false);
        }}
        className={`relative flex max-h-[92dvh] w-full max-w-sm flex-col overflow-y-auto border border-ink-line bg-ink transition-[transform,opacity] duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          visible ? 'scale-100 opacity-100' : 'scale-[0.96] opacity-0'
        }`}
      >
        {/* Format réel de l'affiche : elle domine la pop-in au lieu d'être
            une simple vignette d'en-tête. */}
        <div
          className="relative w-full shrink-0 overflow-hidden bg-ink-soft"
          style={{ aspectRatio: POSTER.width / POSTER.height }}
        >
          <Image
            src={POSTER.src}
            alt=""
            fill
            sizes="384px"
            className="object-contain"
          />

          <button
            ref={closeButtonRef}
            type="button"
            onClick={dismiss}
            aria-label={t('close')}
            className="eyebrow absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-ink/70 text-paper backdrop-blur-md transition-colors duration-300 hover:bg-ink/90"
          >
            ✕
          </button>
        </div>

        <div className="p-7">
          <p className="eyebrow text-brand-text">{t('eyebrow')}</p>
          <h2 className="mt-3 font-display text-3xl leading-[0.95] font-light">{t('title')}</h2>
          <p className="mt-4 text-sm leading-relaxed text-paper-dim">{t('body')}</p>

          <Link
            href={EXHIBITION_PATH}
            onClick={dismiss}
            className="mt-6 flex w-full items-center justify-center bg-paper px-6 py-3.5 text-[0.6875rem] font-medium tracking-[0.24em] text-ink uppercase transition-[background-color,transform] duration-200 hover:bg-white active:scale-[0.98]"
          >
            {t('cta')}
          </Link>

          <button
            type="button"
            onClick={dismiss}
            className="mt-4 w-full text-center text-xs text-paper-faint underline-offset-4 hover:text-paper hover:underline"
          >
            {t('later')}
          </button>
        </div>
      </div>
    </div>
  );
}
