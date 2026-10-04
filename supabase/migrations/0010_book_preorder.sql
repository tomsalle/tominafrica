-- Précommande/financement du livre (façon Ulule), découplé du modèle
-- print_options/order_items : paliers à prix fixes + pledges, sans panier,
-- sans numérotation d'édition par exemplaire.

create table public.book_preorder_tiers (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique,
  name               text not null,                 -- FR, libellé Stripe + repère admin
  description        text,                           -- FR, idem (le texte affiché vient des messages i18n)
  price_cents        integer not null,               -- prix fixe, ou montant MINIMUM pour le don
  currency           char(3) not null default 'EUR',
  is_donation        boolean not null default false, -- « Don » : montant libre choisi par le donateur
  stock_limit        integer,                        -- null = illimité ; 15 pour l'early bird
  claimed_count      integer not null default 0,     -- incrémenté seulement après paiement confirmé
  published          boolean not null default false, -- garde-fou RLS, indépendant de PAGE_DISABLED
  position           integer not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  constraint book_preorder_tiers_price_positive check (price_cents > 0),
  constraint book_preorder_tiers_stock_limit_positive check (stock_limit is null or stock_limit > 0),
  constraint book_preorder_tiers_claimed_within_limit check (
    claimed_count >= 0 and (stock_limit is null or claimed_count <= stock_limit)
  )
);

comment on table public.book_preorder_tiers is
  'Paliers de précommande du livre (façon Ulule). claimed_count n''est incrémenté qu''après paiement confirmé (webhook Stripe), jamais à la création de la session Checkout.';

create index book_preorder_tiers_position_idx on public.book_preorder_tiers (position);

create trigger book_preorder_tiers_set_updated_at
  before update on public.book_preorder_tiers
  for each row execute function public.set_updated_at();

create table public.book_preorder_pledges (
  id          uuid primary key default gen_random_uuid(),
  tier_id     uuid not null references public.book_preorder_tiers (id) on delete restrict,
  customer_id uuid references public.customers (id) on delete set null,

  email     text not null,
  full_name text,
  phone     text,
  status    public.order_status not null default 'pending',

  stripe_checkout_session_id text not null unique,
  stripe_payment_intent_id   text,

  quantity         integer not null default 1,   -- toujours 1 pour le don
  unit_price_cents integer not null,              -- snapshot
  amount_cents     integer not null,              -- montant réellement payé (session.amount_total)
  currency         char(3) not null default 'EUR',

  -- Snapshot figé, comme order_items (voir 0002_commerce.sql) : un palier
  -- renommé ou republié plus tard ne doit pas changer l'historique.
  tier_slug_snapshot text not null,
  tier_name_snapshot text not null,
  is_donation        boolean not null default false,

  -- Adresse de livraison — renseignée pour les paliers 1 à 5, absente pour le don.
  shipping_name        text,
  shipping_line1       text,
  shipping_line2       text,
  shipping_postal_code text,
  shipping_city        text,
  shipping_country     char(2),

  notes      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at    timestamptz,

  constraint book_preorder_pledges_quantity_positive check (quantity > 0),
  constraint book_preorder_pledges_amount_positive check (amount_cents > 0),
  constraint book_preorder_pledges_unit_price_positive check (unit_price_cents > 0)
);

comment on table public.book_preorder_pledges is
  'Précommandes/dons pour le livre. Une ligne = une session Stripe Checkout payée. Table privée (RLS sans policy) : accès service role uniquement.';

create index book_preorder_pledges_tier_id_idx on public.book_preorder_pledges (tier_id);
create index book_preorder_pledges_status_created_at_idx on public.book_preorder_pledges (status, created_at desc);
create index book_preorder_pledges_customer_id_idx on public.book_preorder_pledges (customer_id);

create trigger book_preorder_pledges_set_updated_at
  before update on public.book_preorder_pledges
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.book_preorder_tiers   enable row level security;
alter table public.book_preorder_pledges enable row level security;

create policy "Paliers publiés lisibles par tous"
  on public.book_preorder_tiers for select
  to anon, authenticated
  using (published);

