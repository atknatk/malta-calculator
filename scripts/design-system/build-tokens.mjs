#!/usr/bin/env node
/**
 * Design token üreticisi — tek kaynak design-tokens/ (W3C DTCG formatı).
 *
 * Üretir:
 *   src/app/tokens.css                  sitenin CSS değişkenleri (commit edilir)
 *   design-system/project/tokens.json   Claude design system artifact'ının token dosyası (gitignore)
 *   design-system/project/fonts/*       token'larda listelenen font dosyaları (gitignore)
 *
 * Her çalıştırmada design-tokens/contrast.json'daki WCAG çiftlerini tüm temalarda kontrol eder.
 *
 *   node scripts/design-system/build-tokens.mjs          üret + kontrol et
 *   node scripts/design-system/build-tokens.mjs --check  yalnızca kontrol et (tokens.css güncel mi + kontrast)
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "../..");
const TOKENS_DIR = path.join(ROOT, "design-tokens");
const CSS_OUT = path.join(ROOT, "src/app/tokens.css");
const DS_DIR = path.join(ROOT, "design-system/project");
const EXT = "com.maltacalculator";
const CHECK_ONLY = process.argv.includes("--check");

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));

// ---------------------------------------------------------------------------
// DTCG okuma: set'leri sırayla birleştir, token'ları düzleştir, alias'ları çöz
// ---------------------------------------------------------------------------

function mergeSets(sets) {
  const merged = {};
  const deepMerge = (target, src) => {
    for (const [k, v] of Object.entries(src)) {
      if (
        v &&
        typeof v === "object" &&
        !Array.isArray(v) &&
        !("$value" in v) &&
        k !== "$extensions"
      ) {
        target[k] = deepMerge(target[k] ?? {}, v);
      } else if (v && typeof v === "object" && "$value" in v) {
        // Tema dosyası yalnızca $value'yu ezer; açıklama ve uzantılar temel set'ten kalır
        target[k] = { ...(target[k] ?? {}), ...v };
      } else {
        target[k] = v;
      }
    }
    return target;
  };
  for (const set of sets)
    deepMerge(merged, readJson(path.join(TOKENS_DIR, set)));
  return merged;
}

function flatten(tree) {
  const tokens = new Map();
  const walk = (node, trail, inheritedType, groupExt) => {
    const type = node.$type ?? inheritedType;
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith("$") || !v || typeof v !== "object") continue;
      const p = [...trail, k];
      if ("$value" in v) {
        tokens.set(p.join("."), {
          path: p,
          name: k,
          group: p[0],
          type: v.$type ?? type,
          value: v.$value,
          description: v.$description ?? "",
          ext: v.$extensions?.[EXT] ?? {},
          groupExt,
        });
      } else {
        walk(v, p, type, v.$extensions?.[EXT] ?? groupExt);
      }
    }
  };
  walk(tree, [], undefined, {});
  return tokens;
}

function resolve(tokens) {
  const ALIAS = /^\{([^{}]+)\}$/;
  const deref = (value, seen) => {
    if (typeof value === "string") {
      const m = ALIAS.exec(value);
      if (!m) return value;
      const target = tokens.get(m[1]);
      if (!target) throw new Error(`Bilinmeyen alias: ${value}`);
      if (seen.has(m[1]))
        throw new Error(`Döngüsel alias: ${[...seen, m[1]].join(" → ")}`);
      return deref(target.value, new Set([...seen, m[1]]));
    }
    if (Array.isArray(value)) return value.map((v) => deref(v, seen));
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, deref(v, seen)]),
      );
    }
    return value;
  };
  for (const t of tokens.values())
    t.resolved = deref(t.value, new Set([t.path.join(".")]));
  return tokens;
}

const manifest = readJson(path.join(TOKENS_DIR, "themes.json"));
const themes = manifest.themes.map((theme) => ({
  ...theme,
  tokens: resolve(flatten(mergeSets(theme.sets))),
}));
const base = themes[0];

// ---------------------------------------------------------------------------
// Değer biçimlendirme
// ---------------------------------------------------------------------------

const num = (n) => String(Number(n.toFixed(4)));
const dim = (d) => (d.value === 0 ? "0" : `${num(d.value)}${d.unit}`);

function srgbBytes(c) {
  if (c.hex) return [1, 3, 5].map((i) => parseInt(c.hex.slice(i, i + 2), 16));
  return c.components.map((v) => Math.round(v * 255));
}

function toRgb(c) {
  if (c.colorSpace === "srgb") return srgbBytes(c).map((v) => v / 255);
  if (c.colorSpace === "hsl") {
    const [h, s, l] = [
      c.components[0],
      c.components[1] / 100,
      c.components[2] / 100,
    ];
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    return [0, 8, 4].map(
      (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))),
    );
  }
  throw new Error(`Desteklenmeyen colorSpace: ${c.colorSpace}`);
}

/** Tam CSS rengi: hsl(...), #hex veya rgba(...) */
function colorCss(c) {
  const alpha = c.alpha ?? 1;
  if (c.colorSpace === "hsl") {
    const [h, s, l] = c.components.map(num);
    return alpha === 1
      ? `hsl(${h}, ${s}%, ${l}%)`
      : `hsla(${h}, ${s}%, ${l}%, ${num(alpha)})`;
  }
  if (alpha === 1)
    return (
      c.hex ??
      "#" +
        srgbBytes(c)
          .map((v) => v.toString(16).padStart(2, "0"))
          .join("")
    );
  return `rgba(${srgbBytes(c).join(", ")}, ${num(alpha)})`;
}

