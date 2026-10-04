import { useTranslations } from 'next-intl';

/**
 * Barre d'ancres collante sous l'en-tête du site — même principe que la barre
 * Collecte / Contreparties / FAQ d'Ulule, en liens d'ancrage natifs (pas de
 * JS requis pour le défilement, le navigateur gère #id).
 */
export function StickyTabNav() {
  const t = useTranslations('bookPreorder.nav');

  return (
    <div className="sticky top-16 z-40 border-b border-ink-line bg-ink/95 backdrop-blur-md sm:top-20">
      <div className="mx-auto flex w-full max-w-[110rem] items-center justify-between px-5 sm:px-8">
        <nav className="flex gap-6 overflow-x-auto py-4 text-xs tracking-wide text-paper-dim uppercase">
          <a href="#le-livre" className="shrink-0 transition-colors duration-300 hover:text-paper">
            {t('book')}
          </a>
          <a href="#contreparties" className="shrink-0 transition-colors duration-300 hover:text-paper">
            {t('tiers')}
          </a>
          <a href="#faq" className="shrink-0 transition-colors duration-300 hover:text-paper">
            {t('faq')}
          </a>
        </nav>

        <a
          href="#contreparties"
          className="hidden shrink-0 items-center justify-center gap-2 bg-paper px-6 py-3 text-[0.6875rem] font-medium tracking-[0.24em] text-ink uppercase transition-[background-color,transform] duration-300 hover:bg-white active:scale-[0.97] sm:inline-flex"
        >
          {t('tiers')}
        </a>
      </div>
    </div>
  );
}
