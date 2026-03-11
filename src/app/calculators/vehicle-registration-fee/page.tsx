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
      <CustomFAQJsonLd
        questions={[
          {
            question: "What are the vehicle registration fees in Malta?",
            answer:
              "Vehicle registration fees in Malta include an administration fee charged by Transport Malta, number plate costs (random plates are the cheapest option, while personalised and customised plates cost more), a VRT inspection fee if the vehicle is being imported, and the first year road license fee. The exact total depends on the vehicle type and chosen plate option.",
          },
          {
            question: "How much do personalised number plates cost in Malta?",
            answer:
              "In Malta, number plate costs vary by type. Standard random-assigned plates are included in the basic registration fee. Personalised plates (where you choose specific letters/numbers) cost significantly more, typically several hundred euros. Customised plates with a specific format are the most expensive option. The fees are payable to Transport Malta at the time of registration.",
          },
          {
            question:
              "What is the administration fee for vehicle registration in Malta?",
            answer:
              "Transport Malta charges an administration fee for processing vehicle registration applications. This fee covers the administrative costs of entering the vehicle into the national register, issuing registration documents, and processing the application. The fee amount varies depending on the vehicle category (private car, motorcycle, commercial vehicle, etc.).",
          },
          {
            question:
              "Is a VRT inspection required when registering a vehicle in Malta?",
            answer:
              "A VRT (Vehicle Roadworthiness Test) inspection is required for vehicles being imported and registered in Malta for the first time, particularly second-hand vehicles. New vehicles from authorised dealers may be exempt from the initial VRT if they come with a valid Certificate of Conformity. The VRT inspection fee is part of the total registration cost for applicable vehicles.",
          },
          {
            question:
              "Do I need to pay the first year road license when registering a vehicle in Malta?",
            answer:
              "Yes, when registering a vehicle in Malta for the first time, you are required to pay the road license (circulation tax) for the current year or a pro-rated portion of it. This is collected by Transport Malta along with other registration fees. The road license fee is based on the vehicle's CO2 emissions or engine capacity and must be renewed annually thereafter.",
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
