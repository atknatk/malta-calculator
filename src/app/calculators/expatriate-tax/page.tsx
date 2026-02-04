import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Globe } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Expatriate Tax Calculator (HQP) | Malta Calculator",
    description: "Calculate 15% flat tax for highly qualified persons in Malta. Malta HQP scheme calculator for expats.",
    alternates: { canonical: `${SITE_URL}/calculators/expatriate-tax` },
    openGraph: { ...ogMetadata, title: "Expatriate Tax Calculator (HQP) | Malta Calculator", url: `${SITE_URL}/calculators/expatriate-tax` },
    twitter: { ...twitterMetadata, title: "Expatriate Tax Calculator (HQP) | Malta Calculator" },
    robots: { index: false, follow: true },
};

export default function ExpatriateTaxPage() {
    return (
        <ComingSoonPage
            title="Expatriate Tax Calculator"
            description="Calculate your tax under Malta's Highly Qualified Persons (HQP) scheme with a flat 15% tax rate on qualifying income."
            icon={<Globe className="h-12 w-12 text-primary" />}
            category="Employment"
            features={[
                "15% flat tax rate calculation",
                "Eligibility criteria check",
                "Qualifying sectors and roles",
                "Comparison with standard tax rates",
            ]}
        />
    );
}

export const revalidate = false;          // tamamen statik (build-time)
export const dynamic = 'force-static';    // bu segmenti statik olmaya zorla
