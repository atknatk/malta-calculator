import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Calculator } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Self-Employed Tax Calculator | Malta Calculator",
    description: "Malta serbest meslek vergi hesaplayıcı. Serbest meslek gelir vergisi hesaplama. Calculate self-employed income tax in Malta.",
    alternates: { canonical: `${SITE_URL}/calculators/self-employed-tax` },
    openGraph: { ...ogMetadata, title: "Self-Employed Tax Calculator | Malta Calculator", url: `${SITE_URL}/calculators/self-employed-tax` },
    twitter: { ...twitterMetadata, title: "Self-Employed Tax Calculator | Malta Calculator" },
};

export default function SelfEmployedTaxPage() {
    return (
        <ComingSoonPage
            title="Self-Employed Tax Calculator"
            titleTr="Serbest Meslek Vergi Hesaplayıcı"
            description="Calculate income tax for self-employed individuals in Malta with deductible business expenses."
            descriptionTr="İndirilebilir iş giderleri ile Malta'daki serbest meslek sahipleri için gelir vergisini hesaplayın."
            icon={<Calculator className="h-12 w-12 text-primary" />}
            category="Self-Employment"
            categoryTr="Serbest Meslek"
            features={[
                "Progressive tax rates",
                "Deductible expenses",
                "Provisional tax payments",
                "Part B assessment",
            ]}
            featuresTr={[
                "Artan vergi oranları",
                "İndirilebilir giderler",
                "Geçici vergi ödemeleri",
                "Part B değerlendirmesi",
            ]}
        />
    );
}
