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
import { SAVINGS_RATES, OFFICIAL_RATE_SOURCES } from "@/config/bank-products";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Malta Savings & Deposit Rates 2026 | Compare",
  description:
    "Compare fixed-term deposit interest rates in Malta for 2026 across MeDirect, BNF, APS and HSBC — by term (6 months to 3 years), with minimum deposits shown.",
  alternates: pageAlternates("/calculators/malta-savings-rates"),
  openGraph: {
    ...ogMetadata,
    title: "Malta Savings & Deposit Rates 2026 | Compare",
    url: `${SITE_URL}/calculators/malta-savings-rates`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Savings & Deposit Rates 2026 | Compare",
  },
};

const columns = [
  { key: "provider", label: "Provider" },
  { key: "m6", label: "6 months", numeric: true },
  { key: "y1", label: "1 year", numeric: true },
  { key: "y2", label: "2 years", numeric: true },
  { key: "y3", label: "3 years", numeric: true },
  { key: "min", label: "Min deposit", numeric: true },
];

const pct = (v: number | undefined) => (v !== undefined ? `${v}%` : "—");

const rows: RateRow[] = SAVINGS_RATES.map((r) => ({
  cells: {
    provider: r.provider,
    m6: pct(r.rates.m6),
    y1: pct(r.rates.y1),
    y2: pct(r.rates.y2),
    y3: pct(r.rates.y3),
    min: r.minDeposit ?? "—",
  },
  sourceUrl: r.sourceUrl,
  lastVerified: r.lastVerified,
}));

export default function MaltaSavingsRatesPage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Malta Savings Rates",
            url: `${SITE_URL}/calculators/malta-savings-rates`,
          },
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "What are the best savings rates in Malta in 2026?",
            answer:
              "Digital banks such as MeDirect currently offer the most competitive returns through fixed-term deposits, with rates around 1.9% for 6 months up to roughly 2.4% for longer terms. Traditional high-street banks generally pay very little on instant-access savings. Always confirm the current rate with the provider before opening an account.",
          },
          {
            question: "Is interest on savings taxed in Malta?",
            answer:
              "Yes. Interest earned from Maltese bank accounts is normally subject to a 15% final withholding tax, which the bank deducts at source so you do not need to declare it. In some cases you can elect to receive interest gross and declare it instead — our bank interest tax calculator shows which option is better for you.",
          },
          {
            question: "Are deposits in Malta protected?",
            answer:
              "Eligible deposits with licensed Maltese credit institutions are protected up to €100,000 per depositor, per bank, under the Depositor Compensation Scheme. Fixed-term deposits typically require you to lock the money away for the chosen term.",
          },
        ]}
      />
      <main role="main" aria-label="Malta Savings & Deposit Rates Comparison">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8 space-y-6">
          <header className="space-y-2">
            <h1 className="font-cal text-3xl md:text-4xl font-bold">
              Malta Savings &amp; Deposit Rates 2026
            </h1>
            <p className="text-muted-foreground">
              Compare indicative savings and fixed-term deposit rates available
              in Malta. Figures come from each provider&apos;s own published
              information — use the <strong>Verify</strong> link to check the
              live rate before you apply.
            </p>
          </header>

          <RateComparisonTable
            caption="Comparison of Malta savings and fixed-term deposit interest rates"
            columns={columns}
            rows={rows}
          />

          <p className="text-xs leading-relaxed text-muted-foreground">
            Rates are <strong>indicative</strong> and were last verified on the
            dates shown. They are quoted gross of the 15% withholding tax and
            can change at any time. This page is for general information only
            and is <strong>not financial advice</strong> — always confirm
            current terms directly with the provider. For official market
            averages, see{" "}
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

          <AffiliateCard slug="malta-savings-rates" />
          <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_RATES} />

          <RelatedGuide
            href="/blog/malta-savings-interest-guide-2026"
            title="Malta Savings Interest Guide 2026"
            description="Learn about savings accounts, interest rates, and withholding tax in Malta."
          />
          <RelatedCalculators slug="malta-savings-rates" />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
