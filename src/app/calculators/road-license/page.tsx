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
    "Calculate your annual road license (circulation tax) fee in Malta. Based on engine capacity, CO2 emissions, vehicle type, fuel type, and registration year.",
  alternates: pageAlternates("/calculators/road-license"),
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
          "EV and plug-in hybrid (50 km+) exemption",
          "Commercial and motorcycle rates",
          "Annual renewal fee estimation",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "How is the annual road license fee calculated in Malta?",
            answer:
              "In Malta, the annual road license fee (circulation tax) for cars registered from 1 January 2009 depends on CO2 emissions (g/km) and the vehicle's age, counted from the year of manufacture. Cars registered before 2009 are charged by engine capacity (cc) and age. The rates are set by Transport Malta and rise after year 5 for newer cars and after year 6 for pre-2009 cars.",
          },
          {
            question:
              "Are CO2 emissions used to determine road license rates in Malta?",
            answer:
              "Yes, CO2 emissions are a primary factor in determining road license fees in Malta for vehicles registered after 2009. Vehicles are placed into eight CO2 bands: from 0-100 g/km (€100 a year when new) to over 250 g/km (€525 a year when new) on NEDC figures, with wider bands (0-125 g/km up to over 300 g/km) for WLTP figures. Vehicles registered before 2009 are rated by engine capacity instead.",
          },
          {
            question:
              "Do electric vehicles get a discount on Malta road license fees?",
            answer:
              "Yes. Electric vehicles and plug-in hybrids with at least 50 km of electric range pay no road license fee for the first six years (years 0-5) and €10 a year after that. Regular (non plug-in) hybrids are charged on their official CO2 figure like petrol cars. LPG conversions get a 10% reduction.",
          },
          {
            question:
              "What are the penalties for late road license renewal in Malta?",
            answer:
              "Driving without a valid road license in Malta is an offence. If you renew more than 3 months late, Transport Malta adds €10 for each month of delay, up to a maximum of €100, on top of the standard fee. Vehicles caught on the road without a valid road license may also be fined by the police or Transport Malta enforcement officers. Remember that cars due for a roadworthiness test need a VRT pass dated within 90 days before renewal.",
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
          <AffiliateCard slug="road-license" />
          <RelatedCalculators slug="road-license" />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
