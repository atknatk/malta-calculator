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
import { VRTCalculator } from "./_components/vrt-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "VRT Calculator Malta 2026 | Vehicle Test",
  description:
    "Malta VRT (MOT) fees and test intervals for 2026: S.L. 65.15 maximum fees for cars (€30.27), vans, buses, trucks and motorcycles, plus re-test and due dates.",
  alternates: pageAlternates("/calculators/vrt"),
  openGraph: {
    ...ogMetadata,
    title: "VRT Calculator Malta",
    url: `${SITE_URL}/calculators/vrt`,
  },
  twitter: { ...twitterMetadata, title: "VRT Calculator Malta" },
};

export default function VRTPage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "VRT Calculator",
            url: `${SITE_URL}/calculators/vrt`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="VRT Calculator Malta"
        description="Calculate Vehicle Roadworthiness Test (VRT/MOT) maximum fees and test intervals in Malta for cars, motorcycles, vans, heavy goods vehicles, and buses under S.L. 65.15."
        slug="vrt"
        category="Vehicle Tax Calculator"
        features={[
          "Maximum VRT fee by vehicle category (S.L. 65.15)",
          "Test interval by vehicle type, age and mileage",
          "Re-test fee estimation (max 50% of full fee)",
          "Van, bus, heavy goods and trailer rates",
          "Electric vehicle VRT requirements",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "What is VRT in Malta and how is the fee calculated?",
            answer:
              "VRT (Vehicle Roadworthiness Test) is Malta's mandatory vehicle inspection, equivalent to the MOT in the UK. Maximum fees are set in the Eighth Schedule of S.L. 65.15 (including VAT, in force since 1 January 2023): €30.27 for a private car, taxi or hire car; €41.32 for an N1 van; €41.32 (up to 3.5 t) or €46.10 (over 3.5 t) for buses and trailers; €46.10 for N2/N3 goods vehicles; and €24.33 for motorcycles. Testing centres may charge less, and a re-test costs at most 50% of the full fee. The test checks safety systems, emissions, tyres, lights, brakes, and other mechanical components.",
          },
          {
            question: "How are emissions checked during a Malta VRT?",
            answer:
              "During VRT, vehicles are tested for exhaust emissions to ensure they meet EU standards. Petrol vehicles are tested for CO and HC levels, while diesel vehicles are tested for opacity (smoke). Vehicles that fail the emissions test cannot pass VRT and require repairs before re-testing. The specific limits depend on the vehicle's engine type and year of manufacture.",
          },
          {
            question: "How does vehicle age affect VRT requirements in Malta?",
            answer:
              "Private cars and hire cars have their first VRT 4 years after first registration, then every 2 years, and every year once the odometer passes 160,000 km. Taxis, chauffeur-driven cars and ambulances are tested every year from year 1. N1 vans are first tested at 2 years and then every 2 years (annually after 160,000 km). N2/N3 goods vehicles and buses are tested every year from year 1. Light trailers (O1/O2) are first tested at 2 years and then every 2 years, while heavier O3/O4 trailers are tested annually. For motorcycles over 125cc the interval is set by ministerial notice, so confirm with Transport Malta. A pass must be dated within 90 days before your road licence renewal.",
          },
          {
            question:
              "What is the VRT requirement for electric vehicles in Malta?",
            answer:
              "Electric vehicles (EVs) in Malta are subject to VRT inspection like all other vehicles, but the emissions portion of the test does not apply to fully electric vehicles. EVs are still tested for safety systems including brakes, steering, lights, tyres, and structural integrity. The VRT fee for electric vehicles is the same as for equivalent petrol or diesel vehicles of the same category.",
          },
          {
            question: "Can you appeal a failed VRT in Malta?",
            answer:
              "Yes, if you believe your vehicle was incorrectly failed during a VRT inspection in Malta, you can submit a formal appeal to Transport Malta. You must do this within a specified period after the failed test. The vehicle will typically be re-inspected by a different examiner. Note that a re-test costs at most 50% of the full test fee. It is advisable to obtain a detailed written report of all failure points before appealing.",
          },
        ]}
      />
      <main role="main" aria-label="VRT Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <VRTCalculator />
          <RelatedGuide
            href="/blog/malta-vrt-guide-2026"
            title="Malta VRT Guide 2026"
            description="Everything about Vehicle Roadworthiness Tests in Malta: fees, frequency, and booking."
          />
          <AffiliateCard slug="vrt" />
          <RelatedCalculators slug="vrt" />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
