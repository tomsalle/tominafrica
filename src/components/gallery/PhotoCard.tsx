import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FieldNote } from '@/components/journey/FieldNote';
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
    <Link href={`/photo/${photo.slug}`} className="group block">
      {/* Pas de zoom ni de voile au survol : la photo reste entière, cadrée
          comme l'auteur l'a voulue. Le retour visuel passe par le titre. */}
      <div className="relative w-full overflow-hidden bg-ink-soft" style={{ aspectRatio: ratio }}>
        <Image
          src={photoSrc(photo.image_path, photo.image_width)}
          alt={photo.title}
          fill
          priority={priority}
          sizes={SIZES.grid}
          className="object-cover"
          {...(photo.blur_data_url
            ? { placeholder: 'blur' as const, blurDataURL: photo.blur_data_url }
            : {})}
        />
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display text-2xl leading-tight font-light">
            <span className="link-underline">{photo.title}</span>
          </h3>
          <FieldNote
            takenAt={photo.taken_at}
            countryCode={photo.country_code}
            place={photo.location_name}
            compact
            className="mt-1.5"
          />
        </div>
        {photo.minPriceCents !== null ? (
          <p className="mt-2 shrink-0 text-xs tracking-wide text-paper-faint tabular-nums">
            {t('priceFrom', { price: formatPrice(photo.minPriceCents) })}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
