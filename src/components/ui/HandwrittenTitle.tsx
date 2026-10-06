import Image from 'next/image';

/**
 * « 1 Mère, 1 Fils, 1 Rêve » écrit à la main par Tom (le titre du livre),
 * en tracé blanc sur fond transparent. L'image est décorative pour les
 * lecteurs d'écran ; le texte réel reste dans le titre, en visuellement masqué,
 * pour l'accessibilité et le référencement.
 */
const HANDWRITING = { src: '/brand/titre-manuscrit.png', width: 1270, height: 336 } as const;

export const HANDWRITTEN_SERIES_SLUG = '1-mere-1-fils-1-reve';

export function HandwrittenTitle({
  text,
  className = '',
  priority = false,
  sizes = '(min-width: 640px) 40rem, 90vw',
}: {
  text: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <Image
        src={HANDWRITING.src}
        alt=""
        aria-hidden
        width={HANDWRITING.width}
        height={HANDWRITING.height}
        sizes={sizes}
        priority={priority}
        className={`block h-auto select-none ${className}`}
      />
    </>
  );
}
