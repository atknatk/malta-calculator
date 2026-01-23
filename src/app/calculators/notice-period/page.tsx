import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Clock } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Notice Period Calculator | Malta Calculator",
    description: "Malta'da ihbar süresi hesaplayıcı. Hizmet yılına göre yasal ihbar süresi hesaplama. Calculate your required notice period in Malta based on years of service.",
    alternates: { canonical: `${SITE_URL}/calculators/notice-period` },
    openGraph: { ...ogMetadata, title: "Notice Period Calculator | Malta Calculator", url: `${SITE_URL}/calculators/notice-period` },
    twitter: { ...twitterMetadata, title: "Notice Period Calculator | Malta Calculator" },
};

export default function NoticePeriodPage() {
    return (
        <ComingSoonPage
            title="Notice Period Calculator"
            titleTr="İhbar Süresi Hesaplayıcı"
            description="Calculate your required notice period based on your years of service and employment contract type in Malta."
            descriptionTr="Malta'da hizmet yılınıza ve iş sözleşmesi türünüze göre gereken ihbar süresini hesaplayın."
            icon={<Clock className="h-12 w-12 text-primary" />}
            category="Employment"
            categoryTr="İstihdam"
            features={[
                "Based on Employment and Industrial Relations Act",
                "Different periods for different service durations",
                "Probation period considerations",
                "Fixed-term vs indefinite contracts",
            ]}
            featuresTr={[
                "İş ve Endüstriyel İlişkiler Yasasına dayalı",
                "Farklı hizmet süreleri için farklı dönemler",
                "Deneme süresi değerlendirmeleri",
                "Belirli süreli vs süresiz sözleşmeler",
            ]}
        />
    );
}
