# SummaryCard

A compact result tile (`app/salary/_components/summary-card.tsx`): an icon and caption label over a bold figure, on a tinted `radius-xl` block.

- **Use** in result grids for the headline numbers: gross, tax, SSC, net.
- **Variants:** `default` (`muted`), `success` (net pay, `success` on `success-subtle`), `warning` (deductions) and `danger` (losses, caps exceeded). The label always names the figure, so colour is never the only signal.
- **Consumer provides:** `icon` (Lucide), `label`, `value` (a preformatted string such as "€2,665.97") and `variant`.
