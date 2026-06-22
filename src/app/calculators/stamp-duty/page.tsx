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
import { StampDutyCalculator } from "./_components/stamp-duty-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Stamp Duty Calculator | Malta Calculator",
  description:
    "Calculate Malta stamp duty on your property purchase. Covers the 5% standard rate, first-time buyer exemption on the first €200,000, and promise-of-sale duty.",
  alternates: pageAlternates("/calculators/stamp-duty"),
  openGraph: {
    ...ogMetadata,
    title: "Stamp Duty Calculator | Malta Calculator",
    url: `${SITE_URL}/calculators/stamp-duty`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Stamp Duty Calculator | Malta Calculator",
  },
};

export default function StampDutyPage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Stamp Duty Calculator",
            url: `${SITE_URL}/calculators/stamp-duty`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Stamp Duty Calculator Malta"
        description="Calculate stamp duty on property purchases in Malta. Includes the 5% standard rate, first-time buyer exemption on the first €200,000, and reduced rates."
        slug="stamp-duty"
        category="Property Tax Calculator"
        features={[
          "5% standard stamp duty rate",
          "First-time buyer exemption on €200,000",
          "Second property calculations",
          "Promise of sale (AIP) vs final deed",
          "2026 Malta tax rates",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "What is the stamp duty rate on property in Malta?",
            answer:
              "The standard stamp duty rate on property purchases in Malta is 5% of the higher of the purchase price or the market value of the property. This applies to most residential and commercial property transactions. The duty is calculated on the full purchase price with no tax-free threshold for standard purchases.",
          },
          {
            question:
              "Do first-time buyers get a stamp duty exemption in Malta?",
            answer:
              "Yes, first-time buyers purchasing their sole ordinary residence in Malta benefit from a stamp duty exemption on the first €200,000 of the property value. This means stamp duty of 5% is only applied to the portion above €200,000, saving first-time buyers up to €10,000.",
          },
          {
            question: "Who pays stamp duty on property in Malta?",
            answer:
              "In Malta, stamp duty is generally paid by the buyer (purchaser) of the property. It is due on the higher of the agreed purchase price or the property's market value as determined by the Commissioner for Revenue. The stamp duty is payable on both the promise of sale (konvenju) and the final deed of transfer.",
          },
          {
            question: "When is stamp duty due on a property purchase in Malta?",
            answer:
              "Stamp duty in Malta is due in two stages. A portion (typically 1% on the promise of sale/AIP) is paid when the preliminary agreement is signed. The remaining balance is paid upon signing the final deed of sale. The total stamp duty must be settled within the legal deadlines specified by the Commissioner for Revenue.",
          },
          {
            question:
              "Is stamp duty payable on an AIP (Agreement in Principle) transfer in Malta?",
            answer:
              "Yes, stamp duty is payable when a promise of sale (konvenju or AIP) is transferred to a third party in Malta. The transferee is liable to pay stamp duty on the consideration paid for the transfer of the promise of sale. Additional duty may also apply on any profit made from the assignment.",
          },
        ]}
      />
      <main role="main" aria-label="Stamp Duty Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <StampDutyCalculator />
          <RelatedGuide
            href="/blog/malta-stamp-duty-complete-guide-2026"
            title="Malta Stamp Duty Complete Guide 2026"
            description="Learn everything about property stamp duty in Malta, including rates, exemptions, and first-time buyer benefits."
          />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
