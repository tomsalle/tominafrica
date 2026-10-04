import { useTranslations } from 'next-intl';
import { CheckIcon } from '@/components/book-preorder/icons';
import type { PreorderStepState } from '@/lib/book-preorder/config';

/**
 * « Les étapes de la prévente » — équivalent des paliers d'Ulule : chaque
 * palier est atteint, en cours (avec sa propre jauge) ou à venir.
 */
export function PreorderSteps({ count, stepState }: { count: number; stepState: PreorderStepState }) {
  const t = useTranslations('bookPreorder.steps');
  const { steps, currentIndex } = stepState;

  return (
    <section>
      <h2 className="font-display text-3xl font-light text-paper sm:text-4xl">{t('title')}</h2>
      <p className="mt-4 text-base leading-relaxed text-paper-dim">{t('intro')}</p>

      <ol className="mt-8 space-y-4">
        {steps.map((step, index) => {
          const reached = count >= step;
          const current = index === currentIndex;
          const from = index === 0 ? 0 : (steps[index - 1] ?? 0);
          const fill = Math.min(1, Math.max(0, (count - from) / (step - from)));

          return (
            <li
              key={step}
              className={`flex gap-4 border p-5 ${current ? 'border-brand bg-ink-soft' : 'border-ink-line'}`}
            >
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm tabular-nums ${
                  reached ? 'bg-brand text-paper' : current ? 'border border-brand text-paper' : 'border border-ink-line text-paper-faint'
                }`}
              >
                {reached ? <CheckIcon className="size-4" /> : index + 1}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className={`text-lg ${reached || current ? 'text-paper' : 'text-paper-dim'}`}>
                    {t('stepLabel', { index: index + 1, count: step })}
                  </p>
                  <p
                    className={`text-[0.6875rem] tracking-[0.14em] uppercase ${
                      reached ? 'text-brand-text' : current ? 'text-paper' : 'text-paper-faint'
                    }`}
                  >
                    {reached ? t('reached') : current ? t('current') : t('upcoming')}
                  </p>
                </div>

                {current ? (
                  <div className="mt-3">
                    <div className="h-1 overflow-hidden bg-ink-line">
                      <div className="h-full origin-left bg-brand" style={{ transform: `scaleX(${fill})` }} />
                    </div>
                    <p className="mt-2 text-right text-xs text-paper-faint tabular-nums">
                      {t('remaining', { count: Math.max(0, step - count) })} · {count} / {step}
                    </p>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
