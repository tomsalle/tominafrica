-- Code pays de la série, pour la carte d'Afrique de la page produit.
--
-- ISO 3166-1 alpha-2 en minuscules (ex. « sn » pour le Sénégal), format
-- attendu par les identifiants du jeu de données @svg-maps/world utilisé
-- côté front. Nullable : les séries existantes n'ont pas encore été
-- renseignées, et la carte ne s'affiche simplement pas sans valeur.
alter table series add column country_code text;

comment on column series.country_code is
  'Code ISO 3166-1 alpha-2 en minuscules (ex. sn), utilisé pour la carte d''Afrique de la page produit.';
