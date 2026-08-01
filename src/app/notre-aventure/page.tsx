import type { Metadata } from 'next';
import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Prose } from '@/components/ui/Prose';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Notre aventure',
  description:
    'Six mois, plus de vingt pays, une mère et son fils en Toyota Land Cruiser HDJ80 à la traversée de l’Afrique.',
};

export default function AdventurePage() {
  return (
    <>
      {/* Vidéo en fond plutôt qu'une photo : c'est le seul endroit du site où
          le mouvement raconte quelque chose que l'image fixe ne peut pas —
          l'aventure elle-même, pas une photographie qui en est issue. */}
      <section className="relative h-dvh min-h-[36rem] w-full overflow-hidden">
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

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/40" />

        <div className="relative flex h-full items-end">
          <div className="mx-auto w-full max-w-[110rem] px-5 pb-20 sm:px-8 sm:pb-24">
            <p className="eyebrow">Novembre 2024 — mai 2025</p>
            <h1 className="mt-5 font-display text-5xl leading-[0.95] font-light tracking-tight sm:text-7xl lg:text-8xl">
              Notre aventure
            </h1>
            <p className="mt-4 max-w-xl text-base text-paper-dim sm:text-lg">
              Paris — Le Cap, en Toyota Land Cruiser HDJ80, mère et fils.
            </p>
          </div>
        </div>
      </section>

      <div className="pt-24 pb-28 sm:pt-32">
        <Container width="wide">
          <div className="grid grid-cols-1 gap-x-20 gap-y-16 lg:grid-cols-[1fr_24rem]">
            <Reveal>
              <Prose>
                <p>
                  En novembre 2024, nous avons quitté Paris à bord de notre Toyota Land Cruiser
                  HDJ80 pour traverser l’Afrique jusqu’en Afrique du Sud. Pendant près de six
                  mois, nous avons parcouru plus de vingt pays à la rencontre des habitants,
                  d’artistes et d’associations afin de raconter, en images, une Afrique
                  authentique et profondément humaine.
                </p>
                <p>
                  Au-delà de l’aventure, ce voyage était une quête de rencontres, de découvertes
                  et de compréhension, notamment autour de l’accès à l’eau potable. À travers nos
                  photographies, nous partageons les paysages, les visages et les histoires qui
                  ont marqué cette traversée mère-fils et changé notre regard sur le monde.
                </p>

                <h2>Le carnet de route</h2>
                <p>
                  <mark>
                    [À COMPLÉTER : l’itinéraire pays par pays, une anecdote de piste, ce qui a le
                    plus surpris pendant ces six mois.]
                  </mark>
                </p>

                <h2>L’eau, fil conducteur</h2>
                <p>
                  <mark>
                    [À COMPLÉTER : le lien avec l’accès à l’eau potable — quelles rencontres,
                    quelles associations, ce que ça a changé dans le regard porté sur le voyage.]
                  </mark>
                </p>
              </Prose>
            </Reveal>

            <Reveal delay={90}>
              <div className="space-y-10 lg:sticky lg:top-28 lg:self-start">
                <div className="border border-ink-line p-7">
                  <p className="eyebrow">Le livre</p>
                  <p className="mt-4 text-sm leading-relaxed text-paper-dim">
                    <mark className="bg-accent/15 px-1.5 py-0.5 text-accent">
                      [À COMPLÉTER : titre et date de parution]
                    </mark>{' '}
                    — un livre photographique reviendra sur les six mois de traversée, à paraître
                    prochainement.
                  </p>
                </div>

                <div className="border border-ink-line p-7">
                  <p className="eyebrow">L’exposition</p>
                  <p className="mt-4 text-sm leading-relaxed text-paper-dim">
                    <mark className="bg-accent/15 px-1.5 py-0.5 text-accent">
                      [À COMPLÉTER : lieu et dates]
                    </mark>{' '}
                    — une exposition aura bientôt lieu à Paris, autour des photographies de cette
                    traversée.
                  </p>
                </div>

                <div className="space-y-4">
                  <ButtonLink href="/" variant="outline" className="w-full">
                    Voir les photographies
                  </ButtonLink>
                  <Link
                    href="/videos"
                    className="eyebrow link-underline block text-center text-paper"
                  >
                    Voir les vidéos du voyage
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </div>
    </>
  );
}
