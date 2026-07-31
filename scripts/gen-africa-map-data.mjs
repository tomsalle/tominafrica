/**
 * Régénère src/lib/africa-map-data.ts à partir de @svg-maps/world.
 *
 *   npm install --no-save @svg-maps/world   (pas une dépendance du projet,
 *                                             seulement de ce script)
 *   node scripts/gen-africa-map-data.mjs
 *
 * Le paquet lui-même n'est pas importé au runtime de l'app (voir le
 * commentaire en tête du fichier généré) : ce script en extrait juste les
 * tracés des pays africains, une fois, vers un fichier statique versionné.
 */
import { readFileSync, writeFileSync } from 'node:fs';

// Doit rester identique à AFRICA_COUNTRY_CODES (src/lib/africa-countries.ts).
const AFRICA_COUNTRY_CODES = [
  'dz', 'ao', 'bj', 'bw', 'bf', 'bi', 'cv', 'cm', 'cf', 'td',
  'km', 'cg', 'cd', 'ci', 'dj', 'eg', 'gq', 'er', 'sz', 'et',
  'ga', 'gm', 'gh', 'gn', 'gw', 'ke', 'ls', 'lr', 'ly', 'mg',
  'mw', 'ml', 'mr', 'mu', 'ma', 'mz', 'na', 'ne', 'ng', 'rw',
  'st', 'sn', 'sc', 'sl', 'so', 'za', 'ss', 'sd', 'tz', 'tg',
  'tn', 'ug', 'zm', 'zw', 'eh',
];

const raw = readFileSync(
  new URL('../node_modules/@svg-maps/world/index.js', import.meta.url),
  'utf8',
);
const data = JSON.parse(raw.replace(/^export default /, '').trim().replace(/;\s*$/, ''));

const africaLocations = data.locations
  .filter((location) => AFRICA_COUNTRY_CODES.includes(location.id))
  .sort((a, b) => a.id.localeCompare(b.id));

const missing = AFRICA_COUNTRY_CODES.filter(
  (code) => !africaLocations.some((location) => location.id === code),
);
if (missing.length > 0) {
  console.warn(`⚠ codes absents du jeu de données source : ${missing.join(', ')}`);
}

const entries = africaLocations
  .map((l) => `  { id: '${l.id}', name: ${JSON.stringify(l.name)}, path: '${l.path.replace(/'/g, "\\'")}' },`)
  .join('\n');

const output = `/**
 * Tracés des pays africains, extraits une fois de @svg-maps/world
 * (CC-BY 4.0, Victor Cazanave — https://github.com/VictorCazanave/svg-maps).
 * Repère : viewBox source « ${data.viewBox} ». Voir AFRICA_VIEW_BOX
 * (africa-countries.ts) pour le recadrage utilisé à l'affichage.
 *
 * Copié en statique plutôt qu'importé au runtime : le paquet ne publie pas
 * de champ « type » dans son package.json, ce qui le rend instable selon le
 * bundler. Regénérer si besoin avec scripts/gen-africa-map-data.mjs.
 */
export type AfricaCountryPath = { id: string; name: string; path: string };

export const AFRICA_COUNTRY_PATHS: AfricaCountryPath[] = [
${entries}
];
`;

writeFileSync(new URL('../src/lib/africa-map-data.ts', import.meta.url), output);
console.log(`✓ ${africaLocations.length} pays écrits dans src/lib/africa-map-data.ts`);
