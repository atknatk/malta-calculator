import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Baby } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Children's Allowance Calculator | Malta Calculator",
    description: "Calculate children's allowance in Malta. Free tool for monthly child benefit calculations based on income.",
    alternates: { canonical: `${SITE_URL}/calculators/children-allowance` },
    openGraph: { ...ogMetadata, title: "Children's Allowance Calculator | Malta Calculator", url: `${SITE_URL}/calculators/children-allowance` },
    twitter: { ...twitterMetadata, title: "Children's Allowance Calculator | Malta Calculator" },
};

export default function ChildrenAllowancePage() {
    return (
        <ComingSoonPage
            title="Children's Allowance Calculator"
            description="Calculate your monthly children's allowance based on household income and number of children."
            icon={<Baby className="h-12 w-12 text-primary" />}
            category="Family"
            features={[
                "Income-tested allowance",
                "Per-child rates",
                "Age-based adjustments",
                "Disability top-ups",
            ]}
        />
    );
}
