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
import { RentalTaxCalculator } from "./_components/rental-tax-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Rental Income Tax Calculator | Malta Calculator",
  description:
    "Compare Malta's 15% flat rental tax (TA24) with progressive rates. Includes the 20% maintenance allowance, ground rent and loan interest deductions.",
  keywords: [
    "malta rental income tax calculator",
    "malta 15% rental tax",
    "TA24 malta",
    "rental tax malta 2026",
    "malta landlord tax",
    "rental income flat rate malta",
    "maintenance allowance malta rental",
    "progressive rental tax malta",
    "malta property rental tax",
  ],
  alternates: pageAlternates("/calculators/rental-tax"),
  openGraph: {
    ...ogMetadata,
    title: "Rental Income Tax Calculator | Malta Calculator",
    url: `${SITE_URL}/calculators/rental-tax`,
    images: [getDynamicOgImage("Rental Income Tax Calculator Malta")],
  },
  twitter: {
    ...twitterMetadata,
    title: "Rental Income Tax Calculator | Malta Calculator",
    images: [getDynamicOgImage("Rental Income Tax Calculator Malta")],
  },
};

export default function RentalTaxPage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Rental Income Tax Calculator",
            url: `${SITE_URL}/calculators/rental-tax`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Rental Income Tax Calculator Malta"
        description="Calculate rental income tax in Malta. Compare the 15% flat rate (TA24) against standard progressive income tax rates with all allowable deductions."
        slug="rental-tax"
        category="Tax Calculator"
        features={[
          "15% flat rate vs progressive rate comparison",
          "20% maintenance allowance calculation",
          "Ground rent, licence fee and loan interest deductions",
          "Personalised recommendation with savings",
          "2026 Malta tax brackets",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question:
              "What is the 15% flat rate option for rental income tax in Malta?",
            answer:
              "In Malta, landlords can opt to pay a final withholding tax of 15% on gross rental income (form TA24) instead of declaring it as part of their normal income and paying tax at progressive rates. The 15% is applied to the gross rental income with no deductions allowed. It is a final tax, meaning no further tax is due on that rental income.",
          },
          {
            question:
              "Should I choose the 15% flat rate or normal tax rate for rental income in Malta?",
            answer:
              "It depends on your marginal tax rate and expenses. If your other income puts you in the 25% or 35% bracket, the 15% flat rate is usually cheaper. If your total income is low (within the 0% or 15% bands) or you have large deductible expenses, declaring at progressive rates can result in less tax. This calculator compares both options with your actual numbers.",
          },
          {
            question:
              "What expenses can be deducted from rental income in Malta?",
            answer:
              "Under the progressive route you may deduct ground rent payable, licence fees under the Guest Houses and Holiday Furnished Premises Act, interest on loans taken to acquire or improve the property, and a further 20% maintenance allowance calculated on the rent remaining after ground rent and licence fees. Under the 15% TA24 option no deductions are permitted.",
          },
          {
            question:
              "Is it mandatory to register rental income with the tax authorities in Malta?",
            answer:
              "Yes, all rental income in Malta must be declared to the Malta Tax & Customs Administration. If you opt for the 15% final withholding tax, the TA24 form and payment are due by 30 April of the following year. Private residential leases must also be registered with the Housing Authority under the Private Residential Leases Act.",
          },
          {
            question:
              "Can I use the 15% rate for some properties and progressive rates for others?",
            answer:
              "No. The chosen method applies to all your rental income in that tax year. You must select one taxation method per year and apply it consistently across all rental properties — you can, however, switch methods from one year to the next.",
          },
        ]}
      />
      <main role="main" aria-label="Rental Income Tax Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <RentalTaxCalculator />
          <RelatedGuide
            href="/blog/malta-rental-income-tax-15-percent-guide"
            title="Malta Rental Income Tax 2026: 15% Flat Rate Guide"
            description="Everything about the TA24 option, deadlines, deductions under the progressive route, and how to register your lease."
          />
          <AffiliateCard slug="rental-tax" />
          <RelatedCalculators slug="rental-tax" />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
