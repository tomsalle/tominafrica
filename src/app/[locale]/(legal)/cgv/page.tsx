import type { Metadata } from 'next';
import { Prose } from '@/components/ui/Prose';

export const metadata: Metadata = {
  title: 'Conditions générales de vente',
};

/**
 * CGV — obligatoires pour toute vente à distance à des consommateurs
 * (art. L.221-5 du Code de la consommation).
 *
 * Ce gabarit couvre les mentions exigées, mais il n'a pas valeur de conseil
 * juridique : fais-le relire avant la première vente réelle, en particulier les
 * clauses de TVA et de rétractation.
 */
export default function TermsPage() {
  return (
    <>
      <h1 className="font-display text-5xl leading-none font-light sm:text-6xl">
        Conditions générales de vente
      </h1>
      <p className="mt-6 text-xs text-paper-faint">
        Dernière mise à jour : <mark className="bg-accent/15 px-1.5 py-0.5 text-accent">[date]</mark>
      </p>

      <div className="mt-14">
        <Prose>
          <h2>Article 1 — Objet et champ d’application</h2>
          <p>
            Les présentes conditions générales de vente régissent l’ensemble des ventes de tirages
            photographiques conclues sur ce site entre <mark>[À COMPLÉTER : identité du
            vendeur]</mark> (« le Vendeur ») et toute personne physique non commerçante effectuant
            un achat (« le Client »).
          </p>
          <p>
            Toute commande implique l’acceptation sans réserve des présentes conditions, dont le
            Client reconnaît avoir pris connaissance avant de valider son paiement.
          </p>

          <h2>Article 2 — Produits</h2>
          <p>
            Les produits proposés sont des tirages photographiques d’art, réalisés à la commande sur
            papier fine art, encres pigmentaires.
          </p>
          <p>
            Les tirages sont proposés soit en <strong>édition limitée</strong>, numérotée et signée,
            accompagnée d’un certificat d’authenticité, soit en <strong>tirage non limité</strong>.
            Le nombre d’exemplaires d’une édition limitée est indiqué sur la fiche de chaque
            photographie ; une fois épuisée, l’édition n’est jamais rééditée dans le même format.
          </p>
          <p>
            Les photographies présentées à l’écran ne sauraient constituer un rendu colorimétrique
            exact. Un écart de rendu entre l’écran du Client et le tirage physique ne constitue pas
            un défaut de conformité.
          </p>

          <h2>Article 3 — Prix</h2>
          <p>
            Les prix sont indiqués en euros, toutes taxes comprises, hors frais de livraison. Les
            frais de livraison sont calculés et affichés avant la validation définitive de la
            commande.
          </p>
          <p>
            <mark>[À COMPLÉTER selon ton statut : si tu bénéficies de la franchise en base de TVA,
            indiquer « TVA non applicable, art. 293 B du CGI ». Si tu es assujetti, préciser le taux
            appliqué — le taux réduit de 5,5 % peut s’appliquer aux œuvres photographiques d’art
            sous conditions strictes (tirages signés et limités à 30 exemplaires, tous formats et
            supports confondus, art. 98 A II de l’annexe III au CGI) ; à défaut, le taux normal de
            20 % s’applique. À faire valider par ton comptable.]</mark>
          </p>
          <p>
            Le Vendeur se réserve le droit de modifier ses prix à tout moment. Les produits sont
            facturés sur la base des tarifs en vigueur au moment de la validation de la commande.
          </p>

          <h2>Article 4 — Commande</h2>
          <p>
            La vente est réputée conclue à la date d’acceptation du paiement par le prestataire de
            paiement. Un e-mail de confirmation récapitulant la commande est adressé au Client.
          </p>
          <p>
            Le Vendeur se réserve le droit d’annuler toute commande présentant un caractère anormal
            ou frauduleux, ou en cas de défaut de paiement. Le Client en est alors informé et
            intégralement remboursé.
          </p>

          <h2>Article 5 — Paiement</h2>
          <p>
            Le paiement s’effectue en ligne par carte bancaire, Apple Pay ou Google Pay, via la
            plateforme sécurisée <strong>Stripe</strong>. Aucune donnée bancaire n’est collectée ni
            conservée par le Vendeur : les informations de paiement sont transmises directement à
            Stripe, chiffrées de bout en bout.
          </p>

          <h2>Article 6 — Livraison</h2>
          <p>
            Les tirages étant réalisés à la commande, le délai de fabrication est de cinq à dix
            jours ouvrés, auquel s’ajoute le délai d’acheminement du transporteur.
          </p>
          <ul>
            <li>France métropolitaine : <mark>[À COMPLÉTER : transporteur et délai]</mark></li>
            <li>Union européenne : <mark>[À COMPLÉTER : transporteur et délai]</mark></li>
          </ul>
          <p>
            Les tirages sont expédiés roulés sous tube rigide, en envoi suivi et assuré. À défaut
            d’indication du délai, la livraison intervient au plus tard trente jours après la
            conclusion du contrat (art. L.216-1 du Code de la consommation).
          </p>
          <p>
            En cas de retard de livraison excédant sept jours ouvrés, le Client peut résoudre le
            contrat par lettre recommandée ou par e-mail, et être remboursé sous quatorze jours.
          </p>
          <p>
            Il appartient au Client de vérifier l’état du colis à la réception et d’émettre toute
            réserve auprès du transporteur en cas d’avarie.
          </p>

          <h2>Article 7 — Droit de rétractation</h2>
          <p>
            Conformément aux articles L.221-18 et suivants du Code de la consommation, le Client
            dispose d’un délai de <strong>quatorze jours</strong> à compter de la réception de sa
            commande pour exercer son droit de rétractation, sans avoir à motiver sa décision.
          </p>
          <p>
            Pour l’exercer, le Client informe le Vendeur de sa décision par une déclaration dénuée
            d’ambiguïté, à l’adresse <mark>[À COMPLÉTER : e-mail]</mark>. Le produit doit être
            retourné dans son emballage d’origine, en parfait état, dans les quatorze jours suivant
            cette notification. Les frais de retour restent à la charge du Client.
          </p>
          <p>
            Le remboursement intervient dans les quatorze jours suivant la réception du produit
            retourné, par le même moyen de paiement que celui utilisé lors de la commande.
          </p>
          <p>
            <strong>Exception :</strong> conformément à l’article L.221-28 3° du Code de la
            consommation, le droit de rétractation ne s’applique pas aux biens confectionnés selon
            les spécifications du Client ou nettement personnalisés. <mark>[À COMPLÉTER : décide si
            tu invoques cette exception pour les formats sur mesure. Attention : un tirage d’un
            format standard proposé au catalogue n’est PAS considéré comme personnalisé — la
            rétractation s’y applique pleinement.]</mark>
          </p>

          <h2>Article 8 — Garanties légales</h2>
          <p>
            Tous les produits bénéficient de la garantie légale de conformité (art. L.217-3 et
            suivants du Code de la consommation) et de la garantie contre les vices cachés (art.
            1641 et suivants du Code civil).
          </p>
          <p>
            En cas de défaut de conformité, le Client dispose de deux ans à compter de la délivrance
            du bien pour agir, et peut choisir entre la réparation et le remplacement, sous réserve
            des conditions de coût prévues par la loi.
          </p>

          <h2>Article 9 — Propriété intellectuelle</h2>
          <p>
            L’achat d’un tirage confère au Client la propriété du support matériel uniquement. Il
            n’emporte aucune cession de droits d’auteur. Toute reproduction, diffusion, exploitation
            commerciale ou mise en ligne de l’image est interdite sans autorisation écrite préalable
            du Vendeur.
          </p>

          <h2>Article 10 — Données personnelles</h2>
          <p>
            Les traitements de données personnelles sont décrits dans la{' '}
            <a href="/confidentialite">politique de confidentialité</a>.
          </p>

          <h2>Article 11 — Litiges et droit applicable</h2>
          <p>
            Les présentes conditions sont soumises au droit français. En cas de litige, le Client
            s’adresse en priorité au Vendeur pour une solution amiable. À défaut, il peut recourir
            gratuitement au médiateur de la consommation mentionné dans les{' '}
            <a href="/mentions-legales">mentions légales</a>, ou saisir la plateforme européenne de
            règlement en ligne des litiges.
          </p>
        </Prose>
      </div>
    </>
  );
}
