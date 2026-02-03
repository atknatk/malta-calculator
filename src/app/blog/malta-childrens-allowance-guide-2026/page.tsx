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
import { ArrowLeft, ArrowRight, Calendar, Clock, Calculator, Baby, Euro, CheckCircle2, AlertCircle, Gift, Wallet, FileText } from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Malta Children's Allowance 2026: Complete Guide & Calculator | Malta Calculator",
    description:
        "Complete guide to Malta Children's Allowance. Learn eligibility, calculation formula, income thresholds (€30,000), rates (€8.66-€27.29/week), and child birth bonus. Free calculator included.",
    keywords: [
        "Malta children's allowance",
        "Malta child benefit",
        "Malta family benefits",
        "children's allowance Malta 2026",
        "Malta child allowance calculator",
        "Malta social security children",
        "child birth bonus Malta",
        "Malta family allowance rates",
        "children under 16 Malta",
        "Malta DSS children",
    ],
    alternates: {
        canonical: `${SITE_URL}/blog/malta-childrens-allowance-guide-2026`,
    },
    openGraph: {
        ...ogMetadata,
        title: "Malta Children's Allowance 2026: Complete Guide",
        url: `${SITE_URL}/blog/malta-childrens-allowance-guide-2026`,
        type: "article",
    },
    twitter: {
        ...twitterMetadata,
        title: "Malta Children's Allowance 2026: Complete Guide",
    },
};

