# Button

The standard action control from `ui/button.tsx` (shadcn, cva), in six variants and four sizes.

- **Use** `default` (Malta Gold `primary`) once per view for the main action: "Calculate", "Generate Payslip". Use `outline` or `ghost` for the actions around it, `secondary` for a parallel alternative, `destructive` only for irreversible deletes, and `link` for inline navigation.
- **Sizes:** `sm` 36px, `default` 40px, `lg` 44px (`control-*`), and `icon` 40×40.
- **Consumer provides:** `children` (Title Case label, optionally led by a 16px Lucide icon), `variant`, `size`, `onClick`/`type`. Pass `asChild` to render a Next `Link` with button styles.
- **Don't** put two filled `primary` buttons side by side, and don't use `secondary` for small labels in light theme (white on blue is 2.85:1).
- Focus shows a 2px `ring` with a 2px offset, and disabled drops to 50% opacity.
