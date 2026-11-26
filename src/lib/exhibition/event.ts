/**
 * L'exposition de Paris, en une seule source : accueil, menu, pop-in et
 * page d'inscription lisent tous ces mêmes informations.
 */
export const EXHIBITION = {
  start: '2026-11-27', // vernissage
  end: '2026-11-29',
  venue: 'Mecanicus',
  street: '70 avenue Jean Moulin',
  postalCode: '75014',
  city: 'Paris',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mecanicus%2C%2070%20avenue%20Jean%20Moulin%2C%2075014%20Paris',
  poster: { src: '/expo/poster.avif', width: 846, height: 1200 },
  /** Horaires d'ouverture, jour par jour (heure de Paris). */
  hours: [
    { day: '2026-11-27', open: '19:00', close: '22:00', opening: true },
    { day: '2026-11-28', open: '10:00', close: '17:00', opening: false },
    { day: '2026-11-29', open: '10:00', close: '17:00', opening: false },
  ],
} as const;

/** Jours d'ouverture, proposés au choix dans le formulaire d'inscription. */
export const EXHIBITION_DAYS = ['2026-11-27', '2026-11-28', '2026-11-29'] as const;
export type ExhibitionDay = (typeof EXHIBITION_DAYS)[number];

/**
 * Jours complets : plus d'inscription possible (case grisée dans le
 * formulaire, refus côté serveur). Vernissage complet le 25/11/2026.
 */
export const EXHIBITION_FULL_DAYS: readonly ExhibitionDay[] = ['2026-11-27'];

export function isExhibitionDayFull(day: string): boolean {
  return (EXHIBITION_FULL_DAYS as readonly string[]).includes(day);
}

/**
 * Créneaux de visite du week-end (deux heures, le dernier s'arrête à la
 * fermeture) : chaque visiteur en choisit un par jour, pour répartir le monde.
 * Identifiant : « 2026-11-28T10:00 ».
 */
export type ExhibitionSlot = { id: string; day: ExhibitionDay; start: string; end: string };

const SLOT_HOURS = 2;

export const EXHIBITION_SLOTS: readonly ExhibitionSlot[] = EXHIBITION.hours
  .filter((hours) => !hours.opening)
  .flatMap((hours) => {
    const toMinutes = (value: string) => Number(value.slice(0, 2)) * 60 + Number(value.slice(3, 5));
    const toClock = (minutes: number) =>
      `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
    const close = toMinutes(hours.close);
    const slots: ExhibitionSlot[] = [];
    for (let start = toMinutes(hours.open); start < close; start += SLOT_HOURS * 60) {
      const begin = toClock(start);
      slots.push({ id: `${hours.day}T${begin}`, day: hours.day, start: begin, end: toClock(Math.min(start + SLOT_HOURS * 60, close)) });
    }
    return slots;
  });

export function slotsForDay(day: string): ExhibitionSlot[] {
  return EXHIBITION_SLOTS.filter((slot) => slot.day === day);
}

export function findSlot(id: string): ExhibitionSlot | undefined {
  return EXHIBITION_SLOTS.find((slot) => slot.id === id);
}

/** Jours qui demandent un créneau (le week-end ; pas le vernissage). */
export function dayHasSlots(day: string): boolean {
  return EXHIBITION_SLOTS.some((slot) => slot.day === day);
}

/**
 * Garde un seul créneau valide par jour, et seulement pour les jours choisis.
 * Renvoie null s'il n'en reste aucun.
 */
export function cleanSlots(slotIds: readonly string[] | null | undefined, days: readonly string[] | null): string[] | null {
  const byDay = new Map<string, string>();
  for (const id of slotIds ?? []) {
    const slot = findSlot(id);
    if (slot && (days ?? []).includes(slot.day)) byDay.set(slot.day, slot.id);
  }
  return byDay.size ? [...byDay.values()].sort() : null;
}

/** « 14:00 » → « 14 h » (fr) ou « 2 pm » (en). */
export function formatHour(value: string, locale: string): string {
  const [h = 0, m = 0] = value.split(':').map(Number);
  if (locale === 'en') {
    const suffix = h >= 12 ? 'pm' : 'am';
    const h12 = h % 12 || 12;
    return m ? `${h12}:${String(m).padStart(2, '0')} ${suffix}` : `${h12} ${suffix}`;
  }
  return m ? `${h} h ${String(m).padStart(2, '0')}` : `${h} h`;
}

export function formatSlot(slot: ExhibitionSlot, locale: string): string {
  return `${formatHour(slot.start, locale)} – ${formatHour(slot.end, locale)}`;
}

export const EXHIBITION_PATH = '/notre-aventure/exposition';

/** Posé quand une inscription réussit : la pop-in ne revient plus jamais. */
export const EXHIBITION_REGISTERED_KEY = 'tominafrica.exposition-inscrit.v1';

/** Après le dernier jour, l'exposition n'est plus mise en avant nulle part. */
export function isExhibitionUpcoming(now = new Date()): boolean {
  return now.toISOString().slice(0, 10) <= EXHIBITION.end;
}
