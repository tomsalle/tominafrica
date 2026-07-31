import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AfricaMap } from '@/components/photo/AfricaMap';
import { PhotoCard } from '@/components/gallery/PhotoCard';
import { PhotoMap } from '@/components/photo/PhotoMap';
import { PhotoStory } from '@/components/photo/PhotoStory';
import { PhotoViewer } from '@/components/photo/PhotoViewer';
import { PurchasePanel } from '@/components/photo/PurchasePanel';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { formatMonthYear } from '@/lib/format';
import { FramePreferenceProvider } from '@/lib/frame-preference';
import { photoAbsoluteSrc } from '@/lib/images';
import { getAllPhotoSlugs, getPhotoBySlug, getRelatedPhotos } from '@/lib/queries/photos';

export const revalidate = 3600;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllPhotoSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const photo = await getPhotoBySlug(slug);

  if (!photo) return { title: 'Photographie introuvable' };

  const description =
    photo.caption ?? photo.story?.split(/\n\s*\n/)[0]?.slice(0, 200) ?? undefined;

  return {
    title: photo.title,
    description,
    openGraph: {
      type: 'article',
      title: photo.title,
      description,
      images: [{ url: photoAbsoluteSrc(photo.image_path), alt: photo.title }],
    },
  };
}

export default async function PhotoPage({ params }: PageProps) {
  const { slug } = await params;
  const photo = await getPhotoBySlug(slug);

  if (!photo) notFound();

  const related = await getRelatedPhotos(photo.series_id, photo.id, 3);
  const takenAt = formatMonthYear(photo.taken_at);

  return (
    <article className="pt-24 pb-28 sm:pt-28">
      <Container width="wide">
        {/* Titre, photo encadrée et contenu : voir `.photo-layout` (globals.css).
            Sur desktop, la photo reste visible dans son cadre pendant que le
            récit, la carte et l'achat défilent à côté. */}
        <FramePreferenceProvider>
          <div className="photo-layout gap-x-16 gap-y-14 sm:gap-y-16">
            <div style={{ gridArea: 'title' }}>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                {photo.series ? (
                  <Link href={`/series/${photo.series.slug}`} className="eyebrow link-underline">
                    {photo.series.title}
                  </Link>
                ) : null}
                {takenAt ? <span className="eyebrow text-paper-faint">{takenAt}</span> : null}
              </div>

              <h1 className="mt-5 font-display text-5xl leading-[0.95] font-light sm:text-7xl lg:text-6xl">
                {photo.title}
              </h1>
            </div>

            <div style={{ gridArea: 'photo' }} className="lg:sticky lg:top-28 lg:self-start">
              <PhotoViewer photo={photo} />
            </div>

            <div style={{ gridArea: 'content' }} className="space-y-16">
              <Reveal>
                <PhotoStory story={photo.story} title={photo.title} />
              </Reveal>

              {photo.series?.country_code ? (
                <Reveal>
                  <section aria-labelledby="pays-titre">
                    <h2 id="pays-titre" className="eyebrow">
                      Le pays
                    </h2>
                    <div className="mt-7 max-w-xs">
                      <AfricaMap countryCode={photo.series.country_code} />
                    </div>
                  </section>
                </Reveal>
              ) : null}

              {photo.latitude !== null && photo.longitude !== null ? (
                <Reveal>
                  <section aria-labelledby="lieu-titre">
                    <h2 id="lieu-titre" className="eyebrow">
                      Le lieu
                    </h2>
                    <div className="mt-7">
                      <PhotoMap
                        latitude={photo.latitude}
                        longitude={photo.longitude}
                        zoom={photo.map_zoom}
                        locationName={photo.location_name}
                      />
                    </div>
                  </section>
                </Reveal>
              ) : null}

              <PurchasePanel photo={photo} />
            </div>
          </div>
        </FramePreferenceProvider>
      </Container>

      {/* ---- À voir aussi --------------------------------------------------- */}
      {related.length > 0 && photo.series ? (
        <div className="mt-32 border-t border-ink-line pt-16">
          <Container width="wide">
            <Reveal>
              <h2 className="eyebrow">Dans la même série</h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal key={item.id} delay={index * 90}>
                  <PhotoCard photo={item} />
                </Reveal>
              ))}
            </div>
          </Container>
        </div>
      ) : null}
    </article>
  );
}
