import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { TierPledgeForm } from '@/components/book-preorder/TierPledgeForm';
import { formatPrice } from '@/lib/format';
import type { BookPreorderTierRow } from '@/types/database';

type TierCardProps = {
  tier: BookPreorderTierRow;
  checkoutEnabled: boolean;
  featured?: boolean;
};

/**
 * Carte de palier verticale, pour la colonne latérale — vignette avec prix
 * en médaillon, prix, nom, formulaire, description. Sur le modèle des cartes
 * de contrepartie Ulule, en version sombre/dorée.
 */
export function TierCard({ tier, checkoutEnabled, featured = false }: TierCardProps) {
  const t = useTranslations(`bookPreorder.tiers.${tier.slug}`);
  const common = useTranslations('bookPreorder.tierCommon');
  const remaining = tier.stock_limit !== null ? Math.max(0, tier.stock_limit - tier.claimed_count) : null;
  const soldOut = remaining === 0;

  return (
    <div className={`bg-ink-soft p-5 ${featured ? 'border border-accent/40' : ''}`}>
      {featured ? (
        <p className="eyebrow mb-3 flex items-center gap-1.5 text-accent">
          <span aria-hidden>★</span> {common('featured')}
        </p>
      ) : null}

      <div className="relative">
        <div className="relative aspect-4/5 w-full overflow-hidden bg-ink">
          <Image
            src="/precommande-livre/livre-ouvert.avif"
            alt=""
            fill
            sizes="(max-width: 1024px) 50vw, 22rem"
            className="object-cover opacity-90"
          />
        </div>
        <div className="absolute top-2 right-2 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-center text-[0.6875rem] leading-tight font-medium text-paper shadow-lg">
          {tier.is_donation ? common('donationLabel') : formatPrice(tier.price_cents)}
        </div>
      </div>

      <p className="mt-4 text-xs text-paper-faint uppercase tracking-wide">
        {tier.is_donation ? common('donationLabel') : common('priceFor', { price: formatPrice(tier.price_cents) })}
      </p>
      <p className="mt-1 font-display text-xl font-light text-paper">{t('name')}</p>

      {remaining !== null ? (
        <p className="mt-2 text-xs text-accent">
          {soldOut ? common('soldOut') : common('remaining', { count: remaining })}
        </p>
      ) : null}

      <div className="mt-4">
        <TierPledgeForm tier={tier} checkoutEnabled={checkoutEnabled} soldOut={soldOut} />
      </div>

      <p className="mt-4 text-xs leading-relaxed text-paper-dim">{t('description')}</p>
    </div>
  );
}
