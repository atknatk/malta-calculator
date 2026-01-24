import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Baby } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Maternity & Paternity Leave Calculator | Malta Calculator",
    description: "Calculate maternity and paternity leave in Malta. Free tool for leave duration and pay calculations.",
    alternates: { canonical: `${SITE_URL}/calculators/maternity` },
    openGraph: { ...ogMetadata, title: "Maternity & Paternity Leave Calculator | Malta Calculator", url: `${SITE_URL}/calculators/maternity` },
    twitter: { ...twitterMetadata, title: "Maternity & Paternity Leave Calculator | Malta Calculator" },
};

export default function MaternityPage() {
    return (
        <ComingSoonPage
            title="Maternity & Paternity Leave"
            description="Calculate your entitled maternity leave (18 weeks) and paternity leave duration and payment in Malta."
            icon={<Baby className="h-12 w-12 text-primary" />}
            category="Family"
            features={[
                "18 weeks maternity leave",
                "10 days paternity leave",
                "Maternity benefit calculation",
                "Employer contribution periods",
            ]}
        />
    );
}

export const revalidate = false;          // tamamen statik (build-time)
export const dynamic = 'force-static';    // bu segmenti statik olmaya zorla
