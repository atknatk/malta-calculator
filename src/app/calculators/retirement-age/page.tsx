import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Calendar } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Retirement Age Calculator | Malta Calculator",
    description: "Calculate your retirement age in Malta based on date of birth. Free retirement planning tool.",
    alternates: { canonical: `${SITE_URL}/calculators/retirement-age` },
    openGraph: { ...ogMetadata, title: "Retirement Age Calculator | Malta Calculator", url: `${SITE_URL}/calculators/retirement-age` },
    twitter: { ...twitterMetadata, title: "Retirement Age Calculator | Malta Calculator" },
};

export default function RetirementAgePage() {
    return (
        <ComingSoonPage
            title="Retirement Age Calculator"
            description="Calculate your statutory retirement age in Malta based on your date of birth."
            icon={<Calendar className="h-12 w-12 text-primary" />}
            category="Retirement"
            features={[
                "Birth year-based retirement age",
                "Gradual increase schedule",
                "Early retirement options",
                "Years until retirement",
            ]}
        />
    );
}
