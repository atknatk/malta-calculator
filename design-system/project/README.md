Malta Calculator is a financial toolkit for people who live and work in Malta: a salary calculator, 28+ free calculators, a B2B payroll product and a library of guides. The look is **Malta Gold on warm limestone**, with Mediterranean Blue as the second voice and the red of the Maltese cross kept for danger. Use it to make numbers feel trustworthy and the island feel warm.

## Content fundamentals

- **Write in English, about Malta only.** Every figure, rule and example is Maltese: CFR tax bands, SSC categories A–D, COLA, the €559.31 weekly SSC cap. Never generalise to "your country".
- **Speak to the reader as "you".** "Calculate Your Malta Salary", "Get accurate tax deductions, SSC contributions, and net salary calculations instantly." The product is "we" only in About/legal copy.
- **Title Case for headings, nav and buttons** ("Salary Calculator", "All Calculators", "Calculate Now", "Explore Tools"). Use sentence case for descriptions, helper text and labels ("Gross annual salary").
- **Numbers first, then the explanation.** Lead with the figure, then name its source and year: "€2,816.40 net per month — based on 2026 CFR rates."
- **Format money as `€42,000` / `€2,816.40`.** The euro sign goes before the number with no space, thousands use commas and cents use two decimals. A suffix field shows `€` or `€/hr` at the right edge in `muted-foreground`.
- **Name the tax year everywhere** ("2026", "2024-26"). Rates change every budget, so a page without a year looks stale.
- **No emoji, no hype beyond one line.** A single eyebrow claim is fine ("Malta's #1 Salary Calculator"); the rest stays factual and calm.
- **Use acronyms the Maltese way:** SSC, COLA, FSS, CFR, FTB. Spell an acronym out once per page.

## Visual foundations

### Colour

- **Ground:** pages sit on `background` (warm limestone `hsl(40 33% 98%)`; night blue in dark). Over it lie a 16px dot grid (`space-4` pitch, 1px dots) and a soft mesh of gold, blue, coral and red glows. Cards and panels sit on `card`.
- **Malta Gold (`primary`)** is the brand. Use it for the main action, the selected segment, checked controls, links and the key words in a sentence ("tax deductions", "net salary"). Keep it to one filled `primary` button per view.
- **Mediterranean Blue (`secondary`)** is the counterpoint. It colours secondary icon tiles, the second accent word ("SSC contributions") and `.text-gradient-secondary` stats. It carries white text and reads as text on `background` in every theme.
- **Status:** use `success` for net pay and positive change, `warning` for deductions, and `danger`/`destructive` for errors and losses. Each has a `-subtle` 10% fill for SummaryCards. Always pair status colour with a label or icon.
- **Identity swatches** (`malta-gold`, `malta-blue`, `malta-red`) are for brand moments and glows, never for text.
- **Gradients:** `gradient-primary-from → gradient-primary-to` (135°) fills the hero CTA (`.btn-glow`), `.text-gradient` headline words and hero stats. Use a gradient on at most one headline line and one CTA per screen.
- **Themes:** _Malta Gold · Light_ is the default, _Malta Gold · Dark_ follows the `.dark` class (next-themes, system-aware), and _Fintech Blue_ is the alternate colour theme from the palette picker (`data-theme="fintech"`). Fintech Blue overrides only `primary`, `secondary`, `ring`, the gradients and the glow; _Fintech Blue · Dark_ (`[data-theme="fintech"].dark`) lightens its indigo and violet and puts dark text on them. Malta Gold stays the default.

### Type

- **Cal Sans** (`cal`, SemiBold 600) is the display face: hero (`display-hero`), page titles (`display-1`), section heads (`display-2`, `display-3`) and calculator card titles (`display-card`). Don't use it below 20px or for body copy.
- **Inter** (`sans`) sets everything else. `body-sm` (14px) is the workhorse for buttons, labels, tables and descriptions. Use `caption` (12px) for helper text and `lead` (20px, relaxed) for hero subtitles.
- **Figures** are Inter semibold or bold: `figure-hero` for the big salary input, `stat` for hero stats, `figure-summary` for result tiles.
- Inputs are 16px on mobile so iOS Safari doesn't zoom on focus, and drop to 14px from `sm` up.

### Space, shape and layout

- Spacing follows Tailwind's 4px scale. Cards pad `space-6`, field stacks gap `space-4` and labels sit `space-2` above inputs. The container is centred with `space-8` side padding, capped at `container-max`.
- **Radii grow with the element.** Use `radius-md` for buttons and inputs, `radius`/`radius-xl` for cards, number fields and tiles, `radius-2xl` for premium cards and hero CTAs, `radius-3xl` for big panels, and `radius-full` for pills, switches and the nav bar.
- Controls are `control` (40px) tall by default. Calculator fields are taller and friendlier: `field` (56px) and `field-lg` (64px) for the headline salary.

### Surfaces, borders and shadows

