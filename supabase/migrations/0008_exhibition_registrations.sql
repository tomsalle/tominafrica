-- Inscriptions à l'exposition (page « Notre aventure »).
--
-- Table en écriture seule depuis le client, comme le modèle commerce
-- (customers/orders) : RLS activée avec une unique policy d'INSERT pour
-- `anon`, sans policy de lecture. Un visiteur peut s'inscrire mais jamais
-- relire les inscriptions des autres — seule la clé service role (ou le
-- tableau de bord Supabase) y a accès.
create table public.exhibition_registrations (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  message text,
  created_at timestamptz not null default now()
);

comment on table public.exhibition_registrations is
  'Inscriptions à l''exposition Paris, collectées depuis /notre-aventure/exposition.';

alter table public.exhibition_registrations enable row level security;

create policy "Inscription publique en écriture seule"
  on public.exhibition_registrations for insert
  to anon
  with check (true);
