/**
 * Estimation du nombre d'accompagnants d'une inscription à l'exposition.
 *
 * Le formulaire n'a pas de champ « nombre de personnes » : les visiteurs
 * l'écrivent dans leur message, librement (« +1 », « Nous serons deux »,
 * « 2 », « I will come with one friend »…). On lit ces formulations
 * courantes et, en cas de doute (« 2 ou 3 », « peut-être une personne »),
 * on garde l'hypothèse basse. Un chiffre seul (« 2 ») est compris comme le
 * nombre total de personnes, inscrit compris.
 */

const NUMBER_WORDS: Record<string, string> = {
  un: '1',
  une: '1',
  one: '1',
  deux: '2',
  two: '2',
  trois: '3',
  three: '3',
  quatre: '4',
  four: '4',
  cinq: '5',
  five: '5',
};

const PEOPLE = String.raw`(?:personnes?|people|persons?|peoples?)?`;

/** Règles appliquées dans l'ordre : la première qui reconnaît le message gagne. */
const RULES: { pattern: RegExp; guests: (n: number) => number }[] = [
  // « +1 », « Me +4 », « Moi + 1 personne », « avec mon +1 »
  { pattern: /\+\s*(\d+)/, guests: (n) => n },
  // « 3 autres personnes », « One other », « 1 person will join me », « 1 personne en plus »
  {
    pattern: new RegExp(
      String.raw`(\d+)\s*${PEOPLE}\s*(?:autres|other|accompagnantes|en plus|will join|will be joining|with me)`,
    ),
    guests: (n) => n,
  },
  // « Je viendrai avec 5 personnes », « With one friend », « accompagnée d'une personne »
  { pattern: /(?:avec|with|accompagnee?s? d(?:e\s+|'))\s*(\d+)/, guests: (n) => n },
  // « On sera 2 ou 3 », « 2 or 3 » : hypothèse basse
  { pattern: /(\d+)\s*(?:ou|or)\s*\d+/, guests: (n) => n - 1 },
  // « 3 personnes en tout », « 4 people total »
  { pattern: new RegExp(String.raw`(\d+)\s*${PEOPLE}\s*(?:en tout|total)`), guests: (n) => n - 1 },
  // « Nous serons deux », « We'll be 3 », « tous les 5 », « Pour 2 », « réservation : 2 »
  {
    pattern: /(?:serons|serions|sera|serai|we'?ll be|will be|tous les|pour|reservation)\D{0,15}?(\d+)/,
    guests: (n) => n - 1,
  },
  // « Une, Jean-Pierre » : nombre d'invités suivi de leurs noms
  { pattern: /^\W*(\d+)\s*,/, guests: (n) => n },
  // « 2 », « 1? », « 3 personnes », « 2 people » : nombre total
  { pattern: new RegExp(String.raw`^\W*(\d+)\s*${PEOPLE}\W*$`), guests: (n) => n - 1 },
];

/** Un accompagnant nommé sans chiffre : « avec mon copain », « Dom et moi », « accompagnée d'Arnaud ». */
const ONE_GUEST = /\b(?:copain|copine|compagne|compagnon|conjoint|conjointe|mari|et moi)\b|accompagnee?s? d(?:e\s+|')[a-z]/;

const MAX_GUESTS = 10;

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/\b(un|une|one|deux|two|trois|three|quatre|four|cinq|five)\b/g, (word) => NUMBER_WORDS[word] ?? word);
}

export function estimateGuests(message: string | null | undefined): number {
  if (!message?.trim()) return 0;
  const text = normalize(message);
  for (const rule of RULES) {
    const match = text.match(rule.pattern);
    if (match?.[1]) return Math.min(MAX_GUESTS, Math.max(0, rule.guests(Number(match[1]))));
  }
  return ONE_GUEST.test(text) ? 1 : 0;
}

/** Personnes supplémentaires inscrites dans le champ prénom : « Nicolas et Emilie » compte pour 2. */
export function extraNamedPeople(firstName: string): number {
  return firstName.split(/\s+(?:et|&|and)\s+|\s*[,+]\s*/i).filter((part) => part.trim()).length - 1;
}
