# PremiumInput

The labelled calculator field from `salary/form-primitives.tsx`: an icon label, a tall number input with a € suffix, and optional helper text.

- **Use** in the salary and net-to-gross forms. Set `large` for the one headline figure (64px, 24px semibold); every other field is 56px with 18px text.
- **Consumer provides:** `label`, `value`, `onChange(value: string)`, and optionally `icon` (a Lucide icon at `primary` 70%), `suffix`, `description` (12px `muted-foreground`), `large` and `onFocusChange`.
- On phones, a `large` field scrolls itself above the virtual keyboard on focus.
- Labels are sentence case in `foreground` at 70%.
