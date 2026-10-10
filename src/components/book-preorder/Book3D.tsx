'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, type PointerEvent } from 'react';

// Pose au repos : trois quarts, pour montrer l'épaisseur du livre.
const REST = { x: 6, y: -20 };
// Amplitude du suivi du pointeur (degrés).
const TILT = { x: 12, y: 22 };
// Lissage par image : plus petit = plus lent et plus doux.
const EASE = 0.1;

/**
 * Le livre en 3D, en CSS seul : couverture, dos, tranche et épaisseur des
 * pages. Sur ordinateur il suit la souris ; au doigt, on le fait pivoter en
 * glissant horizontalement. Le bouton « Voir le dos » le retourne partout.
 * Animations coupées si l'utilisateur a demandé à réduire les animations.
 */
export function Book3D({
  frontSrc,
  backSrc,
  frontAlt,
  backAlt,
}: {
  frontSrc: string;
  backSrc: string;
  frontAlt: string;
  backAlt: string;
}) {
  const t = useTranslations('bookPreorder.book3d');
  const bookRef = useRef<HTMLDivElement>(null);
  const target = useRef({ ...REST });
  const current = useRef({ ...REST });
  // Demi-tours effectués : pair = couverture, impair = dos.
  const halfTurns = useRef(0);
  const drag = useRef<{ startX: number } | null>(null);
  const frame = useRef<number | null>(null);
  const reducedMotion = useRef(false);
  const [showBack, setShowBack] = useState(false);

  // Une seule boucle d'animation, relancée à la demande et arrêtée au repos.
  function render() {
    const book = bookRef.current;
    if (!book) return;
    const c = current.current;
    const goal = target.current;
    const k = reducedMotion.current ? 1 : EASE;
    c.x += (goal.x - c.x) * k;
    c.y += (goal.y - c.y) * k;
    book.style.transform = `rotateX(${c.x.toFixed(2)}deg) rotateY(${c.y.toFixed(2)}deg)`;
    // Reflet qui glisse sur la couverture selon l'angle.
    const facing = ((((c.y + 90) % 180) + 180) % 180) - 90;
    book.style.setProperty('--sheen', `${50 + (facing / 60) * 40}%`);
    if (Math.abs(goal.x - c.x) > 0.05 || Math.abs(goal.y - c.y) > 0.05) {
      frame.current = requestAnimationFrame(render);
    } else {
      frame.current = null;
    }
  }

  function animate() {
    if (frame.current === null) frame.current = requestAnimationFrame(render);
  }

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      reducedMotion.current = query.matches;
    };
    sync();
    query.addEventListener('change', sync);
    render();
    return () => {
      query.removeEventListener('change', sync);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const base = () => halfTurns.current * 180;

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion.current) return;
    const rect = event.currentTarget.getBoundingClientRect();

    if (event.pointerType === 'mouse') {
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      target.current = { x: REST.x - py * TILT.x * 2, y: base() + REST.y + px * TILT.y * 2 };
      animate();
      return;
    }

    // Au doigt : glisser horizontalement fait tourner le livre.
    if (drag.current) {
      const dx = event.clientX - drag.current.startX;
      target.current = { x: REST.x, y: base() + REST.y + (dx / rect.width) * 220 };
      animate();
    }
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse') drag.current = { startX: event.clientX };
  }

  function settle() {
    if (drag.current) {
      // Au relâcher, le livre retombe sur la face la plus proche.
      halfTurns.current = Math.round((target.current.y - REST.y) / 180);
      drag.current = null;
      setShowBack(Math.abs(halfTurns.current) % 2 === 1);
    }
    target.current = { x: REST.x, y: base() + REST.y };
    animate();
  }

  function toggle() {
    halfTurns.current += 1;
    setShowBack(Math.abs(halfTurns.current) % 2 === 1);
    target.current = { x: REST.x, y: base() + REST.y };
    animate();
  }

  return (
    <div
      className="book3d-stage relative h-full w-full touch-pan-y select-none"
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={settle}
      onPointerCancel={settle}
      onPointerLeave={settle}
    >
      <div className="book3d-shadow" aria-hidden />

      <div ref={bookRef} className="book3d">
        <div className="book3d-face book3d-front">
          <Image
            src={frontSrc}
            alt={showBack ? '' : frontAlt}
            fill
            priority
            sizes="(min-width: 1024px) 18rem, 45vw"
            className="object-cover"
          />
          <span className="book3d-sheen" aria-hidden />
        </div>
        <div className="book3d-face book3d-back">
          <Image
            src={backSrc}
            alt={showBack ? backAlt : ''}
            fill
            sizes="(min-width: 1024px) 18rem, 45vw"
            className="object-cover"
          />
        </div>
        <div className="book3d-spine" aria-hidden />
        <div className="book3d-edge book3d-edge-side" aria-hidden />
        <div className="book3d-edge book3d-edge-top" aria-hidden />
        <div className="book3d-edge book3d-edge-bottom" aria-hidden />
      </div>

      <button
        type="button"
        onClick={toggle}
        onPointerDown={(event) => event.stopPropagation()}
        aria-pressed={showBack}
        className="absolute right-3 bottom-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink/85 px-4 text-xs font-medium text-paper backdrop-blur-sm transition-[background-color,transform] duration-200 hover:bg-ink active:scale-[0.97]"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5" />
        </svg>
        {showBack ? t('showFront') : t('showBack')}
      </button>
    </div>
  );
}
