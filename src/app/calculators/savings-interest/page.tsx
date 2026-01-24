import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { SavingsCalculator } from "./_components/savings-calculator";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Savings Interest Calculator | Malta Calculator",
    description: "Calculate compound interest on your savings in Malta. Including 15% withholding tax, monthly contributions, and yearly breakdown. Free savings calculator.",
    keywords: ["Malta savings calculator", "Malta interest calculator", "compound interest Malta", "savings Malta", "bank interest Malta"],
    alternates: { canonical: `${SITE_URL}/calculators/savings-interest` },
    openGraph: { ...ogMetadata, title: "Savings Interest Calculator | Malta Calculator", url: `${SITE_URL}/calculators/savings-interest` },
    twitter: { ...twitterMetadata, title: "Savings Interest Calculator | Malta Calculator" },
};

export default function SavingsInterestPage() {
    return (
        <MarketingLayout>
            <main role="main" aria-label="Savings Interest Calculator">
                <BackButton href="/calculators" />
                <Shell className="max-w-5xl py-8">
                    <SavingsCalculator />
                </Shell>
            </main>
        </MarketingLayout>
    );
}
