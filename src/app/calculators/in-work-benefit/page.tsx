import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Briefcase } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "In-Work Benefit Calculator | Malta Calculator",
    description: "Calculate in-work benefit in Malta for low-income working families. Free eligibility and amount calculator.",
    alternates: { canonical: `${SITE_URL}/calculators/in-work-benefit` },
    openGraph: { ...ogMetadata, title: "In-Work Benefit Calculator | Malta Calculator", url: `${SITE_URL}/calculators/in-work-benefit` },
    twitter: { ...twitterMetadata, title: "In-Work Benefit Calculator | Malta Calculator" },
    robots: { index: false, follow: true },
};

export default function InWorkBenefitPage() {
    return (
        <ComingSoonPage
            title="In-Work Benefit Calculator"
            description="Calculate the in-work benefit available to low-income working families in Malta."
            icon={<Briefcase className="h-12 w-12 text-primary" />}
            category="Family"
            features={[
                "Income thresholds",
                "Family size adjustments",
                "Employment hours requirement",
                "Tapering rates",
            ]}
        />
    );
}

export const revalidate = false;          // tamamen statik (build-time)
export const dynamic = 'force-static';    // bu segmenti statik olmaya zorla
