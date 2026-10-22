# Select

A Radix select (`ui/select.tsx`): a 40px trigger styled like `Input`, opening a `popover` list with a check on the chosen item.

- **Use** for choosing one of five or more options (nationality, tax year range, employee). For 2–4 options use `PremiumToggleGroup`.
- **Consumer provides:** `value`/`defaultValue`, `onValueChange`, a `SelectTrigger` holding `SelectValue` (with a `placeholder`), and `SelectContent` with `SelectItem`s. Use `SelectGroup` and `SelectLabel` to group items.
- Click the trigger in the preview to open the list.
