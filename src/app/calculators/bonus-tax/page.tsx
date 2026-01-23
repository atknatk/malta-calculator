import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Coins } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Bonus Tax Calculator | Malta Calculator",
    description: "Malta bonus vergi hesaplayıcı. Tek seferlik bonus ve prim ödemelerinde vergi kesintisi hesaplama. Calculate tax on one-time bonuses in Malta.",
    alternates: { canonical: `${SITE_URL}/calculators/bonus-tax` },
    openGraph: { ...ogMetadata, title: "Bonus Tax Calculator | Malta Calculator", url: `${SITE_URL}/calculators/bonus-tax` },
    twitter: { ...twitterMetadata, title: "Bonus Tax Calculator | Malta Calculator" },
};

export default function BonusTaxPage() {
    return (
        <ComingSoonPage
            title="Bonus Tax Calculator"
            titleTr="Bonus Vergi Hesaplayıcı"
            description="Calculate the tax implications of one-time bonus payments, 13th-month salary, and performance bonuses in Malta."
            descriptionTr="Malta'da tek seferlik bonus ödemeleri, 13. maaş ve performans bonuslarının vergi etkilerini hesaplayın."
            icon={<Coins className="h-12 w-12 text-primary" />}
            category="Employment"
            categoryTr="İstihdam"
            features={[
                "13th month salary calculation",
                "Performance bonus tax",
                "End-of-year bonus handling",
                "Cumulative tax bracket impact",
            ]}
            featuresTr={[
                "13. maaş hesaplaması",
                "Performans bonusu vergisi",
                "Yıl sonu bonus işleme",
                "Kümülatif vergi dilimi etkisi",
            ]}
        />
    );
}
