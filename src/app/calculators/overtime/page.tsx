import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
import { RelatedGuide } from "@/components/marketing/related-guide";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { OvertimeCalculator } from "./_components/overtime-calculator";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Overtime Calculator | Malta Calculator",
    description: "Calculate overtime pay in Malta at 1.5x and 2x rates. Free tool for weekday, weekend, and holiday overtime calculations.",
    alternates: { canonical: `${SITE_URL}/calculators/overtime` },
    openGraph: { ...ogMetadata, title: "Overtime Calculator | Malta Calculator", url: `${SITE_URL}/calculators/overtime` },
    twitter: { ...twitterMetadata, title: "Overtime Calculator | Malta Calculator" },
};

export default function OvertimePage() {
    return (
        <MarketingLayout>
            <main role="main" aria-label="Overtime Calculator">
                <BackButton href="/calculators" />
                <Shell className="max-w-4xl py-8">
                    <OvertimeCalculator />
                    <RelatedGuide
                        href="/blog/malta-overtime-pay-rates-2026"
                        title="Malta Overtime Pay Rates 2026"
                        description="Complete guide to overtime regulations, pay rates, and compensation in Malta."
                    />
                </Shell>
            </main>
        </MarketingLayout>
    );
}

export const revalidate = false;          // tamamen statik (build-time)
export const dynamic = 'force-static';    // bu segmenti statik olmaya zorla
