import { useTranslations } from 'next-intl';
import { TierPledgeForm } from '@/components/book-preorder/TierPledgeForm';
import { formatPrice } from '@/lib/format';
import type { BookPreorderTierRow } from '@/types/database';

type TierCardProps = {
  tier: BookPreorderTierRow;
  checkoutEnabled: boolean;
};

/** Une carte par palier — même habillage que la carte « Le livre » sur notre-aventure. */
export function TierCard({ tier, checkoutEnabled }: TierCardProps) {
  const t = useTranslations(`bookPreorder.tiers.${tier.slug}`);
  const common = useTranslations('bookPreorder.tierCommon');
  const remaining = tier.stock_limit !== null ? Math.max(0, tier.stock_limit - tier.claimed_count) : null;
  const soldOut = remaining === 0;

  return (
    <div className="flex h-full flex-col border border-ink-line p-7">
      <div className="flex items-baseline justify-between gap-4">
        <p className="eyebrow">{t('name')}</p>
        {remaining !== null ? (
          <p className="eyebrow text-accent">
            {soldOut ? common('soldOut') : common('remaining', { count: remaining })}
          </p>
        ) : null}
      </div>

      <p className="mt-4 font-display text-3xl font-light text-paper">
        {tier.is_donation ? common('donationLabel') : formatPrice(tier.price_cents)}
      </p>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-paper-dim">{t('description')}</p>

      <div className="mt-6">
        <TierPledgeForm tier={tier} checkoutEnabled={checkoutEnabled} soldOut={soldOut} />
      </div>
    </div>
  );
}
