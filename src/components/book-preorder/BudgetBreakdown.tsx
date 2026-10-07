import { useLocale, useTranslations } from 'next-intl';
import { getPreorderBudget } from '@/lib/book-preorder/config';
import { formatPrice } from '@/lib/format';

// Rouge de la page, puis deux gris du site : la couleur ne porte pas seule
// l'information, la légende donne le libellé, le montant et la part.
const SEGMENT_COLORS = ['var(--color-brand)', 'var(--color-paper-dim)', 'var(--color-paper-faint)'] as const;
const SWATCH_CLASSES = ['bg-brand', 'bg-paper-dim', 'bg-paper-faint'] as const;

// Rayon choisi pour que la circonférence vaille 100 : un segment de x % se
// dessine avec un stroke-dasharray de x.
const RADIUS = 15.9155;
const GAP = 0.8;

/**
 * « À quoi servira votre précommande » — camembert (donut) du budget, contenu
 * réel donné par Tom. Purement informatif : ne pilote pas la jauge de
 * progression (voir FundingProgress, qui compte des livres, pas des euros).
 */
export function BudgetBreakdown({ bookCount }: { bookCount: number }) {
  const t = useTranslations('bookPreorder.budget');
  const locale = useLocale();
  const percentFormat = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  // Le budget suit l'objectif en cours : le poste impression grossit avec le tirage.
  const { lines, totalCents } = getPreorderBudget(bookCount);
  const percents = lines.map((item) => (item.amountCents / totalCents) * 100);
  const segments = lines.map((item, index) => ({
    ...item,
    index,
    percent: percents[index] ?? 0,
    offset: percents.slice(0, index).reduce((sum, value) => sum + value, 0),
  }));

  const summary = segments
    .map((s) => `${t(`items.${s.labelKey}`, { count: bookCount })} : ${formatPrice(s.amountCents)}`)
    .join(', ');

  return (
    <section>
      <h2 className="font-display text-3xl font-light text-paper sm:text-4xl">{t('title')}</h2>

      <div className="mt-8 flex flex-col items-center gap-10 sm:flex-row sm:items-center sm:gap-12">
        <div className="relative size-52 shrink-0">
          <svg viewBox="0 0 42 42" className="size-full -rotate-90" role="img" aria-label={`${t('title')} — ${summary}`}>
            <circle cx="21" cy="21" r={RADIUS} fill="none" stroke="var(--color-ink-line)" strokeWidth="4" />
            {segments.map((s) => (
              <circle
                key={s.labelKey}
                cx="21"
                cy="21"
                r={RADIUS}
                fill="none"
                stroke={SEGMENT_COLORS[s.index]}
                strokeWidth="4"
                strokeDasharray={`${Math.max(0, s.percent - GAP)} ${100 - Math.max(0, s.percent - GAP)}`}
                strokeDashoffset={-s.offset}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="font-display text-3xl font-light text-paper tabular-nums">
              {formatPrice(totalCents)}
            </p>
            <p className="mt-1 max-w-[7rem] text-[0.6875rem] leading-tight tracking-wide text-paper-faint uppercase">
              {t('goalLabel')}
            </p>
          </div>
        </div>

        <ul className="w-full space-y-5">
          {segments.map((s) => (
            <li key={s.labelKey} className="flex items-start gap-3">
              <span aria-hidden className={`mt-1.5 size-2.5 shrink-0 ${SWATCH_CLASSES[s.index]}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-paper-dim">{t(`items.${s.labelKey}`, { count: bookCount })}</p>
                <p className="mt-0.5 text-sm text-paper-faint tabular-nums">
                  <span className="text-paper">{formatPrice(s.amountCents)}</span> · {percentFormat.format(s.percent)} %
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
