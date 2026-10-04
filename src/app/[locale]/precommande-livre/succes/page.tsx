import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { BOOK_PREORDER_PAGE_DISABLED } from '@/lib/book-preorder/flags';

const PAGE_DISABLED = BOOK_PREORDER_PAGE_DISABLED;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'bookPreorderSucces' });
  return { title: t('metaTitle'), robots: { index: false, follow: false } };
}

export default async function BookPreorderSuccessPage() {
  if (PAGE_DISABLED) notFound();

  const t = await getTranslations('bookPreorderSucces');

  return (
    <div className="flex min-h-dvh items-center pt-32 pb-28">
      <Container width="prose">
        <p className="eyebrow">{t('eyebrow')}</p>

        <h1 className="mt-6 font-display text-5xl leading-[1.05] font-light sm:text-6xl">
          {t('title')}
        </h1>

        <p className="mt-8 text-base leading-relaxed text-paper-dim">{t('body')}</p>

        <p className="mt-5 text-sm leading-relaxed text-paper-faint">{t('note')}</p>

        <ButtonLink href="/precommande-livre" variant="outline" className="mt-12">
          {t('cta')}
        </ButtonLink>
      </Container>
    </div>
  );
}
