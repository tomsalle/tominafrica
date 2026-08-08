import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';

export default async function LegalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="pt-32 pb-28 sm:pt-40">
      <Container>
        {locale !== 'fr' ? <LegalNotice locale={locale} /> : null}
        {children}
      </Container>
    </div>
  );
}

async function LegalNotice({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'legal' });
  return (
    <p className="eyebrow mb-10 border border-ink-line px-4 py-3 text-paper-dim">
      {t('frenchOnlyNotice')}
    </p>
  );
}
