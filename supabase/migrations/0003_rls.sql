-- Row Level Security.
--
-- Modèle de sécurité, volontairement simple et strict :
--
--  * Catalogue (series, photos, print_options) : lecture publique, mais
--    UNIQUEMENT ce qui est publié. Tes brouillons sont invisibles tant que tu
--    n'as pas basculé `published`.
--  * Commerce (customers, orders, order_items) : AUCUNE policy. RLS activée
--    sans policy = tout est refusé pour `anon` et `authenticated`. Seule la clé
--    service role (qui contourne la RLS, et n'est utilisée que côté serveur
--    dans le webhook Stripe) peut lire et écrire. Aucune donnée client ne peut
--    fuiter depuis le navigateur.
--
-- Aucune écriture n'est jamais autorisée depuis le client sur le catalogue :
-- les insertions passent par le script d'import (service role).

alter table public.series        enable row level security;
alter table public.photos        enable row level security;
alter table public.print_options enable row level security;
alter table public.customers     enable row level security;
alter table public.orders        enable row level security;
alter table public.order_items   enable row level security;

-- ---------------------------------------------------------------------------
-- Catalogue : lecture publique du contenu publié
-- ---------------------------------------------------------------------------
create policy "Séries publiées lisibles par tous"
  on public.series for select
  to anon, authenticated
  using (published);

-- Une photo n'est visible que si elle est publiée ET que sa série l'est aussi
-- (ou qu'elle n'appartient à aucune série). Dépublier une série masque donc
-- immédiatement toutes ses photos.
create policy "Photos publiées lisibles par tous"
  on public.photos for select
  to anon, authenticated
  using (
    published
    and (
      series_id is null
      or exists (
        select 1 from public.series s
         where s.id = photos.series_id and s.published
      )
    )
  );

create policy "Options de tirage des photos publiées lisibles par tous"
  on public.print_options for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.photos p
       where p.id = print_options.photo_id
         and p.published
         and (
           p.series_id is null
           or exists (
             select 1 from public.series s
              where s.id = p.series_id and s.published
           )
         )
    )
  );

-- ---------------------------------------------------------------------------
-- Commerce : aucune policy — accès service role uniquement.
-- ---------------------------------------------------------------------------
-- (RLS activée ci-dessus + zéro policy = refus par défaut. C'est intentionnel :
--  ne pas ajouter de policy ici sans une très bonne raison.)
