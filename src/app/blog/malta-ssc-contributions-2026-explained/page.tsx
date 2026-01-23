import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import {
    defaultMetadata,
    ogMetadata,
    twitterMetadata,
    SITE_URL,
} from "@/app/shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, Calculator } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Malta SSC Contributions 2026: Rates, Caps & Categories Explained | Malta Calculator",
    description:
        "Complete guide to Malta Social Security Contributions (SSC) for 2026. Learn about Class 1 employee rates (10%), weekly caps, Category A/B/C, the 1962 age threshold, and employer contributions.",
    keywords: [
        "Malta SSC 2026",
        "Malta social security contributions",
        "Malta SSC rates",
        "Malta SSC caps",
        "Malta Class 1 contributions",
        "Malta SSC Category A",
        "Malta employer SSC",
        "Malta 1962 age threshold",
    ],
    alternates: {
        canonical: `${SITE_URL}/blog/malta-ssc-contributions-2026-explained`,
    },
    openGraph: {
        ...ogMetadata,
        title: "Malta SSC Contributions 2026: Rates, Caps & Categories Explained",
        url: `${SITE_URL}/blog/malta-ssc-contributions-2026-explained`,
        type: "article",
    },
    twitter: {
        ...twitterMetadata,
        title: "Malta SSC Contributions 2026: Rates, Caps & Categories Explained",
    },
};

