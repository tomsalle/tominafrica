import { useTranslations } from 'next-intl';
import { JOURNEY_CHAPTERS } from '@/content/journey-chapters';
import { formatJourneyDay, journeyDay, journeyProgress } from '@/lib/journey';

/**
 * Le voyage réduit à un trait : Paris à gauche, Le Cap à droite, un repère
 * à chaque frontière franchie (dates du livre), un point à l'endroit du
 * parcours où la photo a été prise. Ne rend rien sans date.
 */
export function JourneyLine({ takenAt, className = '' }: { takenAt: string | null; className?: string }) {
  const t = useTranslations('journey');
  const day = journeyDay(takenAt);
  if (!day) return null;

  const position = journeyProgress(day) * 100;

  return (
    <div className={className} role="img" aria-label={t('lineAria', { day })}>
      <div className="flex items-center gap-3 text-[0.6875rem] tracking-[0.14em] text-paper-faint uppercase">
        <span>{t('from')}</span>
        <div className="relative h-px flex-1 bg-ink-line">
          <div className="absolute inset-y-0 left-0 bg-paper-faint" style={{ width: `${position}%` }} />
          {JOURNEY_CHAPTERS.map((chapter) => {
            const entry = journeyDay(chapter.date);
            return entry ? (
              <span
                key={chapter.countryCode}
                aria-hidden
                className="absolute top-1/2 h-1.5 w-px -translate-y-1/2 bg-paper-faint/50"
                style={{ left: `${journeyProgress(entry) * 100}%` }}
              />
            ) : null;
          })}
          <span
            className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper"
            style={{ left: `${position}%` }}
          />
          <span
            className="absolute top-3 -translate-x-1/2 whitespace-nowrap text-paper tabular-nums"
            style={{ left: `${Math.min(88, Math.max(12, position))}%` }}
          >
            {t('day', { day: formatJourneyDay(day) })}
          </span>
        </div>
        <span>{t('to')}</span>
      </div>
    </div>
  );
}
