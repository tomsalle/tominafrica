/**
 * Codes ISO 3166-1 alpha-2 (minuscules) des 54 États africains, plus le
 * Sahara occidental — c'est le sous-ensemble de `@svg-maps/world` qu'on garde
 * pour la carte d'Afrique de la page produit.
 */
export const AFRICA_COUNTRY_CODES = [
  'dz', 'ao', 'bj', 'bw', 'bf', 'bi', 'cv', 'cm', 'cf', 'td',
  'km', 'cg', 'cd', 'ci', 'dj', 'eg', 'gq', 'er', 'sz', 'et',
  'ga', 'gm', 'gh', 'gn', 'gw', 'ke', 'ls', 'lr', 'ly', 'mg',
  'mw', 'ml', 'mr', 'mu', 'ma', 'mz', 'na', 'ne', 'ng', 'rw',
  'st', 'sn', 'sc', 'sl', 'so', 'za', 'ss', 'sd', 'tz', 'tg',
  'tn', 'ug', 'zm', 'zw', 'eh',
] as const;

/**
 * Cadrage sur l'Afrique dans le repère de `@svg-maps/world` (viewBox source
 * complète : « 0 0 1010 666 »). Mesuré une fois par bounding box réelle des
 * tracés des pays ci-dessus, avec une marge d'environ 6 %.
 */
export const AFRICA_VIEW_BOX = '390 336 262 290';
