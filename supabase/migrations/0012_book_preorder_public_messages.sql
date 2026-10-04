-- Messages publics des contributeurs, affichés sur la page de précommande
-- (liste « Contributions » façon Ulule). Les deux champs sont facultatifs et
-- saisis par la personne elle-même avant le paiement : jamais déduits de son
-- nom de facturation Stripe, qui reste privé.

alter table public.book_preorder_pledges
  add column public_name    text,
  add column public_message text;

alter table public.book_preorder_pledges
  add constraint book_preorder_pledges_public_name_length check (char_length(public_name) <= 60),
  add constraint book_preorder_pledges_public_message_length check (char_length(public_message) <= 280);

-- Liste publique : uniquement le nom affiché choisi, le message, la contrepartie
-- et la date — jamais l'e-mail, le nom de facturation ni l'adresse.
create function public.get_book_preorder_contributions(p_limit integer default 50)
returns table (
  public_name    text,
  public_message text,
  tier_slug      text,
  is_donation    boolean,
  created_at     timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select p.public_name, p.public_message, p.tier_slug_snapshot, p.is_donation, p.created_at
    from public.book_preorder_pledges p
   where p.status in ('paid', 'in_production', 'shipped', 'delivered')
   order by p.created_at desc
   limit least(greatest(p_limit, 1), 100);
$$;

comment on function public.get_book_preorder_contributions is
  'Contributions publiques de la précommande du livre : nom affiché et message choisis par le contributeur, contrepartie, date. Aucune donnée personnelle de facturation exposée.';

grant execute on function public.get_book_preorder_contributions(integer) to anon, authenticated;
