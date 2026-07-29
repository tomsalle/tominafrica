-- Données de démonstration : 3 séries, 9 photos, un mélange d'éditions limitées
-- et de tirages non limités.
--
-- Les coordonnées sont réelles — la carte de la page produit affiche donc de
-- vrais lieux. Les visuels sont des dégradés SVG dans public/placeholders/ :
-- le préfixe `placeholder/` dans `image_path` indique à lib/images.ts de servir
-- le fichier local au lieu du bucket Supabase.
--
-- Idempotent : on peut le rejouer sans créer de doublons.
-- Usage : psql "$DATABASE_URL" -f supabase/seed.sql

begin;

-- ---------------------------------------------------------------------------
-- Séries
-- ---------------------------------------------------------------------------
insert into public.series (slug, title, subtitle, description, location_label, position, published)
values
  ('le-grand-silence',
   'Le Grand Silence',
   'Namibie',
   'Le désert du Namib est le plus vieux du monde. Quarante millions d''années de vent ont sculpté des dunes hautes comme des immeubles, et vidé le paysage de tout ce qui n''était pas essentiel. On y photographie moins un lieu qu''une absence.',
   'Namibie · 2024',
   1, true),

  ('les-gardiens',
   'Les Gardiens',
   'Kenya & Tanzanie',
   'Photographier un animal sauvage sans le réduire à un trophée. Cette série cherche le regard plutôt que la performance : ce moment où l''animal vous a vu, vous évalue, et décide de vous ignorer.',
   'Kenya & Tanzanie · 2023–2025',
   2, true),

  ('terres-rouges',
   'Terres Rouges',
   'Madagascar',
   'Madagascar s''est détachée du continent il y a quatre-vingt-huit millions d''années et n''a plus jamais rien fait comme personne. La latérite y donne à la terre une couleur de brique cuite qui, à la lumière rasante, semble éclairer les gens par en dessous.',
   'Madagascar · 2025',
   3, true)
on conflict (slug) do update set
  title          = excluded.title,
  subtitle       = excluded.subtitle,
  description    = excluded.description,
  location_label = excluded.location_label,
  position       = excluded.position,
  published      = excluded.published;

