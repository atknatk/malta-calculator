import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Clock } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Part-Time Salary Calculator | Malta Calculator",
    description: "Malta yarı zamanlı maaş hesaplayıcı. Part-time çalışanlar için pro-rata maaş ve vergi hesaplama. Calculate part-time salary in Malta.",
    alternates: { canonical: `${SITE_URL}/calculators/part-time` },
    openGraph: { ...ogMetadata, title: "Part-Time Salary Calculator | Malta Calculator", url: `${SITE_URL}/calculators/part-time` },
    twitter: { ...twitterMetadata, title: "Part-Time Salary Calculator | Malta Calculator" },
};

export default function PartTimePage() {
    return (
        <ComingSoonPage
            title="Part-Time Salary Calculator"
            titleTr="Yarı Zamanlı Maaş Hesaplayıcı"
            description="Calculate pro-rata salary, tax, and SSC contributions for part-time employees in Malta."
            descriptionTr="Malta'da yarı zamanlı çalışanlar için orantılı maaş, vergi ve SSC katkılarını hesaplayın."
            icon={<Clock className="h-12 w-12 text-primary" />}
            category="Employment"
            categoryTr="İstihdam"
            features={[
                "Pro-rata salary calculation",
                "Proportional SSC contributions",
                "Minimum wage compliance check",
                "Annual leave pro-rata entitlement",
            ]}
            featuresTr={[
                "Orantılı maaş hesaplaması",
                "Orantılı SSC katkıları",
                "Asgari ücret uyumluluk kontrolü",
                "Yıllık izin orantılı hakkı",
            ]}
        />
    );
}
