import { useTranslations } from 'next-intl';
import { BOOK_PREORDER_BUDGET_BREAKDOWN, BOOK_PREORDER_BUDGET_TOTAL_CENTS } from '@/lib/book-preorder/config';
import { formatPrice } from '@/lib/format';

/**
 * « À quoi servira votre précommande » — contenu réel donné par Tom (pas un
 * placeholder), purement informatif : ne pilote pas la jauge de progression
 * (voir FundingProgress, qui compte des livres, pas des euros). Rendu en
 * nuances de paper/accent plutôt que les couleurs vives du graphique fourni —
 * conforme à la charte du site (aucune couleur vive hors les photos).
 */
export function BudgetBreakdown() {
  const t = useTranslations('bookPreorder.budget');

  return (
    <div>
      <p className="eyebrow">{t('title')}</p>
      <p className="mt-3 font-display text-2xl font-light text-paper">
        {formatPrice(BOOK_PREORDER_BUDGET_TOTAL_CENTS)}
      </p>

      <ul className="mt-6 space-y-4">
        {BOOK_PREORDER_BUDGET_BREAKDOWN.map((item, index) => {
          const percent = Math.round((item.amountCents / BOOK_PREORDER_BUDGET_TOTAL_CENTS) * 100);
          // Trois nuances de paper, la première (le poste principal) en accent.
          const barClassName = index === 0 ? 'bg-accent' : 'bg-paper-dim';

          return (
            <li key={item.labelKey}>
              <div className="flex items-baseline justify-between gap-4 text-sm text-paper-dim">
                <span>{t(`items.${item.labelKey}`)}</span>
                <span className="shrink-0 text-paper-faint">
                  {formatPrice(item.amountCents)} · {percent}%
                </span>
              </div>
              <div className="mt-1.5 h-1 w-full overflow-hidden bg-ink-line">
                <div className={`h-full ${barClassName}`} style={{ width: `${percent}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
