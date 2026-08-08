import { useTranslations } from 'next-intl';
import { AFRICA_VIEW_BOX } from '@/lib/africa-countries';
import { AFRICA_COUNTRY_PATHS } from '@/lib/africa-map-data';

/**
 * Silhouette de l'Afrique, un pays surligné.
 *
 * Données : voir l'en-tête de africa-map-data.ts pour la source et la
 * licence. Recadrée sur l'Afrique plutôt que d'afficher le monde entier.
 */
export function AfricaMap({ countryCode }: { countryCode: string }) {
  const t = useTranslations('africaMap');
  const target = countryCode.toLowerCase();

  return (
    <svg viewBox={AFRICA_VIEW_BOX} className="w-full" role="img" aria-label={t('ariaLabel')}>
      {AFRICA_COUNTRY_PATHS.map((country) => (
        <path
          key={country.id}
          d={country.path}
          style={{ fill: country.id === target ? 'var(--color-accent)' : 'var(--color-ink-line)' }}
          stroke="var(--color-ink)"
          strokeWidth={0.75}
        />
      ))}
    </svg>
  );
}
