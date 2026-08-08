import { getPathname } from './navigation';
import { routing } from './routing';

/** hreflang pour une route statique disponible dans toutes les langues. */
export function languageAlternates(href: string): Record<string, string> {
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, getPathname({ locale, href })]),
  );
}
