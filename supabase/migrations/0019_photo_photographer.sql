-- Auteur de la photo (« Charlotte Badelon », « Tom Sallé »). Les récits des
-- tirages sont écrits à la première personne : la page indique qui parle.
alter table public.photos add column if not exists photographer text;
