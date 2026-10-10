-- Jour(s) de visite choisis à l'inscription : vendredi 27 (vernissage),
-- samedi 28, dimanche 29 novembre 2026. Plusieurs jours possibles.
-- Vide (null) pour les inscriptions faites avant l'ajout de ce choix.

alter table public.exhibition_registrations
  add column visit_days text[];

alter table public.exhibition_registrations
  add constraint exhibition_registrations_visit_days_valid
  check (visit_days <@ array['2026-11-27', '2026-11-28', '2026-11-29']::text[]);
