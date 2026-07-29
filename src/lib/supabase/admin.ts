import 'server-only';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { publicEnv, serverEnv } from '@/lib/env';
import type { Database } from '@/types/database';

/**
 * Client Supabase à privilèges élevés.
 *
 * ⚠️ Utilise la clé service_role, qui CONTOURNE LA RLS. Réservé à deux usages :
 *   - le webhook Stripe, qui doit écrire dans `orders` / `order_items` ;
 *   - le script d'import de photos.
 *
 * L'import de `server-only` en tête de fichier fait échouer le build si ce
 * module se retrouve un jour dans un bundle client — c'est une barrière, pas
 * une convention.
 */
export function createAdminClient() {
  const { SUPABASE_SERVICE_ROLE_KEY } = serverEnv();

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY n'est pas configurée. " +
        'Récupère-la dans Supabase Dashboard → Project Settings → API → service_role, ' +
        'puis ajoute-la à .env.local (et aux variables d\'environnement Vercel).',
    );
  }

  return createSupabaseClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}
