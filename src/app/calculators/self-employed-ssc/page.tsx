import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Calculator } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Self-Employed SSC Calculator | Malta Calculator",
    description: "Malta serbest meslek SSC hesaplayıcı. Class 2 sosyal güvenlik katkıları hesaplama. Calculate self-employed SSC in Malta.",
    alternates: { canonical: `${SITE_URL}/calculators/self-employed-ssc` },
    openGraph: { ...ogMetadata, title: "Self-Employed SSC Calculator | Malta Calculator", url: `${SITE_URL}/calculators/self-employed-ssc` },
    twitter: { ...twitterMetadata, title: "Self-Employed SSC Calculator | Malta Calculator" },
};

export default function SelfEmployedSSCPage() {
    return (
        <ComingSoonPage
            title="Self-Employed SSC Calculator"
            titleTr="Serbest Meslek SSC Hesaplayıcı"
            description="Calculate Class 2 Social Security Contributions for self-employed persons in Malta."
            descriptionTr="Malta'daki serbest meslek sahipleri için Class 2 Sosyal Güvenlik Katkılarını hesaplayın."
            icon={<Calculator className="h-12 w-12 text-primary" />}
            category="Self-Employment"
            categoryTr="Serbest Meslek"
            features={[
                "Class 2 contribution rates",
                "Income-based calculation",
                "Minimum/maximum thresholds",
                "Payment schedule",
            ]}
            featuresTr={[
                "Class 2 katkı oranları",
                "Gelire dayalı hesaplama",
                "Minimum/maksimum eşikler",
                "Ödeme takvimi",
            ]}
        />
    );
}
