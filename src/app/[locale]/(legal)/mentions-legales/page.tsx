import type { Metadata } from 'next';
import { Prose } from '@/components/ui/Prose';

export const metadata: Metadata = {
  title: 'Mentions légales',
  robots: { index: true, follow: true },
};

/**
 * Mentions légales — obligatoires (art. 6 III de la LCEN du 21 juin 2004).
 *
 * Les <mark> signalent les informations qui ne peuvent venir que de toi.
 * Tant qu'elles ne sont pas remplies, cette page n'est pas conforme.
 */
export default function LegalNoticePage() {
  return (
    <>
      <h1 className="font-display text-5xl leading-none font-light sm:text-6xl">
        Mentions légales
      </h1>

      <div className="mt-14">
        <Prose>
          <h2>Éditeur du site</h2>
          <p>
            Le présent site est édité par <mark>[À COMPLÉTER : prénom et nom, ou raison
            sociale]</mark>.
          </p>
          <ul>
            <li>
              Statut juridique : <mark>[À COMPLÉTER : entrepreneur individuel / micro-entreprise /
              SASU…]</mark>
            </li>
            <li>
              Adresse du siège : <mark>[À COMPLÉTER : adresse postale complète]</mark>
            </li>
            <li>
              Numéro SIRET : <mark>[À COMPLÉTER]</mark>
            </li>
            <li>
              Numéro de TVA intracommunautaire : <mark>[À COMPLÉTER, ou mentionner « TVA non
              applicable, art. 293 B du CGI » en franchise en base]</mark>
            </li>
            <li>
              Adresse e-mail : <mark>[À COMPLÉTER]</mark>
            </li>
            <li>
              Téléphone : <mark>[À COMPLÉTER]</mark>
            </li>
            <li>
              Directeur de la publication : <mark>[À COMPLÉTER : prénom et nom]</mark>
            </li>
          </ul>

          <h2>Hébergement</h2>
          <p>
            Le site est hébergé par <strong>Vercel Inc.</strong>, 440 N Barranca Ave #4133, Covina,
            CA 91723, États-Unis — <a href="https://vercel.com">vercel.com</a>.
          </p>
          <p>
            Les données du site (catalogue, commandes) sont hébergées par{' '}
            <strong>Supabase</strong>, sur une infrastructure située dans l’Union européenne
            (région eu-west-1, Irlande).
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            L’ensemble des photographies présentées sur ce site est la propriété exclusive de{' '}
            <mark>[À COMPLÉTER : prénom et nom]</mark> et est protégé par les articles L.111-1 et
            suivants du Code de la propriété intellectuelle.
          </p>
          <p>
            Toute reproduction, représentation, modification, publication ou adaptation, totale ou
            partielle, par quelque procédé que ce soit, est interdite sans autorisation écrite
            préalable. L’achat d’un tirage confère la propriété de l’objet matériel, et en aucun cas
            la cession des droits d’auteur sur l’image.
          </p>

          <h2>Médiation de la consommation</h2>
          <p>
            Conformément à l’article L.612-1 du Code de la consommation, tout consommateur peut
            recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable
            d’un litige. Le médiateur désigné est <mark>[À COMPLÉTER : nom et coordonnées du
            médiateur — l’adhésion à un dispositif de médiation est obligatoire pour tout
            professionnel vendant à des consommateurs]</mark>.
          </p>
          <p>
            La plateforme européenne de règlement en ligne des litiges est accessible à l’adresse{' '}
            <a href="https://ec.europa.eu/consumers/odr">ec.europa.eu/consumers/odr</a>.
          </p>

          <h2>Crédits</h2>
          <p>
            Photographies : <mark>[À COMPLÉTER : prénom et nom]</mark>. Fonds cartographiques :{' '}
            <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> et{' '}
            <a href="https://carto.com/attributions">CARTO</a>.
          </p>
        </Prose>
      </div>
    </>
  );
}
