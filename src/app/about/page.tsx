import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import {
    defaultMetadata,
    ogMetadata,
    twitterMetadata,
    SITE_URL,
    SITE_NAME,
} from "../shared-metadata";
import { Shell } from "@/components/dashboard/shell";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "About Us | Malta Calculator",
    description:
        "Learn about Malta Calculator - free salary, tax, and SSC calculation tools for residents and workers in Malta. Independent platform with accurate 2024-2026 tax data.",
    alternates: {
        canonical: `${SITE_URL}/about`,
    },
    openGraph: {
        ...ogMetadata,
        title: "About Us | Malta Calculator",
        url: `${SITE_URL}/about`,
    },
    twitter: {
        ...twitterMetadata,
        title: "About Us | Malta Calculator",
    },
};

// Performance: Static page - no revalidation needed
export const dynamic = 'force-static';
export const revalidate = false;

export default function AboutPage() {
    return (
        <MarketingLayout>
            <main role="main" aria-label="About Malta Calculator">
                <Shell className="max-w-4xl py-12">
                    <article className="prose prose-neutral dark:prose-invert max-w-none">
                        <h1 className="font-cal text-4xl md:text-5xl font-bold mb-8">
                            About Malta Calculator
                        </h1>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Malta Calculator, Malta&apos;da yaşayan ve çalışan herkes için ücretsiz,
                                doğru ve kullanımı kolay finansal hesaplama araçları sunmayı amaçlayan
                                bağımsız bir platformdur.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                Malta Calculator is an independent platform dedicated to providing free,
                                accurate, and easy-to-use financial calculation tools for everyone living
                                and working in Malta.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>
                                    <strong>Salary Calculator:</strong> Calculate your net salary with accurate
                                    2024-2026 tax brackets, SSC contributions, and COLA adjustments
                                </li>
                                <li>
                                    <strong>Multi-Year Support:</strong> Compare calculations across different
                                    tax years (2024, 2025, 2026)
                                </li>
                                <li>
                                    <strong>Tax Type Options:</strong> Single, Married, and Parent tax rate calculations
                                </li>
                                <li>
                                    <strong>SSC Categories:</strong> Full support for Category A, B, and C with
                                    automatic age-based regime detection
                                </li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Accuracy Guarantee</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Hesaplamalarımız, Malta Gelir İdaresi (IRD) ve Sosyal Güvenlik Departmanı
                                tarafından yayınlanan resmi vergi tablolarına ve SSC oranlarına dayanmaktadır.
                                Yıllık güncellemeler, her yıl Ocak ayında yeni bütçe değişikliklerini yansıtacak
                                şekilde yapılmaktadır.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                Our calculations are based on official tax tables and SSC rates published by
                                the Malta Inland Revenue Department (IRD) and Social Security Department.
                                Annual updates are made every January to reflect new budget changes.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Malta Calculator yalnızca bilgilendirme amaçlıdır. Sonuçlar tahmini olup,
                                resmi mali veya vergi tavsiyesi yerine geçmez. Önemli finansal kararlar için
                                lütfen nitelikli bir muhasebeci veya vergi danışmanına başvurun.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                Malta Calculator is for informational purposes only. Results are estimates
                                and do not constitute official financial or tax advice. Please consult a
                                qualified accountant or tax advisor for important financial decisions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Sorularınız veya geri bildirimleriniz için bizimle iletişime geçebilirsiniz.
                                For questions or feedback, please use our{" "}
                                <a href="/contact" className="text-primary hover:underline font-medium">
                                    contact form
                                </a>
                                .
                            </p>
                        </section>
                    </article>
                </Shell>
            </main>
        </MarketingLayout>
    );
}
