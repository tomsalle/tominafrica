import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PhotoGrid } from '@/components/gallery/PhotoGrid';
import { Container } from '@/components/ui/Container';
import { photoAbsoluteSrc } from '@/lib/images';
import { getAllSeriesSlugs, getSeriesBySlug } from '@/lib/queries/series';

export const revalidate = 3600;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllSeriesSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getSeriesBySlug(slug);

  if (!result) return { title: 'Série introuvable' };

  const { series, photos } = result;
  const cover = photos[0];

  return {
    title: series.title,
    description: series.description ?? series.subtitle ?? undefined,
    openGraph: {
      title: series.title,
      description: series.description ?? undefined,
      images: cover ? [{ url: photoAbsoluteSrc(cover.image_path, cover.image_width) }] : undefined,
    },
  };
}

export default async function SeriesPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getSeriesBySlug(slug);

  if (!result) notFound();

  const { series, photos } = result;

  return (
    <div className="pt-32 pb-28 sm:pt-40">
      <Container width="wide">
        <header className="max-w-3xl">
          {series.location_label ? <p className="eyebrow">{series.location_label}</p> : null}

          <h1 className="mt-5 font-display text-5xl leading-[0.95] font-light sm:text-7xl">
            {series.title}
          </h1>

          {series.description ? (
            <p className="mt-8 text-base leading-relaxed text-paper-dim sm:text-lg">
              {series.description}
            </p>
          ) : null}

          <p className="mt-8 text-xs tracking-wide text-paper-faint">
            {photos.length} photographie{photos.length > 1 ? 's' : ''}
          </p>
        </header>

        <div className="mt-20">
          <PhotoGrid photos={photos} />
        </div>
      </Container>
    </div>
  );
}
