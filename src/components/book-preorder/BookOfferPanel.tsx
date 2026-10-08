import { useTranslations } from 'next-intl';
import { FundingProgress } from '@/components/book-preorder/FundingProgress';
import { CalendarIcon, GiftIcon, UsersIcon } from '@/components/book-preorder/icons';
import { Link } from '@/i18n/navigation';
import type { PreorderStepState } from '@/lib/book-preorder/config';
import type { BookOffer } from '@/lib/book-preorder/page-data';
import { formatPrice } from '@/lib/format';

export const FORMULAS_PATH = '/precommande-livre/formules';

/**
 * L'article mis en avant dès l'arrivée : le livre, son prix, un seul bouton.
 * Le choix des formules (cartes, affiche, duo…) se fait sur la page suivante.
 */
export function BookOfferPanel({
  offer,
  count,
  stepState,
  ordersCount,
  closed,
  daysLeft,
}: {
  offer: BookOffer | null;
  count: number;
  stepState: PreorderStepState;
  ordersCount: number;
  closed: boolean;
  daysLeft: number;
}) {
  const t = useTranslations('bookPreorder');

  return (
    <div className="flex flex-col">
      <p className="eyebrow">{t('product.eyebrow')}</p>
      <h2 className="mt-2 font-display text-4xl font-light text-paper">{t('product.name')}</h2>
      <p className="mt-2 hidden text-sm leading-relaxed text-paper-dim sm:block">{t('product.tagline')}</p>

      {offer && !closed ? (
        <div className="mt-4 sm:mt-6">
          <p className="flex items-baseline gap-3">
            <span className="font-display text-5xl leading-none font-light text-paper tabular-nums">
              {formatPrice(offer.priceCents)}
            </span>
            {offer.compareAtCents ? (
              <span className="text-lg text-paper-faint tabular-nums line-through">{formatPrice(offer.compareAtCents)}</span>
            ) : null}
          </p>
          {offer.remaining !== null ? (
            <p className="mt-3 inline-block bg-brand/25 px-2 py-1 text-xs font-medium text-paper">
              {t('product.earlyBirdLeft', { count: offer.remaining })}
            </p>
          ) : null}
        </div>
      ) : null}

      {closed ? (
        <div role="status" className="mt-5 border border-ink-line px-5 py-4">
          <p className="text-base text-paper">{t('closed.title')}</p>
          <p className="mt-1 text-sm leading-relaxed text-paper-dim">{t('closed.body')}</p>
        </div>
      ) : (
        <>
          <Link
            href={FORMULAS_PATH}
            className="mt-5 flex min-h-14 items-center justify-center bg-brand px-6 text-xs font-medium tracking-[0.24em] text-paper uppercase transition-[background-color,transform] duration-200 hover:bg-brand-hover active:scale-[0.98]"
          >
            {t('product.cta')}
          </Link>
          <p className="mt-3 text-center text-xs text-paper-faint">{t('product.reassurance')}</p>
          <p className="mt-4 flex items-center justify-center gap-2 text-sm text-paper">
            <GiftIcon className="size-4 shrink-0 text-brand-text" />
            {t('product.gift')}
          </p>
        </>
      )}

      <div className="mt-8 border-t border-ink-line pt-6">
        <FundingProgress count={count} stepState={stepState} />
        <p className="mt-4 flex items-center gap-2 text-sm text-paper-dim">
          <UsersIcon className="size-5 text-paper-faint" />
          {t('progress.ordersCount', { count: ordersCount })}
        </p>
        <p className="mt-2 flex items-center gap-2 text-sm text-paper-dim">
          <CalendarIcon className="size-5 text-paper-faint" />
          {closed ? t('deadline.ended') : `${t('deadline.daysLeft', { count: daysLeft })} · ${t('deadline.until')}`}
        </p>
      </div>
    </div>
  );
}
