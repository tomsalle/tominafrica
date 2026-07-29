'use client';

import dynamic from 'next/dynamic';

/**
 * Enveloppe de chargement de la carte.
 *
 * Leaflet touche directement `window` au moment de l'import : il ne peut pas
 * être rendu côté serveur. D'où le `ssr: false`, qui impose que ce fichier soit
 * un composant client.
 */
const PhotoMapClient = dynamic(() => import('@/components/photo/PhotoMap.client'), {
  ssr: false,
  loading: () => (
    <div className="aspect-4/3 w-full animate-pulse border border-ink-line bg-ink-soft sm:aspect-16/10" />
  ),
});

type PhotoMapProps = {
  latitude: number | null;
  longitude: number | null;
  zoom: number;
  locationName: string | null;
};

export function PhotoMap({ latitude, longitude, zoom, locationName }: PhotoMapProps) {
  // Une photo sans coordonnées n'affiche simplement pas de bloc carte.
  if (latitude === null || longitude === null) return null;

  return (
    <PhotoMapClient
      latitude={latitude}
      longitude={longitude}
      zoom={zoom}
      locationName={locationName}
    />
  );
}
