import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Coins } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Bonus Tax Calculator | Malta Calculator",
    description: "Calculate tax on one-time bonuses in Malta. Free tool for 13th month salary, performance bonus, and year-end bonus tax.",
    alternates: { canonical: `${SITE_URL}/calculators/bonus-tax` },
    openGraph: { ...ogMetadata, title: "Bonus Tax Calculator | Malta Calculator", url: `${SITE_URL}/calculators/bonus-tax` },
    twitter: { ...twitterMetadata, title: "Bonus Tax Calculator | Malta Calculator" },
};

export default function BonusTaxPage() {
    return (
        <ComingSoonPage
            title="Bonus Tax Calculator"
            description="Calculate the tax implications of one-time bonus payments, 13th-month salary, and performance bonuses in Malta."
            icon={<Coins className="h-12 w-12 text-primary" />}
            category="Employment"
            features={[
                "13th month salary calculation",
                "Performance bonus tax",
                "End-of-year bonus handling",
                "Cumulative tax bracket impact",
            ]}
        />
    );
}

export const revalidate = false;          // tamamen statik (build-time)
export const dynamic = 'force-static';    // bu segmenti statik olmaya zorla
