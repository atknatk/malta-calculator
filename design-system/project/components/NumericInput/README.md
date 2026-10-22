# NumericInput

A controlled number field (`ui/numeric-input.tsx`) that lets the user clear the value, type partial decimals, and clamps to `min`/`max` on blur.

- **Use** for every amount, rate or count in calculators and payroll forms.
- **Consumer provides:** `value` (`number | ""`) and `onChange(value: number | "")`, plus optional `min`, `max`, `allowDecimals` (default true), `step`, and `suffix` ("€", "€/hr", "%") drawn right-aligned in `muted-foreground`.
- It's styled `radius-xl` and semibold. On focus the border turns `primary` with a 1px `primary` ring at 20%. Spinners are hidden and the wheel doesn't change the value.
- All text is selected on focus so it's easy to overwrite. Keep `inputMode` decimal so phones show the numeric keypad.
