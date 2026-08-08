import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { YouTubeFacade } from '@/components/videos/YouTubeFacade';
import { languageAlternates } from '@/i18n/alternates';
import { VIDEOS } from '@/lib/videos-data';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'videos' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { languages: languageAlternates('/videos') },
  };
}

export default async function VideosPage() {
  const t = await getTranslations('videos');

  return (
    <div className="pt-32 pb-28 sm:pt-40">
      <Container width="wide">
        <header className="max-w-3xl">
          <p className="eyebrow">{t('eyebrow')}</p>
          <h1 className="mt-5 font-display text-5xl leading-[0.95] font-light sm:text-7xl">
            {t('title')}
          </h1>
          <p className="mt-8 text-base leading-relaxed text-paper-dim sm:text-lg">{t('body')}</p>
        </header>

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEOS.map((video, index) => (
            <Reveal key={video.id} delay={(index % 3) * 90}>
              <YouTubeFacade id={video.id} title={video.title} />
              <h2 className="mt-4 font-display text-xl leading-tight font-light">
                {video.title}
              </h2>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
