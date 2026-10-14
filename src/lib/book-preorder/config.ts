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
// Fin de la précommande : vendredi 20 novembre 2026 à minuit (heure de Paris),
// une semaine avant le vernissage — demande de Tom. Après, plus aucun
// paiement ; les pages restent en ligne et annoncent la clôture.
export const BOOK_PREORDER_END = new Date('2026-11-21T00:00:00+01:00');
export const BOOK_PREORDER_LAST_DAY = '2026-11-20';

export function isPreorderClosed(now = new Date()): boolean {
  return now.getTime() >= BOOK_PREORDER_END.getTime();
}

/** Jours restants, le jour en cours compris (1 = dernier jour). */
export function preorderDaysLeft(now = new Date()): number {
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

// Tirage et budget du livre, affichés volontairement arrondis (demande de Tom,
// 14 octobre 2026). Base de calcul, gardée ici pour mémoire :
//  - impression : devis KOPA au format 22 × 29,7 cm, au moins 1 200 € de moins
//    que l'offre P0118119 (4 709 € HT pour 250 ex.) → 3 509 € + livraison 233 €
//    + emballage 32,50 € = 3 774,50 € HT, soit 3 982,10 € TTC (TVA 5,5 %)
//    → affiché « 4 000 € » ;
//  - accompagnement maison d'édition : 800 € ;
//  - frais divers : 505 € + 15 € = 520 € → affiché « 500 € ».
export const BOOK_PRINT_RUN = 250;

export type BudgetLine = { labelKey: 'printing' | 'publisher' | 'otherFees'; amountCents: number };

/** Répartition du budget du livre (tirage de 250 exemplaires, montants arrondis). */
export function getPreorderBudget(): { lines: BudgetLine[]; totalCents: number } {
  const lines: BudgetLine[] = [
    { labelKey: 'printing', amountCents: 400_000 },
    { labelKey: 'publisher', amountCents: 80_000 },
    { labelKey: 'otherFees', amountCents: 50_000 },
  ];
  return { lines, totalCents: lines.reduce((sum, line) => sum + line.amountCents, 0) };
}
