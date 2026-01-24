import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, Calculator, FileCheck, Home, AlertTriangle, CheckCircle } from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Malta Expat Mortgage Guide 2026: AIP Permit, Residency & Stamp Duty | Malta Calculator",
    description: "Complete guide for expats buying property in Malta 2026. Learn about AIP permit requirements, 5-year residency rule, 5% stamp duty (1%+4%), and first-time buyer exemptions.",
    keywords: ["Malta expat mortgage", "AIP permit Malta", "Malta expat property", "Malta residency property", "Malta stamp duty expat", "Malta foreign buyer"],
    alternates: { canonical: `${SITE_URL}/blog/malta-expat-mortgage-guide-2026` },
    openGraph: { ...ogMetadata, title: "Malta Expat Mortgage Guide 2026", url: `${SITE_URL}/blog/malta-expat-mortgage-guide-2026`, type: "article" },
    twitter: { ...twitterMetadata, title: "Malta Expat Mortgage Guide 2026" },
};

export default function MaltaExpatMortgageGuidePage() {
    return (
        <MarketingLayout>
            <ArticleJsonLd
                title="Malta Expat Mortgage Guide 2026: AIP Permit, Residency & Stamp Duty"
                description="Complete guide for expats buying property in Malta."
                slug="malta-expat-mortgage-guide-2026"
                datePublished="2026-01-01"
            />
            <BreadcrumbJsonLd items={[
                { name: "Home", url: SITE_URL },
                { name: "Blog", url: `${SITE_URL}/blog` },
                { name: "Expat Mortgage Guide", url: `${SITE_URL}/blog/malta-expat-mortgage-guide-2026` },
            ]} />
            <main role="main">
                <Shell className="max-w-4xl py-12">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Blog
                    </Link>

                    <article className="prose prose-neutral dark:prose-invert max-w-none">
                        <header className="mb-12 not-prose">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-amber-500/10 text-amber-600 text-sm font-semibold rounded-full">Expat Guide</span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground"><Calendar className="h-4 w-4" /> January 2026</span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="h-4 w-4" /> 8 min read</span>
                            </div>
                            <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">Malta Expat Mortgage Guide 2026</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Everything expats need to know about buying property and getting a mortgage in Malta.
                            </p>
                        </header>

                        <section id="overview">
                            <h2>Can Expats Get a Mortgage in Malta?</h2>
                            <p>Yes, expats can obtain mortgages in Malta, but the process involves additional requirements compared to Maltese citizens. Banks typically require a <strong>20-30% deposit</strong> (compared to 10% for residents) and you may need special permits depending on your residency status.</p>
                        </section>

                        <section id="residency-rule" className="mt-12">
                            <h2>The 5-Year Residency Rule</h2>
                            <div className="p-6 bg-amber-500/10 rounded-xl not-prose my-6 border border-amber-500/20">
                                <AlertTriangle className="h-8 w-8 text-amber-600 mb-4" />
                                <h3 className="font-semibold text-lg mb-2">Under 5 Years in Malta?</h3>
                                <p className="text-muted-foreground">If you have resided in Malta for <strong>less than 5 years</strong> (e.g., 3.5 years), you will need to obtain an <strong>AIP (Acquisition of Immovable Property) Permit</strong> to purchase property outside Special Designated Areas (SDAs).</p>
                            </div>
                            <p>The residency requirements work as follows:</p>
                            <ul>
                                <li><strong>EU/EEA Citizens with 5+ years residency:</strong> No AIP permit required</li>
                                <li><strong>EU/EEA Citizens with less than 5 years:</strong> AIP permit required for secondary residences</li>
                                <li><strong>Non-EU/EEA Citizens:</strong> Always require AIP permit for properties outside SDAs</li>
                            </ul>
                        </section>

                        <section id="aip-permit" className="mt-12">
                            <h2>AIP Permit (Acquisition of Immovable Property)</h2>
                            <div className="p-6 bg-blue-500/10 rounded-xl not-prose my-6">
                                <FileCheck className="h-8 w-8 text-blue-500 mb-4" />
                                <h3 className="font-semibold text-lg mb-2">AIP Permit Details</h3>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li>• <strong>Cost:</strong> €233</li>
                                    <li>• <strong>Processing Time:</strong> Approximately 35 days</li>
                                    <li>• <strong>Restriction:</strong> Usually limits you to one property</li>
                                    <li>• <strong>Rental:</strong> Cannot rent out the property</li>
                                </ul>
                            </div>
                            <h3>Minimum Property Values for AIP</h3>
                            <div className="overflow-x-auto not-prose my-6">
                                <table className="w-full border-collapse text-sm">
                                    <thead><tr className="bg-muted"><th className="border border-border p-3 text-left">Property Type</th><th className="border border-border p-3 text-right">Minimum Value</th></tr></thead>
                                    <tbody>
                                        <tr><td className="border border-border p-3">Flat or Maisonette</td><td className="border border-border p-3 text-right font-semibold">€143,410</td></tr>
                                        <tr className="bg-muted/50"><td className="border border-border p-3">Other Immovable Property</td><td className="border border-border p-3 text-right font-semibold">€247,701</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-sm text-muted-foreground">*Values are updated annually</p>
                        </section>

                        <section id="stamp-duty" className="mt-12">
                            <h2>5% Stamp Duty - Payment Structure</h2>
                            <p>When purchasing property in Malta, you must pay <strong>5% stamp duty</strong> on the purchase price or market value (whichever is higher). This is paid in two stages:</p>

                            <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
                                <div className="p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <div className="text-4xl font-bold text-primary mb-2">1%</div>
                                    <h3 className="font-semibold mb-2">First Payment</h3>
                                    <p className="text-sm text-muted-foreground">Due within <strong>21 days</strong> of signing the preliminary Promise of Sale (Konvenju) agreement.</p>
                                </div>
                                <div className="p-6 bg-secondary/5 rounded-xl border border-secondary/20">
                                    <div className="text-4xl font-bold text-secondary mb-2">4%</div>
                                    <h3 className="font-semibold mb-2">Final Payment</h3>
                                    <p className="text-sm text-muted-foreground">Due upon the <strong>final deed transfer</strong> of the property to your name.</p>
                                </div>
                            </div>

                            <h3>Example Calculation</h3>
                            <div className="overflow-x-auto not-prose my-6">
                                <table className="w-full border-collapse text-sm">
                                    <thead><tr className="bg-muted"><th className="border border-border p-3 text-left">Property Price</th><th className="border border-border p-3 text-right">1% (Konvenju)</th><th className="border border-border p-3 text-right">4% (Final Deed)</th><th className="border border-border p-3 text-right">Total 5%</th></tr></thead>
                                    <tbody>
                                        <tr><td className="border border-border p-3">€200,000</td><td className="border border-border p-3 text-right">€2,000</td><td className="border border-border p-3 text-right">€8,000</td><td className="border border-border p-3 text-right font-semibold">€10,000</td></tr>
                                        <tr className="bg-muted/50"><td className="border border-border p-3">€350,000</td><td className="border border-border p-3 text-right">€3,500</td><td className="border border-border p-3 text-right">€14,000</td><td className="border border-border p-3 text-right font-semibold">€17,500</td></tr>
                                        <tr><td className="border border-border p-3">€500,000</td><td className="border border-border p-3 text-right">€5,000</td><td className="border border-border p-3 text-right">€20,000</td><td className="border border-border p-3 text-right font-semibold">€25,000</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section id="first-time-buyer" className="mt-12">
                            <h2>First-Time Buyer Exemption</h2>
                            <div className="p-6 bg-green-500/10 rounded-xl not-prose my-6 border border-green-500/20">
                                <CheckCircle className="h-8 w-8 text-green-600 mb-4" />
                                <h3 className="font-semibold text-lg mb-2">€200,000 Stamp Duty Exemption</h3>
                                <p className="text-muted-foreground">First-time buyers are <strong>exempt from stamp duty</strong> on the first €200,000 of the property value. Only amounts exceeding €200,000 are subject to the 5% stamp duty.</p>
                            </div>
                            <p>To qualify for first-time buyer status:</p>
                            <ul>
                                <li>You must not have previously owned property in Malta or Gozo</li>
                                <li>The property must be your primary residence</li>
                                <li>Valid for transfers before January 1, 2026</li>
                            </ul>
                        </section>

                        <section id="sda" className="mt-12">
                            <h2>Special Designated Areas (SDAs)</h2>
                            <p>Properties within SDAs have fewer restrictions for foreign buyers:</p>
                            <ul>
                                <li><strong>No AIP permit required</strong></li>
                                <li>Can purchase multiple properties</li>
                                <li>Can rent out properties</li>
                                <li>Popular SDAs include Tigne Point, Portomaso, Manoel Island</li>
                            </ul>
                        </section>

                        <section id="mortgage-requirements" className="mt-12">
                            <h2>Expat Mortgage Requirements</h2>
                            <p>When applying for a mortgage as an expat, banks typically require:</p>
                            <ul>
                                <li><strong>Higher Deposit:</strong> 20-30% (compared to 10% for residents)</li>
                                <li><strong>LTV:</strong> Maximum 70-80% Loan-to-Value</li>
                                <li>Proof of identity (passport, national ID)</li>
                                <li>Proof of address</li>
                                <li>6 months of payslips</li>
                                <li>6 months of bank statements</li>
                                <li>Recent tax certificate or employer reference</li>
                                <li>Life insurance</li>
                            </ul>
                        </section>

                        <div className="mt-16 p-8 bg-gradient-to-br from-amber-500/10 to-primary/5 rounded-3xl border border-border/50 not-prose text-center">
                            <Calculator className="h-12 w-12 mx-auto mb-4 text-amber-600" />
                            <h2 className="text-2xl font-cal font-bold mb-4">Calculate Your Mortgage & Stamp Duty</h2>
                            <p className="text-muted-foreground mb-6">Use our calculators to estimate your costs.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/calculators/mortgage" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors">
                                    Mortgage Calculator <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link href="/calculators/stamp-duty" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-secondary text-white font-semibold hover:bg-secondary/90 transition-colors">
                                    Stamp Duty Calculator <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </article>
                </Shell>
            </main>
        </MarketingLayout>
    );
}
