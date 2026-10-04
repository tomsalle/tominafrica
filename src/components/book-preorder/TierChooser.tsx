'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { PlusIcon } from '@/components/book-preorder/icons';
import { TierPledgeForm } from '@/components/book-preorder/TierPledgeForm';
import type { BookPreorderTierRow } from '@/types/database';

type TierChooserProps = {
  tier: BookPreorderTierRow;
  checkoutEnabled: boolean;
  soldOut: boolean;
};

/** Pastille « Choisir » comme sur Ulule ; un clic déplie quantité et paiement. */
export function TierChooser({ tier, checkoutEnabled, soldOut }: TierChooserProps) {
  const common = useTranslations('bookPreorder.tierCommon');
  const [open, setOpen] = useState(false);

  if (soldOut) {
    return (
      <span className="inline-flex min-h-10 items-center rounded-full bg-ink-line px-6 text-sm text-paper-faint">
        {common('soldOut')}
      </span>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full bg-brand px-6 text-sm font-medium text-paper transition-[background-color,transform] duration-200 hover:bg-brand-hover active:scale-[0.97]"
      >
        <PlusIcon className="size-4" />
        {common('choose')}
      </button>
    );
  }

  return (
    <div className="text-left">
      <TierPledgeForm tier={tier} checkoutEnabled={checkoutEnabled} soldOut={soldOut} />
    </div>
  );
}
