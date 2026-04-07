# Malta Calculator iOS — Failure Patterns (Guardrails)

This file is fed back to every implementation agent as the "Guardrails" section
of its prompt. Patterns are appended automatically by `record-failure.sh` when
a task is blocked, but the entries below are **seeded manually** to short-cut
common iOS Swift mistakes that we have already learned about from the web app
port and Apple's HIG.

> Read these carefully. Repeating a documented mistake will block your PR.

---

## Financial accuracy

### F-01 — Never use Double for money

**Why:** Floating-point binary cannot represent decimal cents exactly. A €0.01
rounding error in cumulative tax calculation snowballs across 12 months and
ships wrong numbers to users.

**How to apply:**

- All monetary properties on inputs/outputs are `Money` (typealias for
  `Decimal`).
- JSON Decodable layer must use `Decimal` directly, never `Double` then cast.
- Avoid `Double(decimal)` round-trips inside calculator math. If you need
  exponentiation (e.g. mortgage PMT formula), use `pow(_:_:)` on `Decimal`
  via `NSDecimalNumber` or implement manual repeated multiplication.

### F-02 — Tax brackets must come from MaltaTaxConfig

**Why:** Hard-coding `0.15`, `0.25`, `0.35` makes tax-year updates a
bug-prone refactor. Malta updates brackets each year.

**How to apply:**

- All bracket lookups go through `TaxConfigStore` → `MaltaTaxConfig`.
- A new tax year only requires shipping a new JSON file via the export
  pipeline; no Swift code changes.
- Golden fixtures live alongside the config and are versioned.

### F-03 — Cumulative monthly tax mirrors the web app exactly

**Why:** Malta uses a cumulative system: each month's withholding depends on
the YTD totals. Off-by-one or "calendar year vs payroll year" mismatches
ship wrong payslips.

**How to apply:**

- Port `src/utils/salary-calculator.ts` line-by-line. When a TS function
  uses `reduce`, do not "optimize" it into a single Swift expression — keep
  the per-month iteration so bug compatibility is preserved.
- Every salary scenario from the web app must have a golden fixture and
  pass to ±€0.01.

---

## Swift / SwiftUI discipline

### S-01 — No force unwrap in production code

**Why:** A force unwrap that fires in production crashes the app on a user's
device. There is essentially never a justification outside of test fixtures.

**How to apply:**

- Use `guard let`, `if let`, or `??` with a sensible default.
- For `Bundle.main.url(forResource:withExtension:)` lookups, use the loader
  helper which throws a typed error.
- Test code MAY use `try!` and `!` on fixture loaders — production code
  must not.

### S-02 — Use @Observable, not ObservableObject

**Why:** ADR-005 mandates the Observation framework (iOS 17+). Mixing
`@Published` with `@Observable` produces inconsistent reactivity and double
re-renders.

**How to apply:**

- ViewModels are `@Observable @MainActor final class`.
- Views consume them via plain `let viewModel: SalaryViewModel` (not
  `@StateObject` or `@ObservedObject`).
- The owning view that creates a ViewModel uses `@State`, not `@StateObject`.

### S-03 — Liquid Glass needs an iOS 18 fallback path

**Why:** Calling `glassEffect()` on iOS 18 crashes (or no-ops with a warning
in current betas). Forgetting the fallback means TestFlight users on iOS 18
see a broken layout.

**How to apply:**

- Only call `glassEffect()` from inside `DesignSystem.liquidGlass()`.
- That modifier MUST contain `if #available(iOS 26.0, *)` and a
  `.regularMaterial` else-branch.
- The else-branch MUST also check
  `@Environment(\.accessibilityReduceTransparency)` and collapse to opaque
  `DSColor.surface` when on.

### S-04 — print() is forbidden, use Logger

**Why:** `print` writes to stdout which is invisible in TestFlight builds and
pollutes Console.app. `Logger` integrates with Instruments and is filterable.

**How to apply:**

- Define `private let log = Logger(subsystem: "com.maltacalculator.app",
category: "...")` per file.
- Use `log.debug`, `log.info`, `log.error` with privacy markers
  (`\(value, privacy: .public)`).

---

## Design System discipline

### D-01 — No magic numbers in feature code

**Why:** Inline `padding(16)` and `cornerRadius(12)` defeat the purpose of
having a token system. They make global visual changes a search-and-replace
chore.

**How to apply:**

- Use `DSSpacing.md` instead of `16`.
- Use `DSRadius.lg` instead of `12`.
- Use `DSMotion.standard` instead of `.spring(response: 0.3, dampingFraction: 0.8)`.

