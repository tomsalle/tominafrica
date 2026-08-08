import { useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <div className="flex min-h-dvh items-center">
      <Container width="prose">
        <p className="eyebrow">{t('eyebrow')}</p>
        <h1 className="mt-6 font-display text-5xl leading-[1.05] font-light sm:text-6xl">
          {t('title')}
        </h1>
        <p className="mt-6 text-base text-paper-dim">{t('body')}</p>
        <ButtonLink href="/" variant="outline" className="mt-12">
          {t('cta')}
        </ButtonLink>
      </Container>
    </div>
  );
}
