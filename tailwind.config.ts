import type { Config } from "tailwindcss";
const { fontFamily } = require("tailwindcss/defaultTheme");

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    /* Tremor */
    transparent: "transparent",
    current: "currentColor",
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // REMINDER: added for background.tsx
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* Durum renkleri ve form kenarlığı (globals.css) */
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        field: "hsl(var(--field))",
        /* Ters yüzey bandı */
        band: {
          DEFAULT: "hsl(var(--band))",
          foreground: "hsl(var(--band-foreground))",
          muted: "hsl(var(--band-muted))",
          accent: "hsl(var(--band-accent))",
          border: "hsl(var(--band-border))",
          cta: "hsl(var(--band-cta))",
          "cta-foreground": "hsl(var(--band-cta-foreground))",
        },
        /* Marka CTA renkleri: renk temasına göre değişir (globals.css --brand-*) */
        brand: {
          DEFAULT: "rgb(var(--brand) / <alpha-value>)",
          hover: "rgb(var(--brand-hover) / <alpha-value>)",
          muted: "rgb(var(--brand-muted) / <alpha-value>)",
          from: "rgb(var(--brand-from) / <alpha-value>)",
          "from-hover": "rgb(var(--brand-from-hover) / <alpha-value>)",
          to: "rgb(var(--brand-to) / <alpha-value>)",
          "to-hover": "rgb(var(--brand-to-hover) / <alpha-value>)",
        },
        /* Material 3 (admin paneli) */
        md: {
          primary: "rgb(var(--md-primary) / <alpha-value>)",
          "on-primary": "rgb(var(--md-on-primary) / <alpha-value>)",
          "primary-container":
            "rgb(var(--md-primary-container) / <alpha-value>)",
          "on-primary-container":
            "rgb(var(--md-on-primary-container) / <alpha-value>)",
          "secondary-container":
            "rgb(var(--md-secondary-container) / <alpha-value>)",
          "on-secondary-container":
            "rgb(var(--md-on-secondary-container) / <alpha-value>)",
          tertiary: "rgb(var(--md-tertiary) / <alpha-value>)",
          "tertiary-container":
            "rgb(var(--md-tertiary-container) / <alpha-value>)",
          "on-tertiary-container":
            "rgb(var(--md-on-tertiary-container) / <alpha-value>)",
          success: "rgb(var(--md-success) / <alpha-value>)",
          "success-container":
            "rgb(var(--md-success-container) / <alpha-value>)",
          "on-success-container":
            "rgb(var(--md-on-success-container) / <alpha-value>)",
          "warning-container":
            "rgb(var(--md-warning-container) / <alpha-value>)",
          "on-warning-container":
            "rgb(var(--md-on-warning-container) / <alpha-value>)",
          error: "rgb(var(--md-error) / <alpha-value>)",
          "error-container": "rgb(var(--md-error-container) / <alpha-value>)",
          "on-error-container":
            "rgb(var(--md-on-error-container) / <alpha-value>)",
          surface: "rgb(var(--md-surface) / <alpha-value>)",
          "surface-dim": "rgb(var(--md-surface-dim) / <alpha-value>)",
          "surface-container-lowest":
            "rgb(var(--md-surface-container-lowest) / <alpha-value>)",
          "surface-container-low":
            "rgb(var(--md-surface-container-low) / <alpha-value>)",
          "surface-container":
            "rgb(var(--md-surface-container) / <alpha-value>)",
          "surface-container-high":
            "rgb(var(--md-surface-container-high) / <alpha-value>)",
          "surface-container-highest":
            "rgb(var(--md-surface-container-highest) / <alpha-value>)",
          "on-surface": "rgb(var(--md-on-surface) / <alpha-value>)",
          "on-surface-variant":
            "rgb(var(--md-on-surface-variant) / <alpha-value>)",
          outline: "rgb(var(--md-outline) / <alpha-value>)",
          "outline-variant": "rgb(var(--md-outline-variant) / <alpha-value>)",
        },
        /* Tremor */
        // light mode
        tremor: {
          brand: {
            faint: "#eff6ff", // blue-50
            muted: "#bfdbfe", // blue-200
            subtle: "#60a5fa", // blue-400
            DEFAULT: "#3b82f6", // blue-500
            emphasis: "#1d4ed8", // blue-700
            inverted: "#ffffff", // white
          },
          background: {
            muted: "#f9fafb", // gray-50
            subtle: "#f3f4f6", // gray-100
            DEFAULT: "#ffffff", // white
            emphasis: "#374151", // gray-700
          },
          border: {
            DEFAULT: "#e5e7eb", // gray-200
          },
          ring: {
            DEFAULT: "#e5e7eb", // gray-200
          },
          content: {
            subtle: "#9ca3af", // gray-400
            DEFAULT: "#6b7280", // gray-500
            emphasis: "#374151", // gray-700
            strong: "#111827", // gray-900
            inverted: "#ffffff", // white
          },
        },
        // dark mode
        "dark-tremor": {
          brand: {
            faint: "#0B1229", // custom
            muted: "#172554", // blue-950
            subtle: "#1e40af", // blue-800
            DEFAULT: "#3b82f6", // blue-500
            emphasis: "#60a5fa", // blue-400
            inverted: "#030712", // gray-950
          },
          background: {
            muted: "#131A2B", // custom
            subtle: "#1f2937", // gray-800
            DEFAULT: "#111827", // gray-900
            emphasis: "#d1d5db", // gray-300
          },
          border: {
            DEFAULT: "#1f2937", // gray-800
          },
          ring: {
            DEFAULT: "#1f2937", // gray-800
          },
          content: {
            subtle: "#4b5563", // gray-600
            DEFAULT: "#6b7280", // gray-600
            emphasis: "#e5e7eb", // gray-200
            strong: "#f9fafb", // gray-50
            inverted: "#000000", // black
          },
        },
        /* */
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        /* Tremor */
        "tremor-small": "0.375rem",
        "tremor-default": "0.5rem",
        "tremor-full": "9999px",
        /* */
      },
      /* Tremor */
      boxShadow: {
        /* Material 3 elevation */
        "md-1":
          "0 1px 2px 0 rgb(0 0 0 / 0.08), 0 1px 3px 1px rgb(0 0 0 / 0.05)",
        "md-2":
          "0 1px 2px 0 rgb(0 0 0 / 0.08), 0 2px 6px 2px rgb(0 0 0 / 0.06)",
        "md-3": "0 4px 8px 3px rgb(0 0 0 / 0.06), 0 1px 3px 0 rgb(0 0 0 / 0.1)",
        // light
        "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "tremor-card":
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "tremor-dropdown":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        // dark
        "dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "dark-tremor-card":
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "dark-tremor-dropdown":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
      fontSize: {
        "tremor-label": ["0.75rem", { lineHeight: "1rem" }],
        "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
        "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
        "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
      },
      /* */
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        cal: ["var(--font-calsans)"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  /* Tremor */
  safelist: [
    {
      pattern:
        /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
  ],
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),
    require("@tailwindcss/typography"),
    require("@headlessui/tailwindcss"),
  ],
} satisfies Config;

export default config;
