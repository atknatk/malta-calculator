# Malta Calculator iOS — Dark Factory Backlog

This backlog is consumed by the Ralph Wiggum loop in `scripts/ralph.sh`. Tasks
are ordered top-to-bottom; the loop picks the **first row whose Status is
`pending` and whose Governance is at or below the configured ceiling**
(`T3` by default — see `config.yaml` → `governance_ceiling`). Lower the
ceiling to `T1` for unattended overnight runs to avoid creating
review-required PRs while no human is available.

Each row points at an `intent.md` shim under `docs/specs/<layer>/` which
**symlinks** to the canonical task file in `ios-app-plan/tasks/`. The
`docs/specs/<layer>/` path layout is required so the dark-factory's
`extract_layer()` derives the correct layer name from the spec path.

Holdout scenarios live in `.dark-factory/holdouts/<layer>/` and are stripped
from the spec before the implementation agent ever reads it.

| Layer             | Pipeline                                                    |
| ----------------- | ----------------------------------------------------------- |
| `ios-setup`       | Xcode workspace, SPM packages, CI                           |
| `ios-design`      | DesignSystem tokens + components + Liquid Glass             |
| `ios-calculation` | CalculationKit motors + tax config loader                   |
| `ios-platform`    | App shell + navigation + deep links                         |
| `ios-feature`     | User-facing screens (salary, calculators, guides, settings) |
| `ios-data`        | SwiftData models + opt-in iCloud                            |
| `ios-quality`     | Test infra, accessibility audit, performance budget         |
| `ios-release`     | App Store Connect, fastlane, TestFlight, ASO                |

---

## Queue

| #   | Intent Spec                                                   | Layer       | Pipeline | Governance | Status  | Session |
| --- | ------------------------------------------------------------- | ----------- | -------- | ---------- | ------- | ------- |
| 06  | docs/specs/ios-feature/06-feature-salary.intent.md            | ios-feature | full     | T1         | pending |         |
| 07  | docs/specs/ios-feature/07-feature-calculators-hub.intent.md   | ios-feature | standard | T1         | pending |         |
| 08  | docs/specs/ios-feature/08-feature-calculator-detail.intent.md | ios-feature | full     | T2         | pending |         |
| 09  | docs/specs/ios-feature/09-feature-guides.intent.md            | ios-feature | standard | T1         | pending |         |
| 10  | docs/specs/ios-data/10-persistence.intent.md                  | ios-data    | full     | T2         | pending |         |
| 11  | docs/specs/ios-feature/11-share-export.intent.md              | ios-feature | standard | T1         | pending |         |
| 12  | docs/specs/ios-feature/12-settings-localization.intent.md     | ios-feature | standard | T1         | pending |         |
| 13  | docs/specs/ios-quality/13-testing.intent.md                   | ios-quality | full     | T1         | pending |         |
| 14  | docs/specs/ios-quality/14-accessibility.intent.md             | ios-quality | standard | T1         | pending |         |
| 15  | docs/specs/ios-quality/15-performance.intent.md               | ios-quality | standard | T2         | pending |         |
| 16  | docs/specs/ios-release/16-release.intent.md                   | ios-release | standard | T2         | pending |         |

## In Progress

_(Auto-managed by `ralph.sh` — rows move here while a session is running.)_

## Completed

| #   | Intent Spec                                             | Layer           | Pipeline | Governance | Status    | Session                       |
| --- | ------------------------------------------------------- | --------------- | -------- | ---------- | --------- | ----------------------------- |
| 01  | docs/specs/ios-setup/01-project-setup.intent.md         | ios-setup       | full     | T3         | completed | task-20260407-220734          |
| 02  | docs/specs/ios-design/02-design-system.intent.md        | ios-design      | full     | T1         | completed | task-20260408-092817-b893d942 |
| 03  | docs/specs/ios-calculation/03-calculation-kit.intent.md | ios-calculation | full     | T2         | completed | task-20260408-103836-cc95096a |
| 04  | docs/specs/ios-calculation/04-tax-config.intent.md      | ios-calculation | full     | T2         | completed | task-20260408-111756-d7736d68 |
| 05  | docs/specs/ios-platform/05-navigation.intent.md         | ios-platform    | standard | T1         | completed | task-20260408-121605-117b78ce |

## Rejected

_(Auto-managed — rows move here on T4 block or manual cancel.)_

## Exhausted

_(Auto-managed — rows move here after `max_attempts_per_spec` failures.)_
