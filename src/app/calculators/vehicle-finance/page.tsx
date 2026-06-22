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
import { VehicleFinanceCalculator } from "./_components/vehicle-finance-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Vehicle Finance Calculator Malta 2026 | Hire Purchase",
  description:
    "Calculate Malta car loan & hire purchase: deposit, monthly instalment, interest and total cost. Free vehicle finance calculator with 25% deposit defaults.",
  keywords: [
    "Malta vehicle finance calculator",
    "Malta car loan calculator",
    "Malta hire purchase calculator",
    "car finance Malta",
    "vehicle loan Malta",
    "Malta car finance 25 deposit",
    "BOV motor loan calculator",
    "HSBC car loan Malta",
    "dealer finance Malta",
    "Malta auto loan",
  ],
  alternates: pageAlternates("/calculators/vehicle-finance"),
  openGraph: {
    ...ogMetadata,
    title: "Vehicle Finance Calculator Malta 2026 | Hire Purchase",
    url: `${SITE_URL}/calculators/vehicle-finance`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Vehicle Finance Calculator Malta 2026",
  },
};

export default function VehicleFinancePage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Vehicle Finance Calculator",
            url: `${SITE_URL}/calculators/vehicle-finance`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Malta Vehicle Finance Calculator"
        description="Calculate the deposit, monthly instalment and total cost of a car loan or hire purchase agreement in Malta. Supports the typical 25% deposit, 60-month, 8% IR Maltese dealer finance scenario plus bank rates."
        slug="vehicle-finance"
        category="Vehicle Finance Calculator"
        features={[
          "Deposit and financed amount split (5%-80%)",
          "Monthly instalment via amortisation (PMT) formula",
          "Total interest and grand total cost breakdown",
          "Live cost-distribution bar chart",
          "First 12 months amortisation schedule",
          "Malta lender rate benchmarks (BOV, HSBC, APS, BNF, Finance House)",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "What is a typical car finance deal in Malta?",
            answer:
              "Many Maltese dealers and finance companies require a 25% deposit with the balance repaid over 60 months at around 6-9% annual interest. A €40,000 car at 25% deposit and 8% IR over 60 months costs roughly €10,000 deposit and a €608 monthly instalment, totalling about €46,500. Banks such as BOV often offer 0% deposit with longer terms at lower variable rates.",
          },
          {
            question:
              "What is the difference between a car loan and hire purchase in Malta?",
            answer:
              "A bank car loan is an unsecured personal loan you use to buy a vehicle outright — you own the car from day one. Hire purchase (offered by dealers and finance companies) splits the price into a deposit and monthly instalments, with the finance company holding ownership until the final payment is made. Hire purchase usually requires a deposit (often 10-25%) but may have faster approval at the dealership.",
          },
          {
            question:
              "What car loan interest rates are available in Malta 2026?",
            answer:
              "Indicative 2026 rates: Bank of Valletta motor loan from 4.75% (variable), APS Bank around 5.5%, HSBC Malta car loan 6.50% IR (6.70% APRC fixed), BNF Bank around 7%, and dealer hire-purchase typically 7-9%. APS also runs a 0% interest scheme for fully electric and plug-in hybrid vehicles funded by EU regional development. Always compare APRC (which includes fees) rather than headline interest rate alone.",
          },
          {
            question: "How is the monthly car loan instalment calculated?",
            answer:
              "Monthly instalment uses the standard amortisation (PMT) formula: PMT = P × [r(1+r)^n] / [(1+r)^n − 1], where P is the financed amount (price minus deposit), r is the monthly interest rate (annual rate ÷ 12) and n is the number of months. Each instalment covers both interest on the outstanding balance and principal repayment, so the balance gradually falls and the principal portion of each payment grows.",
          },
          {
            question: "Can I get vehicle finance in Malta with no deposit?",
            answer:
              "Yes — Bank of Valletta, HSBC Malta and several other Maltese banks offer car loans with no required deposit, financing 100% of the purchase price for eligible borrowers. Some dealers also run no-deposit promotions. However, no-deposit finance generally needs a stronger credit profile, a higher salary multiple and typically results in a larger total interest cost because you're financing the full price.",
          },
          {
            question: "Does Malta charge stamp duty on vehicle finance?",
            answer:
              "Stamp duty is charged on the registration of the vehicle (separate from the finance), not on the loan itself. The finance agreement may carry an arrangement or banking fee (Finance House, for example, charges 4.75% on loan value) and HP bill fees of around €10 per instalment. Always check the APRC quoted in the finance agreement — it includes these fees and is the true cost.",
          },
        ]}
      />
      <main role="main" aria-label="Malta Vehicle Finance Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-5xl py-6 sm:py-8">
          <VehicleFinanceCalculator />
          <RelatedGuide
            href="/blog/malta-vehicle-finance-guide-2026"
            title="Malta Vehicle Finance Guide 2026"
            description="Compare car loans, hire purchase and dealer finance in Malta — deposit rules, interest rates and the true cost of borrowing for your next vehicle."
          />
          <AffiliateCard slug="vehicle-finance" />
          <RelatedCalculators slug="vehicle-finance" />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false;
export const dynamic = "force-static";
