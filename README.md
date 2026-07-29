# Tom in Africa

Site portfolio et boutique de tirages photographiques. Next.js 16 (App Router),
Supabase, Stripe Checkout, déployé sur Vercel.

Chaque photographie a sa page produit construite autour de quatre blocs :
l'image en grand format, la carte du lieu de prise de vue, le récit, et l'achat.

---

## Démarrage

```bash
npm install
cp .env.example .env.local   # puis renseigne les valeurs manquantes
npm run dev
```

Le site tourne sur http://localhost:3000.

### Variables d'environnement

| Variable | Requise | Rôle |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | oui | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | oui | Clé publishable (publique, soumise à la RLS) |
| `NEXT_PUBLIC_SITE_URL` | oui | URL absolue du site (Open Graph, redirections Stripe, sitemap) |
| `SUPABASE_SERVICE_ROLE_KEY` | pour l'import et le webhook | **Secrète.** Contourne la RLS |
| `STRIPE_SECRET_KEY` | pour le paiement | Sans elle, le site fonctionne, le paiement est désactivé |
| `STRIPE_WEBHOOK_SECRET` | pour le paiement | Vérification de signature du webhook |

Les deux premières sont indispensables au build : sans elles, `npm run build`
échoue immédiatement avec un message explicite (`src/lib/env.ts`) plutôt que de
produire un site cassé.

---

## Architecture

```
src/
├── app/
│   ├── page.tsx                    Accueil : une section plein écran par série
│   ├── series/[slug]/              Galerie d'une série
│   ├── photo/[slug]/               ★ Page produit (photo · carte · récit · achat)
│   ├── a-propos/  panier/  commande/
│   ├── (legal)/                    Mentions légales, CGV, confidentialité
│   └── api/checkout/  api/webhooks/stripe/
├── components/
│   ├── photo/                      PhotoViewer · PhotoMap · PhotoStory · PurchasePanel
│   ├── gallery/  home/  cart/  layout/  ui/
├── lib/
│   ├── supabase/                   server (lecture, RLS) · admin (service role)
│   ├── queries/                    toutes les lectures de la base
│   ├── stripe/  cart/  images.ts  format.ts  env.ts
└── types/database.ts

supabase/migrations/                Schéma versionné (source de vérité)
supabase/seed.sql                   Données de démonstration
scripts/import-photos.ts            Import des photos depuis un dossier local
```

---

## Base de données

Quatre migrations dans `supabase/migrations/`, déjà appliquées au projet
`ydwlakmzqlvqetbevlwq` :

- **`0001_catalog`** — `series`, `photos`, `print_options`
- **`0002_commerce`** — `customers`, `orders`, `order_items` + numérotation des éditions
- **`0003_rls`** — Row Level Security
- **`0004_storage`** — buckets `photos` (public) et `masters` (privé)

Deux principes à ne pas perdre de vue :

**Les prix sont en centimes entiers**, jamais en nombres à virgule — même unité
que Stripe, aucune erreur d'arrondi possible.

**`order_items` fige un instantané** (titre, libellé, prix unitaire) au moment de
l'achat. Changer un prix ou renommer une photo dans deux ans ne modifie pas les
commandes passées ; c'est une obligation comptable autant qu'une sécurité.

### Sécurité

Le catalogue est lisible publiquement, mais **uniquement ce qui est publié** :
dépublier une série masque instantanément toutes ses photos.

`customers`, `orders` et `order_items` ont la RLS activée **sans aucune policy**.
En Postgres, cela signifie : tout est refusé. Seule la clé service role — utilisée
côté serveur, dans le webhook Stripe — y accède. Aucune donnée client ne peut
fuiter depuis un navigateur.

---

## Importer des photos

```bash
npx tsx scripts/import-photos.ts ~/Desktop/africa-screens --serie le-grand-silence --dry-run
npx tsx scripts/import-photos.ts ~/Desktop/africa-screens --serie le-grand-silence
```

