#!/usr/bin/env bash
set -euo pipefail

echo "→ Checking Homebrew..."
command -v brew >/dev/null 2>&1 || {
  echo "Install Homebrew first: https://brew.sh"; exit 1;
}

echo "→ Installing mint..."
brew list mint >/dev/null 2>&1 || brew install mint

echo "→ Bootstrapping Swift tools..."
mint bootstrap --mintfile Tools/Mintfile

echo "→ Resolving Swift packages..."
xcodebuild -resolvePackageDependencies \
  -workspace MaltaCalculator.xcworkspace \
  -scheme MaltaCalculator

echo "✔ Bootstrap complete. Open MaltaCalculator.xcworkspace"
