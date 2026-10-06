import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/Reveal';
import { Link } from '@/i18n/navigation';
import { EXHIBITION, EXHIBITION_PATH, isExhibitionUpcoming } from '@/lib/exhibition/event';

/**
 * L'exposition, juste après l'image d'ouverture de l'accueil : l'affiche,
 * les dates, le lieu et un seul bouton. Disparaît d'elle-même une fois
 * l'exposition passée.
 */
export function ExhibitionFeature() {
  const t = useTranslations('exhibitionFeature');
  if (!isExhibitionUpcoming()) return null;

  return (
    <section aria-labelledby="expo-titre" className="border-b border-ink-line">
      <div className="mx-auto grid w-full max-w-[110rem] grid-cols-1 items-center gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-24">
        <Reveal>
          <Link
            href={EXHIBITION_PATH}
            className="relative mx-auto block w-full max-w-[16rem] overflow-hidden bg-ink-soft sm:max-w-[20rem] lg:max-w-none"
            style={{ aspectRatio: EXHIBITION.poster.width / EXHIBITION.poster.height }}
            aria-label={t('posterAria')}
          >
            <Image
              src={EXHIBITION.poster.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 22rem, 20rem"
              className="object-contain"
            />
          </Link>
        </Reveal>

        <Reveal delay={90}>
          <p className="eyebrow flex items-center gap-2 text-paper">
            <span aria-hidden className="inline-block size-1.5 rounded-full bg-brand-text" />
            {t('eyebrow')}
          </p>
          <h2 id="expo-titre" className="mt-6 font-display text-4xl leading-[1.02] font-light sm:text-6xl">
            {t('title')}
          </h2>
          <p className="mt-6 font-display text-3xl font-light text-paper-dim tabular-nums sm:text-4xl">
            {t('dates')}
          </p>

          <dl className="mt-8 space-y-2 text-sm text-paper-dim">
            <div className="flex gap-4">
              <dt className="w-24 shrink-0 text-paper-faint">{t('openingLabel')}</dt>
              <dd>{t('opening')}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-24 shrink-0 text-paper-faint">{t('venueLabel')}</dt>
              <dd>
                {EXHIBITION.venue} · {EXHIBITION.street}, {EXHIBITION.postalCode} {EXHIBITION.city}
              </dd>
            </div>
          </dl>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-paper-dim">{t('programme')}</p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <Link
              href={EXHIBITION_PATH}
              className="inline-flex items-center justify-center bg-paper px-8 py-3.5 text-[0.6875rem] font-medium tracking-[0.24em] text-ink uppercase transition-[background-color,transform] duration-200 hover:bg-white active:scale-[0.98]"
            >
              {t('cta')}
            </Link>
            <a
              href={EXHIBITION.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow link-underline text-paper"
            >
              {t('map')}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
