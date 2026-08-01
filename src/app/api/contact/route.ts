import { NextResponse } from 'next/server';
import { contactRequestSchema } from '@/lib/contact/types';
import { isContactFormEnabled, serverEnv } from '@/lib/env';
import { CONTACT_FROM_ADDRESS, getResend } from '@/lib/resend/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!isContactFormEnabled()) {
    return NextResponse.json(
      { error: "L'envoi de message n'est pas encore activé sur ce site." },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const parsed = contactRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Formulaire invalide.' },
      { status: 400 },
    );
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
    return NextResponse.json(
      { error: "L'envoi a échoué. Réessayez dans un instant, ou écrivez directement." },
      { status: 502 },
    );
  }
}
