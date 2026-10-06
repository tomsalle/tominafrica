import { useTranslations } from 'next-intl';
import { HeroCoverImage } from '@/components/home/HeroCoverImage';
import { Reveal } from '@/components/ui/Reveal';
import { Link } from '@/i18n/navigation';
import type { SeriesWithCover } from '@/types/database';

type SeriesHeroProps = {
  series: SeriesWithCover;
  /** La première section est chargée en priorité : c'est le LCP de la page. */
  priority?: boolean;
};

/**
 * Premier écran : une photographie, le titre, une phrase. Assez pour savoir
 * qui parle et d'où viennent les images — le reste se découvre en défilant.
 */
export function SeriesHero({ series, priority = false }: SeriesHeroProps) {
  const t = useTranslations('home');
  const cover = series.cover_photo;

  return (
    <section className="relative h-dvh min-h-[36rem] w-full overflow-hidden">
      {cover ? (
        <HeroCoverImage cover={cover} priority={priority} alt={t('heroAlt')} />
      ) : (
        <div className="absolute inset-0 bg-ink-soft" />
      )}

      {/* Dégradé de lisibilité, limité au bas de l'image où se trouve le texte. */}
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-black/25 sm:from-black/75 sm:via-black/5" />

      <div className="relative flex h-full items-end">
        <div className="mx-auto w-full max-w-[110rem] px-5 pb-10 sm:px-8 sm:pb-20">
          <Reveal>
            <p className="eyebrow tabular-nums">{t('heroEyebrow')}</p>

            <h2 className="mt-4 font-display text-[2.5rem] leading-[0.95] font-light tracking-tight sm:mt-5 sm:text-7xl">
              {series.title}
            </h2>

            <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-paper-dim sm:mt-5 sm:text-lg">{t('heroLine')}</p>

            <Link href={`/series/${series.slug}`} className="eyebrow link-underline mt-7 inline-block text-paper sm:mt-9">
              {t('viewSeries')}
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
