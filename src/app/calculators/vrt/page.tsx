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
import { VRTCalculator } from "./_components/vrt-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "VRT Calculator (Vehicle Roadworthiness Test) | Malta Calculator",
  description:
    "Calculate VRT (MOT) inspection fees in Malta. Test costs for cars, motorcycles, commercial vehicles, and buses with frequency information.",
  alternates: { canonical: `${SITE_URL}/calculators/vrt` },
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
        description="Calculate Vehicle Roadworthiness Test (VRT/MOT) inspection fees in Malta for cars, motorcycles, commercial vehicles, and buses."
        slug="vrt"
        category="Vehicle Tax Calculator"
        features={[
          "VRT fee calculation by vehicle category",
          "Test frequency information by vehicle age",
          "Re-test fee estimation",
          "Commercial and heavy vehicle rates",
          "Electric vehicle VRT requirements",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "What is VRT in Malta and how is the fee calculated?",
            answer:
              "VRT (Vehicle Roadworthiness Test) is Malta's mandatory vehicle inspection, equivalent to the MOT in the UK. The fee is set by Transport Malta and varies by vehicle category. For standard passenger cars, the VRT fee is approximately €35-40. The test checks safety systems, emissions, tyres, lights, brakes, and other mechanical components.",
          },
          {
            question:
              "What are the CO2 emission bands used in Malta VRT assessment?",
            answer:
              "During VRT, vehicles are tested for exhaust emissions to ensure they meet EU standards. Petrol vehicles are tested for CO and HC levels, while diesel vehicles are tested for opacity (smoke). Vehicles that fail the emissions test cannot pass VRT and require repairs before re-testing. The specific limits depend on the vehicle's engine type and year of manufacture.",
          },
          {
            question: "How does vehicle age affect VRT requirements in Malta?",
            answer:
              "In Malta, new vehicles are exempt from VRT for the first year after registration. After that, the frequency of mandatory testing increases with age. Vehicles between 1-3 years old are tested every 2 years, those 3-10 years old annually, and older vehicles may require more frequent testing. Commercial vehicles and taxis have more frequent mandatory testing schedules.",
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
              "Yes, if you believe your vehicle was incorrectly failed during a VRT inspection in Malta, you can submit a formal appeal to Transport Malta. You must do this within a specified period after the failed test. The vehicle will typically be re-inspected by a different examiner. If the appeal is upheld, you may be entitled to a refund of any re-test fees paid. It is advisable to obtain a detailed written report of all failure points before appealing.",
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
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
