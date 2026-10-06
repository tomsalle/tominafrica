/**
 * Récits de photos tirés du livre « 1 mère, 1 fils, 1 rêve », pour les
 * photographies qu'il raconte explicitement. Utilisés seulement quand le
 * champ `photos.story` est vide en base : un récit saisi dans Supabase garde
 * toujours la priorité. Paragraphes séparés par une ligne vide.
 */
export const PHOTO_STORIES: Record<string, { fr: string; en: string }> = {
  'les-jumelles': {
    fr: `Un soir, nous installons notre campement sur une plage du Togo. Charlotte fait la connaissance de Sophie, avec qui le courant passe immédiatement. Elle lui promet de revenir le lendemain matin, cette fois avec sa sœur jumelle, Ayawa.

À notre réveil, Sophie et Ayawa sont déjà là. Je prends notre petit miroir, qui traîne dans la voiture depuis le début de l’aventure, et j’ai l’idée d’aligner leurs deux visages pour n’en former plus qu’un.

Pendant quelques instants, les deux sœurs ne font plus qu’une. Une rencontre improvisée, un petit miroir oublié dans notre 4x4 et un peu de créativité auront suffi à créer une image que nous n’oublierons jamais.`,
    en: `One evening, we set up camp on a beach in Togo. Charlotte meets Sophie, and they hit it off straight away. She promises to come back the next morning — this time with her twin sister, Ayawa.

When we wake up, Sophie and Ayawa are already there. I grab our little mirror, which has been rattling around the car since the start of the trip, and have the idea of lining up their two faces to make just one.

For a few moments, the two sisters become one. An improvised encounter, a small mirror forgotten in our 4x4 and a little creativity were all it took to make an image we will never forget.`,
  },
  sapeur: {
    fr: `Notre séjour à Brazzaville s’achève par une soirée auprès des Sapeurs.

Derrière leurs costumes élégants et leurs couleurs éclatantes, nous découvrons bien plus qu’un style vestimentaire : une véritable culture, faite d’élégance, de respect et de fierté, qui fait aujourd’hui partie de l’identité du Congo.`,
    en: `Our stay in Brazzaville ends with an evening among the Sapeurs.

Behind their elegant suits and bright colours, we discover far more than a dress code: a true culture of elegance, respect and pride that is now part of Congo’s identity.`,
  },
  'les-plongeurs': {
    fr: `À Brazzaville, sur les rapides du fleuve Congo, des jeunes plongent et jouent dans les courants, à seulement quelques mètres d’un hippopotame.

Une scène aussi fascinante qu’inattendue.`,
    en: `In Brazzaville, on the rapids of the Congo River, young people dive and play in the currents, just a few metres from a hippo.

A scene as fascinating as it was unexpected.`,
  },
  'la-corale': {
    fr: `À Luanda, une chorale d’enfants nous interpelle dans la rue. En quelques instants, les voix s’élèvent et un concert improvisé prend vie au milieu de la ville.

Un moment simple, sincère, qui nous rappelle une nouvelle fois la place qu’occupe la musique dans de nombreuses cultures africaines.`,
    en: `In Luanda, a children’s choir calls out to us in the street. Within moments the voices rise and an impromptu concert comes to life in the middle of the city.

A simple, sincere moment that reminds us once again of the place music holds in so many African cultures.`,
  },
  'village-de-pecheur': {
    fr: `Santa Maria, un petit village de pêcheurs où le temps semble s’être arrêté. Entre les filets qui sèchent au soleil, les bateaux colorés et les maisons construites avec de vieux vêtements, les enfants nous adoptent immédiatement.

Toute la journée, nous jouons avec eux, improvisons des séances photo et partageons des éclats de rire. Ces instants de complicité donnent naissance à certaines de nos images préférées du voyage.`,
    en: `Santa Maria, a small fishing village where time seems to have stopped. Between nets drying in the sun, colourful boats and houses built from old clothes, the children adopt us at once.

All day long we play with them, improvise photo shoots and share bursts of laughter. Those moments of complicity gave us some of our favourite images of the trip.`,
  },
  'perdras-negras': {
    fr: `Notre route nous mène aux impressionnantes formations rocheuses de Pedras Negras, avant de rejoindre les paysages irréels du désert des Morros Vermelhos.

L’Angola restera pour nous un pays de contrastes, où l’immensité des décors répond à la chaleur des rencontres.`,
    en: `Our route takes us to the striking rock formations of Pedras Negras, then on to the unreal landscapes of the Morros Vermelhos desert.

Angola will remain a land of contrasts for us, where the vastness of the scenery answers the warmth of the people.`,
  },
  ganvie: {
    fr: `Ganvié, surnommée la « Venise d’Afrique », dont le nom signifie « nous sommes en paix ». Ce village lacustre est né de la volonté de ses habitants d’échapper aux razzias esclavagistes : sur le lac Nokoué, ils trouvaient un refuge inaccessible aux cavaliers.

Aujourd’hui, près de 45 000 personnes vivent toujours au rythme de l’eau. Elle est partout, mais elle n’est pas potable : les habitants rejoignent les forages en pirogue pour remplir leurs bidons.`,
    en: `Ganvié, nicknamed the “Venice of Africa”, whose name means “we are at peace”. This lake village was founded by people fleeing slave raids: on Lake Nokoué, they found a refuge the horsemen could not reach.

Today, some 45,000 people still live to the rhythm of the water. It is everywhere, yet none of it is drinkable: residents paddle out to the boreholes to fill their jerrycans.`,
  },
};

export function photoStory(slug: string, locale: string): string | null {
  const story = PHOTO_STORIES[slug];
  if (!story) return null;
  return locale === 'en' ? story.en : story.fr;
}
