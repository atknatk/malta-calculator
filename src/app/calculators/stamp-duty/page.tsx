import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Home } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Stamp Duty Calculator | Malta Calculator",
    description: "Malta damga vergisi hesaplayıcı. Ev alımında %5 / %3.5 damga vergisi hesaplama. Calculate stamp duty on property purchase in Malta.",
    alternates: { canonical: `${SITE_URL}/calculators/stamp-duty` },
    openGraph: { ...ogMetadata, title: "Stamp Duty Calculator | Malta Calculator", url: `${SITE_URL}/calculators/stamp-duty` },
    twitter: { ...twitterMetadata, title: "Stamp Duty Calculator | Malta Calculator" },
};

export default function StampDutyPage() {
    return (
        <ComingSoonPage
            title="Stamp Duty Calculator"
            titleTr="Damga Vergisi Hesaplayıcı"
            description="Calculate stamp duty on property purchases in Malta. Standard 5% rate or reduced 3.5% for first-time buyers."
            descriptionTr="Malta'da mülk alımlarında damga vergisini hesaplayın. Standart %5 veya ilk kez alıcılar için indirimli %3.5 oran."
            icon={<Home className="h-12 w-12 text-primary" />}
            category="Property"
            categoryTr="Gayrimenkul"
            features={[
                "5% standard rate",
                "3.5% first-time buyer rate",
                "Property value thresholds",
                "Exemptions and reductions",
            ]}
            featuresTr={[
                "%5 standart oran",
                "İlk kez alıcı için %3.5 oran",
                "Mülk değeri eşikleri",
                "Muafiyetler ve indirimler",
            ]}
        />
    );
}
