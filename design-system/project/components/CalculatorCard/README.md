# CalculatorCard

The premium glass link card that lists a calculator (`salary/card.tsx`, exported there as `Card`). It has a Cal Sans title, a description, a gradient icon tile and a "Calculate →" cue.

- **Use** in calculator grids and "related calculators" blocks. Use `variant="primary"` (gold tile, 2px `primary` 20% border, glow pulse) only for the featured one.
- **Consumer provides:** `href` (external links open in a new tab), `title`, `description`, an optional Lucide `icon`, and `variant`.
- On hover the card scales to 1.02, a `primary`/`secondary` wash fades in with a shimmer, the title turns `primary`, the tile rotates −8° and the arrow slides right.
