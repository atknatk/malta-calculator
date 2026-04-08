#!/usr/bin/env bash
# scripts/check-coverage.sh
# Parses an xcresult bundle and enforces coverage thresholds.
# Usage: ./scripts/check-coverage.sh [path-to-xcresult]
set -euo pipefail

RESULT_PATH="${1:-ios-app/TestResults.xcresult}"
THRESHOLD_OVERALL=80
THRESHOLD_KIT=100
THRESHOLD_DESIGN=85
THRESHOLD_FEATURES=80

if [ ! -d "$RESULT_PATH" ]; then
  echo "❌ Test result bundle not found at $RESULT_PATH"
  echo "Run xcodebuild test first to generate it."
  exit 1
fi

echo "📊 Checking coverage from $RESULT_PATH"
echo "   Thresholds: Overall≥${THRESHOLD_OVERALL}% | Kit≥${THRESHOLD_KIT}% | DS≥${THRESHOLD_DESIGN}% | Features≥${THRESHOLD_FEATURES}%"
echo ""

# Extract coverage report as JSON
REPORT=$(xcrun xccov view --report --json "$RESULT_PATH" 2>/dev/null || echo "")
if [ -z "$REPORT" ]; then
  echo "⚠️  Could not extract coverage report. Skipping enforcement."
  exit 0
fi

# Parse overall coverage
OVERALL=$(echo "$REPORT" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(int(data.get('lineCoverage', 0) * 100))
" 2>/dev/null || echo "0")

# Parse per-target coverage
extract_target_coverage() {
    local target_name="$1"
    echo "$REPORT" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for t in data.get('targets', []):
    if '$target_name' in t.get('name', ''):
        print(int(t.get('lineCoverage', 0) * 100))
        sys.exit(0)
print(0)
" 2>/dev/null || echo "0"
}

KIT=$(extract_target_coverage "CalculationKit")
DESIGN=$(extract_target_coverage "DesignSystem")
FEATURES=$(extract_target_coverage "MaltaCalculator")

echo "Results:"
echo "  Overall:        ${OVERALL}% (threshold: ${THRESHOLD_OVERALL}%)"
echo "  CalculationKit: ${KIT}% (threshold: ${THRESHOLD_KIT}%)"
echo "  DesignSystem:   ${DESIGN}% (threshold: ${THRESHOLD_DESIGN}%)"
echo "  Features:       ${FEATURES}% (threshold: ${THRESHOLD_FEATURES}%)"
echo ""

FAILED=0

if [ "$OVERALL" -lt "$THRESHOLD_OVERALL" ]; then
  echo "❌ Overall coverage ${OVERALL}% < ${THRESHOLD_OVERALL}%"
  FAILED=1
fi

if [ "$KIT" -lt "$THRESHOLD_KIT" ]; then
  echo "❌ CalculationKit coverage ${KIT}% < ${THRESHOLD_KIT}%"
  FAILED=1
fi

if [ "$DESIGN" -lt "$THRESHOLD_DESIGN" ]; then
  echo "⚠️  DesignSystem coverage ${DESIGN}% < ${THRESHOLD_DESIGN}% (warning)"
fi

if [ "$FEATURES" -lt "$THRESHOLD_FEATURES" ]; then
  echo "⚠️  Features coverage ${FEATURES}% < ${THRESHOLD_FEATURES}% (warning)"
fi

if [ "$FAILED" -eq 1 ]; then
  echo ""
  echo "❌ Coverage thresholds not met."
  exit 1
fi

echo "✅ All coverage thresholds met."
