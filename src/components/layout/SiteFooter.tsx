import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function SiteFooter() {
  const t = useTranslations('footer');

  const LEGAL = [
    { href: '/mentions-legales', label: t('mentionsLegales') },
    { href: '/cgv', label: t('cgv') },
    { href: '/confidentialite', label: t('confidentialite') },
  ];

  return (
    <footer className="border-t border-ink-line">
      <div className="mx-auto w-full max-w-[110rem] px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-xl font-light tracking-[0.16em] uppercase">
              Tom in Africa
            </p>
            <p className="mt-4 text-sm leading-relaxed text-paper-dim">{t('tagline')}</p>
          </div>

          <nav className="flex flex-col gap-3" aria-label={t('legalNav')}>
            {LEGAL.map((item) => (
              <Link key={item.href} href={item.href} className="eyebrow link-underline self-start">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-14 text-xs text-paper-faint">
          {t('copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
