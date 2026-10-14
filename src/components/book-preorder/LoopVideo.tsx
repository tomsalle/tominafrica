'use client';

import { useEffect, useRef } from 'react';

/**
 * Courte vidéo muette qui tourne en boucle, comme un GIF (mais bien plus
 * légère). Elle ne se charge qu'à l'approche de l'écran et ne joue que visible ;
 * si l'utilisateur a demandé à réduire les animations, on garde l'image fixe.
 */
export function LoopVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          if (video.preload === 'none') video.preload = 'auto';
          video.play().catch(() => {
            // Lecture automatique refusée (mode économie d'énergie…) : l'image reste affichée.
          });
        } else {
          video.pause();
        }
      },
      { rootMargin: '200px 0px' },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="h-full w-full object-cover"
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    />
  );
}
