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
    title: "Privacy Policy | Malta Calculator",
    description:
        "Malta Calculator Gizlilik Politikası. Verilerinizi nasıl topladığımız, kullandığımız ve koruduğumuz hakkında bilgi. Privacy Policy for Malta Calculator - how we collect, use, and protect your data.",
    alternates: {
        canonical: `${SITE_URL}/privacy`,
    },
    openGraph: {
        ...ogMetadata,
        title: "Privacy Policy | Malta Calculator",
        url: `${SITE_URL}/privacy`,
    },
    twitter: {
        ...twitterMetadata,
        title: "Privacy Policy | Malta Calculator",
    },
};

export default function PrivacyPage() {
    return (
        <MarketingLayout>
            <main role="main" aria-label="Privacy Policy">
                <Shell className="max-w-4xl py-12">
                    <article className="prose prose-neutral dark:prose-invert max-w-none">
                        <h1 className="font-cal text-4xl md:text-5xl font-bold mb-8">
                            Privacy Policy
                        </h1>
                        <p className="text-sm text-muted-foreground mb-8">
                            Last updated: January 2026
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Malta Calculator olarak gizliliğinize saygı duyuyoruz. Bu Gizlilik Politikası,
                                web sitemizi ziyaret ettiğinizde bilgilerinizi nasıl topladığımızı, kullandığımızı
                                ve koruduğumuzu açıklar.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                At Malta Calculator, we respect your privacy. This Privacy Policy explains how
                                we collect, use, and protect your information when you visit our website.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                <strong>Otomatik Olarak Toplanan Bilgiler:</strong> Web sitemizi ziyaret ettiğinizde,
                                Google Analytics aracılığıyla anonim kullanım verileri topluyoruz. Bu veriler
                                IP adresi (anonimleştirilmiş), tarayıcı türü, cihaz bilgisi ve ziyaret edilen
                                sayfaları içerir.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                <strong>Automatically Collected Information:</strong> When you visit our website,
                                we collect anonymous usage data through Google Analytics. This includes anonymized
                                IP address, browser type, device information, and pages visited.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                <strong>Hesaplama Verileri:</strong> Hesap makinesine girdiğiniz maaş bilgileri
                                sunucularımızda saklanmaz. Tüm hesaplamalar tarayıcınızda veya anlık sunucu
                                işlemleri olarak gerçekleştirilir.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                <strong>Calculation Data:</strong> Salary information you enter into the calculator
                                is not stored on our servers. All calculations are performed in your browser or
                                as instant server-side operations.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">3. How We Use Information</h2>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Web sitemizin performansını ve kullanıcı deneyimini iyileştirmek için</li>
                                <li>Kullanım istatistiklerini analiz etmek için</li>
                                <li>Teknik sorunları tespit etmek ve gidermek için</li>
                            </ul>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                                <li>To improve website performance and user experience</li>
                                <li>To analyze usage statistics</li>
                                <li>To identify and fix technical issues</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">4. Cookies</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Web sitemiz çerezler kullanmaktadır. Bunlar arasında temel işlevsellik için
                                gerekli çerezler ve Google Analytics izleme çerezleri bulunmaktadır. Tarayıcı
                                ayarlarınızdan çerezleri devre dışı bırakabilirsiniz.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                Our website uses cookies. These include essential cookies for basic functionality
                                and Google Analytics tracking cookies. You can disable cookies through your
                                browser settings.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Aşağıdaki üçüncü taraf hizmetlerini kullanıyoruz:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
                                <li><strong>Google Analytics:</strong> Web sitesi analizi için</li>
                                <li><strong>Vercel:</strong> Web sitesi barındırma için</li>
                            </ul>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                We use the following third-party services:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
                                <li><strong>Google Analytics:</strong> For website analytics</li>
                                <li><strong>Vercel:</strong> For website hosting</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Web sitemiz HTTPS ile şifrelenmektedir. Kişisel finansal verilerinizi saklamadığımız
                                için, veri ihlali riski minimumdur.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                Our website is encrypted with HTTPS. Since we do not store personal financial data,
                                the risk of data breach is minimal.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                GDPR kapsamında, verilerinize erişim, düzeltme ve silme haklarına sahipsiniz.
                                Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                Under GDPR, you have the right to access, correct, and delete your data.
                                Contact us to exercise these rights.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Değişiklikler bu sayfada
                                yayınlandığında yürürlüğe girer.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                We may update this Privacy Policy from time to time. Changes become effective
                                when posted on this page.
                            </p>
                        </section>
                    </article>
                </Shell>
            </main>
        </MarketingLayout>
    );
}
