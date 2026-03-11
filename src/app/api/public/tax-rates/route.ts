import { NextResponse } from "next/server";
import {
  taxBracketsByYear,
  sscRatesByYear,
  colaByYear,
  getAvailableYears,
} from "@/config/malta-tax-config";

/**
 * Public API endpoint for Malta tax rates data
 * This enables AI models, researchers, and developers to access Malta tax data
 *
 * GET /api/public/tax-rates - Returns all available years
 * GET /api/public/tax-rates?year=2026 - Returns specific year data
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const yearParam = searchParams.get("year");

  const headers = {
    "Cache-Control": "public, max-age=86400, s-maxage=604800",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
  };

  // If no year specified, return available years and latest data summary
  if (!yearParam) {
    const availableYears = getAvailableYears();
    const latestYear = availableYears[availableYears.length - 1];

    return NextResponse.json(
      {
        api: "Malta Calculator Tax Rates API",
        version: "1.0",
        source: "https://maltacalculator.com",
        dataSource:
          "Malta Commissioner for Revenue (CFR) & Social Security Department",
        availableYears,
        latestYear,
        endpoints: {
          allYears: "/api/public/tax-rates",
          specificYear: "/api/public/tax-rates?year=2026",
        },
        documentation: "https://maltacalculator.com/about",
      },
      { headers },
    );
  }

  const year = parseInt(yearParam, 10);
  if (isNaN(year)) {
    return NextResponse.json(
      { error: "Invalid year parameter. Use a valid year like 2026." },
      { status: 400, headers },
    );
  }

  const taxConfig = taxBracketsByYear.find((c) => c.year === year);
  const sscConfig = sscRatesByYear.find((c) => c.year === year);
  const colaConfig = colaByYear.find((c) => c.year === year);

  if (!taxConfig) {
    return NextResponse.json(
      {
        error: `Tax data for year ${year} not found.`,
        availableYears: getAvailableYears(),
      },
      { status: 404, headers },
    );
  }

  // Convert Infinity to null for JSON serialization
  const sanitizedBrackets: Record<string, unknown> = {};
  for (const [key, brackets] of Object.entries(taxConfig.brackets)) {
    if (brackets) {
      sanitizedBrackets[key] = brackets.map((b) => ({
        ...b,
        max: b.max === Infinity ? null : b.max,
      }));
    }
  }

  return NextResponse.json(
    {
      year,
      currency: "EUR",
      country: "Malta",
      lastUpdated: "2026-01-23",
      source: "Malta Commissioner for Revenue (CFR)",
      incomeTax: {
        description:
          "Malta progressive income tax brackets. Tax = (income × rate) − deduction",
        categories: sanitizedBrackets,
      },
      socialSecurityContributions: sscConfig
        ? {
            description: "Weekly Social Security Contribution rates and caps",
            employeeRate: "10% of basic weekly wage",
            rates: sscConfig.rates,
          }
        : null,
      cola: colaConfig
        ? {
            description:
              "Cost of Living Adjustment (Government Bonus), paid quarterly",
            annual:
              colaConfig.cola.march +
              colaConfig.cola.june +
              colaConfig.cola.september +
              colaConfig.cola.december,
            quarterly: colaConfig.cola,
          }
        : null,
      calculator: "https://maltacalculator.com/salary",
    },
    { headers },
  );
}
