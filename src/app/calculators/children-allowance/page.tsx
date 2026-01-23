import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Baby } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Children's Allowance Calculator | Malta Calculator",
    description: "Malta çocuk yardımı hesaplayıcı. Çocuk sayısı ve gelire göre aylık yardım hesaplama. Calculate children's allowance in Malta.",
    alternates: { canonical: `${SITE_URL}/calculators/children-allowance` },
    openGraph: { ...ogMetadata, title: "Children's Allowance Calculator | Malta Calculator", url: `${SITE_URL}/calculators/children-allowance` },
    twitter: { ...twitterMetadata, title: "Children's Allowance Calculator | Malta Calculator" },
};

export default function ChildrenAllowancePage() {
    return (
        <ComingSoonPage
            title="Children's Allowance Calculator"
            titleTr="Çocuk Yardımı Hesaplayıcı"
            description="Calculate your monthly children's allowance based on household income and number of children."
            descriptionTr="Hane geliri ve çocuk sayısına göre aylık çocuk yardımınızı hesaplayın."
            icon={<Baby className="h-12 w-12 text-primary" />}
            category="Family"
            categoryTr="Aile"
            features={[
                "Income-tested allowance",
                "Per-child rates",
                "Age-based adjustments",
                "Disability top-ups",
            ]}
            featuresTr={[
                "Gelire dayalı yardım",
                "Çocuk başına oranlar",
                "Yaşa göre ayarlamalar",
                "Engelli ek yardımları",
            ]}
        />
    );
}
