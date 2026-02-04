import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
import { RelatedGuide } from "@/components/marketing/related-guide";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { VehicleRegistrationTaxCalculator } from "./_components/vehicle-registration-tax-calculator";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Vehicle Registration Tax Calculator | Malta Calculator",
    description: "Calculate vehicle registration tax in Malta based on CO2 emissions. Includes electric/hybrid discounts, age depreciation, and EU/non-EU import duties.",
    alternates: { canonical: `${SITE_URL}/calculators/vehicle-registration-tax` },
    openGraph: { ...ogMetadata, title: "Vehicle Registration Tax Calculator Malta", url: `${SITE_URL}/calculators/vehicle-registration-tax` },
    twitter: { ...twitterMetadata, title: "Vehicle Registration Tax Calculator Malta" },
};

export default function VehicleRegistrationTaxPage() {
    return (
        <MarketingLayout>
            <main role="main" aria-label="Vehicle Registration Tax Calculator">
                <BackButton href="/calculators" />
                <Shell className="max-w-4xl py-8">
                    <VehicleRegistrationTaxCalculator />
                    <RelatedGuide
                        href="/blog/malta-vehicle-registration-tax-guide-2026"
                        title="Malta Vehicle Registration Tax Guide 2026"
                        description="Complete guide to VRT rates, CO2 bands, and exemptions for vehicles in Malta."
                    />
                </Shell>
            </main>
        </MarketingLayout>
    );
}

export const revalidate = false;          // tamamen statik (build-time)
export const dynamic = 'force-static';    // bu segmenti statik olmaya zorla
