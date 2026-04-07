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
import { LoanCalculator } from "./_components/loan-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Personal Loan Calculator | Malta Calculator",
  description:
    "Calculate personal loan payments in Malta. Monthly payments, total interest, and repayment schedule. Free loan calculator.",
  keywords: [
    "Malta personal loan calculator",
    "Malta loan calculator",
    "personal loan Malta",
    "bank loan calculator Malta",
  ],
  alternates: pageAlternates("/calculators/personal-loan"),
  openGraph: {
    ...ogMetadata,
    title: "Personal Loan Calculator | Malta Calculator",
    url: `${SITE_URL}/calculators/personal-loan`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Personal Loan Calculator | Malta Calculator",
  },
};

export default function PersonalLoanPage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Personal Loan Calculator",
            url: `${SITE_URL}/calculators/personal-loan`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Personal Loan Calculator Malta"
        description="Calculate monthly repayments, total interest, and full amortisation schedule for personal loans in Malta with current bank interest rates."
        slug="personal-loan"
        category="Finance Calculator"
        features={[
          "Monthly repayment calculation",
          "Total interest cost breakdown",
          "Full amortisation schedule",
          "Multiple loan term options",
          "Annual Percentage Rate (APR) display",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "What are typical personal loan interest rates in Malta?",
            answer:
              "Personal loan interest rates in Malta typically range from 5% to 12% APR depending on the lender, loan amount, and your credit profile. Banks such as Bank of Valletta, HSBC Malta, and APS Bank offer personal loans with varying rates. Fixed rates are more common than variable rates for personal loans.",
          },
          {
            question:
              "What is the maximum personal loan amount available in Malta?",
            answer:
              "Most Maltese banks offer personal loans up to €50,000 for unsecured lending, though some institutions may lend up to €75,000 or more depending on your income and credit history. The maximum amount is typically capped at a multiple of your annual net salary.",
          },
          {
            question:
              "What repayment terms are available for personal loans in Malta?",
            answer:
              "Personal loan repayment terms in Malta generally range from 12 months to 84 months (7 years). Some lenders offer terms up to 10 years for larger loan amounts. Shorter terms mean higher monthly payments but lower total interest, while longer terms reduce monthly payments but increase total cost.",
          },
          {
            question:
              "Are there early repayment penalties on personal loans in Malta?",
            answer:
              "Under EU consumer credit regulations, you have the right to repay your personal loan early, partially or in full. Lenders in Malta may charge an early repayment fee of up to 1% of the outstanding balance if more than 12 months remain on the loan term, or up to 0.5% if 12 months or fewer remain.",
          },
          {
            question:
              "What are the eligibility criteria for a personal loan in Malta?",
            answer:
              "To qualify for a personal loan in Malta you typically need to be at least 18 years old, a resident of Malta, in full-time or stable employment (or self-employed with verifiable income), and have a satisfactory credit history. Banks will assess your debt-to-income ratio and may require payslips, bank statements, and a Maltese ID or residence document.",
          },
        ]}
      />
      <main role="main" aria-label="Personal Loan Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-5xl py-8">
          <LoanCalculator />
          <RelatedGuide
            href="/blog/malta-personal-loan-guide-2026"
            title="Malta Personal Loan Guide 2026"
            description="Everything about personal loans in Malta: rates, requirements, and bank comparisons."
          />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
