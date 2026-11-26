'use client';

import { useLocale, useTranslations } from 'next-intl';
import { formatSlot, slotsForDay, type ExhibitionDay } from '@/lib/exhibition/event';

const DAY_KEYS: Record<string, 'friday' | 'saturday' | 'sunday'> = {
  '2026-11-27': 'friday',
  '2026-11-28': 'saturday',
  '2026-11-29': 'sunday',
};

/**
 * Choix d'un créneau de deux heures pour chaque jour du week-end coché.
 * Utilisé par le formulaire d'inscription et par la page envoyée par e-mail
 * aux inscrits qui n'ont pas encore de créneau.
 */
export function SlotPicker({
  days,
  value,
  onChange,
  error,
}: {
  days: readonly ExhibitionDay[];
  value: Partial<Record<ExhibitionDay, string>>;
  onChange: (day: ExhibitionDay, slotId: string) => void;
  error?: string | null;
}) {
  const t = useTranslations('expositionForm');
  const locale = useLocale();
  const slotDays = days.filter((day) => slotsForDay(day).length > 0);

  if (slotDays.length === 0) return null;

  return (
    <div className="space-y-6">
      {slotDays.map((day) => (
        <fieldset key={day} aria-describedby={error ? 'visit-slots-error' : undefined}>
          <legend className="eyebrow">{t('slotLabel', { day: t(`days.${DAY_KEYS[day]}`) })}</legend>
          <div className="mt-3 flex flex-wrap gap-3">
            {slotsForDay(day).map((slot) => (
              <label key={slot.id} className="cursor-pointer">
                <input
                  type="radio"
                  name={`slot-${day}`}
                  value={slot.id}
                  checked={value[day] === slot.id}
                  onChange={() => onChange(day, slot.id)}
                  className="peer sr-only"
                />
                <span className="flex min-h-11 items-center border border-ink-line px-4 text-sm text-paper-dim tabular-nums transition-colors duration-200 select-none peer-checked:border-brand peer-checked:bg-brand/20 peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-paper hover:border-paper-dim">
                  {formatSlot(slot, locale)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      {error ? (
        <p id="visit-slots-error" role="alert" className="text-sm text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}
