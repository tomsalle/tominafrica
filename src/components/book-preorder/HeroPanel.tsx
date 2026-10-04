import { useTranslations } from 'next-intl';
import { FundingProgress } from '@/components/book-preorder/FundingProgress';
import { CalendarIcon, UsersIcon } from '@/components/book-preorder/icons';
import { formatPrice } from '@/lib/format';

type HeroPanelProps = {
  count: number;
  goal: number;
  pledgesCount: number;
  minPriceCents: number;
};

/**
 * Colonne de droite du haut de page, calquée sur Ulule : compteur et jauge,
 * contributions et livraison, gros bouton « Contribuer — à partir de… ».
 */
export function HeroPanel({ count, goal, pledgesCount, minPriceCents }: HeroPanelProps) {
  const t = useTranslations('bookPreorder.progress');

  return (
    <div className="flex flex-col">
      <FundingProgress count={count} goal={goal} />

      <div className="mt-6 flex items-center justify-between gap-4 text-sm text-paper-dim">
        <p className="flex items-center gap-2 whitespace-nowrap">
          <UsersIcon className="size-5 text-paper-faint" />
          {t('pledgesCount', { count: pledgesCount })}
        </p>
        <p className="flex items-center gap-2 whitespace-nowrap">
          <CalendarIcon className="size-5 shrink-0 text-paper-faint" />
          {t('deliveryShort')}
        </p>
      </div>

      <a
        href="#contreparties"
        className="mt-8 flex flex-col items-center justify-center bg-brand px-6 py-4 text-paper transition-[background-color,transform] duration-200 hover:bg-brand-hover active:scale-[0.98]"
      >
        <span className="text-xs font-medium tracking-[0.24em] uppercase">{t('contribute')}</span>
        <span className="mt-1 text-sm">{t('from', { price: formatPrice(minPriceCents) })}</span>
      </a>

      <p className="mt-4 text-center text-xs text-paper-faint underline underline-offset-4">{t('secureNote')}</p>
    </div>
  );
}