export default function ChildrensAllowanceGuidePage() {
    return (
        <MarketingLayout>
            <ArticleJsonLd
                title="Malta Children's Allowance 2026: Complete Guide"
                description="Complete guide to Malta Children's Allowance including eligibility, calculation formula, and rates."
                slug="malta-childrens-allowance-guide-2026"
                datePublished="2026-02-03"
            />
            <BreadcrumbJsonLd items={[
                { name: "Home", url: SITE_URL },
                { name: "Blog", url: `${SITE_URL}/blog` },
                { name: "Children's Allowance Guide", url: `${SITE_URL}/blog/malta-childrens-allowance-guide-2026` },
            ]} />
            <main role="main" aria-label="Malta Children's Allowance Guide">
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
                                <span className="px-3 py-1 bg-pink-500/10 text-pink-600 dark:text-pink-400 text-sm font-semibold rounded-full">
                                    Family Benefits
                                </span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    February 2026
                                </span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    12 min read
                                </span>
                            </div>
                            <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                                Malta Children&apos;s Allowance 2026: Complete Guide
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Everything you need to know about Malta&apos;s Children&apos;s Allowance - eligibility criteria,
                                calculation formula, income thresholds, payment schedules, and the child birth bonus.
                            </p>
                        </header>

                        <nav className="p-6 bg-muted/30 rounded-2xl mb-12 not-prose">
                            <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#overview" className="text-primary hover:underline">1. Overview</a></li>
                                <li><a href="#eligibility" className="text-primary hover:underline">2. Eligibility Criteria</a></li>
                                <li><a href="#calculation" className="text-primary hover:underline">3. How It&apos;s Calculated</a></li>
                                <li><a href="#rates" className="text-primary hover:underline">4. Rates and Thresholds</a></li>
                                <li><a href="#birth-bonus" className="text-primary hover:underline">5. Child Birth Bonus</a></li>
                                <li><a href="#payment" className="text-primary hover:underline">6. Payment Schedule</a></li>
                                <li><a href="#changes-2025" className="text-primary hover:underline">7. 2025 Changes</a></li>
                                <li><a href="#how-to-apply" className="text-primary hover:underline">8. How to Apply</a></li>
                                <li><a href="#faqs" className="text-primary hover:underline">9. FAQs</a></li>
                            </ul>
                        </nav>

                        {/* Overview Section */}
                        <section id="overview">
                            <h2>1. Overview</h2>
                            <p>
                                Children&apos;s Allowance is a <strong>social security benefit</strong> provided by Malta&apos;s
                                Department of Social Security to families with children under <strong>16 years of age</strong>.
                                The benefit is designed to help families with the costs of raising children.
                            </p>
                            <p>
                                The allowance is <strong>means-tested</strong>, meaning the amount you receive depends on your
                                household income. Lower-income families receive higher allowances, while higher-income families
                                receive a guaranteed minimum rate.
                            </p>

                            <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
                                <div className="p-6 bg-pink-500/10 border border-pink-500/20 rounded-2xl">
                                    <Baby className="h-8 w-8 text-pink-600 mb-3" />
                                    <h3 className="font-semibold text-lg mb-2">Who Receives It?</h3>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Married couples</li>
                                        <li>• Civil union couples</li>
                                        <li>• Cohabiting couples</li>
                                        <li>• Single parents</li>
                                        <li>• Separated parents</li>
                                    </ul>
                                </div>
                                <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                                    <Euro className="h-8 w-8 text-rose-600 mb-3" />
                                    <h3 className="font-semibold text-lg mb-2">Key Figures (2026)</h3>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Max rate: <strong>€27.29/week</strong></li>
                                        <li>• Min rate: <strong>€8.66/week</strong></li>
                                        <li>• Income threshold: <strong>€30,000</strong></li>
                                        <li>• Calculation rate: <strong>6.50%</strong></li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Eligibility Section */}
                        <section id="eligibility" className="mt-12">
                            <h2>2. Eligibility Criteria</h2>
                            <p>
                                To qualify for Children&apos;s Allowance in Malta, you must meet specific criteria:
                            </p>

                            <h3>General Requirements</h3>
                            <ul>
                                <li>Have <strong>care and custody</strong> of children under 16 years of age</li>
                                <li>Be a resident of Malta</li>
                                <li>Meet nationality/residency requirements (see below)</li>
                            </ul>

                            <h3>Nationality Requirements</h3>
                            <p>One of the parents must be:</p>
                            <ul>
                                <li>A citizen of Malta or married to a Maltese citizen</li>
                                <li>In Civil Union with a Maltese citizen</li>
                                <li>A citizen of an <strong>EU Member State</strong></li>
                                <li>A citizen of a <strong>European Social Charter</strong> member country</li>
                                <li>Have <strong>refugee status</strong></li>
                                <li>A <strong>Third Country National</strong> in employment with valid residence permit</li>
                            </ul>

                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl my-6 not-prose">
                                <div className="flex gap-3">
                                    <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm">
                                        <strong className="text-foreground">Third Country Nationals:</strong>
                                        <p className="text-muted-foreground mt-1">
                                            If holding a Residence or Work permit, entitlement starts from the 6th month of employment.
                                            Blue Card, International Protection, and Humanitarian Protection holders are entitled from the start of employment.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Calculation Section */}
                        <section id="calculation" className="mt-12">
                            <h2>3. How It&apos;s Calculated</h2>
                            <p>
                                The Children&apos;s Allowance is calculated based on a <strong>formula set by the Department of Social Security</strong>.
                                Here&apos;s the official calculation method:
                            </p>

                            <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl my-6 not-prose">
                                <h3 className="font-semibold text-lg mb-4">The Official Formula</h3>
                                <div className="bg-background/50 p-4 rounded-xl font-mono text-sm">
                                    <p className="mb-2"><strong>Weekly Rate = (€30,000 - Net Income) × 6.50% ÷ 52</strong></p>
                                </div>
                                <p className="text-sm text-muted-foreground mt-4">
                                    The rate is based on the difference between the maximum acceptable income (€30,000) and your actual income.
                                    A 6.50% rate is applied, then divided by 52 weeks. The result cannot be lower than €8.66 or higher than €27.29 per child.
                                </p>
                            </div>

                            <h3>Step-by-Step Calculation</h3>
                            <ol>
                                <li>
                                    <strong>Calculate Total Income:</strong> Add up all income sources including employment,
                                    rental income, bank interest, pensions, and other income.
                                </li>
                                <li>
                                    <strong>Calculate Net Income:</strong> Subtract SSC contributions and income tax paid
                                    (from 2025 onwards).
                                </li>
                                <li>
                                    <strong>Apply the Formula:</strong> (€30,000 - Net Income) × 0.065 ÷ 52
                                </li>
                                <li>
                                    <strong>Apply Limits:</strong> The result is capped between €8.66 (minimum) and €27.29 (maximum).
                                </li>
                                <li>
                                    <strong>Multiply by Children:</strong> The weekly rate applies to each eligible child.
                                </li>
                            </ol>

                            <h3>Calculation Example</h3>
                            <div className="p-6 bg-muted/50 rounded-2xl my-6 not-prose">
                                <h4 className="font-semibold mb-4">Example: Family with €25,000 gross income, 2 children</h4>
                                <div className="space-y-2 text-sm">
                                    <p>Total Income: <strong>€25,000</strong></p>
                                    <p>SSC Paid: <strong>€2,500</strong></p>
                                    <p>Tax Paid: <strong>€2,000</strong></p>
                                    <p>Net Income: €25,000 - €2,500 - €2,000 = <strong>€20,500</strong></p>
                                    <hr className="my-3 border-border/50" />
                                    <p>Weekly Rate = (€30,000 - €20,500) × 0.065 ÷ 52</p>
                                    <p>Weekly Rate = €9,500 × 0.065 ÷ 52 = <strong>€11.88 per child</strong></p>
                                    <hr className="my-3 border-border/50" />
                                    <p>Weekly Total (2 children): €11.88 × 2 = <strong>€23.76</strong></p>
                                    <p>Yearly Total: €23.76 × 52 = <strong>€1,235.52</strong></p>
                                </div>
                            </div>
                        </section>

                        {/* Rates Section */}
                        <section id="rates" className="mt-12">
                            <h2>4. Rates and Thresholds</h2>

                            <h3>2026 Rate Structure</h3>
                            <div className="overflow-x-auto my-6">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4">Net Income Range</th>
                                            <th className="text-left py-3 px-4">Rate Type</th>
                                            <th className="text-left py-3 px-4">Weekly Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b">
                                            <td className="py-3 px-4">Below €8,170</td>
                                            <td className="py-3 px-4"><span className="px-2 py-1 bg-green-500/10 text-green-600 rounded-full text-xs">Maximum</span></td>
                                            <td className="py-3 px-4 font-semibold">€27.29/child</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="py-3 px-4">€8,170 - €23,068</td>
                                            <td className="py-3 px-4"><span className="px-2 py-1 bg-blue-500/10 text-blue-600 rounded-full text-xs">Variable</span></td>
                                            <td className="py-3 px-4">€8.66 - €27.29/child</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="py-3 px-4">€23,068 - €30,000</td>
                                            <td className="py-3 px-4"><span className="px-2 py-1 bg-amber-500/10 text-amber-600 rounded-full text-xs">Minimum</span></td>
                                            <td className="py-3 px-4 font-semibold">€8.66/child</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 px-4">Above €30,000</td>
                                            <td className="py-3 px-4"><span className="px-2 py-1 bg-gray-500/10 text-gray-600 rounded-full text-xs">Fixed</span></td>
                                            <td className="py-3 px-4 font-semibold">€8.66/child</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h3>Key Thresholds</h3>
                            <ul>
                                <li><strong>€8,170</strong> - Below this income, maximum rate (€27.29) applies</li>
                                <li><strong>€23,068</strong> - Above this, minimum rate (€8.66) applies even if formula gives less</li>
                                <li><strong>€30,000</strong> - Maximum income threshold for variable rate calculation</li>
                            </ul>
                        </section>

                        {/* Birth Bonus Section */}
                        <section id="birth-bonus" className="mt-12">
                            <h2>5. Child Birth / Adoption Bonus</h2>
                            <p>
                                In addition to the regular Children&apos;s Allowance, Malta provides a <strong>one-time bonus</strong>
                                for each child born or adopted:
                            </p>

                            <div className="grid md:grid-cols-3 gap-4 my-8 not-prose">
                                <div className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl text-center">
                                    <Gift className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                                    <div className="text-3xl font-bold text-amber-600 mb-2">€1,000</div>
                                    <p className="text-sm text-muted-foreground">1st Child</p>
                                </div>
                                <div className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl text-center">
                                    <Gift className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                                    <div className="text-3xl font-bold text-amber-600 mb-2">€1,500</div>
                                    <p className="text-sm text-muted-foreground">2nd Child</p>
                                </div>
                                <div className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl text-center">
                                    <Gift className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                                    <div className="text-3xl font-bold text-amber-600 mb-2">€2,000</div>
                                    <p className="text-sm text-muted-foreground">3rd+ Child</p>
                                </div>
                            </div>

                            <p>
                                This bonus is paid to the <strong>mother</strong> of the newborn child or to the adoptive parent.
                                It is a one-time payment, separate from the regular Children&apos;s Allowance.
                            </p>
                        </section>

                        {/* Payment Section */}
                        <section id="payment" className="mt-12">
                            <h2>6. Payment Schedule</h2>
                            <p>
                                Children&apos;s Allowance is paid <strong>every 13 weeks (quarterly)</strong> in advance.
                                This means you receive 4 payments per year:
                            </p>

                            <div className="p-6 bg-muted/50 rounded-2xl my-6 not-prose">
                                <h3 className="font-semibold mb-4">Quarterly Payment Calculation</h3>
                                <div className="space-y-2 text-sm">
                                    <p>Weekly Rate × 13 weeks = <strong>Quarterly Payment</strong></p>
                                    <hr className="my-3 border-border/50" />
                                    <p><strong>Example (€11.25/week per child, 2 children):</strong></p>
                                    <p>€11.25 × 2 children × 13 weeks = <strong>€292.50 per quarter</strong></p>
                                </div>
                            </div>

                            <p>
                                Payments are made via <strong>bank transfer</strong> to a local savings or current account.
                                The account should typically be in the name of the mother unless the children are in the
                                care and custody of the father or another relative.
                            </p>
                        </section>

                        {/* 2025 Changes Section */}
                        <section id="changes-2025" className="mt-12">
                            <h2>7. 2025 Changes</h2>
                            <p>
                                Important changes came into effect from <strong>1st January 2025</strong>:
                            </p>

                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl my-6 not-prose">
                                <div className="flex gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm">
                                        <strong className="text-foreground">SSC and Tax Deduction:</strong>
                                        <p className="text-muted-foreground mt-1">
                                            From 2025, both Social Security Contributions (SSC) AND income tax paid
                                            are deducted from your total income when calculating the allowance.
                                            Previously, only SSC was deducted.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p>
                                This change means your <strong>net income</strong> (used for calculation) is lower,
                                potentially resulting in a <strong>higher Children&apos;s Allowance rate</strong>.
                            </p>

                            <h3>Children&apos;s Allowance Supplement</h3>
                            <p>
                                From January 2025, an additional <strong>Children&apos;s Allowance Supplement</strong> is available:
                            </p>
                            <ul>
                                <li><strong>€165 per child per quarter</strong> (€660/year) for income below €27,434</li>
                                <li><strong>€160 per child per quarter</strong> (€640/year) for income above €27,434</li>
                            </ul>
                        </section>

                        {/* How to Apply Section */}
                        <section id="how-to-apply" className="mt-12">
                            <h2>8. How to Apply</h2>
                            <p>
                                For children born in Malta, the process is <strong>automatically initiated</strong> by the
                                Department of Social Security upon registration of the child&apos;s birth.
                            </p>

                            <h3>Automatic Process</h3>
                            <ol>
                                <li>Register the child&apos;s birth with Malta&apos;s Public Registry (within 15 days)</li>
                                <li>DSS automatically initiates Children&apos;s Allowance process</li>
                                <li>Beneficiaries are awarded the minimum rate automatically</li>
                                <li>Apply for higher rate if household income is less than €30,000</li>
                            </ol>

                            <h3>Required Documents</h3>
                            <ul>
                                <li>Identity Cards of parents</li>
                                <li>IBAN number (local savings or current account)</li>
                                <li>Marriage/Civil Union certificate or cohabitation details</li>
                                <li>Income details for 2 years prior (e.g., 2024 income for 2026 allowance)</li>
                                <li>JobsPlus history sheet</li>
                                <li>Separation contract (if applicable)</li>
                            </ul>

                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl my-6 not-prose">
                                <div className="flex gap-3">
                                    <FileText className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm">
                                        <strong className="text-foreground">Apply Online:</strong>
                                        <p className="text-muted-foreground mt-1">
                                            Applications can be submitted online through the{" "}
                                            <a href="https://socialsecurity.gov.mt" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                Social Security website
                                            </a>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* FAQs Section */}
                        <section id="faqs" className="mt-12">
                            <h2>9. Frequently Asked Questions</h2>

                            <div className="space-y-6 not-prose">
                                <div className="p-4 bg-muted/30 rounded-xl">
                                    <h3 className="font-semibold mb-2">Which year&apos;s income is used?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Income from 2 years prior is used. For example, Children&apos;s Allowance 2026 uses your 2024 income.
                                    </p>
                                </div>

                                <div className="p-4 bg-muted/30 rounded-xl">
                                    <h3 className="font-semibold mb-2">Until what age do children qualify?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Children must be under 16 years of age to qualify for Children&apos;s Allowance.
                                    </p>
                                </div>

                                <div className="p-4 bg-muted/30 rounded-xl">
                                    <h3 className="font-semibold mb-2">What if my income exceeds €30,000?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        You still receive the guaranteed minimum rate of €8.66 per week per child. No family is excluded entirely.
                                    </p>
                                </div>

                                <div className="p-4 bg-muted/30 rounded-xl">
                                    <h3 className="font-semibold mb-2">Is the Children&apos;s Allowance taxable?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        No, Children&apos;s Allowance is not subject to income tax.
                                    </p>
                                </div>

                                <div className="p-4 bg-muted/30 rounded-xl">
                                    <h3 className="font-semibold mb-2">What if I have joint custody?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        If there is joint custody, both parents should provide their individual IBAN numbers and the allowance is divided accordingly.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Calculator CTA */}
                        <div className="not-prose mt-16 p-8 rounded-3xl bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-rose-500/10 border border-pink-500/20">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded-2xl bg-pink-500/20 flex items-center justify-center">
                                        <Calculator className="h-8 w-8 text-pink-500" />
                                    </div>
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-xl font-bold mb-2">
                                        Calculate Your Children&apos;s Allowance
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Use our free calculator to estimate your potential Children&apos;s Allowance based on your household income.
                                    </p>
                                </div>
                                <Link
                                    href="/calculators/children-allowance"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-500 text-white font-semibold hover:bg-pink-600 transition-colors"
                                >
                                    Try Calculator
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Sources */}
                        <section className="mt-12">
                            <h2>Sources</h2>
                            <ul className="text-sm">
                                <li>
                                    <a href="https://socialsecurity.gov.mt/en/information-and-applications-for-benefits-and-services/family-benefits/childrens-allowance-annual-income-less-than-threshold/" target="_blank" rel="noopener noreferrer">
                                        Malta Social Security - Children&apos;s Allowance (Income less than threshold)
                                    </a>
                                </li>
                                <li>
                                    <a href="https://socialsecurity.gov.mt/en/information-and-applications-for-benefits-and-services/family-benefits/childrens-allowance-annual-income-exceeds-threshold/" target="_blank" rel="noopener noreferrer">
                                        Malta Social Security - Children&apos;s Allowance (Income exceeds threshold)
                                    </a>
                                </li>
                                <li>
                                    <a href="https://ec.europa.eu/social/main.jsp?catId=1121&langId=en&intPageId=4690" target="_blank" rel="noopener noreferrer">
                                        European Commission - Malta Social Security
                                    </a>
                                </li>
                                <li>
                                    <a href="https://mysocialsecurity.gov.mt/CalculateCA.aspx" target="_blank" rel="noopener noreferrer">
                                        Official Children&apos;s Allowance Calculator
                                    </a>
                                </li>
                            </ul>
                        </section>
                    </article>
                </Shell>
            </main>
        </MarketingLayout>
    );
}

export const revalidate = false;
export const dynamic = "force-static";
