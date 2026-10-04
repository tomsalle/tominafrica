-- Correction : l'objectif de financement se mesure en NOMBRE de livres
-- précommandés (120, le tirage prévu), pas en euros collectés. Chaque palier
-- porte désormais le nombre d'exemplaires du livre qu'il représente (0 pour
-- le don, 2 pour le Pack Duo, 1 pour les autres) afin que la jauge compte les
-- bons exemplaires plutôt que le nombre de paiements.

alter table public.book_preorder_tiers
  add column book_units integer not null default 1;

alter table public.book_preorder_tiers
  add constraint book_preorder_tiers_book_units_non_negative check (book_units >= 0);

update public.book_preorder_tiers set book_units = 1 where slug = 'early-bird';
update public.book_preorder_tiers set book_units = 1 where slug = 'livre';
update public.book_preorder_tiers set book_units = 1 where slug = 'livre-cartes-postales';
update public.book_preorder_tiers set book_units = 2 where slug = 'pack-duo';
update public.book_preorder_tiers set book_units = 1 where slug = 'pack-soutien';
update public.book_preorder_tiers set book_units = 0 where slug = 'don';

-- Jauge publique : nombre de livres précommandés (métrique principale),
-- montant collecté et nombre de précommandes (secondaires, pour affichage).
drop function if exists public.get_book_preorder_progress();

create function public.get_book_preorder_progress()
returns table (book_units_total integer, raised_cents bigint, pledges_count integer)
language sql
stable
security definer
set search_path = ''
as $$
  select
    coalesce(sum(p.quantity * t.book_units), 0)::integer as book_units_total,
    coalesce(sum(p.amount_cents), 0)::bigint as raised_cents,
    count(*)::integer as pledges_count
  from public.book_preorder_pledges p
  join public.book_preorder_tiers t on t.id = p.tier_id
 where p.status in ('paid', 'in_production', 'shipped', 'delivered');
$$;

comment on function public.get_book_preorder_progress is
  'Progression de la précommande du livre : book_units_total (nombre d''exemplaires, métrique de la jauge), raised_cents et pledges_count (secondaires). Lecture publique (anon/authenticated), aucune ligne de pledge n''est exposée.';

grant execute on function public.get_book_preorder_progress() to anon, authenticated;
