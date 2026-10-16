import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, ADMIN_COOKIE_MAX_AGE, adminSessionToken, checkAdminPassword } from '@/lib/admin/auth';

export const runtime = 'nodejs';

const ADMIN_PAGE = '/admin/precommandes';

/** Connexion à l'espace privé (formulaire classique : marche même sans JavaScript). */
export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const password = String(form?.get('password') ?? '');

  if (!checkAdminPassword(password)) {
    // Petit délai : rend les essais en rafale inutiles.
    await new Promise((resolve) => setTimeout(resolve, 900));
    return NextResponse.redirect(new URL(`${ADMIN_PAGE}?erreur=1`, request.url), 303);
  }

  const response = NextResponse.redirect(new URL(ADMIN_PAGE, request.url), 303);
  response.cookies.set(ADMIN_COOKIE, adminSessionToken() ?? '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
  return response;
}
