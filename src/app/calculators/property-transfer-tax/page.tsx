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
import { PropertyTransferTaxCalculator } from "./_components/property-transfer-tax-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Property Transfer Tax Calculator | Malta Calculator",
  description:
    "Calculate Malta's 8% final withholding tax when selling property. Compare 5%, 2%, 10% and 12% reduced rates, sole residence exemption, and net proceeds.",
  keywords: [
    "malta property transfer tax calculator",
    "malta 8% final withholding tax",
    "selling property tax malta",
    "malta capital gains tax property",
    "property transfer tax rates malta",
    "malta seller tax property",
    "sole residence exemption malta",
    "inherited property tax malta",
    "malta property tax 2026",
  ],
  alternates: pageAlternates("/calculators/property-transfer-tax"),
  openGraph: {
    ...ogMetadata,
    title: "Property Transfer Tax Calculator | Malta Calculator",
    url: `${SITE_URL}/calculators/property-transfer-tax`,
    images: [getDynamicOgImage("Property Transfer Tax Calculator Malta")],
  },
  twitter: {
    ...twitterMetadata,
    title: "Property Transfer Tax Calculator | Malta Calculator",
    images: [getDynamicOgImage("Property Transfer Tax Calculator Malta")],
  },
};

export default function PropertyTransferTaxPage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Property Transfer Tax Calculator",
            url: `${SITE_URL}/calculators/property-transfer-tax`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Property Transfer Tax Calculator Malta"
        description="Calculate the final withholding tax due when selling property in Malta. Covers the 8% standard rate, 5%, 2%, 10% and 12% scenarios, the sole residence exemption, and net proceeds after tax."
        slug="property-transfer-tax"
        category="Property Tax Calculator"
        features={[
          "8% standard final withholding tax",
          "5% rate for sales within 5 years",
          "2% sole residence rate and full 3-year exemption",
          "12% inherited property gain calculation",
          "Net proceeds after tax and agency fees",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "How much tax do I pay when selling property in Malta?",
            answer:
              "Malta charges a final withholding tax of 8% on the transfer value when you sell immovable property. The tax is calculated on the full selling price, not on your profit, and is deducted by the notary on the deed of sale. Reduced rates of 5% and 2% apply in specific situations, and a full exemption exists for long-held sole residences.",
          },
          {
            question:
              "Is selling my home in Malta exempt from property transfer tax?",
            answer:
              "Yes, if the property was owned and occupied as your sole ordinary residence for at least 3 consecutive years and you sell it within 12 months of vacating it, the transfer is fully exempt from property transfer tax. If you sell your sole residence within 3 years of buying it, a reduced 2% rate applies instead of the standard 8%.",
          },
          {
            question: "What is the 5% property transfer tax rate in Malta?",
            answer:
              "A reduced rate of 5% (instead of 8%) applies when the property is transferred within 5 years from the date of acquisition, provided the property does not form part of a project. This commonly benefits people who bought a property recently and are reselling it.",
          },
          {
            question: "How is inherited property taxed when sold in Malta?",
            answer:
              "If the property was inherited after 24 November 1992, tax is charged at 12% on the difference between the selling price and the value declared in the causa mortis deed. If it was inherited on or before 24 November 1992, a flat 7% final withholding tax applies on the transfer value.",
          },
          {
            question:
              "Who pays the property transfer tax in Malta, the buyer or the seller?",
            answer:
              "The seller pays the property transfer tax (final withholding tax) in Malta. The buyer pays stamp duty, typically at 5% of the property value. Both are collected by the notary at the deed of sale and forwarded to the Malta Tax & Customs Administration.",
          },
        ]}
      />
      <main role="main" aria-label="Property Transfer Tax Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <PropertyTransferTaxCalculator />
          <RelatedGuide
            href="/blog/malta-property-transfer-tax-guide-2026"
            title="Malta Property Transfer Tax Guide 2026"
            description="Learn all costs when buying or selling property in Malta — stamp duty, the 8% final withholding tax, notarial fees, and exemptions."
          />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
