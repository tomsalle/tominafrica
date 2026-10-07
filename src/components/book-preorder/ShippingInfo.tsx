import { useTranslations } from 'next-intl';
import { BoxIcon, CalendarIcon } from '@/components/book-preorder/icons';

/** Date de livraison estimée et modes d'expédition, mis en page comme sur Ulule. */
export function ShippingInfo() {
  const t = useTranslations('bookPreorder.shipping');

  return (
    <div className="space-y-6 border-t border-ink-line pt-8">
      <div className="flex gap-3">
        <CalendarIcon className="mt-0.5 size-5 shrink-0 text-paper-faint" />
        <div>
          <p className="text-[0.6875rem] tracking-[0.14em] text-paper-faint uppercase">{t('estimateLabel')}</p>
          <p className="mt-1 text-sm text-paper">{t('estimate')}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <BoxIcon className="mt-0.5 size-5 shrink-0 text-paper-faint" />
        <div>
          <p className="text-[0.6875rem] tracking-[0.14em] text-paper-faint uppercase">{t('modesTitle')}</p>
          <ul className="mt-2 space-y-3 text-sm leading-relaxed text-paper-dim">
            <li>{t('modesPickup')}</li>
            <li>{t('modesVinted')}</li>
          </ul>
          <p className="mt-3 text-xs text-paper-faint">{t('modesNote')}</p>
        </div>
      </div>
    </div>
  );
}
