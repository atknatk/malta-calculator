import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
import { RelatedGuide } from "@/components/marketing/related-guide";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
  pageAlternates,
} from "@/app/shared-metadata";
import { MortgageCalculator } from "./_components/mortgage-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Mortgage Calculator | Malta Calculator",
  description:
    "Calculate your mortgage payments in Malta. 10% minimum deposit, monthly payments, total interest, and amortization schedule. Free mortgage calculator.",
  keywords: [
    "Malta mortgage calculator",
    "Malta home loan",
    "mortgage Malta",
    "home loan calculator Malta",
    "property loan Malta",
  ],
  alternates: pageAlternates("/calculators/mortgage"),
  openGraph: {
    ...ogMetadata,
    title: "Mortgage Calculator | Malta Calculator",
    url: `${SITE_URL}/calculators/mortgage`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Mortgage Calculator | Malta Calculator",
  },
};

export default function MortgagePage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Mortgage Calculator",
            url: `${SITE_URL}/calculators/mortgage`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Mortgage Calculator Malta"
        description="Calculate mortgage payments in Malta including monthly repayments, total interest, and full amortization schedule based on Maltese bank lending criteria."
        slug="mortgage"
        category="Property Calculator"
        features={[
          "Monthly payment calculation",
          "Total interest over loan term",
          "Full amortization schedule",
          "10% minimum deposit compliance",
          "First-time buyer scenario support",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question:
              "What is the minimum deposit required for a mortgage in Malta?",
            answer:
              "In Malta, the minimum deposit required for a residential mortgage is typically 10% of the property purchase price. This means you can borrow up to 90% of the property value (90% LTV). However, some banks may require a higher deposit depending on the property type, your income, and creditworthiness.",
          },
          {
            question: "What are typical mortgage interest rates in Malta?",
            answer:
              "Mortgage interest rates in Malta typically range from around 3% to 5% per annum, depending on the lender, loan term, and whether the rate is fixed or variable. Rates are influenced by the European Central Bank (ECB) base rate. It is advisable to compare offers from multiple Maltese banks before committing.",
          },
          {
            question: "What is the maximum mortgage term in Malta?",
            answer:
              "The maximum mortgage term in Malta is generally 40 years, though most lenders cap it at 30–35 years. The loan must typically be repaid before the borrower reaches age 65. Your specific maximum term will depend on your current age and the bank's policies.",
          },
          {
            question:
              "What benefits are available for first-time buyers in Malta?",
            answer:
              "First-time buyers in Malta benefit from a stamp duty exemption on the first €200,000 of the property purchase price, saving up to €10,000. Additionally, there are government schemes and grants available. Some banks also offer preferential mortgage rates for first-time buyers purchasing their primary residence.",
          },
          {
            question: "Can expatriates get a mortgage in Malta?",
            answer:
              "Yes, expatriates can apply for a mortgage in Malta. EU citizens generally have the same access as Maltese nationals. Non-EU citizens may face additional requirements, such as a higher deposit (sometimes 20–30%), proof of income, and a longer residency period. Having a Maltese bank account and employment contract strengthens the application.",
          },
        ]}
      />
      <main role="main" aria-label="Mortgage Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-5xl py-8">
          <MortgageCalculator />
          <RelatedGuide
            href="/blog/malta-mortgage-guide-2026"
            title="Malta Mortgage Guide 2026"
            description="Complete guide to getting a mortgage in Malta, including rates, requirements, and tips for expats."
          />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
