#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

CONFIG_PATH="ios-app/Packages/CalculationKit/Sources/CalculationKit/Resources/tax-config-2020-2026.json"

# Generate fresh JSON into temp
TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT

npx tsx scripts/export-tax-config.ts --output "$TMP"

# Compare with committed (ignore generatedAt timestamp)
COMMITTED=$(jq 'del(.generatedAt)' "$CONFIG_PATH")
FRESH=$(jq 'del(.generatedAt)' "$TMP")

if [ "$COMMITTED" != "$FRESH" ]; then
  echo "Tax config drift detected!"
  echo "Run 'npm run export:tax-config' and commit the result."
  diff <(echo "$COMMITTED") <(echo "$FRESH") || true
  exit 1
fi

echo "Tax config in sync"