-- book_preorder_pledges : RLS activée, AUCUNE policy → refus par défaut pour
-- anon/authenticated. Seule la clé service role (webhook Stripe, via
-- createAdminClient()) peut lire et écrire. Même convention que
-- customers/orders/order_items (voir 0003_rls.sql).

-- ---------------------------------------------------------------------------
-- Réclamation atomique du stock (early bird)
-- ---------------------------------------------------------------------------
-- Appelée par le webhook Stripe après confirmation du paiement — jamais à la
-- création de la session Checkout. Verrouille la ligne du palier concerné,
-- pour que deux paiements simultanés ne puissent pas dépasser stock_limit.
create or replace function public.claim_book_preorder_stock(p_tier_id uuid, p_quantity integer)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  t record;
begin
  select id, stock_limit, claimed_count
    into t
    from public.book_preorder_tiers
   where id = p_tier_id
     for update;   -- verrou : sérialise les paiements concurrents sur ce palier

  if not found then
    raise exception 'Palier de précommande introuvable : %', p_tier_id;
  end if;

  if t.stock_limit is not null and t.claimed_count + p_quantity > t.stock_limit then
    raise exception 'Stock épuisé pour le palier % : % réclamés sur %, % demandés',
      t.id, t.claimed_count, t.stock_limit, p_quantity;
  end if;

  update public.book_preorder_tiers
     set claimed_count = claimed_count + p_quantity
   where id = t.id;
end;
$$;

comment on function public.claim_book_preorder_stock is
  'Incrémente claimed_count de façon atomique, ou lève une exception si le stock est dépassé. Appelée par le webhook Stripe après paiement confirmé.';

revoke all on function public.claim_book_preorder_stock(uuid, integer) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Jauge publique de progression
-- ---------------------------------------------------------------------------
-- Ne renvoie qu'un entier — jamais les lignes de book_preorder_pledges, qui
-- restent entièrement privées. Remplacée dans 0011_book_preorder_goal_in_copies.sql
-- pour inclure book_units_total (métrique finale de la jauge).
create or replace function public.get_book_preorder_progress()
returns table (raised_cents bigint, pledges_count integer)
language sql
stable
security definer
set search_path = ''
as $$
  select
    coalesce(sum(p.amount_cents), 0)::bigint as raised_cents,
    count(*)::integer as pledges_count
  from public.book_preorder_pledges p
  join public.book_preorder_tiers t on t.id = p.tier_id
 where p.status in ('paid', 'in_production', 'shipped', 'delivered');
$$;

comment on function public.get_book_preorder_progress is
  'Progression de la précommande du livre. Lecture publique (anon/authenticated), aucune ligne de pledge n''est exposée.';

grant execute on function public.get_book_preorder_progress() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Seed : les 6 paliers exacts donnés par Tom
-- ---------------------------------------------------------------------------
-- published = false intentionnellement : même avec PAGE_DISABLED=true côté
-- app, ceci évite qu'un visiteur curieux interrogeant directement l'API REST
-- Supabase ne découvre les tarifs avant l'annonce. À publier (UPDATE ... SET
-- published = true) en même temps que le flip de PAGE_DISABLED.
insert into public.book_preorder_tiers
  (slug, name, description, price_cents, is_donation, stock_limit, position, published)
values
  ('early-bird',             'Early bird',                         'Le livre seul — 15 premiers exemplaires',                           3500, false, 15,   1, false),
  ('livre',                  'Le livre',                           'Le livre seul',                                                      4000, false, null, 2, false),
  ('livre-cartes-postales',  'Le livre + 2 cartes postales',       'Le livre et deux cartes postales tirées des photographies du livre', 5000, false, null, 3, false),
  ('pack-duo',               'Pack Duo',                           'Deux exemplaires du livre',                                          7500, false, null, 4, false),
  ('pack-soutien',           'Pack Soutien',                       'Le livre, deux cartes postales et un tirage 20×30 cm',               9000, false, null, 5, false),
  ('don',                    'Don',                                'Montant libre, sans contrepartie fixe',                               500, true,  null, 6, false);
