import 'server-only';

import { Resend } from 'resend';
import { serverEnv } from '@/lib/env';

/**
 * Client Resend, pour le formulaire de contact.
 *
 * Instancié paresseusement, comme getStripe() : le site doit démarrer et se
 * construire sans clé Resend (voir isContactFormEnabled()).
 */
let cached: Resend | null = null;

export function getResend(): Resend {
  if (cached) return cached;

  const { RESEND_API_KEY } = serverEnv();

  if (!RESEND_API_KEY) {
    throw new Error(
      "RESEND_API_KEY n'est pas configurée. Crée un compte sur resend.com, " +
        'récupère une clé API et ajoute-la à .env.local pour activer le formulaire de contact.',
    );
  }

  cached = new Resend(RESEND_API_KEY);
  return cached;
}

/**
 * Adresse d'envoi.
 *
 * tominafrica.com est vérifié sur Resend (DKIM/SPF via les enregistrements
 * DNS Vercel) : l'envoi n'est plus limité à un seul destinataire de test,
 * contrairement à onboarding@resend.dev utilisé au départ.
 */
export const CONTACT_FROM_ADDRESS = 'Tom in Africa <contact@tominafrica.com>';
