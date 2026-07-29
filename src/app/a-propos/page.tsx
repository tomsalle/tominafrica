import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Prose } from '@/components/ui/Prose';

export const metadata: Metadata = {
  title: 'À propos',
  description:
    'Démarche photographique, méthode de travail sur le terrain et fabrication des tirages.',
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-28 sm:pt-40">
      <Container width="wide">
        <div className="grid grid-cols-1 gap-x-20 gap-y-14 lg:grid-cols-[24rem_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="relative aspect-3/4 w-full overflow-hidden bg-ink-soft">
              {/* Remplacer par un portrait : /public/portrait.jpg */}
              <Image
                src="/placeholders/dune-45.svg"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 24rem"
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <p className="eyebrow">À propos</p>

            <h1 className="mt-6 font-display text-5xl leading-[1.02] font-light sm:text-6xl">
              Photographier ce qui reste
              <br />
              quand on enlève le reste.
            </h1>

            <div className="mt-14">
              <Prose>
                <p>
                  <mark>[À COMPLÉTER : ta bio — qui tu es, depuis quand tu photographies, ce
                  qui t’a amené à l’Afrique.]</mark>
                </p>

                <h2>La démarche</h2>
                <p>
                  Je travaille par séries, sur des séjours longs, et je reviens plusieurs fois au
                  même endroit. Une image qui tient debout demande presque toujours d’avoir échoué
                  au même endroit auparavant — et d’y être retourné en sachant quoi attendre.
                </p>
                <p>
                  Aucune de ces photographies n’est une capture volée. Les animaux sont approchés
                  selon des règles simples : on ne réduit pas la distance, on se place sur leur
                  trajectoire, et on accepte de rentrer sans image. Les personnes photographiées
                  savent qu’elles le sont et ont donné leur accord.
                </p>

                <h2>Le travail sur le terrain</h2>
                <p>
                  <mark>[À COMPLÉTER : ton matériel, ta façon de travailler, une anecdote de
                  terrain.]</mark>
                </p>

                <h2>Les tirages</h2>
                <p>
                  Chaque tirage est réalisé à la commande sur papier fine art{' '}
                  <mark>[À COMPLÉTER : nom du laboratoire]</mark>, encres pigmentaires, sans
                  retouche autre que le développement du fichier d’origine.
                </p>
                <p>
                  Les éditions limitées sont numérotées et signées au dos, et accompagnées d’un
                  certificat d’authenticité. Une fois l’édition épuisée, elle ne sera jamais
                  rééditée dans le même format.
                </p>

                <h2>Contact</h2>
                <p>
                  Pour une commande particulière, un format sur mesure, une exposition ou une
                  licence d’image : <mark>[À COMPLÉTER : adresse e-mail]</mark>.
                </p>
              </Prose>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
