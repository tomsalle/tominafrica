-- Publication programmée des photos : une photo masquée dont publish_at est
-- passé est publiée automatiquement par une tâche pg_cron (toutes les 15 min).
--
-- Premier usage : les tirages de l'exposition « 1 Mère, 1 Fils, 1 Rêve »,
-- publiés le jour du vernissage (vendredi 27 novembre 2026, 6 h). Le site
-- met jusqu'à une heure à rafraîchir ses pages (revalidate = 3600).

alter table public.photos
  add column publish_at timestamptz;

comment on column public.photos.publish_at is
  'Date de publication programmée. Une photo non publiée dont publish_at est passé est publiée par la tâche pg_cron « publier-photos-programmees ».';

create extension if not exists pg_cron with schema pg_catalog;

select cron.schedule(
  'publier-photos-programmees',
  '*/15 * * * *',
  $$
    update public.photos
       set published = true, publish_at = null
     where not published
       and publish_at is not null
       and publish_at <= now()
  $$
);
