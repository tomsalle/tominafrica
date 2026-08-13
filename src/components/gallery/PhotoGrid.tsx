import { useTranslations } from 'next-intl';
import { PhotoCard } from '@/components/gallery/PhotoCard';
import { Reveal } from '@/components/ui/Reveal';
import type { PhotoWithMinPrice } from '@/types/database';

// Cycle sur 3 colonnes (desktop) : au-delà, les décalages se répètent au lieu
// de s'allonger indéfiniment ligne après ligne.
const STAGGER_STEP_MS = 90;
const STAGGER_COLUMNS = 3;

/**
 * Colonnes CSS plutôt qu'une grille : chaque photo garde son vrai ratio
 * (portrait, carré, paysage…), et l'effet mur d'images qui en résulte range
 * chacune dans la colonne la plus courte au lieu de forcer des lignes de
 * hauteur égale — c'est ce qui rend une photothèque aux formats mélangés
 * lisible plutôt que découpée à la serpe.
 */
export function PhotoGrid({ photos }: { photos: PhotoWithMinPrice[] }) {
  const t = useTranslations('series');

  if (photos.length === 0) {
    return <p className="text-sm text-paper-dim">{t('emptySeries')}</p>;
  }

  return (
    <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
      {photos.map((photo, index) => (
        <Reveal
          key={photo.id}
          delay={(index % STAGGER_COLUMNS) * STAGGER_STEP_MS}
          className="mb-14 break-inside-avoid"
        >
          <PhotoCard photo={photo} priority={index < 3} />
        </Reveal>
      ))}
    </div>
  );
}