### D-02 — Color tokens, not literals

**Why:** A redesign that changes `maltaGold` should be one file edit. Inline
`Color(hex: "C97D0A")` makes that impossible.

**How to apply:**

- Always `DSColor.maltaGold`, never `Color(hex:)` or `Color(red:green:blue:)`
  in feature code.
- The DesignSystem package itself is the only place that defines colors
  from raw values.

### D-03 — Snapshot tests run for light + dark + AX5

**Why:** Visual regressions in dark mode or large Dynamic Type only show up
in screenshots. Single-mode snapshots miss them.

**How to apply:**

- Every public DS component has snapshot tests under
  `DesignSystem/Tests/DesignSystemTests/Snapshots/`.
- Test matrix includes at minimum: `.light`, `.dark`, and AX5 size category.
- `record: true` MUST be `false` on commits — re-recording requires a
  deliberate visual change documented in the PR body.

---

## Accessibility

### A-01 — Icon-only buttons need accessibilityLabel

**Why:** A `Button { Image(systemName: "square.and.arrow.up") }` reads as
"square and arrow up button" to VoiceOver, which is meaningless.

**How to apply:**

- Always chain `.accessibilityLabel("Share")` and
  `.accessibilityHint("Share this calculation as an image")`.
- Or use `Label("Share", systemImage: "square.and.arrow.up")` and let
  SwiftUI emit the label automatically.

### A-02 — Currency display needs accessibilityValue

**Why:** "€14,976.50" reads as "euro fourteen comma nine seven six point
five zero" to VoiceOver. That's hostile.

**How to apply:**

- Add `.accessibilityValue("14,976 euros and 50 cents")` (or use
  `MeasurementFormatter` / `NumberFormatter` with `.spellOut` style for
  the accessible value).

### A-03 — Animations check Reduce Motion

**Why:** Vestibular disorders are real; Reduce Motion is non-decorative.

**How to apply:**

- Read `@Environment(\.accessibilityReduceMotion) private var reduceMotion`.
- Wrap `withAnimation`, `.contentTransition(.numericText())`, and any
  `PhaseAnimator` in a conditional that collapses to instant when on.

---

## Localization

### L-01 — All user-visible strings come from String Catalog

**Why:** Even though v1 is English-only, future locales (Maltese, Italian)
should be a translation job, not a refactor.

**How to apply:**

- `Text("salary.netPay.title")` not `Text("Net Pay")`.
- All keys live in `Localizable.xcstrings` and are organized by feature.
- Plurals use the catalog's plural variants, not Swift `if count == 1`.

### L-02 — Currency formatting uses Locale.current

**Why:** Hard-coding "€" prefixes ignores locale-specific separators
("€1.000,00" in Italian vs "€1,000.00" in English).

**How to apply:**

- `value.formatted(.currency(code: "EUR").locale(.current))`.
- Or `NumberFormatter` with `numberStyle = .currency`.

---

## Persistence

### P-01 — CloudKit is opt-in, default OFF

**Why:** ADR-013. Users must consent before data leaves device. Silent
iCloud uploads are a privacy violation.

**How to apply:**

- The `ModelContainer` only enables CloudKit when
  `userPreferences.syncWithICloud == true`.
- Default value of that preference is `false`.
- Toggling it ON requires the `ICloudOnboardingSheet` flow.

### P-02 — SwiftData schemas are versioned from day one

**Why:** Adding versioning later is much harder than starting with it. v1.1
will need a schema migration.

**How to apply:**

- `Schema(versionedSchema: MaltaCalculatorSchemaV1.self, migrationPlan:
MaltaCalculatorMigrationPlan.self)` — even if the migration plan is
  empty for v1.

---

## Build / CI

### B-01 — Treat warnings as errors in Release

**Why:** A "warning" in Swift is usually a real bug (unused variable,
unhandled error). Letting them slip means production has them.

**How to apply:**

- Project build settings: `SWIFT_TREAT_WARNINGS_AS_ERRORS = YES` for the
  Release configuration. Debug can keep them as warnings for ergonomics.

### B-02 — Tests run on every PR via GitHub Actions

**Why:** Local "I tested it on simulator" doesn't catch CI-only failures
(missing fixtures, env-dependent paths).

**How to apply:**

- `.github/workflows/ios.yml` runs `xcodebuild test` against the project's
  `MaltaCalculator-Package` scheme on every PR.
- The workflow uses `macos-15` and Xcode 26 (set via `xcode-select`).

---

## Auto-Recorded Patterns Below

_(record-failure.sh appends new patterns here as they happen.)_

---
