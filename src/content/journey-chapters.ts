/**
 * Les chapitres du livre « 1 mère, 1 fils, 1 rêve » (Tom & Charlotte), un
 * par pays, avec la date d'entrée telle qu'écrite dans le livre. Textes
 * repris du livre ; version anglaise traduite.
 *
 * Sert de carnet de route : page « Notre aventure », contexte d'une photo,
 * et repli pour situer une photo dans un pays quand seule sa date est connue.
 */
export type JourneyChapter = {
  countryCode: string;
  /** Date d'entrée dans le pays (ISO). */
  date: string;
  title: { fr: string; en: string };
  excerpt: { fr: string; en: string };
};

export const JOURNEY_CHAPTERS: JourneyChapter[] = [
  {
    countryCode: 'ma',
    date: '2024-11-17',
    title: { fr: 'L’Afrique, nous voilà !', en: 'Africa, here we come!' },
    excerpt: {
      fr: 'Après des mois de préparation, le moment est enfin arrivé. Nous embarquons sur un ferry en direction du Maroc, premier pays de cette traversée de l’Afrique.',
      en: 'After months of preparation, the moment has finally come. We board a ferry bound for Morocco, the first country of this crossing of Africa.',
    },
  },
  {
    countryCode: 'mr',
    date: '2024-12-06',
    title: { fr: 'Un pays de sable et de vent', en: 'A land of sand and wind' },
    excerpt: {
      fr: 'Le désert semble ne jamais finir. Le vent soulève le sable en permanence, créant un voile jaune qui brouille l’horizon. Ici, l’immensité donne le vertige.',
      en: 'The desert seems endless. The wind lifts the sand constantly, drawing a yellow veil across the horizon. Here, the vastness is dizzying.',
    },
  },
  {
    countryCode: 'sn',
    date: '2024-12-11',
    title: { fr: 'Le pays de la Téranga', en: 'The land of Teranga' },
    excerpt: {
      fr: 'La Téranga, un mot wolof qui signifie « hospitalité ». Nous comprenons très vite pourquoi cette valeur est si souvent associée au pays.',
      en: 'Teranga is a Wolof word meaning “hospitality”. We quickly understand why the value is so often tied to the country.',
    },
  },
  {
    countryCode: 'gm',
    date: '2024-12-20',
    title: { fr: 'Bloqués en Gambie !', en: 'Stuck in The Gambia!' },
    excerpt: {
      fr: 'Pendant plus de quinze heures, nous restons prisonniers d’une interminable file de véhicules. Charlotte en fait un terrain de jeu photographique.',
      en: 'For more than fifteen hours we are stuck in an endless line of vehicles. Charlotte turns the wait into a photographic playground.',
    },
  },
  {
    countryCode: 'gn',
    date: '2024-12-28',
    title: { fr: 'On lâche l’accélérateur', en: 'Easing off the accelerator' },
    excerpt: {
      fr: 'Pour la première fois depuis le départ, nous cessons de vouloir avancer à tout prix. Nous commençons simplement à vivre le voyage.',
      en: 'For the first time since we left, we stop trying to push on at all costs. We simply start living the journey.',
    },
  },
  {
    countryCode: 'ci',
    date: '2025-01-07',
    title: { fr: 'À deux doigts de la fin', en: 'This close to the end' },
    excerpt: {
      fr: 'On était venus traverser l’Afrique. Ce jour-là, c’est l’Afrique qui nous a sauvés.',
      en: 'We had come to cross Africa. That day, it was Africa that saved us.',
    },
  },
  {
    countryCode: 'gh',
    date: '2025-01-23',
    title: { fr: 'Pas trop vite !', en: 'Not so fast!' },
    excerpt: {
      fr: 'C’est souvent dans les pires galères que naissent les plus belles rencontres.',
      en: 'The best encounters are often born out of the worst troubles.',
    },
  },
  {
    countryCode: 'tg',
    date: '2025-01-30',
    title: { fr: 'Reflets jumelés', en: 'Twin reflections' },
    excerpt: {
      fr: 'Un soir, nous installons notre campement sur une plage du Togo. Charlotte part à la rencontre des habitants et cherche déjà les prochains visages à photographier.',
      en: 'One evening, we set up camp on a beach in Togo. Charlotte goes off to meet people, already looking for the next faces to photograph.',
    },
  },
  {
    countryCode: 'bj',
    date: '2025-02-04',
    title: { fr: 'Le pays du vaudou', en: 'The land of voodoo' },
    excerpt: {
      fr: 'Ganvié, surnommée la « Venise d’Afrique », dont le nom signifie « nous sommes en paix ». L’eau est partout, mais elle n’est pas potable.',
      en: 'Ganvié, nicknamed the “Venice of Africa”, whose name means “we are at peace”. Water is everywhere, but none of it is drinkable.',
    },
  },
  {
    countryCode: 'ng',
    date: '2025-02-12',
    title: { fr: '7 jours intenses', en: 'Seven intense days' },
    excerpt: {
      fr: 'Nous traversons le Nigeria d’ouest en est en sept jours. Cette étape est l’une des plus redoutées de l’aventure.',
      en: 'We cross Nigeria from west to east in seven days — one of the most dreaded stages of the journey.',
    },
  },
  {
    countryCode: 'cm',
    date: '2025-02-19',
    title: { fr: 'Ce n’est pas fini', en: 'It isn’t over' },
    excerpt: {
      fr: 'Nous venons de parcourir la plus longue et la plus belle piste de notre traversée. Ce n’était pas le moment de tomber en panne : ici, il n’y a pas de dépanneuse.',
      en: 'We have just driven the longest and most beautiful track of the crossing. It was no time to break down: there are no tow trucks out here.',
    },
  },
  {
    countryCode: 'cg',
    date: '2025-02-27',
    title: { fr: 'Au cœur de la forêt', en: 'Deep in the forest' },
    excerpt: {
      fr: 'Des arbres immenses bordent la route, la végétation est si dense que l’on distingue à peine le ciel.',
      en: 'Giant trees line the road; the vegetation is so dense you can barely see the sky.',
    },
  },
  {
    countryCode: 'ao',
    date: '2025-03-13',
    title: { fr: 'L’Angola nous surprend', en: 'Angola surprises us' },
    excerpt: {
      fr: 'Peu présent dans les itinéraires de voyage, l’Angola nous offre pourtant certains des moments les plus forts de notre traversée.',
      en: 'Rarely on travel itineraries, Angola nonetheless gives us some of the most powerful moments of the crossing.',
    },
  },
  {
    countryCode: 'na',
    date: '2025-03-29',
    title: { fr: 'Une autre planète', en: 'Another planet' },
    excerpt: {
      fr: 'Les paysages deviennent immenses, presque martiens. Pendant des heures, nous roulons sans croiser personne.',
      en: 'The landscapes become immense, almost Martian. For hours we drive without passing a soul.',
    },
  },
  {
    countryCode: 'za',
    date: '2025-04-25',
    title: { fr: 'Au bout de l’Afrique', en: 'At the end of Africa' },
    excerpt: {
      fr: 'Après plus de 25 000 kilomètres de route, nous avons enfin atteint notre objectif : traverser l’Afrique ensemble, de Paris jusqu’à Cape Town.',
      en: 'After more than 25,000 kilometres, we have finally reached our goal: crossing Africa together, from Paris to Cape Town.',
    },
  },
];

/** Chapitre en cours à une date donnée (le dernier pays où l'on est entré). */
export function chapterAt(isoDate: string | null): JourneyChapter | null {
  if (!isoDate) return null;
  const day = isoDate.slice(0, 10);
  let current: JourneyChapter | null = null;
  for (const chapter of JOURNEY_CHAPTERS) {
    if (chapter.date <= day) current = chapter;
  }
  return current;
}

export function chapterFor(countryCode: string | null, takenAt: string | null): JourneyChapter | null {
  if (countryCode) {
    const byCountry = JOURNEY_CHAPTERS.find((c) => c.countryCode === countryCode.toLowerCase());
    if (byCountry) return byCountry;
  }
  return chapterAt(takenAt);
}
