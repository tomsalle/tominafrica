import { useTranslations } from 'next-intl';
import { journeyDay, journeyProgress } from '@/lib/journey';

/**
 * Le parcours complet en une ligne : un trait fin par photo prise ce jour-là,
 * un point plein pour celles montrées juste en dessous. On voit d'un coup
 * d'œil où, dans les six mois, se situent les images de la séquence.
 */
export function JourneyTimeline({
  allDates,
  highlightedDates,
}: {
  allDates: (string | null)[];
  highlightedDates: (string | null)[];
}) {
  const t = useTranslations('journey');
  const ticks = [...new Set(allDates.map(journeyDay).filter((d): d is number => d !== null))];
  const dots = [...new Set(highlightedDates.map(journeyDay).filter((d): d is number => d !== null))];

  return (
    <div className="flex items-center gap-4 text-[0.6875rem] tracking-[0.14em] text-paper-faint uppercase" aria-hidden>
      <span>{t('from')}</span>
      <div className="relative h-3 flex-1">
        <div className="absolute inset-x-0 top-1/2 h-px bg-ink-line" />
        {ticks.map((day) => (
          <span
            key={`t${day}`}
            className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-paper-faint/60"
            style={{ left: `${journeyProgress(day) * 100}%` }}
          />
        ))}
        {dots.map((day) => (
          <span
            key={`d${day}`}
            className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper"
            style={{ left: `${journeyProgress(day) * 100}%` }}
          />
        ))}
      </div>
      <span>{t('to')}</span>
    </div>
  );
}
