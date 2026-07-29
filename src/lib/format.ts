/**
 * Formatage — toutes les valeurs monétaires circulent en centimes entiers.
 */

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** 25000 → « 250 € » ; 25050 → « 250,50 € » */
export function formatPrice(cents: number): string {
  return priceFormatter.format(cents / 100);
}

/** 30 × 40 → « 30 × 40 cm » */
export function formatDimensions(widthCm: number, heightCm: number): string {
  const trim = (n: number) => (Number.isInteger(n) ? n.toString() : n.toFixed(1).replace('.', ','));
  return `${trim(widthCm)} × ${trim(heightCm)} cm`;
}

/** '2024-06-14' → « juin 2024 » */
export function formatMonthYear(isoDate: string | null): string | null {
  if (!isoDate) return null;
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** 48.8566 → « 48,857° N » */
export function formatCoordinate(value: number, axis: 'lat' | 'lng'): string {
  const hemisphere = axis === 'lat' ? (value >= 0 ? 'N' : 'S') : value >= 0 ? 'E' : 'O';
  return `${Math.abs(value).toFixed(3).replace('.', ',')}° ${hemisphere}`;
}

/**
 * Disponibilité d'une option de tirage, en texte lisible.
 * `editionSize` à null = tirage non limité.
 */
export function formatAvailability(
  editionSize: number | null,
  editionsSold: number,
): { label: string; remaining: number | null; soldOut: boolean } {
  if (editionSize === null) {
    return { label: 'Tirage non limité', remaining: null, soldOut: false };
  }

  const remaining = Math.max(0, editionSize - editionsSold);

  if (remaining === 0) {
    return { label: `Édition de ${editionSize} — épuisée`, remaining: 0, soldOut: true };
  }

  return {
    label: `Édition de ${editionSize} — ${remaining} restant${remaining > 1 ? 's' : ''}`,
    remaining,
    soldOut: false,
  };
}