-- ---------------------------------------------------------------------------
-- Photos
-- ---------------------------------------------------------------------------
insert into public.photos (
  series_id, slug, title, caption, story,
  location_name, latitude, longitude, map_zoom, taken_at,
  image_path, image_width, image_height, position, published, featured
)
values
  -- ---- Le Grand Silence ---------------------------------------------------
  ((select id from public.series where slug = 'le-grand-silence'),
   'deadvlei-aube',
   'Deadvlei, à l''aube',
   'Acacias morts depuis neuf cents ans, Deadvlei, Namibie',
   E'Il faut partir de Sesriem à quatre heures du matin pour être dans la cuvette au premier soleil. Les quatre derniers kilomètres se font à pied, dans le sable, avec le matériel sur le dos.\n\nCe que les photographies ne disent jamais, c''est que Deadvlei est minuscule — à peine deux terrains de football. On imagine une plaine infinie ; c''est une pièce, entourée de dunes de trois cents mètres qui font office de murs.\n\nLes acacias sont morts vers l''an 1100, quand la rivière Tsauchab a changé de cours. Ils n''ont jamais pourri : il fait trop sec. Ils sont simplement restés debout, carbonisés par neuf siècles de soleil, dans une argile blanche qui craque sous les semelles.\n\nJ''ai attendu que la lumière touche la crête de la grande dune sans encore atteindre le sol de la cuvette. Cet écart dure environ huit minutes.',
   'Deadvlei, Sossusvlei, Namibie', -24.759200, 15.292500, 11, '2024-06-14',
   'placeholder/deadvlei-aube', 2400, 1600, 1, true, true),

  ((select id from public.series where slug = 'le-grand-silence'),
   'dune-45',
   'Ligne de crête',
   'Dune 45, désert du Namib',
   E'Une dune n''a pas de forme fixe. Celle-ci s''est déplacée d''une dizaine de mètres depuis la dernière fois que j''étais venu, et sa crête change de dessin plusieurs fois par jour selon le vent.\n\nLa difficulté n''est pas de monter — c''est de trouver un angle où aucune trace de pas ne vienne trahir les cinquante personnes montées avant vous. J''ai marché quarante minutes le long de l''arête pour obtenir cette ligne intacte.\n\nLe sable du Namib est orange parce qu''il est vieux : plus une dune est ancienne, plus l''oxyde de fer qu''elle contient s''est oxydé. Celle-ci a environ cinq millions d''années.',
   'Dune 45, Sossusvlei, Namibie', -24.731100, 15.455000, 11, '2024-06-16',
   'placeholder/dune-45', 2400, 1600, 2, true, false),

  ((select id from public.series where slug = 'le-grand-silence'),
   'cote-des-squelettes',
   'La Côte des Squelettes',
   'Cape Cross, littoral atlantique namibien',
   E'Les Bochimans appelaient cet endroit « la terre que Dieu a créée dans la colère ». Les marins portugais, plus prosaïques, l''appelaient « les portes de l''enfer ».\n\nLe courant froid de Benguela remonte de l''Antarctique et rencontre l''air brûlant du désert. Il en résulte un brouillard permanent qui a fait échouer des centaines de navires — et qui, ce matin-là, a mis quatre heures à se lever.\n\nJ''ai photographié en attendant, sans rien voir à plus de trente mètres. Cette image est l''instant précis où le brouillard s''est déchiré, une trentaine de secondes avant de se refermer.',
   'Cape Cross, Côte des Squelettes, Namibie', -21.770800, 13.952500, 9, '2024-06-21',
   'placeholder/cote-des-squelettes', 2400, 1600, 3, true, false),

  -- ---- Les Gardiens -------------------------------------------------------
  ((select id from public.series where slug = 'les-gardiens'),
   'craig-amboseli',
   'Craig',
   'L''un des derniers grands porteurs d''ivoire, Amboseli, Kenya',
   E'On appelle « grands porteurs » les éléphants dont les défenses touchent le sol. Il en reste moins d''une trentaine en Afrique. Craig est l''un d''eux : environ cinquante ans, et des défenses de plus de cinquante kilos chacune.\n\nNous l''avons suivi trois jours. La règle est simple et non négociable : on ne s''approche pas, on se met sur son chemin et on attend. S''il change de direction, on a échoué.\n\nLe troisième matin, il est passé à onze mètres du véhicule sans nous accorder un regard — ce qui, chez un éléphant, est la plus grande marque de confiance possible. J''ai fait sept images. Celle-ci est la quatrième.\n\nLe Kilimandjaro, derrière, n''est dégagé qu''une heure par jour en saison sèche, tôt le matin.',
   'Parc national d''Amboseli, Kenya', -2.652700, 37.260600, 10, '2023-08-09',
   'placeholder/craig-amboseli', 2400, 1600, 1, true, true),

  ((select id from public.series where slug = 'les-gardiens'),
   'traversee-mara',
   'La traversée',
   'Migration des gnous, rivière Mara, Kenya',
   E'Un million trois cent mille gnous font ce trajet chaque année. Ils attendent parfois trois jours sur la berge, à hésiter, jusqu''à ce qu''un individu se jette à l''eau — après quoi tous les autres suivent en quelques minutes.\n\nPersonne ne sait ce qui déclenche la décision. Ce n''est ni le plus gros, ni le plus âgé : c''est simplement le premier.\n\nJ''ai attendu onze heures dans le véhicule, sans en sortir. Quand ça part, ça dure quarante minutes et c''est fini pour la journée.',
   'Rivière Mara, Réserve du Maasai Mara, Kenya', -1.406100, 35.008000, 10, '2024-08-27',
   'placeholder/traversee-mara', 2400, 1600, 2, true, false),

  ((select id from public.series where slug = 'les-gardiens'),
   'lionne-serengeti',
   'Sans nom',
   'Lionne, plaines du Serengeti, Tanzanie',
   E'Elle nous a regardés pendant peut-être quatre secondes. Je photographiais à 400 mm, à une soixantaine de mètres — assez loin pour ne rien déranger, assez près pour voir qu''elle nous avait classés : pas une menace, pas un repas, rien.\n\nC''est ce que je cherche dans cette série. Pas la puissance, pas la chasse, pas le rugissement. Ce moment très bref où un animal sauvage vous évalue et conclut que vous n''avez aucune importance.\n\nElle s''est rendormie douze secondes plus tard.',
   'Parc national du Serengeti, Tanzanie', -2.333300, 34.833300, 9, '2025-02-11',
   'placeholder/lionne-serengeti', 2400, 1600, 3, true, false),

  -- ---- Terres Rouges ------------------------------------------------------
  ((select id from public.series where slug = 'terres-rouges'),
   'allee-des-baobabs',
   'L''Allée',
   'Adansonia grandidieri, Morondava, Madagascar',
   E'Ces baobabs ont entre huit cents et mille ans. Ils ne poussent pas en allée : ce sont les survivants d''une forêt dense qui a été défrichée autour d''eux pour faire des rizières. La « plus belle route de Madagascar » est en réalité le vestige d''une déforestation.\n\nJe trouve que ça ne rend pas l''endroit moins beau. Ça le rend plus honnête.\n\nLa lumière de fin de journée dure ici une quinzaine de minutes. Le reste du temps, la latérite renvoie une lumière rouge très dure, impossible à corriger.',
   'Allée des Baobabs, Morondava, Madagascar', -20.250600, 44.418300, 12, '2025-05-03',
   'placeholder/allee-des-baobabs', 2400, 1600, 1, true, true),

  ((select id from public.series where slug = 'terres-rouges'),
   'tsingy',
   'Là où l''on ne marche pas',
   'Tsingy de Bemaraha, Madagascar',
   E'« Tsingy » vient d''un mot malgache qui signifie à peu près « là où l''on ne peut pas marcher pieds nus ». C''est un euphémisme : ce sont des lames de calcaire de trente mètres, taillées par la pluie, tranchantes comme du verre.\n\nOn y circule sur des passerelles et des via ferrata. Le matériel se porte harnaché ; tout ce qui tombe est perdu.\n\nIl a fallu deux jours de piste depuis Morondava pour arriver là. La route est fermée six mois par an à cause de la saison des pluies.',
   'Parc national des Tsingy de Bemaraha, Madagascar', -18.700000, 44.750000, 10, '2025-05-09',
   'placeholder/tsingy', 2400, 1600, 2, true, false),

  ((select id from public.series where slug = 'terres-rouges'),
   'pecheurs-morondava',
   'Retour de pêche',
   'Canal du Mozambique, Morondava, Madagascar',
   E'Les pirogues à balancier partent vers trois heures du matin et rentrent en fin d''après-midi, portées par la brise de mer. La voile est faite de sacs de riz cousus.\n\nJ''ai photographié ce retour depuis l''eau, à hauteur de flottaison, ce qui suppose de mouiller le matériel et d''accepter de ne pas contrôler grand-chose.\n\nLe pêcheur au premier plan m''a demandé, en rentrant, si la photo servirait à vendre du poisson. J''ai répondu que non, qu''elle servirait sans doute à vendre la photo. Il a trouvé ça beaucoup plus drôle que moi.',
   'Morondava, Canal du Mozambique, Madagascar', -20.284800, 44.317400, 12, '2025-05-14',
   'placeholder/pecheurs-morondava', 2400, 1600, 3, true, false)

