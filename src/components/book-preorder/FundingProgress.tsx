'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

type FundingProgressProps = {
  /** Nombre de livres déjà précommandés. */
  count: number;
  /** Objectif, en nombre de livres. */
  goal: number;
  /** Nombre de contributions payées (secondaire, affiché sous la barre). */
  pledgesCount: number;
};

/**
 * Jauge de progression façon Ulule : remplissage + montée en douceur du
 * nombre, déclenchés une seule fois à l'entrée dans le viewport (même
 * principe d'observation que Reveal.tsx, mais ici pour piloter l'animation
 * interne plutôt qu'un simple fondu).
 */
export function FundingProgress({ count, goal, pledgesCount }: FundingProgressProps) {
  const t = useTranslations('bookPreorder.progress');
  const ref = useRef<HTMLDivElement>(null);
  const [animatedCount, setAnimatedCount] = useState(0);
  const [started, setStarted] = useState(false);

  const percent = goal > 0 ? Math.min(100, Math.round((count / goal) * 100)) : 0;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setStarted(true);
        observer.disconnect();
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    const duration = 1200;
    const start = performance.now();

    let frame: number;
    function tick(now: number) {
      const progress = Math.min(1, (now - start) / duration);
      // Décélération douce — cohérente avec var(--ease-out-soft) ailleurs sur le site.
      const eased = 1 - (1 - progress) ** 3;
      setAnimatedCount(Math.round(eased * count));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [started, count]);

  return (
    <div ref={ref}>
      <div className="h-1.5 w-full overflow-hidden bg-ink-line">
        <div
          className="h-full bg-accent transition-[width] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: started ? `${percent}%` : '0%' }}
        />
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <p className="eyebrow">
          {t('count', { count: animatedCount, goal })}
        </p>
        <p className="eyebrow text-accent">{t('percent', { percent })}</p>
      </div>

      <p className="mt-2 text-xs text-paper-faint">{t('pledgesCount', { count: pledgesCount })}</p>
    </div>
  );
}
