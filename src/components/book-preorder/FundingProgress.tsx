'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { PreorderStepState } from '@/lib/book-preorder/config';

type FundingProgressProps = {
  /** Nombre de livres déjà précommandés. */
  count: number;
  stepState: PreorderStepState;
};

/**
 * Compteur par étapes : « N préventes sur {objectif en cours} », pastille
 * « Étape X », puis la barre vers cet objectif seulement — les objectifs
 * suivants restent cachés tant que celui-ci n'est pas atteint.
 */
export function FundingProgress({ count, stepState }: FundingProgressProps) {
  const t = useTranslations('bookPreorder.progress');
  const ref = useRef<HTMLDivElement>(null);
  const [animatedCount, setAnimatedCount] = useState(0);
  const [started, setStarted] = useState(false);

  const { steps, currentIndex, target } = stepState;
  const allReached = currentIndex >= steps.length;

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
      const eased = 1 - (1 - progress) ** 3;
      setAnimatedCount(Math.round(eased * count));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [started, count]);

  return (
    <div ref={ref}>
      <div className="flex items-center gap-4">
        <p className="text-5xl leading-none font-light text-paper tabular-nums">{animatedCount}</p>
        <div>
          <p className="text-sm text-paper-dim">{t('countLabel', { goal: target })}</p>
          <p className="mt-1.5 inline-block bg-brand/25 px-2 py-0.5 text-[0.6875rem] font-medium text-paper">
            {allReached
              ? t('allStepsReached')
              : t('stepChip', { current: currentIndex + 1 })}
          </p>
        </div>
      </div>

      <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-ink-line">
        <div
          className="h-full origin-left rounded-full bg-brand transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `scaleX(${started ? Math.min(1, target > 0 ? count / target : 0) : 0})` }}
        />
      </div>
      <p className="mt-2 text-right text-xs text-paper-faint tabular-nums">
        {count} / {target}
      </p>
    </div>
  );
}
