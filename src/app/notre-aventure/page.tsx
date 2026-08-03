import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Prose } from '@/components/ui/Prose';
import { Reveal } from '@/components/ui/Reveal';
import { bookPreorderUrl } from '@/lib/env';

export const metadata: Metadata = {
  title: 'Notre aventure',
  description:
    'Six mois, plus de vingt pays, une mère et son fils en Toyota Land Cruiser HDJ80 à la traversée de l’Afrique.',
};

export default function AdventurePage() {
  const preorderUrl = bookPreorderUrl();

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
            <div className="space-y-16">
              <Reveal>
                <div className="max-w-[42rem]">
                  <p className="eyebrow">Une aventure née d’un rêve</p>
                  <p className="mt-6 font-display text-3xl leading-snug font-light text-paper sm:text-4xl">
                    Et si le plus beau des voyages n’était pas une destination, mais les rencontres
                    faites en chemin ?
                  </p>
                  <p className="mt-6 text-base leading-relaxed text-paper-dim sm:text-lg">
                    Pendant près de six mois, nous avons traversé l’Afrique en voiture, de Paris
                    jusqu’en Afrique du Sud. Plus de vingt pays, des milliers de kilomètres et une
                    infinité d’histoires. Ce livre est le récit de cette aventure.
                  </p>
                </div>
              </Reveal>

              <Reveal>
                <AdventurePhoto
                  src="/notre-aventure/vehicule-canyon.jpg"
                  alt="Tom et Charlotte devant leur Toyota Land Cruiser, dans un canyon de grès rouge"
                  width={2000}
                  height={1333}
                />
              </Reveal>

              <Reveal>
                <Prose>
                  <h2>Qui sommes-nous ?</h2>
                  <p>
                    Nous sommes Tom et Charlotte, un fils et sa mère, animés par la même curiosité
                    pour le monde et les rencontres humaines. Photographe, vidéaste et passionné
                    d’aventure, Tom rêvait depuis des années de traverser l’Afrique par la route.
                    Charlotte, elle, lui a transmis le goût du voyage et du continent africain.
                    Ensemble, nous avons décidé de transformer ce rêve en un projet de vie.
                  </p>
                </Prose>
              </Reveal>

              <Reveal>
                <AdventurePhoto
                  src="/notre-aventure/traversee-riviere.jpg"
                  alt="Le Toyota Land Cruiser traversant une rivière au Nigeria"
                  width={2000}
                  height={1292}
                />
              </Reveal>

              <Reveal>
                <Prose>
                  <p>
                    Sans être mécaniciens, sans expérience du camping et avec pour seule certitude
                    l’envie de partir, nous avons préparé notre Toyota Land Cruiser HDJ80 et pris la
                    route en novembre 2024. Notre ambition n’était pas de battre un record ou de
                    réaliser un exploit. Nous voulions prendre le temps. Le temps de nous perdre,
                    d’apprendre, d’écouter et de comprendre.
                  </p>

                  <h2>Le projet</h2>
                  <p>
                    Cette traversée est rapidement devenue bien plus qu’un voyage. Au fil des
                    kilomètres, nous sommes allés à la rencontre d’artistes qui utilisent leur
                    créativité pour faire évoluer leur société.
                  </p>
                  <p>
                    De Sanae Arraqas au Maroc à Amy Sow en Mauritanie, en passant par Patrick
                    Tagoe-Turkson au Ghana, chacun nous a ouvert les portes de son univers et
                    partagé sa vision du monde.
                  </p>
                </Prose>
              </Reveal>

              <Reveal>
                <ArtistsGrid />
              </Reveal>

              <Reveal>
                <Prose>
                  <p>
                    Nous avons également rencontré des associations qui œuvrent chaque jour pour
                    améliorer le quotidien de leur communauté. Sur l’île de Gorée, Fallou Dolly et
                    Cheikh Bamba nous ont rappelé que l’engagement et la solidarité pouvaient
                    changer des vies. Au Ghana, Surf Ghana utilise le sport comme un formidable
                    outil d’inclusion et d’émancipation.
                  </p>

                  <h2>L’eau, fil conducteur</h2>
                  <p>
                    Un autre sujet s’est naturellement imposé au fil du voyage : l’accès à l’eau
                    potable. Dans plusieurs villages, nous avons cherché à comprendre comment les
                    habitants vivaient lorsque chaque litre d’eau demandait des heures d’effort. Ces
                    échanges sont devenus l’un des fils rouges de cette aventure.
                  </p>
                </Prose>
              </Reveal>

              <Reveal>
                <AdventurePhoto
                  src="/notre-aventure/rencontre-chef-village.jpg"
                  alt="Rencontre avec un chef de village et sa communauté, sous les palmiers"
                  width={2000}
                  height={1125}
                />
              </Reveal>

              <Reveal>
                <Prose>
                  <p>
                    Bien sûr, il y a aussi eu les imprévus : les pistes interminables, les contrôles
                    de police, les ferrys en panne, les nuits passées au milieu de nulle part, les
                    problèmes mécaniques ou encore les moments où tout semblait s’effondrer.
                    Pourtant, c’est souvent dans ces instants que nous avons rencontré les personnes
                    les plus extraordinaires.
                  </p>
                </Prose>
              </Reveal>

              <Reveal>
                <AdventurePhoto
                  src="/notre-aventure/village-route-troupeau.jpg"
                  alt="Un troupeau traverse une route de village au Cameroun, vu depuis le drone"
                  width={2000}
                  height={1124}
                />
              </Reveal>

              <Reveal>
                <Prose>
                  <h2>Bienvenue sur la route</h2>
                  <p>
                    À travers ce livre, nous ne vous invitons pas seulement à découvrir les
                    paysages d’un continent exceptionnel. Nous vous emmenons partager le quotidien
                    de celles et ceux qui nous ont accueillis, les histoires qu’ils nous ont
                    confiées et les émotions qui ont transformé cette traversée en une aventure
                    profondément humaine.
                  </p>
                </Prose>
              </Reveal>
            </div>

            <Reveal delay={90}>
              <div className="space-y-10 lg:sticky lg:top-28 lg:self-start">
                <div className="border border-ink-line p-7">
                  <p className="eyebrow">Le livre</p>
                  <p className="mt-4 text-sm leading-relaxed text-paper-dim">
                    Un livre photographique reviendra sur les six mois de cette traversée, à
                    paraître prochainement.
                  </p>

                  {preorderUrl ? (
                    <a
                      href={preorderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-paper px-6 py-3 text-[0.6875rem] font-medium tracking-[0.24em] text-ink uppercase transition-[color,background-color,border-color,transform] duration-300 hover:bg-white active:scale-[0.97]"
                    >
                      Précommander le livre
                    </a>
                  ) : (
                    <p className="mt-6 border border-ink-line px-4 py-3 text-center text-xs text-paper-faint">
                      Précommande bientôt disponible
                    </p>
                  )}
                </div>

                <div className="border border-ink-line p-7">
                  <p className="eyebrow">L’exposition</p>
                  <p className="mt-4 text-sm leading-relaxed text-paper-dim">
                    Une exposition aura bientôt lieu à Paris, autour des photographies de cette
                    traversée.
                  </p>
                  <ButtonLink
                    href="/notre-aventure/exposition"
                    variant="outline"
                    className="mt-6 w-full"
                  >
                    S’inscrire
                  </ButtonLink>
                </div>

                <div className="space-y-4">
                  <ButtonLink
                    href="/series/1-mere-1-fils-1-reve"
                    variant="outline"
                    className="w-full"
                  >
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

/** Photo pleine largeur de colonne, entre deux blocs de texte. */
function AdventurePhoto({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  return (
    <div className="bg-ink-soft">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="h-auto w-full"
      />
    </div>
  );
}

/** Portraits des artistes rencontrés et l'une de leurs œuvres, en vis-à-vis. */
function ArtistsGrid() {
  const images = [
    {
      src: '/notre-aventure/sanae-portrait.jpg',
      alt: 'Sanae Arraqas, artiste peintre rencontrée au Maroc',
    },
    {
      src: '/notre-aventure/amy-sow-portrait.jpg',
      alt: 'Amy Sow, artiste rencontrée en Mauritanie',
    },
    {
      src: '/notre-aventure/patrick-portrait.jpg',
      alt: 'Patrick Tagoe-Turkson, artiste rencontré au Ghana',
    },
    { src: '/notre-aventure/sanae-oeuvre.jpg', alt: 'Une œuvre de Sanae Arraqas' },
    { src: '/notre-aventure/oeuvre-portrait-femme.jpg', alt: 'Une œuvre de Patrick Tagoe-Turkson' },
    { src: '/notre-aventure/oeuvre-mosaique.jpg', alt: 'Une œuvre en mosaïque peinte, au Ghana' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
      {images.map((image) => (
        <div key={image.src} className="relative aspect-[3/4] overflow-hidden bg-ink-soft">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 18vw, 45vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
