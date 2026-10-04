/**
 * Objectif de financement et détail des postes de dépense, donnés par Tom.
 * Ce sont les vrais chiffres de la campagne — à ajuster ici si Tom les
 * change avant la mise en ligne (voir flags.ts).
 *
 * L'objectif se mesure en NOMBRE de livres précommandés (le tirage prévu),
 * pas en euros collectés — demande explicite de Tom. Le montant (4 905 €) et
 * sa répartition restent affichés sur la page à titre d'information (« à quoi
 * servira votre précommande »), mais ne pilotent pas la jauge de progression.
 */
export const BOOK_PREORDER_GOAL_COUNT = 120; // nombre d'exemplaires du tirage

export const BOOK_PREORDER_BUDGET_TOTAL_CENTS = 490_500; // 4 905 €

export const BOOK_PREORDER_BUDGET_BREAKDOWN = [
  { labelKey: 'printing', amountCents: 240_000 }, // Impression des livres à vendre (120)
  { labelKey: 'publisher', amountCents: 180_000 }, // Accompagnement maison d'édition
  { labelKey: 'otherFees', amountCents: 70_500 }, // Autres frais (ISBN, livres offerts)
] as const;
