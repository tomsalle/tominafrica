import { useTranslations } from 'next-intl';

/** « Livraison » — date estimée et modes d'expédition, sur le modèle d'Ulule. */
export function ShippingInfo() {
  const t = useTranslations('bookPreorder.shipping');

  return (
    <div className="border-t border-ink-line pt-6">
      <p className="eyebrow">{t('title')}</p>

      <div className="mt-4">
        <p className="text-xs tracking-wide text-paper-faint uppercase">{t('estimateLabel')}</p>
        <p className="mt-1 text-sm text-paper-dim">{t('estimate')}</p>
      </div>

      <div className="mt-4">
        <p className="text-xs tracking-wide text-paper-faint uppercase">{t('modesTitle')}</p>
        <p className="mt-1 text-sm text-paper-dim">
          <mark className="bg-accent/15 px-1.5 py-0.5 text-accent">{t('modesPlaceholder')}</mark>
        </p>
      </div>
    </div>
  );
}