- Every element gets a 1px `border` hairline by default. That hairline is decorative; the boundary of every form control is `input`, which holds 3:1 against `background` and `card`. A focused number field switches its border to `primary` with a 1px `primary` ring at 20%.
- **Glass** (`glass-bg` + `glass-border` + `blur-glass`) is for floating chrome: the nav pill, the hero eyebrow pill, premium cards and the secondary hero CTA. Don't put glass on glass.
- Shadows are soft and large. `shadow-sm` is for flat cards, `shadow-elevation` for premium cards at rest and `shadow-card` on hover (with a 4px lift). `shadow-btn-glow` goes under the gold CTA.

### Focus and states

- Focus is a 2px `ring` with a 2px `background` offset (`focus-visible:ring-2 ring-offset-2`). `ring` follows `primary` in light themes and stays above 3:1 on `background` and `card` in every theme.
- Hover darkens fills to 90% (`primary`, `destructive`) or 80% (`secondary`). Ghost and outline controls pick up `accent`. Disabled controls drop to 50% opacity with no pointer events.

### Motion

- Transitions run 200ms for controls, 300–500ms for cards and 0.2s ease-out for the accordion. Cards lift (`-4px`) or scale (`1.02`) on hover, and calculator icon tiles scale 1.1 and rotate −8°.
- Ambient motion appears only on marketing pages: floating orbs (15–20s), float (6s), shimmer on card hover and the glow pulse on featured cards. Never animate calculator results apart from counting up.

## Iconography

- Use **Lucide** (`lucide-react` 0.379) for every icon, with 24px artboards and a 2px round stroke. Draw them at 16px (`h-4 w-4`) in controls, 14px in SummaryCards and 24px in icon tiles. Common icons: Calculator, Euro, Wallet, Briefcase, Settings2, ChevronDown, ArrowLeftRight, Sparkles (eyebrow pill), Check.
- Icons take `currentColor`. In field labels they sit at `primary` 70%, and in icon tiles they're white on a `primary`/`secondary` gradient square (`radius-xl`, 48px).
- No emoji. Logos ship as PNG (see Logos), so there's no SVG mark yet.

## Logos

- `logo.png` is the horizontal lockup: a gold calculator glyph with "Malta" in gold and "Calculator" in near-black. Use it on light grounds only, for headers, OG images and documents.
- `logo_squaree.png` is the same lockup on a square transparent canvas, for social avatars.
- `apple-icon.png` is the app and touch icon.
- In the site header, the brand name is set as live text ("MaltaCalculator" in Cal Sans, one word, the two halves in contrasting colours) rather than as an image. Don't recolour or redraw the glyph.

## Components

The previews mount the **real React components**, built from `src/components/ui/*`, `src/components/salary/*` and `SummaryCard`. They run on React 18, and the global `window.MaltaCalculator` exposes every export plus `cn` and `Icons` (the Lucide icons the previews use). `components/bundle.css` is the project's own Tailwind build over those sources, with every colour wired to this system's tokens. In the app, keep importing from `@/components/ui/*` and `@/components/salary/*`.

- Pick the variant before reaching for `className`: the components already encode the rules above.
- `GlowButton` and `EyebrowPill` are markup patterns rather than components. Copy their class lists from the preview.
- Overlay previews (Dialog, Sheet, Popover, DropdownMenu, Tooltip) open on load and non-modally, so they stay readable. In the app, Dialog and Sheet are modal.

---

**Contrast.** Every text, focus and control-boundary pair in `design-tokens/contrast.json` holds WCAG 2.2 AA in all four themes; `npm run tokens:check` enforces it.

**Not synced**

- Gradients (`--gradient-*`) and the mesh background can't be tokens. Their stops are kept as `gradient-*-from/to`, and the middle stops (#b86f08, #0077b6) are named in the notes.
- Tremor chart colours and radii in `tailwind.config.ts` are skipped: they're library defaults (Tailwind blue/gray), not the brand.
- Fonts: Inter loads from Google Fonts (no file). The OG-image font `public/fonts/c9a5bc6a7c948fb0-s.p.woff2` is not carried over.
- Logos: `public/logo_bg.png` (a JPEG with a .png name) and the plan icons in `public/images/` were not uploaded.
- Components: built with esbuild 0.25.5 into one IIFE that reads `window.React`/`window.ReactDOM` (React 18.3.1, from jsDelivr). Radix, Lucide, cva, tailwind-merge and framer-motion are bundled in, and `next/link` is shimmed to a plain `<a>`. Not built: Command, Calendar, DatePicker, Form, ContextMenu, Toaster (sonner).
- Codebase colour variables are HSL channel triples (`--primary: 38 92% 32%`, used as `hsl(var(--primary) / 0.1)`). Here every token is a full colour, so `bundle.css` rewrites `hsl(var(--x))` to `var(--x)` and `hsl(var(--x) / a)` to `color-mix()`. It also maps the `.dark` class to `[data-theme="dark"]`, `--font-calsans` to `--font-cal` and `--glass-blur` to `--blur-glass`.
