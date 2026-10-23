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
    "Calculate Malta vehicle registration tax from CO2 (WLTP or NEDC), length and value. Covers EV/PHEV exemption, 30% hybrid CO2 cut and the non-EU minimum tax.",
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
        description="Calculate Malta's one-time vehicle registration tax from CO2 emissions (WLTP or NEDC), car length and Registration Value, including EV/PHEV exemptions and the non-EU minimum tax."
        slug="vehicle-registration-tax"
        category="Vehicle Tax Calculator"
        features={[
          "CO2 + length registration tax formula (SOPV-02)",
          "WLTP and NEDC CO2 rate tables by Euro standard",
          "30% CO2 reduction for non-plug-in hybrids",
          "BEV and PHEV (50 km+ range) exemption",
          "Non-EU minimum tax for used cars over 5 years",
          "EU and non-EU import duty and VAT estimation",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "How is vehicle registration tax calculated in Malta?",
            answer:
              "For M1 passenger cars, Transport Malta SOPV-02 sets the formula: Registration Tax = (CO2 g/km × Registration Value × CO2 rate%) + (Length mm × Registration Value × Length rate%). The Registration Value is the invoice / CIF value for a new car, and Transport Malta's online valuation (the Malta market value) for a used car. Higher CO2 and longer cars attract higher percentage rates. If no CO2 value is available, the highest band applies.",
          },
          {
            question:
              "What role do CO2 emissions play in Malta's registration tax?",
            answer:
              "CO2 emissions decide the main rate. Cars whose original Certificate of Conformity shows WLTP values (generally type-approved from 2021) use the WLTP table: 0.040% for 0–120 g/km, 0.045% for 121–140, 0.050% for 141–150, 0.060% for 151–160, 0.070% for 161–190, 0.100% for 191–230, 0.110% for 231–260 and 0.143% above 260 g/km. Other cars use the NEDC table, where the rate also depends on the car's Euro standard — from 0.07% for a Euro 6 car up to 100 g/km to 0.47% for a car three or more standards behind above 250 g/km (older high-particulate diesels pay up to 0.75%). Non-plug-in hybrids have their CO2 figure reduced by 30% and LPG cars by 10% before the table is applied.",
          },
          {
            question:
              "How does vehicle value affect the registration tax in Malta?",
            answer:
              "Both the CO2 part and the length part of the formula are multiplied by the Registration Value, so a more expensive car pays proportionally more. For new cars this is the invoice / CIF value. For used cars it is Transport Malta's online valuation at valuation.vehicleregistration.gov.mt, which already reflects the car's age and Malta market value — there is no separate statutory age-depreciation table. Vehicles missing from the database can be valued manually through Form VEH 14.",
          },
          {
            question:
              "Is registration tax different for new and used vehicles in Malta?",
            answer:
              "The formula is the same, but the Registration Value differs: new cars use their invoice / CIF value, used cars use Transport Malta's market valuation, which is usually lower for older cars. Older Euro standards are not banned, but on the NEDC table they pay higher rates. Used cars over 5 years old imported from outside the EU, including the UK, must pay at least a minimum registration tax, ranging from €900 (0–100 g/km, year 6) to €37,437 (over 250 g/km, 14+ years). Used cars from other EU countries are not subject to this minimum.",
          },
          {
            question: "Are there registration tax exemptions in Malta?",
            answer:
              "Yes. Battery electric vehicles and plug-in hybrids with at least 50 km of electric range are fully exempt. From 1 January 2026, motorcycles up to 350cc and electric motorcycles pay 0%. One car or motorcycle brought in under the Transfer of Residence scheme (24 months' ownership and 24 months living abroad, Form VEH 007) is exempt, although tax becomes due if it is later sold in Malta. Vintage vehicles 50 years or older pay 0%, while those aged 30–49 pay roughly 25.5%–37.5% of their estimated value depending on engine size. Vehicles adapted for persons with disabilities may also qualify for relief through Transport Malta.",
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
            description="Complete guide to registration tax rates, CO2 bands, and exemptions for vehicles in Malta."
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
