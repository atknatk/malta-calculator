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
  getDynamicOgImage,
} from "@/app/shared-metadata";
import { MaternityCalculator } from "./_components/maternity-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Maternity Leave Calculator Malta 2026 | Malta Calculator",
  description:
    "Calculate your income during Malta's 18-week maternity leave: 14 weeks employer full pay + 4 weeks at €213.54. Self-occupied rates and paternity leave.",
  keywords: [
    "malta maternity leave calculator",
    "maternity leave pay malta 2026",
    "18 weeks maternity leave malta",
    "maternity leave benefit €213.54",
    "maternity benefit malta",
    "paternity leave malta 10 days",
    "self-occupied maternity malta",
    "maternity pay calculator malta",
  ],
  alternates: pageAlternates("/calculators/maternity"),
  openGraph: {
    ...ogMetadata,
    title: "Maternity Leave Calculator Malta 2026 | Malta Calculator",
    url: `${SITE_URL}/calculators/maternity`,
    images: [getDynamicOgImage("Maternity Leave Calculator Malta 2026")],
  },
  twitter: {
    ...twitterMetadata,
    title: "Maternity Leave Calculator Malta 2026 | Malta Calculator",
    images: [getDynamicOgImage("Maternity Leave Calculator Malta 2026")],
  },
};

export default function MaternityPage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Maternity Leave Calculator",
            url: `${SITE_URL}/calculators/maternity`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Maternity Leave Calculator Malta"
        description="Calculate income during Malta's 18-week maternity leave: employer-paid weeks, the government Maternity Leave Benefit and rates for self-occupied mothers."
        slug="maternity"
        category="Employment Calculator"
        features={[
          "18-week maternity leave breakdown",
          "14 weeks employer full pay",
          "4-week government benefit at €213.54/week",
          "Self-occupied rate €221.78/week",
          "10 working days paternity leave info",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "How long is maternity leave in Malta?",
            answer:
              "Maternity leave in Malta is 18 weeks. The first 14 weeks are paid in full by the employer; the final 4 weeks are unpaid by the employer but covered by the government's Maternity Leave Benefit of €213.54 per week. At least 6 weeks must be taken after the birth.",
          },
          {
            question: "Who pays for maternity leave in Malta?",
            answer:
              "The employer pays the first 14 weeks at the employee's full salary. The remaining 4 weeks are paid by the government through the Maternity Leave Benefit (€213.54/week in 2026), which both employed and self-employed mothers can claim via mysocialsecurity.gov.mt.",
          },
          {
            question:
              "How much maternity benefit does a self-employed mother get in Malta?",
            answer:
              "Self-occupied mothers do not receive employer pay; instead they get the Maternity Benefit of €221.78 per week for 14 weeks, plus the 4-week Maternity Leave Benefit of €213.54 per week — a total of around €3,959 over 18 weeks in 2026.",
          },
          {
            question: "How long is paternity leave in Malta?",
            answer:
              "Fathers in Malta are entitled to 10 working days of paternity leave on full pay, funded by the employer, on the birth or adoption of their child. This applies equally to all employees regardless of length of service.",
          },
          {
            question:
              "Do I get maternity benefit if I am not employed in Malta?",
            answer:
              "Women who are not entitled to employer-paid maternity leave (for example those not in employment but satisfying social security conditions) may qualify for the flat-rate Maternity Benefit of €140.29 per week for 14 weeks in 2026.",
          },
        ]}
      />
      <main role="main" aria-label="Maternity Leave Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <MaternityCalculator />
          <RelatedGuide
            href="/blog/malta-maternity-leave-2026-guide"
            title="Malta Maternity Leave 2026: Complete Guide"
            description="Full rules on the 18 weeks, employer obligations, the government benefit and how to apply."
          />
          <AffiliateCard slug="maternity" />
          <RelatedCalculators slug="maternity" />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
