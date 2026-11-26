-- Créneaux de visite de deux heures pour le week-end de l'exposition
-- (samedi 28 et dimanche 29 novembre 2026), pour répartir les visiteurs.
-- Format : « 2026-11-28T10:00 » (jour et heure de début, heure de Paris).
alter table public.exhibition_registrations
  add column if not exists visit_slots text[];

comment on column public.exhibition_registrations.visit_slots is
  'Créneaux choisis, un par jour du week-end : « AAAA-MM-JJTHH:MM » (heure de début, Paris).';
