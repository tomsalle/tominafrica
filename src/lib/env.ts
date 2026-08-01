import { z } from 'zod';

/**
 * Validation des variables d'environnement.
 *
 * Deux ensembles distincts, et la distinction n'est pas cosmétique :
 *
 *  - `publicEnv` : variables NEXT_PUBLIC_*, inlinées dans le bundle navigateur.
 *    Validées au chargement du module, donc une erreur de configuration fait
 *    échouer le build plutôt que de produire un site cassé en production.
 *
 *  - `serverEnv()` : secrets. Lus paresseusement et jamais au niveau module,
 *    pour qu'aucun bundler ne puisse les faire fuir vers le client.
 *
 * Les références à process.env sont écrites en toutes lettres : Next.js les
 * remplace statiquement à la compilation, un accès dynamique ne fonctionnerait
 * pas côté navigateur.
 */

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url('NEXT_PUBLIC_SUPABASE_URL doit être une URL valide'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY est requise'),
  NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
});

function parsePublicEnv() {
  const parsed = publicSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });

  if (!parsed.success) {
    const details = parsed.error.issues.map((i) => `  • ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(
      `Variables d'environnement publiques invalides :\n${details}\n\n` +
        'Copie .env.example vers .env.local et renseigne les valeurs manquantes.',
    );
  }

  return parsed.data;
}

export const publicEnv = parsePublicEnv();

// ---------------------------------------------------------------------------
// Secrets — serveur uniquement
// ---------------------------------------------------------------------------

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_EMAIL: z.email().default('tomsallepro@gmail.com'),
});

export type ServerEnv = z.infer<typeof serverSchema>;

export function serverEnv(): ServerEnv {
  if (typeof window !== 'undefined') {
    throw new Error('serverEnv() ne doit jamais être appelée côté navigateur.');
  }

  return serverSchema.parse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || undefined,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || undefined,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || undefined,
    RESEND_API_KEY: process.env.RESEND_API_KEY || undefined,
    CONTACT_EMAIL: process.env.CONTACT_EMAIL || undefined,
  });
}

/**
 * Le paiement en ligne est-il configuré ?
 *
 * Le site doit rester parfaitement fonctionnel sans Stripe : on peut parcourir
 * les séries, lire les récits et remplir un panier. Seul le passage en caisse
 * est désactivé, avec un message explicite plutôt qu'une erreur.
 */
export function isCheckoutEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/**
 * Le formulaire de contact envoie-t-il vraiment un e-mail ?
 *
 * Comme pour Stripe : le site doit rester utilisable sans RESEND_API_KEY, le
 * formulaire répond juste que l'envoi est momentanément indisponible.
 */
export function isContactFormEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}
