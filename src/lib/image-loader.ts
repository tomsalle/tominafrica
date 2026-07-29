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
  // Images locales (placeholders SVG, visuels statiques) : servies telles quelles.
  if (!DERIVATIVE_PATTERN.test(src)) {
    return src;
  }

  const target = DERIVATIVE_WIDTHS.find((w) => w >= width) ?? DERIVATIVE_WIDTHS.at(-1)!;

  return src.replace(DERIVATIVE_PATTERN, (_match, _oldWidth, extension) => `/${target}.${extension}`);
}
