import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { CalendarIcon, HeartIcon, StarIcon } from '@/components/book-preorder/icons';
import { TierChooser } from '@/components/book-preorder/TierChooser';
import { formatPrice } from '@/lib/format';
import type { BookPreorderTierRow } from '@/types/database';

type TierCardProps = {
  tier: BookPreorderTierRow;
  checkoutEnabled: boolean;
  featured?: boolean;
};

/**
 * Carte de contrepartie reprise d'Ulule : visuel avec prix en médaillon,
 * « Pour X € », nom, pastille « Choisir », puis détail, date et compteurs.
 */
export function TierCard({ tier, checkoutEnabled, featured = false }: TierCardProps) {
  const t = useTranslations(`bookPreorder.tiers.${tier.slug}`);
  const common = useTranslations('bookPreorder.tierCommon');
  const remaining = tier.stock_limit !== null ? Math.max(0, tier.stock_limit - tier.claimed_count) : null;
  const soldOut = remaining === 0;

  return (
    <article className={`border bg-ink-soft ${featured ? 'border-brand' : 'border-ink-line'}`}>
      {featured ? (
        <p className="flex items-center justify-center gap-1.5 pt-3 text-xs text-brand-text">
          <StarIcon className="size-3.5" />
          {common('featured')}
        </p>
      ) : null}

      <div className="relative m-3 aspect-[4/3] overflow-hidden bg-ink">
        <Image
          src="/precommande-livre/livre-ouvert.avif"
          alt=""
          fill
          sizes="(max-width: 1024px) 90vw, 22rem"
          className={`object-cover object-[50%_60%] ${soldOut ? 'opacity-40 grayscale' : ''}`}
        />
        <span className="absolute top-2.5 right-2.5 flex size-12 items-center justify-center rounded-full bg-brand text-xs font-medium text-paper tabular-nums">
          {formatPrice(tier.price_cents)}
        </span>
      </div>

      <div className="px-5 pt-1 pb-5 text-center">
        <p className="text-sm text-brand-text">{common('priceFor', { price: formatPrice(tier.price_cents) })}</p>
        <h3 className="mt-1 font-display text-2xl font-light text-paper">{t('name')}</h3>
        <div className="mt-4">
          <TierChooser tier={tier} checkoutEnabled={checkoutEnabled} soldOut={soldOut} />
        </div>
      </div>

      <div className="px-5 pb-5">
        <ul className="list-disc space-y-1 pl-4 text-sm leading-relaxed text-paper-dim marker:text-paper-faint">
          <li>{t('description')}</li>
        </ul>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 bg-ink px-2 py-1 text-xs text-paper-dim">
              <CalendarIcon className="size-3.5" />
              {common('deliveryChip')}
            </span>
            {tier.claimed_count > 0 ? (
              <span className="inline-flex items-center gap-1.5 bg-ink px-2 py-1 text-xs text-paper-dim">
                <HeartIcon className="size-3.5" />
                {common('reserved', { count: tier.claimed_count })}
              </span>
            ) : null}
          </div>
          {remaining !== null ? (
            <span className="text-[0.6875rem] tracking-[0.14em] text-paper-faint uppercase">
              {soldOut ? common('soldOut') : common('available', { count: remaining })}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
