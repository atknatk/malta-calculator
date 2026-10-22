# Table

The data table from `ui/table.tsx`: 14px text, 48px semibold headers at `foreground` 80%, 16px cell padding, `border` row rules and a `muted` 50% hover.

- **Use** for tax bands, monthly breakdowns, rate comparisons and employee lists.
- **Consumer provides:** `TableHeader`, `TableBody`, an optional `TableFooter` (totals on `muted` 50%) and a `TableCaption` citing the source and year.
- Right-align money columns with tabular figures. The table scrolls horizontally on small screens.
- The preview shows the 2026 single bands from `src/config/malta-tax-config.ts`. Always read figures from that config, never hard-code them.
