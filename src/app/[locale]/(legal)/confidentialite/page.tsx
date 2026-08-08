import type { Metadata } from 'next';
import { Prose } from '@/components/ui/Prose';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
};

export default function PrivacyPage() {
  return (
    <>
      <h1 className="font-display text-5xl leading-none font-light sm:text-6xl">
        Politique de confidentialité
      </h1>

      <div className="mt-14">
        <Prose>
          <h2>Responsable du traitement</h2>
          <p>
            <mark>[À COMPLÉTER : prénom, nom, adresse, e-mail de contact]</mark>.
          </p>

          <h2>Données collectées</h2>
          <p>Ce site collecte des données uniquement lorsque vous passez commande :</p>
          <ul>
            <li>identité et coordonnées : nom, adresse e-mail, téléphone ;</li>
            <li>adresse de facturation et de livraison ;</li>
            <li>contenu et montant de la commande.</li>
          </ul>
          <p>
            <strong>Aucune donnée bancaire n’est collectée ni stockée par ce site.</strong> Les
            informations de paiement sont saisies directement sur l’infrastructure de Stripe, qui
            est seul responsable de leur traitement.
          </p>
          <p>
            Le panier est conservé localement dans votre navigateur (stockage local). Il ne transite
            par aucun serveur tant que vous ne passez pas au paiement, et n’est associé à aucun
            identifiant personnel.
          </p>

          <h2>Finalités et bases légales</h2>
          <ul>
            <li>
              <strong>Exécution de la commande</strong> (fabrication, expédition, suivi, service
              après-vente) — base légale : exécution du contrat.
            </li>
            <li>
              <strong>Obligations comptables et fiscales</strong> (conservation des factures) —
              base légale : obligation légale.
            </li>
          </ul>
          <p>
            Aucune donnée n’est utilisée à des fins de prospection commerciale, et aucune donnée
            n’est vendue ni cédée à des tiers.
          </p>

          <h2>Durées de conservation</h2>
          <ul>
            <li>Données de commande : dix ans, au titre des obligations comptables.</li>
            <li>Données de contact hors commande : trois ans à compter du dernier échange.</li>
          </ul>

          <h2>Destinataires</h2>
          <p>Les données sont accessibles aux seuls sous-traitants nécessaires au service :</p>
          <ul>
            <li>
              <strong>Stripe Payments Europe Ltd</strong> — traitement des paiements ;
            </li>
            <li>
              <strong>Supabase</strong> — hébergement de la base de données (Union européenne,
              Irlande) ;
            </li>
            <li>
              <strong>Vercel Inc.</strong> — hébergement du site ;
            </li>
            <li>
              le transporteur chargé de la livraison — <mark>[À COMPLÉTER]</mark>.
            </li>
          </ul>

          <h2>Cookies</h2>
          <p>
            Ce site n’utilise <strong>aucun cookie de mesure d’audience ni de publicité</strong>.
            Seul le stockage local du navigateur est utilisé, pour conserver le contenu de votre
            panier entre deux visites. Ce mécanisme étant strictement nécessaire au service que vous
            demandez, il ne requiert pas de consentement préalable.
          </p>
          <p>
            Stripe peut déposer des cookies sur sa propre page de paiement, à des fins de sécurité
            et de prévention de la fraude ; ce traitement relève de sa politique de confidentialité.
          </p>

          <h2>Vos droits</h2>
          <p>
            Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation, de
            portabilité et d’opposition sur vos données. Pour l’exercer, écrivez à{' '}
            <mark>[À COMPLÉTER : e-mail]</mark>. Une réponse vous sera apportée sous un mois.
          </p>
          <p>
            Vous pouvez également introduire une réclamation auprès de la CNIL —{' '}
            <a href="https://www.cnil.fr">www.cnil.fr</a>.
          </p>
        </Prose>
      </div>
    </>
  );
}
