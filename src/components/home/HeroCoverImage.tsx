'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { photoSrc, SIZES } from '@/lib/images';
import type { PhotoRow } from '@/types/database';

type HeroCoverImageProps = {
  cover: PhotoRow;
  priority?: boolean;
};

/**
 * Les sept héros de l'accueil sont tous montés au chargement. Sans ce
 * composant, `animate-hero-zoom` démarrerait sur les sept en parallèle : les
 * séries en bas de page auraient déjà fini leur zoom avant d'être vues. Le
 * zoom ne démarre donc qu'à l'entrée dans le viewport.
 */
export function HeroCoverImage({ cover, priority = false }: HeroCoverImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setActive(true);
        observer.disconnect();
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      <Image
        src={photoSrc(cover.image_path, cover.image_width)}
        alt=""
        fill
        priority={priority}
        sizes={SIZES.full}
        className={`object-cover ${active ? 'animate-hero-zoom' : ''}`}
        {...(cover.blur_data_url
          ? { placeholder: 'blur' as const, blurDataURL: cover.blur_data_url }
          : {})}
      />
    </div>
  );
}
