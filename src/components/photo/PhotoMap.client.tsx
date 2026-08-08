'use client';

import L from 'leaflet';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { formatCoordinate } from '@/lib/format';
import 'leaflet/dist/leaflet.css';

/**
 * Carte du lieu de prise de vue.
 *
 * Leaflet plutôt que Mapbox : aucun compte, aucun token, aucune facture
 * possible, et 42 ko contre ~800. Les fonds CARTO Dark Matter sont sobres et ne
 * détournent pas l'attention de la photo.
 *
 * Le composant est isolé volontairement : basculer un jour sur Mapbox ou
 * MapLibre (pour de l'imagerie satellite) ne demanderait de réécrire que ce
 * fichier, l'interface publique de <PhotoMap> restant identique.
 */

type PhotoMapProps = {
  latitude: number;
  longitude: number;
  zoom: number;
  locationName: string | null;
};

const CARTO_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const markerIcon = L.divIcon({
  className: '',
  html: '<div class="photo-marker"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

/**
 * Active les interactions seulement après un clic explicite.
 *
 * Sans cela, une carte plein écran sur mobile capture le défilement de la page :
 * l'utilisateur qui fait défiler l'article se retrouve à zoomer sur la carte.
 */
function InteractionGate({ active }: { active: boolean }) {
  const map = useMap();

  const handlers = [
    map.dragging,
    map.scrollWheelZoom,
    map.doubleClickZoom,
    map.touchZoom,
    map.boxZoom,
    map.keyboard,
  ];

  for (const handler of handlers) {
    if (active) handler.enable();
    else handler.disable();
  }

  return null;
}

export default function PhotoMapClient({
  latitude,
  longitude,
  zoom,
  locationName,
}: PhotoMapProps) {
  const locale = useLocale();
  const t = useTranslations('photoMap');
  const [interactive, setInteractive] = useState(false);

  return (
    <figure className="relative">
      <div className="relative aspect-4/3 w-full overflow-hidden border border-ink-line sm:aspect-16/10">
        <MapContainer
          center={[latitude, longitude]}
          zoom={zoom}
          zoomControl={interactive}
          attributionControl
          className="h-full w-full"
          // Les interactions sont pilotées par <InteractionGate>.
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          touchZoom={false}
          boxZoom={false}
          keyboard={false}
        >
          <TileLayer url={CARTO_TILES} attribution={CARTO_ATTRIBUTION} maxZoom={19} />
          <Marker position={[latitude, longitude]} icon={markerIcon} />
          <InteractionGate active={interactive} />
        </MapContainer>

        {!interactive && (
          <button
            type="button"
            onClick={() => setInteractive(true)}
            className="absolute inset-0 z-500 flex items-end justify-center bg-transparent pb-8 transition-colors hover:bg-black/10"
          >
            <span className="eyebrow bg-ink/85 px-4 py-2 text-paper backdrop-blur-sm">
              {t('clickToExplore')}
            </span>
          </button>
        )}
      </div>

      <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        {locationName ? <span className="text-sm text-paper-dim">{locationName}</span> : <span />}
        <span className="font-mono text-xs text-paper-faint tabular-nums">
          {formatCoordinate(latitude, 'lat', locale)} · {formatCoordinate(longitude, 'lng', locale)}
        </span>
      </figcaption>
    </figure>
  );
}
