import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
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
                </Shell>
            </main>
        </MarketingLayout>
    );
}
