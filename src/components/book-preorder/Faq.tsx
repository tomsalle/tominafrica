import { useTranslations } from 'next-intl';

/** FAQ en accordéon natif (<details>/<summary>), sans JavaScript. */
export function Faq() {
  const t = useTranslations('bookPreorder.faq');

  const items = [
    { q: t('paymentQ'), a: t('paymentA'), placeholder: false },
    { q: t('deadlineQ'), a: t('deadlineA'), placeholder: false },
    { q: t('deliveryQ'), a: t('deliveryA'), placeholder: false },
    { q: t('promoQ'), a: t('promoA'), placeholder: false },
    { q: t('goalQ'), a: t('goalA'), placeholder: false },
    { q: t('contactQ'), a: t('contactA'), placeholder: false },
  ];

  return (
    <div>
      <h2 className="font-display text-3xl font-light text-paper sm:text-4xl">{t('title')}</h2>

      <div className="mt-8 divide-y divide-ink-line border-y border-ink-line">
        {items.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="group/row flex cursor-pointer list-none items-center justify-between gap-4 text-base text-paper">
              {item.q}
              <span className="shrink-0 text-paper-faint transition-[color,transform] duration-300 group-open:rotate-45 group-hover/row:text-brand-text">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-paper-dim">
              {item.placeholder ? <mark className="bg-accent/15 px-1.5 py-0.5 text-accent">{item.a}</mark> : item.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
