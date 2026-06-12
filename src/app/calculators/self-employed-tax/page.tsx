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
  getDynamicOgImage,
} from "@/app/shared-metadata";
import { SelfEmployedTaxCalculator } from "./_components/self-employed-tax-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Self-Employed Tax Calculator Malta 2026 | Malta Calculator",
  description:
    "Calculate self-employed tax in Malta for 2026: progressive income tax on net profit, Class 2 SSC and provisional tax instalments (20/30/50). Free tool.",
  keywords: [
    "malta self-employed tax calculator",
    "self-employed income tax malta 2026",
    "sole trader tax malta",
    "provisional tax malta",
    "PT1 instalments malta",
    "freelancer tax malta",
    "self-occupied tax malta",
    "business expenses deduction malta",
  ],
  alternates: pageAlternates("/calculators/self-employed-tax"),
  openGraph: {
    ...ogMetadata,
    title: "Self-Employed Tax Calculator Malta 2026 | Malta Calculator",
    url: `${SITE_URL}/calculators/self-employed-tax`,
    images: [getDynamicOgImage("Self-Employed Tax Calculator Malta 2026")],
  },
  twitter: {
    ...twitterMetadata,
    title: "Self-Employed Tax Calculator Malta 2026 | Malta Calculator",
    images: [getDynamicOgImage("Self-Employed Tax Calculator Malta 2026")],
  },
};

export default function SelfEmployedTaxPage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Self-Employed Tax Calculator",
            url: `${SITE_URL}/calculators/self-employed-tax`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Self-Employed Tax Calculator Malta"
        description="Calculate income tax on self-employment profit in Malta, plus Class 2 social security and the provisional tax instalment schedule for 2026."
        slug="self-employed-tax"
        category="Tax Calculator"
        features={[
          "Progressive 2026 tax on net profit",
          "Deductible business expenses",
          "Class 2 SSC integration (SA/SB/SC)",
          "Provisional tax 20/30/50 instalments",
          "Net income and effective burden",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "How is self-employed income taxed in Malta?",
            answer:
              "Self-employed (self-occupied) persons in Malta pay income tax on their net profit — gross revenue minus expenses incurred wholly and exclusively for the business — at the same progressive rates as employees (0%, 15%, 25%, 35% in 2026). On top of that they pay Class 2 social security contributions of 15% of the previous year's net income.",
          },
          {
            question: "What expenses can I deduct as self-employed in Malta?",
            answer:
              "Expenses incurred wholly and exclusively in the production of the income are deductible: business rent, materials and stock, professional fees, business insurance, employee wages, marketing, and a proportional share of mixed-use costs. Capital expenditure is claimed through capital allowances rather than as a direct expense.",
          },
          {
            question: "What is provisional tax in Malta and when is it due?",
            answer:
              "Provisional tax (PT) is the prepayment of your income tax during the year, based on your last self-assessment. It is paid in three instalments: 20% by 30 April, 30% by 31 August and 50% by 21 December. Any remaining balance is settled with the tax return.",
          },
          {
            question:
              "Do self-employed persons pay both income tax and SSC in Malta?",
            answer:
              "Yes. Income tax is charged on net profit at progressive rates, while Class 2 SSC is a separate 15% contribution (minimum €36.18/week, maximum €83.89/week in 2026 for those born after 1962) paid in April, August and December. This calculator shows both together as your total burden.",
          },
          {
            question:
              "Is the 10% part-time rate available to self-employed people in Malta?",
            answer:
              "If your self-employment is part-time alongside a full-time job, pension or studies, you can opt for the 10% final tax on the first €12,000 of part-time self-employment income (form TA22) instead of progressive rates — provided you are registered with Jobsplus and employ no more than 2 people.",
          },
        ]}
      />
      <main role="main" aria-label="Self-Employed Tax Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <SelfEmployedTaxCalculator />
          <RelatedGuide
            href="/blog/malta-self-employment-tax-guide-2026"
            title="Malta Self-Employment Tax Guide 2026"
            description="Registration, deductible expenses, provisional tax and the full compliance calendar for sole traders."
          />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
