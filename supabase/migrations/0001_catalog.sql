-- Catalogue : séries, photos, et options de tirage (SKU).
-- Tous les prix sont stockés en centimes entiers (même unité que Stripe) :
-- jamais de float pour de l'argent.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Séries / collections
-- ---------------------------------------------------------------------------
create table public.series (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  subtitle       text,
  description    text,
  location_label text,                       -- ex. « Namibie · 2024 »
  cover_photo_id uuid,                       -- FK ajoutée après la table photos
  position       integer not null default 0, -- ordre d'affichage sur l'accueil
  published      boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  constraint series_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

comment on table public.series is 'Séries photographiques présentées sur la page d''accueil.';
comment on column public.series.cover_photo_id is 'Photo de couverture affichée en plein écran sur l''accueil.';

-- ---------------------------------------------------------------------------
-- Photos
-- ---------------------------------------------------------------------------
create table public.photos (
  id              uuid primary key default gen_random_uuid(),
  series_id       uuid references public.series (id) on delete set null,
  slug            text not null unique,
  title           text not null,
  caption         text,        -- une ligne affichée sous l'image
  story           text,        -- le storytelling, en markdown

  -- Lieu de prise de vue (alimente la carte de la page produit)
  location_name   text,        -- ex. « Deadvlei, Namibie »
  latitude        double precision,
  longitude       double precision,
  map_zoom        smallint not null default 6,
  taken_at        date,

  -- Fichiers
  image_path      text not null,  -- préfixe dans le bucket public `photos`
  image_width     integer,        -- dimensions du dérivé le plus large
  image_height    integer,        -- (réservent le ratio, évitent le layout shift)
  blur_data_url   text,           -- miniature base64 pour le placeholder flou
  master_filename text,           -- nom du fichier haute résolution d'origine

  position        integer not null default 0,
  published       boolean not null default false,
  featured        boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint photos_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  -- latitude et longitude vont toujours par paire
  constraint photos_coords_paired check ((latitude is null) = (longitude is null)),
  constraint photos_latitude_range check (latitude is null or latitude between -90 and 90),
  constraint photos_longitude_range check (longitude is null or longitude between -180 and 180),
  constraint photos_map_zoom_range check (map_zoom between 1 and 20)
);

comment on column public.photos.story is 'Récit derrière la photo (markdown) : contexte, anecdote, conditions de prise de vue.';
comment on column public.photos.image_path is 'Préfixe des dérivés web dans le bucket public, ex. « lion-amboseli ».';

alter table public.series
  add constraint series_cover_photo_id_fkey
  foreign key (cover_photo_id) references public.photos (id) on delete set null;

create index photos_series_id_position_idx on public.photos (series_id, position);
create index photos_published_idx on public.photos (published) where published;

-- ---------------------------------------------------------------------------
-- Options de tirage (les SKU réellement vendables)
-- ---------------------------------------------------------------------------
-- Une ligne = une combinaison achetable : format × papier × encadrement,
-- en édition limitée numérotée (edition_size renseigné) ou open edition (null).
create table public.print_options (
  id            uuid primary key default gen_random_uuid(),
  photo_id      uuid not null references public.photos (id) on delete cascade,
  sku           text not null unique,
  label         text not null,              -- ex. « 60 × 90 cm — encadré »
  width_cm      numeric(6, 1) not null,
  height_cm     numeric(6, 1) not null,
  paper         text,                       -- ex. « Hahnemühle Photo Rag 308 g »
  framed        boolean not null default false,
  price_cents   integer not null,
  currency      char(3) not null default 'EUR',

  edition_size  integer,                    -- null = tirage non limité
  editions_sold integer not null default 0,

  available     boolean not null default true,
  position      integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint print_options_price_positive check (price_cents > 0),
  constraint print_options_dimensions_positive check (width_cm > 0 and height_cm > 0),
  constraint print_options_edition_size_positive check (edition_size is null or edition_size > 0),
  constraint print_options_sold_within_edition
    check (editions_sold >= 0 and (edition_size is null or editions_sold <= edition_size))
);

comment on table public.print_options is 'Variantes achetables d''une photo. edition_size null = tirage non limité.';

create index print_options_photo_id_position_idx on public.print_options (photo_id, position);

-- ---------------------------------------------------------------------------
-- updated_at automatique
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger series_set_updated_at
  before update on public.series
  for each row execute function public.set_updated_at();

create trigger photos_set_updated_at
  before update on public.photos
  for each row execute function public.set_updated_at();

create trigger print_options_set_updated_at
  before update on public.print_options
  for each row execute function public.set_updated_at();
