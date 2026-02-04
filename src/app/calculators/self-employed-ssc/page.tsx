import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Calculator } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Self-Employed SSC Calculator | Malta Calculator",
    description: "Calculate Class 2 SSC for self-employed in Malta. Free social security contribution calculator.",
    alternates: { canonical: `${SITE_URL}/calculators/self-employed-ssc` },
    openGraph: { ...ogMetadata, title: "Self-Employed SSC Calculator | Malta Calculator", url: `${SITE_URL}/calculators/self-employed-ssc` },
    twitter: { ...twitterMetadata, title: "Self-Employed SSC Calculator | Malta Calculator" },
    robots: { index: false, follow: true },
};

export default function SelfEmployedSSCPage() {
    return (
        <ComingSoonPage
            title="Self-Employed SSC Calculator"
            description="Calculate Class 2 Social Security Contributions for self-employed persons in Malta."
            icon={<Calculator className="h-12 w-12 text-primary" />}
            category="Self-Employment"
            features={[
                "Class 2 contribution rates",
                "Income-based calculation",
                "Minimum/maximum thresholds",
                "Payment schedule",
            ]}
        />
    );
}

export const revalidate = false;          // tamamen statik (build-time)
export const dynamic = 'force-static';    // bu segmenti statik olmaya zorla
