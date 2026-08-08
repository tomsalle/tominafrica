import { useTranslations } from 'next-intl';
import { PhotoCard } from '@/components/gallery/PhotoCard';
import { Reveal } from '@/components/ui/Reveal';
import type { PhotoRow } from '@/types/database';

// Cycle sur 3 colonnes (desktop) : au-delà, les décalages se répètent au lieu
// de s'allonger indéfiniment ligne après ligne.
const STAGGER_STEP_MS = 90;
const STAGGER_COLUMNS = 3;

export function PhotoGrid({ photos }: { photos: PhotoRow[] }) {
  const t = useTranslations('series');

  if (photos.length === 0) {
    return <p className="text-sm text-paper-dim">{t('emptySeries')}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo, index) => (
        <Reveal key={photo.id} delay={(index % STAGGER_COLUMNS) * STAGGER_STEP_MS}>
          <PhotoCard photo={photo} priority={index < 3} />
        </Reveal>
      ))}
    </div>
  );
}
