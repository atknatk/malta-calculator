import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
import { RelatedGuide } from "@/components/marketing/related-guide";
import { RelatedCalculators } from "@/components/marketing/related-calculators";
import { AffiliateCard } from "@/components/affiliate/affiliate-card";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
  pageAlternates,
} from "@/app/shared-metadata";
import { BankInterestTaxCalculator } from "./_components/bank-interest-tax-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Bank Interest Tax Calculator Malta | Malta Calculator",
  description:
    "Should you pay Malta's 15% withholding tax on bank interest, or declare it gross at progressive rates? Compare both and see which is cheaper for your income.",
  keywords: [
    "Malta bank interest tax",
    "Malta 15% withholding tax interest",
    "Malta interest tax calculator",
    "Malta savings interest tax",
    "Malta declare interest gross",
    "Malta investment income tax",
  ],
  alternates: pageAlternates("/calculators/bank-interest-tax"),
  openGraph: {
    ...ogMetadata,
    title: "Bank Interest Tax Calculator | Malta Calculator",
    url: `${SITE_URL}/calculators/bank-interest-tax`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Bank Interest Tax Calculator | Malta Calculator",
  },
};

export default function BankInterestTaxPage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Bank Interest Tax Calculator",
            url: `${SITE_URL}/calculators/bank-interest-tax`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Bank Interest Tax Calculator Malta"
        description="Compare Malta's 15% final withholding tax on bank interest against declaring the interest gross at progressive income tax rates, and see which option results in less tax for your income level."
        slug="bank-interest-tax"
        category="Finance Calculator"
        features={[
          "15% final withholding tax vs progressive comparison",
          "Marginal tax rate based on your other income",
          "Single, married and parent tax bands",
          "Net interest kept under each option",
          "Best-option recommendation with yearly savings",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question:
              "Do I pay 15% tax on Maltese bank interest if the bank did not deduct it?",
            answer:
              "Not necessarily. The 15% is a final withholding tax that the bank normally deducts at source. If you received the interest gross (no 15% deducted), you do not pay a flat 15% — instead you must declare the interest in your income tax return, where it is taxed at the normal progressive rates (0% to 35%). If your total income is below the tax-free threshold (€12,000 for a single person in 2025 and 2026), the tax on that interest can be €0.",
          },
          {
            question:
              "Is it better to let the bank withhold 15% or to declare interest gross?",
            answer:
              "It depends on your marginal tax rate. If your total income falls within the 0% band, declaring the interest gross results in 0% tax, which beats the irrecoverable 15% withholding. If you are a higher earner whose interest would fall in the 25% or 35% band, the 15% final withholding tax is cheaper. The breakeven is roughly the 15% income tax band.",
          },
          {
            question:
              "Can I reclaim the 15% withholding tax the bank already deducted?",
            answer:
              "No. The 15% withholding tax on bank interest is a final tax. Once the bank deducts it at source, it satisfies your liability and cannot be claimed back, even if your income is below the tax-free threshold. To benefit from progressive rates you must ask the bank to pay the interest gross before it is paid, then declare it yourself.",
          },
          {
            question: "Do I still have to declare interest I received gross?",
            answer:
              "Yes. If the bank did not deduct the 15% final withholding tax, the interest is not 'final-taxed' and must be reported in your annual income tax return under investment income. Even if the resulting tax works out to €0 because you are within the tax-free band, the interest should still be declared.",
          },
          {
            question:
              "Which bank interest is subject to the 15% withholding tax in Malta?",
            answer:
              "The 15% final withholding tax applies to interest paid by Maltese banks and certain other local payors to resident individuals, under the Investment Income Provisions of the Income Tax Act. Interest from some instruments, such as Malta Government Stock, can be received gross. Foreign-source interest follows different rules and may need to be declared.",
          },
        ]}
      />
      <main role="main" aria-label="Bank Interest Tax Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-5xl py-8">
          <BankInterestTaxCalculator />
          <RelatedGuide
            href="/blog/malta-bank-interest-tax-guide-2026"
            title="Malta Bank Interest Tax Guide 2026"
            description="When you pay the 15% withholding tax, when to declare interest gross, and how low earners pay nothing."
          />
          <AffiliateCard slug="bank-interest-tax" />
          <RelatedCalculators slug="bank-interest-tax" />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