export default function MaltaSSCPage() {
    return (
        <MarketingLayout>
            <main role="main" aria-label="Malta SSC Contributions 2026 Guide">
                <Shell className="max-w-4xl py-12">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Blog
                    </Link>

                    <article className="prose prose-neutral dark:prose-invert max-w-none">
                        <header className="mb-12 not-prose">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm font-semibold rounded-full">
                                    SSC Guide
                                </span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    January 2026
                                </span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    6 min read
                                </span>
                            </div>
                            <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                                Malta SSC Contributions 2026: Rates, Caps & Categories Explained
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                A complete guide to Social Security Contributions in Malta for 2026.
                                Understand your employee contributions, employer share, weekly caps,
                                and which category applies to you.
                            </p>
                        </header>

                        <nav className="p-6 bg-muted/30 rounded-2xl mb-12 not-prose">
                            <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#what-is-ssc" className="text-primary hover:underline">1. What is SSC?</a></li>
                                <li><a href="#rates-2026" className="text-primary hover:underline">2. SSC Rates for 2026</a></li>
                                <li><a href="#categories" className="text-primary hover:underline">3. SSC Categories (A, B, C)</a></li>
                                <li><a href="#weekly-caps" className="text-primary hover:underline">4. Weekly Contribution Caps</a></li>
                                <li><a href="#age-threshold" className="text-primary hover:underline">5. The 1962 Age Threshold</a></li>
                                <li><a href="#calculation" className="text-primary hover:underline">6. How SSC is Calculated</a></li>
                            </ul>
                        </nav>

                        <section id="what-is-ssc">
                            <h2>1. What is SSC (Social Security Contributions)?</h2>
                            <p>
                                Social Security Contributions (SSC) in Malta are <strong>mandatory payments</strong> made
                                by both employees and employers to fund the national social security system. This system
                                provides benefits including:
                            </p>
                            <ul>
                                <li>State pension</li>
                                <li>Sickness benefits</li>
                                <li>Unemployment benefits</li>
                                <li>Maternity/paternity benefits</li>
                                <li>Injury benefits</li>
                            </ul>
                            <p>
                                SSC is classified into different &quot;Classes&quot; based on your employment status:
                            </p>
                            <ul>
                                <li><strong>Class 1</strong> - Employed persons (shared between employee and employer)</li>
                                <li><strong>Class 2</strong> - Self-employed persons</li>
                            </ul>
                        </section>

                        <section id="rates-2026" className="mt-12">
                            <h2>2. SSC Rates for 2026</h2>
                            <p>
                                For <strong>Class 1 (employees)</strong>, the SSC rate for 2026 is:
                            </p>

                            <div className="overflow-x-auto not-prose my-8">
                                <table className="w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-muted">
                                            <th className="border border-border p-3 text-left font-semibold">Contributor</th>
                                            <th className="border border-border p-3 text-left font-semibold">Rate</th>
                                            <th className="border border-border p-3 text-left font-semibold">Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-border p-3">Employee</td>
                                            <td className="border border-border p-3 font-semibold text-primary">10%</td>
                                            <td className="border border-border p-3">Of basic weekly wage</td>
                                        </tr>
                                        <tr className="bg-muted/50">
                                            <td className="border border-border p-3">Employer</td>
                                            <td className="border border-border p-3 font-semibold text-primary">10%</td>
                                            <td className="border border-border p-3">Matching contribution</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-border p-3 font-semibold">Total</td>
                                            <td className="border border-border p-3 font-semibold text-secondary">20%</td>
                                            <td className="border border-border p-3">Combined contribution</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl not-prose">
                                <p className="text-sm">
                                    <strong>💡 Important:</strong> SSC is calculated on your <strong>basic weekly wage</strong>,
                                    not including bonuses, overtime, or other allowances. The 10% employee contribution is
                                    automatically deducted from your salary.
                                </p>
                            </div>
                        </section>

                        <section id="categories" className="mt-12">
                            <h2>3. SSC Categories (A, B, C)</h2>
                            <p>
                                Malta&apos;s SSC system has three categories based on your <strong>date of birth</strong>:
                            </p>

                            <div className="overflow-x-auto not-prose my-8">
                                <table className="w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-muted">
                                            <th className="border border-border p-3 text-left font-semibold">Category</th>
                                            <th className="border border-border p-3 text-left font-semibold">Birth Date</th>
                                            <th className="border border-border p-3 text-left font-semibold">Weekly Cap 2026</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-border p-3 font-semibold">Category A</td>
                                            <td className="border border-border p-3">Born on or after 1 Jan 1962</td>
                                            <td className="border border-border p-3">€54.06 - €57.32</td>
                                        </tr>
                                        <tr className="bg-muted/50">
                                            <td className="border border-border p-3 font-semibold">Category B</td>
                                            <td className="border border-border p-3">Born before 1 Jan 1962</td>
                                            <td className="border border-border p-3">€35.54 - €37.68</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-border p-3 font-semibold">Category C</td>
                                            <td className="border border-border p-3">Born before 1 Jan 1962</td>
                                            <td className="border border-border p-3">€25.99 - €27.55</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <p>
                                <strong>Most working adults today fall into Category A</strong>, as they were born after 1962.
                                Categories B and C apply to those approaching or past retirement age who continue to work.
                            </p>
                        </section>

                        <section id="weekly-caps" className="mt-12">
                            <h2>4. Weekly Contribution Caps</h2>
                            <p>
                                SSC contributions are <strong>capped at a maximum weekly amount</strong>. This means that regardless
                                of how high your salary is, you won&apos;t pay more than the cap.
                            </p>

                            <h3>Category A Weekly Caps (2026)</h3>
                            <div className="overflow-x-auto not-prose my-8">
                                <table className="w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-muted">
                                            <th className="border border-border p-3 text-left font-semibold">Wage Band</th>
                                            <th className="border border-border p-3 text-left font-semibold">Employee Cap</th>
                                            <th className="border border-border p-3 text-left font-semibold">Annual Max</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-border p-3">Up to €540.64/week</td>
                                            <td className="border border-border p-3">10% of wage</td>
                                            <td className="border border-border p-3">Varies</td>
                                        </tr>
                                        <tr className="bg-muted/50">
                                            <td className="border border-border p-3">€540.65 - €573.23/week</td>
                                            <td className="border border-border p-3 font-semibold">€54.06</td>
                                            <td className="border border-border p-3">€2,811.12</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-border p-3">Over €573.23/week</td>
                                            <td className="border border-border p-3 font-semibold">€57.32</td>
                                            <td className="border border-border p-3 font-semibold text-primary">€2,980.64</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl not-prose">
                                <p className="text-sm">
                                    <strong>✅ Maximum Annual SSC (2026):</strong> If you&apos;re in Category A earning above
                                    the cap, your maximum annual employee SSC is <strong>€2,980.64</strong> (€57.32 × 52 weeks).
                                </p>
                            </div>
                        </section>

                        <section id="age-threshold" className="mt-12">
                            <h2>5. The 1962 Age Threshold</h2>
                            <p>
                                The <strong>1 January 1962</strong> birthdate is a critical threshold in Malta&apos;s SSC system.
                                It determines:
                            </p>
                            <ul>
                                <li>Which SSC category you fall into (A vs B/C)</li>
                                <li>Your maximum weekly contribution cap</li>
                                <li>Your retirement age eligibility</li>
                            </ul>
                            <p>
                                <strong>Born on or after 1 Jan 1962:</strong> You&apos;re in Category A with higher contribution caps
                                but also higher pension entitlements.
                            </p>
                            <p>
                                <strong>Born before 1 Jan 1962:</strong> You&apos;re in Category B or C with lower caps, reflecting
                                the older pension system.
                            </p>
                        </section>

                        <section id="calculation" className="mt-12">
                            <h2>6. How SSC is Calculated</h2>
                            <h3>Example: Employee earning €35,000/year (Category A)</h3>
                            <div className="p-6 bg-muted/30 rounded-xl not-prose my-4">
                                <ul className="space-y-2 text-sm">
                                    <li>• Annual salary: €35,000</li>
                                    <li>• Weekly wage: €35,000 ÷ 52 = <strong>€673.08</strong></li>
                                    <li>• Weekly wage exceeds €573.23, so <strong>cap applies</strong></li>
                                    <li>• Weekly employee SSC: <strong>€57.32</strong> (capped)</li>
                                    <li className="pt-2 border-t border-border font-semibold">Annual SSC = €57.32 × 52 = <strong className="text-primary">€2,980.64</strong></li>
                                </ul>
                            </div>

                            <h3>Example: Employee earning €20,000/year (Category A)</h3>
                            <div className="p-6 bg-muted/30 rounded-xl not-prose my-4">
                                <ul className="space-y-2 text-sm">
                                    <li>• Annual salary: €20,000</li>
                                    <li>• Weekly wage: €20,000 ÷ 52 = <strong>€384.62</strong></li>
                                    <li>• Weekly wage below cap, so <strong>10% applies</strong></li>
                                    <li>• Weekly employee SSC: €384.62 × 10% = <strong>€38.46</strong></li>
                                    <li className="pt-2 border-t border-border font-semibold">Annual SSC = €38.46 × 52 = <strong className="text-primary">€2,000.00</strong></li>
                                </ul>
                            </div>
                        </section>

                        <div className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-3xl border border-border/50 not-prose text-center">
                            <Calculator className="h-12 w-12 mx-auto mb-4 text-primary" />
                            <h2 className="text-2xl font-cal font-bold mb-4">
                                Calculate Your SSC Automatically
                            </h2>
                            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                                Our Malta Salary Calculator automatically determines your SSC category
                                and calculates your exact contributions for 2026.
                            </p>
                            <Link
                                href="/salary"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                            >
                                Calculate Now
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>
                    </article>
                </Shell>
            </main>
        </MarketingLayout>
    );
}
