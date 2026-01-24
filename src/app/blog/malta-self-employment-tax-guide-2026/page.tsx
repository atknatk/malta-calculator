import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, Calculator } from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Malta Self-Employment Tax Guide 2026 | Malta Calculator",
    description: "Malta self-employment tax guide 2026. How to calculate income tax, provisional tax payments, Class 2 SSC, and deductible business expenses for freelancers.",
    keywords: ["Malta self-employed tax", "Malta freelancer tax", "Malta provisional tax", "Malta Class 2 SSC"],
    alternates: { canonical: `${SITE_URL}/blog/malta-self-employment-tax-guide-2026` },
    openGraph: { ...ogMetadata, title: "Malta Self-Employment Tax Guide 2026", url: `${SITE_URL}/blog/malta-self-employment-tax-guide-2026`, type: "article" },
    twitter: { ...twitterMetadata, title: "Malta Self-Employment Tax Guide 2026" },
};

export default function MaltaSelfEmploymentTaxPage() {
    return (
        <MarketingLayout>
            <ArticleJsonLd
                title="Malta Self-Employment Tax Guide 2026"
                description="Complete tax guide for self-employed individuals and freelancers in Malta."
                slug="malta-self-employment-tax-guide-2026"
                datePublished="2026-01-01"
            />
            <BreadcrumbJsonLd items={[
                { name: "Home", url: SITE_URL },
                { name: "Blog", url: `${SITE_URL}/blog` },
                { name: "Self-Employment Tax", url: `${SITE_URL}/blog/malta-self-employment-tax-guide-2026` },
            ]} />
            <main role="main">
                <Shell className="max-w-4xl py-12">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Blog
                    </Link>

                    <article className="prose prose-neutral dark:prose-invert max-w-none">
                        <header className="mb-12 not-prose">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-violet-500/10 text-violet-600 text-sm font-semibold rounded-full">Self-Employment</span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground"><Calendar className="h-4 w-4" /> January 2026</span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="h-4 w-4" /> 8 min read</span>
                            </div>
                            <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">Malta Self-Employment Tax Guide 2026</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Complete guide to taxes for freelancers and self-employed individuals in Malta.
                            </p>
                        </header>

                        <section id="income-tax">
                            <h2>Income Tax for Self-Employed</h2>
                            <p>Self-employed individuals in Malta pay the same progressive tax rates as employees:</p>
                            <ul>
                                <li><strong>0%</strong> on first €9,100 (single) / €12,700 (married)</li>
                                <li><strong>15%</strong> on next bracket</li>
                                <li><strong>25%</strong> on middle brackets</li>
                                <li><strong>35%</strong> above €60,000</li>
                            </ul>
                        </section>

                        <section id="ssc" className="mt-12">
                            <h2>Class 2 SSC Contributions</h2>
                            <p>Self-employed pay <strong>Class 2 SSC</strong> at 15% of net annual income, with:</p>
                            <ul>
                                <li><strong>Minimum:</strong> ~€34/week</li>
                                <li><strong>Maximum:</strong> ~€86/week (2026)</li>
                            </ul>
                        </section>

                        <section id="provisional-tax" className="mt-12">
                            <h2>Provisional Tax Payments</h2>
                            <p>Self-employed must pay provisional tax in 3 installments:</p>
                            <div className="overflow-x-auto not-prose my-8">
                                <table className="w-full border-collapse text-sm">
                                    <thead><tr className="bg-muted"><th className="border border-border p-3">Payment</th><th className="border border-border p-3">Due Date</th><th className="border border-border p-3">Amount</th></tr></thead>
                                    <tbody>
                                        <tr><td className="border border-border p-3">1st</td><td className="border border-border p-3">April 30</td><td className="border border-border p-3">30%</td></tr>
                                        <tr className="bg-muted/50"><td className="border border-border p-3">2nd</td><td className="border border-border p-3">August 31</td><td className="border border-border p-3">30%</td></tr>
                                        <tr><td className="border border-border p-3">3rd</td><td className="border border-border p-3">December 21</td><td className="border border-border p-3">40%</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section id="deductions" className="mt-12">
                            <h2>Deductible Business Expenses</h2>
                            <ul>
                                <li>Office rent and utilities</li>
                                <li>Business equipment and software</li>
                                <li>Professional fees and subscriptions</li>
                                <li>Marketing and advertising</li>
                                <li>Travel and accommodation (business-related)</li>
                            </ul>
                        </section>

                        <div className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-3xl border border-border/50 not-prose text-center">
                            <Calculator className="h-12 w-12 mx-auto mb-4 text-primary" />
                            <h2 className="text-2xl font-cal font-bold mb-4">Calculate Your Tax Liability</h2>
                            <Link href="/salary" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors">
                                Try Salary Calculator <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>
                    </article>
                </Shell>
            </main>
        </MarketingLayout>
    );
}

export const revalidate = false;          // tamamen statik (build-time)
export const dynamic = 'force-static';    // bu segmenti statik olmaya zorla
