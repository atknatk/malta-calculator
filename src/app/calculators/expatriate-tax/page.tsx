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
import { ExpatriateTaxCalculator } from "./_components/expatriate-tax-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Highly Skilled Individuals 15% Tax Calculator | Malta",
  description:
    "Calculate Malta's 15% flat tax under the new Highly Skilled Individuals Rules (LN 20/2026, ex-HQP). €65,000 threshold, savings vs standard rates. Free.",
  keywords: [
    "malta highly skilled individuals tax",
    "LN 20 2026 malta",
    "malta 15% flat tax expat",
    "HQP replacement malta",
    "highly qualified persons malta 2026",
    "expat tax calculator malta",
    "€65000 threshold malta",
    "malta expat 15 percent",
  ],
  alternates: pageAlternates("/calculators/expatriate-tax"),
  openGraph: {
    ...ogMetadata,
    title: "Highly Skilled Individuals 15% Tax Calculator | Malta",
    url: `${SITE_URL}/calculators/expatriate-tax`,
    images: [getDynamicOgImage("Highly Skilled Individuals Tax Calculator")],
  },
  twitter: {
    ...twitterMetadata,
    title: "Highly Skilled Individuals 15% Tax Calculator | Malta",
    images: [getDynamicOgImage("Highly Skilled Individuals Tax Calculator")],
  },
};

export default function ExpatriateTaxPage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Highly Skilled Individuals Tax Calculator",
            url: `${SITE_URL}/calculators/expatriate-tax`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Highly Skilled Individuals Tax Calculator Malta"
        description="Calculate the 15% flat tax for highly skilled expatriates in Malta under L.N. 20 of 2026 and compare it with standard progressive rates."
        slug="expatriate-tax"
        category="Tax Calculator"
        features={[
          "15% flat rate under LN 20 of 2026",
          "€65,000 minimum income eligibility check",
          "€7M cap with 35% on the excess",
          "Savings vs standard progressive rates",
          "Replaces the old HQP scheme",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question:
              "What replaced the HQP (Highly Qualified Persons) scheme in Malta?",
            answer:
              "From 1 January 2026, the Tax Treatment of Highly Skilled Individuals Rules (Legal Notice 20 of 2026) consolidated five expat schemes — HQP, Qualifying Employment in Innovation and Creativity, Aviation, Maritime, and Senior Employees of Family Offices — into a single framework with a 15% flat rate on eligible employment income.",
          },
          {
            question:
              "What is the minimum salary for the 15% expat tax rate in Malta?",
            answer:
              "The minimum annual employment income is €65,000 in 2026, rising by €10,000 every five years. Income from an eligible role at or above this threshold is taxed at a flat 15%, with income exceeding €7,000,000 per year taxed at 35%.",
          },
          {
            question:
              "Which jobs qualify for Malta's Highly Skilled Individuals rules?",
            answer:
              "Eligible roles are in financial services, gaming, aviation, maritime, oil and gas servicing, family offices, and back office or treasury management operations. Beneficiaries must hold relevant professional qualifications or five years of comparable experience, hold private medical insurance, and must not be domiciled in Malta.",
          },
          {
            question: "How long does the 15% rate last in Malta?",
            answer:
              "The benefit lasts 5 years and is renewable for two additional 5-year periods (up to 15 years in total). Under the sunset clause, all benefits under the rules expire on 31 December 2040.",
          },
          {
            question:
              "Is the 15% flat rate always better than normal Malta tax rates?",
            answer:
              "At the €65,000 threshold the 15% rate already saves around €3,600 per year versus standard single rates, and savings grow with income — at €100,000 the saving is about €10,600. The flat rate applies to the whole qualifying income with no tax-free bands, so this calculator compares both regimes for your exact salary.",
          },
        ]}
      />
      <main role="main" aria-label="Highly Skilled Individuals Tax Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <ExpatriateTaxCalculator />
          <RelatedGuide
            href="/blog/malta-expat-tax-hqp-scheme-guide"
            title="Malta Expat Tax: 15% Flat Rate Guide"
            description="Background on Malta's special expat tax regimes, eligibility conditions and how to apply."
          />
          <AffiliateCard slug="expatriate-tax" />
          <RelatedCalculators slug="expatriate-tax" />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
