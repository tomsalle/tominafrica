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
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const parsed = exhibitionRegistrationRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Formulaire invalide.' },
      { status: 400 },
    );
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
    return NextResponse.json(
      { error: "L'inscription a échoué. Réessayez dans un instant." },
      { status: 502 },
    );
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
