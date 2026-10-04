/**
 * Objectif de financement et détail des postes de dépense, donnés par Tom.
 * Ce sont les vrais chiffres de la campagne — à ajuster ici si Tom les
 * change avant la mise en ligne (voir flags.ts).
 *
 * L'objectif se mesure en NOMBRE de livres précommandés, par paliers, pas en
 * euros collectés — demande explicite de Tom. Le montant (3 305 €) et
 * sa répartition restent affichés sur la page à titre d'information (« à quoi
 * servira votre précommande »), mais ne pilotent pas la jauge de progression.
 */
// Paliers successifs, en nombre de préventes (demande de Tom, 2026-10-04) :
// la jauge vise le premier palier non atteint, comme les paliers d'Ulule.
export const BOOK_PREORDER_STEPS = [50, 100, 200] as const;

export type PreorderStepState = {
  steps: readonly number[];
  /** Index du palier en cours ; `steps.length` quand tous sont atteints. */
  currentIndex: number;
  /** Palier visé par la jauge (le dernier si tous sont atteints). */
  target: number;
};

export function getPreorderStepState(count: number): PreorderStepState {
  const steps = BOOK_PREORDER_STEPS;
  const found = steps.findIndex((step) => count < step);
  const currentIndex = found === -1 ? steps.length : found;
  const target = steps[Math.min(currentIndex, steps.length - 1)] ?? 0;
  return { steps, currentIndex, target };
}

export const BOOK_PREORDER_BUDGET_TOTAL_CENTS = 330_500; // 3 305 €

export const BOOK_PREORDER_BUDGET_BREAKDOWN = [
  { labelKey: 'printing', amountCents: 240_000 }, // Impression des livres à vendre (120)
  { labelKey: 'publisher', amountCents: 40_000 }, // Accompagnement maison d'édition
  { labelKey: 'otherFees', amountCents: 50_500 }, // Autres frais (ISBN, livres offerts)
] as const;