Pour chaque image, le script lit l'EXIF (**les coordonnées GPS remplissent
automatiquement la carte**), génère les dérivés AVIF en 480 / 960 / 1600 / 2400 px,
produit une miniature floue, téléverse dans le bucket public et enregistre la
ligne en base. Il est idempotent : le relancer met à jour au lieu de dupliquer.

Les photos arrivent **en brouillon**. Relis titres, récits et coordonnées, puis
passe `published` à `true`.

### Fournir le contenu éditorial

À côté de `deadvlei.jpg`, un fichier `deadvlei.txt` :

```
Titre: Deadvlei, à l'aube
Lieu: Deadvlei, Sossusvlei, Namibie
Date: 2024-06-14
Legende: Acacias morts depuis neuf cents ans
Zoom: 11
---
Il faut partir de Sesriem à quatre heures du matin pour être dans la cuvette
au premier soleil.

Ce que les photographies ne disent jamais, c'est que Deadvlei est minuscule.
```

Tout ce qui suit `---` est le récit ; les paragraphes se séparent par une ligne vide.

### Options utiles

| Option | Effet |
|---|---|
| `--dry-run` | N'écrit rien, montre ce qui serait fait |
| `--publier` | Publie immédiatement au lieu de mettre en brouillon |
| `--with-master` | Téléverse aussi l'original dans le bucket privé |

### À propos des masters

Le plan gratuit Supabase offre 1 Go de stockage. Les dérivés web pèsent ~2 Mo par
photo (plusieurs centaines tiennent sans problème), mais les originaux en pèsent
30 à 80. Garde-les sur ton disque avec une sauvegarde externe, et n'utilise
`--with-master` qu'après être passé au plan Pro (100 Go) ou vers Cloudflare R2.

---

## Images

Les dérivés sont générés **une fois à l'import**, pas à la volée. Un loader
`next/image` personnalisé (`src/lib/image-loader.ts`) choisit le fichier
pré-généré correspondant à la largeur demandée : on garde srcset, lazy loading et
placeholder flou, sans consommer un seul crédit de transformation Vercel, et le
CDN Supabase sert directement.

Le master n'est jamais servi au navigateur. Un dérivé 2400 px suffit largement à
l'écran et reste inexploitable en tirage grand format — c'est bien plus efficace
qu'un clic droit désactivé, qui n'arrête personne et gêne les visiteurs légitimes.

---

## Paiement

**Stripe Checkout**, page hébergée par Stripe : conformité PCI en SAQ-A, aucune
donnée de carte ne transite par ce serveur. Collecte d'adresse et frais de port
par zone inclus nativement, ainsi que Apple Pay, Google Pay et Link.

Le panier vit dans le navigateur et ne contient **que des identifiants et des
quantités**. Prix, libellés et disponibilités sont systématiquement relus en base
côté serveur avant de créer la session (`src/app/api/checkout/route.ts`) : un
panier trafiqué ne peut pas changer le montant facturé.

Une commande naît **uniquement dans le webhook**, jamais sur la page de succès —
le client peut fermer son navigateur avant la redirection. `stripe_checkout_session_id`
est unique en base, donc un rejeu de webhook ne crée pas de doublon.

### Tester en local

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# copie le whsec_... dans STRIPE_WEBHOOK_SECRET
```

Carte de test : `4242 4242 4242 4242`, date future, CVC quelconque.

---

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript sans émission |
| `npm run import:photos` | Import de photos |
| `npm run gen:types` | Régénère les types depuis Supabase |

---

## Reste à faire

- Renseigner les `[À COMPLÉTER]` des pages légales (identité, SIRET, TVA,
  médiateur de la consommation, transporteur) — **obligatoire avant la première vente**
- Ajuster les frais de port réels dans `src/lib/stripe/server.ts`
- E-mails transactionnels (confirmation, expédition)
- Interface d'administration pour publier sans passer par le script
