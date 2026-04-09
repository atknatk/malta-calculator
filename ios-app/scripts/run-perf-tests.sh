#!/usr/bin/env bash
#
# run-perf-tests.sh — Run CalculationKit performance tests and report results.
#
# Usage:
#   ./scripts/run-perf-tests.sh [--ci]
#
# Exits non-zero if any performance test fails or exceeds its budget.
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
RESULT_BUNDLE="$PROJECT_DIR/PerfResults.xcresult"
CI_MODE="${1:-}"

# Clean previous results
rm -rf "$RESULT_BUNDLE"

echo "=== Running CalculationKit Performance Tests ==="

cd "$PROJECT_DIR"

# Run only performance tests from CalculationKit
xcodebuild test \
  -workspace MaltaCalculator.xcworkspace \
  -scheme MaltaCalculator \
  -destination 'platform=iOS Simulator,name=iPhone 16' \
  -only-testing:CalculationKitTests/CalculationPerformanceTests \
  -resultBundlePath "$RESULT_BUNDLE" \
  CODE_SIGN_IDENTITY=- \
  CODE_SIGNING_ALLOWED=NO \
  2>&1 | tail -20

EXIT_CODE=${PIPESTATUS[0]}

if [ "$EXIT_CODE" -ne 0 ]; then
  echo ""
  echo "❌ Performance tests FAILED (exit code $EXIT_CODE)"
  exit "$EXIT_CODE"
fi

echo ""
echo "✅ Performance tests PASSED"

# Extract metrics summary if xcresulttool is available
if command -v xcrun >/dev/null 2>&1; then
  echo ""
  echo "=== Performance Results ==="
  xcrun xcresulttool get --path "$RESULT_BUNDLE" --format json 2>/dev/null \
    | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print('Result bundle generated at: $RESULT_BUNDLE')
except Exception:
    print('Result bundle at: $RESULT_BUNDLE (parse skipped)')
" 2>/dev/null || echo "Result bundle at: $RESULT_BUNDLE"
fi

if [ "$CI_MODE" = "--ci" ]; then
  echo ""
  echo "CI mode: performance results saved to $RESULT_BUNDLE"
fi
