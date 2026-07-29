import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PhotoCard } from '@/components/gallery/PhotoCard';
import { PhotoMap } from '@/components/photo/PhotoMap';
import { PhotoStory } from '@/components/photo/PhotoStory';
import { PhotoViewer } from '@/components/photo/PhotoViewer';
import { PurchasePanel } from '@/components/photo/PurchasePanel';
import { Container } from '@/components/ui/Container';
import { formatMonthYear } from '@/lib/format';
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
      {/* ---- Fil d'Ariane + titre ------------------------------------------ */}
      <Container width="wide">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          {photo.series ? (
            <Link href={`/series/${photo.series.slug}`} className="eyebrow link-underline">
              {photo.series.title}
            </Link>
          ) : null}
          {takenAt ? <span className="eyebrow text-paper-faint">{takenAt}</span> : null}
        </div>

        <h1 className="mt-5 font-display text-5xl leading-[0.95] font-light sm:text-7xl">
          {photo.title}
        </h1>
      </Container>

      {/* ---- Bloc 1 : la photo --------------------------------------------- */}
      <div className="mt-12 sm:mt-16">
        <Container width="wide">
          <PhotoViewer photo={photo} />
        </Container>
      </div>

      {/* ---- Blocs 2 à 4 ---------------------------------------------------
           En mobile : récit, carte, achat empilés dans cet ordre.
           À partir de lg : le bloc achat devient une colonne collante à droite,
           pour rester visible pendant la lecture du récit.
      -------------------------------------------------------------------- */}
      <div className="mt-20 sm:mt-28">
        <Container width="wide">
          <div className="grid grid-cols-1 gap-x-20 gap-y-20 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="space-y-20">
              <PhotoStory story={photo.story} title={photo.title} />

              {photo.latitude !== null && photo.longitude !== null ? (
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
              ) : null}
            </div>

            <div className="lg:sticky lg:top-28 lg:self-start">
              <PurchasePanel photo={photo} />
            </div>
          </div>
        </Container>
      </div>

      {/* ---- À voir aussi --------------------------------------------------- */}
      {related.length > 0 && photo.series ? (
        <div className="mt-32 border-t border-ink-line pt-16">
          <Container width="wide">
            <h2 className="eyebrow">Dans la même série</h2>
            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <PhotoCard key={item.id} photo={item} />
              ))}
            </div>
          </Container>
        </div>
      ) : null}
    </article>
  );
}
