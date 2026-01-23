import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Baby } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Maternity & Paternity Leave Calculator | Malta Calculator",
    description: "Malta doğum izni hesaplayıcı. Annelik ve babalık izni süresi ve ödemesi hesaplama. Calculate maternity and paternity leave in Malta.",
    alternates: { canonical: `${SITE_URL}/calculators/maternity` },
    openGraph: { ...ogMetadata, title: "Maternity & Paternity Leave Calculator | Malta Calculator", url: `${SITE_URL}/calculators/maternity` },
    twitter: { ...twitterMetadata, title: "Maternity & Paternity Leave Calculator | Malta Calculator" },
};

export default function MaternityPage() {
    return (
        <ComingSoonPage
            title="Maternity & Paternity Leave"
            titleTr="Doğum İzni Hesaplayıcı"
            description="Calculate your entitled maternity leave (18 weeks) and paternity leave duration and payment in Malta."
            descriptionTr="Malta'da hak kazandığınız doğum iznin (18 hafta) ve babalık izni süresini ve ödemeyi hesaplayın."
            icon={<Baby className="h-12 w-12 text-primary" />}
            category="Family"
            categoryTr="Aile"
            features={[
                "18 weeks maternity leave",
                "10 days paternity leave",
                "Maternity benefit calculation",
                "Employer contribution periods",
            ]}
            featuresTr={[
                "18 hafta doğum izni",
                "10 gün babalık izni",
                "Doğum yardımı hesaplama",
                "İşveren katkı dönemleri",
            ]}
        />
    );
}
