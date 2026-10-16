import 'server-only';

import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

/**
 * Accès à l'espace privé (/admin/…) : un seul mot de passe, celui de Tom, lu
 * dans la variable d'environnement ADMIN_PASSWORD (Vercel + .env.local).
 * Une fois connecté, un cookie signé est posé pour 30 jours. Changer le mot
 * de passe déconnecte tout le monde (le cookie en dérive).
 */
export const ADMIN_COOKIE = 'ta_admin';
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function sameSecret(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkAdminPassword(input: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  return Boolean(password && input && sameSecret(input, password));
}

/** Valeur du cookie de session, dérivée du mot de passe. */
export function adminSessionToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHmac('sha256', password).update('tominafrica-admin-v1').digest('hex');
}

export async function isAdmin(): Promise<boolean> {
  const expected = adminSessionToken();
  if (!expected) return false;
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  return Boolean(value && sameSecret(value, expected));
}
