'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, type PointerEvent } from 'react';

// Pose au repos : trois quarts, bord libre vers soi pour montrer la tranche des pages.
const REST = { x: 8, y: -24 };
// Amplitude du suivi de la souris (degrés).
const TILT = { x: 10, y: 20 };
// Ouverture de la couverture au survol (degrés) : on aperçoit les pages.
const OPEN = 14;
// Ressort : raideur et amortissement (léger rebond, comme un objet réel).
const STIFFNESS = 0.055;
const DAMPING = 0.3;
// Direction de la lumière (degrés autour de l'axe vertical).
const LIGHT = -20;

type Spring = { pos: number; vel: number; target: number };
const spring = (value: number): Spring => ({ pos: value, vel: 0, target: value });
const rad = (deg: number) => (deg * Math.PI) / 180;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Le livre en 3D, façon magazine piqué : fin, couverture souple qui s'entrouvre
 * au survol, lumière qui change avec l'angle, ombre portée qui suit. Sur
 * ordinateur il suit la souris ; au doigt, on le fait pivoter en glissant. Le
 * bouton « Voir le dos » le retourne, avec un léger arc comme à la main.
 * Tout est figé si l'utilisateur a demandé à réduire les animations.
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
  const stageRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const springs = useRef({ x: spring(REST.x), y: spring(REST.y), open: spring(0) });
  // Demi-tours effectués : pair = couverture, impair = dos.
  const halfTurns = useRef(0);
  const drag = useRef<{ startX: number } | null>(null);
  const frame = useRef<number | null>(null);
  const reducedMotion = useRef(false);
  const [showBack, setShowBack] = useState(false);

  function step() {
    const stage = stageRef.current;
    const book = bookRef.current;
    if (!stage || !book) return;
    const s = springs.current;
    let moving = false;

    for (const sp of [s.x, s.y, s.open]) {
      if (reducedMotion.current) {
        sp.pos = sp.target;
        sp.vel = 0;
        continue;
      }
      sp.vel += (sp.target - sp.pos) * STIFFNESS - sp.vel * DAMPING;
      sp.pos += sp.vel;
      if (Math.abs(sp.vel) > 0.01 || Math.abs(sp.target - sp.pos) > 0.05) moving = true;
    }
    // Une couverture ne se referme pas au-delà de « fermée » : sinon, avec le
    // rebond du ressort, elle traverserait les pages (flash clair).
    if (s.open.pos < 0) {
      s.open.pos = 0;
      s.open.vel = 0;
    }

    const x = s.x.pos;
    const y = s.y.pos;
    // Arc pendant un retournement : le livre se soulève puis se repose.
    const remaining = clamp(Math.abs(s.y.target - y) / 180, 0, 1);
    const lift = Math.sin(remaining * Math.PI);

    book.style.transform =
      `translate3d(0, ${(-lift * 6).toFixed(2)}%, ${(lift * 50).toFixed(1)}px) ` +
      `rotateX(${(x + lift * 6).toFixed(2)}deg) rotateY(${y.toFixed(2)}deg) rotateZ(${(lift * 3).toFixed(2)}deg)`;

    // La couverture visible s'entrouvre (avant ou arrière selon la face montrée).
    const backVisible = Math.abs(halfTurns.current) % 2 === 1;
    const open = s.open.pos;
    book.style.setProperty('--open-front', `${backVisible ? 0 : open.toFixed(2)}deg`);
    book.style.setProperty('--open-back', `${backVisible ? open.toFixed(2) : 0}deg`);
    // Les pages intérieures n'existent que couverture entrouverte : fermée,
    // elles pourraient transparaître à travers elle.
    book.style.setProperty('--pages-front', !backVisible && open > 0.3 ? 'visible' : 'hidden');
    book.style.setProperty('--pages-back', backVisible && open > 0.3 ? 'visible' : 'hidden');

    // Lumière : chaque face s'assombrit quand elle se détourne de la lampe.
    const front = Math.cos(rad(y - LIGHT));
    const back = Math.cos(rad(y + 180 - LIGHT));
    book.style.setProperty('--shade-front', (0.6 * (1 - clamp(front, 0, 1))).toFixed(3));
    book.style.setProperty('--shade-back', (0.6 * (1 - clamp(back, 0, 1))).toFixed(3));
    book.style.setProperty('--sheen', `${(50 + Math.sin(rad(y - LIGHT)) * 70).toFixed(1)}%`);

    // Ombre portée : plus étroite de profil, plus diffuse quand le livre se soulève.
    stage.style.setProperty('--shadow-scale', (0.35 + 0.65 * Math.abs(Math.cos(rad(y)))).toFixed(3));
    stage.style.setProperty('--shadow-x', `${(Math.sin(rad(y)) * -6).toFixed(2)}%`);
    stage.style.setProperty('--shadow-opacity', (1 - lift * 0.55).toFixed(3));

    frame.current = moving ? requestAnimationFrame(step) : null;
  }

  function animate() {
    if (frame.current === null) frame.current = requestAnimationFrame(step);
  }

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      reducedMotion.current = query.matches;
    };
    sync();
    query.addEventListener('change', sync);
    step();
    return () => {
      query.removeEventListener('change', sync);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const base = () => halfTurns.current * 180;

  function aim(x: number, y: number, open: number) {
    const s = springs.current;
    s.x.target = x;
    s.y.target = y;
    s.open.target = open;
    animate();
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion.current) return;
    const rect = event.currentTarget.getBoundingClientRect();

    if (event.pointerType === 'mouse') {
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      aim(REST.x - py * TILT.x * 2, base() + REST.y + px * TILT.y * 2, OPEN);
      return;
    }

    // Au doigt : glisser horizontalement fait tourner le livre.
    if (drag.current) {
      const dx = event.clientX - drag.current.startX;
      aim(REST.x, base() + REST.y + (dx / rect.width) * 220, 0);
    }
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse') drag.current = { startX: event.clientX };
  }

  function settle() {
    if (drag.current) {
      // Au relâcher, le livre retombe sur la face la plus proche.
      halfTurns.current = Math.round((springs.current.y.target - REST.y) / 180);
      drag.current = null;
      setShowBack(Math.abs(halfTurns.current) % 2 === 1);
    }
    aim(REST.x, base() + REST.y, 0);
  }

  function toggle() {
    halfTurns.current += 1;
    setShowBack(Math.abs(halfTurns.current) % 2 === 1);
    aim(REST.x, base() + REST.y, 0);
  }

  return (
    <div
      ref={stageRef}
      className="book3d-stage relative h-full w-full touch-pan-y select-none"
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={settle}
      onPointerCancel={settle}
      onPointerLeave={settle}
    >
      <div className="book3d-shadow" aria-hidden />

      <div ref={bookRef} className="book3d">
        {/* Bloc de pages : on l'aperçoit quand une couverture s'entrouvre. */}
        <div className="book3d-page book3d-page-front" aria-hidden />
        <div className="book3d-page book3d-page-back" aria-hidden />
        <div className="book3d-spine" aria-hidden />
        <div className="book3d-edge book3d-edge-side" aria-hidden />
        <div className="book3d-edge book3d-edge-top" aria-hidden />
        <div className="book3d-edge book3d-edge-bottom" aria-hidden />

        {/* Couverture avant, articulée sur la pliure. */}
        <div className="book3d-cover book3d-cover-front">
          <div className="book3d-face">
            <Image
              src={frontSrc}
              alt={showBack ? '' : frontAlt}
              fill
              priority
              sizes="(min-width: 1024px) 18rem, 45vw"
              className="object-cover"
            />
            <span className="book3d-shade book3d-shade-front" aria-hidden />
            <span className="book3d-sheen" aria-hidden />
          </div>
          <div className="book3d-face book3d-inside" aria-hidden />
        </div>

        {/* Couverture arrière, articulée sur la pliure. */}
        <div className="book3d-cover book3d-cover-back">
          <div className="book3d-face book3d-face-back">
            <Image
              src={backSrc}
              alt={showBack ? backAlt : ''}
              fill
              sizes="(min-width: 1024px) 18rem, 45vw"
              className="object-cover"
            />
            <span className="book3d-shade book3d-shade-back" aria-hidden />
            <span className="book3d-sheen" aria-hidden />
          </div>
          <div className="book3d-face book3d-inside book3d-inside-back" aria-hidden />
        </div>
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
