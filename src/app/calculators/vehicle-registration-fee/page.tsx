import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
} from "@/app/shared-metadata";
import { VehicleRegistrationFeeCalculator } from "./_components/vehicle-registration-fee-calculator";
import { BreadcrumbJsonLd, CalculatorJsonLd } from "@/components/json-ld";

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
  alternates: { canonical: `${SITE_URL}/calculators/vehicle-registration-fee` },
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
