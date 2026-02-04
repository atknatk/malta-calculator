import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
import { RelatedGuide } from "@/components/marketing/related-guide";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { NoticePeriodCalculator } from "./_components/notice-period-calculator";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Notice Period Calculator | Malta Calculator",
    description: "Calculate your required notice period in Malta based on years of service. Free tool based on Employment and Industrial Relations Act.",
    alternates: { canonical: `${SITE_URL}/calculators/notice-period` },
    openGraph: { ...ogMetadata, title: "Notice Period Calculator | Malta Calculator", url: `${SITE_URL}/calculators/notice-period` },
    twitter: { ...twitterMetadata, title: "Notice Period Calculator | Malta Calculator" },
};

export default function NoticePeriodPage() {
    return (
        <MarketingLayout>
            <main role="main" aria-label="Notice Period Calculator">
                <BackButton href="/calculators" />
                <Shell className="max-w-4xl py-8">
                    <NoticePeriodCalculator />
                    <RelatedGuide
                        href="/blog/malta-notice-period-employment-guide-2026"
                        title="Malta Notice Period Employment Guide 2026"
                        description="Complete guide to notice periods in Malta based on years of service and employment law."
                    />
                </Shell>
            </main>
        </MarketingLayout>
    );
}

export const revalidate = false;          // tamamen statik (build-time)
export const dynamic = 'force-static';    // bu segmenti statik olmaya zorla
