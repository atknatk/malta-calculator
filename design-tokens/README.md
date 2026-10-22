# Design tokens

Malta Calculator's colours, gradients, shadows, radii, spacing, sizes and type live here. This folder is the
**only** place to change them. The files follow the [W3C Design Tokens (DTCG)](https://www.designtokens.org/tr/drafts/format/)
format.

| File                              | Contents                                                                          |
| --------------------------------- | --------------------------------------------------------------------------------- |
| `base.tokens.json`                | Every token with its Malta Gold · Light value and its usage note (`$description`) |
| `themes/dark.tokens.json`         | Dark-mode overrides (`.dark`)                                                     |
| `themes/fintech.tokens.json`      | The Fintech Blue colour theme (`data-theme="fintech"`)                            |
| `themes/fintech-dark.tokens.json` | Fintech Blue in dark mode                                                         |
| `themes.json`                     | Which sets make up each theme, and its CSS selector                               |
| `contrast.json`                   | The WCAG 2.2 AA pairs checked in every theme                                      |

## Workflow

```bash
npm run tokens          # writes src/app/tokens.css (+ the design system tokens.json) and checks contrast
npm run tokens:check    # for CI: is tokens.css up to date, and does every pair pass?
npm run design-system   # tokens + the component bundle (design-system/project/components/bundle.*)
```

- `src/app/tokens.css` is **generated**: don't edit it by hand, and commit it after `npm run tokens`.
- The shadcn colours (`background`, `primary` …) are written as HSL channel triples (`38 92% 32%`), because
  Tailwind uses them as `hsl(var(--primary) / 0.5)`. Every other colour is a full CSS colour.
- Aliases use the `{color.primary}` syntax and are resolved separately for each theme (e.g. `ring` follows `primary`).
- If a contrast pair drops below its minimum, the command fails. For a new text/background pair, add a line to `contrast.json`.
- Generator-specific settings go under `$extensions["com.maltacalculator"]`:
  `css` (CSS variable name, or `false`), `ds` (design system name, or `false`), `angle` (gradient), `sample`, `fontFiles`.

## Design system

`design-system/project/` holds the source of the [Claude design system](https://claude.ai/artifact/CZmQdZ3wqnSUL8wBhT6vj5):
the brand book (`README.md`), and a guide (`README.md`) and live preview (`preview.html`) for each component. After
`npm run design-system`, the whole folder is published to the same artifact.
