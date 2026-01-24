import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, Calculator } from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Malta 13th Month Salary (Bonus) Explained | Malta Calculator",
    description: "Malta 13th month salary and government bonus explained. Learn about statutory bonuses, tax treatment, and when you receive them.",
    keywords: ["Malta 13th month salary", "Malta bonus", "Malta statutory bonus", "Malta government bonus"],
    alternates: { canonical: `${SITE_URL}/blog/malta-13th-month-salary-bonus-explained` },
    openGraph: { ...ogMetadata, title: "Malta 13th Month Salary (Bonus) Explained", url: `${SITE_URL}/blog/malta-13th-month-salary-bonus-explained`, type: "article" },
    twitter: { ...twitterMetadata, title: "Malta 13th Month Salary (Bonus) Explained" },
};

export default function Malta13thMonthSalaryPage() {
    return (
        <MarketingLayout>
            <ArticleJsonLd
                title="Malta 13th Month Salary (Bonus) Explained"
                description="Complete guide to Malta's statutory bonuses and 13th month salary payments."
                slug="malta-13th-month-salary-bonus-explained"
                datePublished="2026-01-01"
            />
            <BreadcrumbJsonLd items={[
                { name: "Home", url: SITE_URL },
                { name: "Blog", url: `${SITE_URL}/blog` },
                { name: "13th Month Salary", url: `${SITE_URL}/blog/malta-13th-month-salary-bonus-explained` },
            ]} />
            <main role="main">
                <Shell className="max-w-4xl py-12">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Blog
                    </Link>

                    <article className="prose prose-neutral dark:prose-invert max-w-none">
                        <header className="mb-12 not-prose">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-amber-500/10 text-amber-600 text-sm font-semibold rounded-full">Salary</span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground"><Calendar className="h-4 w-4" /> January 2026</span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="h-4 w-4" /> 5 min read</span>
                            </div>
                            <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">Malta 13th Month Salary (Bonus) Explained</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Understanding Malta&apos;s statutory bonus system and whether you&apos;re entitled to a 13th month salary.
                            </p>
                        </header>

                        <section id="statutory-bonuses">
                            <h2>Statutory Bonuses in Malta</h2>
                            <p>Malta has <strong>government-mandated statutory bonuses</strong> that all employers must pay. These are separate from any contractual bonuses your employer may offer.</p>

                            <div className="overflow-x-auto not-prose my-8">
                                <table className="w-full border-collapse text-sm">
                                    <thead><tr className="bg-muted"><th className="border border-border p-3 text-left">Bonus</th><th className="border border-border p-3 text-left">Amount (2026)</th><th className="border border-border p-3 text-left">When Paid</th></tr></thead>
                                    <tbody>
                                        <tr><td className="border border-border p-3">March Bonus</td><td className="border border-border p-3 font-semibold">€135.10</td><td className="border border-border p-3">March</td></tr>
                                        <tr className="bg-muted/50"><td className="border border-border p-3">June Bonus</td><td className="border border-border p-3 font-semibold">€135.10</td><td className="border border-border p-3">June</td></tr>
                                        <tr><td className="border border-border p-3">September Bonus</td><td className="border border-border p-3 font-semibold">€135.10</td><td className="border border-border p-3">September</td></tr>
                                        <tr className="bg-muted/50"><td className="border border-border p-3">December Bonus</td><td className="border border-border p-3 font-semibold">€135.10</td><td className="border border-border p-3">December</td></tr>
                                        <tr className="bg-green-500/10"><td className="border border-border p-3 font-bold">Total Annual</td><td className="border border-border p-3 font-bold text-primary">€540.40</td><td className="border border-border p-3">-</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section id="13th-month" className="mt-12">
                            <h2>Is There a 13th Month Salary?</h2>
                            <p>Unlike some European countries, Malta does <strong>not have a mandatory 13th month salary</strong>. However:</p>
                            <ul>
                                <li>Some employers offer a 13th month as a contractual benefit</li>
                                <li>The statutory bonuses (€540.40/year) serve a similar purpose</li>
                                <li>Performance bonuses are common in many sectors</li>
                            </ul>
                        </section>

                        <section id="tax" className="mt-12">
                            <h2>Tax Treatment of Bonuses</h2>
                            <ul>
                                <li><strong>Statutory bonuses:</strong> Tax-exempt (government bonuses)</li>
                                <li><strong>Employer bonuses:</strong> Fully taxable as regular income</li>
                                <li><strong>Performance bonuses:</strong> Added to annual income for tax calculation</li>
                            </ul>
                        </section>

                        <div className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-3xl border border-border/50 not-prose text-center">
                            <Calculator className="h-12 w-12 mx-auto mb-4 text-primary" />
                            <h2 className="text-2xl font-cal font-bold mb-4">Calculate Your Total Compensation</h2>
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
