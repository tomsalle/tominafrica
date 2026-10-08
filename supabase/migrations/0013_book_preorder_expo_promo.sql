-- Code promo offert à chaque achat (livre ou formule, pas les dons) :
-- -10 % sur un tirage photo acheté sur place, à l'exposition uniquement.
-- Un code unique par précommande, envoyé dans l'e-mail de confirmation ;
-- Tom le vérifie à l'expo et note la date d'utilisation.

alter table public.book_preorder_pledges
  add column expo_promo_code        text unique,
  add column expo_promo_redeemed_at timestamptz;

-- Précommandes déjà payées avant l'ajout de l'offre.
update public.book_preorder_pledges
   set expo_promo_code = 'EXPO10-' || upper(substr(md5(gen_random_uuid()::text), 1, 6))
 where not is_donation
   and status = 'paid'
   and expo_promo_code is null;
