/**
 * Récits de photos tirés du livre « 1 mère, 1 fils, 1 rêve », pour les
 * photographies qu'il raconte explicitement. Utilisés seulement quand le
 * champ `photos.story` est vide en base : un récit saisi dans Supabase garde
 * toujours la priorité. Paragraphes séparés par une ligne vide.
 */
export const PHOTO_STORIES: Record<string, { fr: string; en: string }> = {
  'les-jumelles': {
    fr: `Sur la plage d’Agbodrafa, au Togo, où nous campons ce soir-là, ma mère croise une femme qui promène son chien : Sophie. Elle lui demande si elle accepterait de revenir le lendemain pour faire des photos. Sophie dit oui : « J’ai une sœur jumelle. Si tu veux, on peut venir demain matin. »

Le lendemain, une petite voix nous réveille. Nous ouvrons la tente : Sophie et sa sœur Ayawa sont là, au pied de notre échelle, vêtues de la même robe, avec un grand sourire. Je vais chercher notre petit miroir, qui traîne dans la voiture depuis le début de l’aventure, et j’ai l’idée d’aligner leurs deux visages pour n’en former plus qu’un.

Pendant quelques instants, les deux sœurs ne font plus qu’une. Une rencontre improvisée, un petit miroir oublié dans notre 4x4 et un peu de créativité auront suffi à créer une image que nous n’oublierons jamais.`,
    en: `On Agbodrafa beach in Togo, where we are camping that evening, my mother comes across a woman walking her dog: Sophie. She asks whether she would come back the next day for some photos. Sophie says yes: “I have a twin sister. If you like, we can come tomorrow morning.”

The next day, a little voice wakes us up. We open the tent: Sophie and her sister Ayawa are there at the foot of our ladder, wearing the same dress, with big smiles. I grab our little mirror, which has been rattling around the car since the start of the trip, and have the idea of lining up their two faces to make just one.

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
// Récits écrits par Charlotte (novembre 2026), à la première personne de
// l'auteur de la photo (champ photos.photographer) : Charlotte pour les
// siennes, Tom pour les trois qu'il a prises (les jumelles, le palmier,
// devant la fenêtre).

PHOTO_STORIES.habi = {
  fr: `En me baladant dans les petites rues d’Imsouane, je rencontre Habi, un Sénégalais qui se rend à son travail, un petit bar du port de pêche. Mes yeux se posent tout de suite sur sa belle casquette multicolore et sur son sourire communicatif.

Je lui propose de le photographier devant des murs de couleurs différentes. Le moment est rapide mais joyeux : son patron l’attend pour travailler.`,
  en: `Wandering through the little streets of Imsouane, I meet Habi, a Senegalese man on his way to work at a small bar in the fishing port. My eyes go straight to his beautiful multicoloured cap and his infectious smile.

I suggest photographing him in front of walls of different colours. The moment is quick but joyful: his boss is waiting for him to start work.`,
};

PHOTO_STORIES.samba = {
  fr: `C’était un soir d’août 2024, pendant les Jeux olympiques. Je rentrais chez moi à vélo, un peu triste, quand un mur coloré, baigné d’une belle lumière, a attiré mon regard. Un jeune garçon rentrait chez lui. Pendant un instant, j’ai tout oublié : j’avais l’impression d’être très loin.

« Je crois que des choses mystérieuses arrivent dans des endroits familiers. Il n’est pas toujours nécessaire d’aller à l’autre bout du monde. » — Saul Leiter

Si j’ai choisi de montrer cette image, c’est parce que, quelques jours plus tard, j’ai su que j’allais partir avec Tom. Elle résonne avec notre voyage.`,
  en: `It was an evening in August 2024, during the Olympic Games. I was cycling home, feeling a little sad, when a colourful wall bathed in beautiful light caught my eye. A young boy was on his way home. For a moment I forgot everything: I felt very far away.

“I believe that mysterious things happen in familiar places. We don’t always need to go to the other end of the world.” — Saul Leiter

I chose to show this image because, a few days later, I learned that I would be leaving with Tom. It echoes our journey.`,
};

PHOTO_STORIES.nene = {
  fr: `Après de longues heures de route, nous apercevons une magnifique rivière aux rochers ronds, comme dans Le Livre de la jungle. Des femmes y lavent leur linge, les enfants jouent dans l’eau. Ce bel endroit sera notre campement pour la nuit.

Tout l’après-midi, nous jouons avec les enfants. Ils restent jusqu’au soir à nous regarder installer la tente de toit et préparer le dîner : pour eux, c’est un vrai spectacle.

Puis Nènè, la grand-mère du village, vient chercher les enfants. Elle porte une magnifique robe verte et rouge, un turban assorti et de très beaux bijoux. Elle ne parle pas notre langue, mais son regard doux et affectueux nous dit qu’elle est bien avec nous.`,
  en: `After long hours on the road, we spot a magnificent river with round rocks, like something out of The Jungle Book. Women are doing their washing there and children are playing in the water. This beautiful spot will be our camp for the night.

All afternoon we play with the children. They stay until evening, watching us set up the roof tent and cook dinner: for them, it is quite a show.

Then Nènè, the village grandmother, comes to fetch the children. She is wearing a magnificent green and red dress, a matching turban and beautiful jewellery. She doesn’t speak our language, but her gentle, affectionate gaze tells us she is happy to be with us.`,
};

PHOTO_STORIES['les-maillots-rouges'] = {
  fr: `Sur l’île de Gorée, les matins sont magnifiques : les rues deviennent un décor de théâtre. Seuls les poules, les chats et les chiens circulent, et les oiseaux chantent. En marchant, impossible d’oublier ce qui s’est passé ici : Gorée est un lieu de mémoire de la traite atlantique, de l’esclavage et de ses violences.

Chaque matin, je passe devant la grande place de l’ancien hôpital militaire, où les brebis dorment encore. Des maillots de foot sèchent au soleil, mais il en manque un : peut-être qu’un enfant s’est endormi avec…`,
  en: `On Gorée Island, the mornings are magnificent: the streets become a theatre set. Only the hens, cats and dogs are out, and the birds are singing. As you walk, it is impossible to forget what happened here: Gorée is a place of remembrance of the Atlantic slave trade, of slavery and its violence.

Every morning, I walk past the large square of the old military hospital, where the sheep are still asleep. Football shirts are drying in the sun, but one is missing: perhaps a child fell asleep in it…`,
};

PHOTO_STORIES.aissata = {
  fr: `J’adore regarder le linge sécher au soleil. Chaque matin, Aïssata vient étendre le sien. Au début, je n’aperçois que ses jambes.

Je m’approche pour lui dire bonjour et lui demander son prénom. Elle est très timide, ses joues deviennent toutes rouges. J’ai eu envie de fixer ce moment intime.`,
  en: `I love watching laundry dry in the sun. Every morning, Aïssata comes to hang hers out. At first, all I can see are her legs.

I go over to say hello and ask her name. She is very shy, and her cheeks go bright red. I wanted to capture this intimate moment.`,
};

PHOTO_STORIES.ruben = {
  fr: `C’était en avril 2022, à Ivry-sur-Seine, près de Paris, dans un petit square aux murs colorés : si l’on ne regarde pas autour, on se croirait à Dakar ou sur l’île de Gorée. C’était pour un édito, avec une belle équipe : Ruben, le mannequin, Maëlle, mon assistante lumière, et Massi au stylisme et au maquillage.

Si je vous montre cette image, c’est parce qu’en la voyant, Tom m’a dit : « Maman, tu dois venir avec moi faire cette traversée ! »`,
  en: `It was April 2022, in Ivry-sur-Seine, near Paris, in a small square with colourful walls: if you don’t look around, you could be in Dakar or on Gorée Island. It was for an editorial shoot, with a lovely team: Ruben, the model, Maëlle, my lighting assistant, and Massi on styling and make-up.

I am showing you this image because, when Tom saw it, he said to me: “Mum, you have to come with me on this crossing!”`,
};

PHOTO_STORIES['l-attente'] = {
  fr: `On attend, on attend, on attend… Dix-huit heures à attendre le ferry ! Nous traversons la Gambie, un tout petit pays enclavé dans le Sénégal, ouvert sur l’océan.

Pendant tout ce temps, on regarde, on fait des rencontres, on prend des photos. Depuis ma fenêtre, j’ai vu défiler des centaines de personnes. Le décor, lui, ne bouge presque pas : le même taxi jaune, les mêmes sacs ficelés sur le toit, la même enseigne bleue. Ce sont les visages qui changent au fil des heures.`,
  en: `We wait, and wait, and wait… Eighteen hours waiting for the ferry! We are crossing The Gambia, a tiny country nestled inside Senegal and open to the ocean.

All that time, we watch, we meet people, we take photos. From my window, I watched hundreds of people go by. The scene itself barely moves: the same yellow taxi, the same bags tied to the roof, the same blue sign. It is the faces that change as the hours pass.`,
};

PHOTO_STORIES['tu-passais-par-la'] = {
  fr: `En haut d’une colline, au bord du fleuve Sassandra, se trouve une ancienne maison coloniale abandonnée, au-dessus d’un terrain de foot.

Comme très souvent, il y a des enfants aux alentours. Ce garçon était là, il se baladait dans la maison. Je l’ai suivi un peu, sans vraiment savoir ce que je cherchais. Puis il s’est arrêté à cette fenêtre.

En le voyant ainsi, dans cette maison abandonnée, j’ai ressenti beaucoup de tristesse et d’émotion. Il y avait quelque chose de bouleversant dans cette image, dans ce contraste entre l’enfant, la fenêtre et les traces du passé.

J’ai pris cette photo sans vouloir interrompre ce moment.`,
  en: `At the top of a hill on the banks of the Sassandra river stands an old abandoned colonial house, overlooking a football pitch.

As so often, there are children around. This boy was there, wandering through the house. I followed him for a while, without really knowing what I was looking for. Then he stopped at this window.

Seeing him like that, in this abandoned house, I felt a great deal of sadness and emotion. There was something deeply moving in this image, in the contrast between the child, the window and the traces of the past.

I took this photo without wanting to interrupt the moment.`,
};

// Photo « Sophie » (adresse /photo/ayawa conservée : QR code imprimé).
PHOTO_STORIES.ayawa = {
  fr: `Il est environ 18 h, la température baisse, le soleil décline. Sur la plage d’Agbodrafa, juste avant de rentrer sous la tente, je croise Sophie, l’une des jumelles. Elle promène son chien ; elle a l’air fragile.

Je me souviendrai toujours de son sourire. Le lendemain matin, elle reviendra avec sa sœur, Ayawa.`,
  en: `It is around 6 p.m., the temperature is dropping and the sun is going down. On Agbodrafa beach, just before turning in for the night, I come across Sophie, one of the twins. She is walking her dog; she seems fragile.

I will always remember her smile. The next morning, she will come back with her sister, Ayawa.`,
};

PHOTO_STORIES['yellow-cabine'] = {
  fr: `Un soir de mars, à Brazzaville. Nous campons sur le parking d’un club de tennis ouvert aux voyageurs, où nous faisons la connaissance de Sophie et Fabien, deux vétérinaires belges naturalistes qui sillonnent l’Afrique en 4x4 à la recherche des espèces les plus rares et menacées du continent.

Ce soir-là, ils nous proposent d’aller voir les fameux sapeurs, les rois de la sape. La nuit, Brazzaville est mouvementée, les rues sont pleines de monde et de bruit. Mieux vaut y aller en taxi, mais pas n’importe lequel. Le nôtre est décoré de haut en bas, mes yeux ne savent plus où donner de la tête : strass, fourrure sur le volant, petits bonshommes qui bougent devant, sur le côté, derrière… Le chauffeur est si fier de sa déco ! J’ai envie de tout toucher, comme une enfant. Pourquoi ne fait-on pas la même chose en France ?

À Brazzaville, les sapeurs sont des stars : la rue devient un podium permanent et le vêtement se pratique comme une religion. Les gens sont assis comme à un défilé de mode et, tout à coup, les sapeurs surgissent de nulle part, démarche nonchalante, looks incroyables.

Juste à côté, il y a cette petite cabane jaune qui vend des cartes Wi-Fi. J’observe ce jeune homme pendant quelques minutes : concentré sur son téléphone, il semble oublier l’euphorie autour des sapeurs. Il ne s’aperçoit même pas que je le photographie.`,
  en: `One evening in March, in Brazzaville. We are camping in the car park of a tennis club that welcomes travellers, where we meet Sophie and Fabien, two Belgian vets and naturalists who criss-cross Africa by 4x4 in search of the continent’s rarest and most endangered species.

That evening, they suggest we go and see the famous sapeurs, the kings of la sape. At night Brazzaville is lively, the streets full of people and noise. Better to go by taxi, but not just any taxi. Ours is decorated from top to bottom, and I don’t know where to look: rhinestones, fur on the steering wheel, little nodding figures in front, on the side, at the back… The driver is so proud of his decor! I want to touch everything, like a child. Why don’t we do the same in France?

In Brazzaville, the sapeurs are stars: the street becomes a permanent catwalk and clothing is practised like a religion. People sit as if at a fashion show and, all of a sudden, the sapeurs appear out of nowhere, with a nonchalant stride and incredible looks.

Right next door stands this little yellow hut selling Wi-Fi cards. I watch this young man for a few minutes: focused on his phone, he seems oblivious to the excitement around the sapeurs. He doesn’t even notice I am taking his picture.`,
};

// Photo « Le palmier » (prise par Tom).
PHOTO_STORIES['on-a-joue-ensemble'] = {
  fr: `La plage de Ménéké est un endroit sublime, l’une des plus belles plages de Côte d’Ivoire, à l’intérieur d’une réserve naturelle. Il n’y a absolument personne, seulement un petit hôtel et une chambre d’hôte fréquentés par des Européens.

Nous campons dans le jardin de Gus, un Italien, face à la mer. On ne peut pas imaginer mieux pour se remettre d’une journée difficile, d’autant que la voiture a failli brûler quelques heures plus tôt. Bref, c’est un repos bien mérité.

Comme d’habitude, une fois le campement installé, nous partons voir ce qu’il y a autour. Tout au bout de la plage, un village, des palmiers et une maison abandonnée. Des enfants jouent au ballon.

Je ne résiste pas longtemps à l’envie de jouer avec eux.`,
  en: `Ménéké beach is a sublime place, one of the most beautiful beaches in Côte d’Ivoire, inside a nature reserve. There is absolutely no one here, just a small hotel and a guesthouse frequented by Europeans.

We camp in the garden of Gus, an Italian, facing the sea. We couldn’t imagine a better place to recover from a hard day, especially as the car nearly caught fire a few hours earlier. In short, a well-earned rest.

As usual, once camp is set up, we go and see what’s around. At the far end of the beach: a village, palm trees and an abandoned house. Children are playing football.

I can’t resist joining in for long.`,
};

PHOTO_STORIES['amy-sow'] = {
  fr: `Après une nuit dans le désert, sans aucun bruit, sous un ciel étoilé, nous voici à Nouakchott, la capitale de la Mauritanie. Les routes et les nuages sont remplis de sable. On a l’impression d’être au bout du monde.

Quand je ne conduis pas, je prends le temps de regarder, comme si je prenais des photos avec mes yeux. Nos fenêtres sont toujours ouvertes. Nous croisons parfois des cyclistes, dont tout un groupe d’Allemands qui allaient jusqu’au Ghana ! Pour moi, ce sont eux, les vrais aventuriers.

À l’approche de la ville, il y a du monde partout, dans tous les sens, tout se mélange : les gens, les voitures, les charrettes tirées par des chevaux, les ânes… La poussière entre peu à peu dans la voiture, et nous finissons par ressembler, nous aussi, à des aventuriers. Pour les amoureux des premiers Star Wars, le décor est le même. Cette foule est à la fois stressante et excitante. Les femmes et les hommes, pour la plupart, sont très grands, avec de très beaux visages.

Nous restons deux nuits dans un camping au bord de la mer, non loin de l’atelier d’Amy Sow, que nous devons rencontrer. La première nuit, nous partageons le camping avec tout un groupe de touristes en autocar qui vont jusqu’au Sénégal. Le lendemain matin, petit déjeuner copieux : des œufs au plat et le fameux amlou, une pâte à tartiner à base d’huile d’argan, d’amandes torréfiées et de miel, sur du pain trouvé sur la route.

En fin de matinée, nous partons à la rencontre d’Amy. Artiste plasticienne née à Nouakchott, elle a fondé Art Gallé, une résidence d’artistes. Elle utilise la peinture, la photo et les installations pour dénoncer les violences faites aux femmes et aux enfants, et lutter contre elles. Amy est déjà grand-mère : son petit-fils de 3 ans, super mignon, est avec elle.

Elle nous fait visiter les lieux, puis nous installons ensemble le décor, avec un tissu en fond. Tom termine par une interview filmée. Nous nous revoyons le lendemain : elle nous montre deux fontaines d’eau surveillées. Pas simple de faire des images à ces endroits.

Nous n’avions plus envie de la quitter. Deux jours délicieux avec elle.`,
  en: `After a night in the desert, in total silence under a starry sky, here we are in Nouakchott, the capital of Mauritania. The roads and the clouds are full of sand. It feels like the end of the world.

When I’m not driving, I take the time to look, as if I were taking photos with my eyes. Our windows are always open. Now and then we pass cyclists, including a whole group of Germans riding all the way to Ghana! To me, they are the real adventurers.

As we approach the city, there are people everywhere, going in every direction, everything mixing together: people, cars, horse-drawn carts, donkeys… The dust slowly gets into the car, and we end up looking like adventurers ourselves. For lovers of the first Star Wars films, the setting is the same. The crowd is both stressful and exciting. Most of the women and men are very tall, with beautiful faces.

We spend two nights at a campsite by the sea, not far from the studio of Amy Sow, whom we are due to meet. On the first night, we share the campsite with a whole coachload of tourists heading to Senegal. The next morning, a hearty breakfast: fried eggs and the famous amlou, a spread made from argan oil, roasted almonds and honey, on bread picked up along the way.

Late in the morning, we go to meet Amy. A visual artist born in Nouakchott, she founded Art Gallé, an artists’ residency. She uses painting, photography and installations to denounce and fight violence against women and children. Amy is already a grandmother: her adorable three-year-old grandson is with her.

She shows us around, then we set up the scene together, with a piece of fabric as a backdrop. Tom finishes with a filmed interview. We meet again the next day: she shows us two guarded water fountains. Not an easy place to take pictures.

We didn’t want to leave her. Two wonderful days with her.`,
};

PHOTO_STORIES['la-foret-rose'] = {
  fr: `Après une nuit passée chez des moines, nous voilà sur les routes du Congo, au cœur d’une immense forêt tropicale. Nous avons franchi l’équateur ! Notre route nous mène sur l’Elephant Road, qui traverse une réserve exceptionnelle où vivent éléphants, gorilles, chimpanzés, et plein d’autres petits singes et d’oiseaux.

Nous avons la chance d’entendre et d’observer un groupe de chimpanzés sauvages au bord de la route. Deux d’entre eux traversent juste devant nous… Un moment absolument magique ! Leurs cris résonnent dans toute la forêt.

Le soir, nous installons notre bivouac au pied d’une antenne 4G, sans savoir qu’un autre groupe de chimpanzés a élu domicile tout près pour la nuit. Pleins d’espoir, nous nous levons aux premières lueurs du jour, mais ils ont déjà disparu. Ils ne sont même pas venus manger les fruits au pied de l’antenne : ils ont dû nous entendre arriver. Nous reprenons la route un peu déçus, mais tellement heureux d’avoir vécu ces moments.

Le soir suivant, nous campons près de la route, dans un renfoncement où l’on coupe des arbres. Au petit matin, Tom dort encore. Je descends l’échelle et je découvre le décor : nous sommes seuls, entourés d’arbres immenses, et une légère brume cache le deuxième rang. C’est si beau…

Je sors mon pied, mon appareil moyen format, et je mets une nouvelle pellicule. Je vérifie encore une fois que personne ne vient, ni homme ni animal. Et je prends le temps de regarder ces arbres gigantesques qui nous entourent.`,
  en: `After a night spent with monks, here we are on the roads of Congo, in the heart of an immense tropical forest. We have crossed the equator! Our route takes us along the Elephant Road, which runs through an exceptional reserve home to elephants, gorillas, chimpanzees and lots of other small monkeys and birds.

We are lucky enough to hear and watch a group of wild chimpanzees by the roadside. Two of them cross right in front of us… An absolutely magical moment! Their calls echo through the whole forest.

In the evening, we set up camp at the foot of a 4G mast, not knowing that another group of chimpanzees has settled nearby for the night. Full of hope, we get up at first light, but they are already gone. They didn’t even come to eat the fruit at the foot of the mast: they must have heard us arrive. We set off again a little disappointed, but so happy to have lived these moments.

The following evening, we camp near the road, in a clearing used for felling trees. At dawn, Tom is still asleep. I climb down the ladder and discover the scene: we are alone, surrounded by enormous trees, and a light mist hides the row behind. It is so beautiful…

I take out my tripod and my medium-format camera, and load a new roll of film. I check once more that no one is coming, neither man nor animal. And I take the time to look at the giant trees all around us.`,
};

PHOTO_STORIES.ekoue = {
  fr: `Nous passons quelques nuits sur le parking d’un petit hôtel tenu par un couple suisse et togolais. C’est ici que nous rencontrons Mégane et François, des Suisses qui traverseront le Nigeria avec nous. Quel bonheur de manger des spaghettis bolognaise et de prendre enfin une vraie douche !

Tôt le matin, réveillée par le coq, je descends l’échelle. Il est au pied de la voiture, fier et très content de m’avoir réveillée. Tom, lui, ne bouge pas d’un pouce… ce qui m’énerve encore plus !

Un petit garçon, Ekoué, balaie le sol avec de grandes branches. Il est sûrement levé depuis bien plus longtemps que moi. Je m’approche : il est adorable, il balaie tous les matins avant d’aller à l’école.

Je lui demande de se cacher derrière cette grande feuille, si immense qu’elle fait presque sa taille, et je le prends en photo.`,
  en: `We spend a few nights in the car park of a small hotel run by a Swiss and Togolese couple. This is where we meet Mégane and François, a Swiss couple who will cross Nigeria with us. What a joy to eat spaghetti bolognese and finally take a real shower!

Early in the morning, woken by the rooster, I climb down the ladder. There he is at the foot of the car, proud and very pleased to have woken me up. Tom, meanwhile, doesn’t move an inch… which annoys me even more!

A little boy, Ekoué, is sweeping the ground with big branches. He has surely been up much longer than I have. I go over: he is adorable, and he sweeps every morning before going to school.

I ask him to hide behind this huge leaf, so big it is almost his height, and I take his picture.`,
};

PHOTO_STORIES.blase = {
  fr: `Nous sommes sur la plage d’Agbodrafa, à côté d’un restaurant local. Tout un groupe s’y retrouve pour fêter les anniversaires : ce sont les natifs de janvier ! Quelle ambiance, tous les âges sont réunis. Et quelle bonne idée : chaque mois, ceux qui ont leur anniversaire se retrouvent ici.

Nous décidons de rester dormir là. Il se met à pleuvoir quelques minutes après notre arrivée, et nous nous abritons sous l’auvent du restaurant. La lumière est belle, elle fait ressortir la couleur de l’eau.

Tôt le matin, juste après la visite des jumelles, je rencontre Blase. Il s’occupe du restaurant avec sa mère, et d’un petit atelier où il fabrique des vêtements. Il cache ses ongles, qui sont vernis.

J’installe mon fond violet et nous sympathisons pendant que je le photographie. J’ai choisi l’image où l’on ne voit pas son visage ; les autres, je les garde pour moi.`,
  en: `We are on Agbodrafa beach, next to a local restaurant. A whole group gathers there to celebrate their birthdays: they are the ones born in January! What an atmosphere, with every age together. And what a lovely idea: every month, the people whose birthday it is meet up here.

We decide to stay the night. It starts to rain a few minutes after we arrive, and we take shelter under the restaurant’s awning. The light is beautiful, bringing out the colour of the water.

Early in the morning, just after the twins’ visit, I meet Blase. He runs the restaurant with his mother, as well as a small workshop where he makes clothes. He hides his nails, which are painted.

I set up my purple backdrop and we get to know each other while I photograph him. I chose the image where you can’t see his face; the others I keep for myself.`,
};

PHOTO_STORIES.yao = {
  fr: `Nous voici de retour chez le mécanicien. Cinq heures à attendre, sur un banc à l’ombre, sous une chaleur écrasante, entourés de vieux moteurs et de voitures qui servent de pièces détachées. Au loin, un homme frappe sur de la tôle.

Comme je trouve le temps long, je prends mon appareil et je pars faire un tour. C’est là que je rencontre Yao. Son visage, la couleur de son polo et celle du mur m’arrêtent. Je lui demande simplement si je peux le prendre en photo. Il éclate de rire.

Ses amis et des curieux nous regardent. Je lui demande d’être plus sérieux ; ce n’est pas facile. Mais ce visage grave, presque mélancolique, c’est celui que je garde.`,
  en: `Here we are, back at the mechanic’s. Five hours of waiting on a bench in the shade, in crushing heat, surrounded by old engines and cars used for spare parts. In the distance, a man is hammering on sheet metal.

As time drags on, I take my camera and go for a walk. That is when I meet Yao. His face, the colour of his polo shirt and of the wall stop me in my tracks. I simply ask if I can take his picture. He bursts out laughing.

His friends and a few curious onlookers watch us. I ask him to be more serious; it isn’t easy. But that grave, almost melancholy face is the one I keep.`,
};

PHOTO_STORIES.hacen = {
  fr: `Nous nous enfonçons de plus en plus dans le désert. La route est envahie par le sable, des chameaux nous suivent. Le ciel a une couleur étrange, la lumière est métallique. Il y a beaucoup de vent.

Au loin, des hommes s’affairent autour d’un vieux camion. On a envie de s’approcher.

Je remarque Hacen. Sa posture, sa démarche et sa chemise à carreaux blancs et verts attirent tout de suite mon regard. Le contraste avec le décor me donne envie de le photographier.`,
  en: `We head deeper and deeper into the desert. The road is swallowed by sand, and camels follow us. The sky is a strange colour, the light metallic. The wind is strong.

In the distance, some men are busy around an old truck. We feel like going closer.

I notice Hacen. His posture, the way he walks and his green and white checked shirt catch my eye straight away. The contrast with the landscape makes me want to photograph him.`,
};

PHOTO_STORIES.sirocco = {
  fr: `Sirocco, c’est le nom de ce vent qui nous a accompagnés du Maroc jusqu’au Sénégal. Il a voyagé avec nous tout au long de cette traversée.

Les nuages étaient souvent chargés de sable et, lorsque le soleil apparaissait, la lumière devenait étrange, presque irréelle. On avait l’impression d’être sur une autre planète. Tout est jaune, le ciel, le sable, la lumière… et on avance au milieu de tout ça.

Au milieu de cette immensité, une maisonnette de béton, un panneau solaire posé dans le sable et quelques bidons. Mais comment vit-on au cœur d’un désert où l’eau est si rare ?`,
  en: `Sirocco is the name of the wind that kept us company from Morocco all the way to Senegal. It travelled with us throughout the crossing.

The clouds were often heavy with sand and, whenever the sun came out, the light turned strange, almost unreal. It felt like being on another planet. Everything is yellow, the sky, the sand, the light… and we drive on through the middle of it all.

In the middle of this vastness: a small concrete house, a solar panel lying in the sand and a few jerrycans. But how do people live in the heart of a desert where water is so scarce?`,
};

PHOTO_STORIES.kemi = {
  fr: `Drabo est un village situé juste à côté d’un sanctuaire, un refuge qui accueille, soigne et protège les singes. Nous passons trois nuits sur le terrain d’une petite maison en construction, entourée d’une barrière.

Juste à côté se trouve un autre village, orange du sol jusqu’aux murs. Les enfants sortent des maisons pour venir nous voir, et nous jouons avec eux : foot, cache-cache…

J’ai demandé aux enfants de monter sur cette brique rouge, comme sur un socle. Kèmi portait une très belle robe taillée dans un tissu typique du Bénin, et des élastiques de toutes les couleurs, comme des bonbons !

J’aimerais y retourner pour faire une vraie série avec tous les enfants du village, et surtout pouvoir leur montrer les images.`,
  en: `Drabo is a village right next to a sanctuary, a refuge that takes in, cares for and protects monkeys. We spend three nights on the plot of a small house under construction, surrounded by a fence.

Right next to it is another village, orange from the ground to the walls. The children come out of the houses to see us, and we play with them: football, hide-and-seek…

I asked the children to stand on this red brick, as if on a pedestal. Kèmi was wearing a beautiful dress made from a typical Beninese fabric, and hair ties in every colour, like sweets!

I would love to go back and make a real series with all the children of the village, and above all show them the pictures.`,
};

PHOTO_STORIES.kodjo = {
  fr: `Nous arrivons en début d’après-midi, à la recherche d’un endroit pour dormir. Le meilleur se trouve, malheureusement, sur le parking de l’embarcadère de Ganvié.

Ganvié signifie « nous sommes en paix », « nous sommes sauvés ». Ses habitants ont fui la terre ferme à l’époque de la traite des esclaves pour s’installer sur le lac, et échapper à la capture et à la déportation aux quatre coins du monde. Plus nous avançons dans l’ouest du continent, plus nous mesurons les atrocités du passé. Elles ont marqué ces terres à vie. On ne peut pas oublier.

C’est un lieu de passage : il y a sans cesse du monde qui vient prendre le bateau. Je me précipite pour faire des photos, Tom aussi, mais ce n’est pas si évident : ici, les gens n’aiment pas trop être photographiés. Il faut le faire avec intelligence et bienveillance.

Puis c’est Kodjo qui est venu vers nous. Il s’est installé juste à côté de la voiture, au milieu des détritus qui, à mes yeux, faisaient presque office de fleurs. J’ai pris cette photo.`,
  en: `We arrive early in the afternoon, looking for somewhere to sleep. The best spot, unfortunately, is the car park of the Ganvié landing stage.

Ganvié means “we are at peace”, “we are saved”. Its people fled the mainland at the time of the slave trade to settle on the lake, escaping capture and deportation to the four corners of the world. The further we travel through the west of the continent, the more we grasp the atrocities of the past. They have marked these lands for ever. We cannot forget.

It is a place of passage: people are constantly coming through to catch the boat. I rush to take photos, and so does Tom, but it isn’t that easy: people here don’t really like being photographed. You have to do it with intelligence and kindness.

Then it was Kodjo who came over to us. He settled right next to the car, among the litter which, to my eyes, almost stood in for flowers. I took this photo.`,
};

PHOTO_STORIES['retour-du-marche'] = {
  fr: `C’est le début d’après-midi, le soleil est au zénith et tape très fort. Il faut trouver de l’ombre.

Juste à côté de l’arbre où nous nous abritons, plusieurs femmes se reposent. Curieuse, je vais les voir : elles sont épuisées par la chaleur. Elles reviennent du marché, c’est l’heure de la sieste, une scène typique de ces villages. Le bas des maisons est recouvert de terre orange, une terre qui s’infiltre partout.

J’aime les couleurs, les contrastes, et la posture de ces femmes.

Nous restons deux nuits ici, le temps d’aller à Lomé changer les plaquettes de frein et faire les papiers pour le Nigeria. Tom en profite pour se faire couper les cheveux par la propriétaire du bar.`,
  en: `It is early afternoon, the sun is at its height and beating down hard. We need to find some shade.

Right next to the tree where we are sheltering, several women are resting. Curious, I go over to them: they are exhausted by the heat. They are coming back from the market; it is siesta time, a typical scene in these villages. The bottom of the houses is covered in orange earth, an earth that gets in everywhere.

I love the colours, the contrasts, and the way these women are sitting.

We stay two nights here, long enough to go to Lomé to change the brake pads and sort out the paperwork for Nigeria. Tom makes the most of it to get his hair cut by the owner of the bar.`,
};

// La chorale de Luanda : un même moment, en deux photos (« Au-dessus de moi »
// = les-chanteuses, « Laisse-moi devant ! » = la-chorale ; adresses conservées).
PHOTO_STORIES['les-chanteuses'] = {
  fr: `L’Angola est l’un des pays qui nous a le plus surpris. Un samedi, nous nous promenons sur les quais de Luanda quand nous voyons un groupe d’enfants sur une passerelle, en train de chanter. Une chorale qui revenait d’un spectacle, peut-être ; nous ne l’avons jamais su.

Je commence à les photographier, Tom filme la scène. Les filles gesticulent, tout excitées de nous voir, trop mignonnes. Mon regard s’arrête sur cette petite fille au chemisier à col Claudine et au turban blanc liseré de bleu. Elles avaient toutes un regard très fort.`,
  en: `Angola is one of the countries that surprised us most. One Saturday, we are walking along the Luanda waterfront when we see a group of children on a footbridge, singing. A choir on its way back from a performance, perhaps; we never found out.

I start photographing them while Tom films the scene. The girls are waving their arms about, thrilled to see us, absolutely adorable. My eye stops on this little girl in a Peter Pan collar blouse and a white turban edged with blue. They all had such a strong gaze.`,
};

PHOTO_STORIES['la-chorale'] = {
  fr: `Les enfants s’approchent et, en quelques minutes, je me retrouve encerclée. Ils sont beaux ! Je leur demande de chanter. Je ne parle pas portugais, mais ils finissent par comprendre.

Ils se disputent : chacun veut être au premier rang ! Tout le monde veut être devant, personne ne veut rater ce moment. C’est beau, des voix d’enfants !

Je suis par terre, l’appareil en contre-plongée, et ils sont tout autour de moi. J’avoue que j’ai un peu peur qu’ils finissent tous par me tomber dessus ! Je ne veux pas que ce moment s’arrête.`,
  en: `The children come closer and, within a few minutes, I am surrounded. They are beautiful! I ask them to sing. I don’t speak Portuguese, but they end up understanding.

They squabble: everyone wants to be in the front row! They all want to be at the front, no one wants to miss this moment. Children’s voices are so beautiful!

I am down on the ground, shooting from below, and they are all around me. I admit I am a little afraid they will all end up falling on top of me! I don’t want this moment to end.`,
};

// Photo prise par Tom.
PHOTO_STORIES['devant-la-fenetre'] = {
  fr: `Nous sommes en haut d’une colline, dans une ancienne maison coloniale abandonnée, au-dessus du fleuve Sassandra. De là-haut, la vue s’étend sur l’embouchure du fleuve et sur l’océan Atlantique.

Sassandra a longtemps été un carrefour d’échanges et un port colonial actif ; c’est aujourd’hui le chef-lieu de la région du Gbôklé.

Ma mère et moi explorons la maison. Je filme deux enfants de dos qui regardent la mer, pendant qu’elle prend quelques images. À l’étage, je repère cette fenêtre : j’escalade un peu pour trouver mon point de vue, et je prends cette photo.

Cette maison abandonnée, cette fenêtre, ce regard vers l’extérieur m’ont profondément touché. On regarde la vue, sans oublier le passé.`,
  en: `We are at the top of a hill, in an old abandoned colonial house above the Sassandra river. From up here, the view stretches over the mouth of the river and the Atlantic Ocean.

Sassandra was long a crossroads of trade and a busy colonial port; today it is the capital of the Gbôklé region.

My mother and I explore the house. I film two children from behind, looking out to sea, while she takes a few pictures. Upstairs, I spot this window: I climb up a little to find my angle, and I take this photo.

This abandoned house, this window, this gaze turned outwards moved me deeply. We take in the view, without forgetting the past.`,
};

PHOTO_STORIES.kandji = {
  fr: `Nous passons trois nuits sur le terrain d’une petite maison en construction, près du sanctuaire des singes de Drabo. Elle servira à accueillir les visiteurs du sanctuaire. À notre arrivée, un grand monticule de terre trône au milieu du terrain.

Kandji et ses deux frères aident leur père à finir la maison. Avec un filet en ferraille, ils tamisent la terre pour en retirer les cailloux. Tom se met même à les aider, à la pelle. Moi, je trouve que ce filet ressemble à une méduse : il est beau.

Le lendemain, je leur demande s’ils sont d’accord pour faire une séance photo devant le mur brut de la maison. J’étais contente de sortir mon appareil et de prendre le temps !`,
  en: `We spend three nights on the plot of a small house under construction, near the Drabo monkey sanctuary. It will be used to welcome visitors to the sanctuary. When we arrive, a big mound of earth sits in the middle of the plot.

Kandji and his two brothers are helping their father finish the house. With a wire mesh net, they sieve the earth to remove the stones. Tom even starts helping them with a shovel. To me, the net looks like a jellyfish: it is beautiful.

The next day, I ask them whether they would agree to a photo shoot in front of the bare wall of the house. I was happy to take out my camera and take my time!`,
};

PHOTO_STORIES.sekou = {
  fr: `Sur cette photo, Sékou est presque une silhouette mystérieuse. Pourtant, derrière cette image, il y a une rencontre.

Juste avant les fêtes de Noël, Tom et moi nous sommes retrouvés bloqués dans la file d’attente des voitures pour embarquer sur le ferry. L’attente a duré très longtemps. J’ai bien sûr sorti mon appareil photo.

En face de nous, il y avait un jeune homme avec son cheval. Je regardais la scène, j’étais au spectacle. Il est venu me voir un moment, puis il est reparti. À mon tour, je suis allée vers lui et je lui ai montré les photos que j’avais prises. Il m’a raconté qu’il était étudiant et qu’il faisait un petit boulot pendant les vacances.

Quelques minutes plus tard, Sékou est arrivé. Il devait avoir 12 ou 13 ans, il portait un maillot de foot. Il est resté avec nous tout l’après-midi.

Il était curieux de savoir ce que nous faisions ici. On a beaucoup parlé. Il nous a dit qu’il se retrouvait souvent seul. J’ai pensé qu’il était peut-être là pour nous réclamer de l’argent, mais finalement, il ne l’a pas fait.

Nous lui avons demandé quel était son rêve. Il nous a répondu qu’il voulait devenir pilote. Mais sa famille étant pauvre, il pensait qu’il ne pourrait pas aller à l’école et réaliser son rêve.

Je suis sûre que si je lui avais proposé de continuer le voyage avec nous, il l’aurait fait sans hésiter.`,
  en: `In this photo, Sékou is almost a mysterious silhouette. Yet behind this image, there is an encounter.

Just before Christmas, Tom and I found ourselves stuck in the queue of cars waiting to board the ferry. The wait went on for a very long time. Of course, I took out my camera.

Opposite us stood a young man with his horse. I watched the scene as if at a show. He came over to me for a while, then left again. In turn, I went over to him and showed him the photos I had taken. He told me he was a student with a small holiday job.

A few minutes later, Sékou arrived. He must have been 12 or 13, and he was wearing a football shirt. He stayed with us all afternoon.

He was curious to know what we were doing there. We talked a lot. He told us he was often on his own. I thought he might be there to ask us for money, but in the end he never did.

We asked him what his dream was. He told us he wanted to become a pilot. But his family being poor, he thought he would not be able to go to school and make his dream come true.

I am sure that if I had offered him to carry on the journey with us, he would have come without a second thought.`,
};

PHOTO_STORIES['sur-la-colline'] = {
  fr: `Le 31 décembre. Nous campons sur une colline au-dessus d’un village, en compagnie de plusieurs voyageurs.

Des enfants viennent nous voir, dont un petit garçon avec une jolie chemise à rayures. Je suspends un tissu rouge derrière lui et je sors mon appareil. Le soleil commence à descendre, il fait bon. Il est très fier d’être photographié.

Nous regardons ensemble un beau coucher de soleil.

J’ai choisi de laisser son visage dans l’ombre : il ne reste que le rouge, la chemise et sa présence.`,
  en: `31 December. We are camping on a hill above a village, together with several other travellers.

Some children come to see us, among them a little boy in a lovely striped shirt. I hang a red cloth behind him and take out my camera. The sun is starting to go down, and the air is mild. He is very proud to be photographed.

Together, we watch a beautiful sunset.

I chose to leave his face in shadow: all that remains is the red, the shirt and his presence.`,
};

// Photo reçue le 24/11/2026 (Grand-Béréby).
PHOTO_STORIES['le-voisin-du-garagiste'] = {
  fr: `Pendant la révision de la voiture, à Grand-Béréby, j’ai eu le temps de faire connaissance avec les voisins : Yao, des femmes qui lavaient leur linge, et ce jeune homme, dont je ne connais pas le nom, qui attendait un ami.

Je le trouvais un peu mystérieux. Je lui ai demandé plusieurs fois de poser devant cette tôle rouge, jaune et bleue ; au début, il ne voulait pas. J’ai insisté un peu, et il a fini par accepter.

Le soleil commençait doucement à descendre : c’est le meilleur moment pour avoir une belle lumière.`,
  en: `While the car was being serviced in Grand-Béréby, I had time to get to know the neighbours: Yao, some women doing their washing, and this young man, whose name I never learned, who was waiting for a friend.

I found him a little mysterious. I asked him several times to pose in front of this red, yellow and blue sheet metal; at first he didn’t want to. I insisted a little, and in the end he agreed.

The sun was slowly starting to go down: the best time for beautiful light.`,
};

PHOTO_STORIES['le-foulard-rouge'] = {
  fr: `Dans notre interminable attente avant d’embarquer sur le ferry qui nous mène de l’autre côté du fleuve, des hommes marchent en tous sens autour de nous. Enfin, une femme passe.

Son foulard rouge et sa robe bleue s’accordent parfaitement avec le jaune et le vert de la maison derrière elle. Je l’ai vue arriver, je l’ai suivie du regard et j’ai pris très vite cette photo.`,
  en: `During our endless wait to board the ferry across the river, men are walking in every direction around us. At last, a woman walks by.

Her red headscarf and blue dress go perfectly with the yellow and green of the house behind her. I saw her coming, followed her with my eyes and took this photo very quickly.`,
};

export function photoStory(slug: string, locale: string): string | null {
  const story = PHOTO_STORIES[slug];
  if (!story) return null;
  return locale === 'en' ? story.en : story.fr;
}
