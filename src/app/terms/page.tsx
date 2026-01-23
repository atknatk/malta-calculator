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
    title: "Terms of Service | Malta Calculator",
    description:
        "Malta Calculator Kullanım Şartları. Hizmetlerimizi kullanırken geçerli olan kurallar ve koşullar. Terms of Service for Malta Calculator - rules and conditions that apply when using our services.",
    alternates: {
        canonical: `${SITE_URL}/terms`,
    },
    openGraph: {
        ...ogMetadata,
        title: "Terms of Service | Malta Calculator",
        url: `${SITE_URL}/terms`,
    },
    twitter: {
        ...twitterMetadata,
        title: "Terms of Service | Malta Calculator",
    },
};

export default function TermsPage() {
    return (
        <MarketingLayout>
            <main role="main" aria-label="Terms of Service">
                <Shell className="max-w-4xl py-12">
                    <article className="prose prose-neutral dark:prose-invert max-w-none">
                        <h1 className="font-cal text-4xl md:text-5xl font-bold mb-8">
                            Terms of Service
                        </h1>
                        <p className="text-sm text-muted-foreground mb-8">
                            Last updated: January 2026
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Malta Calculator web sitesini (&quot;Hizmet&quot;) kullanarak, bu Kullanım Şartlarını
                                kabul etmiş olursunuz. Bu şartları kabul etmiyorsanız, lütfen Hizmetimizi kullanmayın.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                By accessing and using the Malta Calculator website (&quot;Service&quot;), you accept
                                and agree to be bound by these Terms of Service. If you do not agree to these
                                terms, please do not use our Service.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Malta Calculator, Malta&apos;daki maaş, vergi ve sosyal güvenlik katkılarını
                                hesaplamak için ücretsiz çevrimiçi araçlar sunar. Sonuçlar yalnızca bilgilendirme
                                amaçlıdır.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                Malta Calculator provides free online tools for calculating salary, tax, and
                                social security contributions in Malta. Results are for informational purposes only.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">3. Disclaimer of Warranties</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Hizmet &quot;olduğu gibi&quot; ve &quot;mevcut olduğu şekliyle&quot; sunulmaktadır.
                                Hesaplamaların doğruluğu veya güncelliği konusunda hiçbir garanti vermiyoruz.
                                Vergi oranları ve düzenlemeler değişebilir.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                The Service is provided &quot;as is&quot; and &quot;as available.&quot; We make no
                                warranties regarding the accuracy or timeliness of calculations. Tax rates and
                                regulations are subject to change.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">4. Limitation of Liability</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Malta Calculator, Hizmeti kullanımınızdan kaynaklanan doğrudan, dolaylı, arızi
                                veya sonuç olarak ortaya çıkan zararlardan sorumlu tutulamaz. Finansal kararlar
                                için profesyonel danışmanlık almanızı öneririz.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                Malta Calculator shall not be liable for any direct, indirect, incidental, or
                                consequential damages arising from your use of the Service. We recommend seeking
                                professional advice for financial decisions.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Web sitesindeki tüm içerik, tasarım ve işlevsellik Malta Calculator&apos;a aittir
                                ve telif hakkı yasalarıyla korunmaktadır.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                All content, design, and functionality on the website are owned by Malta Calculator
                                and are protected by copyright laws.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">6. Modifications</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Bu şartları herhangi bir zamanda değiştirme hakkımızı saklı tutarız. Değişiklikler
                                web sitesinde yayınlandığında yürürlüğe girer.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                We reserve the right to modify these terms at any time. Changes become effective
                                when posted on the website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">7. Governing Law</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Bu şartlar Malta yasalarına tabidir ve Malta mahkemelerinin yargı yetkisine tabidir.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                These terms are governed by the laws of Malta and are subject to the jurisdiction
                                of Malta courts.
                            </p>
                        </section>
                    </article>
                </Shell>
            </main>
        </MarketingLayout>
    );
}
