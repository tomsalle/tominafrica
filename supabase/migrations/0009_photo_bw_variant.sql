alter table photos
  add column bw_image_path text,
  add column bw_image_width integer,
  add column bw_image_height integer;

comment on column photos.bw_image_path is
  'Chemin de stockage du fichier noir et blanc réellement retouché (paire avec image_path en couleur). Si renseigné, la bascule N&B sert ce fichier au lieu d''un filtre CSS.';
