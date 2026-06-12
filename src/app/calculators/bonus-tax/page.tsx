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
import { BonusTaxCalculator } from "./_components/bonus-tax-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Bonus Tax Calculator Malta 2026 | Malta Calculator",
  description:
    "Calculate tax on your bonus in Malta with 2026 FSS rules. 13th month salary, performance and year-end bonuses taxed at your marginal rate. Free, instant tool.",
  keywords: [
    "malta bonus tax calculator",
    "bonus tax malta 2026",
    "13th month salary tax malta",
    "performance bonus tax malta",
    "FSS bonus malta",
    "marginal rate bonus malta",
    "year end bonus tax malta",
    "net bonus calculator malta",
  ],
  alternates: pageAlternates("/calculators/bonus-tax"),
  openGraph: {
    ...ogMetadata,
    title: "Bonus Tax Calculator Malta 2026 | Malta Calculator",
    url: `${SITE_URL}/calculators/bonus-tax`,
    images: [getDynamicOgImage("Bonus Tax Calculator Malta 2026")],
  },
  twitter: {
    ...twitterMetadata,
    title: "Bonus Tax Calculator Malta 2026 | Malta Calculator",
    images: [getDynamicOgImage("Bonus Tax Calculator Malta 2026")],
  },
};

export default function BonusTaxPage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Bonus Tax Calculator",
            url: `${SITE_URL}/calculators/bonus-tax`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Bonus Tax Calculator Malta"
        description="Calculate the tax on one-time bonuses in Malta under FSS rules: 13th month salary, performance bonuses and year-end bonuses at your marginal rate."
        slug="bonus-tax"
        category="Tax Calculator"
        features={[
          "Marginal-rate bonus tax under FSS",
          "Net bonus after tax",
          "Bracket-jump detection",
          "All 2026 tax statuses (single, married, parent)",
          "13th month salary support",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "How is a bonus taxed in Malta?",
            answer:
              "Malta has no separate bonus tax. Under the FSS (Final Settlement System), a bonus is added to your annual income and taxed at your marginal rate — the rate of the tax bracket your total income falls into. For example, if you earn €30,000 and receive a €2,000 bonus, the bonus is taxed at 25%, leaving you €1,500 net.",
          },
          {
            question: "Is the 13th month salary taxable in Malta?",
            answer:
              "Yes. A 13th month salary or Christmas bonus paid by your employer is treated as normal employment income and taxed at your marginal rate under FSS. Note this is different from the statutory government bonus (COLA bonus), which is paid in fixed quarterly amounts.",
          },
          {
            question: "Do I pay social security (SSC) on my bonus in Malta?",
            answer:
              "No. Class 1 social security contributions in Malta are calculated on your basic weekly wage only — bonuses, overtime and allowances are excluded from the SSC calculation. Only income tax applies to your bonus.",
          },
          {
            question: "Can a bonus push me into a higher tax bracket in Malta?",
            answer:
              "Partially, yes. If your salary plus bonus crosses a bracket threshold, only the portion above the threshold is taxed at the higher rate — your existing salary is not re-taxed. This calculator flags when that happens and shows the exact extra tax.",
          },
          {
            question: "How much of a €1,000 bonus do I keep in Malta?",
            answer:
              "It depends on your income level in 2026: if your total income stays within the tax-free band you keep all €1,000; at the 15% bracket you keep €850; at 25% you keep €750; and at 35% you keep €650. Use the calculator with your actual salary for the precise figure.",
          },
        ]}
      />
      <main role="main" aria-label="Bonus Tax Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <BonusTaxCalculator />
          <RelatedGuide
            href="/blog/malta-13th-month-salary-bonus-explained"
            title="Malta 13th Month Salary (Bonus) Explained"
            description="How the 13th month salary works in Malta, who gets it, and how it differs from the statutory COLA bonus."
          />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
