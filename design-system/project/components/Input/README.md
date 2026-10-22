# Input

The plain text input from `ui/input.tsx`: 40px tall, `radius-md`, `input` border on `background`.

- **Use** for text such as names, emails and search. For money and other numbers use `NumericInput` or `PremiumInput`.
- **Consumer provides:** standard `<input>` props. Pair it with a `Label`.
- Text is 16px on mobile (so iOS doesn't zoom) and 14px from `sm` up. Placeholders are in `muted-foreground`.
- Focus is a 2px `ring` with offset, and disabled is 50% opacity with a not-allowed cursor.
