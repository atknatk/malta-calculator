# PremiumToggleGroup

The segmented control used across calculators (`salary/form-primitives.tsx`): full-width, joined segments, with the selected segment filled `primary`.

- **Use** for 2–4 short, exclusive options: tax year, tax rate type (Single, Married, Parent), SSC category A–D, child count.
- **Consumer provides:** `options` (a readonly array), `value`, `onChange`, optional `labels` (a map from option to display text) and `size` (`sm` 40px, `default` 48px, `lg` 56px).
- Unselected segments hover to `accent`. Focus is a 2px `ring` and the outer shell is `radius` with `shadow-sm`.
