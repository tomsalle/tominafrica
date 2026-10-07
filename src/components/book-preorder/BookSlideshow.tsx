'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export type BookSlide = { src: string; alt: string; label?: string; fit?: 'cover' | 'contain' };

const INTERVAL_MS = 3500;

/**
 * Feuilleter le livre : les doubles pages se succèdent en fondu, comme un
 * GIF mais en images nettes et légères. Pause au survol ou au focus, pas de
 * défilement automatique si l'utilisateur a réduit les animations ;
 * précédent / suivant toujours disponibles.
 */
export function BookSlideshow({ slides }: { slides: BookSlide[] }) {
  const t = useTranslations('bookPreorder.slideshow');
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || slides.length < 2) return;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [index, paused, reducedMotion, slides.length]);

  const go = (next: number) => setIndex((next + slides.length) % slides.length);
  const current = slides[index];

  return (
    <div
      className="group relative h-full w-full"
      role="region"
      aria-roledescription="carousel"
      aria-label={t('label')}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') go(index + 1);
        if (event.key === 'ArrowLeft') go(index - 1);
      }}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 44rem"
            priority={i === 0}
            className={slide.fit === 'contain' ? 'object-contain' : 'object-cover'}
          />
        </div>
      ))}

      {/* Annonce discrète du changement pour les lecteurs d'écran. */}
      <p className="sr-only" aria-live="polite">
        {current?.label ?? current?.alt}
      </p>

      {/* Barre de progression segmentée + numéros de page. */}
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent px-4 pt-10 pb-3">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[0.6875rem] tracking-[0.14em] text-paper uppercase tabular-nums">
            {current?.label ?? ''}
          </span>
          <span className="text-[0.6875rem] tracking-[0.14em] text-paper-dim tabular-nums">
            {index + 1} / {slides.length}
          </span>
        </div>
        <div className="mt-2 flex gap-1">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => go(i)}
              aria-label={t('goTo', { page: slide.label ?? String(i + 1) })}
              aria-current={i === index ? 'true' : undefined}
              className="relative h-6 flex-1 cursor-pointer"
            >
              <span className={`absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 ${i <= index ? 'bg-paper' : 'bg-paper/30'}`} />
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => go(index - 1)}
        aria-label={t('previous')}
        className="absolute top-1/2 left-2 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-ink/60 text-paper opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100"
      >
        ←
      </button>
      <button
        type="button"
        onClick={() => go(index + 1)}
        aria-label={t('next')}
        className="absolute top-1/2 right-2 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-ink/60 text-paper opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100"
      >
        →
      </button>
    </div>
  );
}
