/**
 * Objectif de financement et détail des postes de dépense, donnés par Tom.
 * Ce sont les vrais chiffres de la campagne — à ajuster ici si Tom les
 * change avant la mise en ligne (voir flags.ts).
 *
 * L'objectif se mesure en NOMBRE de livres précommandés (le tirage prévu),
 * pas en euros collectés — demande explicite de Tom. Le montant (3 305 €) et
 * sa répartition restent affichés sur la page à titre d'information (« à quoi
 * servira votre précommande »), mais ne pilotent pas la jauge de progression.
 */
export const BOOK_PREORDER_GOAL_COUNT = 120; // tirage, déterminé par la précommande

export const BOOK_PREORDER_BUDGET_TOTAL_CENTS = 330_500; // 3 305 €

export const BOOK_PREORDER_BUDGET_BREAKDOWN = [
  { labelKey: 'printing', amountCents: 240_000 }, // Impression des livres à vendre (120)
  { labelKey: 'publisher', amountCents: 40_000 }, // Accompagnement maison d'édition
  { labelKey: 'otherFees', amountCents: 50_500 }, // Autres frais (ISBN, livres offerts)
] as const;
