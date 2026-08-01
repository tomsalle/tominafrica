import Image from 'next/image';
import Link from 'next/link';
import { photoSrc, SIZES } from '@/lib/images';
import type { PhotoRow } from '@/types/database';

export function PhotoCard({ photo, priority = false }: { photo: PhotoRow; priority?: boolean }) {
  return (
    <Link
      href={`/photo/${photo.slug}`}
      className="group block transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98]"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-ink-soft">
        <Image
          src={photoSrc(photo.image_path, photo.image_width)}
          alt={photo.title}
          fill
          priority={priority}
          sizes={SIZES.grid}
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          {...(photo.blur_data_url
            ? { placeholder: 'blur' as const, blurDataURL: photo.blur_data_url }
            : {})}
        />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/15" />
      </div>

      <div className="mt-4">
        <h3 className="font-display text-2xl leading-tight font-light">{photo.title}</h3>
        {photo.location_name ? (
          <p className="mt-1 text-xs tracking-wide text-paper-faint">{photo.location_name}</p>
        ) : null}
      </div>
    </Link>
  );
}
