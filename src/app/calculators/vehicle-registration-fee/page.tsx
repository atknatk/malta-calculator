import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
  pageAlternates,
} from "@/app/shared-metadata";
import { VehicleRegistrationFeeCalculator } from "./_components/vehicle-registration-fee-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Vehicle Registration Fee Calculator | Malta Calculator",
  description:
    "Calculate all vehicle registration fees in Malta including administration, number plates, VRT inspection, and first-year road tax. Free calculator.",
  keywords: [
    "Malta vehicle registration",
    "registration fees Malta",
    "number plates cost Malta",
    "Transport Malta fees",
    "VRT inspection fee",
    "road tax Malta",
  ],
  alternates: pageAlternates("/calculators/vehicle-registration-fee"),
  openGraph: {
    ...ogMetadata,
    title: "Vehicle Registration Fee Calculator Malta",
    url: `${SITE_URL}/calculators/vehicle-registration-fee`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Vehicle Registration Fee Calculator Malta",
  },
};

export default function VehicleRegistrationFeePage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Vehicle Registration Fee",
            url: `${SITE_URL}/calculators/vehicle-registration-fee`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Vehicle Registration Fee Calculator"
        description="Calculate all vehicle registration fees in Malta"
        slug="vehicle-registration-fee"
        category="Vehicle Registration Calculator"
        features={[
          "Administration fee calculation",
          "Number plate costs (random, personalised, customised)",
          "VRT inspection fee for imports",
          "First year road tax estimation",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "What are the vehicle registration fees in Malta?",
            answer:
              "Transport Malta charges a €15 administration fee, number plates (€70 random / €200 personalised / €1,500 customised for cars; €35 random for motorcycles), a €55 VRT inspection fee for imported vehicles, and the first year road licence (circulation tax). These are separate from the one-time CO2 + length-based registration tax, which is calculated as a percentage of the vehicle's Registration Value (CIF) and depends on the Euro emissions standard.",
          },
          {
            question:
              "Is this calculator the same as Malta's registration TAX calculator?",
            answer:
              "No. This calculator estimates only the fixed registration fees (admin, plates, VRT inspection, first year road tax). It does NOT calculate the one-time vehicle registration tax, which is a percentage of the make-and-model Registration Value published by Transport Malta. For an exact registration tax figure you need to look up your vehicle on the official eReg valuation tool at valuation.vehicleregistration.gov.mt, or contact Transport Malta directly.",
          },
          {
            question: "How much do personalised number plates cost in Malta?",
            answer:
              "Random number plates cost €70 for cars, vans and commercial vehicles, and €35 for motorcycles. Personalised plates (where you choose specific letters/numbers, subject to availability) cost €200. Fully customised plates with premium formats cost €1,500. All plate fees are payable to Transport Malta at the time of registration.",
          },
          {
            question:
              "What is the administration fee for vehicle registration in Malta?",
            answer:
              "Transport Malta charges a flat €15 administration fee for processing a vehicle registration application. This fee is the same across vehicle categories (private car, motorcycle, van, commercial) and covers the cost of entering the vehicle into the national register and issuing the V5 (logbook).",
          },
          {
            question:
              "Is a VRT inspection required when registering a vehicle in Malta?",
            answer:
              "A €55 VRT (Vehicle Roadworthiness Test) inspection is required for vehicles being imported into Malta — including from other EU countries and from the UK / non-EU. Brand-new vehicles supplied through an authorised Maltese dealer with a valid Certificate of Conformity are exempt from the initial VRT. Only Euro 6 or higher vehicles can be newly registered in Malta.",
          },
          {
            question:
              "Do electric vehicles pay registration fees and road tax in Malta?",
            answer:
              "Battery electric vehicles and plug-in hybrids with an electric-only range of at least 50 km are fully exempt from the one-time registration tax. They also pay €0 annual road licence (circulation tax) for the first 5 years from first registration. However, they still pay the fixed fees: €15 admin, €70 plates, and €55 VRT inspection if imported. New EV buyers in 2026 can also claim grants of €8,000 (vehicles ≤€40,000) or €6,000 (€40K–€100K) plus a €1,000 scrappage bonus (+€1,000 in Gozo).",
          },
        ]}
      />
      <main role="main" aria-label="Vehicle Registration Fee Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <VehicleRegistrationFeeCalculator />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
