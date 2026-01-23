import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Home } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Rental Tax Calculator | Malta Calculator",
    description: "Malta kira vergisi hesaplayıcı. %15 sabit oranlı kira geliri vergisi hesaplama. Calculate rental income tax in Malta.",
    alternates: { canonical: `${SITE_URL}/calculators/rental-tax` },
    openGraph: { ...ogMetadata, title: "Rental Tax Calculator | Malta Calculator", url: `${SITE_URL}/calculators/rental-tax` },
    twitter: { ...twitterMetadata, title: "Rental Tax Calculator | Malta Calculator" },
};

export default function RentalTaxPage() {
    return (
        <ComingSoonPage
            title="Rental Tax Calculator"
            titleTr="Kira Vergisi Hesaplayıcı"
            description="Calculate rental income tax in Malta. Choose between 15% flat rate or standard progressive tax rates."
            descriptionTr="Malta'da kira gelir vergisini hesaplayın. %15 sabit oran veya standart artan vergi oranları arasında seçim yapın."
            icon={<Home className="h-12 w-12 text-primary" />}
            category="Property"
            categoryTr="Gayrimenkul"
            features={[
                "15% flat rate option",
                "Progressive rate comparison",
                "Deductible expenses",
                "Long-term vs short-term rental",
            ]}
            featuresTr={[
                "%15 sabit oran seçeneği",
                "Artan oran karşılaştırması",
                "İndirilebilir giderler",
                "Uzun vadeli vs kısa vadeli kiralama",
            ]}
        />
    );
}
