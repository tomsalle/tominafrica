'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useFramePreference } from '@/lib/frame-preference';
import { photoSrc, SIZES } from '@/lib/images';
import type { PhotoRow } from '@/types/database';

/**
 * Bloc image de la page produit, avec agrandissement plein écran.
 *
 * On ne sert jamais le fichier master : le dérivé 2400 px suffit largement à
 * l'écran et reste inexploitable pour un tirage grand format. C'est une
 * protection nettement plus efficace qu'un clic droit désactivé, qui n'arrête
 * personne et gêne les visiteurs légitimes.
 */
export function PhotoViewer({ photo }: { photo: PhotoRow }) {
  // `mounted` garde le dialogue dans le DOM le temps de l'animation de
  // sortie ; `visible` pilote la transition. Sans cette distinction, la
  // fermeture est instantanée (le composant se démonte avant d'avoir pu
  // s'estomper).
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [blackAndWhite, setBlackAndWhite] = useState(false);
  const { framed } = useFramePreference();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const ratio =
    photo.image_width && photo.image_height ? photo.image_width / photo.image_height : 3 / 2;

  function openZoom() {
    setMounted(true);
  }

  function closeZoom() {
    setVisible(false);
  }

  useEffect(() => {
    if (!mounted) return;
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeZoom();
        return;
      }
      if (event.key !== 'Tab') return;

      // Piège de focus minimal : le dialogue ne contient que deux ou trois
      // contrôles, pas besoin d'une librairie pour les faire boucler.
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mounted]);

  return (
    <>
      <figure className="animate-photo-in">
        {/* `framed` vient du panneau d'achat (FramePreferenceProvider) : la
            photo prévisualise ce qui est effectivement facturé. Par défaut,
            la photo seule ; en mode encadré, un cadre noir directement
            contre l'image — pas de passe-partout — sur un fond plus clair
            que la page pour que le cadre noir s'y détache. */}
        {framed ? (
          <div className="bg-[radial-gradient(ellipse_at_center,var(--color-paper-faint),var(--color-ink-line))] px-5 py-10 sm:px-10 sm:py-16">
            <div className="bg-black p-3 shadow-2xl shadow-black/50 sm:p-4">
              <button
                type="button"
                onClick={openZoom}
                className="group relative block w-full cursor-zoom-in overflow-hidden"
                style={{ aspectRatio: ratio }}
                aria-label={`Agrandir « ${photo.title} »`}
              >
                <Image
                  src={photoSrc(photo.image_path)}
                  alt={photo.title}
                  fill
                  priority
                  sizes={SIZES.full}
                  className={`object-cover transition-[filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    blackAndWhite ? 'grayscale' : ''
                  }`}
                  {...(photo.blur_data_url
                    ? { placeholder: 'blur' as const, blurDataURL: photo.blur_data_url }
                    : {})}
                />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={openZoom}
            className="group relative block w-full cursor-zoom-in overflow-hidden bg-ink-soft"
            style={{ aspectRatio: ratio }}
            aria-label={`Agrandir « ${photo.title} »`}
          >
            <Image
              src={photoSrc(photo.image_path)}
              alt={photo.title}
              fill
              priority
              sizes={SIZES.full}
              className={`object-cover transition-[filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                blackAndWhite ? 'grayscale' : ''
              }`}
              {...(photo.blur_data_url
                ? { placeholder: 'blur' as const, blurDataURL: photo.blur_data_url }
                : {})}
            />
          </button>
        )}

        <div className="mt-7 flex justify-center">
          <ColorModeToggle blackAndWhite={blackAndWhite} onChange={setBlackAndWhite} />
        </div>

        {photo.caption ? (
          <figcaption className="mt-4 text-center text-sm text-paper-faint">
            {photo.caption}
          </figcaption>
        ) : null}
      </figure>

      {mounted && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={photo.title}
          onClick={closeZoom}
          onTransitionEnd={(event) => {
            if (event.target !== event.currentTarget || visible) return;
            setMounted(false);
          }}
          className={`fixed inset-0 z-90 flex cursor-zoom-out items-center justify-center bg-black/95 p-4 transition-opacity duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-10 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className={`relative h-full w-full transition-[transform,opacity] duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              visible ? 'scale-100 opacity-100' : 'scale-[0.96] opacity-0'
            }`}
          >
            <Image
              src={photoSrc(photo.image_path)}
              alt={photo.title}
              fill
              sizes="100vw"
              className={`object-contain transition-[filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                blackAndWhite ? 'grayscale' : ''
              }`}
            />
          </div>

          <div onClick={(event) => event.stopPropagation()}>
            <BlackAndWhiteToggle
              active={blackAndWhite}
              onToggle={() => setBlackAndWhite((v) => !v)}
              className="absolute bottom-5 right-5"
            />
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              closeZoom();
            }}
            className="eyebrow absolute top-5 right-5 text-paper hover:text-white"
          >
            Fermer
          </button>
        </div>
      )}
    </>
  );
}

/** Bascule N&B / Couleur sous la photo. */
function ColorModeToggle({
  blackAndWhite,
  onChange,
}: {
  blackAndWhite: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Mode couleur du tirage"
      className="inline-flex rounded-full border border-ink-line p-1"
    >
      <button
        type="button"
        onClick={() => onChange(true)}
        aria-pressed={blackAndWhite}
        className={`rounded-full px-4 py-1.5 text-[0.6875rem] font-medium tracking-[0.18em] uppercase transition-colors duration-300 ${
          blackAndWhite ? 'bg-paper text-ink' : 'text-paper-dim hover:text-paper'
        }`}
      >
        N&B
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        aria-pressed={!blackAndWhite}
        className={`rounded-full px-4 py-1.5 text-[0.6875rem] font-medium tracking-[0.18em] uppercase transition-colors duration-300 ${
          !blackAndWhite ? 'bg-paper text-ink' : 'text-paper-dim hover:text-paper'
        }`}
      >
        Couleur
      </button>
    </div>
  );
}

function BlackAndWhiteToggle({
  active,
  onToggle,
  className = '',
}: {
  active: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      className={`eyebrow absolute right-4 bottom-4 rounded-full bg-ink/70 px-4 py-2 text-paper backdrop-blur-md transition-colors duration-300 hover:bg-ink/90 ${className}`}
      aria-pressed={active}
    >
      {active ? 'Couleur' : 'N&B'}
    </button>
  );
}
