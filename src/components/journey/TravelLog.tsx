import { useLocale, useTranslations } from 'next-intl';
import { JOURNEY_CHAPTERS } from '@/content/journey-chapters';
import { countryName, formatFieldDate, formatJourneyDay, journeyDay } from '@/lib/journey';

/**
 * Le carnet de route : un chapitre du livre par pays, dans l'ordre du
 * voyage — date d'entrée, jour, pays, titre, quelques lignes. Chaque entrée
 * porte l'ancre de son pays, pour qu'une page photo puisse y renvoyer.
 */
export function TravelLog() {
  const t = useTranslations('journey');
  const locale = useLocale();
  const lang = locale === 'en' ? 'en' : 'fr';

  return (
    <section aria-labelledby="carnet-titre">
      <h2 id="carnet-titre" className="font-display text-3xl font-light text-paper sm:text-4xl">
        {t('logTitle')}
      </h2>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-paper-dim">{t('logIntro')}</p>

      <ol className="mt-12 border-t border-ink-line">
        {JOURNEY_CHAPTERS.map((chapter) => {
          const day = journeyDay(chapter.date);
          return (
            <li
              key={chapter.countryCode}
              id={chapter.countryCode}
              className="grid scroll-mt-32 grid-cols-1 gap-x-8 gap-y-2 border-b border-ink-line py-8 sm:grid-cols-[11rem_1fr]"
            >
              <p className="whitespace-nowrap text-[0.6875rem] tracking-[0.14em] text-paper-faint uppercase tabular-nums sm:pt-2">
                {day ? t('day', { day: formatJourneyDay(day) }) : null}
                <span className="mx-2 text-ink-line">/</span>
                {formatFieldDate(chapter.date)}
              </p>
              <div>
                <p className="eyebrow text-paper-dim">{countryName(chapter.countryCode, locale)}</p>
                <h3 className="mt-2 font-display text-2xl font-light text-paper">{chapter.title[lang]}</h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper-dim">{chapter.excerpt[lang]}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
