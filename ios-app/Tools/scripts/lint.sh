#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../.."

echo "→ SwiftLint..."
swiftlint lint --config Tools/.swiftlint.yml --strict

echo "→ SwiftFormat (dry run)..."
swiftformat --lint --config Tools/.swiftformat .

echo "✔ Lint passed"
