-- Buckets de stockage.
--
--  * `photos`  — PUBLIC. Ne contient que les dérivés web (2400 px max), servis
--                par le CDN Supabase. Un dérivé 2400 px suffit largement à
--                l'écran et reste inexploitable pour un tirage grand format :
--                c'est la protection la plus efficace, bien plus qu'un clic
--                droit désactivé.
--  * `masters` — PRIVÉ. Fichiers haute résolution. Aucune lecture publique :
--                l'accès se fait par URL signée, côté serveur uniquement.
--
-- Attention au quota : le plan gratuit Supabase offre 1 Go. Les dérivés web
-- pèsent ~2 Mo par photo (plusieurs centaines de photos tiennent), mais les
-- masters (30–80 Mo pièce) le rempliraient en quelques dizaines d'images.
-- Voir le README pour la stratégie recommandée.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('photos',  'photos',  true,  20971520,   -- 20 Mo
   array['image/avif', 'image/webp', 'image/jpeg', 'image/png']),
  ('masters', 'masters', false, 524288000,  -- 500 Mo
   array['image/jpeg', 'image/tiff', 'image/png'])
on conflict (id) do nothing;

-- Lecture publique des dérivés web.
create policy "Dérivés web lisibles par tous"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'photos');

-- Aucune policy sur le bucket `masters` : refus par défaut pour anon et
-- authenticated. Seule la clé service role y accède.
--
-- Aucune policy d'écriture non plus : les téléversements passent
-- exclusivement par le script d'import, qui utilise la clé service role.
