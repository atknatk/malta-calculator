import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
import { RelatedGuide } from "@/components/marketing/related-guide";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { VacationCalculator } from "./_components/vacation-calculator";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Vacation Days Calculator | Malta Calculator",
    description: "Calculate your annual leave entitlement in Malta. Minimum 192 hours (24 days) plus public holiday additions.",
    alternates: { canonical: `${SITE_URL}/calculators/vacation` },
    openGraph: { ...ogMetadata, title: "Vacation Days Calculator | Malta Calculator", url: `${SITE_URL}/calculators/vacation` },
    twitter: { ...twitterMetadata, title: "Vacation Days Calculator | Malta Calculator" },
};

export default function VacationPage() {
    return (
        <MarketingLayout>
            <main role="main" aria-label="Vacation Days Calculator">
                <BackButton href="/calculators" />
                <Shell className="max-w-4xl py-8">
                    <VacationCalculator />
                    <RelatedGuide
                        href="/blog/malta-vacation-leave-entitlement-2026"
                        title="Malta Vacation Leave Entitlement 2026"
                        description="Everything about annual leave in Malta: minimum days, accrual rates, and public holiday additions."
                    />
                </Shell>
            </main>
        </MarketingLayout>
    );
}

export const revalidate = false;          // tamamen statik (build-time)
export const dynamic = 'force-static';    // bu segmenti statik olmaya zorla
