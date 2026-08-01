'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type TouchEvent } from 'react';
import { useFramePreference } from '@/lib/frame-preference';
import { photoSrc, SIZES } from '@/lib/images';
import type { PhotoRow } from '@/types/database';

/** Hauteur de mur représentée par la maquette « Sur un mur », en cm — sert
 *  à situer un tirage 18×24 ou 50×70 à sa vraie échelle relative. */
const WALL_HEIGHT_CM = 260;

/**
 * Bloc image de la page produit : la photo (ou son rendu encadré au format
 * choisi), une maquette « sur un mur » pour juger de l'échelle, et
 * l'agrandissement plein écran.
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
  const [slide, setSlide] = useState<0 | 1>(0);
  const { framed, format } = useFramePreference();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  const naturalRatio =
    photo.image_width && photo.image_height ? photo.image_width / photo.image_height : 3 / 2;
  // Encadré : la photo se recadre au ratio du format réellement commandé
  // (18×24, 30×40…), pas à celui du fichier — c'est ce que le client reçoit.
  const ratio = framed && format ? format.widthCm / format.heightCm : naturalRatio;

  function openZoom() {
    setMounted(true);
  }

  function closeZoom() {
    setVisible(false);
  }

  function onTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
    touchDeltaX.current = 0;
  }

  function onTouchMove(event: TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;
    touchDeltaX.current = (event.touches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
  }

  function onTouchEnd() {
    if (touchDeltaX.current < -40) setSlide(1);
    else if (touchDeltaX.current > 40) setSlide(0);
    touchStartX.current = null;
    touchDeltaX.current = 0;
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
      <figure id="photo-viewer" className="animate-photo-in scroll-mt-24 sm:scroll-mt-28">
        <div
          className="relative h-[55dvh] w-full overflow-hidden sm:h-[65dvh]"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(-${slide * 100}%)` }}
          >
            {/* Slide 1 : la photo, ou son rendu encadré au format choisi. */}
            <div className="flex h-full w-full shrink-0 items-center justify-center">
              {framed ? (
                <div
                  className="h-full max-w-full bg-black p-2 shadow-2xl shadow-black/50 sm:p-3"
                  style={{ aspectRatio: ratio }}
                >
                  <button
                    type="button"
                    onClick={openZoom}
                    className="relative block h-full w-full cursor-zoom-in overflow-hidden"
                    aria-label={`Agrandir « ${photo.title} »`}
                  >
                    <Image
                      src={photoSrc(photo.image_path, photo.image_width)}
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
              ) : (
                <button
                  type="button"
                  onClick={openZoom}
                  className="relative block h-full max-w-full cursor-zoom-in overflow-hidden bg-ink-soft"
                  style={{ aspectRatio: ratio }}
                  aria-label={`Agrandir « ${photo.title} »`}
                >
                  <Image
                    src={photoSrc(photo.image_path, photo.image_width)}
                    alt={photo.title}
                    fill
                    priority
                    sizes={SIZES.full}
                    className={`object-contain transition-[filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      blackAndWhite ? 'grayscale' : ''
                    }`}
                    {...(photo.blur_data_url
                      ? { placeholder: 'blur' as const, blurDataURL: photo.blur_data_url }
                      : {})}
                  />
                </button>
              )}
            </div>

            {/* Slide 2 : la même image sur un mur, à l'échelle du format
                choisi — pour juger de la taille avant d'acheter. */}
            <div className="h-full w-full shrink-0">
              <WallMockup photo={photo} framed={framed} ratio={ratio} format={format} blackAndWhite={blackAndWhite} />
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <SlideToggle slide={slide} onChange={setSlide} />
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
              src={photoSrc(photo.image_path, photo.image_width)}
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

/**
 * Maquette murale : mur et sol simulés (seul endroit du site à s'éloigner du
 * fond noir — on représente une vraie pièce, pas l'interface), avec le
 * tirage positionné à l'échelle réelle du format choisi.
 */
function WallMockup({
  photo,
  framed,
  ratio,
  format,
  blackAndWhite,
}: {
  photo: PhotoRow;
  framed: boolean;
  ratio: number;
  format: { widthCm: number; heightCm: number } | null;
  blackAndWhite: boolean;
}) {
  const heightCm = format?.heightCm ?? 40;
  const heightPercent = Math.min(70, (heightCm / WALL_HEIGHT_CM) * 100);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #eeebe3 0%, #e7e2d6 72%, #ddd5c2 72%, #cac1a7 100%)',
        }}
      />

      <div
        className="absolute left-1/2 top-[42%] max-w-[85%] -translate-x-1/2 -translate-y-1/2"
        style={{ height: `${heightPercent}%`, aspectRatio: ratio }}
      >
        <div
          className={`h-full w-full shadow-[0_25px_45px_rgba(0,0,0,0.35)] ${
            framed ? 'bg-black p-[3%]' : ''
          }`}
        >
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src={photoSrc(photo.image_path, photo.image_width)}
              alt=""
              fill
              sizes="480px"
              className={`object-cover ${blackAndWhite ? 'grayscale' : ''}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Bascule Photo / Sur un mur, au-dessus de l'aperçu couleur. */
function SlideToggle({
  slide,
  onChange,
}: {
  slide: 0 | 1;
  onChange: (value: 0 | 1) => void;
}) {
  return (
    <div role="group" aria-label="Aperçu" className="inline-flex rounded-full border border-ink-line p-1">
      <button
        type="button"
        onClick={() => onChange(0)}
        aria-pressed={slide === 0}
        className={`rounded-full px-4 py-1.5 text-[0.6875rem] font-medium tracking-[0.18em] uppercase transition-colors duration-300 ${
          slide === 0 ? 'bg-paper text-ink' : 'text-paper-dim hover:text-paper'
        }`}
      >
        Photo
      </button>
      <button
        type="button"
        onClick={() => onChange(1)}
        aria-pressed={slide === 1}
        className={`rounded-full px-4 py-1.5 text-[0.6875rem] font-medium tracking-[0.18em] uppercase transition-colors duration-300 ${
          slide === 1 ? 'bg-paper text-ink' : 'text-paper-dim hover:text-paper'
        }`}
      >
        Sur un mur
      </button>
    </div>
  );
}

/** Bascule N&B / Couleur, à côté du choix d'aperçu. */
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
