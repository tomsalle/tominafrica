import Link from 'next/link';
import { ContactForm } from '@/components/home/ContactForm';
import { SeriesHero } from '@/components/home/SeriesHero';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
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

      <div className="py-24 sm:py-32">
        <Container width="prose">
          <Reveal>
            <p className="eyebrow">Le projet</p>
            <p className="mt-7 text-lg leading-relaxed text-paper-dim sm:text-xl">
              En novembre 2024, nous avons quitté Paris à bord de notre Toyota Land Cruiser
              HDJ80 pour traverser l’Afrique jusqu’en Afrique du Sud. Pendant près de six mois,
              nous avons parcouru plus de vingt pays à la rencontre des habitants, d’artistes et
              d’associations afin de raconter, en images, une Afrique authentique et profondément
              humaine.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-paper-dim sm:text-xl">
              Au-delà de l’aventure, ce voyage était une quête de rencontres, de découvertes et
              de compréhension, notamment autour de l’accès à l’eau potable. À travers nos
              photographies, nous partageons les paysages, les visages et les histoires qui ont
              marqué cette traversée mère-fils et changé notre regard sur le monde.
            </p>
            <Link href="/notre-aventure" className="eyebrow link-underline mt-9 inline-block text-paper">
              Notre aventure
            </Link>
          </Reveal>
        </Container>

        <Container width="default" className="mt-16 sm:mt-20">
          <Reveal>
            <div className="relative aspect-video w-full overflow-hidden bg-ink-soft">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
                poster="/videos/namibie-hero-poster.jpg"
              >
                <source src="/videos/namibie-hero.mp4" type="video/mp4" />
              </video>
            </div>
            <Link href="/videos" className="eyebrow link-underline mt-6 inline-block text-paper">
              Voir toutes les vidéos
            </Link>
          </Reveal>
        </Container>

        <Container width="prose" className="mt-24 sm:mt-32">
          <Reveal>
            <p className="eyebrow">Contact</p>
            <h2 className="mt-5 font-display text-3xl leading-tight font-light sm:text-4xl">
              Une question, une commande sur mesure ?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-paper-dim">
              Écrivez-nous, nous répondons directement à l’adresse indiquée.
            </p>
            <div className="mt-10">
              <ContactForm />
            </div>
          </Reveal>
        </Container>
      </div>
    </>
  );
}
