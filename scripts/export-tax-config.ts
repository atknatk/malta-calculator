import fs from "fs";
import path from "path";
import {
  taxBracketsByYear,
  sscRatesByYear,
  colaByYear,
  type TaxBracket,
} from "../src/config/malta-tax-config";

interface JSONBracket {
  min: number;
  max: number | null;
  rate: number;
  deduction: number;
}

function mapBracket(b: TaxBracket): JSONBracket {
  return {
    min: b.min,
    max: b.max === Infinity ? null : b.max,
    rate: b.rate,
    deduction: b.deduction,
  };
}

function buildYearEntry(year: number) {
  const taxEntry = taxBracketsByYear.find((c) => c.year === year);
  const sscEntry = sscRatesByYear.find((c) => c.year === year);
  const colaEntry = colaByYear.find((c) => c.year === year);

  if (!taxEntry || !sscEntry) {
    throw new Error(`Missing tax or SSC config for ${year}`);
  }

  const brackets: Record<string, JSONBracket[]> = {};
  for (const [key, value] of Object.entries(taxEntry.brackets)) {
    if (value) {
      brackets[key] = value.map(mapBracket);
    }
  }

  return {
    year,
    brackets,
    ssc: sscEntry.rates,
    cola: colaEntry?.cola ?? null,
  };
}

const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
const payload = {
  version: "2026.1",
  generatedAt: new Date().toISOString(),
  source: "src/config/malta-tax-config.ts",
  years: years.map(buildYearEntry),
};

const defaultOutput = path.join(
  __dirname,
  "../ios-app/Packages/CalculationKit/Sources/CalculationKit/Resources/tax-config-2020-2026.json",
);

// Support --output flag for drift check
const outputArgIdx = process.argv.indexOf("--output");
const outputPath =
  outputArgIdx !== -1 && process.argv[outputArgIdx + 1]
    ? process.argv[outputArgIdx + 1]
    : defaultOutput;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2));

console.log(`✓ Tax config exported: ${outputPath}`);
console.log(`  Version: ${payload.version}`);
console.log(`  Years: ${years.join(", ")}`);
