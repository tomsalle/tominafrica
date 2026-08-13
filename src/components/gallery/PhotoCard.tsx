import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/lib/format';
import { photoSrc, SIZES } from '@/lib/images';
import type { PhotoWithMinPrice } from '@/types/database';

export function PhotoCard({
  photo,
  priority = false,
}: {
  photo: PhotoWithMinPrice;
  priority?: boolean;
}) {
  const t = useTranslations('series');
  // Le vrai ratio de la photo plutôt qu'un cadre fixe : une grille qui force
  // tout au 4:3 recadre les portraits et aplatit les paysages. À défaut de
  // dimensions connues, 4:3 reste un repli raisonnable.
  const ratio =
    photo.image_width && photo.image_height ? photo.image_width / photo.image_height : 4 / 3;

  return (
    <Link
      href={`/photo/${photo.slug}`}
      className="group block transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98]"
    >
      <div
        className="relative w-full overflow-hidden bg-ink-soft"
        style={{ aspectRatio: ratio }}
      >
        <Image
          src={photoSrc(photo.image_path, photo.image_width)}
          alt={photo.title}
          fill
          priority={priority}
          sizes={SIZES.grid}
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          {...(photo.blur_data_url
            ? { placeholder: 'blur' as const, blurDataURL: photo.blur_data_url }
            : {})}
        />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/15" />
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl leading-tight font-light">{photo.title}</h3>
          {photo.location_name ? (
            <p className="mt-1 text-xs tracking-wide text-paper-faint">{photo.location_name}</p>
          ) : null}
        </div>
        {photo.minPriceCents !== null ? (
          <p className="shrink-0 text-xs tracking-wide text-paper-faint">
            {t('priceFrom', { price: formatPrice(photo.minPriceCents) })}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
