#!/usr/bin/env node
/**
 * Design system bileşen paketini üretir (önce `npm run tokens` çalışmış olmalı).
 *
 *   design-system/project/components/bundle.js   tek IIFE; window.React / window.ReactDOM okur,
 *                                                window.MaltaCalculator'a atar (React 18 dışarıda)
 *   design-system/project/components/bundle.css  projenin Tailwind derlemesi, renkler token'lara bağlı
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import * as esbuild from "esbuild";

const ROOT = path.resolve(import.meta.dirname, "../..");
const HERE = import.meta.dirname;
const COMPONENTS = path.join(ROOT, "design-system/project/components");
const NAMESPACE = "MaltaCalculator";
const GROUP_ORDER = [
  "Actions",
  "Forms",
  "Surfaces",
  "Data",
  "Navigation",
  "Overlays",
];

// ---------------------------------------------------------------------------
// bundle.js
// ---------------------------------------------------------------------------

const shims = {
  react: "module.exports = window.React;",
  "react-dom": "module.exports = window.ReactDOM;",
  "react-dom/client": "module.exports = window.ReactDOM;",
  "react/jsx-runtime": `
    var R = window.React;
    function jsx(type, props, key) {
      return R.createElement(type, key === undefined ? props : Object.assign({}, props, { key: key }));
    }
    module.exports = { jsx: jsx, jsxs: jsx, Fragment: R.Fragment };`,
  // next/link → düz <a>; prefetch vb. Next'e özel prop'lar atılır
  "next/link": `
    var R = window.React;
    module.exports = R.forwardRef(function Link(p, ref) {
      var rest = Object.assign({}, p);
      ["prefetch", "replace", "scroll", "shallow", "passHref", "legacyBehavior"].forEach(function (k) { delete rest[k]; });
      return R.createElement("a", Object.assign(rest, { href: typeof p.href === "string" ? p.href : "#", ref: ref }));
    });
    module.exports.default = module.exports;`,
};
shims["react/jsx-dev-runtime"] = shims["react/jsx-runtime"];

const globalsPlugin = {
  name: "globals",
  setup(build) {
    const filter = new RegExp(
      `^(${Object.keys(shims)
        .map((k) => k.replace(/[/.-]/g, "\\$&"))
        .join("|")})$`,
    );
    build.onResolve({ filter }, (a) => ({ path: a.path, namespace: "shim" }));
    build.onLoad({ filter: /.*/, namespace: "shim" }, (a) => ({
      contents: shims[a.path],
      loader: "js",
    }));
  },
};

/** Önizlemesi olan klasörler, @dsCard grubuna göre sıralı (Cover hariç) */
function cardOrder() {
  return fs
    .readdirSync(COMPONENTS, { withFileTypes: true })
    .filter(
      (d) =>
        d.isDirectory() &&
        d.name !== "Cover" &&
        fs.existsSync(path.join(COMPONENTS, d.name, "preview.html")),
    )
    .map((d) => {
      const marker = fs
        .readFileSync(path.join(COMPONENTS, d.name, "preview.html"), "utf8")
        .split("\n")[0];
      const group = /group="([^"]+)"/.exec(marker)?.[1] ?? "";
      return { name: d.name, rank: GROUP_ORDER.indexOf(group) };
    })
    .sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name))
    .map((c) => c.name);
}

const result = await esbuild.build({
  entryPoints: [path.join(HERE, "entry.tsx")],
  bundle: true,
  format: "iife",
  globalName: NAMESPACE,
  minify: true,
  target: "es2019",
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  tsconfig: path.join(ROOT, "tsconfig.json"),
  plugins: [globalsPlugin],
  logLevel: "warning",
  logOverride: { "unsupported-directive": "silent" },
  write: false,
});

let js = result.outputFiles[0].text;
if (!new RegExp(`\\bvar ${NAMESPACE}=`).test(js))
  throw new Error("IIFE global bulunamadı");
// Tüketiciler paketi satır içi <script> olarak gömebilir
js = js.replace(/<\/script/gi, "<\\/script").replace(/<!--/g, "<\\!--");
js = js.replace(new RegExp(`\\bvar ${NAMESPACE}=`), `window.${NAMESPACE}=`);

