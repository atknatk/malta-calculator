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
