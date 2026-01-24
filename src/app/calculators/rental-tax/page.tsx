import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Home } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Rental Tax Calculator | Malta Calculator",
    description: "Calculate rental income tax in Malta. 15% flat rate or progressive rate comparison tool.",
    alternates: { canonical: `${SITE_URL}/calculators/rental-tax` },
    openGraph: { ...ogMetadata, title: "Rental Tax Calculator | Malta Calculator", url: `${SITE_URL}/calculators/rental-tax` },
    twitter: { ...twitterMetadata, title: "Rental Tax Calculator | Malta Calculator" },
};

export default function RentalTaxPage() {
    return (
        <ComingSoonPage
            title="Rental Tax Calculator"
            description="Calculate rental income tax in Malta. Choose between 15% flat rate or standard progressive tax rates."
            icon={<Home className="h-12 w-12 text-primary" />}
            category="Property"
            features={[
                "15% flat rate option",
                "Progressive rate comparison",
                "Deductible expenses",
                "Long-term vs short-term rental",
            ]}
        />
    );
}

export const revalidate = false;          // tamamen statik (build-time)
export const dynamic = 'force-static';    // bu segmenti statik olmaya zorla