/** Sitenin değişkeni: shadcn renkleri HSL kanal üçlüsü olarak tutulur (hsl(var(--x) / a) için) */
function cssVarValue(t) {
  const v = t.resolved;
  switch (t.type) {
    case "color":
      if (v.colorSpace === "hsl" && (v.alpha ?? 1) === 1) {
        const [h, s, l] = v.components.map(num);
        return `${h} ${s}% ${l}%`;
      }
      return colorCss(v);
    case "gradient":
      return `linear-gradient(${t.ext.angle ?? "180deg"}, ${v.map((s) => `${colorCss(s.color)} ${num(s.position * 100)}%`).join(", ")})`;
    case "shadow":
      return shadowCss(v);
    case "dimension":
      return dim(v);
    default:
      throw new Error(`CSS'e yazılamayan tip: ${t.type} (${t.path.join(".")})`);
  }
}

function shadowCss(v) {
  return (Array.isArray(v) ? v : [v])
    .map((s) => {
      const parts = [dim(s.offsetX), dim(s.offsetY), dim(s.blur)];
      if (s.spread && s.spread.value !== 0) parts.push(dim(s.spread));
      return `${s.inset ? "inset " : ""}${parts.join(" ")} ${colorCss(s.color)}`;
    })
    .join(", ");
}

const fontStack = (list) =>
  list
    .map((f) =>
      /^(ui-[\w-]+|system-ui|sans-serif|serif|monospace|cursive|fantasy)$/.test(
        f,
      )
        ? f
        : `"${f}"`,
    )
    .join(", ");

// ---------------------------------------------------------------------------
// 1) src/app/tokens.css
// ---------------------------------------------------------------------------

function cssVarName(t) {
  if (t.ext.css === false) return null;
  if (typeof t.ext.css === "string") return t.ext.css;
  if (t.group === "color") return `--${t.name}`;
  if (t.group === "gradient" || t.group === "shadow")
    return `--${t.group}-${t.name}`;
  return null;
}

