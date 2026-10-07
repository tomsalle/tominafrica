import 'server-only';

type Line = { photoTitle: string; optionLabel: string; quantity: number; unitPriceCents: number };

type Address = {
  name: string | null;
  line1: string | null;
  line2: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;
};

type OrderEmailInput = {
  locale: 'fr' | 'en';
  orderNumber: string | number;
  firstName: string | null;
  lines: Line[];
  shippingCents: number;
  totalCents: number;
  address: Address;
};

const euros = (cents: number, locale: 'fr' | 'en') =>
  new Intl.NumberFormat(locale === 'en' ? 'en-GB' : 'fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100);

function addressLines(address: Address, locale: 'fr' | 'en'): string[] {
  const country = address.country
    ? (new Intl.DisplayNames([locale], { type: 'region' }).of(address.country.toUpperCase()) ?? address.country)
    : null;
  return [
    address.name,
    address.line1,
    address.line2,
    [address.postalCode, address.city].filter(Boolean).join(' ') || null,
    country,
  ].filter((line): line is string => Boolean(line));
}

function itemLines(lines: Line[], locale: 'fr' | 'en'): string[] {
  return lines.map(
    (line) =>
      `— ${line.photoTitle} · ${line.optionLabel}${line.quantity > 1 ? ` × ${line.quantity}` : ''} : ${euros(
        line.unitPriceCents * line.quantity,
        locale,
      )}`,
  );
}

/** Confirmation envoyée à l'acheteur d'un tirage, après paiement. */
export function orderConfirmationEmail(input: OrderEmailInput): { subject: string; text: string } {
  const { locale, orderNumber, firstName, lines, shippingCents, totalCents, address } = input;
  const shipTo = addressLines(address, locale);

  if (locale === 'en') {
    return {
      subject: `Your Tom in Africa order no. ${orderNumber} is confirmed`,
      text: [
        `Hello${firstName ? ` ${firstName}` : ''},`,
        '',
        'Thank you! Your order is confirmed.',
        '',
        `Order no. ${orderNumber}`,
        ...itemLines(lines, locale),
        `Shipping: ${euros(shippingCents, locale)}`,
        `Total paid: ${euros(totalCents, locale)}`,
        ...(shipTo.length ? ['', 'Delivery address:', ...shipTo] : []),
        '',
        'What happens next: your print is made to order (5 to 10 working days), signed on the back and sent with a certificate of authenticity, then shipped tracked and insured.',
        '',
        'Any question? Simply reply to this email.',
        '',
        'Tom & Charlotte',
        'tominafrica.com',
      ].join('\n'),
    };
  }

  return {
    subject: `Votre commande Tom in Africa n° ${orderNumber} est confirmée`,
    text: [
      `Bonjour${firstName ? ` ${firstName}` : ''},`,
      '',
      'Merci ! Votre commande est bien enregistrée.',
      '',
      `Commande n° ${orderNumber}`,
      ...itemLines(lines, locale),
      `Frais de port : ${euros(shippingCents, locale)}`,
      `Total payé : ${euros(totalCents, locale)}`,
      ...(shipTo.length ? ['', 'Adresse de livraison :', ...shipTo] : []),
      '',
      'La suite : votre tirage est réalisé à la commande (5 à 10 jours ouvrés), signé au dos et accompagné d’un certificat d’authenticité, puis expédié en envoi suivi et assuré.',
      '',
      'Une question ? Répondez simplement à cet e-mail.',
      '',
      'Tom & Charlotte',
      'tominafrica.com',
    ].join('\n'),
  };
}

/** Notification à Tom : de quoi lancer le tirage sans ouvrir Stripe. */
export function orderNotificationEmail(
  input: OrderEmailInput & { email: string; phone: string | null },
): { subject: string; text: string } {
  const { orderNumber, lines, shippingCents, totalCents, address, email, phone } = input;
  return {
    subject: `[Commande tirage] n° ${orderNumber} — ${euros(totalCents, 'fr')} — ${email}`,
    text: [
      `Commande n° ${orderNumber}`,
      ...itemLines(lines, 'fr'),
      `Frais de port : ${euros(shippingCents, 'fr')}`,
      `Total payé : ${euros(totalCents, 'fr')}`,
      '',
      'Livrer à :',
      ...addressLines(address, 'fr'),
      '',
      email,
      ...(phone ? [`Téléphone : ${phone}`] : []),
    ].join('\n'),
  };
}
