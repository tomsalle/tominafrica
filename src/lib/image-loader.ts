/**
 * Loader d'images personnalisé pour next/image.
 *
 * Les dérivés sont pré-générés à l'import (scripts/import-photos.ts) aux
 * largeurs listées ci-dessous, puis servis tels quels par le CDN Supabase.
 * Ce loader se contente donc de choisir le bon fichier — aucune transformation
 * à la volée, donc aucun crédit d'optimisation Vercel consommé, tout en
 * conservant srcset, lazy loading et placeholder flou de next/image.
 *
 * Doit rester un export par défaut synchrone : Next.js l'inline dans le bundle.
 */

export const DERIVATIVE_WIDTHS = [480, 960, 1600, 2400] as const;

const DERIVATIVE_PATTERN = /\/(\d+)\.(avif|webp|jpe?g|png)$/;

export default function photoLoader({ src, width }: { src: string; width: number }): string {
  const match = src.match(DERIVATIVE_PATTERN);

  // Images locales (placeholders SVG, visuels statiques) : servies telles quelles.
  if (!match) return src;

  // Le nombre déjà présent dans `src` est le plus grand dérivé réellement
  // généré pour cette photo (voir photoSrc, src/lib/images.ts) — une source
  // plus petite que 2400 px n'a pas de dérivé 2400. On ne le dépasse jamais,
  // même si Next demande une largeur plus grande pour un écran haute densité :
  // sans ce plafond, l'URL pointe vers un fichier qui n'a jamais été généré.
  const [, embeddedWidth, extension] = match;
  const maxAvailable = Number(embeddedWidth);
  const target = DERIVATIVE_WIDTHS.find((w) => w >= width && w <= maxAvailable) ?? maxAvailable;

  return src.replace(DERIVATIVE_PATTERN, `/${target}.${extension}`);
}
