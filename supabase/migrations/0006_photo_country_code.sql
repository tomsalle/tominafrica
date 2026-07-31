-- Le code pays déménage de la série vers la photo.
--
-- La série « 1 mère, 1 fils, 1 rêve » couvre plusieurs pays d'Afrique : un
-- seul code par série n'a plus de sens, la carte de la page produit doit
-- suivre la photo affichée, pas sa série.
alter table photos add column country_code text;

comment on column photos.country_code is
  'Code ISO 3166-1 alpha-2 en minuscules (ex. sn), utilisé pour la carte d''Afrique de la page produit.';

alter table series drop column country_code;
