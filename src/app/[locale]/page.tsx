import { getTranslations } from 'next-intl/server';
import { ContactForm } from '@/components/home/ContactForm';
import { SeriesHero } from '@/components/home/SeriesHero';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { Link } from '@/i18n/navigation';
import { getSeriesList } from '@/lib/queries/series';

// Le catalogue change rarement : rendu statique, revalidé toutes les heures.
export const revalidate = 3600;

export default async function HomePage() {
  const t = await getTranslations('home');
  const series = await getSeriesList();

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

  return (
    <>
      <h1 className="sr-only">{t('srTitle')}</h1>

      {series.map((item, index) => (
        <SeriesHero key={item.id} series={item} index={index} priority={index === 0} />
      ))}

      <div className="py-24 sm:py-32">
        <Container width="prose">
          <Reveal>
            <p className="eyebrow">{t('projectEyebrow')}</p>
            <p className="mt-7 text-lg leading-relaxed text-paper-dim sm:text-xl">
              {t('projectP1')}
            </p>
            <p className="mt-6 text-lg leading-relaxed text-paper-dim sm:text-xl">
              {t('projectP2')}
            </p>
            <Link href="/notre-aventure" className="eyebrow link-underline mt-9 inline-block text-paper">
              {t('adventureLink')}
            </Link>
          </Reveal>
        </Container>

        <Container width="default" className="mt-16 sm:mt-20">
          <Reveal>
            <div className="relative aspect-video w-full overflow-hidden bg-ink-soft">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
                poster="/videos/namibie-hero-poster.jpg"
              >
                <source src="/videos/namibie-hero.mp4" type="video/mp4" />
              </video>
            </div>
            <Link href="/videos" className="eyebrow link-underline mt-6 inline-block text-paper">
              {t('videosLink')}
            </Link>
          </Reveal>
        </Container>

        <Container width="prose" className="mt-24 sm:mt-32">
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
