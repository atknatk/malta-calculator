# Night Shift — Autonomous iOS Build Pipeline

This is the operator runbook for running the **Dark Factory** day and night
against the iOS app plan in [`tasks/`](tasks/). The pipeline reads the 17
detailed task files, picks the next pending task, codes it on a feature
branch, validates it against hidden holdout scenarios, scores it for
satisfaction, and opens a PR.

You hit "go" once. It works while you sleep.

---

## TL;DR

```bash
# Daylight run — process up to 10 tasks over 8 hours, ceiling T2 (auto-PR)
/dark-factory:factory start 10 8

# Overnight run — same, but with tmux monitoring so you can peek in the morning
/dark-factory:factory start --monitor 10 12

# Single task (e.g. test the loop end-to-end)
/dark-factory:factory run ios-app-plan/tasks/01-project-setup.md

# Status / dashboard
/dark-factory:factory status
/dark-factory:dashboard

# Stop gracefully (finishes current task)
/dark-factory:factory stop
```

---

## What it does

The Ralph Wiggum loop in `dark-factory` reads
[`.dark-factory/backlog.md`](../.dark-factory/backlog.md) — a 17-row table
where each row points at one of the spec files in [`tasks/`](tasks/). For
each iteration it:

1. **Selects the next pending task** whose Governance tier is at or below
   the ceiling configured in
   [`.dark-factory/config.yaml`](../.dark-factory/config.yaml) (`T2` by
   default — daylight; `T1` for overnight `--monitor` runs to avoid
   creating review-required PRs while you're asleep).
2. **Loads the spec** from `ios-app-plan/tasks/NN-name.md` and strips any
   `## Holdout Scenarios` heading (the implementation agent must never see
   the hidden behavioural tests).
3. **Loads the guardrails** from
   [`.dark-factory/failure-patterns.md`](../.dark-factory/failure-patterns.md)
   so the agent learns from past mistakes (Decimal-only money, Liquid Glass
   fallback, MVVM discipline, etc.).
4. **Spawns `claude -p`** with the spec + guardrails + the custom prompt
   from [`.dark-factory/impl-prompt.md`](../.dark-factory/impl-prompt.md).
   The agent gets up to 75 minutes and a $15 budget per task.
5. **Runs holdout validation** independently — three runs, two-of-three
   must score >= 90 against the YAML scenarios in
   [`.dark-factory/holdouts/`](../.dark-factory/holdouts/).
6. **Runs the satisfaction judge** (two-pass adversarial scoring across 5
   dimensions: completeness, correctness, code quality, test quality, doc
   quality).
7. **Computes the governance tier** based on risk + holdout + satisfaction.
8. **Ships** based on the tier:
   - T0: auto-merge to main
   - T1: open PR, auto-merge once CI is green
   - T2: open PR, label `needs-review` for human review
   - T3: open PR, label `architecture-review`, two reviews required
   - T4: blocked, alert sent, task back to pending for retry
9. **Records the outcome** in the backlog (Status column moves to
   `completed` / `pending` / `exhausted`) and updates
   `failure-patterns.md` if it failed.
10. **Picks the next task** and repeats until: max iterations, max
    duration, 3 consecutive failures, or a `.stop-signal` file appears.

---

## Quality bar

The bar is **production-grade, world-class**. The hidden holdouts in
`.dark-factory/holdouts/` enforce, at minimum:

| Layer             | Holdouts                                                                                            |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| `ios-setup`       | Workspace, SPM packages, bundle ID, deployment target, CI, lint config                              |
| `ios-design`      | DSColor/DSSpacing/DSFont/DSMotion tokens; Liquid Glass + iOS 18 fallback; snapshot coverage         |
| `ios-calculation` | Decimal-only money; golden parity ±€0.01 vs web app; explicit rounding                              |
| `ios-feature`     | Accessibility (labels, hints, reduce-motion); localization (catalog only); MVVM discipline          |
| `ios-data`        | SwiftData versioning; CloudKit opt-in default OFF; bounded fetches                                  |
| `ios-quality`     | SwiftLint clean, SwiftFormat clean, 80%+ CalculationKit coverage, zero build warnings, perf budgets |
| `ios-release`     | PrivacyInfo manifest, App Store metadata, fastlane release lane                                     |

Anti-patterns that automatically block a PR:

- `Double` or `Float` for monetary values
- `print(...)` in production code
- Force unwrap `!` outside of `@IBOutlet` or test fixtures
- `Color(hex:)` / `Color(red:green:blue:)` in feature code
- `ObservableObject` / `@Published` / `@StateObject` (use `@Observable`)
- Hard-coded user-visible English strings (must use String Catalog)
- Unguarded `glassEffect()` calls (must go through `liquidGlass()` modifier)
- `MeshGradient(` without an `#available` or fallback branch
- `syncWithICloud = true` as a default
- TODO/FIXME without a linked issue number

See [`.dark-factory/failure-patterns.md`](../.dark-factory/failure-patterns.md)
for the full list with rationale.

---

## How to launch the loop

### Prerequisites (one-time)

```bash
# Plugin already installed via the everva marketplace
/plugin marketplace add everva/claude-plugins
/plugin install dark-factory@everva
/reload-plugins

# Verify
/dark-factory:factory status

# Tooling on disk
brew install jq mint
mint install realm/SwiftLint nicklockwood/SwiftFormat
gh auth login   # for PR creation; optional but strongly recommended
```

### First run — single task to validate the pipeline

```bash
# Run only Task 01 (project bootstrap) — fastest way to verify the loop works
/dark-factory:factory run ios-app-plan/tasks/01-project-setup.md
```

This walks through the full pipeline (impl → holdout × 3 → satisfaction →
governance → PR) for one task and creates a session under
`.dark-factory/sessions/task-YYYYMMDD-HHMMSS-<hash>/`. Inspect that session:

```bash
/dark-factory:factory validate <session-id>
```

### Daylight run

```bash
# 10 tasks max, 8 hour wall clock, ceiling T2 (allows review-PRs)
/dark-factory:factory start 10 8
```

Use this when you're around and willing to review T2 PRs as they appear.

### Overnight run

```bash
# 12 hours, 10 tasks, with tmux live monitoring
/dark-factory:factory start --monitor 10 12
```

Open a second terminal and `tmux attach -t dark-factory` if you want to
peek. The pipeline auto-stops if it hits 3 consecutive failures (the
circuit breaker), runs out of tasks, or hits the wall clock.

For maximum safety overnight, lower the ceiling so only auto-merge eligible
tasks ship without review:

```bash
# Edit .dark-factory/config.yaml temporarily:
governance_ceiling: "T1"
```

### Stop the loop

```bash
/dark-factory:factory stop
# This creates .dark-factory/.stop-signal — the loop checks before each iteration
```

The current task finishes cleanly; the loop exits at the next checkpoint.

---

## Reading the dashboard

```bash
/dark-factory:dashboard
```

Shows: tasks completed, in progress, blocked, exhausted; per-tier merge
counts; average satisfaction score; current rate-limit budget; circuit
breaker state.

```bash
/dark-factory:dashboard --json --days 7
```

Machine-readable, last 7 days. Useful if you want to graph progress.

---

## Triage when something goes wrong

### A task is `blocked`

1. Read the session log:
   `cat .dark-factory/sessions/<session-id>/run.log`
2. Read the implementation result:
   `cat .dark-factory/sessions/<session-id>/implementation-result.txt`
3. Read the holdout outcome:
   `cat .dark-factory/sessions/<session-id>/holdout-result.json`
4. Read the satisfaction judge output:
   `cat .dark-factory/sessions/<session-id>/satisfaction-result.json`
5. Read the new failure pattern recorded under
   `.dark-factory/failure-patterns.md` — that's what the next iteration's
   agent will see.
6. If the spec is too big, **split it** into smaller intent files and add
   them to the backlog at higher priority. The detailed task files in
   `tasks/` are the source of truth, but you can break them into a sequence
   like `06a-feature-salary-viewmodel.md`, `06b-feature-salary-screen.md`,
   `06c-feature-salary-share.md`.
7. Re-queue: change Status from `blocked` back to `pending`. The retry
   counter in `.dark-factory/.ralph-attempts.json` prevents infinite loops
   (3 attempts max before `exhausted`).

### A task is `exhausted`

The pipeline has tried 3 times and given up. This is a signal that the spec
is wrong, the holdout is wrong, or there's a tooling issue.

1. `cat .dark-factory/.ralph-attempts.json` — see attempt history.
2. Inspect the last 3 sessions for that spec.
3. If the holdout is asserting something the spec doesn't actually require,
   relax the holdout.
4. If the spec is missing context, edit the task file in `tasks/` to add
   it.
5. Reset the counter:
   `jq '.["ios-app-plan/tasks/NN-name.md"] = 0' .dark-factory/.ralph-attempts.json > /tmp/r.json && mv /tmp/r.json .dark-factory/.ralph-attempts.json`
6. Move the row from `Exhausted` back to `Queue` with Status `pending`.

### The loop is stuck

```bash
/dark-factory:factory stop
ps aux | grep -E 'ralph|claude' | grep -v grep
# Kill anything dangling, then restart
```

The circuit breaker (`.dark-factory/.circuit-breaker.json`) auto-opens
after 4 consecutive no-progress iterations or 3 identical errors. Cooldown
is 45 minutes by default. You can force-close it by deleting the file.

---

## Customising the pipeline

### Speed it up

- Edit `config.yaml`:
  - `impl_budget: 20` (more dollars per task)
  - `impl_timeout: 5400` (90 minutes)
  - `rate_limit_calls_per_hour: 60` (more aggressive)
- Use `--monitor` only when you actually want to watch.

### Tighten the bar

- Add holdouts under `.dark-factory/holdouts/<layer>/<name>.holdout.yaml`.
- Lower the satisfaction thresholds in `config.yaml`
  (`tier_t1_min_sat: 80`).
- Add risk factors so more tasks land in T2/T3 review tiers.

### Loosen the bar (e.g. for spike work)

- Raise `governance_ceiling` to `T3`.
- Add `holdout_threshold: 80` (default 90).
- **Don't loosen the financial-accuracy or accessibility holdouts.** Those
  exist because Malta calculator users trust the numbers and the app must
  ship to App Store.

---

## When the autonomous loop is _not_ the right tool

- **Provisioning, signing, certificates** — anything that needs your Apple
  Developer login. The release task (16) opens the PR with the right code,
  but you must run `fastlane match` and `fastlane release` from your own
  machine with your credentials.
- **TestFlight metadata that needs human judgment** — screenshots,
  marketing copy nuance, App Store reviewer notes.
- **One-off architecture spikes** — if you're exploring a new approach
  (e.g. should we use Charts vs custom CGContext for the donut?), do that
  in a regular interactive Claude Code session, then encode the decision
  as an ADR and let the loop implement.

---

## Files & directories

```text
.dark-factory/
├── config.yaml              # iOS-tuned pipeline config (risk factors, budgets)
├── backlog.md               # 17 rows pointing at ios-app-plan/tasks/*.md
├── governance.md            # Tier rules + iOS-specific risk posture
├── failure-patterns.md      # Seeded guardrails + auto-recorded patterns
├── impl-prompt.md           # Custom implementation agent prompt
├── holdouts/
│   ├── ios-setup/           # Bootstrap, SPM, bundle ID, CI
│   ├── ios-design/          # DS tokens, Liquid Glass fallback
│   ├── ios-calculation/     # Decimal discipline, golden parity
│   ├── ios-feature/         # A11y, localization, MVVM
│   ├── ios-data/            # SwiftData versioning, opt-in iCloud
│   ├── ios-quality/         # Lint, coverage, perf budget
│   └── ios-release/         # Privacy manifest, store metadata
└── sessions/                # Per-task session artifacts (gitignored)

ios-app-plan/
├── README.md                # Master plan, milestones, success metrics
├── NIGHT_SHIFT.md           # ← you are here
└── tasks/
    ├── 00-pre-study.md      # ADRs (read-only by design)
    ├── 01-project-setup.md
    ├── 02-design-system.md
    ├── ... (17 task files total)
    ├── 16-release.md
    └── 17-calculator-mapping.md
```

---

## Going live — the first overnight run

```bash
# 1. Verify everything is wired
/dark-factory:factory status

# 2. Smoke test with Task 01 only (about 30-60 min)
/dark-factory:factory run ios-app-plan/tasks/01-project-setup.md

# 3. Inspect the resulting PR
gh pr list --label dark-factory --label ios

# 4. If it looks good, kick off the overnight run
/dark-factory:factory start --monitor 10 12

# 5. Sleep
# 6. In the morning:
/dark-factory:dashboard
gh pr list --label dark-factory
```

Buon notte. 🌙
