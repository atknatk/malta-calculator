import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Baby } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Childcare Subsidy Calculator | Malta Calculator",
    description: "Malta kreş yardımı hesaplayıcı. Gelire göre çocuk bakımı desteği hesaplama. Calculate childcare subsidy in Malta based on income.",
    alternates: { canonical: `${SITE_URL}/calculators/childcare` },
    openGraph: { ...ogMetadata, title: "Childcare Subsidy Calculator | Malta Calculator", url: `${SITE_URL}/calculators/childcare` },
    twitter: { ...twitterMetadata, title: "Childcare Subsidy Calculator | Malta Calculator" },
};

export default function ChildcarePage() {
    return (
        <ComingSoonPage
            title="Childcare Subsidy Calculator"
            titleTr="Kreş Yardımı Hesaplayıcı"
            description="Calculate your eligible childcare subsidy based on household income and number of children in registered childcare facilities."
            descriptionTr="Kayıtlı çocuk bakım tesislerinde hane geliri ve çocuk sayısına göre hak kazandığınız kreş yardımını hesaplayın."
            icon={<Baby className="h-12 w-12 text-primary" />}
            category="Family"
            categoryTr="Aile"
            features={[
                "Income-based subsidy tiers",
                "Multiple children calculation",
                "Registered facilities only",
                "Maximum subsidy amounts",
            ]}
            featuresTr={[
                "Gelire dayalı yardım kademeleri",
                "Birden fazla çocuk hesaplama",
                "Sadece kayıtlı tesisler",
                "Maksimum yardım tutarları",
            ]}
        />
    );
}
