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

// --- Tirages de l'exposition (novembre 2026) -------------------------------

PHOTO_STORIES.benin = {
  fr: `Cet enfant, Kandji, porte sur la tête un filet qui lui sert à tamiser le sable destiné au béton. Nous avions garé le 4x4 dans la cour d’une petite maison en construction, près du sanctuaire des singes de Drabo, au Bénin. Chaque jour, Kandji préparait le sable des futures fondations.

Au fil des jours, nous avons commencé à discuter, et je me suis même mis à l’aider : je remplissais la brouette à la pelle, il tamisait le sable avec cette sorte de méduse posée sur sa tête.

Là où je voyais un outil de travail, Charlotte, elle, a vu un costume. Elle a demandé au propriétaire une petite pause pour faire quelques portraits devant le mur brut de la maison. Kandji, ravi de souffler un peu, s’est tout de suite pris au jeu.`,
  en: `This boy, Kandji, wears a net on his head that he uses to sieve the sand for concrete. We had parked the 4x4 in the yard of a small house under construction, near the Drabo monkey sanctuary in Benin. Every day, Kandji prepared the sand for the future foundations.

Over the days we started talking, and I even began to help him: I filled the wheelbarrow with a shovel while he sieved the sand with this jellyfish-like net on his head.

Where I saw a work tool, Charlotte saw a costume. She asked the owner for a short break to take a few portraits against the bare wall of the house. Kandji, happy to catch his breath, played along straight away.`,
};

PHOTO_STORIES['le-foulard-rouge'] = {
  fr: `Pour traverser la Gambie et franchir le fleuve, tout le monde nous conseille le ferry : « Vous gagnerez du temps. » Très mauvais choix.

Pendant plus de quinze heures, nous restons prisonniers d’une file de véhicules interminable. Chacun tente de passer devant les autres, les klaxons ne s’arrêtent jamais et la chaleur devient écrasante. En fin de journée, le dernier ferry part sans nous : nous dormons sur place, la tente dépliée au milieu des voitures.

Cette photo est née de cette attente : un taxi jaune chargé jusqu’au toit, et une passante au foulard rouge qui traverse le décor.`,
  en: `To cross The Gambia and its river, everyone tells us to take the ferry: “You’ll save time.” A very bad choice.

For more than fifteen hours we are stuck in an endless line of vehicles. Everyone tries to jump the queue, the horns never stop and the heat becomes overwhelming. At the end of the day, the last ferry leaves without us: we spend the night there, our tent unfolded among the cars.

This photo was born of that wait: a yellow taxi loaded to the roof, and a passer-by in a red headscarf crossing the scene.`,
};

PHOTO_STORIES['le-passant-au-bonnet-bleu'] = {
  fr: `Quinze heures d’attente dans la file du ferry, en Gambie. Lorsque les voitures s’immobilisent, Charlotte sort son appareil photo.

Le décor, lui, ne bouge presque pas : le même taxi jaune, les mêmes sacs ficelés sur le toit, la même enseigne bleue. Ce sont les visages qui changent au fil des heures. Charlotte en fait une série entière, prise depuis le même endroit.

Une façon de transformer une attente interminable en terrain de jeu photographique.`,
  en: `Fifteen hours waiting in the ferry queue in The Gambia. Whenever the cars come to a standstill, Charlotte takes out her camera.

The scene itself barely moves: the same yellow taxi, the same bags tied to the roof, the same blue sign. It is the faces that change as the hours go by. Charlotte turns it into a whole series, shot from the same spot.

A way of turning an endless wait into a photographic playground.`,
};

PHOTO_STORIES['la-maisonnette-dans-le-desert'] = {
  fr: `En entrant en Mauritanie, le paysage change d’un coup. Le désert semble ne jamais finir, et le vent soulève le sable en permanence, au point de tendre un voile jaune sur tout l’horizon.

Au milieu de cette immensité, une maisonnette de béton, un panneau solaire posé dans le sable et quelques bidons. Une question nous obsède dès les premiers jours : comment vit-on au cœur d’un désert où l’eau est si rare ?

La Mauritanie a été notre première vraie immersion dans l’un des fils rouges du voyage : l’accès à l’eau potable.`,
  en: `As we enter Mauritania, the landscape changes all at once. The desert seems endless, and the wind lifts the sand constantly, drawing a yellow veil across the whole horizon.

In the middle of this vastness: a small concrete house, a solar panel lying in the sand and a few jerrycans. One question haunts us from the very first days: how do people live in the heart of a desert where water is so scarce?

Mauritania was our first real immersion in one of the threads of this journey: access to drinking water.`,
};

PHOTO_STORIES.dsf9479 = {
  fr: `Mauritanie. Ici, chaque déplacement est une expédition, et les points d’eau dictent la vie de ceux qui habitent le désert.

Pour comprendre leur quotidien, nous partons à la rencontre de ceux qui y vivent. Malgré la barrière de la langue, les échanges nous permettent peu à peu de mieux comprendre leur vie.

Sur le seuil d’une maison de béton, à l’abri du vent et du sable, un homme se tient immobile.`,
  en: `Mauritania. Here, every journey is an expedition, and water points shape the lives of the people who live in the desert.

To understand their daily life, we set out to meet the people who live there. Despite the language barrier, our conversations slowly help us understand their lives better.

On the threshold of a concrete house, sheltered from the wind and the sand, a man stands still.`,
};

