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
 * Compteur par étapes : « N préventes sur {palier en cours} », pastille
 * « Étape X sur 3 », puis une barre en trois segments (50 · 100 · 200) qui se
 * remplissent l'un après l'autre. Le chiffre et la barre montent une seule
 * fois, à l'entrée dans le viewport.
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
              : t('stepChip', { current: currentIndex + 1, total: steps.length })}
          </p>
        </div>
      </div>

      <div
        className="mt-6 grid gap-1"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
        role="img"
        aria-label={t('stepsAria', { count, steps: steps.join(', ') })}
      >
        {steps.map((step, index) => {
          const from = index === 0 ? 0 : (steps[index - 1] ?? 0);
          const fill = Math.min(1, Math.max(0, (count - from) / (step - from)));
          return (
            <div key={step}>
              <div className="h-1.5 overflow-hidden bg-ink-line">
                <div
                  className="h-full origin-left bg-brand transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    transform: `scaleX(${started ? fill : 0})`,
                    transitionDelay: started ? `${index * 150}ms` : undefined,
                  }}
                />
              </div>
              <p
                className={`mt-2 text-right text-xs tabular-nums ${
                  index === currentIndex ? 'text-paper' : count >= step ? 'text-brand-text' : 'text-paper-faint'
                }`}
              >
                {step}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
