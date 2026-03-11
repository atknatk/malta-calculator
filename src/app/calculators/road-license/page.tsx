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
import { RoadLicenseCalculator } from "./_components/road-license-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Road License Calculator | Malta Calculator",
  description:
    "Calculate annual road license (circulation tax) fees in Malta. Based on engine capacity, CO2 emissions, vehicle type, and fuel type.",
  alternates: { canonical: `${SITE_URL}/calculators/road-license` },
  openGraph: {
    ...ogMetadata,
    title: "Road License Calculator Malta",
    url: `${SITE_URL}/calculators/road-license`,
  },
  twitter: { ...twitterMetadata, title: "Road License Calculator Malta" },
};

export default function RoadLicensePage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Road License",
            url: `${SITE_URL}/calculators/road-license`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Road License Calculator Malta"
        description="Calculate annual road license (circulation tax) fees in Malta based on engine capacity, CO2 emissions, vehicle type, and fuel type."
        slug="road-license"
        category="Vehicle Calculator"
        features={[
          "CO2-based fee calculation",
          "Engine capacity rate lookup",
          "Electric and hybrid vehicle discounts",
          "Commercial and motorcycle rates",
          "Annual renewal fee estimation",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "How is the annual road license fee calculated in Malta?",
            answer:
              "In Malta, the annual road license fee (circulation tax) is calculated based on the vehicle's CO2 emissions (g/km) and engine capacity (cc). Vehicles with higher CO2 emissions are charged higher rates. The fee is set by Transport Malta and must be renewed annually.",
          },
          {
            question:
              "Are CO2 emissions used to determine road license rates in Malta?",
            answer:
              "Yes, CO2 emissions are a primary factor in determining road license fees in Malta for vehicles registered after 2009. Vehicles are placed into CO2 bands ranging from under 100 g/km (lowest fee) to over 250 g/km (highest fee). Older vehicles are rated by engine capacity instead.",
          },
          {
            question:
              "Do electric vehicles get a discount on Malta road license fees?",
            answer:
              "Yes, fully electric vehicles (BEV) receive a significant discount on road license fees in Malta. Plug-in hybrid electric vehicles (PHEV) and mild hybrids also qualify for reduced rates based on their official CO2 emissions figures. Zero-emission vehicles may pay a nominal flat fee.",
          },
          {
            question:
              "What are the penalties for late road license renewal in Malta?",
            answer:
              "Driving without a valid road license in Malta is an offence. Late renewal incurs surcharges on top of the standard fee. Vehicles caught without a valid road license may be fined by the police or Transport Malta enforcement officers. It is advisable to renew before the expiry date to avoid penalties.",
          },
          {
            question:
              "Are commercial vehicles charged differently for road license in Malta?",
            answer:
              "Yes, commercial vehicles such as vans, trucks, and buses are subject to different road license fee schedules in Malta compared to private passenger cars. The rates depend on the gross vehicle weight (GVW) and vehicle category. Agricultural vehicles and certain special-use vehicles may have separate fee structures or exemptions.",
          },
        ]}
      />
      <main role="main" aria-label="Road License Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <RoadLicenseCalculator />
          <RelatedGuide
            href="/blog/malta-road-license-guide-2026"
            title="Malta Road License Guide 2026"
            description="Everything about annual road license fees, renewal process, and exemptions."
          />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
