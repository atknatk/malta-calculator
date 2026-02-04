import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
import { RelatedGuide } from "@/components/marketing/related-guide";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { DriversLicenseCalculator } from "./_components/drivers-license-calculator";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Driver's License Fees Calculator | Malta Calculator",
    description: "Calculate driving license fees in Malta. New license, renewal, international permit, and category upgrade costs including tests and medical.",
    alternates: { canonical: `${SITE_URL}/calculators/drivers-license` },
    openGraph: { ...ogMetadata, title: "Driver's License Fees Calculator Malta", url: `${SITE_URL}/calculators/drivers-license` },
    twitter: { ...twitterMetadata, title: "Driver's License Fees Calculator Malta" },
};

export default function DriversLicensePage() {
    return (
        <MarketingLayout>
            <main role="main" aria-label="Driver's License Fees Calculator">
                <BackButton href="/calculators" />
                <Shell className="max-w-4xl py-8">
                    <DriversLicenseCalculator />
                    <RelatedGuide
                        href="/blog/malta-drivers-license-guide-2026"
                        title="Malta Driver's License Guide 2026"
                        description="Complete guide to getting a driving license in Malta: fees, tests, and requirements."
                    />
                </Shell>
            </main>
        </MarketingLayout>
    );
}

export const revalidate = false;          // tamamen statik (build-time)
export const dynamic = 'force-static';    // bu segmenti statik olmaya zorla
