-- Clients, commandes, lignes de commande.
--
-- Deux principes structurants :
--  1. `orders.stripe_checkout_session_id` est UNIQUE : c'est la clé d'idempotence
--     du webhook. Stripe rejoue les webhooks, et un rejeu ne doit jamais créer
--     une commande en double.
--  2. `order_items` fige un SNAPSHOT (titre, libellé, prix unitaire) au moment de
--     l'achat. Si un prix change ou qu'une photo est renommée dans deux ans, les
--     commandes passées restent exactes — c'est une obligation comptable.

create extension if not exists "citext";

-- ---------------------------------------------------------------------------
-- Clients
-- ---------------------------------------------------------------------------
create table public.customers (
  id                 uuid primary key default gen_random_uuid(),
  email              citext not null unique,
  full_name          text,
  phone              text,
  stripe_customer_id text unique,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Commandes
-- ---------------------------------------------------------------------------
create type public.order_status as enum (
  'pending',    -- session Checkout créée, paiement pas encore confirmé
  'paid',       -- paiement confirmé par Stripe
  'in_production', -- tirage en cours au labo
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
);

-- Numéro de commande lisible : TIA-2026-0001
create sequence public.order_number_seq start 1;

create or replace function public.generate_order_number()
returns text
language sql
volatile
set search_path = ''
as $$
  select 'TIA-' || to_char(now(), 'YYYY') || '-'
      || lpad(nextval('public.order_number_seq')::text, 4, '0');
$$;

create table public.orders (
  id           uuid primary key default gen_random_uuid(),
  order_number text not null unique default public.generate_order_number(),
  customer_id  uuid references public.customers (id) on delete set null,
  email        text not null,
  status       public.order_status not null default 'pending',

  -- Références Stripe
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id   text,

  -- Montants, en centimes
  subtotal_cents integer not null default 0,
  shipping_cents integer not null default 0,
  tax_cents      integer not null default 0,
  total_cents    integer not null default 0,
  currency       char(3) not null default 'EUR',

  -- Adresse de livraison, figée au moment de la commande
  shipping_name        text,
  shipping_line1       text,
  shipping_line2       text,
  shipping_postal_code text,
  shipping_city        text,
  shipping_country     char(2),

  -- Suivi
  carrier         text,
  tracking_number text,
  notes           text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at    timestamptz,
  shipped_at timestamptz,

  constraint orders_amounts_non_negative check (
    subtotal_cents >= 0 and shipping_cents >= 0
    and tax_cents >= 0 and total_cents >= 0
  )
);

create index orders_status_created_at_idx on public.orders (status, created_at desc);
create index orders_customer_id_idx on public.orders (customer_id);

-- ---------------------------------------------------------------------------
-- Lignes de commande
-- ---------------------------------------------------------------------------
create table public.order_items (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references public.orders (id) on delete cascade,
  -- `restrict` : on ne peut pas supprimer une option déjà vendue.
  print_option_id uuid references public.print_options (id) on delete restrict,
  photo_id        uuid references public.photos (id) on delete set null,

  -- Snapshot figé (voir en-tête du fichier)
  photo_title       text not null,
  photo_slug        text not null,
  option_label      text not null,
  option_sku        text not null,
  unit_price_cents  integer not null,
  quantity          integer not null default 1,
  edition_number    integer,   -- numéro attribué pour les éditions limitées
  total_cents       integer generated always as (unit_price_cents * quantity) stored,

  created_at timestamptz not null default now(),

  constraint order_items_quantity_positive check (quantity > 0),
  constraint order_items_unit_price_positive check (unit_price_cents > 0)
);

create index order_items_order_id_idx on public.order_items (order_id);

create trigger customers_set_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Attribution atomique des numéros d'édition
-- ---------------------------------------------------------------------------
-- Appelée par le webhook Stripe après confirmation du paiement. Verrouille les
-- lignes print_options concernées afin que deux commandes simultanées ne
-- puissent pas se voir attribuer le même numéro, ni dépasser le tirage.
create or replace function public.assign_edition_numbers(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  item record;
  opt  record;
begin
  for item in
    select oi.id, oi.print_option_id, oi.quantity
      from public.order_items oi
     where oi.order_id = p_order_id
       and oi.print_option_id is not null
       and oi.edition_number is null
     order by oi.created_at
  loop
    select id, edition_size, editions_sold
      into opt
      from public.print_options
     where id = item.print_option_id
       for update;   -- verrou : sérialise les commandes concurrentes

    -- Tirage non limité : pas de numérotation.
    continue when opt.edition_size is null;

    if opt.editions_sold + item.quantity > opt.edition_size then
      raise exception 'Édition épuisée pour l''option %: % vendus sur %, % demandés',
        opt.id, opt.editions_sold, opt.edition_size, item.quantity;
    end if;

    -- Le premier numéro de la ligne ; les exemplaires suivants d'une même
    -- ligne sont les numéros consécutifs.
    update public.order_items
       set edition_number = opt.editions_sold + 1
     where id = item.id;

    update public.print_options
       set editions_sold = editions_sold + item.quantity
     where id = opt.id;
  end loop;
end;
$$;

comment on function public.assign_edition_numbers is
  'Incrémente editions_sold et attribue les numéros d''édition, de façon atomique. Appelée par le webhook Stripe.';

revoke all on function public.assign_edition_numbers(uuid) from public, anon, authenticated;
