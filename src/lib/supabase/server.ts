import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { publicEnv } from '@/lib/env';
import type { Database } from '@/types/database';

/**
 * Client Supabase pour la lecture du catalogue (Server Components, sitemap,
 * generateStaticParams, Route Handlers).
 *
 * Volontairement SANS cookies. Le site n'a pas d'authentification visiteur :
 * tout le monde voit le même catalogue public. Un client à base de cookies
 * appellerait `cookies()`, ce qui d'une part est interdit dans
 * `generateStaticParams` (exécuté au build, hors requête HTTP), et d'autre part
 * forcerait toutes les pages en rendu dynamique — exactement ce qu'on ne veut
 * pas pour une galerie qui change une fois par mois.
 *
 * La clé publishable reste soumise à la RLS : ce client ne peut lire que le
 * catalogue publié, jamais les commandes ni les clients.
 */
export async function createClient() {
  return createSupabaseClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}
