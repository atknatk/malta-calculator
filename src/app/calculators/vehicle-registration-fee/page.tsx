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
    "Calculate Malta vehicle registration fees: €15 admin fee, number plates, the €55 inspection fee for UK/non-EU used imports and first-year road licence.",
  keywords: [
    "Malta vehicle registration",
    "registration fees Malta",
    "number plates cost Malta",
    "Transport Malta fees",
    "import inspection fee Malta",
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
        description="Calculate all vehicle registration fees in Malta — administration fee, number plates, the import inspection fee, and first-year road tax — separate from the one-time CO2-based registration tax."
        slug="vehicle-registration-fee"
        category="Vehicle Registration Calculator"
        features={[
          "Administration fee calculation",
          "Number plate costs (random, personalised, customised)",
          "€55 inspection fee for used UK / non-EU imports",
          "First year road tax estimation",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "What are the vehicle registration fees in Malta?",
            answer:
              "Transport Malta charges a €15 administration fee, number plates (cars and vans: €70 random pair / €200 personalised / €1,500 customised, €45 for a third plate; motorcycles: €35 random / €100 personalised / €1,500 customised), a €55 inspection fee for used vehicles imported from the UK or outside the EU, and the first year road licence (circulation tax). These are separate from the one-time CO2 + length-based registration tax, which is a percentage of the vehicle's Registration Value (invoice / CIF value for new cars, Transport Malta valuation for used cars) and uses the WLTP or NEDC CO2 table.",
          },
          {
            question:
              "Is this calculator the same as Malta's registration TAX calculator?",
            answer:
              "No. This calculator estimates only the fixed registration fees (admin, plates, import inspection fee, first year road tax). It does NOT calculate the one-time vehicle registration tax, which is a percentage of the make-and-model Registration Value published by Transport Malta. For an exact registration tax figure you need to look up your vehicle on the official eReg valuation tool at valuation.vehicleregistration.gov.mt, or contact Transport Malta directly.",
          },
          {
            question: "How much do personalised number plates cost in Malta?",
            answer:
              "A random pair of number plates costs €70 for cars, vans and commercial vehicles, and €35 for motorcycles. Personalised plates (where you choose specific letters/numbers, subject to availability) cost €200 for cars and €100 for motorcycles. Fully customised plates cost €1,500. A third plate costs €45, and vintage silver-on-black plates cost €35 per plate. All plate fees are payable to Transport Malta at the time of registration.",
          },
          {
            question:
              "What is the administration fee for vehicle registration in Malta?",
            answer:
              "Transport Malta charges a flat €15 administration fee for processing a vehicle registration application. This fee is the same across vehicle categories (private car, motorcycle, van, commercial) and covers the cost of entering the vehicle into the national register and issuing the V5 (logbook).",
          },
          {
            question:
              "Is an inspection or roadworthiness test required when registering a vehicle in Malta?",
            answer:
              "Transport Malta charges a €55 inspection fee for used vehicles imported from the UK or from outside the EU; this is a Transport Malta inspection, not the Vehicle Roadworthiness Test (VRT). A VRT at a licensed testing centre (up to €30.27 for a car) is also needed for non-EU imports over 4 years old, or over 1 year with more than 160,000 km, and for UK imports unless the car is 4 years old or less with 160,000 km or less. Valid roadworthiness certificates from other EU countries are recognised. Older Euro standards are not banned for used cars — they simply pay a higher registration tax; only brand-new cars must meet the latest standard.",
          },
          {
            question:
              "Do electric vehicles pay registration fees and road tax in Malta?",
            answer:
              "Battery electric vehicles and plug-in hybrids with an electric-only range of at least 50 km are fully exempt from the one-time registration tax. They also pay €0 annual road licence (circulation tax) for years 0–5, counted from the year of manufacture, and €10 a year after that. However, they still pay the fixed fees: €15 admin, €70 plates, and the €55 inspection fee if imported used from the UK or outside the EU. New battery electric car buyers in 2026 can claim €8,000 (cars priced up to €40,000) or €6,000 (€40,000–€100,000), plus €1,000 for scrapping a car at least 10 years old (€500 if its licence expired more than 3 months earlier) and €1,000 extra for Gozo residents. The 2026 used EV grant pays €4,000 if the car was first registered abroad up to 3 months earlier, or €3,000 if 3–6 months earlier.",
          },
        ]}
      />
      <main role="main" aria-label="Vehicle Registration Fee Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <VehicleRegistrationFeeCalculator />
          <RelatedGuide
            href="/blog/malta-vehicle-registration-tax-guide-2026"
            title="Malta Vehicle Registration Tax Guide 2026"
            description="Understand how Malta's one-time vehicle registration tax is calculated from CO2 emissions and vehicle value, plus all the fixed fees."
          />
          <AffiliateCard slug="vehicle-registration-fee" />
          <RelatedCalculators slug="vehicle-registration-fee" />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
