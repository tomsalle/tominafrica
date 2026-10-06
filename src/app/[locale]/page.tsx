import { getTranslations } from 'next-intl/server';
import { ExhibitionFeature } from '@/components/exhibition/ExhibitionFeature';
import { ContactForm } from '@/components/home/ContactForm';
import { JourneySequence } from '@/components/home/JourneySequence';
import { SeriesHero } from '@/components/home/SeriesHero';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { Link } from '@/i18n/navigation';
import { JOURNEY_COUNTRIES, JOURNEY_KM } from '@/lib/journey';
import { getJourneyPhotos } from '@/lib/queries/photos';
import { getSeriesList } from '@/lib/queries/series';

// Le catalogue change rarement : rendu statique, revalidé toutes les heures.
export const revalidate = 3600;

export default async function HomePage() {
  const t = await getTranslations('home');
  const tj = await getTranslations('journey');
  const [series, journey] = await Promise.all([getSeriesList(), getJourneyPhotos()]);

  if (series.length === 0) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6 text-center">
        <div>
          <h1 className="font-display text-4xl font-light">{t('emptyTitle')}</h1>
          <p className="mt-4 text-sm text-paper-dim">{t('emptyBody')}</p>
        </div>
      </div>
    );
  }

  const [main] = series;
  const gallerySlug = main?.slug ?? '';
  const stats = [
    { value: String(JOURNEY_COUNTRIES), label: tj('stats.countries') },
    { value: JOURNEY_KM.toLocaleString(t('numberLocale')), label: tj('stats.km') },
    { value: '6', label: tj('stats.months') },
  ];

  return (
    <>
      <h1 className="sr-only">{t('srTitle')}</h1>

      {main ? <SeriesHero series={main} priority /> : null}

      <ExhibitionFeature />

      <JourneySequence photos={journey} excludeId={main?.cover_photo_id} />

      {/* Le voyage en trois chiffres, puis le récit — court, avec un lien
          vers la page qui le raconte en entier. */}
      <section className="border-t border-ink-line py-28 sm:py-36">
        <Container width="wide">
          <Reveal>
            <p className="eyebrow">{t('projectEyebrow')}</p>
            <dl className="mt-12 grid grid-cols-3 gap-6 sm:max-w-3xl sm:gap-12">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-display text-5xl leading-none font-light tabular-nums sm:text-7xl">
                      {stat.value}
                    </span>
                    <span className="mt-3 block text-[0.6875rem] tracking-[0.14em] text-paper-faint uppercase">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal className="mt-16 max-w-[42rem]">
            <p className="text-lg leading-relaxed text-paper-dim sm:text-xl">{t('projectP1')}</p>
            <div className="mt-9 flex flex-wrap gap-x-10 gap-y-4">
              <Link href="/notre-aventure" className="eyebrow link-underline text-paper">
                {t('adventureLink')}
              </Link>
              <Link href="/videos" className="eyebrow link-underline text-paper">
                {t('videosLink')}
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {gallerySlug ? (
        <section className="border-t border-ink-line">
          <Link
            href={`/series/${gallerySlug}`}
            className="group mx-auto flex w-full max-w-[110rem] flex-wrap items-baseline justify-between gap-6 px-5 py-16 sm:px-8 sm:py-20"
          >
            <span className="font-display text-4xl font-light sm:text-6xl">
              <span className="link-underline">{t('galleryCta')}</span>
            </span>
            <span className="eyebrow text-paper-dim tabular-nums">
              {t('galleryCount', { count: journey.length })} →
            </span>
          </Link>
        </section>
      ) : null}

      <div className="border-t border-ink-line py-24 sm:py-32">
        <Container width="prose">
          <Reveal>
            <p className="eyebrow">{t('contactEyebrow')}</p>
            <h2 className="mt-5 font-display text-3xl leading-tight font-light sm:text-4xl">
              {t('contactTitle')}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-paper-dim">{t('contactBody')}</p>
            <div className="mt-10">
              <ContactForm />
            </div>
          </Reveal>
        </Container>
      </div>
    </>
  );
}
