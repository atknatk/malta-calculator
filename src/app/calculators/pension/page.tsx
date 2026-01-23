import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Palmtree } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Pension Estimator | Malta Calculator",
    description: "Malta emekli maaşı hesaplayıcı. SSC katkılarına göre devlet emekli maaşı tahmini. Estimate your state pension in Malta.",
    alternates: { canonical: `${SITE_URL}/calculators/pension` },
    openGraph: { ...ogMetadata, title: "Pension Estimator | Malta Calculator", url: `${SITE_URL}/calculators/pension` },
    twitter: { ...twitterMetadata, title: "Pension Estimator | Malta Calculator" },
};

export default function PensionPage() {
    return (
        <ComingSoonPage
            title="Pension Estimator"
            titleTr="Emekli Maaşı Hesaplayıcı"
            description="Estimate your Malta state pension based on your SSC contribution history and expected retirement age."
            descriptionTr="SSC katkı geçmişinize ve beklenen emeklilik yaşınıza göre Malta devlet emekli maaşınızı tahmin edin."
            icon={<Palmtree className="h-12 w-12 text-primary" />}
            category="Retirement"
            categoryTr="Emeklilik"
            features={[
                "Contribution-based calculation",
                "Minimum pension amounts",
                "Two-thirds pension eligibility",
                "Early retirement impact",
            ]}
            featuresTr={[
                "Katkıya dayalı hesaplama",
                "Asgari emekli maaşı tutarları",
                "Üçte iki maaş uygunluğu",
                "Erken emeklilik etkisi",
            ]}
        />
    );
}
