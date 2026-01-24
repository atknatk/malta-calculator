import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { RetirementAgeCalculator } from "./_components/retirement-age-calculator";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Retirement Age Calculator | Malta Calculator",
    description: "Calculate your statutory retirement age in Malta based on your date of birth. Free retirement planning tool based on Social Security Act.",
    alternates: { canonical: `${SITE_URL}/calculators/retirement-age` },
    openGraph: { ...ogMetadata, title: "Retirement Age Calculator | Malta Calculator", url: `${SITE_URL}/calculators/retirement-age` },
    twitter: { ...twitterMetadata, title: "Retirement Age Calculator | Malta Calculator" },
};

export default function RetirementAgePage() {
    return (
        <MarketingLayout>
            <main role="main" aria-label="Retirement Age Calculator">
                <BackButton href="/calculators" />
                <Shell className="max-w-4xl py-8">
                    <RetirementAgeCalculator />
                </Shell>
            </main>
        </MarketingLayout>
    );
}
