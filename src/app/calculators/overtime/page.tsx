import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Clock } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Overtime Calculator | Malta Calculator",
    description: "Malta fazla mesai hesaplayıcı. 1.5x ve 2x fazla mesai ücretlerini hesaplayın. Calculate overtime pay in Malta at 1.5x and 2x rates.",
    alternates: { canonical: `${SITE_URL}/calculators/overtime` },
    openGraph: { ...ogMetadata, title: "Overtime Calculator | Malta Calculator", url: `${SITE_URL}/calculators/overtime` },
    twitter: { ...twitterMetadata, title: "Overtime Calculator | Malta Calculator" },
};

export default function OvertimePage() {
    return (
        <ComingSoonPage
            title="Overtime Calculator"
            titleTr="Fazla Mesai Hesaplayıcı"
            description="Calculate your overtime pay based on Malta's employment regulations. Get accurate rates for weekday, weekend, and holiday overtime."
            descriptionTr="Malta'nın istihdam düzenlemelerine göre fazla mesai ücretinizi hesaplayın. Hafta içi, hafta sonu ve tatil günleri için doğru oranları alın."
            icon={<Clock className="h-12 w-12 text-primary" />}
            category="Employment"
            categoryTr="İstihdam"
            features={[
                "1.5x rate for regular overtime",
                "2x rate for Sundays and public holidays",
                "Weekly hour thresholds",
                "Tax calculation on overtime pay",
            ]}
            featuresTr={[
                "Normal fazla mesai için 1.5x oran",
                "Pazar ve resmi tatiller için 2x oran",
                "Haftalık saat eşikleri",
                "Fazla mesai ücreti vergi hesaplama",
            ]}
        />
    );
}
