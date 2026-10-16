'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { PreorderCountdown } from '@/components/book-preorder/PreorderCountdown';
import { getPreorderPhase, isPreorderClosed } from '@/lib/book-preorder/config';
import { usePreorderPhase } from '@/lib/book-preorder/use-preorder-phase';

export const BOOK_PREORDERED_KEY = 'tominafrica.livre-precommande.v1';
const STORAGE_KEY = 'tominafrica.livre-popin.v1';
const ARRIVAL_DELAY_MS = 2500;
const SCROLL_DELAY_MS = 600;
// Fermée sans commander : elle revient après ce délai, pas à chaque page.
const SNOOZE_MS = 3 * 24 * 60 * 60 * 1000;

const COVER = { src: '/precommande-livre/extraits/01-couverture.avif', width: 1280, height: 960 };

/**
 * Annonce de la précommande du livre, avec un bouton qui mène droit au choix
 * de la formule. Tant que la précommande est ouverte, elle remplace la pop-in
 * de l'exposition ; jamais pendant un achat, ni sur les pages du livre, ni une
 * fois le livre précommandé.
 */
export function BookPopIn() {
  const t = useTranslations('bookPopIn');
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // Avant l'ouverture (16 octobre, 12 h) : annonce + compte à rebours.
  const [serverPhase] = useState(() => getPreorderPhase());
  const { phase } = usePreorderPhase(serverPhase);
  const before = phase === 'before';
  // Fermée pendant le compte à rebours : elle revient quand même à l'ouverture.
  const storageKey = useRef(`${STORAGE_KEY}${serverPhase === 'before' ? '.avant' : ''}`);

  useEffect(() => {
    if (isPreorderClosed()) return;
    if (/\/(admin|panier|commande|precommande-livre)(\/|$)/.test(window.location.pathname)) return;

    try {
      if (window.localStorage.getItem(BOOK_PREORDERED_KEY) === '1') return;
      const dismissedAt = Number(window.localStorage.getItem(storageKey.current) ?? 0);
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
      window.localStorage.setItem(storageKey.current, String(Date.now()));
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
      className={`fixed inset-0 z-80 flex items-center justify-center bg-black/75 p-5 transition-opacity duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-popin-title"
        onClick={(event) => event.stopPropagation()}
        onTransitionEnd={(event) => {
          if (event.target !== event.currentTarget || visible) return;
          setMounted(false);
        }}
        className={`relative flex max-h-[92dvh] w-full max-w-sm flex-col overflow-y-auto border border-ink-line bg-ink transition-[transform,opacity] duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          visible ? 'scale-100 opacity-100' : 'scale-[0.96] opacity-0'
        }`}
      >
        <div
          className="relative w-full shrink-0 overflow-hidden bg-[#232115]"
          style={{ aspectRatio: COVER.width / COVER.height }}
        >
          <Image src={COVER.src} alt={t('imageAlt')} fill sizes="384px" className="object-cover" />

          <button
            ref={closeButtonRef}
            type="button"
            onClick={dismiss}
            aria-label={t('close')}
            className="absolute top-2 right-2 flex size-11 items-center justify-center rounded-full text-paper transition-colors duration-200 hover:bg-ink/60"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-ink/70 backdrop-blur-md">
              <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </span>
          </button>
        </div>

        <div className="p-7">
          <p className="eyebrow flex items-center gap-2 text-brand-text">
            <span aria-hidden className="inline-block size-1.5 rounded-full bg-brand-text" />
            {before ? t('eyebrowBefore') : t('eyebrow')}
          </p>
          <h2 id="book-popin-title" className="mt-3 font-display text-3xl leading-[0.98] font-light">
            {before ? t('titleBefore') : t('title')}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-paper-dim">{before ? t('bodyBefore') : t('body')}</p>

          {before ? (
            <div className="mt-5 border border-[#ff3b3b]/35 bg-black px-3 py-3 text-center">
              <PreorderCountdown serverPhase={serverPhase} variant="compact" />
            </div>
          ) : null}

          <Link
            href={before ? '/precommande-livre' : '/precommande-livre/formules'}
            onClick={dismiss}
            className="mt-6 flex min-h-12 w-full items-center justify-center bg-brand px-6 text-[0.6875rem] font-medium tracking-[0.24em] text-paper uppercase transition-[background-color,transform] duration-200 hover:bg-brand-hover active:scale-[0.98]"
          >
            {before ? t('ctaBefore') : t('cta')}
          </Link>

          <div className="mt-4 flex items-center justify-between gap-4 text-xs">
            {before ? (
              <span />
            ) : (
              <Link
                href="/precommande-livre"
                onClick={dismiss}
                className="text-paper-dim underline underline-offset-4 hover:text-paper"
              >
                {t('discover')}
              </Link>
            )}
            <button type="button" onClick={dismiss} className="min-h-11 text-paper-faint hover:text-paper">
              {t('later')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