function buildCss() {
  // Tarayıcı kaskadını taklit et: bir tema, set'leri kendi set'lerinin alt kümesi olan
  // önceki blokları da alır (ör. fintech-dark ← :root, .dark, [data-theme="fintech"]).
  // Her blok yalnızca bu bloklardan gelen değerden farklı olanı yazar.
  const blocks = [];
  const emitted = [];
  const appliesTo = (earlier, theme) =>
    earlier.sets.every((s) => theme.sets.includes(s));
  for (const theme of themes.filter((th) => !th.checkOnly)) {
    const declared = new Map();
    const lines = [];
    for (const t of theme.tokens.values()) {
      const name = cssVarName(t);
      if (!name) continue;
      const value = cssVarValue(t);
      const inherited = emitted
        .filter((e) => appliesTo(e.theme, theme) && e.declared.has(name))
        .at(-1)
        ?.declared.get(name);
      if (value === inherited) continue;
      declared.set(name, value);
      lines.push(`  ${name}: ${value};`);
    }
    emitted.push({ theme, declared });
    blocks.push(
      `/* ${theme.name} */\n${theme.selector} {\n${lines.join("\n")}\n}`,
    );
  }
  return (
    "/*\n * GENERATED by scripts/design-system/build-tokens.mjs from design-tokens/ — do not edit.\n" +
    " * Değiştirmek için design-tokens/*.json dosyalarını düzenleyip `npm run tokens` çalıştır.\n */\n\n" +
    blocks.join("\n\n") +
    "\n"
  );
}

// ---------------------------------------------------------------------------
// 2) design-system/project/tokens.json (Design System artifact formatı)
// ---------------------------------------------------------------------------

function buildDesignSystemTokens() {
  const shown = themes.filter((th) => !th.checkOnly);
  const perTheme = (t, fmt) => {
    const value = { [base.id]: fmt(base.tokens.get(t.path.join("."))) };
    for (const th of shown.slice(1)) {
      const v = fmt(th.tokens.get(t.path.join(".")));
      if (v !== value[base.id]) value[th.id] = v;
    }
    return Object.keys(value).length === 1 ? value[base.id] : value;
  };
  const dsName = (t, prefix) =>
    typeof t.ext.ds === "string" ? t.ext.ds : `${prefix}${t.name}`;
  const list = (group, prefix, fmt) =>
    [...base.tokens.values()]
      .filter((t) => t.group === group && t.ext.ds !== false)
      .map((t) => ({
        name: dsName(t, prefix),
        value: fmt ? perTheme(t, fmt) : dim(t.resolved),
        usage: t.description,
      }));

  const colors = list("color", "", (t) => colorCss(t.resolved));
  for (const t of base.tokens.values()) {
    if (t.group !== "gradient" || t.ext.ds === false) continue;
    for (const [end, idx] of [
      ["from", 0],
      ["to", -1],
    ]) {
      colors.push({
        name: `gradient-${t.name}-${end}`,
        value: perTheme(t, (x) => colorCss(x.resolved.at(idx).color)),
        usage: `${end === "from" ? "First" : "Last"} stop of \`--gradient-${t.name}\`. ${t.description}`,
      });
    }
  }

  const fonts = [];
  const families = {};
  for (const t of base.tokens.values()) {
    if (t.group !== "font") continue;
    families[t.name] = fontStack(t.resolved);
    for (const f of t.ext.fontFiles ?? [])
      fonts.push({
        family: f.family,
        file: f.file,
        weight: f.weight,
        style: f.style,
      });
  }
  const groups = [];
  for (const t of base.tokens.values()) {
    if (t.group !== "typography") continue;
    const groupName = t.groupExt.group ?? t.path[1];
    let g = groups.find((x) => x.name === groupName);
    const family = /^\{font\.(.+)\}$/.exec(t.value.fontFamily)?.[1];
    if (!g) groups.push((g = { name: groupName, family, styles: [] }));
    const v = t.resolved;
    const style = {
      name: t.name,
      fontSize: dim(v.fontSize),
      lineHeight: v.lineHeight,
      fontWeight: v.fontWeight,
    };
    if (family !== g.family) style.family = family;
    if (v.letterSpacing) style.letterSpacing = dim(v.letterSpacing);
    if (t.ext.sample) style.sample = t.ext.sample;
    style.usage = t.description;
    g.styles.push(style);
  }

  const git = (cmd) => {
    try {
      return execSync(`git ${cmd}`, {
        cwd: ROOT,
        stdio: ["ignore", "pipe", "ignore"],
      })
        .toString()
        .trim();
    } catch {
      return "";
    }
  };
  return {
    name: "Malta Calculator",
    version: 1,
    color: {
      themes: shown.map((th) => ({ id: th.id, name: th.name })),
      tokens: colors,
    },
    type: { fonts, families, groups },
    spacing: { tokens: list("spacing", "space-") },
    radius: { tokens: list("radius", "radius-") },
    shadow: { tokens: list("shadow", "shadow-", (t) => shadowCss(t.resolved)) },
    size: {
      note: "Control heights and layout widths from the components (Tailwind h-* classes).",
      tokens: list("size", ""),
    },
    blur: { tokens: list("blur", "blur-") },
    meta: {
      source: "github",
      repo: "atknatk/malta-calculator",
      ref: `${git("rev-parse --abbrev-ref HEAD")}@${git("rev-parse --short HEAD")}`,
      package: ".",
      paths: {
        tokens: [
          "design-tokens/base.tokens.json",
          "design-tokens/themes/dark.tokens.json",
          "design-tokens/themes/fintech.tokens.json",
        ],
        fonts: fonts.map((f) => f.file),
        docs: ["design-system/project/README.md"],
      },
      synced: new Date().toISOString().slice(0, 10),
    },
  };
}

