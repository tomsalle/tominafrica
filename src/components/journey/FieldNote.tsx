import { useLocale, useTranslations } from 'next-intl';
import { countryName, formatFieldDate, formatJourneyDay, journeyDay } from '@/lib/journey';

type FieldNoteProps = {
  takenAt: string | null;
  countryCode: string | null;
  /** Lieu précis s'il est connu (« Brazzaville »), affiché à la place du pays. */
  place?: string | null;
  /** Masque la date complète : utile sous les vignettes, où le jour suffit. */
  compact?: boolean;
  className?: string;
};

/**
 * Note de terrain : « Jour 079 · Togo · 03.02.2025 ». Une ligne factuelle,
 * à la manière des métadonnées d'une planche contact — discrète de loin,
 * informative de près. Ne rend rien si la photo n'a ni date ni pays.
 */
export function FieldNote({ takenAt, countryCode, place, compact = false, className = '' }: FieldNoteProps) {
  const t = useTranslations('journey');
  const locale = useLocale();
  const day = journeyDay(takenAt);
  const where = place || countryName(countryCode, locale);
  const date = compact ? null : formatFieldDate(takenAt);

  const parts = [day ? t('day', { day: formatJourneyDay(day) }) : null, where, date].filter(Boolean);
  if (parts.length === 0) return null;

  return (
    <p className={`text-[0.6875rem] tracking-[0.14em] text-paper-faint uppercase tabular-nums ${className}`}>
      {parts.map((part, index) => (
        <span key={index}>
          {index > 0 ? <span aria-hidden className="mx-2 text-ink-line">/</span> : null}
          {part}
        </span>
      ))}
    </p>
  );
}
