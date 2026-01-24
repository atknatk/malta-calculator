import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, Calculator } from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Malta Part-Time Employment Rights 2026 | Malta Calculator",
    description: "Malta part-time employment rights and benefits. Learn about pro-rata salary calculations, minimum hours, vacation entitlements, and SSC contributions for part-time workers.",
    keywords: ["Malta part-time employment", "Malta part-time salary", "Malta part-time rights", "Malta pro-rata calculation"],
    alternates: { canonical: `${SITE_URL}/blog/malta-part-time-employment-rights` },
    openGraph: { ...ogMetadata, title: "Malta Part-Time Employment Rights 2026", url: `${SITE_URL}/blog/malta-part-time-employment-rights`, type: "article" },
    twitter: { ...twitterMetadata, title: "Malta Part-Time Employment Rights 2026" },
};

export default function MaltaPartTimeEmploymentPage() {
    return (
        <MarketingLayout>
            <ArticleJsonLd
                title="Malta Part-Time Employment Rights 2026"
                description="Complete guide to part-time employment rights in Malta including pro-rata calculations and benefits."
                slug="malta-part-time-employment-rights"
                datePublished="2026-01-01"
            />
            <BreadcrumbJsonLd items={[
                { name: "Home", url: SITE_URL },
                { name: "Blog", url: `${SITE_URL}/blog` },
                { name: "Part-Time Employment", url: `${SITE_URL}/blog/malta-part-time-employment-rights` },
            ]} />
            <main role="main">
                <Shell className="max-w-4xl py-12">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Blog
                    </Link>

                    <article className="prose prose-neutral dark:prose-invert max-w-none">
                        <header className="mb-12 not-prose">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-blue-500/10 text-blue-600 text-sm font-semibold rounded-full">Employment</span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground"><Calendar className="h-4 w-4" /> January 2026</span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="h-4 w-4" /> 6 min read</span>
                            </div>
                            <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">Malta Part-Time Employment Rights 2026</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Your complete guide to part-time work in Malta, including legal rights, pro-rata calculations, and benefit entitlements.
                            </p>
                        </header>

                        <section id="definition">
                            <h2>What is Part-Time Employment in Malta?</h2>
                            <p>In Malta, <strong>part-time employment</strong> is defined as working less than 40 hours per week. Part-time employees have the same legal protections as full-time workers, with benefits calculated on a pro-rata basis.</p>
                        </section>

                        <section id="pro-rata" className="mt-12">
                            <h2>Pro-Rata Calculations</h2>
                            <div className="p-6 bg-muted/30 rounded-xl not-prose my-8">
                                <h3 className="font-semibold mb-4">Example: 20 hours/week employee</h3>
                                <ul className="space-y-2 text-sm">
                                    <li>• Full-time minimum wage: €213.54/week</li>
                                    <li>• Pro-rata (20/40 hours): <strong>€106.77/week</strong></li>
                                    <li>• Annual leave: 24 days × (20/40) = <strong>12 days</strong></li>
                                </ul>
                            </div>
                        </section>

                        <section id="rights" className="mt-12">
                            <h2>Rights of Part-Time Workers</h2>
                            <ul>
                                <li><strong>Equal treatment</strong> - Same hourly rate as full-time equivalents</li>
                                <li><strong>Annual leave</strong> - Pro-rata of 192 hours (24 days)</li>
                                <li><strong>Sick leave</strong> - Pro-rata entitlement</li>
                                <li><strong>SSC contributions</strong> - Based on actual earnings (10%)</li>
                                <li><strong>COLA</strong> - Pro-rata of €10.36/week</li>
                            </ul>
                        </section>

                        <section id="ssc" className="mt-12">
                            <h2>SSC for Part-Time Workers</h2>
                            <p>Part-time employees pay SSC at the standard 10% rate on their actual weekly earnings, subject to the same minimum and maximum thresholds as full-time workers.</p>
                        </section>

                        <div className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-3xl border border-border/50 not-prose text-center">
                            <Calculator className="h-12 w-12 mx-auto mb-4 text-primary" />
                            <h2 className="text-2xl font-cal font-bold mb-4">Calculate Part-Time Salary</h2>
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
