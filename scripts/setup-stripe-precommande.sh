#!/bin/bash

# Script de configuration Stripe pour la précommande du livre
# Usage: STRIPE_API_KEY="sk_live_xxxx" bash scripts/setup-stripe-precommande.sh

if [ -z "$STRIPE_API_KEY" ]; then
  echo "❌ Erreur: STRIPE_API_KEY non définie"
  echo "Usage: STRIPE_API_KEY='sk_live_xxxx' bash scripts/setup-stripe-precommande.sh"
  exit 1
fi

PRODUCT_NAME="Précommande - 1 Mère, 1 Fils, 1 Rêve"
PRODUCT_DESC="Livre photographique du voyage Paris → Cape Town. Tirage limité à 120 exemplaires."

echo "🚀 Création du produit Stripe..."

# Créer le product
PRODUCT=$(curl -s https://api.stripe.com/v1/products \
  -H "Authorization: Bearer $STRIPE_API_KEY" \
  -d "name=$PRODUCT_NAME" \
  -d "description=$PRODUCT_DESC" \
  -d "type=service")

PRODUCT_ID=$(echo $PRODUCT | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -z "$PRODUCT_ID" ]; then
  echo "❌ Erreur lors de la création du produit"
  echo "$PRODUCT"
  exit 1
fi

echo "✅ Produit créé: $PRODUCT_ID"

# Créer les prices
declare -A PRICES=(
  ["early-bird"]="35:Early Bird"
  ["standard"]="40:Le Livre"
  ["postcard"]="50:Livre + Cartes"
  ["duo"]="75:Pack Duo"
  ["support"]="90:Pack Soutien"
)

declare -A PRICE_IDS

for key in "${!PRICES[@]}"; do
  IFS=':' read -r amount label <<< "${PRICES[$key]}"

  echo "  📌 Création: $label ($amount€)..."

  PRICE=$(curl -s https://api.stripe.com/v1/prices \
    -H "Authorization: Bearer $STRIPE_API_KEY" \
    -d "product=$PRODUCT_ID" \
    -d "unit_amount=$((amount * 100))" \
    -d "currency=eur" \
    -d "metadata[tier_id]=$key" \
    -d "metadata[label]=$label")

  PRICE_ID=$(echo $PRICE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

  if [ -z "$PRICE_ID" ]; then
    echo "  ❌ Erreur: $label"
    echo "$PRICE"
    exit 1
  fi

  PRICE_IDS[$key]=$PRICE_ID
  echo "  ✅ $PRICE_ID"
done

# Générer le .env.local
echo ""
echo "📝 Mise à jour du .env.local..."

# Backup
if [ -f .env.local ]; then
  cp .env.local .env.local.backup
  echo "  💾 Backup: .env.local.backup"
fi

# Ajouter les variables
{
  echo ""
  echo "# Précommande du livre - Stripe"
  echo "STRIPE_PRICE_PRECOMMANDE_EARLY_BIRD=${PRICE_IDS['early-bird']}"
  echo "STRIPE_PRICE_PRECOMMANDE_STANDARD=${PRICE_IDS['standard']}"
  echo "STRIPE_PRICE_PRECOMMANDE_POSTCARD=${PRICE_IDS['postcard']}"
  echo "STRIPE_PRICE_PRECOMMANDE_DUO=${PRICE_IDS['duo']}"
  echo "STRIPE_PRICE_PRECOMMANDE_SUPPORT=${PRICE_IDS['support']}"
} >> .env.local

echo "  ✅ Variables ajoutées"

# Afficher le résumé
echo ""
echo "✨ Configuration complète!"
echo ""
echo "Résumé:"
echo "  Produit ID: $PRODUCT_ID"
for key in "${!PRICE_IDS[@]}"; do
  echo "  ${PRICES[$key]}: ${PRICE_IDS[$key]}"
done
echo ""
echo "📋 À faire maintenant:"
echo "  1. Configurer le webhook Stripe:"
echo "     Event: checkout.session.completed"
echo "     Endpoint: https://tominafrica.com/api/webhooks/stripe"
echo ""
echo "  2. Redémarrer le serveur dev:"
echo "     npm run dev"
echo ""
echo "  3. Tester la précommande:"
echo "     https://localhost:3000/precommande-livre"
