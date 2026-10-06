import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ExpositionForm } from '@/components/exhibition/ExpositionForm';
import { Container } from '@/components/ui/Container';
import { languageAlternates } from '@/i18n/alternates';
import { Link } from '@/i18n/navigation';
import { publicEnv } from '@/lib/env';
import { EXHIBITION, EXHIBITION_PATH } from '@/lib/exhibition/event';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'expositionPage' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { languages: languageAlternates(EXHIBITION_PATH) },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      images: [{ url: EXHIBITION.poster.src, width: EXHIBITION.poster.width, height: EXHIBITION.poster.height }],
    },
  };
}

export default async function ExpositionPage() {
  const t = await getTranslations('expositionPage');

  // Données structurées « événement » : dates et lieu lisibles par les
  // moteurs de recherche (résultats enrichis, agenda).
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ExhibitionEvent',
    name: t('eventName'),
    startDate: EXHIBITION.start,
    endDate: EXHIBITION.end,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    image: `${publicEnv.NEXT_PUBLIC_SITE_URL}${EXHIBITION.poster.src}`,
    description: t('metaDescription'),
    location: {
      '@type': 'Place',
      name: EXHIBITION.venue,
      address: {
        '@type': 'PostalAddress',
        streetAddress: EXHIBITION.street,
        postalCode: EXHIBITION.postalCode,
        addressLocality: EXHIBITION.city,
        addressCountry: 'FR',
      },
    },
    organizer: { '@type': 'Organization', name: 'Tom in Africa', url: publicEnv.NEXT_PUBLIC_SITE_URL },
  };

  const details = [
    { term: t('datesLabel'), detail: t('datesValue') },
    { term: t('openingLabel'), detail: t('openingValue') },
    {
      term: t('venueLabel'),
      detail: `${EXHIBITION.venue} · ${EXHIBITION.street}, ${EXHIBITION.postalCode} ${EXHIBITION.city}`,
    },
    { term: t('programmeLabel'), detail: t('programmeValue') },
  ];

  return (
    <div className="pt-28 pb-28 sm:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Container width="wide">
        <div className="grid grid-cols-1 gap-x-20 gap-y-14 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
          {/* L'affiche porte déjà titre, dates et lieu : elle reste visible
              pendant qu'on remplit le formulaire. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div
              className="relative mx-auto w-full max-w-sm overflow-hidden bg-ink-soft lg:max-w-none"
              style={{ aspectRatio: EXHIBITION.poster.width / EXHIBITION.poster.height }}
            >
              <Image
                src={EXHIBITION.poster.src}
                alt={t('posterAlt')}
                fill
                sizes="(min-width: 1024px) 26rem, (min-width: 640px) 24rem, 100vw"
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="max-w-[40rem]">
            <Link href="/notre-aventure" className="eyebrow link-underline">
              {t('backLink')}
            </Link>

            <h1 className="mt-6 font-display text-5xl leading-none font-light sm:text-6xl">{t('title')}</h1>
            <p className="mt-6 font-display text-3xl font-light text-paper-dim tabular-nums">{t('datesShort')}</p>

            <dl className="mt-10 divide-y divide-ink-line border-y border-ink-line">
              {details.map((item) => (
                <div key={item.term} className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                  <dt className="text-[0.6875rem] tracking-[0.14em] text-paper-faint uppercase sm:pt-0.5">{item.term}</dt>
                  <dd className="text-sm leading-relaxed text-paper">{item.detail}</dd>
                </div>
              ))}
            </dl>

            <a
              href={EXHIBITION.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow link-underline mt-6 inline-block text-paper"
            >
              {t('mapLink')}
            </a>

            <section aria-labelledby="inscription-titre" className="mt-16">
              <h2 id="inscription-titre" className="font-display text-3xl font-light">
                {t('formTitle')}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-paper-dim">{t('formIntro')}</p>
              <div className="mt-10">
                <ExpositionForm />
              </div>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
