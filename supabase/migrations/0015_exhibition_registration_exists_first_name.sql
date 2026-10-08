-- Doublons d'inscription : le prénom doit aussi correspondre.
--
-- Des familles s'inscrivent avec un même e-mail ou un même téléphone (un
-- parent inscrit ses enfants, un couple partage une adresse) : ce sont des
-- personnes différentes, à accepter. On ne considère donc quelqu'un comme
-- déjà inscrit que si le PRÉNOM est le même (sans casse ni accents) ET que
-- l'e-mail ou le téléphone est déjà connu.

drop function public.exhibition_registration_exists(text, text);

create function public.exhibition_registration_exists(p_first_name text, p_email text, p_phone text)
returns boolean
language sql
stable
set search_path = ''
as $$
  select exists (
    select 1
      from public.exhibition_registrations r
     where translate(lower(trim(r.first_name)), 'àâäáãåçéèêëíìîïñóòôöõúùûüýÿ', 'aaaaaaceeeeiiiinooooouuuuyy')
         = translate(lower(trim(p_first_name)), 'àâäáãåçéèêëíìîïñóòôöõúùûüýÿ', 'aaaaaaceeeeiiiinooooouuuuyy')
       and (
         lower(trim(r.email)) = lower(trim(p_email))
         or (
           length(regexp_replace(p_phone, '\D', '', 'g')) >= 9
           and right(regexp_replace(r.phone, '\D', '', 'g'), 9) = right(regexp_replace(p_phone, '\D', '', 'g'), 9)
         )
       )
  );
$$;

revoke execute on function public.exhibition_registration_exists(text, text, text) from public, anon, authenticated;
grant execute on function public.exhibition_registration_exists(text, text, text) to service_role;
