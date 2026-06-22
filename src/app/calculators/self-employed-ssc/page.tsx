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
import { SelfEmployedSSCCalculator } from "./_components/self-employed-ssc-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Self-Employed SSC Calculator Malta 2026 | Malta Calculator",
  description:
    "Calculate Malta Class 2 SSC for 2026. SA, SB and SC categories, 15% of net income, €36.18–€83.89 weekly rates and April, August, December instalments.",
  keywords: [
    "malta class 2 ssc calculator",
    "self-employed ssc malta 2026",
    "self-occupied social security malta",
    "class 2 contributions malta",
    "SA SB SC rates malta",
    "15% ssc self-employed malta",
    "malta ni self-employed",
    "social security instalments malta",
  ],
  alternates: pageAlternates("/calculators/self-employed-ssc"),
  openGraph: {
    ...ogMetadata,
    title: "Self-Employed SSC Calculator Malta 2026 | Malta Calculator",
    url: `${SITE_URL}/calculators/self-employed-ssc`,
    images: [getDynamicOgImage("Self-Employed SSC Calculator Malta 2026")],
  },
  twitter: {
    ...twitterMetadata,
    title: "Self-Employed SSC Calculator Malta 2026 | Malta Calculator",
    images: [getDynamicOgImage("Self-Employed SSC Calculator Malta 2026")],
  },
};

export default function SelfEmployedSSCPage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Self-Employed SSC Calculator",
            url: `${SITE_URL}/calculators/self-employed-ssc`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Self-Employed SSC Calculator Malta"
        description="Calculate Class 2 social security contributions for self-occupied persons in Malta: SA, SB and SC categories, weekly rates and the three yearly instalments."
        slug="self-employed-ssc"
        category="Social Security Calculator"
        features={[
          "Official 2026 Class 2 rates (SA, SB, SC)",
          "15% of previous year's net income formula",
          "Born before/after 1962 thresholds",
          "April, August and December instalment amounts",
          "Reduced rate for students, pensioners and part-timers",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question:
              "How much social security does a self-employed person pay in Malta?",
            answer:
              "Self-occupied persons in Malta pay Class 2 SSC equal to 15% of the annual net income earned in the previous year, expressed as a weekly rate. In 2026 the minimum (category SA) is €36.18 per week for income up to €12,543.72, and the maximum (category SC) is €83.89 per week for those born in 1962 or later, or €73.56 for those born before 1962.",
          },
          {
            question: "What are the Class 2 SSC categories SA, SB and SC?",
            answer:
              "SA is the flat minimum rate for annual net income up to €12,543.72 (€36.18/week in 2026). SB covers the middle band, paying exactly 15% of annual net income divided by 52. SC is the capped maximum: above €25,500 (born before 1962, €73.56/week) or above €29,083.36 (born 1962 or later, €83.89/week).",
          },
          {
            question: "When are Class 2 contributions paid in Malta?",
            answer:
              "Class 2 SSC is paid to the Malta Tax & Customs Administration in three instalments per year — by the end of April, August and December. Each instalment covers a third of the annual amount; this calculator shows the exact figure per instalment.",
          },
          {
            question:
              "Can students or pensioners pay reduced SSC in Malta when self-occupied?",
            answer:
              "Yes. Part-time self-occupied women, full-time students under 25 and pensioners whose earnings fall below the SA threshold can opt to pay 15% of their actual basic weekly income instead of the standard SA minimum of €36.18 per week.",
          },
          {
            question:
              "Do Class 2 contributions count towards a pension in Malta?",
            answer:
              "Yes. Class 2 contributions count towards the contributory state pension and other contributory benefits exactly like employee Class 1 contributions. Paying below the full applicable rate may proportionally reduce your future pension entitlement.",
          },
        ]}
      />
      <main role="main" aria-label="Self-Employed SSC Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <SelfEmployedSSCCalculator />
          <RelatedGuide
            href="/blog/malta-ssc-contributions-2026-explained"
            title="Malta SSC Contributions 2026: Rates, Caps & Categories"
            description="The full guide to Malta's social security system — Class 1 and Class 2, weekly caps and the 1962 threshold."
          />
          <AffiliateCard slug="self-employed-ssc" />
          <RelatedCalculators slug="self-employed-ssc" />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
