import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Palmtree } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Pension Estimator | Malta Calculator",
    description: "Estimate your Malta state pension based on SSC contributions. Free pension calculator for retirement planning.",
    alternates: { canonical: `${SITE_URL}/calculators/pension` },
    openGraph: { ...ogMetadata, title: "Pension Estimator | Malta Calculator", url: `${SITE_URL}/calculators/pension` },
    twitter: { ...twitterMetadata, title: "Pension Estimator | Malta Calculator" },
};

export default function PensionPage() {
    return (
        <ComingSoonPage
            title="Pension Estimator"
            description="Estimate your Malta state pension based on your SSC contribution history and expected retirement age."
            icon={<Palmtree className="h-12 w-12 text-primary" />}
            category="Retirement"
            features={[
                "Contribution-based calculation",
                "Minimum pension amounts",
                "Two-thirds pension eligibility",
                "Early retirement impact",
            ]}
        />
    );
}
