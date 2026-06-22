import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
import { RelatedGuide } from "@/components/marketing/related-guide";
import { RelatedCalculators } from "@/components/marketing/related-calculators";
import { AffiliateCard } from "@/components/affiliate/affiliate-card";
import { AdSlot } from "@/components/ads/ad-slot";
import {
  RateComparisonTable,
  type RateRow,
} from "@/components/marketing/rate-comparison-table";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
  pageAlternates,
} from "@/app/shared-metadata";
import { BreadcrumbJsonLd, CustomFAQJsonLd } from "@/components/json-ld";
import { MarketContext } from "@/components/marketing/market-context";
import { MORTGAGE_RATES, OFFICIAL_RATE_SOURCES } from "@/config/bank-products";
import { getMarketContext } from "@/lib/market-rates";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Malta Mortgage Rates 2026 | Bank Comparison",
  description:
    "Compare home loan interest rates from Malta banks for 2026 — HSBC and BNF variable and fixed rates, APRC, and representative monthly repayment examples.",
  alternates: pageAlternates("/calculators/malta-mortgage-rates"),
  openGraph: {
    ...ogMetadata,
    title: "Malta Mortgage Rates 2026 | Bank Comparison",
    url: `${SITE_URL}/calculators/malta-mortgage-rates`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Mortgage Rates 2026 | Bank Comparison",
  },
};

const columns = [
  { key: "bank", label: "Bank" },
  { key: "product", label: "Product" },
  { key: "rate", label: "Rate" },
  { key: "aprc", label: "APRC", numeric: true },
  { key: "example", label: "Representative example" },
];

const rows: RateRow[] = MORTGAGE_RATES.map((r) => ({
  cells: {
    bank: r.bank,
    product: r.product,
    rate: r.rateSummary,
    aprc: r.aprc !== null ? `${r.aprc}%` : "—",
    example: r.example ?? "—",
  },
  sourceUrl: r.sourceUrl,
  lastVerified: r.lastVerified,
}));

export default async function MaltaMortgageRatesPage() {
  const market = await getMarketContext();
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Malta Mortgage Rates",
            url: `${SITE_URL}/calculators/malta-mortgage-rates`,
          },
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "What are current mortgage interest rates in Malta?",
            answer:
              "Maltese home loan rates in 2026 are typically in the region of 2.7%–2.9% variable, with some banks offering a lower fixed rate for an introductory period (for example 2.10% fixed for the first 24 months). Exact rates depend on the bank, loan-to-value, term and your profile. Always confirm the current rate directly with the bank.",
          },
          {
            question: "What is APRC and why does it differ from the rate?",
            answer:
              "APRC (Annual Percentage Rate of Charge) reflects the total yearly cost of the loan including the interest rate plus mandatory fees, expressed as a percentage. It is usually slightly higher than the headline interest rate and is the fairest figure to compare loans across banks.",
          },
          {
            question: "How much deposit do I need for a mortgage in Malta?",
            answer:
              "Most Maltese banks require a minimum deposit of around 10% of the property value for residents buying their main home, though this can be higher for second properties, non-residents, or older properties. Use our mortgage calculator to estimate repayments based on your deposit and term.",
          },
        ]}
      />
      <main role="main" aria-label="Malta Mortgage Rates Comparison">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8 space-y-6">
          <header className="space-y-2">
            <h1 className="font-cal text-3xl md:text-4xl font-bold">
              Malta Mortgage Rates 2026
            </h1>
            <p className="text-muted-foreground">
              Compare indicative home loan rates from Maltese banks. Figures are
              taken from each bank&apos;s own published information — use the{" "}
              <strong>Verify</strong> link to check the live rate before you
              apply.
            </p>
          </header>

          <MarketContext {...market.mortgageBorrowingCost} />

          <RateComparisonTable
            caption="Comparison of Malta home loan interest rates by bank"
            columns={columns}
            rows={rows}
          />

          <p className="text-xs leading-relaxed text-muted-foreground">
            Rates are <strong>indicative</strong> and were last verified on the
            dates shown. They can change at any time and depend on your loan
            amount, term, loan-to-value and profile. This page is for general
            information only and is <strong>not financial advice</strong> —
            always confirm current terms directly with the bank. For official
            market averages, see{" "}
            <a
              href={OFFICIAL_RATE_SOURCES.ecbMir.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {OFFICIAL_RATE_SOURCES.ecbMir.label}
            </a>{" "}
            and{" "}
            <a
              href={OFFICIAL_RATE_SOURCES.centralBankMalta.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {OFFICIAL_RATE_SOURCES.centralBankMalta.label}
            </a>
            .
          </p>

          <AffiliateCard slug="malta-mortgage-rates" />
          <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_RATES} />

          <RelatedGuide
            href="/blog/malta-mortgage-guide-2026"
            title="Malta Mortgage Guide 2026"
            description="Complete guide to getting a mortgage in Malta, including rates, requirements, and tips for expats."
          />
          <RelatedCalculators slug="malta-mortgage-rates" />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
