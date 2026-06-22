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
import { InWorkBenefitCalculator } from "./_components/in-work-benefit-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "In-Work Benefit Calculator Malta 2026 | Malta Calculator",
  description:
    "Check your Malta In-Work Benefit for 2026: eligibility, income bands and up to €1,627 per child yearly for working families. Paid quarterly. Free tool.",
  keywords: [
    "malta in-work benefit calculator",
    "in-work benefit 2026 malta",
    "in work benefit eligibility malta",
    "€1627 per child malta",
    "working families benefit malta",
    "DSS in-work benefit",
    "malta family benefits 2026",
    "in-work benefit income thresholds",
  ],
  alternates: pageAlternates("/calculators/in-work-benefit"),
  openGraph: {
    ...ogMetadata,
    title: "In-Work Benefit Calculator Malta 2026 | Malta Calculator",
    url: `${SITE_URL}/calculators/in-work-benefit`,
    images: [getDynamicOgImage("In-Work Benefit Calculator Malta 2026")],
  },
  twitter: {
    ...twitterMetadata,
    title: "In-Work Benefit Calculator Malta 2026 | Malta Calculator",
    images: [getDynamicOgImage("In-Work Benefit Calculator Malta 2026")],
  },
};

export default function InWorkBenefitPage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "In-Work Benefit Calculator",
            url: `${SITE_URL}/calculators/in-work-benefit`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="In-Work Benefit Calculator Malta"
        description="Check eligibility for Malta's In-Work Benefit and the maximum yearly amount per child for single parents and couples in 2026."
        slug="in-work-benefit"
        category="Government Benefits Calculator"
        features={[
          "2026 income bands for all household types",
          "Up to €1,627 per child full-rate band",
          "€327 flat rate for higher incomes",
          "Second-earner €3,000 rule for couples",
          "Quarterly payment schedule",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "What is the In-Work Benefit in Malta?",
            answer:
              "The In-Work Benefit is a payment by Malta's Department of Social Security to working parents with children under 23 living in their household. It rewards employment: at least one parent must be in gainful employment, and the amount depends on household type, income and number of children. It is paid quarterly in January, April, July and October.",
          },
          {
            question:
              "How much is the In-Work Benefit per child in Malta in 2026?",
            answer:
              "In 2026 the maximum is €1,627 per child per year for single parents earning €6,600–€24,180.99 and for couples where both work with combined income €10,000–€36,846.99. Couples with one earner (€6,600–€27,180.99) get up to €856 per child. Higher incomes — up to €35,000 (€50,000 for two-earner couples) — receive a flat €327 per child.",
          },
          {
            question: "Who qualifies for the In-Work Benefit in Malta?",
            answer:
              "Parents in gainful employment with children under 23 living at home. Single parents must earn over €6,600; couples where both work need combined income over €10,000 with each earning at least €3,000; couples with one earner need over €6,600. Income above the band ceiling (€35,000 or €50,000 depending on household) disqualifies.",
          },
          {
            question: "When is the In-Work Benefit paid in Malta?",
            answer:
              "Quarterly, on the first Saturday of January, April, July and October. Each payment covers the previous quarter and is deposited directly into the claimant's bank account.",
          },
          {
            question: "How do I apply for the In-Work Benefit in Malta?",
            answer:
              "Apply online through mysocialsecurity.gov.mt using your e-ID. The 2026 benefit is calculated on the income declared for basic year 2024. Existing beneficiaries are usually renewed automatically, but changes in income or household composition should be reported.",
          },
        ]}
      />
      <main role="main" aria-label="In-Work Benefit Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <InWorkBenefitCalculator />
          <RelatedGuide
            href="/blog/malta-childrens-allowance-guide-2026"
            title="Malta Children's Allowance 2026: Complete Guide"
            description="The other key family benefit — children's allowance rates, income thresholds and the birth bonus."
          />
          <AffiliateCard slug="in-work-benefit" />
          <RelatedCalculators slug="in-work-benefit" />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
