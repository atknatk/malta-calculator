import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Briefcase } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "In-Work Benefit Calculator | Malta Calculator",
    description: "Malta çalışma desteği hesaplayıcı. Düşük gelirli çalışan aileler için In-Work Benefit hesaplama. Calculate in-work benefit in Malta.",
    alternates: { canonical: `${SITE_URL}/calculators/in-work-benefit` },
    openGraph: { ...ogMetadata, title: "In-Work Benefit Calculator | Malta Calculator", url: `${SITE_URL}/calculators/in-work-benefit` },
    twitter: { ...twitterMetadata, title: "In-Work Benefit Calculator | Malta Calculator" },
};

export default function InWorkBenefitPage() {
    return (
        <ComingSoonPage
            title="In-Work Benefit Calculator"
            titleTr="Çalışma Desteği Hesaplayıcı"
            description="Calculate the in-work benefit available to low-income working families in Malta."
            descriptionTr="Malta'da düşük gelirli çalışan aileler için mevcut çalışma desteğini hesaplayın."
            icon={<Briefcase className="h-12 w-12 text-primary" />}
            category="Family"
            categoryTr="Aile"
            features={[
                "Income thresholds",
                "Family size adjustments",
                "Employment hours requirement",
                "Tapering rates",
            ]}
            featuresTr={[
                "Gelir eşikleri",
                "Aile büyüklüğü ayarlamaları",
                "Çalışma saati gereksinimleri",
                "Azaltma oranları",
            ]}
        />
    );
}
