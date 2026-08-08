import { getTranslations } from 'next-intl/server';
import { NextResponse } from 'next/server';
import { contactRequestSchema } from '@/lib/contact/types';
import { isContactFormEnabled, serverEnv } from '@/lib/env';
import { CONTACT_FROM_ADDRESS, getResend } from '@/lib/resend/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    const t = await getTranslations({ locale: 'fr', namespace: 'contactForm' });
    return NextResponse.json({ error: t('invalidRequest') }, { status: 400 });
  }

  const locale =
    typeof payload === 'object' && payload !== null && 'locale' in payload
      ? String((payload as { locale?: unknown }).locale) === 'en'
        ? 'en'
        : 'fr'
      : 'fr';
  const t = await getTranslations({ locale, namespace: 'contactForm' });

  if (!isContactFormEnabled()) {
    return NextResponse.json({ error: t('serviceDisabled') }, { status: 503 });
  }

  const parsed = contactRequestSchema.safeParse(payload);
  if (!parsed.success) {
    // Message générique et traduit côté client : les messages Zod, en
    // français, ne servent qu'au diagnostic serveur (la validation native du
    // navigateur bloque déjà la plupart des soumissions invalides).
    console.error('[contact] validation échouée', parsed.error.issues[0]?.message);
    return NextResponse.json({ error: t('invalidForm') }, { status: 400 });
  }

  const { email, subject, message, honeypot } = parsed.data;

  // Robot détecté : on répond succès sans envoyer, sans le lui dire.
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  try {
    const resend = getResend();
    const { CONTACT_EMAIL } = serverEnv();

    const { error } = await resend.emails.send({
      from: CONTACT_FROM_ADDRESS,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `[Site] ${subject}`,
      text: `De : ${email}\n\n${message}`,
    });

    if (error) throw new Error(error.message);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[contact] envoi impossible', error);
    return NextResponse.json({ error: t('sendFailed') }, { status: 502 });
  }
}