on conflict (slug) do update set
  series_id     = excluded.series_id,
  title         = excluded.title,
  caption       = excluded.caption,
  story         = excluded.story,
  location_name = excluded.location_name,
  latitude      = excluded.latitude,
  longitude     = excluded.longitude,
  map_zoom      = excluded.map_zoom,
  taken_at      = excluded.taken_at,
  image_path    = excluded.image_path,
  image_width   = excluded.image_width,
  image_height  = excluded.image_height,
  position      = excluded.position,
  published     = excluded.published,
  featured      = excluded.featured;

-- Photos de couverture des séries
update public.series s
   set cover_photo_id = p.id
  from public.photos p
 where p.slug = case s.slug
         when 'le-grand-silence' then 'deadvlei-aube'
         when 'les-gardiens'     then 'craig-amboseli'
         when 'terres-rouges'    then 'allee-des-baobabs'
       end;

-- ---------------------------------------------------------------------------
-- Options de tirage
-- ---------------------------------------------------------------------------
-- Les trois photos mises en avant sont proposées en édition limitée numérotée ;
-- les autres en tirage non limité (edition_size null).

insert into public.print_options (
  photo_id, sku, label, width_cm, height_cm, paper, framed,
  price_cents, edition_size, editions_sold, position
)
select p.id, v.sku, v.label, v.width_cm, v.height_cm, v.paper, v.framed,
       v.price_cents, v.edition_size, v.editions_sold, v.position
  from (values
    -- Éditions limitées — photos mises en avant
    ('deadvlei-aube',       'DEA-3040-LTD',  '30 × 40 cm',              30.0,  40.0,  'Hahnemühle Photo Rag 308 g', false,  25000, 25,  6, 1),
    ('deadvlei-aube',       'DEA-6090-LTD',  '60 × 90 cm',              60.0,  90.0,  'Hahnemühle Photo Rag 308 g', false,  59000, 15,  4, 2),
    ('deadvlei-aube',       'DEA-90135-FR',  '90 × 135 cm — encadré',   90.0, 135.0,  'Hahnemühle Baryta 315 g',    true,  145000,  7,  2, 3),

    ('craig-amboseli',      'CRA-3040-LTD',  '30 × 40 cm',              30.0,  40.0,  'Hahnemühle Photo Rag 308 g', false,  25000, 25, 19, 1),
    ('craig-amboseli',      'CRA-6090-LTD',  '60 × 90 cm',              60.0,  90.0,  'Hahnemühle Photo Rag 308 g', false,  59000, 15, 14, 2),
    ('craig-amboseli',      'CRA-90135-FR',  '90 × 135 cm — encadré',   90.0, 135.0,  'Hahnemühle Baryta 315 g',    true,  145000,  7,  7, 3),

    ('allee-des-baobabs',   'ALB-3040-LTD',  '30 × 40 cm',              30.0,  40.0,  'Hahnemühle Photo Rag 308 g', false,  25000, 25,  3, 1),
    ('allee-des-baobabs',   'ALB-6090-LTD',  '60 × 90 cm',              60.0,  90.0,  'Hahnemühle Photo Rag 308 g', false,  59000, 15,  1, 2),

    -- Tirages non limités
    ('dune-45',             'DU45-3040',     '30 × 40 cm',              30.0,  40.0,  'Hahnemühle Photo Rag 308 g', false,  18000, null, 0, 1),
    ('dune-45',             'DU45-5070',     '50 × 70 cm',              50.0,  70.0,  'Hahnemühle Photo Rag 308 g', false,  32000, null, 0, 2),
    ('dune-45',             'DU45-5070-FR',  '50 × 70 cm — encadré',    50.0,  70.0,  'Hahnemühle Photo Rag 308 g', true,   49000, null, 0, 3),

    ('cote-des-squelettes', 'COS-3040',      '30 × 40 cm',              30.0,  40.0,  'Hahnemühle Photo Rag 308 g', false,  18000, null, 0, 1),
    ('cote-des-squelettes', 'COS-5070',      '50 × 70 cm',              50.0,  70.0,  'Hahnemühle Photo Rag 308 g', false,  32000, null, 0, 2),

    ('traversee-mara',      'TRM-3040',      '30 × 40 cm',              30.0,  40.0,  'Hahnemühle Photo Rag 308 g', false,  18000, null, 0, 1),
    ('traversee-mara',      'TRM-5070',      '50 × 70 cm',              50.0,  70.0,  'Hahnemühle Photo Rag 308 g', false,  32000, null, 0, 2),

    ('lionne-serengeti',    'LIS-3040',      '30 × 40 cm',              30.0,  40.0,  'Hahnemühle Photo Rag 308 g', false,  18000, null, 0, 1),
    ('lionne-serengeti',    'LIS-5070',      '50 × 70 cm',              50.0,  70.0,  'Hahnemühle Photo Rag 308 g', false,  32000, null, 0, 2),
    ('lionne-serengeti',    'LIS-5070-FR',   '50 × 70 cm — encadré',    50.0,  70.0,  'Hahnemühle Photo Rag 308 g', true,   49000, null, 0, 3),

    ('tsingy',              'TSI-3040',      '30 × 40 cm',              30.0,  40.0,  'Hahnemühle Photo Rag 308 g', false,  18000, null, 0, 1),
    ('tsingy',              'TSI-5070',      '50 × 70 cm',              50.0,  70.0,  'Hahnemühle Photo Rag 308 g', false,  32000, null, 0, 2),

    ('pecheurs-morondava',  'PEM-3040',      '30 × 40 cm',              30.0,  40.0,  'Hahnemühle Photo Rag 308 g', false,  18000, null, 0, 1),
    ('pecheurs-morondava',  'PEM-5070',      '50 × 70 cm',              50.0,  70.0,  'Hahnemühle Photo Rag 308 g', false,  32000, null, 0, 2)
  ) as v (photo_slug, sku, label, width_cm, height_cm, paper, framed,
          price_cents, edition_size, editions_sold, position)
  join public.photos p on p.slug = v.photo_slug
on conflict (sku) do update set
  label         = excluded.label,
  width_cm      = excluded.width_cm,
  height_cm     = excluded.height_cm,
  paper         = excluded.paper,
  framed        = excluded.framed,
  price_cents   = excluded.price_cents,
  edition_size  = excluded.edition_size,
  position      = excluded.position;
  -- editions_sold n'est volontairement PAS écrasé : rejouer le seed ne doit
  -- jamais remettre à zéro un compteur de ventes réelles.

commit;
