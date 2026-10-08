import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { TierPledgeForm } from '@/components/book-preorder/TierPledgeForm';
import { formatPrice } from '@/lib/format';
import type { BookPreorderTierRow } from '@/types/database';

// Visuel de chaque formule (fournis par Tom ; l'affiche est une composition).
const FORMULA_IMAGES: Record<string, string> = {
  'early-bird': '/precommande-livre/formules/livre.avif',
  livre: '/precommande-livre/formules/livre.avif',
  'livre-cartes-postales': '/precommande-livre/formules/livre-cartes-postales.avif',
  'livre-affiche-expo': '/precommande-livre/formules/livre-affiche-expo.avif',
  'pack-duo': '/precommande-livre/formules/pack-duo.avif',
  'pack-soutien': '/precommande-livre/formules/pack-soutien.avif',
};

/**
 * Une formule = un article : visuel, nom, ce qu'il contient, prix, puis
 * directement quantité et « Précommander » — pas d'étape intermédiaire.
 */
export function FormulaCard({
  tier,
  checkoutEnabled,
  compareAtCents = null,
  badge = null,
  closed = false,
}: {
  tier: BookPreorderTierRow;
  checkoutEnabled: boolean;
  closed?: boolean;
  compareAtCents?: number | null;
  badge?: string | null;
}) {
  const t = useTranslations(`bookPreorder.tiers.${tier.slug}`);
  const common = useTranslations('bookPreorder.tierCommon');
  const remaining = tier.stock_limit !== null ? Math.max(0, tier.stock_limit - tier.claimed_count) : null;
  const soldOut = remaining === 0;

  return (
    <article className={`flex flex-col border bg-ink-soft ${badge && !soldOut ? 'border-brand' : 'border-ink-line'}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        <Image
          src={FORMULA_IMAGES[tier.slug] ?? '/precommande-livre/formules/livre.avif'}
          alt=""
          fill
          sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 100vw"
          className={`object-contain ${soldOut ? 'opacity-40 grayscale' : ''}`}
        />
        {badge && !soldOut ? (
          <span className="absolute top-3 left-3 bg-brand px-2.5 py-1 text-[0.6875rem] font-medium tracking-[0.12em] text-paper uppercase">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-2xl leading-tight font-light text-paper">{t('name')}</h3>
        <p className="mt-2 text-sm leading-relaxed text-paper-dim">{t('description')}</p>

        <p className="mt-5 flex items-baseline gap-3">
          <span className="font-display text-3xl leading-none font-light text-paper tabular-nums">
            {formatPrice(tier.price_cents)}
          </span>
          {compareAtCents && !soldOut ? (
            <span className="text-sm text-paper-faint tabular-nums line-through">{formatPrice(compareAtCents)}</span>
          ) : null}
        </p>
        {remaining !== null ? (
          <p className={`mt-2 text-xs ${soldOut ? 'text-paper-faint' : 'text-brand-text'}`}>
            {soldOut ? common('soldOut') : common('remaining', { count: remaining })}
          </p>
        ) : null}

        <div className="mt-auto pt-6">
          <TierPledgeForm tier={tier} checkoutEnabled={checkoutEnabled} soldOut={soldOut} closed={closed} />
        </div>
      </div>
    </article>
  );
}
