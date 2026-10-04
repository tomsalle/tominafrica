// Page de précommande du livre : construite mais pas encore publiée (demande
// de Tom, le contenu du livre et les chiffres définitifs ne sont pas encore
// prêts). Pour lancer :
//   1. Passer cette constante à `false`.
//   2. Publier les paliers : `update book_preorder_tiers set published = true`.
//   3. Ajouter le lien dans SiteHeader.tsx et l'entrée dans sitemap.ts.
export const BOOK_PREORDER_PAGE_DISABLED = true;
