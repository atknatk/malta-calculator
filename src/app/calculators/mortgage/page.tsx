import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
import { RelatedGuide } from "@/components/marketing/related-guide";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { MortgageCalculator } from "./_components/mortgage-calculator";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Mortgage Calculator | Malta Calculator",
    description: "Calculate your mortgage payments in Malta. 10% minimum deposit, monthly payments, total interest, and amortization schedule. Free mortgage calculator.",
    keywords: ["Malta mortgage calculator", "Malta home loan", "mortgage Malta", "home loan calculator Malta", "property loan Malta"],
    alternates: { canonical: `${SITE_URL}/calculators/mortgage` },
    openGraph: { ...ogMetadata, title: "Mortgage Calculator | Malta Calculator", url: `${SITE_URL}/calculators/mortgage` },
    twitter: { ...twitterMetadata, title: "Mortgage Calculator | Malta Calculator" },
};

export default function MortgagePage() {
    return (
        <MarketingLayout>
            <main role="main" aria-label="Mortgage Calculator">
                <BackButton href="/calculators" />
                <Shell className="max-w-5xl py-8">
                    <MortgageCalculator />
                    <RelatedGuide
                        href="/blog/malta-mortgage-guide-2026"
                        title="Malta Mortgage Guide 2026"
                        description="Complete guide to getting a mortgage in Malta, including rates, requirements, and tips for expats."
                    />
                </Shell>
            </main>
        </MarketingLayout>
    );
}

export const revalidate = false;          // tamamen statik (build-time)
export const dynamic = 'force-static';    // bu segmenti statik olmaya zorla
