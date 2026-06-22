import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
import { RelatedGuide } from "@/components/marketing/related-guide";
import { RelatedCalculators } from "@/components/marketing/related-calculators";
import { AffiliateCard } from "@/components/affiliate/affiliate-card";
import { LeadCapture } from "@/components/leadgen/lead-capture";
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
import {
  PERSONAL_LOAN_RATES,
  OFFICIAL_RATE_SOURCES,
} from "@/config/bank-products";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Malta Personal Loan Rates 2026 | Compare Banks",
  description:
    "Compare personal loan interest rates from Malta banks for 2026 — APS, BNF and HSBC variable and fixed rates with APRC, plus representative repayment examples.",
  alternates: pageAlternates("/calculators/malta-personal-loan-rates"),
  openGraph: {
    ...ogMetadata,
    title: "Malta Personal Loan Rates 2026 | Compare Banks",
    url: `${SITE_URL}/calculators/malta-personal-loan-rates`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Personal Loan Rates 2026 | Compare Banks",
  },
};

const columns = [
  { key: "bank", label: "Bank" },
  { key: "product", label: "Product" },
  { key: "rate", label: "Rate" },
  { key: "aprc", label: "APRC", numeric: true },
  { key: "example", label: "Representative example" },
];

// En iyi oran (en düşük APRC) önce; "On request" (aprc null) en sona.
const rows: RateRow[] = [...PERSONAL_LOAN_RATES]
  .sort((a, b) => (a.aprc ?? Infinity) - (b.aprc ?? Infinity))
  .map((r) => ({
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

export default function MaltaPersonalLoanRatesPage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Malta Personal Loan Rates",
            url: `${SITE_URL}/calculators/malta-personal-loan-rates`,
          },
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "What are personal loan interest rates in Malta in 2026?",
            answer:
              "Unsecured personal loan rates in Malta in 2026 are typically around 4.75%–6.50%, with an APRC (total yearly cost) slightly higher. Variable rates move with the bank's base rate; some banks offer a fixed rate. Secured loans usually attract the lowest cost of borrowing. Always confirm the current rate directly with the bank.",
          },
          {
            question: "What is APRC on a personal loan?",
            answer:
              "APRC (Annual Percentage Rate of Charge) is the total yearly cost of the loan including the interest rate plus any mandatory fees, expressed as a percentage. It is the fairest single figure to compare loans across banks, and is usually a little higher than the headline interest rate.",
          },
          {
            question: "Can I repay a personal loan early in Malta?",
            answer:
              "Many Maltese banks allow early repayment of personal loans without extra fees or penalty interest, but terms vary by bank and product. Check the specific loan's terms and conditions before signing, and use our personal loan calculator to estimate your monthly repayments.",
          },
        ]}
      />
      <main role="main" aria-label="Malta Personal Loan Rates Comparison">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8 space-y-6">
          <header className="space-y-2">
            <h1 className="font-cal text-3xl md:text-4xl font-bold">
              Malta Personal Loan Rates 2026
            </h1>
            <p className="text-muted-foreground">
              Compare indicative personal loan rates from Maltese banks. Figures
              are taken from each bank&apos;s own published information — use
              the <strong>Verify</strong> link to check the live rate before you
              apply.
            </p>
          </header>

          <RateComparisonTable
            caption="Comparison of Malta personal loan interest rates by bank"
            columns={columns}
            rows={rows}
          />

          <p className="text-xs leading-relaxed text-muted-foreground">
            Rates are <strong>indicative</strong> and were last verified on the
            dates shown. They can change at any time and depend on the amount,
            term, and whether the loan is secured. This page is for general
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
            </a>
            .
          </p>

          <AffiliateCard slug="malta-personal-loan-rates" />
          <LeadCapture
            purpose="personal-loan"
            sourcePage="/calculators/malta-personal-loan-rates"
          />
          <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_RATES} />

          <RelatedGuide
            href="/blog/malta-personal-loan-guide-2026"
            title="Malta Personal Loan Guide 2026"
            description="Everything about personal loans in Malta: rates, requirements, and bank comparisons."
          />
          <RelatedCalculators slug="malta-personal-loan-rates" />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
