'use client';

import { useState } from 'react';

/**
 * Vignette cliquable plutôt qu'un `<iframe>` par vidéo : douze lecteurs
 * YouTube chargés d'un coup alourdiraient la page pour rien. L'iframe (et
 * son JavaScript) n'est créé qu'au clic, sur le domaine allégé
 * youtube-nocookie.com.
 */
export function YouTubeFacade({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="relative aspect-video overflow-hidden bg-ink-soft">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerated-video-decode; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block aspect-video w-full overflow-hidden bg-ink-soft"
      aria-label={`Lire « ${title} »`}
    >
      <img
        src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-black/15 transition-colors duration-300 group-hover:bg-black/30" />

      <span
        aria-hidden
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="grid h-14 w-14 place-items-center rounded-full bg-paper/90 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 sm:h-16 sm:w-16">
          <svg viewBox="0 0 24 24" className="ml-1 h-5 w-5 fill-ink sm:h-6 sm:w-6">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
