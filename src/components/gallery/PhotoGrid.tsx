import { PhotoCard } from '@/components/gallery/PhotoCard';
import type { PhotoRow } from '@/types/database';

export function PhotoGrid({ photos }: { photos: PhotoRow[] }) {
  if (photos.length === 0) {
    return <p className="text-sm text-paper-dim">Aucune photo publiée dans cette série.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo, index) => (
        <PhotoCard key={photo.id} photo={photo} priority={index < 3} />
      ))}
    </div>
  );
}
