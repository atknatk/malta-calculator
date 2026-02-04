import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
import { RelatedGuide } from "@/components/marketing/related-guide";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { VRTCalculator } from "./_components/vrt-calculator";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "VRT Calculator (Vehicle Roadworthiness Test) | Malta Calculator",
    description: "Calculate VRT (MOT) inspection fees in Malta. Test costs for cars, motorcycles, commercial vehicles, and buses with frequency information.",
    alternates: { canonical: `${SITE_URL}/calculators/vrt` },
    openGraph: { ...ogMetadata, title: "VRT Calculator Malta", url: `${SITE_URL}/calculators/vrt` },
    twitter: { ...twitterMetadata, title: "VRT Calculator Malta" },
};

export default function VRTPage() {
    return (
        <MarketingLayout>
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

export const revalidate = false;          // tamamen statik (build-time)
export const dynamic = 'force-static';    // bu segmenti statik olmaya zorla
