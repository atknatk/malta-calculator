import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Globe } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Expatriate Tax Calculator (HQP) | Malta Calculator",
    description: "Malta HQP vergi hesaplayıcı. Highly Qualified Persons için %15 sabit vergi oranı hesaplama. Calculate 15% flat tax for highly qualified persons in Malta.",
    alternates: { canonical: `${SITE_URL}/calculators/expatriate-tax` },
    openGraph: { ...ogMetadata, title: "Expatriate Tax Calculator (HQP) | Malta Calculator", url: `${SITE_URL}/calculators/expatriate-tax` },
    twitter: { ...twitterMetadata, title: "Expatriate Tax Calculator (HQP) | Malta Calculator" },
};

export default function ExpatriateTaxPage() {
    return (
        <ComingSoonPage
            title="Expatriate Tax Calculator"
            titleTr="Yabancı Vergi Hesaplayıcı (HQP)"
            description="Calculate your tax under Malta's Highly Qualified Persons (HQP) scheme with a flat 15% tax rate on qualifying income."
            descriptionTr="Malta'nın Highly Qualified Persons (HQP) programı kapsamında nitelikli gelir üzerinden %15 sabit vergi oranı ile verginizi hesaplayın."
            icon={<Globe className="h-12 w-12 text-primary" />}
            category="Employment"
            categoryTr="İstihdam"
            features={[
                "15% flat tax rate calculation",
                "Eligibility criteria check",
                "Qualifying sectors and roles",
                "Comparison with standard tax rates",
            ]}
            featuresTr={[
                "%15 sabit vergi oranı hesaplama",
                "Uygunluk kriterleri kontrolü",
                "Nitelikli sektörler ve roller",
                "Standart vergi oranlarıyla karşılaştırma",
            ]}
        />
    );
}
