'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { JOURNEY_CHAPTERS } from '@/content/journey-chapters';
import { countryName, JOURNEY_DAYS, journeyDay, journeyProgress } from '@/lib/journey';

const ENTRIES = JOURNEY_CHAPTERS.map((chapter) => ({
  code: chapter.countryCode,
  day: journeyDay(chapter.date) ?? 1,
}));

/**
 * Le Land Cruiser descend la route Paris → Le Cap au rythme du défilement :
 * une ligne fine sur le bord droit, un repère à chaque frontière (dates du
 * livre), et le pays traversé écrit sous la voiture. Position calculée à
 * chaque frame de défilement (transform uniquement), sans animation ajoutée.
 */
export function RoadTripScroll() {
  const t = useTranslations('journey');
  const locale = useLocale();
  const trackRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [country, setCountry] = useState(ENTRIES[0]?.code ?? 'ma');

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const track = trackRef.current;
      const car = carRef.current;
      const fill = fillRef.current;
      if (!track || !car || !fill) return;

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      const travel = track.clientHeight - car.offsetHeight;

      car.style.transform = `translate3d(-50%, ${progress * travel}px, 0)`;
      fill.style.transform = `scaleY(${progress})`;

      const day = 1 + progress * (JOURNEY_DAYS - 1);
      let current = ENTRIES[0]?.code ?? 'ma';
      for (const entry of ENTRIES) if (entry.day <= day) current = entry.code;
      setCountry((previous) => (previous === current ? previous : current));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-24 right-1 bottom-8 z-30 w-4 sm:top-28 sm:right-3 sm:w-5"
    >
      <span className="absolute top-0 left-1/2 hidden -translate-x-1/2 text-[0.5625rem] tracking-[0.14em] text-paper-faint uppercase [writing-mode:vertical-rl] sm:block">
        {t('from')}
      </span>

      <div ref={trackRef} className="absolute inset-x-0 top-0 bottom-0 sm:top-12 sm:bottom-14">
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-ink-line" />
        <div
          ref={fillRef}
          className="absolute inset-y-0 left-1/2 w-px origin-top -translate-x-1/2 bg-paper-faint"
          style={{ transform: 'scaleY(0)' }}
        />
        {ENTRIES.map((entry) => (
          <span
            key={entry.code}
            className="absolute left-1/2 h-px w-2 -translate-x-1/2 bg-paper-faint/60"
            style={{ top: `${journeyProgress(entry.day) * 100}%` }}
          />
        ))}

        <div ref={carRef} className="absolute top-0 left-1/2 flex flex-col items-center will-change-transform">
          <LandCruiserTopView />
          <span className="mt-2 hidden text-[0.5625rem] tracking-[0.14em] whitespace-nowrap text-paper uppercase [writing-mode:vertical-rl] sm:block">
            {countryName(country, locale)}
          </span>
        </div>
      </div>

      <span className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 text-[0.5625rem] tracking-[0.14em] text-paper-faint uppercase [writing-mode:vertical-rl] sm:block">
        {t('to')}
      </span>
    </div>
  );
}

/** Land Cruiser vu du dessus, avant vers le bas (cap au sud). */
function LandCruiserTopView() {
  return (
    <svg viewBox="0 0 14 24" className="h-6 w-3.5 sm:h-7 sm:w-4" fill="none">
      {/* roues */}
      <rect x="0" y="4" width="2" height="4" rx="0.6" fill="var(--color-paper-dim)" />
      <rect x="12" y="4" width="2" height="4" rx="0.6" fill="var(--color-paper-dim)" />
      <rect x="0" y="16" width="2" height="4" rx="0.6" fill="var(--color-paper-dim)" />
      <rect x="12" y="16" width="2" height="4" rx="0.6" fill="var(--color-paper-dim)" />
      {/* carrosserie */}
      <rect x="1.5" y="1" width="11" height="22" rx="2" fill="var(--color-ink)" stroke="var(--color-paper)" strokeWidth="1" />
      {/* galerie de toit */}
      <rect x="3.5" y="3.5" width="7" height="9" rx="0.5" stroke="var(--color-paper-dim)" strokeWidth="0.75" />
      <path d="M3.5 6.5h7M3.5 9.5h7" stroke="var(--color-paper-dim)" strokeWidth="0.5" />
      {/* pare-brise, à l'avant */}
      <rect x="3" y="15" width="8" height="3" rx="0.8" fill="var(--color-paper-dim)" />
      {/* phares */}
      <circle cx="4" cy="21.3" r="0.8" fill="var(--color-paper)" />
      <circle cx="10" cy="21.3" r="0.8" fill="var(--color-paper)" />
    </svg>
  );
}
