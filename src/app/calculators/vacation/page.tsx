import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Calendar } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Vacation Days Calculator | Malta Calculator",
    description: "Malta yıllık izin hesaplayıcı. Minimum 192 saat yıllık izin hakkı hesaplama. Calculate annual leave entitlement in Malta.",
    alternates: { canonical: `${SITE_URL}/calculators/vacation` },
    openGraph: { ...ogMetadata, title: "Vacation Days Calculator | Malta Calculator", url: `${SITE_URL}/calculators/vacation` },
    twitter: { ...twitterMetadata, title: "Vacation Days Calculator | Malta Calculator" },
};

export default function VacationPage() {
    return (
        <ComingSoonPage
            title="Vacation Days Calculator"
            titleTr="Yıllık İzin Hesaplayıcı"
            description="Calculate your annual leave entitlement in Malta. Minimum 192 working hours (24 days) per year."
            descriptionTr="Malta'daki yıllık izin hakkınızı hesaplayın. Yılda minimum 192 çalışma saati (24 gün)."
            icon={<Calendar className="h-12 w-12 text-primary" />}
            category="Leave"
            categoryTr="İzin"
            features={[
                "Minimum 192 hours/year",
                "Pro-rata for part-time",
                "Public holiday additions",
                "Carryover rules",
            ]}
            featuresTr={[
                "Yılda minimum 192 saat",
                "Yarı zamanlı için orantılı",
                "Resmi tatil eklemeleri",
                "Devir kuralları",
            ]}
        />
    );
}
