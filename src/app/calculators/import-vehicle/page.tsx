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
} from "@/app/shared-metadata";
import { ImportVehicleCalculator } from "./_components/import-vehicle-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Import Vehicle Calculator | Malta Calculator",
  description:
    "Calculate the total cost of importing a vehicle to Malta. Includes registration tax, import duty, VAT, shipping, and all fees.",
  alternates: { canonical: `${SITE_URL}/calculators/import-vehicle` },
  openGraph: {
    ...ogMetadata,
    title: "Import Vehicle Calculator Malta",
    url: `${SITE_URL}/calculators/import-vehicle`,
  },
  twitter: { ...twitterMetadata, title: "Import Vehicle Calculator Malta" },
};

export default function ImportVehiclePage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Import Vehicle",
            url: `${SITE_URL}/calculators/import-vehicle`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Vehicle Import Cost Calculator Malta"
        description="Calculate the total cost of importing a vehicle to Malta including registration tax, import duty, VAT, shipping, and all associated fees."
        slug="import-vehicle"
        category="Vehicle Calculator"
        features={[
          "Import duty calculation for EU and non-EU vehicles",
          "Vehicle registration tax (VRT) estimation",
          "VAT calculation on imported vehicles",
          "Compliance certificate fee inclusion",
          "Total landed cost breakdown",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question:
              "What import duties apply when bringing a vehicle to Malta?",
            answer:
              "Vehicles imported from outside the EU into Malta are subject to customs duty, typically 6.5% for passenger cars. Vehicles from within the EU (including vehicles that have been properly registered and taxed in an EU member state) are generally not subject to additional import duties, though registration tax (VRT) still applies. Import VAT at 18% may also be applicable on non-EU imports.",
          },
          {
            question:
              "How is registration tax calculated when importing a vehicle to Malta?",
            answer:
              "Vehicle Registration Tax (VRT) must be paid on all vehicles imported to Malta, regardless of origin. The tax is calculated based on the vehicle's CO2 emissions and its taxable value (adjusted for age). The CO2 band determines the tax rate percentage, which is applied to the depreciated vehicle value. Electric vehicles may benefit from reduced or zero VRT.",
          },
          {
            question:
              "What is a compliance certificate and is it required for vehicle imports in Malta?",
            answer:
              "A compliance certificate (also called a Certificate of Conformity or CoC) is a document confirming that the vehicle meets EU type-approval standards. It is required when importing a vehicle to Malta for registration purposes. Without it, the vehicle must undergo individual approval testing at Transport Malta, which incurs additional fees and may require modifications to meet Malta's standards.",
          },
          {
            question:
              "Is there a difference between importing an EU vehicle versus a non-EU vehicle to Malta?",
            answer:
              "Yes, there is a significant difference. EU vehicles (already EU type-approved) typically require only the Certificate of Conformity and VRT payment. Non-EU vehicles (e.g., from the UK post-Brexit, USA, Japan) require customs clearance, payment of import duty (6.5%), VAT (18%), individual vehicle approval if no EU type approval exists, and VRT. The total cost for non-EU imports is considerably higher.",
          },
          {
            question:
              "Are shipping costs included in the Malta vehicle import tax calculation?",
            answer:
              "Shipping and insurance costs (CIF - Cost, Insurance, Freight) are typically included in the customs value used to calculate import duties for non-EU vehicles. This means higher shipping costs can increase the duty payable. For EU vehicles, shipping costs do not affect VRT as the tax is based on the vehicle's retail or market value, not the shipping cost.",
          },
        ]}
      />
      <main role="main" aria-label="Import Vehicle Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <ImportVehicleCalculator />
          <RelatedGuide
            href="/blog/malta-import-vehicle-guide-2026"
            title="Malta Import Vehicle Guide 2026"
            description="Step-by-step guide to importing a vehicle to Malta: costs, procedures, and requirements."
          />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
