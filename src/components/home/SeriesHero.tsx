import Image from 'next/image';
import Link from 'next/link';
import { photoSrc, SIZES } from '@/lib/images';
import type { SeriesWithCover } from '@/types/database';

type SeriesHeroProps = {
  series: SeriesWithCover;
  /** La première section est chargée en priorité : c'est le LCP de la page. */
  priority?: boolean;
  index: number;
};

export function SeriesHero({ series, priority = false, index }: SeriesHeroProps) {
  const cover = series.cover_photo;

  return (
    <section className="relative h-dvh min-h-[36rem] w-full overflow-hidden">
      {cover ? (
        <Image
          src={photoSrc(cover.image_path)}
          alt=""
          fill
          priority={priority}
          sizes={SIZES.full}
          className="object-cover"
          {...(cover.blur_data_url
            ? { placeholder: 'blur' as const, blurDataURL: cover.blur_data_url }
            : {})}
        />
      ) : (
        <div className="absolute inset-0 bg-ink-soft" />
      )}

      {/* Dégradé de lisibilité : le texte doit tenir sur n'importe quelle image. */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/15 to-black/30" />

      <div className="relative flex h-full items-end">
        <div className="mx-auto w-full max-w-[110rem] px-5 pb-20 sm:px-8 sm:pb-24">
          <p className="eyebrow">
            <span className="tabular-nums">{String(index + 1).padStart(2, '0')}</span>
            {series.location_label ? <span className="ml-4">{series.location_label}</span> : null}
          </p>

          <h2 className="mt-5 font-display text-5xl leading-[0.95] font-light tracking-tight sm:text-7xl lg:text-8xl">
            {series.title}
          </h2>

          {series.subtitle ? (
            <p className="mt-4 max-w-xl text-base text-paper-dim sm:text-lg">{series.subtitle}</p>
          ) : null}

          <Link
            href={`/series/${series.slug}`}
            className="eyebrow link-underline mt-9 inline-block text-paper"
          >
            Voir la série
          </Link>
        </div>
      </div>
    </section>
  );
}
