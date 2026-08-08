import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Prose } from '@/components/ui/Prose';
import { languageAlternates } from '@/i18n/alternates';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'aPropos' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { languages: languageAlternates('/a-propos') },
  };
}

export default async function AboutPage() {
  const t = await getTranslations('aPropos');

  return (
    <div className="pt-32 pb-28 sm:pt-40">
      <Container width="wide">
        <div className="grid grid-cols-1 gap-x-20 gap-y-14 lg:grid-cols-[24rem_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="relative aspect-3/4 w-full overflow-hidden bg-ink-soft">
              {/* Remplacer par un portrait : /public/portrait.jpg */}
              <Image
                src="/placeholders/dune-45.svg"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 24rem"
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <p className="eyebrow">{t('eyebrow')}</p>

            <h1 className="mt-6 font-display text-5xl leading-[1.02] font-light sm:text-6xl whitespace-pre-line">
              {t('title')}
            </h1>

            <div className="mt-14">
              <Prose>
                <p>
                  <mark>{t('bioPlaceholder')}</mark>
                </p>

                <h2>{t('approachTitle')}</h2>
                <p>{t('approachP1')}</p>
                <p>{t('approachP2')}</p>

                <h2>{t('fieldworkTitle')}</h2>
                <p>
                  <mark>{t('fieldworkPlaceholder')}</mark>
                </p>

                <h2>{t('printsTitle')}</h2>
                <p>
                  {t('printsP1Before')} <mark>{t('printsP1Placeholder')}</mark>
                  {t('printsP1After')}
                </p>
                <p>{t('printsP2')}</p>

                <h2>{t('contactTitle')}</h2>
                <p>
                  {t('contactP1Before')} <mark>{t('contactP1Placeholder')}</mark>.
                </p>
              </Prose>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
