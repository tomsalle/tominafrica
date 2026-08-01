import { publicEnv } from '@/lib/env';
import { DERIVATIVE_WIDTHS } from '@/lib/image-loader';

/**
 * Construction des URLs d'images.
 *
 * `photos.image_path` contient un préfixe, pas un fichier :
 *
 *   « deadvlei-aube »  →  bucket public `photos`, dérivés
 *                         photos/deadvlei-aube/{480,960,1600,2400}.avif
 *
 *   « placeholder/x »  →  fichier local /placeholders/x.svg, utilisé tant que
 *                         les vraies photos ne sont pas importées. C'est la
 *                         seule différence de traitement, et elle disparaît
 *                         d'elle-même dès le premier import.
 */

const PLACEHOLDER_PREFIX = 'placeholder/';
const LARGEST = DERIVATIVE_WIDTHS.at(-1)!;

export function isPlaceholder(imagePath: string): boolean {
  return imagePath.startsWith(PLACEHOLDER_PREFIX);
}

/**
 * Le plus grand dérivé réellement généré à l'import (scripts/import-photos.ts
 * n'agrandit jamais une image : une photo source de 1600 px n'a pas de
 * dérivé 2400). `photos.image_width` porte cette largeur ; sans elle, on
 * suppose que tout existe (comportement historique).
 */
function largestAvailableWidth(sourceWidth?: number | null): number {
  if (!sourceWidth) return LARGEST;
  return [...DERIVATIVE_WIDTHS].reverse().find((w) => w <= sourceWidth) ?? DERIVATIVE_WIDTHS[0];
}

/**
 * URL à passer à `<Image src>`. Le loader (src/lib/image-loader.ts) substitue
 * ensuite la largeur adaptée à chaque entrée du srcset, sans jamais dépasser
 * celle embarquée ici.
 */
export function photoSrc(imagePath: string, sourceWidth?: number | null): string {
  if (isPlaceholder(imagePath)) {
    return `/placeholders/${imagePath.slice(PLACEHOLDER_PREFIX.length)}.svg`;
  }

  const largest = largestAvailableWidth(sourceWidth);
  return `${publicEnv.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${imagePath}/${largest}.avif`;
}

/** URL absolue, pour les métadonnées Open Graph. */
export function photoAbsoluteSrc(imagePath: string, sourceWidth?: number | null): string {
  const src = photoSrc(imagePath, sourceWidth);
  return src.startsWith('http') ? src : `${publicEnv.NEXT_PUBLIC_SITE_URL}${src}`;
}

/**
 * Attribut `sizes` : indique au navigateur la largeur d'affichage réelle pour
 * qu'il choisisse le bon dérivé. Sans lui, il télécharge systématiquement le
 * plus grand.
 */
export const SIZES = {
  /** Image plein écran (accueil, page produit). */
  full: '100vw',
  /** Grille de galerie : 1 colonne en mobile, 2 en tablette, 3 au-delà. */
  grid: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  /** Vignette du panier. */
  thumbnail: '96px',
} as const;
