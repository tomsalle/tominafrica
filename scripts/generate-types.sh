#!/usr/bin/env bash
#
# Régénère src/types/database.ts à partir du schéma Supabase distant.
# À lancer après chaque migration.
#
#   npm run gen:types
#
# Nécessite un jeton d'accès personnel Supabase :
#   https://supabase.com/dashboard/account/tokens
#   export SUPABASE_ACCESS_TOKEN=sbp_...

set -euo pipefail

PROJECT_REF="${SUPABASE_PROJECT_REF:-ydwlakmzqlvqetbevlwq}"

if [[ -z "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  echo "✗ SUPABASE_ACCESS_TOKEN n'est pas définie." >&2
  echo "  Crée un jeton sur https://supabase.com/dashboard/account/tokens" >&2
  echo "  puis : export SUPABASE_ACCESS_TOKEN=sbp_..." >&2
  exit 1
fi

echo "Génération des types depuis le projet ${PROJECT_REF}…"

npx --yes supabase@latest gen types typescript \
  --project-id "${PROJECT_REF}" \
  --schema public \
  > src/types/database.generated.ts

echo "✓ Écrit dans src/types/database.generated.ts"
echo
echo "  Compare-le avec src/types/database.ts et reporte les changements."
echo "  (database.ts contient en plus les alias applicatifs : PhotoWithOptions, SeriesWithCover…)"
