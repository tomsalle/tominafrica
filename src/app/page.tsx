import { SeriesHero } from '@/components/home/SeriesHero';
import { getSeriesList } from '@/lib/queries/series';

// Le catalogue change rarement : rendu statique, revalidé toutes les heures.
export const revalidate = 3600;

export default async function HomePage() {
  const series = await getSeriesList();

  if (series.length === 0) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6 text-center">
        <div>
          <h1 className="font-display text-4xl font-light">Tom in Africa</h1>
          <p className="mt-4 text-sm text-paper-dim">
            Aucune série publiée pour le moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="sr-only">Tom in Africa — séries photographiques et tirages d’art</h1>

      {series.map((item, index) => (
        <SeriesHero key={item.id} series={item} index={index} priority={index === 0} />
      ))}
    </>
  );
}
