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
import {
    FileText,
    Shield,
    Scale,
    AlertTriangle,
    Globe,
    BookOpen,
    ScrollText,
    Gavel,
    Mail
} from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Terms of Service | Malta Calculator",
    description:
        "Terms of Service for Malta Calculator. Rules and conditions that apply when using our free salary, tax, and financial calculation services.",
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
                        {/* Header */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                                <ScrollText className="w-4 h-4" />
                                <span>Legal Document</span>
                            </div>
                            <h1 className="font-cal text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
                                Please read these terms carefully before using Malta Calculator.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Last updated: January 24, 2026 | Effective: January 24, 2026
                            </p>
                        </div>

                        {/* Section 1 */}
                        <section id="acceptance" className="mb-10 pb-8 border-b border-border/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary"><ScrollText className="w-5 h-5" /></div>
                                <h2 className="text-2xl font-semibold !my-0">1. Acceptance of Terms</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                By accessing and using the Malta Calculator website (&quot;Service&quot;), you accept and agree to be bound by these Terms of Service. If you do not agree, you must not access or use the Service.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4 p-4 bg-muted/30 rounded-lg border-l-4 border-primary/50">
                                <strong>🇲🇹 Malti:</strong> Meta taċċessa u tuża l-websajt Malta Calculator, taċċetta u taqbel li tkun marbut b&apos;dawn it-Termini ta&apos; Servizz.
                            </p>
                        </section>

                        {/* Section 2 */}
                        <section id="description" className="mb-10 pb-8 border-b border-border/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary"><BookOpen className="w-5 h-5" /></div>
                                <h2 className="text-2xl font-semibold !my-0">2. Description of Service</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                Malta Calculator provides free online tools for calculating financial, tax, and employment-related matters specific to Malta, including:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4 ml-4">
                                <li><strong>Salary & Tax:</strong> Net salary, income tax, SSC contributions</li>
                                <li><strong>Vehicle:</strong> VRT, road license, driver license fees</li>
                                <li><strong>Property:</strong> Stamp duty, rental tax, first-time buyer exemptions</li>
                                <li><strong>Employment:</strong> Notice period, vacation, overtime, sick leave</li>
                                <li><strong>Banking:</strong> Mortgage, personal loan, savings interest</li>
                                <li><strong>Benefits:</strong> Children&apos;s allowance, in-work benefit, childcare</li>
                            </ul>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                All calculations are for <strong>informational purposes only</strong> and should not be relied upon for official purposes.
                            </p>
                        </section>

                        {/* Section 3 */}
                        <section id="disclaimer" className="mb-10 pb-8 border-b border-border/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600"><AlertTriangle className="w-5 h-5" /></div>
                                <h2 className="text-2xl font-semibold !my-0">3. Disclaimer of Warranties</h2>
                            </div>
                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-4">
                                <p className="text-amber-700 dark:text-amber-300 font-medium">⚠️ Important: Please read this section carefully.</p>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND.
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4 ml-4">
                                <li>Calculations may not always be accurate, complete, or up-to-date</li>
                                <li>Tax rates and regulations are subject to change by the Government of Malta</li>
                                <li>We cannot guarantee real-time accuracy</li>
                                <li>Always verify critical calculations with official sources (CFR, Transport Malta, DIER)</li>
                            </ul>
                        </section>

                        {/* Section 4 */}
                        <section id="liability" className="mb-10 pb-8 border-b border-border/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary"><Scale className="w-5 h-5" /></div>
                                <h2 className="text-2xl font-semibold !my-0">4. Limitation of Liability</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                Malta Calculator shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4 ml-4">
                                <li>Loss of profits, revenue, or business opportunities</li>
                                <li>Financial losses resulting from reliance on calculations</li>
                                <li>Incorrect tax filings, penalties, or interest charges</li>
                                <li>Decisions made based on Service outputs</li>
                            </ul>
                            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <p className="text-blue-700 dark:text-blue-300">
                                    💡 <strong>Recommendation:</strong> For important financial decisions, consult with qualified professionals such as accountants, tax advisors, or legal counsel in Malta.
                                </p>
                            </div>
                        </section>

                        {/* Section 5 */}
                        <section id="ip" className="mb-10 pb-8 border-b border-border/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary"><FileText className="w-5 h-5" /></div>
                                <h2 className="text-2xl font-semibold !my-0">5. Intellectual Property</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                All content, features, design elements, and intellectual property on the Service are owned by Malta Calculator and protected by copyright laws.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4"><strong>Permitted:</strong> Personal, non-commercial use; sharing links; printing results for personal use.</p>
                            <p className="text-muted-foreground leading-relaxed mt-2"><strong>Not Permitted:</strong> Copying, modifying, distributing, or selling any part of the Service without permission.</p>
                        </section>

                        {/* Section 6 */}
                        <section id="thirdparty" className="mb-10 pb-8 border-b border-border/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary"><Globe className="w-5 h-5" /></div>
                                <h2 className="text-2xl font-semibold !my-0">6. Third-Party Links</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                The Service contains links to third-party websites including official government resources:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4 ml-4">
                                <li>Inland Revenue Department (CFR) - cfr.gov.mt</li>
                                <li>Transport Malta - transport.gov.mt</li>
                                <li>DIER - dier.gov.mt</li>
                                <li>Social Security Department - socialsecurity.gov.mt</li>
                            </ul>
                            <p className="text-muted-foreground leading-relaxed mt-4">We are not responsible for the content or practices of third-party websites.</p>
                        </section>

                        {/* Section 7 */}
                        <section id="governing" className="mb-10 pb-8 border-b border-border/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary"><Gavel className="w-5 h-5" /></div>
                                <h2 className="text-2xl font-semibold !my-0">7. Governing Law</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                These Terms are governed by and construed in accordance with the laws of Malta. Any disputes shall be subject to the exclusive jurisdiction of the courts of Malta.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4 p-4 bg-muted/30 rounded-lg border-l-4 border-primary/50">
                                <strong>🇲🇹 Malti:</strong> Dawn it-Termini huma ggvernati mil-liġijiet ta&apos; Malta. Kwalunkwe tilwima tkun soġġetta għall-ġurisdizzjoni esklużiva tal-qrati ta&apos; Malta.
                            </p>
                        </section>

                        {/* Section 8 */}
                        <section id="contact" className="mb-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary"><Mail className="w-5 h-5" /></div>
                                <h2 className="text-2xl font-semibold !my-0">8. Contact Information</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                If you have any questions about these Terms, please contact us:
                            </p>
                            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                                <p className="text-muted-foreground">
                                    <strong>Email:</strong> <a href="mailto:legal@maltacalculator.com" className="text-primary hover:underline">legal@maltacalculator.com</a>
                                </p>
                                <p className="text-muted-foreground mt-2">
                                    <strong>Website:</strong> <a href={SITE_URL} className="text-primary hover:underline">{SITE_URL}</a>
                                </p>
                            </div>
                        </section>

                        {/* Footer */}
                        <section className="mt-8 p-6 bg-gradient-to-br from-primary/5 via-background to-secondary/5 rounded-2xl border border-primary/10 text-center">
                            <p className="text-muted-foreground mb-2">
                                By using Malta Calculator, you acknowledge that you have read, understood, and agree to these Terms.
                            </p>
                            <p className="text-sm text-muted-foreground">Document version: 2.0 | © 2024-2026 Malta Calculator</p>
                        </section>
                    </article>
                </Shell>
            </main>
        </MarketingLayout>
    );
}
