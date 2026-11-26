import { NextResponse } from 'next/server';
import { cleanSlots } from '@/lib/exhibition/event';
import { exhibitionSlotRequestSchema } from '@/lib/exhibition/types';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

/**
 * Enregistre le créneau choisi depuis le lien personnel envoyé par e-mail.
 * L'identifiant de l'inscription (UUID aléatoire) fait office de clé ; seuls
 * les créneaux des jours déjà choisis à l'inscription sont acceptés.
 */
export async function POST(request: Request) {
  const parsed = exhibitionSlotRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });

  const supabase = createAdminClient();
  const { data: registration, error } = await supabase
    .from('exhibition_registrations')
    .select('id, visit_days')
    .eq('id', parsed.data.id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: 'unavailable' }, { status: 502 });
  if (!registration) return NextResponse.json({ error: 'not-found' }, { status: 404 });

  const slots = cleanSlots(parsed.data.visitSlots, registration.visit_days);
  if (!slots) return NextResponse.json({ error: 'invalid' }, { status: 400 });

  const { error: updateError } = await supabase
    .from('exhibition_registrations')
    .update({ visit_slots: slots })
    .eq('id', registration.id);
  if (updateError) return NextResponse.json({ error: 'unavailable' }, { status: 502 });

  return NextResponse.json({ ok: true, slots });
}
