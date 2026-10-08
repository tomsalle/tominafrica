'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';

const SECTIONS = ['le-livre', 'faq'] as const;
type Section = (typeof SECTIONS)[number];

/**
 * Barre collante : deux repères (Le livre, FAQ) et, toujours à portée, le
 * bouton qui mène au choix de la formule.
 */
export function StickyTabNav({ ctaHref, priceLabel }: { ctaHref: string | null; priceLabel: string | null }) {
  const t = useTranslations('bookPreorder.nav');
  const [active, setActive] = useState<Section>('le-livre');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setActive(top.target.id as Section);
      },
      { rootMargin: '-140px 0px -55% 0px' },
    );

    SECTIONS.forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  const labels: Record<Section, string> = { 'le-livre': t('book'), faq: t('faq') };

  return (
    <div className="sticky top-16 z-40 border-b border-ink-line bg-ink/95 backdrop-blur-md sm:top-20">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <nav className="flex gap-7">
          {SECTIONS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? 'true' : undefined}
              className={`relative shrink-0 py-4 text-sm transition-colors duration-200 ${
                active === id ? 'text-paper' : 'text-paper-dim hover:text-paper'
              }`}
            >
              {labels[id]}
              <span
                aria-hidden
                className={`absolute inset-x-0 bottom-0 h-0.5 bg-brand transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  active === id ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {priceLabel ? (
            <span className="hidden text-sm text-paper-dim tabular-nums sm:inline">{priceLabel}</span>
          ) : null}
          {ctaHref ? (
            <Link
              href={ctaHref}
              className="inline-flex shrink-0 items-center justify-center bg-brand px-5 py-2.5 text-[0.6875rem] font-medium tracking-[0.2em] text-paper uppercase transition-[background-color,transform] duration-200 hover:bg-brand-hover active:scale-[0.97] sm:px-8"
            >
              {t('cta')}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