// Duman testi: gerçek React ile çalıştır, dışa aktarımları oku
const require = createRequire(path.join(ROOT, "package.json"));
const sandbox = {
  React: require("react"),
  ReactDOM: require("react-dom"),
  ...Object.fromEntries(
    [
      "console",
      "queueMicrotask",
      "setTimeout",
      "clearTimeout",
      "setInterval",
      "clearInterval",
      "performance",
    ].map((k) => [k, globalThis[k]]),
  ),
};
sandbox.window = sandbox;
vm.runInNewContext(js, sandbox);
const exported = new Set(Object.keys(sandbox[NAMESPACE] ?? {}));
// GlowButton, EyebrowPill gibi işaretleme kalıpları export değildir; başlığa yalnızca gerçek bileşenler girer
const components = cardOrder().filter((name) => exported.has(name));

const header = `/* @ds-bundle: ${JSON.stringify({ format: 4, namespace: NAMESPACE, components: components.map((name) => ({ name })) })} */`;
fs.writeFileSync(path.join(COMPONENTS, "bundle.js"), `${header}\n${js}`);
console.log(
  `✓ bundle.js ${(js.length / 1024).toFixed(0)} KB, ${exported.size} export, ${components.length} bileşen kartı`,
);

// ---------------------------------------------------------------------------
// bundle.css
// ---------------------------------------------------------------------------

// Sitenin tema seçicileri → design system sayfasının data-theme değerleri
const DS_DARK = ':is([data-theme="dark"],[data-theme="fintech-dark"])';
const DS_FINTECH = ':is([data-theme="fintech"],[data-theme="fintech-dark"])';
const toDsSelectors = (css) =>
  css
    .replaceAll('[data-theme="fintech"].dark', '[data-theme="fintech-dark"]')
    .replaceAll('[data-theme="fintech"]', DS_FINTECH)
    .replace(/\.dark(?![\w\\-])/g, DS_DARK);

const twOut = path.join(HERE, ".tailwind.out.css");
execFileSync(
  path.join(ROOT, "node_modules/.bin/tailwindcss"),
  [
    "-c",
    path.join(HERE, "tailwind.config.ts"),
    "-i",
    path.join(ROOT, "src/app/globals.css"),
    "-o",
    twOut,
  ],
  { cwd: ROOT, stdio: ["ignore", "ignore", "inherit"] },
);
let css = fs.readFileSync(twOut, "utf8");
fs.rmSync(twOut);

// tokens.css'i design system sayfası tokens.json'dan kendisi üretir
css = css.replace(/^@import[^;]+;\s*/gm, "");
// Sitede renkler HSL kanal üçlüsü; design system'de tam renk
css = css.replace(
  /hsl\(var\(--([\w-]+)\)\s*\/\s*([\d.]+)\)/g,
  (_, name, a) =>
    `color-mix(in srgb, var(--${name}) ${Number((a * 100).toFixed(2))}%, transparent)`,
);
css = css.replace(/hsl\(var\(--([\w-]+)\)\)/g, "var(--$1)");
// Design system'de farklı adlandırılan değişkenler
css = css
  .replaceAll("var(--font-calsans)", "var(--font-cal)")
  .replaceAll("var(--glass-blur)", "var(--blur-glass)");
css = toDsSelectors(css);

// Gradyanlar token ama design system'de yalnızca uç renkleri var: tam tanımları buraya taşı
const tokensCss = fs
  .readFileSync(path.join(ROOT, "src/app/tokens.css"), "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "");
const gradients = [...tokensCss.matchAll(/^([^\s{][^{]*)\{([^}]*)\}/gm)]
  .map(([, selector, body]) => {
    const decls = body
      .split(";")
      .map((d) => d.trim().replace(/\s+/g, " "))
      .filter((d) => d.startsWith("--gradient-"));
    return decls.length
      ? `${toDsSelectors(selector.trim())}{${decls.map((d) => `${d};`).join("")}}`
      : "";
  })
  .join("\n");

const unresolved = css.match(/hsl\(var\(/g);
if (unresolved)
  throw new Error(`Dönüştürülmemiş hsl(var(...)) kaldı: ${unresolved.length}`);
const minified = (
  await esbuild.transform(`${gradients}\n${css}`, {
    loader: "css",
    minify: true,
  })
).code;
if (/<\/style/i.test(minified))
  throw new Error("bundle.css içinde </style var");
fs.writeFileSync(
  path.join(COMPONENTS, "bundle.css"),
  `/* Malta Calculator — generated by scripts/design-system/build-bundle.mjs from src/app/globals.css + tailwind.config.ts; token values come from tokens.css. */\n${minified}`,
);
console.log(`✓ bundle.css ${(minified.length / 1024).toFixed(0)} KB`);
