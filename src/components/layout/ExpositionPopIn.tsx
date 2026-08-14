'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { photoSrc } from '@/lib/images';

const STORAGE_KEY = 'tominafrica.exposition-popin.v1';
const SHOW_DELAY_MS = 1500;

// Photo montrée dans la pop-in — un des tirages de la série, celle qui sera
// exposée, pas une photo de coulisses du voyage. Format réel (3:4, portrait)
// plutôt qu'un recadrage large : c'est elle qui porte la promotion, autant
// lui laisser toute la place.
const PHOTO = { imagePath: 'les-jumelles', imageWidth: 2400, imageHeight: 3200 };

/**
 * Annonce l'exposition à venir, une fois par visiteur (localStorage). Montée
 * globalement dans le layout plutôt que sur une seule page : c'est une
 * promotion ponctuelle, pas un élément de navigation.
 */
export function ExpositionPopIn() {
  const t = useTranslations('expositionPopIn');
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alreadySeen = true;
    try {
      alreadySeen = window.localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      // Navigation privée ou stockage désactivé : on montre la pop-in quand
      // même, tant pis pour la répétition d'une visite à l'autre.
      alreadySeen = false;
    }
    if (alreadySeen) return;

    const timer = window.setTimeout(() => setMounted(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [mounted]);

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
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
        {/* Format réel de la photo (3:4) : elle domine la pop-in au lieu
            d'être une simple vignette d'en-tête. */}
        <div
          className="relative w-full shrink-0 overflow-hidden bg-ink-soft"
          style={{ aspectRatio: PHOTO.imageWidth / PHOTO.imageHeight }}
        >
          <Image
            src={photoSrc(PHOTO.imagePath, PHOTO.imageWidth)}
            alt=""
            fill
            sizes="384px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-transparent to-transparent" />

          <button
            ref={closeButtonRef}
            type="button"
            onClick={dismiss}
            aria-label={t('close')}
            className="eyebrow absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-ink/70 text-paper backdrop-blur-md transition-colors duration-300 hover:bg-ink/90"
          >
            ✕
          </button>

          {/* Dates en surimpression, sur la photo : la première chose lue,
              avant même le titre — c'est l'information qui décide d'un clic. */}
          <p className="eyebrow absolute bottom-4 left-5 text-paper">{t('dates')}</p>
        </div>

        <div className="p-7">
          <p className="eyebrow text-accent">{t('eyebrow')}</p>
          <h2 className="mt-3 font-display text-3xl leading-[0.95] font-light">{t('title')}</h2>
          <p className="mt-4 text-sm leading-relaxed text-paper-dim">{t('body')}</p>

          <Link
            href="/notre-aventure/exposition"
            onClick={dismiss}
            className="mt-6 flex w-full items-center justify-center bg-paper px-6 py-3.5 text-[0.6875rem] font-medium tracking-[0.24em] text-ink uppercase transition-colors hover:bg-white"
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
