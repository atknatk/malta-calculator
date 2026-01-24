import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, Calculator, Banknote } from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Malta Personal Loan Guide 2026: Rates & Repayment | Malta Calculator",
    description: "Complete guide to personal loans in Malta 2026. Learn about interest rates, repayment terms, eligibility, and calculate your monthly payments.",
    keywords: ["Malta personal loan", "Malta bank loan", "Malta loan rates", "Malta credit", "personal loan Malta"],
    alternates: { canonical: `${SITE_URL}/blog/malta-personal-loan-guide-2026` },
    openGraph: { ...ogMetadata, title: "Malta Personal Loan Guide 2026", url: `${SITE_URL}/blog/malta-personal-loan-guide-2026`, type: "article" },
    twitter: { ...twitterMetadata, title: "Malta Personal Loan Guide 2026" },
};

export default function MaltaPersonalLoanGuidePage() {
    return (
        <MarketingLayout>
            <ArticleJsonLd
                title="Malta Personal Loan Guide 2026: Rates & Repayment"
                description="Complete guide to personal loans in Malta."
                slug="malta-personal-loan-guide-2026"
                datePublished="2026-01-01"
            />
            <BreadcrumbJsonLd items={[
                { name: "Home", url: SITE_URL },
                { name: "Blog", url: `${SITE_URL}/blog` },
                { name: "Personal Loan Guide", url: `${SITE_URL}/blog/malta-personal-loan-guide-2026` },
            ]} />
            <main role="main">
                <Shell className="max-w-4xl py-12">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Blog
                    </Link>

                    <article className="prose prose-neutral dark:prose-invert max-w-none">
                        <header className="mb-12 not-prose">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-violet-500/10 text-violet-600 text-sm font-semibold rounded-full">Banking</span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground"><Calendar className="h-4 w-4" /> January 2026</span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="h-4 w-4" /> 5 min read</span>
                            </div>
                            <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">Malta Personal Loan Guide 2026</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Everything you need to know about personal loans in Malta.
                            </p>
                        </header>

                        <section id="overview">
                            <h2>What is a Personal Loan?</h2>
                            <p>A personal loan (bireysel kredi) is an unsecured loan from a bank or lender that you repay in fixed monthly instalments. Unlike mortgages, personal loans don&apos;t require collateral.</p>
                        </section>

                        <section id="rates" className="mt-12">
                            <h2>Interest Rates</h2>
                            <div className="p-6 bg-violet-500/10 rounded-xl not-prose my-6">
                                <Banknote className="h-8 w-8 text-violet-600 mb-4" />
                                <h3 className="font-semibold text-lg mb-2">Typical Rates: 6% - 12%</h3>
                                <p className="text-muted-foreground">Personal loan interest rates in Malta are higher than mortgage rates because the loans are unsecured.</p>
                            </div>
                            <p>Rates depend on:</p>
                            <ul>
                                <li><strong>Credit Score:</strong> Better credit = lower rates</li>
                                <li><strong>Loan Amount:</strong> Larger loans may have different rates</li>
                                <li><strong>Loan Term:</strong> Shorter terms may offer lower rates</li>
                                <li><strong>Bank Relationship:</strong> Existing customers may get preferential rates</li>
                            </ul>
                        </section>

                        <section id="terms" className="mt-12">
                            <h2>Loan Terms</h2>
                            <div className="overflow-x-auto not-prose my-8">
                                <table className="w-full border-collapse text-sm">
                                    <thead><tr className="bg-muted"><th className="border border-border p-3 text-left">Feature</th><th className="border border-border p-3">Typical Range</th></tr></thead>
                                    <tbody>
                                        <tr><td className="border border-border p-3 font-medium">Loan Amount</td><td className="border border-border p-3">€1,000 - €100,000</td></tr>
                                        <tr className="bg-muted/50"><td className="border border-border p-3 font-medium">Loan Term</td><td className="border border-border p-3">6 months - 7 years</td></tr>
                                        <tr><td className="border border-border p-3 font-medium">Interest Type</td><td className="border border-border p-3">Usually fixed</td></tr>
                                        <tr className="bg-muted/50"><td className="border border-border p-3 font-medium">Repayment</td><td className="border border-border p-3">Monthly instalments</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section id="eligibility" className="mt-12">
                            <h2>Eligibility Requirements</h2>
                            <p>To qualify for a personal loan in Malta, you typically need:</p>
                            <ul>
                                <li>Stable income (employed or self-employed)</li>
                                <li>Good credit history</li>
                                <li>Malta residency</li>
                                <li>Minimum age requirement (usually 18-21)</li>
                                <li>Debt-to-income ratio within acceptable limits</li>
                            </ul>
                        </section>

                        <section id="fees" className="mt-12">
                            <h2>Fees to Consider</h2>
                            <ul>
                                <li><strong>Arrangement Fee:</strong> One-time setup fee</li>
                                <li><strong>Early Repayment Fee:</strong> If you pay off early</li>
                                <li><strong>Late Payment Fee:</strong> For missed payments</li>
                                <li><strong>Insurance:</strong> Payment protection insurance (optional)</li>
                            </ul>
                        </section>

                        <div className="mt-16 p-8 bg-gradient-to-br from-violet-500/10 to-primary/5 rounded-3xl border border-border/50 not-prose text-center">
                            <Calculator className="h-12 w-12 mx-auto mb-4 text-violet-600" />
                            <h2 className="text-2xl font-cal font-bold mb-4">Calculate Your Loan Payments</h2>
                            <p className="text-muted-foreground mb-6">See your estimated monthly payments and total cost.</p>
                            <Link href="/calculators/personal-loan" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors">
                                Try Loan Calculator <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>
                    </article>
                </Shell>
            </main>
        </MarketingLayout>
    );
}
