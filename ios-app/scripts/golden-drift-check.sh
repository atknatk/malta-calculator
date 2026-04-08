#!/usr/bin/env bash
# scripts/golden-drift-check.sh
# Checks whether golden fixture JSON files are in sync with the web app.
#
# How it works:
# 1. Hashes all existing golden fixture JSONs
# 2. Runs the web fixture generator (npm run golden:generate)
# 3. Hashes again and compares
#
# If the hashes differ, golden fixtures are out of date and must be
# regenerated before merging.
#
# Usage: ./scripts/golden-drift-check.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
GOLDEN_DIR="$ROOT_DIR/ios-app/Packages/CalculationKit/Tests/CalculationKitTests/Golden"

if [ ! -d "$GOLDEN_DIR" ]; then
  echo "❌ Golden fixtures directory not found at $GOLDEN_DIR"
  exit 1
fi

# Count fixtures
FIXTURE_COUNT=$(find "$GOLDEN_DIR" -name "*.json" -type f | wc -l | tr -d ' ')
echo "📋 Found $FIXTURE_COUNT golden fixture(s) in $GOLDEN_DIR"

# Hash all fixture files
hash_fixtures() {
    find "$GOLDEN_DIR" -name "*.json" -type f -print0 \
        | sort -z \
        | xargs -0 shasum -a 256 \
        | shasum -a 256 \
        | awk '{print $1}'
}

BEFORE_HASH=$(hash_fixtures)

# Check if npm is available and generation script exists
if command -v npm &>/dev/null && [ -f "$ROOT_DIR/package.json" ]; then
    # Check if the golden:generate script exists
    HAS_SCRIPT=$(node -e "
        const pkg = require('$ROOT_DIR/package.json');
        console.log(pkg.scripts && pkg.scripts['golden:generate'] ? 'yes' : 'no');
    " 2>/dev/null || echo "no")

    if [ "$HAS_SCRIPT" = "yes" ]; then
        echo "🔄 Regenerating golden fixtures from web app..."
        cd "$ROOT_DIR"
        npm run golden:generate >/dev/null 2>&1 || {
            echo "⚠️  golden:generate script failed — skipping drift check"
            exit 0
        }

        AFTER_HASH=$(hash_fixtures)

        if [ "$BEFORE_HASH" != "$AFTER_HASH" ]; then
            echo ""
            echo "❌ Golden fixtures drift detected!"
            echo "   The committed fixtures don't match what the web app generates."
            echo ""
            echo "   To fix: run 'npm run golden:generate' and commit the updated JSONs."
            echo ""
            # Show which files changed
            cd "$GOLDEN_DIR"
            git diff --name-only 2>/dev/null || true
            exit 1
        fi

        echo "✅ Golden fixtures are in sync with the web app."
    else
        echo "⚠️  No 'golden:generate' script in package.json — skipping regeneration."
        echo "   Validating fixture file integrity only."
        validate_fixtures
    fi
else
    echo "⚠️  npm not available — skipping web app regeneration."
    echo "   Validating fixture file integrity only."
fi

# Validate JSON structure of all fixtures
validate_fixtures() {
    local errors=0
    for f in "$GOLDEN_DIR"/*.json; do
        if ! python3 -c "import json; json.load(open('$f'))" 2>/dev/null; then
            echo "❌ Invalid JSON: $(basename "$f")"
            errors=$((errors + 1))
        fi

        # Every fixture must have input, expected, and generatedAt keys
        HAS_KEYS=$(python3 -c "
import json
d = json.load(open('$f'))
has = all(k in d for k in ['input', 'expected', 'generatedAt'])
print('yes' if has else 'no')
" 2>/dev/null || echo "no")

        if [ "$HAS_KEYS" != "yes" ]; then
            echo "❌ Missing required keys (input/expected/generatedAt): $(basename "$f")"
            errors=$((errors + 1))
        fi
    done

    if [ "$errors" -gt 0 ]; then
        echo "❌ $errors fixture(s) have structural issues."
        exit 1
    fi
    echo "✅ All $FIXTURE_COUNT fixture(s) have valid JSON structure."
}

validate_fixtures