PHOTO_STORIES.habi = {
  fr: `Quelques jours après avoir débarqué au Maroc, nous rejoignons Imsouane, un petit village bercé par les vagues, connu des surfeurs du monde entier.

Ici, nous ralentissons le rythme et profitons de nos premiers couchers de soleil africains. C’est là que nous croisons Habi, barman et pêcheur du village, avec sa casquette en patchwork de tissus.

L’aventure ne fait que commencer : devant nous s’étendent encore des milliers de kilomètres.`,
  en: `A few days after landing in Morocco, we reach Imsouane, a small village rocked by the waves and known to surfers the world over.

Here, we slow down and enjoy our first African sunsets. It is there that we meet Habi, the village’s barman and fisherman, in his patchwork fabric cap.

The adventure is only beginning: thousands of kilometres still lie ahead of us.`,
};

PHOTO_STORIES.nene = {
  fr: `Guinée, début janvier. La chaleur devient étouffante et, sans climatisation, nous roulons les fenêtres ouvertes à la recherche d’une rivière.

Au bord de la rivière de Guéckédou, des femmes et des enfants sont déjà là, entre lessive et jeux d’eau. Nous les rejoignons, et ce qui devait être une simple pause se transforme en un moment de partage, puis en une séance photo improvisée.

C’est là que Charlotte photographie Nènè. La Guinée nous aura appris une chose essentielle : parfois, ralentir est la meilleure façon d’aller à la rencontre des autres.`,
  en: `Guinea, early January. The heat becomes stifling and, with no air conditioning, we drive with the windows down, looking for a river.

On the banks of the Guéckédou river, women and children are already there, doing the washing and playing in the water. We join them, and what was meant to be a short break turns into a moment of sharing, then an impromptu photo shoot.

That is where Charlotte photographs Nènè. Guinea taught us something essential: sometimes, slowing down is the best way to meet others.`,
};

PHOTO_STORIES.aissata = {
  fr: `L’île de Gorée, au large de Dakar. Un lieu marqué par l’histoire de l’esclavage, où nous avons pourtant fait l’une des rencontres les plus inspirantes du voyage.

Dans une ruelle de sable, Aïssata s’est assise sur une borne de pierre, le visage caché par un grand tissu patchwork étendu au soleil.

On ne voit d’elle que ses jambes et ses sandales : le reste, c’est le tissu qui le raconte.`,
  en: `Gorée Island, off Dakar. A place marked by the history of slavery, yet where we had one of the most inspiring encounters of the trip.

In a sandy alley, Aïssata has sat down on a stone post, her face hidden by a large patchwork cloth spread out in the sun.

All we see of her are her legs and her sandals: the cloth tells the rest.`,
};

PHOTO_STORIES['les-maillots-rouges'] = {
  fr: `Île de Gorée, Sénégal. Une rangée de maillots rouges sèche sur un fil, devant une maison à la façade usée, avec des moutons couchés au premier plan.

C’est l’image qui résume le mieux l’idée de notre exposition : le linge étendu au milieu du décor. Pendant six mois, nous avons nous aussi fait sécher notre linge sur des fils attachés à ce qui nous entourait.

À l’exposition, dix chasubles rouges étendues sur un fil lui font écho.`,
  en: `Gorée Island, Senegal. A row of red jerseys dries on a line in front of a house with a weathered façade, with sheep lying in the foreground.

It is the image that best sums up the idea of our exhibition: laundry hung out in the middle of the scenery. For six months, we too dried our clothes on lines tied to whatever was around us.

At the exhibition, ten red bibs hung on a line echo it.`,
};

// La chorale de Luanda (livre, chapitre « L'Angola nous surprend », 13 mars
// 2025) : un même moment, raconté sous deux angles.
PHOTO_STORIES['la-chorale'] = {
  fr: `L’Angola est l’un des pays qui nous a le plus surpris. Peu présent dans les itinéraires de voyage, il nous offre pourtant certains des moments les plus forts de notre traversée.

À Luanda, une chorale d’enfants nous interpelle dans la rue.`,
  en: `Angola is one of the countries that surprised us most. Rarely on travel itineraries, it gave us some of the strongest moments of our crossing.

In Luanda, a children’s choir calls out to us in the street.`,
};

PHOTO_STORIES['les-choristes'] = {
  fr: `En quelques instants, les voix s’élèvent et un concert improvisé prend vie au milieu de Luanda.

Un moment simple, sincère, qui nous rappelle une nouvelle fois la place qu’occupe la musique dans de nombreuses cultures africaines.`,
  en: `Within moments the voices rise and an impromptu concert comes to life in the middle of Luanda.

A simple, sincere moment that reminds us once again of the place music holds in so many African cultures.`,
};

export function photoStory(slug: string, locale: string): string | null {
  const story = PHOTO_STORIES[slug];
  if (!story) return null;
  return locale === 'en' ? story.en : story.fr;
}
