import 'server-only';

import { EXHIBITION } from '@/lib/exhibition/event';

type Delivery = 'retraitexposition' | 'envoivinted' | null;

type ConfirmationInput = {
  locale: 'fr' | 'en';
  firstName: string | null;
  tierName: string;
  quantity: number;
  amountCents: number;
  isDonation: boolean;
  delivery: Delivery;
  expoPromoCode: string | null;
};

const euros = (cents: number, locale: 'fr' | 'en') =>
  new Intl.NumberFormat(locale === 'en' ? 'en-GB' : 'fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100);

const ADDRESS = `${EXHIBITION.venue}, ${EXHIBITION.street}, ${EXHIBITION.postalCode} ${EXHIBITION.city}`;

/**
 * E-mail de confirmation envoyé à l'acheteur après une précommande payée :
 * récapitulatif, et la suite selon le mode de livraison choisi au paiement.
 * Texte brut volontairement : lisible partout, rien à casser.
 */
export function bookPreorderConfirmationEmail(input: ConfirmationInput): { subject: string; text: string } {
  const { locale, firstName, tierName, quantity, amountCents, isDonation, delivery, expoPromoCode } = input;

  if (locale === 'en') {
    const next = isDonation
      ? 'Thank you for your donation — it goes directly towards printing the book.'
      : delivery === 'envoivinted'
        ? 'Delivery: shipping via Vinted\nI will get in touch before shipping to arrange delivery from my Vinted account — you will only pay the shipping on the app (about €1).'
        : `Delivery: pick-up at the exhibition\nYour book will be waiting for you at the exhibition: ${ADDRESS}, 27 — 29 November 2026 (opening night on Friday 27 November).`;

    return {
      subject: isDonation ? 'Thank you for your donation — 1 Mother, 1 Son, 1 Dream' : 'Your pre-order of “1 Mother, 1 Son, 1 Dream” is confirmed',
      text: [
        `Hello${firstName ? ` ${firstName}` : ''},`,
        '',
        isDonation ? 'Thank you! Your donation has been received.' : 'Thank you! Your pre-order is confirmed.',
        '',
        `Item: ${tierName}`,
        ...(isDonation ? [] : [`Quantity: ${quantity}`]),
        `Amount paid: ${euros(amountCents, locale)}`,
        '',
        next,
        ...(isDonation ? [] : ['', 'Estimated delivery: 27 November 2026, the opening night of the exhibition in Paris.']),
        ...(expoPromoCode
          ? [
              '',
              'Our gift to you: 10% off a print at the exhibition',
              `Your code: ${expoPromoCode}`,
              'Valid on one photo print of your choice, bought on site at the exhibition (27 — 29 November 2026). Just show this code when you buy. Single use, not valid online.',
            ]
          : []),
        '',
        'Any question? Simply reply to this email.',
        '',
        'Tom & Charlotte',
        'tominafrica.com',
      ].join('\n'),
    };
  }

  const next = isDonation
    ? 'Merci pour votre don, qui aide directement à l’impression du livre.'
    : delivery === 'envoivinted'
      ? 'Livraison : envoi via Vinted\nJe vous contacterai avant l’expédition pour organiser l’envoi depuis mon compte Vinted : vous ne paierez que les frais d’envoi sur l’application (environ 1 €).'
      : `Livraison : retrait à l’exposition\nVotre livre vous attendra à l’exposition : ${ADDRESS}, du 27 au 29 novembre 2026 (vernissage le vendredi 27 novembre).`;

  return {
    subject: isDonation ? 'Merci pour votre don — 1 Mère, 1 Fils, 1 Rêve' : 'Votre précommande du livre « 1 Mère, 1 Fils, 1 Rêve » est confirmée',
    text: [
      `Bonjour${firstName ? ` ${firstName}` : ''},`,
      '',
      isDonation ? 'Merci ! Votre don est bien reçu.' : 'Merci ! Votre précommande est bien enregistrée.',
      '',
      `Article : ${tierName}`,
      ...(isDonation ? [] : [`Quantité : ${quantity}`]),
      `Montant payé : ${euros(amountCents, locale)}`,
      '',
      next,
      ...(isDonation ? [] : ['', 'Livraison estimée : 27 novembre 2026, jour du vernissage de l’exposition à Paris.']),
      ...(expoPromoCode
        ? [
            '',
            'Notre cadeau : -10 % sur un tirage à l’exposition',
            `Votre code : ${expoPromoCode}`,
            'Valable sur un tirage photo de votre choix, acheté sur place à l’exposition (du 27 au 29 novembre 2026). Présentez simplement ce code au moment de l’achat. Utilisable une fois, non valable en ligne.',
          ]
        : []),
      '',
      'Une question ? Répondez simplement à cet e-mail.',
      '',
      'Tom & Charlotte',
      'tominafrica.com',
    ].join('\n'),
  };
}
