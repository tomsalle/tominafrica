import { getPathname } from './navigation';
import { routing, type Locale } from './routing';

/** hreflang pour une route disponible dans toutes les langues (x-default : le français). */
export function languageAlternates(href: string): Record<string, string> {
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((locale) => [locale, getPathname({ locale, href })]),
  );
  languages['x-default'] = getPathname({ locale: routing.defaultLocale, href });
  return languages;
}

/**
 * Adresse canonique de la page dans la langue affichée + ses équivalents dans
 * les autres langues. À poser page par page : une valeur posée dans le layout
 * serait héritée par toutes les pages et les déclarerait doublons de l'accueil.
 */
export function pageAlternates(href: string, locale: string) {
  const current = (routing.locales as readonly string[]).includes(locale) ? (locale as Locale) : routing.defaultLocale;
  return { canonical: getPathname({ locale: current, href }), languages: languageAlternates(href) };
}
