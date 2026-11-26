import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { SlotChoiceForm } from '@/components/exhibition/SlotChoiceForm';
import { Container } from '@/components/ui/Container';
import { EXHIBITION_DAYS, dayHasSlots, type ExhibitionDay } from '@/lib/exhibition/event';
import { createAdminClient } from '@/lib/supabase/admin';

// Page personnelle (lien reçu par e-mail) : jamais en cache, jamais indexée.
export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string; locale: string }> };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'expositionSlot' });
  return { title: t('metaTitle'), robots: { index: false, follow: false } };
}

/**
 * Choix du créneau de visite du week-end, depuis le lien personnel envoyé par
 * e-mail aux personnes déjà inscrites. L'identifiant de l'inscription (UUID
 * aléatoire) sert de clé : seul son destinataire le connaît.
 */
export default async function SlotChoicePage({ params }: PageProps) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const { data: registration } = await createAdminClient()
    .from('exhibition_registrations')
    .select('id, first_name, visit_days, visit_slots')
    .eq('id', id)
    .maybeSingle();
  if (!registration) notFound();

  const t = await getTranslations('expositionSlot');
  const days = EXHIBITION_DAYS.filter(
    (day): day is ExhibitionDay => dayHasSlots(day) && (registration.visit_days ?? []).includes(day),
  );
  const initial = Object.fromEntries((registration.visit_slots ?? []).map((slot) => [slot.slice(0, 10), slot]));
  const name = registration.first_name.trim();

  return (
    <div className="pt-28 pb-28 sm:pt-36">
      <Container>
        <div className="mx-auto max-w-[40rem]">
          <p className="eyebrow">{t('eyebrow')}</p>
          <h1 className="mt-6 font-display text-5xl leading-none font-light sm:text-6xl">{t('title')}</h1>
          <p className="mt-8 text-base leading-relaxed text-paper-dim">
            {name ? t('intro', { name }) : t('introNoName')}
          </p>
          <div className="mt-12">
            {days.length ? (
              <SlotChoiceForm id={registration.id} days={days} initial={initial} />
            ) : (
              <p className="text-sm text-paper-dim">{t('noWeekend')}</p>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
