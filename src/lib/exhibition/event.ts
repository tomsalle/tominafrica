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

export const EXHIBITION_PATH = '/notre-aventure/exposition';

/** Posé quand une inscription réussit : la pop-in ne revient plus jamais. */
export const EXHIBITION_REGISTERED_KEY = 'tominafrica.exposition-inscrit.v1';

/** Après le dernier jour, l'exposition n'est plus mise en avant nulle part. */
export function isExhibitionUpcoming(now = new Date()): boolean {
  return now.toISOString().slice(0, 10) <= EXHIBITION.end;
}
