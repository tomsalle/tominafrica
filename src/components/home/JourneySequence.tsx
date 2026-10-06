import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FieldNote } from '@/components/journey/FieldNote';
import { JourneyTimeline } from '@/components/journey/JourneyTimeline';
import { Reveal } from '@/components/ui/Reveal';
import { Link } from '@/i18n/navigation';
import { photoSrc } from '@/lib/images';
import type { JourneyPhoto } from '@/lib/queries/photos';

/**
 * Emplacements dans une grille de 12 colonnes, pour une séquence qui change
 * d'échelle et de position d'une image à l'autre — un chemin de fer de livre
 * plutôt qu'une grille régulière. Le motif se répète au-delà de 5 photos.
 */
const PLACEMENTS = [
  { col: 'lg:col-span-6 lg:col-start-1', size: '(min-width: 1024px) 48vw, 100vw' },
  { col: 'lg:col-span-4 lg:col-start-9 lg:mt-48', size: '(min-width: 1024px) 32vw, 100vw' },
  { col: 'lg:col-span-4 lg:col-start-3', size: '(min-width: 1024px) 32vw, 100vw' },
  { col: 'lg:col-span-5 lg:col-start-8 lg:mt-32', size: '(min-width: 1024px) 40vw, 100vw' },
  { col: 'lg:col-span-4 lg:col-start-5', size: '(min-width: 1024px) 32vw, 100vw' },
] as const;

const SEQUENCE_LENGTH = 5;

/** Échantillon régulier sur tout le voyage : du début, du milieu, de la fin. */
function sampleAcrossJourney(photos: JourneyPhoto[], count: number): JourneyPhoto[] {
  if (photos.length <= count) return photos;
  return Array.from({ length: count }, (_, i) => photos[Math.round((i * (photos.length - 1)) / (count - 1))]!);
}

export function JourneySequence({ photos, excludeId }: { photos: JourneyPhoto[]; excludeId?: string | null }) {
  const t = useTranslations('journey');
  const pool = photos.filter((photo) => photo.id !== excludeId);
  const sequence = sampleAcrossJourney(pool, SEQUENCE_LENGTH);

  if (sequence.length === 0) return null;

  return (
    <section aria-labelledby="sequence-titre" className="py-28 sm:py-40">
      <div className="mx-auto w-full max-w-[110rem] px-5 sm:px-8">
        <Reveal>
          <h2 id="sequence-titre" className="eyebrow">
            {t('sequenceLabel')}
          </h2>
          <div className="mt-8 max-w-3xl">
            <JourneyTimeline
              allDates={photos.map((photo) => photo.taken_at)}
              highlightedDates={sequence.map((photo) => photo.taken_at)}
            />
          </div>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-y-20 sm:mt-28 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-32">
          {sequence.map((photo, index) => {
            // Une seule photo : centrée, plutôt que calée à gauche d'un vide.
            const placement =
              sequence.length === 1
                ? { col: 'lg:col-span-6 lg:col-start-4', size: '(min-width: 1024px) 48vw, 100vw' }
                : PLACEMENTS[index % PLACEMENTS.length]!;
            const ratio =
              photo.image_width && photo.image_height ? photo.image_width / photo.image_height : 3 / 4;

            return (
              <Reveal key={photo.id} className={placement.col}>
                <Link href={`/photo/${photo.slug}`} className="group block">
                  <div className="relative overflow-hidden bg-ink-soft" style={{ aspectRatio: ratio }}>
                    <Image
                      src={photoSrc(photo.image_path, photo.image_width)}
                      alt={photo.title}
                      fill
                      sizes={placement.size}
                      className="object-cover"
                      {...(photo.blur_data_url
                        ? { placeholder: 'blur' as const, blurDataURL: photo.blur_data_url }
                        : {})}
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <p className="font-display text-xl font-light">
                      <span className="link-underline">{photo.title}</span>
                    </p>
                    <FieldNote takenAt={photo.taken_at} countryCode={photo.country_code} place={photo.location_name} />
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
