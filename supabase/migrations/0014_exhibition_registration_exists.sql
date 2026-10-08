-- Doublons d'inscription à l'exposition : « Vous êtes déjà inscrit·e » quand
-- l'e-mail ou le téléphone est déjà connu.
--
-- E-mail comparé sans casse ni espaces. Téléphone comparé sur ses 9 derniers
-- chiffres, pour que « 06 12 34 56 78 », « +33 6 12 34 56 78 » et
-- « 0033612345678 » se reconnaissent ; un numéro de moins de 9 chiffres n'est
-- jamais comparé.
--
-- Appelée uniquement côté serveur (clé service_role) : un visiteur ne peut
-- pas s'en servir pour tester si quelqu'un est inscrit.
create function public.exhibition_registration_exists(p_email text, p_phone text)
returns boolean
language sql
stable
set search_path = ''
as $$
  select exists (
    select 1
      from public.exhibition_registrations r
     where lower(trim(r.email)) = lower(trim(p_email))
        or (
          length(regexp_replace(p_phone, '\D', '', 'g')) >= 9
          and right(regexp_replace(r.phone, '\D', '', 'g'), 9) = right(regexp_replace(p_phone, '\D', '', 'g'), 9)
        )
  );
$$;

revoke execute on function public.exhibition_registration_exists(text, text) from public, anon, authenticated;
grant execute on function public.exhibition_registration_exists(text, text) to service_role;
