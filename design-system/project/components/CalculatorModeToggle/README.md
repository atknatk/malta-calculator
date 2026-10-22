# CalculatorModeToggle

Switches the salary calculator between Gross → Net and Net → Gross while carrying the URL parameters over (`salary/mode-toggle.tsx`).

- **Use** at the top of the two salary calculators only.
- **Consumer provides:** `active` (`"gross-to-net" | "net-to-gross"`) and `otherHref` (the other mode's URL with the shared params).
- The active side is filled: a `primary` gradient for Gross → Net, or a green-600 → emerald-600 gradient with white text for Net → Gross. The inactive side is a link in `muted-foreground` with an arrow.