// ---------------------------------------------------------------------------
// 3) WCAG kontrast kontrolü
// ---------------------------------------------------------------------------

function luminance(rgb) {
  const [r, g, b] = rgb.map((v) =>
    v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastReport() {
  const { pairs } = readJson(path.join(TOKENS_DIR, "contrast.json"));
  const failures = [];
  for (const theme of themes) {
    for (const p of pairs) {
      const fg = theme.tokens.get(`color.${p.fg}`)?.resolved;
      const bg = theme.tokens.get(`color.${p.bg}`)?.resolved;
      if (!fg || !bg)
        throw new Error(`contrast.json: bilinmeyen token ${p.fg} / ${p.bg}`);
      const [a, b] = [luminance(toRgb(fg)), luminance(toRgb(bg))];
      const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      if (ratio < p.min)
        failures.push(
          `  ${theme.id.padEnd(13)} ${p.fg} on ${p.bg}: ${ratio.toFixed(2)}:1 < ${p.min}:1 (${p.why})`,
        );
    }
  }
  return { checked: pairs.length * themes.length, failures };
}

// ---------------------------------------------------------------------------

const css = buildCss();
let ok = true;

if (CHECK_ONLY) {
  const current = fs.existsSync(CSS_OUT)
    ? fs.readFileSync(CSS_OUT, "utf8")
    : "";
  if (current !== css) {
    console.error(
      "✗ src/app/tokens.css güncel değil — `npm run tokens` çalıştır.",
    );
    ok = false;
  } else {
    console.log("✓ src/app/tokens.css güncel");
  }
} else {
  fs.writeFileSync(CSS_OUT, css);
  fs.mkdirSync(DS_DIR, { recursive: true });
  const ds = buildDesignSystemTokens();
  fs.writeFileSync(
    path.join(DS_DIR, "tokens.json"),
    JSON.stringify(ds, null, 1) + "\n",
  );
  for (const t of base.tokens.values()) {
    for (const f of t.ext.fontFiles ?? []) {
      fs.mkdirSync(path.dirname(path.join(DS_DIR, f.file)), {
        recursive: true,
      });
      fs.copyFileSync(path.join(ROOT, f.source), path.join(DS_DIR, f.file));
    }
  }
  console.log(
    `✓ src/app/tokens.css, design-system/project/tokens.json (${ds.color.tokens.length} renk, ${ds.color.themes.length} tema)`,
  );
}

const { checked, failures } = contrastReport();
if (failures.length) {
  console.error(
    `✗ Kontrast: ${failures.length}/${checked} çift WCAG AA altında:\n${failures.join("\n")}`,
  );
  ok = false;
} else {
  console.log(
    `✓ Kontrast: ${checked} çiftin hepsi WCAG AA (${themes.map((t) => t.id).join(", ")})`,
  );
}
process.exit(ok ? 0 : 1);
