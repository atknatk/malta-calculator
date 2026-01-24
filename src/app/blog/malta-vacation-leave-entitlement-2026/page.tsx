import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, Calculator } from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Malta Vacation Leave 2026: Annual Leave Entitlement Guide | Malta Calculator",
    description: "Malta vacation leave guide for 2026. Minimum 192 hours (24 days) annual leave entitlement plus public holiday additions.",
    keywords: ["Malta vacation leave", "Malta annual leave", "Malta holiday entitlement", "Malta 192 hours leave"],
    alternates: { canonical: `${SITE_URL}/blog/malta-vacation-leave-entitlement-2026` },
    openGraph: { ...ogMetadata, title: "Malta Vacation Leave 2026: Complete Guide", url: `${SITE_URL}/blog/malta-vacation-leave-entitlement-2026`, type: "article" },
    twitter: { ...twitterMetadata, title: "Malta Vacation Leave 2026: Complete Guide" },
};

export default function MaltaVacationLeaveGuidePage() {
    return (
        <MarketingLayout>
            <ArticleJsonLd
                title="Malta Vacation Leave 2026: Annual Leave Entitlement Guide"
                description="Complete guide to annual vacation leave entitlement in Malta."
                slug="malta-vacation-leave-entitlement-2026"
                datePublished="2026-01-01"
            />
            <BreadcrumbJsonLd items={[
                { name: "Home", url: SITE_URL },
                { name: "Blog", url: `${SITE_URL}/blog` },
                { name: "Vacation Leave Guide", url: `${SITE_URL}/blog/malta-vacation-leave-entitlement-2026` },
            ]} />
            <main role="main">
                <Shell className="max-w-4xl py-12">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Blog
                    </Link>

                    <article className="prose prose-neutral dark:prose-invert max-w-none">
                        <header className="mb-12 not-prose">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-green-500/10 text-green-600 text-sm font-semibold rounded-full">Leave</span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground"><Calendar className="h-4 w-4" /> January 2026</span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="h-4 w-4" /> 5 min read</span>
                            </div>
                            <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">Malta Vacation Leave 2026: Complete Guide</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Know your annual leave entitlement under Malta employment law.
                            </p>
                        </header>

                        <section id="overview">
                            <h2>Minimum Vacation Entitlement</h2>
                            <p>In Malta, full-time employees working a standard 40-hour week are entitled to a minimum of <strong>192 working hours</strong> (equivalent to 24 working days at 8 hours per day) of annual vacation leave.</p>
                        </section>

                        <section id="entitlement-2026">
                            <h2>2026 Entitlement Breakdown</h2>
                            <div className="overflow-x-auto not-prose my-8">
                                <table className="w-full border-collapse text-sm">
                                    <thead><tr className="bg-muted"><th className="border border-border p-3">Component</th><th className="border border-border p-3">Hours</th><th className="border border-border p-3">Days</th></tr></thead>
                                    <tbody>
                                        <tr><td className="border border-border p-3">Base Entitlement</td><td className="border border-border p-3 font-semibold">192</td><td className="border border-border p-3">24</td></tr>
                                        <tr className="bg-muted/50"><td className="border border-border p-3">Public Holidays on Weekends (2026: 3)</td><td className="border border-border p-3 font-semibold text-green-600">+24</td><td className="border border-border p-3">+3</td></tr>
                                        <tr><td className="border border-border p-3 font-bold">Total 2026</td><td className="border border-border p-3 font-bold text-primary">216</td><td className="border border-border p-3 font-bold">27</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section id="public-holidays" className="mt-12">
                            <h2>Public Holiday Additions</h2>
                            <p>When a public holiday falls on a weekend (Saturday or Sunday), employees receive additional vacation hours:</p>
                            <ul>
                                <li><strong>2024:</strong> 3 holidays on weekends → +24 hours</li>
                                <li><strong>2025:</strong> 2 holidays on weekends → +16 hours</li>
                                <li><strong>2026:</strong> 3 holidays on weekends → +24 hours</li>
                            </ul>
                        </section>

                        <section id="part-time" className="mt-12">
                            <h2>Part-Time Employees</h2>
                            <p>Part-time employees receive vacation leave on a <strong>pro-rata basis</strong>. The calculation is:</p>
                            <div className="p-4 bg-muted/30 rounded-xl not-prose my-4">
                                <code>Part-time hours ÷ 40 hours × Full-time entitlement = Your entitlement</code>
                            </div>
                            <p>For example, a 20-hour/week employee would receive 96 base hours (50% of 192).</p>
                        </section>

                        <section id="carryover" className="mt-12">
                            <h2>Carryover Rules</h2>
                            <ul>
                                <li>Up to <strong>50%</strong> of unused leave may be carried forward</li>
                                <li>Requires employer agreement</li>
                                <li>Leave accrues monthly on a pro-rata basis</li>
                            </ul>
                        </section>

                        <div className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-3xl border border-border/50 not-prose text-center">
                            <Calculator className="h-12 w-12 mx-auto mb-4 text-primary" />
                            <h2 className="text-2xl font-cal font-bold mb-4">Calculate Your Vacation Days</h2>
                            <Link href="/calculators/vacation" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors">
                                Try Vacation Calculator <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>
                    </article>
                </Shell>
            </main>
        </MarketingLayout>
    );
}
