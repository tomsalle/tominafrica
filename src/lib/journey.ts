/**
 * Repères du voyage Paris → Le Cap, réutilisés partout où une photo est
 * située dans le temps : « Jour 079 · Togo · 03.02.2025 ».
 *
 * Seuls des faits sont affichés (date de prise de vue, pays) ; le numéro de
 * jour en découle. Rien n'est inventé quand une photo n'a pas de date.
 */

export const JOURNEY_START = '2024-11-17'; // départ de Paris
// Arrivée au Cap : mi-mai 2025 (« six mois », « novembre 2024 — mai 2025 »).
// Date exacte à confirmer par Tom — elle ne sert qu'à la ligne de parcours.
export const JOURNEY_END = '2025-05-17';
export const JOURNEY_COUNTRIES = 18;
export const JOURNEY_KM = 25_000;

const DAY_MS = 24 * 60 * 60 * 1000;

function toUtc(iso: string): number {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

export const JOURNEY_DAYS = Math.round((toUtc(JOURNEY_END) - toUtc(JOURNEY_START)) / DAY_MS) + 1;

/** Jour du voyage (1 = départ), ou null hors voyage / sans date. */
export function journeyDay(takenAt: string | null): number | null {
  if (!takenAt) return null;
  const day = Math.round((toUtc(takenAt) - toUtc(JOURNEY_START)) / DAY_MS) + 1;
  return day >= 1 && day <= JOURNEY_DAYS ? day : null;
}

/** Position 0–1 d'un jour sur la ligne de parcours. */
export function journeyProgress(day: number): number {
  return Math.min(1, Math.max(0, (day - 1) / (JOURNEY_DAYS - 1)));
}

export function formatJourneyDay(day: number): string {
  return String(day).padStart(3, '0');
}

/** « 03.02.2025 » — notation de carnet, identique en français et en anglais. */
export function formatFieldDate(takenAt: string | null): string | null {
  if (!takenAt) return null;
  const [y, m, d] = takenAt.slice(0, 10).split('-');
  return y && m && d ? `${d}.${m}.${y}` : null;
}

export function countryName(code: string | null, locale: string): string | null {
  if (!code) return null;
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(code.toUpperCase()) ?? null;
  } catch {
    return null;
  }
}
