import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Baby } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Childcare Subsidy Calculator | Malta Calculator",
    description: "Calculate childcare subsidy in Malta based on income. Free tool for childcare support calculations.",
    alternates: { canonical: `${SITE_URL}/calculators/childcare` },
    openGraph: { ...ogMetadata, title: "Childcare Subsidy Calculator | Malta Calculator", url: `${SITE_URL}/calculators/childcare` },
    twitter: { ...twitterMetadata, title: "Childcare Subsidy Calculator | Malta Calculator" },
};

export default function ChildcarePage() {
    return (
        <ComingSoonPage
            title="Childcare Subsidy Calculator"
            description="Calculate your eligible childcare subsidy based on household income and number of children in registered childcare facilities."
            icon={<Baby className="h-12 w-12 text-primary" />}
            category="Family"
            features={[
                "Income-based subsidy tiers",
                "Multiple children calculation",
                "Registered facilities only",
                "Maximum subsidy amounts",
            ]}
        />
    );
}

export const revalidate = false;          // tamamen statik (build-time)
export const dynamic = 'force-static';    // bu segmenti statik olmaya zorla
