import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { TierPledgeForm } from '@/components/book-preorder/TierPledgeForm';
import { formatPrice } from '@/lib/format';
import type { BookPreorderTierRow } from '@/types/database';

type TierCardProps = {
  tier: BookPreorderTierRow;
  checkoutEnabled: boolean;
};

/**
 * Une ligne par palier — vignette + contenu côte à côte, sur le modèle des
 * contreparties Ulule (visuel, prix, description, puis le choix de la
 * quantité et l'appel à l'action).
 */
export function TierCard({ tier, checkoutEnabled }: TierCardProps) {
  const t = useTranslations(`bookPreorder.tiers.${tier.slug}`);
  const common = useTranslations('bookPreorder.tierCommon');
  const remaining = tier.stock_limit !== null ? Math.max(0, tier.stock_limit - tier.claimed_count) : null;
  const soldOut = remaining === 0;

  return (
    <div className="flex flex-col gap-6 border border-ink-line p-6 sm:flex-row sm:p-7">
      <div className="relative aspect-3/4 w-full shrink-0 overflow-hidden bg-ink-soft sm:w-36">
        <Image
          src="/placeholders/dune-45.svg"
          alt=""
          fill
          sizes="144px"
          className="object-cover opacity-60"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-4">
          <p className="eyebrow">{t('name')}</p>
          {remaining !== null ? (
            <p className="eyebrow text-accent">
              {soldOut ? common('soldOut') : common('remaining', { count: remaining })}
            </p>
          ) : null}
        </div>

        <p className="mt-3 font-display text-3xl font-light text-paper">
          {tier.is_donation ? common('donationLabel') : formatPrice(tier.price_cents)}
        </p>

        <p className="mt-3 text-sm leading-relaxed text-paper-dim">{t('description')}</p>

        <div className="mt-6 sm:max-w-xs">
          <TierPledgeForm tier={tier} checkoutEnabled={checkoutEnabled} soldOut={soldOut} />
        </div>
      </div>
    </div>
  );
}
