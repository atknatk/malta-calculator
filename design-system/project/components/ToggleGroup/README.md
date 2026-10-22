# ToggleGroup

Toggle buttons from `ui/toggle.tsx` and `ui/toggle-group.tsx` (Radix): a transparent or `outline` button that fills `accent` when on.

- **Use** `ToggleGroup` for view switches that don't change a calculation (Weekly / Monthly / Annual), and a single `Toggle` for one on/off display option. For calculator inputs use `PremiumToggleGroup`, whose selected state is a `primary` fill.
- **Consumer provides:** `type` (`single`/`multiple`), `value`/`defaultValue`, `onValueChange`, `variant` (`default`/`outline`), `size` (`sm` 36px, `default` 40px, `lg` 44px), and `ToggleGroupItem`s each with a `value`. Icons inside are drawn at 16px.
