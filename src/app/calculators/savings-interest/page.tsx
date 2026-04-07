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
import { SavingsCalculator } from "./_components/savings-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Savings Interest Calculator | Malta Calculator",
  description:
    "Calculate compound interest on your savings in Malta. Including 15% withholding tax, monthly contributions, and yearly breakdown. Free savings calculator.",
  keywords: [
    "Malta savings calculator",
    "Malta interest calculator",
    "compound interest Malta",
    "savings Malta",
    "bank interest Malta",
  ],
  alternates: pageAlternates("/calculators/savings-interest"),
  openGraph: {
    ...ogMetadata,
    title: "Savings Interest Calculator | Malta Calculator",
    url: `${SITE_URL}/calculators/savings-interest`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Savings Interest Calculator | Malta Calculator",
  },
};

export default function SavingsInterestPage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Savings Interest Calculator",
            url: `${SITE_URL}/calculators/savings-interest`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Savings Interest Calculator Malta"
        description="Calculate compound interest on your Malta savings account including the 15% withholding tax on interest, monthly contributions, and yearly growth breakdown."
        slug="savings-interest"
        category="Finance Calculator"
        features={[
          "Compound interest calculation",
          "15% withholding tax on interest income",
          "Monthly contribution support",
          "Yearly savings breakdown",
          "Net vs gross interest comparison",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "Is interest on savings taxed in Malta?",
            answer:
              "Yes. In Malta, interest earned on savings accounts held with Maltese banks is subject to a 15% final withholding tax. This tax is deducted at source by the bank, meaning you receive the net interest directly. Declaring this income separately in your tax return is not required if the withholding tax has been applied.",
          },
          {
            question: "Are there tax-free savings options in Malta?",
            answer:
              "Interest earned on certain government bonds and Malta Government Stocks may be exempt from withholding tax for Maltese residents. Additionally, some pension savings vehicles offer tax advantages. Standard bank savings accounts, however, are subject to the 15% withholding tax on interest.",
          },
          {
            question:
              "How does compound interest work on Malta savings accounts?",
            answer:
              "Compound interest means that the interest you earn each period is added to your principal, and future interest is calculated on the new higher balance. Maltese banks typically compound interest monthly or annually. Over time, compounding significantly increases total returns compared to simple interest.",
          },
          {
            question:
              "What are typical savings interest rates offered by banks in Malta?",
            answer:
              "As of 2026, savings account interest rates in Malta generally range from 0.5% to 3.5% per annum depending on the bank and account type. Fixed-term deposits tend to offer higher rates than instant-access accounts. Rates can change with European Central Bank (ECB) policy decisions.",
          },
          {
            question:
              "Can I claim an exemption from the 15% withholding tax on savings interest in Malta?",
            answer:
              "Maltese residents can opt to have interest taxed at the standard income tax rates instead of the 15% withholding tax if this results in a lower tax liability. However, for most savers the 15% final withholding tax is straightforward and does not require further tax filing on that interest income.",
          },
        ]}
      />
      <main role="main" aria-label="Savings Interest Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-5xl py-8">
          <SavingsCalculator />
          <RelatedGuide
            href="/blog/malta-savings-interest-guide-2026"
            title="Malta Savings Interest Guide 2026"
            description="Learn about savings accounts, interest rates, and withholding tax in Malta."
          />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
