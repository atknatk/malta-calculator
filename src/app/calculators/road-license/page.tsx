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
