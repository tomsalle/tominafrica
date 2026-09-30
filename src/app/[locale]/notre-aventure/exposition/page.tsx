import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ExpositionForm } from '@/components/exhibition/ExpositionForm';
import { Container } from '@/components/ui/Container';
import { languageAlternates } from '@/i18n/alternates';
import { Link } from '@/i18n/navigation';

// Même affiche que la pop-in d'annonce (public/expo/poster.avif).
const POSTER = { src: '/expo/poster.avif', width: 846, height: 1200 };

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
    alternates: { languages: languageAlternates('/notre-aventure/exposition') },
    robots: { index: false, follow: false },
  };
}

export default async function ExpositionPage() {
  const t = await getTranslations('expositionPage');

  return (
    <div className="pt-32 pb-28 sm:pt-40">
      <Container width="prose">
        <div
          className="relative mx-auto w-full max-w-sm overflow-hidden bg-ink-soft"
          style={{ aspectRatio: POSTER.width / POSTER.height }}
        >
          <Image
            src={POSTER.src}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 24rem"
            className="object-contain"
            priority
          />
        </div>

        <Link href="/notre-aventure" className="mt-10 eyebrow link-underline block">
          {t('backLink')}
        </Link>

        <h1 className="mt-6 font-display text-5xl leading-none font-light sm:text-6xl">
          {t('title')}
        </h1>
        <p className="mt-6 text-base leading-relaxed text-paper-dim sm:text-lg">{t('body')}</p>

        <div className="mt-14">
          <ExpositionForm />
        </div>
      </Container>
    </div>
  );
}
