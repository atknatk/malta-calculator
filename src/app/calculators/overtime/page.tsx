import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Clock } from "lucide-react";

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
        <ComingSoonPage
            title="Overtime Calculator"
            description="Calculate your overtime pay based on Malta's employment regulations. Get accurate rates for weekday, weekend, and holiday overtime."
            icon={<Clock className="h-12 w-12 text-primary" />}
            category="Employment"
            features={[
                "1.5x rate for regular overtime",
                "2x rate for Sundays and public holidays",
                "Weekly hour thresholds",
                "Tax calculation on overtime pay",
            ]}
        />
    );
}
