-- Don ajouté à une précommande (1 €, 5 €, 10 € ou montant libre), proposé
-- au moment de passer commande pour soutenir l'installation de l'exposition.
-- Déjà compris dans amount_cents (montant total payé) ; ce champ en garde le
-- détail pour les e-mails et le suivi.

alter table public.book_preorder_pledges
  add column extra_donation_cents integer not null default 0;

alter table public.book_preorder_pledges
  add constraint book_preorder_pledges_extra_donation_non_negative check (extra_donation_cents >= 0);
