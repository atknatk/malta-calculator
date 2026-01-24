import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Stethoscope } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Sick Leave Calculator | Malta Calculator",
    description: "Calculate sick leave entitlement and sickness benefit in Malta. Free leave and payment calculator.",
    alternates: { canonical: `${SITE_URL}/calculators/sick-leave` },
    openGraph: { ...ogMetadata, title: "Sick Leave Calculator | Malta Calculator", url: `${SITE_URL}/calculators/sick-leave` },
    twitter: { ...twitterMetadata, title: "Sick Leave Calculator | Malta Calculator" },
};

export default function SickLeavePage() {
    return (
        <ComingSoonPage
            title="Sick Leave Calculator"
            description="Calculate sick leave entitlement and sickness benefit payments in Malta."
            icon={<Stethoscope className="h-12 w-12 text-primary" />}
            category="Leave"
            features={[
                "Employer-paid sick leave",
                "SSC-funded sickness benefit",
                "Medical certificate requirements",
                "Maximum benefit periods",
            ]}
        />
    );
}
