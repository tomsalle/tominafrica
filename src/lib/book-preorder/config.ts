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
// Fin de la précommande : le jour du vernissage, vendredi 27 novembre 2026,
// à minuit (heure de Paris) — demande de Tom. Après, plus aucun paiement ;
// les pages restent en ligne et annoncent la clôture.
export const BOOK_PREORDER_END = new Date('2026-11-28T00:00:00+01:00');
export const BOOK_PREORDER_LAST_DAY = '2026-11-27';

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

// Tirage et coûts d'impression d'après le devis de l'imprimeur KOPA
// (offre P0118119 du 8 octobre 2026, option couverture 250 g pelliculée +
// intérieur 108 pages), retenue par Tom : 250 exemplaires. Montants HT.
export const BOOK_PRINT_RUN = 250;

const PRINTING_DETAILS = [
  { labelKey: 'printingCopies', amountCents: 470_900 }, // 250 × 18,83 €
  { labelKey: 'printingDelivery', amountCents: 23_300 }, // livraison à Paris
  { labelKey: 'printingPackaging', amountCents: BOOK_PRINT_RUN * 13 }, // film individuel, 0,13 € / livre
] as const;

export type BudgetDetail = { labelKey: (typeof PRINTING_DETAILS)[number]['labelKey']; amountCents: number };
export type BudgetLine = {
  labelKey: 'printing' | 'publisher' | 'otherFees';
  amountCents: number;
  details?: readonly BudgetDetail[];
};

/** Répartition du budget du livre (fixe : le tirage est arrêté à 250 exemplaires). */
export function getPreorderBudget(): { lines: BudgetLine[]; totalCents: number } {
  const lines: BudgetLine[] = [
    {
      labelKey: 'printing',
      amountCents: PRINTING_DETAILS.reduce((sum, d) => sum + d.amountCents, 0),
      details: PRINTING_DETAILS,
    },
    { labelKey: 'publisher', amountCents: 40_000 }, // Accompagnement maison d'édition
    { labelKey: 'otherFees', amountCents: 50_500 }, // Autres frais (ISBN, livres offerts)
  ];
  return { lines, totalCents: lines.reduce((sum, line) => sum + line.amountCents, 0) };
}
