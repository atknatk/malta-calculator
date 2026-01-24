import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, Calculator } from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Malta Rental Income Tax 2026: 15% Flat Rate Guide | Malta Calculator",
    description: "Malta rental income tax 2026 guide. Learn about the 15% flat rate option, progressive tax comparison, deductible expenses, and how to choose the best option.",
    keywords: ["Malta rental income tax", "Malta 15% rental tax", "Malta property rental tax", "Malta landlord tax"],
    alternates: { canonical: `${SITE_URL}/blog/malta-rental-income-tax-15-percent-guide` },
    openGraph: { ...ogMetadata, title: "Malta Rental Income Tax 2026: 15% Guide", url: `${SITE_URL}/blog/malta-rental-income-tax-15-percent-guide`, type: "article" },
    twitter: { ...twitterMetadata, title: "Malta Rental Income Tax 2026: 15% Guide" },
};

export default function MaltaRentalIncomeTaxPage() {
    return (
        <MarketingLayout>
            <ArticleJsonLd
                title="Malta Rental Income Tax 2026: 15% Flat Rate Guide"
                description="Complete guide to Malta's rental income tax including the 15% flat rate option."
                slug="malta-rental-income-tax-15-percent-guide"
                datePublished="2026-01-01"
            />
            <BreadcrumbJsonLd items={[
                { name: "Home", url: SITE_URL },
                { name: "Blog", url: `${SITE_URL}/blog` },
                { name: "Rental Income Tax", url: `${SITE_URL}/blog/malta-rental-income-tax-15-percent-guide` },
            ]} />
            <main role="main">
                <Shell className="max-w-4xl py-12">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Blog
                    </Link>

                    <article className="prose prose-neutral dark:prose-invert max-w-none">
                        <header className="mb-12 not-prose">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-orange-500/10 text-orange-600 text-sm font-semibold rounded-full">Property</span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground"><Calendar className="h-4 w-4" /> January 2026</span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="h-4 w-4" /> 6 min read</span>
                            </div>
                            <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">Malta Rental Income Tax 2026: 15% Flat Rate Guide</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Should you choose the 15% flat rate or progressive tax for your rental income in Malta?
                            </p>
                        </header>

                        <section id="options">
                            <h2>Two Tax Options for Rental Income</h2>
                            <div className="overflow-x-auto not-prose my-8">
                                <table className="w-full border-collapse text-sm">
                                    <thead><tr className="bg-muted"><th className="border border-border p-3">Option</th><th className="border border-border p-3">Rate</th><th className="border border-border p-3">Deductions</th></tr></thead>
                                    <tbody>
                                        <tr><td className="border border-border p-3 font-semibold">15% Flat Rate</td><td className="border border-border p-3 text-primary font-semibold">15%</td><td className="border border-border p-3">No deductions allowed</td></tr>
                                        <tr className="bg-muted/50"><td className="border border-border p-3 font-semibold">Progressive Tax</td><td className="border border-border p-3">0-35%</td><td className="border border-border p-3">Expenses deductible</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section id="when-15" className="mt-12">
                            <h2>When to Choose 15% Flat Rate</h2>
                            <ul>
                                <li>Your rental income is <strong>higher than €14,500/year</strong></li>
                                <li>You have <strong>minimal expenses</strong> to deduct</li>
                                <li>You want <strong>simple tax compliance</strong></li>
                                <li>The property is registered with the Housing Authority</li>
                            </ul>
                        </section>

                        <section id="example" className="mt-12">
                            <h2>Comparison Example</h2>
                            <div className="p-6 bg-muted/30 rounded-xl not-prose">
                                <h3 className="font-semibold mb-4">Rental income: €15,000/year</h3>
                                <ul className="space-y-2 text-sm">
                                    <li>• <strong>15% Flat Rate:</strong> €15,000 × 15% = <strong className="text-primary">€2,250 tax</strong></li>
                                    <li>• <strong>Progressive (single, no other income):</strong> ~<strong className="text-secondary">€885 tax</strong></li>
                                </ul>
                                <p className="text-xs mt-4 text-muted-foreground">In this case, progressive taxation is better if rental income is your only income.</p>
                            </div>
                        </section>

                        <div className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-3xl border border-border/50 not-prose text-center">
                            <Calculator className="h-12 w-12 mx-auto mb-4 text-primary" />
                            <h2 className="text-2xl font-cal font-bold mb-4">Calculate Your Tax</h2>
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
