-- Certaines photos sont nativement en noir et blanc (pas de recadrage
-- colorimétrique possible) : la bascule N&B / Couleur de la page produit
-- n'a alors aucun sens et doit disparaître, plutôt que de proposer un choix
-- qui ne change rien à l'image.
alter table photos add column is_black_and_white boolean not null default false;

comment on column photos.is_black_and_white is
  'Vrai si le fichier source est nativement en noir et blanc (pas de version couleur) — masque la bascule N&B/Couleur côté produit.';
