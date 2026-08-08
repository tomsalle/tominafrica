import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Prose } from '@/components/ui/Prose';
import { Reveal } from '@/components/ui/Reveal';
import { languageAlternates } from '@/i18n/alternates';
import { Link } from '@/i18n/navigation';
import { bookPreorderUrl } from '@/lib/env';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'notreAventure' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { languages: languageAlternates('/notre-aventure') },
  };
}

export default async function AdventurePage() {
  const t = await getTranslations('notreAventure');
  const preorderUrl = bookPreorderUrl();

  return (
    <>
      {/* Vidéo en fond plutôt qu'une photo : c'est le seul endroit du site où
          le mouvement raconte quelque chose que l'image fixe ne peut pas —
          l'aventure elle-même, pas une photographie qui en est issue. */}
      <section className="relative h-dvh min-h-[36rem] w-full overflow-hidden">
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

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/40" />

        <div className="relative flex h-full items-end">
          <div className="mx-auto w-full max-w-[110rem] px-5 pb-20 sm:px-8 sm:pb-24">
            <p className="eyebrow">{t('dateRange')}</p>
            <h1 className="mt-5 font-display text-5xl leading-[0.95] font-light tracking-tight sm:text-7xl lg:text-8xl">
              {t('title')}
            </h1>
            <p className="mt-4 max-w-xl text-base text-paper-dim sm:text-lg">{t('subtitle')}</p>
          </div>
        </div>
      </section>

      <div className="pt-24 pb-28 sm:pt-32">
        <Container width="wide">
          <div className="grid grid-cols-1 gap-x-20 gap-y-16 lg:grid-cols-[1fr_24rem]">
            <div className="space-y-16">
              <Reveal>
                <div className="max-w-[42rem]">
                  <p className="eyebrow">{t('bornFromDreamEyebrow')}</p>
                  <p className="mt-6 font-display text-3xl leading-snug font-light text-paper sm:text-4xl">
                    {t('lead')}
                  </p>
                  <p className="mt-6 text-base leading-relaxed text-paper-dim sm:text-lg">
                    {t('intro')}
                  </p>
                </div>
              </Reveal>

              <Reveal>
                <AdventurePhoto
                  src="/notre-aventure/vehicule-canyon.jpg"
                  alt={t('canyonPhotoAlt')}
                  width={2000}
                  height={1333}
                />
              </Reveal>

              <Reveal>
                <Prose>
                  <h2>{t('whoTitle')}</h2>
                  <p>{t('whoP1')}</p>
                </Prose>
              </Reveal>

              <Reveal>
                <AdventurePhoto
                  src="/notre-aventure/traversee-riviere.jpg"
                  alt={t('riverPhotoAlt')}
                  width={2000}
                  height={1292}
                />
              </Reveal>

              <Reveal>
                <Prose>
                  <p>{t('prep1')}</p>

                  <h2>{t('projectTitle')}</h2>
                  <p>{t('projectP1')}</p>
                  <p>{t('projectP2')}</p>
                </Prose>
              </Reveal>

              <Reveal>
                <ArtistsGrid
                  alts={{
                    sanaePortrait: t('artistSanaePortraitAlt'),
                    amyPortrait: t('artistAmyPortraitAlt'),
                    patrickPortrait: t('artistPatrickPortraitAlt'),
                    sanaeWork: t('artistSanaeWorkAlt'),
                    patrickWork: t('artistPatrickWorkAlt'),
                    mosaicWork: t('artistMosaicWorkAlt'),
                  }}
                />
              </Reveal>

              <Reveal>
                <Prose>
                  <p>{t('associationsP1')}</p>

                  <h2>{t('waterTitle')}</h2>
                  <p>{t('waterP1')}</p>
                </Prose>
              </Reveal>

              <Reveal>
                <AdventurePhoto
                  src="/notre-aventure/rencontre-chef-village.jpg"
                  alt={t('villageChiefPhotoAlt')}
                  width={2000}
                  height={1125}
                />
              </Reveal>

              <Reveal>
                <Prose>
                  <p>{t('unexpectedP1')}</p>
                </Prose>
              </Reveal>

              <Reveal>
                <AdventurePhoto
                  src="/notre-aventure/village-route-troupeau.jpg"
                  alt={t('cattlePhotoAlt')}
                  width={2000}
                  height={1124}
                />
              </Reveal>

              <Reveal>
                <Prose>
                  <h2>{t('welcomeTitle')}</h2>
                  <p>{t('welcomeP1')}</p>
                </Prose>
              </Reveal>
            </div>

            <Reveal delay={90}>
              <div className="space-y-10 lg:sticky lg:top-28 lg:self-start">
                <div className="border border-ink-line p-7">
                  <p className="eyebrow">{t('bookEyebrow')}</p>
                  <p className="mt-4 text-sm leading-relaxed text-paper-dim">{t('bookP1')}</p>

                  {preorderUrl ? (
                    <a
                      href={preorderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-paper px-6 py-3 text-[0.6875rem] font-medium tracking-[0.24em] text-ink uppercase transition-[color,background-color,border-color,transform] duration-300 hover:bg-white active:scale-[0.97]"
                    >
                      {t('preorderCta')}
                    </a>
                  ) : (
                    <p className="mt-6 border border-ink-line px-4 py-3 text-center text-xs text-paper-faint">
                      {t('preorderSoon')}
                    </p>
                  )}
                </div>

                <div className="border border-ink-line p-7">
                  <p className="eyebrow">{t('exhibitionEyebrow')}</p>
                  <p className="mt-4 text-sm leading-relaxed text-paper-dim">
                    {t('exhibitionP1')}
                  </p>
                  <ButtonLink
                    href="/notre-aventure/exposition"
                    variant="outline"
                    className="mt-6 w-full"
                  >
                    {t('exhibitionCta')}
                  </ButtonLink>
                </div>

                <div className="space-y-4">
                  <ButtonLink
                    href="/series/1-mere-1-fils-1-reve"
                    variant="outline"
                    className="w-full"
                  >
                    {t('viewPhotosCta')}
                  </ButtonLink>
                  <Link
                    href="/videos"
                    className="eyebrow link-underline block text-center text-paper"
                  >
                    {t('viewVideosCta')}
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </div>
    </>
  );
}

/** Photo pleine largeur de colonne, entre deux blocs de texte. */
function AdventurePhoto({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  return (
    <div className="bg-ink-soft">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="h-auto w-full"
      />
    </div>
  );
}

/** Portraits des artistes rencontrés et l'une de leurs œuvres, en vis-à-vis. */
function ArtistsGrid({
  alts,
}: {
  alts: {
    sanaePortrait: string;
    amyPortrait: string;
    patrickPortrait: string;
    sanaeWork: string;
    patrickWork: string;
    mosaicWork: string;
  };
}) {
  const images = [
    { src: '/notre-aventure/sanae-portrait.jpg', alt: alts.sanaePortrait },
    { src: '/notre-aventure/amy-sow-portrait.jpg', alt: alts.amyPortrait },
    { src: '/notre-aventure/patrick-portrait.jpg', alt: alts.patrickPortrait },
    { src: '/notre-aventure/sanae-oeuvre.jpg', alt: alts.sanaeWork },
    { src: '/notre-aventure/oeuvre-portrait-femme.jpg', alt: alts.patrickWork },
    { src: '/notre-aventure/oeuvre-mosaique.jpg', alt: alts.mosaicWork },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
      {images.map((image) => (
        <div key={image.src} className="relative aspect-[3/4] overflow-hidden bg-ink-soft">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 18vw, 45vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
