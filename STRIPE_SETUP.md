# Configuration Stripe - Précommande du Livre

Ce guide complet vous aide à configurer Stripe pour la précommande du livre "1 Mère, 1 Fils, 1 Rêve".

## 🔑 Configuration Initiale

### 1. Obtenir votre clé API Stripe

1. Allez sur [dashboard.stripe.com](https://dashboard.stripe.com)
2. Connectez-vous à votre compte
3. Cliquez sur "Développeurs" → "Clés API"
4. Copiez votre **clé secrète** (commence par `sk_`)

### 2. Définir les variables d'environnement

Créez ou éditez le fichier `.env.local` à la racine du projet:

```bash
# Clés Stripe
STRIPE_API_KEY="sk_live_xxx..." # Votre clé secrète (sk_live_ pour live, sk_test_ pour test)
STRIPE_PUBLIC_KEY="pk_live_xxx..." # Votre clé publique (pk_live_ ou pk_test_)
STRIPE_WEBHOOK_SECRET="whsec_xxx..." # À obtenir après la configuration du webhook

# URL de votre site (pour les URLs de redirection après paiement)
NEXT_PUBLIC_SITE_URL="https://tominafrica.com" # Ou http://localhost:3000 en développement
```

## 📦 Étape 1: Créer les Produits et Prix

Exécutez le script de setup dans votre terminal:

```bash
cd /Users/tomsalle/Documents/tominafrica
STRIPE_API_KEY="sk_live_xxx..." bash scripts/setup-stripe-precommande.sh
```

**Ce script va automatiquement:**
- ✅ Créer le produit "Précommande - 1 Mère, 1 Fils, 1 Rêve" dans Stripe
- ✅ Créer les 5 prix (Early Bird 35€, Standard 40€, Postcard 50€, Duo 75€, Support 90€)
- ✅ Ajouter les variables `STRIPE_PRICE_PRECOMMANDE_*` à votre `.env.local`

## 🔗 Étape 2: Configurer le Webhook

Le webhook permet à votre site de recevoir les notifications quand une commande est complétée.

### 2.1 Créer le endpoint du webhook

1. Allez sur [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Cliquez sur "Ajouter un endpoint"
3. Entrez l'URL du webhook:
   - **Développement local**: `http://localhost:3000/api/webhooks/stripe`
   - **Production**: `https://tominafrica.com/api/webhooks/stripe`
4. Sélectionnez les événements à recevoir:
   - ✅ `checkout.session.completed` (commande complétée)
   - ✅ `checkout.session.expired` (panier expiré)
   - ✅ `charge.refunded` (remboursement reçu)
5. Cliquez "Ajouter endpoint"

### 2.2 Obtenir le webhook signing secret

1. Dans la liste des webhooks, cliquez sur celui que vous venez de créer
2. Copiez le "Signing secret" (commence par `whsec_`)
3. Ajoutez-le à votre `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET="whsec_xxx..."
   ```

## 🚀 Étape 3: Tester Localement

### 3.1 Démarrer le serveur dev

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

### 3.2 Accéder à la page de précommande

Ouvrez: `http://localhost:3000/precommande-livre`

### 3.3 Tester un paiement

1. Cliquez sur un tier pour le sélectionner
2. Ajustez la quantité si vous le souhaitez
3. Cliquez "Commander maintenant"
4. Vous êtes redirigé vers Stripe Checkout

**En mode test** (avec `sk_test_`), utilisez ces cartes:
- **Succès**: `4242 4242 4242 4242`
- **Déclinaison**: `4000 0000 0000 0002`
- Expiration: n'importe quelle date future (ex: `12/34`)
- CVC: n'importe quel 3 chiffres

### 3.4 Tester le webhook localement

Pour tester le webhook en local, vous pouvez utiliser `stripe listen` (nécessite la CLI Stripe):

```bash
# Installer la CLI Stripe (si ce n'est pas fait)
brew install stripe/stripe-cli/stripe

# Écouter les événements depuis Stripe
stripe listen --api-key sk_test_... --events checkout.session.completed,checkout.session.expired,charge.refunded

# Dans un autre terminal, exécuter des tests
stripe trigger checkout.session.completed
```

## 📋 Fichiers Créés/Modifiés

| Fichier | Rôle |
|---------|------|
| `src/app/precommande-livre/page.tsx` | Page de précommande avec UI harmonisée |
| `src/app/api/precommande/route.ts` | API pour créer les sessions Stripe |
| `src/app/api/webhooks/stripe/route.ts` | Webhook pour recevoir les événements Stripe |
| `scripts/setup-stripe-precommande.sh` | Script d'automatisation pour créer produits/prix |
| `.env.local` | Variables d'environnement (créé/édité par le setup) |

## 🔒 Sécurité - Recommandations

- ✅ **Clé API**: Gardez `STRIPE_API_KEY` et `STRIPE_WEBHOOK_SECRET` dans `.env.local` (jamais en git)
- ✅ **Clé publique**: `STRIPE_PUBLIC_KEY` est sûre en public (utilisée dans le navigateur)
- ✅ **Validation**: L'API `/api/precommande` valide les tiers avant de créer une session
- ✅ **Webhook**: Signé cryptographiquement avec le secret du webhook

## 🐛 Dépannage

### "STRIPE_PRICE_PRECOMMANDE_* manquant"
→ Assurez-vous d'avoir exécuté le script `setup-stripe-precommande.sh`

### "Erreur 401 unauthorized" lors du setup
→ Vérifiez que `STRIPE_API_KEY` commence par `sk_live_` ou `sk_test_`

### Webhook ne reçoit pas les événements
1. Vérifiez que l'URL du webhook est publiquement accessible
2. Vérifiez dans Stripe Dashboard → Webhooks → Logs que les requêtes arrivent
3. Si erreurs 400, vérifiez que `STRIPE_WEBHOOK_SECRET` est correct

### Paiement réussit mais pas de notification
- En développement, utilisez `stripe listen` pour simuler les webhooks
- En production, Stripe enverra les requêtes automatiquement

## 📧 Prochaines Étapes

Le webhook reçoit actuellement les événements mais ne les traite pas (TODOs dans `src/app/api/webhooks/stripe/route.ts`). Pour les futures étapes:

- [ ] Créer les commandes en base de données
- [ ] Envoyer email de confirmation au client
- [ ] Envoyer notification admin
- [ ] Générer/envoyer la facture
- [ ] Tracker l'expédition (via votre système pictoonline.com)

## 🎯 Checklist de Validation (Production)

Avant de déployer en production:

- [ ] Vous avez une clé Stripe **`sk_live_`** (pas `sk_test_`)
- [ ] `STRIPE_PUBLIC_KEY` commence par `pk_live_`
- [ ] L'URL du webhook est `https://tominafrica.com/api/webhooks/stripe`
- [ ] `STRIPE_WEBHOOK_SECRET` commence par `whsec_`
- [ ] Vous avez un certifikat SSL/HTTPS (obligatoire pour Stripe)
- [ ] Vous avez testé un vrai paiement avec une vraie carte de test Stripe
- [ ] Les URLs de redirection sont configurées sur tominafrica.com
- [ ] Le webhook reçoit les événements (vérifiez les logs dans Stripe Dashboard)

## 📞 Support Stripe

- Documentation: [stripe.com/docs](https://stripe.com/docs)
- Contact: [stripe.com/support](https://stripe.com/support)
