import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Home } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "First-Time Buyer Scheme Calculator | Malta Calculator",
    description: "Calculate first-time buyer benefits in Malta. Stamp duty reductions and grants for first property purchase.",
    alternates: { canonical: `${SITE_URL}/calculators/first-time-buyer` },
    openGraph: { ...ogMetadata, title: "First-Time Buyer Scheme Calculator | Malta Calculator", url: `${SITE_URL}/calculators/first-time-buyer` },
    twitter: { ...twitterMetadata, title: "First-Time Buyer Scheme Calculator | Malta Calculator" },
};

export default function FirstTimeBuyerPage() {
    return (
        <ComingSoonPage
            title="First-Time Buyer Scheme"
            description="Calculate benefits available to first-time property buyers in Malta including stamp duty reductions and grants."
            icon={<Home className="h-12 w-12 text-primary" />}
            category="Property"
            features={[
                "Reduced stamp duty (3.5%)",
                "Property value limits",
                "Grant eligibility",
                "Residency requirements",
            ]}
        />
    );
}
