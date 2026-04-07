# Malta Calculator iOS — Dark Factory Governance

## Governance Tiers

| Tier              | Risk Score | Holdout | Satisfaction | Action                                 |
| ----------------- | ---------- | ------- | ------------ | -------------------------------------- |
| **T0: Auto-Ship** | < 15       | Pass    | >= 80        | Auto-merge                             |
| **T1: Auto-PR**   | 15-40      | Pass    | >= 75        | PR + auto-approve once CI is green     |
| **T2: Review-PR** | 40-60      | Pass    | >= 70        | PR + 1 human review required           |
| **T3: Gated**     | > 60       | Any     | Any          | PR + 2 reviews + iOS architect signoff |
| **T4: Blocked**   | Any        | Fail    | < 50         | Pipeline halts, alert sent             |

The Ralph loop processes tasks up to the configured `governance_ceiling`
(`T2`). Anything heavier waits for explicit human approval.

## iOS-Specific Risk Posture

Risk scoring is intentionally aggressive on three axes:

1. **Financial accuracy** — anything touching `Decimal`, tax brackets, SSC,
   COLA, or golden fixtures is treated as high risk. A regression here ships
   wrong numbers to users; world-class quality is non-negotiable.
2. **Platform/iOS 26 features** — Liquid Glass, `MeshGradient`, SwiftData
   migrations, and CloudKit sync each add risk because they require careful
   `#available` branching and manual on-device verification.
3. **Release surface** — Info.plist, entitlements, signing, PrivacyInfo, and
   fastlane changes are escalated because they affect TestFlight and App
   Store submission.

See `config.yaml > risk_factors` for the full list and weights.

## Override Rules

- **Emergency override** — humans can ship anything by adding the
  `override:emergency` label to a PR. The override is logged in
  `failure-patterns.md` for postmortem.
- **Holdout skip** — only allowed when no holdout scenarios exist for the
  affected layer. The holdout-validator emits an explicit "no scenarios"
  result instead of silently passing.
- **Night-mode ceiling** — overnight runs (`/dark-factory:factory start`
  with no `--monitor`) cap at T1 to avoid creating review-PRs while no
  human is available. Daylight runs lift the ceiling to T2.

## Escalation Path

1. `pipeline-doctor` attempts auto-fix (max 2 retries per session).
2. If the fix fails, the task is put back to `pending` (counts toward
   `max_attempts_per_spec`).
3. After 3 attempts the spec is marked `exhausted` and an alert is fired.
4. Humans review the session artifacts under
   `.dark-factory/sessions/<session-id>/` and either fix manually or split
   the spec into smaller pieces.

## Hard Gates That Always Block (T4)

These are non-negotiable and trip an immediate block regardless of score:

- Build does not produce a runnable iOS simulator binary
- `swift build` / `xcodebuild test` exits non-zero
- SwiftLint reports any error (warnings allowed only with justification)
- Any calculator unit test asserts on `Double` for monetary values
- Any view contains hard-coded user-facing strings (must use String Catalog)
- Liquid Glass code missing `#available(iOS 26.0, *)` branch
- Force unwrap `!` introduced outside of `@IBOutlet` or test fixtures
- Public API in `CalculationKit` or `DesignSystem` missing `///` doc comment
- New SPM dependency added without a matching ADR in `ios-app-plan/`

## Per-Layer Ownership

| Layer             | Plan Source                                       | Primary Holdouts            |
| ----------------- | ------------------------------------------------- | --------------------------- |
| `ios-setup`       | `tasks/01-project-setup.md`                       | `holdouts/ios-setup/`       |
| `ios-design`      | `tasks/02-design-system.md`                       | `holdouts/ios-design/`      |
| `ios-calculation` | `tasks/03-calculation-kit.md`, `04-tax-config.md` | `holdouts/ios-calculation/` |
| `ios-platform`    | `tasks/05-navigation.md`                          | `holdouts/ios-feature/`     |
| `ios-feature`     | `tasks/06-12-*.md`                                | `holdouts/ios-feature/`     |
| `ios-data`        | `tasks/10-persistence.md`                         | `holdouts/ios-data/`        |
| `ios-quality`     | `tasks/13-15-*.md`                                | `holdouts/ios-quality/`     |
| `ios-release`     | `tasks/16-release.md`                             | `holdouts/ios-release/`     |
