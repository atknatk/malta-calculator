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
import { StampDutyCalculator } from "./_components/stamp-duty-calculator";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Stamp Duty Calculator | Malta Calculator",
  description:
    "Calculate stamp duty on property purchase in Malta. 5% standard rate or first-time buyer exemption on €200,000.",
  alternates: { canonical: `${SITE_URL}/calculators/stamp-duty` },
  openGraph: {
    ...ogMetadata,
    title: "Stamp Duty Calculator | Malta Calculator",
    url: `${SITE_URL}/calculators/stamp-duty`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Stamp Duty Calculator | Malta Calculator",
  },
};

export default function StampDutyPage() {
  return (
    <MarketingLayout>
      <main role="main" aria-label="Stamp Duty Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <StampDutyCalculator />
          <RelatedGuide
            href="/blog/malta-stamp-duty-complete-guide-2026"
            title="Malta Stamp Duty Complete Guide 2026"
            description="Learn everything about property stamp duty in Malta, including rates, exemptions, and first-time buyer benefits."
          />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
