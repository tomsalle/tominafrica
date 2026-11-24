import type { Metadata } from 'next';
import Image from 'next/image';
import { AdminLoginForm, AdminNav } from '@/components/admin/AdminLoginForm';
import { photoStory } from '@/content/photo-stories';
import { isAdmin, isAdminConfigured } from '@/lib/admin/auth';
import { formatPrice } from '@/lib/format';
import { photoSrc } from '@/lib/images';
import { countryName, formatFieldDate, journeyDay } from '@/lib/journey';
import { createAdminClient } from '@/lib/supabase/admin';
import type { PhotoRow, PrintOptionRow } from '@/types/database';

// Espace privé : toujours à jour, jamais mis en cache ni indexé.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tirages de l’expo — espace privé',
  robots: { index: false, follow: false },
};

const publishFormat = new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'Europe/Paris',
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
});

/**
 * Relecture des tirages de l'exposition avant leur mise en ligne : les photos
 * programmées (encore masquées sur le site) et celles déjà en vente, avec
 * leur récit et leurs prix, telles qu'elles apparaîtront.
 */
export default async function AdminPrintsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!(await isAdmin())) {
    const { erreur } = await searchParams;
    return (
      <AdminLoginForm title="Tirages de l’expo" next="/admin/tirages" error={erreur === '1'} configured={isAdminConfigured()} />
    );
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from('photos')
    .select(
      'id, slug, title, story, photographer, location_name, country_code, taken_at, image_path, image_width, image_height, blur_data_url, published, publish_at, print_options (label, price_cents, available, position)',
    )
    .or('publish_at.not.is.null,published.eq.true')
    .order('taken_at', { ascending: true, nullsFirst: false })
    .order('title');

  type Row = PhotoRow & { print_options: Pick<PrintOptionRow, 'label' | 'price_cents' | 'available' | 'position'>[] | null };
  const photos = ((data ?? []) as unknown as Row[])
    .map((photo) => ({
      ...photo,
      options: [...(photo.print_options ?? [])].filter((o) => o.available).sort((a, b) => a.position - b.position),
      text: photo.story?.trim() ? photo.story : photoStory(photo.slug, 'fr'),
    }))
    .filter((photo) => photo.options.length > 0);

  const missing = photos.filter((photo) => !photo.text).length;
  const scheduled = photos.find((photo) => photo.publish_at)?.publish_at;

  return (
    <div className="pt-28 pb-28 sm:pt-36">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <AdminNav current="tirages" />
        <h1 className="mt-3 font-display text-4xl font-light sm:text-5xl">Tirages de l’expo</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-paper-dim">
          {photos.length} photos en vente.{' '}
          {scheduled ? `Les photos masquées seront publiées ${publishFormat.format(new Date(scheduled))}. ` : ''}
          {missing > 0 ? `${missing} n’ont pas encore de récit.` : 'Toutes ont leur récit.'}
        </p>

        <ul className="mt-12 grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2">
          {photos.map((photo) => {
            const day = journeyDay(photo.taken_at);
            const facts = [
              photo.location_name || countryName(photo.country_code, 'fr'),
              formatFieldDate(photo.taken_at),
              day ? `jour ${day}` : null,
            ].filter(Boolean);
            const ratio = photo.image_width && photo.image_height ? photo.image_width / photo.image_height : 3 / 4;

            return (
              <li key={photo.id} className="flex flex-col">
                <div className="relative overflow-hidden bg-ink-soft" style={{ aspectRatio: ratio }}>
                  <Image
                    src={photoSrc(photo.image_path, photo.image_width)}
                    alt={photo.title}
                    fill
                    sizes="(min-width: 768px) 45vw, 90vw"
                    className="object-cover"
                    {...(photo.blur_data_url ? { placeholder: 'blur' as const, blurDataURL: photo.blur_data_url } : {})}
                  />
                </div>

                <p className={`eyebrow mt-5 ${photo.published ? 'text-paper' : 'text-brand-text'}`}>
                  {photo.published ? 'En ligne' : 'Masquée jusqu’au 27 novembre'}
                </p>
                <h2 className="mt-2 font-display text-3xl font-light">{photo.title}</h2>
                <p className={`mt-1 text-sm ${photo.photographer ? 'text-paper' : 'text-brand-text'}`}>
                  {photo.photographer ? `Photo : ${photo.photographer}` : 'Photographe à préciser'}
                </p>
                <p className="mt-1 text-sm text-paper-dim">
                  {facts.length > 0 ? facts.join(' · ') : 'Lieu et date inconnus'}
                </p>
                <p className="mt-1 text-xs text-paper-faint">/photo/{photo.slug}</p>

                <p className="mt-4 text-sm text-paper tabular-nums">
                  {photo.options.map((o) => `${o.label} : ${formatPrice(o.price_cents)}`).join(' · ')}
                </p>

                {photo.text ? (
                  <div className="mt-4 space-y-3 text-sm leading-relaxed text-paper-dim">
                    {photo.text.split(/\n\s*\n/).map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 border border-brand/60 px-4 py-3 text-sm text-paper">
                    Récit à écrire : envoie l’anecdote de cette photo à Claude.
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
