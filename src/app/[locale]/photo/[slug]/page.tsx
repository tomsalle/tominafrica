import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { FieldNote } from '@/components/journey/FieldNote';
import { JourneyLine } from '@/components/journey/JourneyLine';
import { AfricaMap } from '@/components/photo/AfricaMap';
import { PhotoMap } from '@/components/photo/PhotoMap';
import { PhotoStory } from '@/components/photo/PhotoStory';
import { PhotoViewer } from '@/components/photo/PhotoViewer';
import { PurchasePanel } from '@/components/photo/PurchasePanel';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { Link } from '@/i18n/navigation';
import { FramePreferenceProvider } from '@/lib/frame-preference';
import { photoAbsoluteSrc, photoSrc } from '@/lib/images';
import { countryName, journeyDay } from '@/lib/journey';
import { getAllPhotoSlugs, getJourneyPhotos, getPhotoBySlug, type JourneyPhoto } from '@/lib/queries/photos';

export const revalidate = 3600;

type PageProps = { params: Promise<{ slug: string; locale: string }> };

export async function generateStaticParams() {
  const slugs = await getAllPhotoSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const photo = await getPhotoBySlug(slug);

  if (!photo) {
    const t = await getTranslations({ locale, namespace: 'photo' });
    return { title: t('notFoundTitle') };
  }

  const t = await getTranslations({ locale, namespace: 'photo' });
  const where = photo.location_name || countryName(photo.country_code, locale);
  const description =
    photo.caption ??
    photo.story?.split(/\n\s*\n/)[0]?.slice(0, 200) ??
    t('metaDescription', { title: photo.title, where: where ?? '' });

  return {
    title: photo.title,
    description,
    openGraph: {
      type: 'article',
      title: photo.title,
      description,
      images: [{ url: photoAbsoluteSrc(photo.image_path, photo.image_width), alt: photo.title }],
    },
  };
}

