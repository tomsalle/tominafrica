'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { photoSrc, SIZES } from '@/lib/images';
import type { PhotoRow } from '@/types/database';

/**
 * Bloc image de la page produit, avec agrandissement plein écran.
 *
 * On ne sert jamais le fichier master : le dérivé 2400 px suffit largement à
 * l'écran et reste inexploitable pour un tirage grand format. C'est une
 * protection nettement plus efficace qu'un clic droit désactivé, qui n'arrête
 * personne et gêne les visiteurs légitimes.
 */
export function PhotoViewer({ photo }: { photo: PhotoRow }) {
  const [zoomed, setZoomed] = useState(false);

  const ratio =
    photo.image_width && photo.image_height ? photo.image_width / photo.image_height : 3 / 2;

  useEffect(() => {
    if (!zoomed) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setZoomed(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [zoomed]);

  return (
    <>
      <figure>
        <button
          type="button"
          onClick={() => setZoomed(true)}
          className="group relative block w-full cursor-zoom-in overflow-hidden bg-ink-soft"
          style={{ aspectRatio: ratio }}
          aria-label={`Agrandir « ${photo.title} »`}
        >
          <Image
            src={photoSrc(photo.image_path)}
            alt={photo.title}
            fill
            priority
            sizes={SIZES.full}
            className="object-cover"
            {...(photo.blur_data_url
              ? { placeholder: 'blur' as const, blurDataURL: photo.blur_data_url }
              : {})}
          />
        </button>

        {photo.caption ? (
          <figcaption className="mt-4 text-sm text-paper-faint">{photo.caption}</figcaption>
        ) : null}
      </figure>

      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={photo.title}
          onClick={() => setZoomed(false)}
          className="fixed inset-0 z-90 flex cursor-zoom-out items-center justify-center bg-black/95 p-4 sm:p-10"
        >
          <div className="relative h-full w-full">
            <Image
              src={photoSrc(photo.image_path)}
              alt={photo.title}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <button
            type="button"
            onClick={() => setZoomed(false)}
            className="eyebrow absolute top-5 right-5 text-paper hover:text-white"
          >
            Fermer
          </button>
        </div>
      )}
    </>
  );
}
