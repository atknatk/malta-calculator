#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../.."

swiftformat --config Tools/.swiftformat .
echo "✔ Formatted"
