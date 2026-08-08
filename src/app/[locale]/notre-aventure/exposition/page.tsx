import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ExpositionForm } from '@/components/exhibition/ExpositionForm';
import { Container } from '@/components/ui/Container';
import { languageAlternates } from '@/i18n/alternates';
import { Link } from '@/i18n/navigation';

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
        <Link href="/notre-aventure" className="eyebrow link-underline">
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
