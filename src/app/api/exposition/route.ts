import { getTranslations } from 'next-intl/server';
import { NextResponse } from 'next/server';
import { exhibitionRegistrationRequestSchema } from '@/lib/exhibition/types';
import { isContactFormEnabled, serverEnv } from '@/lib/env';
import { CONTACT_FROM_ADDRESS, getResend } from '@/lib/resend/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    const t = await getTranslations({ locale: 'fr', namespace: 'expositionForm' });
    return NextResponse.json({ error: t('invalidRequest') }, { status: 400 });
  }

  const locale =
    typeof payload === 'object' && payload !== null && 'locale' in payload
      ? String((payload as { locale?: unknown }).locale) === 'en'
        ? 'en'
        : 'fr'
      : 'fr';
  const t = await getTranslations({ locale, namespace: 'expositionForm' });

  const parsed = exhibitionRegistrationRequestSchema.safeParse(payload);
  if (!parsed.success) {
    // Message générique et traduit côté client : les messages Zod, en
    // français, ne servent qu'au diagnostic serveur (la validation native du
    // navigateur bloque déjà la plupart des soumissions invalides).
    console.error('[exposition] validation échouée', parsed.error.issues[0]?.message);
    return NextResponse.json({ error: t('invalidForm') }, { status: 400 });
  }

  const { firstName, lastName, email, phone, message, honeypot } = parsed.data;

  // Robot détecté : on répond succès sans rien enregistrer, sans le lui dire.
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  const supabase = await createClient();
  const { error } = await supabase.from('exhibition_registrations').insert({
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    message: message || null,
  });

  if (error) {
    console.error('[exposition] inscription impossible', error);
    return NextResponse.json({ error: t('registrationFailed') }, { status: 502 });
  }

  // Notification par e-mail — sur la meilleure base : l'inscription est déjà
  // enregistrée en base, un échec d'envoi ne doit pas faire échouer la requête.
  if (isContactFormEnabled()) {
    try {
      const resend = getResend();
      const { CONTACT_EMAIL } = serverEnv();

      await resend.emails.send({
        from: CONTACT_FROM_ADDRESS,
        to: CONTACT_EMAIL,
        replyTo: email,
        subject: `[Exposition] Inscription de ${firstName} ${lastName}`,
        text: [
          `${firstName} ${lastName}`,
          email,
          phone,
          message ? `\n${message}` : '',
        ].join('\n'),
      });
    } catch (sendError) {
      console.error('[exposition] notification e-mail impossible', sendError);
    }
  }

  return NextResponse.json({ ok: true });
}
