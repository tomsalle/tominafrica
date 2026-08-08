import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ClearCartOnSuccess } from '@/components/cart/ClearCartOnSuccess';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'commandeSucces' });
  return { title: t('metaTitle'), robots: { index: false, follow: false } };
}

export default async function OrderSuccessPage() {
  const t = await getTranslations('commandeSucces');

  return (
    <div className="flex min-h-dvh items-center pt-32 pb-28">
      <Container width="prose">
        <ClearCartOnSuccess />

        <p className="eyebrow">{t('eyebrow')}</p>

        <h1 className="mt-6 font-display text-5xl leading-[1.05] font-light sm:text-6xl">
          {t('title')}
        </h1>

        <p className="mt-8 text-base leading-relaxed text-paper-dim">{t('body')}</p>

        <p className="mt-5 text-sm leading-relaxed text-paper-faint">{t('note')}</p>

        <ButtonLink href="/" variant="outline" className="mt-12">
          {t('cta')}
        </ButtonLink>
      </Container>
    </div>
  );
}
