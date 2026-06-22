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
} from "@/app/shared-metadata";
import { VehicleRegistrationTaxCalculator } from "./_components/vehicle-registration-tax-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Vehicle Registration Tax Calculator | Malta Calculator",
  description:
    "Calculate vehicle registration tax in Malta based on CO2 emissions. Includes electric/hybrid discounts, age depreciation, and EU/non-EU import duties.",
  alternates: pageAlternates("/calculators/vehicle-registration-tax"),
  openGraph: {
    ...ogMetadata,
    title: "Vehicle Registration Tax Calculator Malta",
    url: `${SITE_URL}/calculators/vehicle-registration-tax`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Vehicle Registration Tax Calculator Malta",
  },
};

export default function VehicleRegistrationTaxPage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Vehicle Registration Tax",
            url: `${SITE_URL}/calculators/vehicle-registration-tax`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Vehicle Registration Tax Calculator Malta"
        description="Calculate vehicle registration tax in Malta based on CO2 emissions, vehicle value, and age with electric and hybrid discounts."
        slug="vehicle-registration-tax"
        category="Vehicle Tax Calculator"
        features={[
          "CO2 emissions-based VRT calculation",
          "Vehicle value factor adjustment",
          "Age depreciation for used vehicles",
          "Electric and hybrid vehicle exemptions",
          "EU and non-EU import duty estimation",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question:
              "How is Vehicle Registration Tax (VRT) calculated in Malta?",
            answer:
              "Vehicle Registration Tax in Malta is calculated using a formula that combines the vehicle's CO2 emissions (g/km) with its taxable value. The CO2 emissions determine a rate per gram, which is then applied to the vehicle's value after depreciation adjustments. Higher CO2 vehicles attract significantly higher tax rates.",
          },
          {
            question:
              "What role do CO2 emissions play in Malta VRT calculation?",
            answer:
              "CO2 emissions are the primary driver of VRT in Malta. Vehicles are categorised into CO2 bands: 0 g/km (electric, lowest/zero rate), up to 100 g/km, 101-130 g/km, 131-160 g/km, 161-200 g/km, and above 200 g/km (highest rate). The higher the CO2 output, the greater the percentage of vehicle value charged as VRT.",
          },
          {
            question:
              "How does vehicle value affect the registration tax in Malta?",
            answer:
              "The vehicle's retail value (or customs value for imports) forms the tax base for VRT in Malta. This value is subject to age-based depreciation: the longer a vehicle has been in use, the lower its taxable value. Transport Malta uses official depreciation schedules to determine the adjusted taxable value.",
          },
          {
            question:
              "Is there a difference in VRT for new versus used vehicles in Malta?",
            answer:
              "Yes. New vehicles are taxed on their full retail price, while used vehicles benefit from age depreciation which reduces the taxable value. For example, a vehicle that is 3 years old may have its value reduced by a set percentage before VRT is applied. This makes second-hand imports generally less expensive from a VRT perspective.",
          },
          {
            question: "Are there VRT exemptions in Malta?",
            answer:
              "Yes, certain vehicle categories may qualify for VRT exemptions or reductions in Malta. Fully electric vehicles (BEV) are exempt from VRT or pay a reduced rate. Vehicles adapted for use by persons with disabilities may also qualify for exemptions. Diplomatic vehicles and certain government vehicles have separate rules. Applying for exemptions requires documentation submitted to Transport Malta.",
          },
        ]}
      />
      <main role="main" aria-label="Vehicle Registration Tax Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <VehicleRegistrationTaxCalculator />
          <RelatedGuide
            href="/blog/malta-vehicle-registration-tax-guide-2026"
            title="Malta Vehicle Registration Tax Guide 2026"
            description="Complete guide to VRT rates, CO2 bands, and exemptions for vehicles in Malta."
          />
          <AffiliateCard slug="vehicle-registration-tax" />
          <RelatedCalculators slug="vehicle-registration-tax" />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
