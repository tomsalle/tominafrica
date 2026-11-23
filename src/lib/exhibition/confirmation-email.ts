import { EXHIBITION } from '@/lib/exhibition/event';

type Locale = 'fr' | 'en';

type Input = {
  locale: Locale;
  firstName: string | null;
  visitDays: string[] | null;
  /** « confirmation » juste après l'inscription, « rappel » pour les inscrits déjà enregistrés. */
  kind: 'confirmation' | 'rappel';
};

const ADDRESS = `${EXHIBITION.venue}, ${EXHIBITION.street}, ${EXHIBITION.postalCode} ${EXHIBITION.city}`;

const DAY_NAMES: Record<Locale, Record<string, string>> = {
  fr: { '2026-11-27': 'Vendredi 27 novembre', '2026-11-28': 'Samedi 28 novembre', '2026-11-29': 'Dimanche 29 novembre' },
  en: { '2026-11-27': 'Friday 27 November', '2026-11-28': 'Saturday 28 November', '2026-11-29': 'Sunday 29 November' },
};

/** « 19:00 » → « 19 h » (fr) ou « 7 pm » (en). */
function hour(value: string, locale: Locale): string {
  const [h, m] = value.split(':').map(Number);
  if (locale === 'en') {
    const suffix = (h ?? 0) >= 12 ? 'pm' : 'am';
    const h12 = (h ?? 0) % 12 || 12;
    return m ? `${h12}:${String(m).padStart(2, '0')} ${suffix}` : `${h12} ${suffix}`;
  }
  return m ? `${h} h ${String(m).padStart(2, '0')}` : `${h} h`;
}

/** Prénom saisi tout en minuscules ou en majuscules : on le remet en forme. */
function displayName(firstName: string | null): string | null {
  const name = firstName?.trim();
  if (!name) return null;
  if (name !== name.toLowerCase() && name !== name.toUpperCase()) return name;
  return name.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_, sep: string, letter: string) => sep + letter.toUpperCase());
}

/**
 * E-mail envoyé aux inscrits de l'exposition : lieu, horaires jour par jour,
 * programme et tirages en vente. Texte brut, comme la confirmation de
 * précommande : lisible partout.
 */
export function exhibitionInfoEmail({ locale, firstName, visitDays, kind }: Input): { subject: string; text: string } {
  const name = displayName(firstName);
  const days = (visitDays ?? []).filter((day) => day in DAY_NAMES.fr);

  if (locale === 'en') {
    const schedule = EXHIBITION.hours.map(
      (slot) =>
        `- ${DAY_NAMES.en[slot.day]}: ${hour(slot.open, 'en')} – ${hour(slot.close, 'en')}${slot.opening ? ' (opening night)' : ''}`,
    );
    return {
      subject:
        kind === 'confirmation'
          ? 'You’re registered: “1 Mother, 1 Son, 1 Dream” exhibition, 27 — 29 November'
          : 'Practical details: “1 Mother, 1 Son, 1 Dream” exhibition, 27 — 29 November',
      text: [
        `Hello${name ? ` ${name}` : ''},`,
        '',
        kind === 'confirmation'
          ? 'Thank you for registering for our exhibition “1 Mother, 1 Son, 1 Dream”! Here are the practical details.'
          : 'You are registered for our exhibition “1 Mother, 1 Son, 1 Dream”: here are the practical details.',
        '',
        'WHERE',
        ADDRESS,
        `Map: ${EXHIBITION.mapsUrl}`,
        '',
        'OPENING HOURS',
        ...schedule,
        ...(days.length ? ['', `You told us you would come: ${days.map((day) => DAY_NAMES.en[day]).join(', ')}.`] : []),
        '',
        'ON SHOW',
        'The photographs from our journey across Africa, cars, our travel videos, the launch of our book, and our stories told live.',
        '',
        'PRINTS',
        'Every photo in the exhibition can also be ordered on tominafrica.com from 27 November.',
        '',
        'Pre-ordered the book with pick-up at the exhibition? It will be waiting for you there.',
        '',
        'Any question? Simply reply to this email.',
        '',
        'See you very soon!',
        'Charlotte and Tom',
        'tominafrica.com',
      ].join('\n'),
    };
  }

  const schedule = EXHIBITION.hours.map(
    (slot) =>
      `- ${DAY_NAMES.fr[slot.day]} : ${hour(slot.open, 'fr')} – ${hour(slot.close, 'fr')}${slot.opening ? ' (vernissage)' : ''}`,
  );
  return {
    subject:
      kind === 'confirmation'
        ? 'Inscription confirmée : exposition « 1 Mère, 1 Fils, 1 Rêve », du 27 au 29 novembre'
        : 'Infos pratiques : exposition « 1 Mère, 1 Fils, 1 Rêve », du 27 au 29 novembre',
    text: [
      `Bonjour${name ? ` ${name}` : ''},`,
      '',
      kind === 'confirmation'
        ? 'Merci pour votre inscription à notre exposition « 1 Mère, 1 Fils, 1 Rêve » ! Voici les infos pratiques.'
        : 'Vous êtes inscrit·e à notre exposition « 1 Mère, 1 Fils, 1 Rêve » : voici les infos pratiques.',
      '',
      'OÙ',
      ADDRESS,
      `Itinéraire : ${EXHIBITION.mapsUrl}`,
      '',
      'HORAIRES',
      ...schedule,
      ...(days.length ? ['', `Vous nous avez dit venir : ${days.map((day) => DAY_NAMES.fr[day]?.toLowerCase()).join(', ')}.`] : []),
      '',
      'AU PROGRAMME',
      'Les photographies de notre traversée de l’Afrique, des voitures, les vidéos du voyage, la sortie de notre livre et nos anecdotes en direct.',
      '',
      'LES TIRAGES',
      'Toutes les photos exposées pourront aussi être commandées sur tominafrica.com à partir du 27 novembre.',
      '',
      'Vous avez précommandé le livre avec retrait à l’exposition ? Il vous attendra sur place.',
      '',
      'Une question ? Répondez simplement à cet e-mail.',
      '',
      'À très vite !',
      'Charlotte et Tom',
      'tominafrica.com',
    ].join('\n'),
  };
}
