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
    Shield,
    Eye,
    Cookie,
    Database,
    Lock,
    UserCheck,
    Globe,
    Mail,
    FileText,
    Server
} from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Privacy Policy | Malta Calculator - GDPR Compliant",
    description:
        "Privacy Policy for Malta Calculator. GDPR compliant. Learn how we collect, use, and protect your data. No personal financial data stored.",
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
                        {/* Header */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-full mb-4">
                                <Shield className="w-4 h-4" />
                                <span>GDPR Compliant</span>
                            </div>
                            <h1 className="font-cal text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
                                Your privacy is important to us. This policy explains how we handle your information.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Last updated: January 24, 2026 | Effective: January 24, 2026
                            </p>
                        </div>

                        {/* Privacy Highlights */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                            <div className="glass-panel p-4 text-center rounded-xl">
                                <Lock className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                                <div className="font-semibold">No Data Storage</div>
                                <div className="text-xs text-muted-foreground">Financial data not stored</div>
                            </div>
                            <div className="glass-panel p-4 text-center rounded-xl">
                                <Shield className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                                <div className="font-semibold">HTTPS Encrypted</div>
                                <div className="text-xs text-muted-foreground">Secure connection</div>
                            </div>
                            <div className="glass-panel p-4 text-center rounded-xl">
                                <UserCheck className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                                <div className="font-semibold">GDPR Rights</div>
                                <div className="text-xs text-muted-foreground">Full data control</div>
                            </div>
                        </div>

                        {/* Section 1 */}
                        <section className="mb-10 pb-8 border-b border-border/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary"><Eye className="w-5 h-5" /></div>
                                <h2 className="text-2xl font-semibold !my-0">1. Introduction</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                At Malta Calculator, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                This policy applies to all users of Malta Calculator and complies with the General Data Protection Regulation (GDPR) and Malta&apos;s Data Protection Act.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4 p-4 bg-muted/30 rounded-lg border-l-4 border-primary/50">
                                <strong>🇲🇹 Malti:</strong> F&apos;Malta Calculator, nirrispettaw il-privatezza tiegħek u nimpenjaw ruħna li nipproteġu d-data personali tiegħek. Din il-Politika ta&apos; Privatezza tispjega kif niġbru, nużaw, u nipproteġu l-informazzjoni tiegħek.
                            </p>
                        </section>

                        {/* Section 2 */}
                        <section className="mb-10 pb-8 border-b border-border/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary"><Database className="w-5 h-5" /></div>
                                <h2 className="text-2xl font-semibold !my-0">2. Information We Collect</h2>
                            </div>

                            <h3 className="text-lg font-semibold mt-6 mb-3">2.1 Automatically Collected Information</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                When you visit our website, we automatically collect anonymous usage data through Google Analytics 4, including:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2 ml-4">
                                <li>IP address (anonymized/masked)</li>
                                <li>Browser type and version</li>
                                <li>Device type (desktop, mobile, tablet)</li>
                                <li>Operating system</li>
                                <li>Pages visited and time spent</li>
                                <li>Referring website</li>
                                <li>Geographic location (country/region level only)</li>
                            </ul>

                            <h3 className="text-lg font-semibold mt-6 mb-3">2.2 Calculation Data</h3>
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                <p className="text-emerald-700 dark:text-emerald-300">
                                    ✅ <strong>Important:</strong> Salary, tax, and financial information you enter into our calculators is <strong>NOT stored on our servers</strong>. All calculations are performed:
                                </p>
                                <ul className="list-disc list-inside text-emerald-700 dark:text-emerald-300 mt-2 ml-4 space-y-1">
                                    <li>Client-side in your browser, OR</li>
                                    <li>As stateless server-side operations (no data retention)</li>
                                </ul>
                            </div>

                            <h3 className="text-lg font-semibold mt-6 mb-3">2.3 Information We Do NOT Collect</h3>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li>Names or personal identifiers</li>
                                <li>Email addresses (unless you contact us)</li>
                                <li>Bank account or payment information</li>
                                <li>Social security numbers or ID card numbers</li>
                                <li>Employer information</li>
                            </ul>
                        </section>

                        {/* Section 3 */}
                        <section className="mb-10 pb-8 border-b border-border/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary"><FileText className="w-5 h-5" /></div>
                                <h2 className="text-2xl font-semibold !my-0">3. How We Use Information</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">We use the collected information for:</p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4 ml-4">
                                <li>Analyzing website traffic and usage patterns</li>
                                <li>Improving website performance and user experience</li>
                                <li>Understanding which calculators are most popular</li>
                                <li>Identifying and fixing technical issues</li>
                                <li>Ensuring website security</li>
                            </ul>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                <strong>Legal Basis (GDPR Article 6):</strong> We process data based on legitimate interests (website improvement and security) and, where applicable, your consent for analytics cookies.
                            </p>
                        </section>

                        {/* Section 4 */}
                        <section className="mb-10 pb-8 border-b border-border/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600"><Cookie className="w-5 h-5" /></div>
                                <h2 className="text-2xl font-semibold !my-0">4. Cookies & Tracking</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">Our website uses the following types of cookies:</p>

                            <div className="mt-4 space-y-4">
                                <div className="p-4 bg-muted/30 rounded-lg">
                                    <h4 className="font-semibold text-emerald-600 dark:text-emerald-400">Essential Cookies (Always Active)</h4>
                                    <p className="text-sm text-muted-foreground mt-1">Required for basic website functionality, theme preference, and session management.</p>
                                </div>
                                <div className="p-4 bg-muted/30 rounded-lg">
                                    <h4 className="font-semibold text-blue-600 dark:text-blue-400">Analytics Cookies (Google Analytics 4)</h4>
                                    <p className="text-sm text-muted-foreground mt-1">Help us understand how visitors interact with our website. Data is anonymized and aggregated.</p>
                                </div>
                            </div>

                            <p className="text-muted-foreground leading-relaxed mt-4">
                                <strong>Managing Cookies:</strong> You can disable cookies through your browser settings. Note that disabling essential cookies may affect website functionality.
                            </p>
                        </section>

                        {/* Section 5 */}
                        <section className="mb-10 pb-8 border-b border-border/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary"><Globe className="w-5 h-5" /></div>
                                <h2 className="text-2xl font-semibold !my-0">5. Third-Party Services</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">We use the following third-party services:</p>
                            <div className="mt-4 space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                                    <Server className="w-5 h-5 text-primary mt-0.5" />
                                    <div>
                                        <strong>Vercel</strong>
                                        <p className="text-sm text-muted-foreground">Website hosting and deployment (USA/EU)</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                                    <Database className="w-5 h-5 text-primary mt-0.5" />
                                    <div>
                                        <strong>Google Analytics 4</strong>
                                        <p className="text-sm text-muted-foreground">Website analytics with IP anonymization enabled</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                Each third-party service has its own privacy policy governing data handling.
                            </p>
                        </section>

                        {/* Section 6 */}
                        <section className="mb-10 pb-8 border-b border-border/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary"><Lock className="w-5 h-5" /></div>
                                <h2 className="text-2xl font-semibold !my-0">6. Data Security</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">We implement appropriate security measures:</p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4 ml-4">
                                <li><strong>HTTPS Encryption:</strong> All data transmitted is encrypted via TLS/SSL</li>
                                <li><strong>No Financial Data Storage:</strong> We don&apos;t store sensitive calculation inputs</li>
                                <li><strong>Secure Hosting:</strong> Enterprise-grade infrastructure on Vercel</li>
                                <li><strong>Regular Updates:</strong> Security patches applied promptly</li>
                            </ul>
                        </section>

                        {/* Section 7 - GDPR Rights */}
                        <section className="mb-10 pb-8 border-b border-border/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600"><UserCheck className="w-5 h-5" /></div>
                                <h2 className="text-2xl font-semibold !my-0">7. Your Rights (GDPR)</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">Under GDPR, you have the following rights:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                <div className="p-3 bg-muted/30 rounded-lg">
                                    <strong className="text-primary">Right to Access</strong>
                                    <p className="text-sm text-muted-foreground">Request a copy of your personal data</p>
                                </div>
                                <div className="p-3 bg-muted/30 rounded-lg">
                                    <strong className="text-primary">Right to Rectification</strong>
                                    <p className="text-sm text-muted-foreground">Correct inaccurate personal data</p>
                                </div>
                                <div className="p-3 bg-muted/30 rounded-lg">
                                    <strong className="text-primary">Right to Erasure</strong>
                                    <p className="text-sm text-muted-foreground">Request deletion of your data</p>
                                </div>
                                <div className="p-3 bg-muted/30 rounded-lg">
                                    <strong className="text-primary">Right to Portability</strong>
                                    <p className="text-sm text-muted-foreground">Receive data in machine-readable format</p>
                                </div>
                                <div className="p-3 bg-muted/30 rounded-lg">
                                    <strong className="text-primary">Right to Object</strong>
                                    <p className="text-sm text-muted-foreground">Object to data processing</p>
                                </div>
                                <div className="p-3 bg-muted/30 rounded-lg">
                                    <strong className="text-primary">Right to Complain</strong>
                                    <p className="text-sm text-muted-foreground">Lodge complaint with supervisory authority</p>
                                </div>
                            </div>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                To exercise these rights, <a href="/contact" className="text-primary hover:underline">contact us through our contact form</a>. The Malta supervisory authority is the Information and Data Protection Commissioner (IDPC).
                            </p>
                        </section>

                        {/* Section 8 */}
                        <section className="mb-10 pb-8 border-b border-border/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary"><FileText className="w-5 h-5" /></div>
                                <h2 className="text-2xl font-semibold !my-0">8. Data Retention</h2>
                            </div>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li><strong>Calculator inputs:</strong> Not retained (processed in real-time only)</li>
                                <li><strong>Analytics data:</strong> 14 months (Google Analytics default)</li>
                                <li><strong>Server logs:</strong> 30 days (security purposes)</li>
                            </ul>
                        </section>

                        {/* Section 9 */}
                        <section className="mb-10 pb-8 border-b border-border/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary"><Globe className="w-5 h-5" /></div>
                                <h2 className="text-2xl font-semibold !my-0">9. International Transfers</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                Some third-party services may transfer data outside the European Economic Area (EEA). Where this occurs, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses (SCCs) or adequacy decisions.
                            </p>
                        </section>

                        {/* Section 10 */}
                        <section className="mb-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary"><Mail className="w-5 h-5" /></div>
                                <h2 className="text-2xl font-semibold !my-0">10. Contact Us</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">For privacy-related inquiries:</p>
                            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                                <p className="text-muted-foreground"><strong>Contact Form:</strong> <a href="/contact" className="text-primary hover:underline">Visit our Contact Page</a></p>
                                <p className="text-muted-foreground mt-2"><strong>Website:</strong> <a href={SITE_URL} className="text-primary hover:underline">{SITE_URL}</a></p>
                            </div>
                        </section>

                        {/* Footer */}
                        <section className="mt-8 p-6 bg-gradient-to-br from-emerald-500/5 via-background to-blue-500/5 rounded-2xl border border-emerald-500/10 text-center">
                            <Shield className="w-8 h-8 mx-auto mb-3 text-emerald-500" />
                            <p className="text-muted-foreground mb-2">
                                Your privacy matters. We are committed to transparency and data protection.
                            </p>
                            <p className="text-sm text-muted-foreground">Policy version: 2.0 | © 2024-2026 Malta Calculator</p>
                        </section>
                    </article>
                </Shell>
            </main>
        </MarketingLayout>
    );
}
