import { useLocale, useTranslations } from 'next-intl';
import type { PublicContribution } from '@/lib/book-preorder/queries';

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['week', 7 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
];

function relativeTime(iso: string, locale: string) {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
  const format = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return format.format(Math.round(seconds / size), unit);
  }
  return format.format(0, 'minute');
}

/**
 * Liste « N contributions » d'Ulule : qui a contribué, pour quelle
 * contrepartie, et le message laissé. Seuls le nom affiché et le message
 * choisis par la personne sont publics.
 */
export function ContributionsList({ contributions, total }: { contributions: PublicContribution[]; total: number }) {
  const t = useTranslations('bookPreorder.contributions');
  const tiers = useTranslations('bookPreorder.tiers');
  const locale = useLocale();

  return (
    <section className="border-t border-ink-line pt-8">
      <h2 className="font-display text-3xl font-light text-paper">{t('title', { count: total })}</h2>

      {contributions.length === 0 ? (
        <p className="mt-4 text-sm leading-relaxed text-paper-dim">{t('empty')}</p>
      ) : (
        <ul className="mt-6 space-y-6">
          {contributions.map((item, index) => {
            const name = item.publicName || t('anonymous');
            const tierName = tiers.has(`${item.tierSlug}.name`) ? tiers(`${item.tierSlug}.name`) : item.tierSlug;

            return (
              <li key={`${item.createdAt}-${index}`} className="flex gap-3">
                <span
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-full border border-ink-line bg-ink-soft text-sm text-paper-dim uppercase"
                >
                  {item.publicName ? item.publicName.trim().charAt(0) : '·'}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate text-sm font-medium text-paper">{name}</p>
                    <time dateTime={item.createdAt} className="shrink-0 text-[0.6875rem] text-paper-faint">
                      {relativeTime(item.createdAt, locale)}
                    </time>
                  </div>
                  <p className="mt-0.5 text-xs text-paper-dim">
                    {item.isDonation ? (
                      t('donated')
                    ) : (
                      <>
                        {t('choseTier')} <span className="text-brand-text">{tierName}</span>
                      </>
                    )}
                  </p>
                  {item.publicMessage ? (
                    <p className="mt-3 bg-ink-soft px-4 py-3 text-sm leading-relaxed whitespace-pre-line break-words text-paper-dim">
                      {item.publicMessage}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
