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
import { PartTimeCalculator } from "./_components/part-time-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Part-Time Tax Calculator Malta | Malta Calculator",
  description:
    "Calculate Malta's 10% part-time tax on the first €10,000 (TA23) or €12,000 (TA22) and compare it with progressive rates to find the cheaper option.",
  keywords: [
    "malta part-time tax calculator",
    "10% part-time tax malta",
    "TA23 malta",
    "TA22 malta",
    "part-time self-employed tax malta",
    "part-time employment tax malta",
    "second job tax malta",
    "part-time 10 percent malta 2026",
  ],
  alternates: pageAlternates("/calculators/part-time"),
  openGraph: {
    ...ogMetadata,
    title: "Part-Time Tax Calculator Malta | Malta Calculator",
    url: `${SITE_URL}/calculators/part-time`,
    images: [getDynamicOgImage("Part-Time Tax Calculator Malta")],
  },
  twitter: {
    ...twitterMetadata,
    title: "Part-Time Tax Calculator Malta | Malta Calculator",
    images: [getDynamicOgImage("Part-Time Tax Calculator Malta")],
  },
};

export default function PartTimePage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Part-Time Tax Calculator",
            url: `${SITE_URL}/calculators/part-time`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Part-Time Tax Calculator Malta"
        description="Calculate the optional 10% final tax on part-time work in Malta (TA22/TA23) and compare it with declaring the income at progressive rates."
        slug="part-time"
        category="Tax Calculator"
        features={[
          "10% rate on first €10,000 of part-time employment (TA23)",
          "10% rate on first €12,000 of part-time self-employment (TA22)",
          "Excess-over-cap marginal tax calculation",
          "Comparison with full progressive declaration",
          "2026 Malta tax brackets",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "How is part-time work taxed in Malta?",
            answer:
              "Income from part-time work in Malta can optionally be taxed at a flat 10% final rate, separate from your other income. The rate applies to the first €10,000 per year from part-time employment (form TA23) or the first €12,000 from part-time self-employment (form TA22). Anything above the cap is declared at normal progressive rates.",
          },
          {
            question: "Who qualifies for the 10% part-time tax rate in Malta?",
            answer:
              "You generally qualify if you also have a full-time job, are a pensioner, or are a full-time student or apprentice, and the part-time work is performed for an employer different from your full-time employer. Part-time self-employed persons must be registered with Jobsplus, engage no more than 2 employees, and keep proper records.",
          },
          {
            question:
              "Is the 10% part-time rate always cheaper than declaring the income?",
            answer:
              "No. The 10% is a flat final tax, while declaring adds the income on top of your other earnings at your marginal rate. If your total income falls in Malta's 0% band (first €12,000 for singles in 2026) or partly in the 15% band, declaring can result in less tax than the flat 10%. This calculator compares both options.",
          },
          {
            question: "When is the TA22 or TA23 form due in Malta?",
            answer:
              "Both the TA22 (part-time self-employment) and TA23 (part-time employment) forms, together with the 10% payment, are due by 30 April of the year following the year in which the income was earned. Filing is done electronically through the MTCA portal.",
          },
          {
            question: "Do I pay social security on part-time income in Malta?",
            answer:
              "If you already pay Class 1 SSC through your full-time job, no additional Class 1 contribution is due on a part-time second job's 10% scheme income. Part-time self-occupied persons may fall under Class 2 rules — certain groups (students under 25, pensioners, part-time self-occupied women) can pay 15% of actual earnings instead of the standard minimum.",
          },
        ]}
      />
      <main role="main" aria-label="Part-Time Tax Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <PartTimeCalculator />
          <RelatedGuide
            href="/blog/malta-part-time-employment-rights"
            title="Malta Part-Time Employment Rights 2026"
            description="Pro-rata leave, SSC rules, the 10% tax option and everything else part-time workers in Malta should know."
          />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
