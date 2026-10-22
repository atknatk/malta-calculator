// Projenin Tailwind config'i; yalnızca bundle'daki bileşenleri ve önizlemeleri tarar.
import type { Config } from "tailwindcss";
import base from "../../tailwind.config";

const config = {
  ...base,
  content: [
    "./src/components/ui/{button,input,numeric-input,label,checkbox,radio-group,switch,textarea,toggle,toggle-group,card,table,accordion,tooltip,separator,select,dialog,sheet,popover,dropdown-menu}.tsx",
    "./src/components/salary/{form-primitives,mode-toggle,card}.tsx",
    "./src/app/salary/_components/summary-card.tsx",
    "./design-system/project/components/*/preview.html",
  ],
  safelist: [],
} satisfies Config;

export default config;