export default async function PhotoPage({ params }: PageProps) {
  const { slug, locale } = await params;
  const t = await getTranslations('photo');
  const [photo, journey] = await Promise.all([getPhotoBySlug(slug), getJourneyPhotos()]);

  if (!photo) notFound();

  const index = journey.findIndex((item) => item.slug === photo.slug);
  const previous = index > 0 ? journey[index - 1] : undefined;
  const next = index >= 0 && index < journey.length - 1 ? journey[index + 1] : undefined;
  const country = countryName(photo.country_code, locale);
  const prices = photo.print_options.map((option) => option.price_cents);

  // Données structurées : la photo comme œuvre en vente, pour les résultats
  // enrichis des moteurs de recherche (prix, disponibilité, image).
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: photo.title,
    image: photoAbsoluteSrc(photo.image_path, photo.image_width),
    description: photo.caption ?? undefined,
    brand: { '@type': 'Brand', name: 'Tom in Africa' },
    ...(prices.length > 0
      ? {
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'EUR',
            lowPrice: (Math.min(...prices) / 100).toFixed(2),
            highPrice: (Math.max(...prices) / 100).toFixed(2),
            offerCount: prices.length,
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  };

  return (
    <article className="pt-24 pb-28 sm:pt-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Grand écran : la photo à gauche, immobile pendant qu'on lit et
          qu'on choisit son tirage à droite — l'image reste sous les yeux au
          moment de décider. Mobile : une seule colonne, photo d'abord. */}
      <FramePreferenceProvider>
        <Container width="wide">
          <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_25rem] xl:gap-x-24">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <PhotoViewer photo={photo} />
            </div>

            <div className="lg:pt-4">
              {photo.series ? (
                <Link href={`/series/${photo.series.slug}`} className="eyebrow link-underline">
                  {photo.series.title}
                </Link>
              ) : null}

              <h1 className="mt-5 font-display text-5xl leading-[0.95] font-light text-balance sm:text-6xl">
                {photo.title}
              </h1>

              <FieldNote
                takenAt={photo.taken_at}
                countryCode={photo.country_code}
                place={photo.location_name}
                className="mt-5"
              />

              <div className="mt-12 space-y-14">
                <PhotoStory story={photo.story} title={photo.title} />

                <PurchasePanel photo={photo} />

                {photo.country_code || photo.taken_at ? (
                  <section aria-labelledby="reperes-titre" className="border-t border-ink-line pt-8">
                    <h2 id="reperes-titre" className="eyebrow">
                      {t('landmarksHeading')}
                    </h2>
                    <div className="mt-6 flex items-center gap-6">
                      {photo.country_code ? (
                        <div className="w-20 shrink-0">
                          <AfricaMap countryCode={photo.country_code} />
                        </div>
                      ) : null}
                      <div className="min-w-0 flex-1">
                        {country ? <p className="font-display text-2xl font-light">{country}</p> : null}
                        <JourneyLine takenAt={photo.taken_at} className="mt-4 pb-6" />
                      </div>
                    </div>
                  </section>
                ) : null}

                {photo.latitude !== null && photo.longitude !== null ? (
                  <section aria-labelledby="lieu-titre">
                    <h2 id="lieu-titre" className="eyebrow">
                      {t('placeHeading')}
                    </h2>
                    <div className="mt-7">
                      <PhotoMap
                        latitude={photo.latitude}
                        longitude={photo.longitude}
                        zoom={photo.map_zoom}
                        locationName={photo.location_name}
                      />
                    </div>
                  </section>
                ) : null}
              </div>
            </div>
          </div>
        </Container>
      </FramePreferenceProvider>

      {/* ---- Sur la route : la photo d'avant, la photo d'après --------------- */}
      {previous || next ? (
        <nav aria-label={t('journeyNav')} className="mt-32 border-t border-ink-line pt-14">
          <Container width="wide">
            <Reveal>
              <h2 className="eyebrow">{t('onTheRoad')}</h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-6 sm:gap-10 lg:grid-cols-4">
              {previous ? (
                <JourneyNeighbour photo={previous} direction="previous" from={photo.taken_at} />
              ) : (
                <span />
              )}
              {next ? <JourneyNeighbour photo={next} direction="next" from={photo.taken_at} /> : null}
            </div>
          </Container>
        </nav>
      ) : null}
    </article>
  );
}

async function JourneyNeighbour({
  photo,
  direction,
  from,
}: {
  photo: JourneyPhoto;
  direction: 'previous' | 'next';
  from: string | null;
}) {
  const t = await getTranslations('journey');
  const fromDay = journeyDay(from);
  const toDay = journeyDay(photo.taken_at);
  const gap = fromDay !== null && toDay !== null ? Math.abs(toDay - fromDay) : null;
  const label =
    gap === null
      ? direction === 'previous'
        ? t('previous')
        : t('next')
      : direction === 'previous'
        ? t('earlier', { count: gap })
        : t('later', { count: gap });
  const ratio = photo.image_width && photo.image_height ? photo.image_width / photo.image_height : 3 / 4;

  return (
    <Link
      href={`/photo/${photo.slug}`}
      className={`group block ${direction === 'next' ? 'lg:col-start-4' : ''}`}
      aria-label={`${direction === 'previous' ? t('previous') : t('next')} — ${photo.title}`}
    >
      <p className="eyebrow mb-4 text-paper-faint">
        {direction === 'previous' ? `← ${label}` : `${label} →`}
      </p>
      <div className="relative overflow-hidden bg-ink-soft" style={{ aspectRatio: ratio }}>
        <Image
          src={photoSrc(photo.image_path, photo.image_width)}
          alt=""
          fill
          sizes="(min-width: 1024px) 22vw, 45vw"
          className="object-cover"
          {...(photo.blur_data_url ? { placeholder: 'blur' as const, blurDataURL: photo.blur_data_url } : {})}
        />
      </div>
      <p className="mt-4 font-display text-xl leading-tight font-light">
        <span className="link-underline">{photo.title}</span>
      </p>
      <FieldNote takenAt={photo.taken_at} countryCode={photo.country_code} place={photo.location_name} compact className="mt-1.5" />
    </Link>
  );
}
