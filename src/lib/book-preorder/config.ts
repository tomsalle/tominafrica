/**
 * Objectif de financement et détail des postes de dépense, donnés par Tom.
 * Ce sont les vrais chiffres de la campagne — à ajuster ici si Tom les
 * change avant la mise en ligne (voir flags.ts).
 *
 * L'objectif se mesure en NOMBRE de livres précommandés, par paliers, pas en
 * euros collectés — demande explicite de Tom. Le budget (voir
 * getPreorderBudget) reste affiché à titre d'information (« à quoi servira
 * le financement ») et suit l'objectif en cours, sans piloter la jauge.
 */
// Ouverture de la précommande : vendredi 16 octobre 2026 à 12 h (heure de
// Paris) — demande de Tom, pour l'annoncer sur Instagram et par e-mail. Avant,
// la page affiche un compte à rebours à la place des boutons de commande.
export const BOOK_PREORDER_START = new Date('2026-10-16T12:00:00+02:00');

export type PreorderPhase = 'before' | 'open' | 'closed';

export function getPreorderPhase(now: number = Date.now()): PreorderPhase {
  if (now < BOOK_PREORDER_START.getTime()) return 'before';
  if (BOOK_PREORDER_END !== null && now >= BOOK_PREORDER_END.getTime()) return 'closed';
  return 'open';
}

// Fin de la précommande. Fermée d'abord le 20 novembre 2026 à minuit, puis
// rouverte le 22 novembre SANS date de fin, à la demande de Tom : le livre
// reste en vente tant qu'il en reste. Pour refixer une fin, mettre une date
// ici (ex. new Date('2026-12-31T23:59:59+01:00')) : compte à rebours et
// clôture reviennent d'eux-mêmes.
export const BOOK_PREORDER_END: Date | null = null;

export function isPreorderClosed(now = new Date()): boolean {
  return BOOK_PREORDER_END !== null && now.getTime() >= BOOK_PREORDER_END.getTime();
}

/** Jours restants, le jour en cours compris (1 = dernier jour) ; null sans date de fin. */
export function preorderDaysLeft(now = new Date()): number | null {
  if (BOOK_PREORDER_END === null) return null;
  return Math.max(0, Math.ceil((BOOK_PREORDER_END.getTime() - now.getTime()) / 86_400_000));
}

// Paliers successifs, en nombre de préventes (demande de Tom, 2026-10-04) :
// la jauge vise le premier palier non atteint, comme les paliers d'Ulule.
export const BOOK_PREORDER_STEPS = [50, 100, 200] as const;

export type PreorderStepState = {
  /**
   * Paliers visibles uniquement : ceux déjà atteints et celui en cours. Les
   * suivants ne sont jamais envoyés au navigateur, pour qu'on ne puisse pas
   * les deviner avant d'avoir atteint l'objectif en cours (demande de Tom).
   */
  steps: readonly number[];
  /** Index du palier en cours dans `steps` ; `steps.length` quand tous sont atteints. */
  currentIndex: number;
  /** Palier visé par la jauge (le dernier si tous sont atteints). */
  target: number;
};

export function getPreorderStepState(count: number): PreorderStepState {
  const all = BOOK_PREORDER_STEPS;
  const found = all.findIndex((step) => count < step);
  const currentIndex = found === -1 ? all.length : found;
  const steps = all.slice(0, currentIndex + 1);
  const target = steps[Math.min(currentIndex, steps.length - 1)] ?? 0;
  return { steps, currentIndex, target };
}

// Tirage et budget du livre, affichés volontairement arrondis (demande de Tom).
// Base de calcul, gardée ici pour mémoire :
//  - impression : devis final KOPA P0118119 du 23 octobre 2026, format
//    22 × 29,7 cm, papier couché mat « bulky » (couverture 250 g pelliculée mat
//    anti-rayures, intérieur 130 g), 300 ex. : 4 049 € HT + livraison 233 €
//    + emballage individuel 39 € (0,13 € × 300) = 4 321 € HT, soit 4 558,66 €
//    TTC (TVA 5,5 %) → affiché « 4 600 € » ;
//  - accompagnement maison d'édition : 800 € ;
//  - frais divers : 505 € + 15 € = 520 € → affiché « 500 € ».
export const BOOK_PRINT_RUN = 300;

export type BudgetLine = { labelKey: 'printing' | 'publisher' | 'otherFees'; amountCents: number };

/** Répartition du budget du livre (tirage de 300 exemplaires, montants arrondis). */
export function getPreorderBudget(): { lines: BudgetLine[]; totalCents: number } {
  const lines: BudgetLine[] = [
    { labelKey: 'printing', amountCents: 460_000 },
    { labelKey: 'publisher', amountCents: 80_000 },
    { labelKey: 'otherFees', amountCents: 50_000 },
  ];
  return { lines, totalCents: lines.reduce((sum, line) => sum + line.amountCents, 0) };
}
