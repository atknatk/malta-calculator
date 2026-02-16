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
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Calculator,
  Users,
  Euro,
  CheckCircle2,
  AlertCircle,
  Building2,
  Home,
  TrendingDown,
  Baby,
  Landmark,
  Wallet,
} from "lucide-react";
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title:
    "Malta Budget 2026: New Family Tax Savings & Key Changes | Malta Calculator",
  description:
    "Complete guide to Malta Budget 2026 changes. New tax brackets for families save up to \u20AC1,625/year. Pension tax exemptions, property relief, and business incentives explained.",
  keywords: [
    "Malta budget 2026",
    "Malta tax changes 2026",
    "Malta family tax savings",
    "Malta new tax brackets 2026",
    "Malta parent tax rates 2026",
    "Malta married tax rates children",
    "Malta pension tax exemption 2026",
    "Malta budget measures 2026",
    "Malta property inheritance tax",
    "Malta Micro Invest scheme 2026",
  ],
  alternates: {
    canonical: `${SITE_URL}/blog/malta-budget-2026-family-tax-savings-guide`,
  },
  openGraph: {
    ...ogMetadata,
    title: "Malta Budget 2026: New Family Tax Savings & Key Changes",
    url: `${SITE_URL}/blog/malta-budget-2026-family-tax-savings-guide`,
    type: "article",
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Budget 2026: New Family Tax Savings & Key Changes",
  },
};

export default function MaltaBudget2026GuidePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Budget 2026: New Family Tax Savings & Key Changes"
        description="Complete guide to Malta Budget 2026 tax changes including new family tax brackets, pension exemptions, and business incentives."
        slug="malta-budget-2026-family-tax-savings-guide"
        datePublished="2026-02-16"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Malta Budget 2026 Guide",
            url: `${SITE_URL}/blog/malta-budget-2026-family-tax-savings-guide`,
          },
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question:
              "How much can families save with the new Malta 2026 tax brackets?",
            answer:
              "Families with two or more children can save up to \u20AC1,625 per parent in 2026. These savings increase to \u20AC3,250 in 2027 and \u20AC5,000 in 2028 as the new brackets are phased in over three years.",
          },
          {
            question:
              "Who qualifies for the new family tax rates in Malta 2026?",
            answer:
              "To qualify, you must be Malta-resident and married or a parent with qualifying children under 18 (or under 23 if in full-time education). At least one spouse must hold Maltese, EU/EEA nationality, or both must be long-term residents with children born in Malta.",
          },
          {
            question: "Is pension income tax-free in Malta from 2026?",
            answer:
              "Yes, from 2026 all pension income up to double the maximum statutory pension amount (including bonuses) is fully exempt from income tax. This is a significant improvement over the previous partial exemption.",
          },
          {
            question:
              "What changed for property inheritance tax in Malta 2026?",
            answer:
              "The reduced stamp duty rate of 3.5% on inherited property has been extended from the first \u20AC200,000 to the first \u20AC400,000, effectively doubling the tax relief on inherited properties.",
          },
          {
            question: "What is the COLA increase for 2026 in Malta?",
            answer:
              "The COLA (Cost of Living Adjustment) for 2026 is \u20AC4.66 per week, reflecting lower inflation compared to previous years. This brings the cumulative COLA to \u20AC10.36 per week (\u20AC538.72 annually).",
          },
        ]}
      />
      <main role="main" aria-label="Malta Budget 2026 Guide">
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
                <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full">
                  Budget Guide
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
                Malta Budget 2026: New Family Tax Savings & Key Changes
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Malta&apos;s 2026 Budget introduces the biggest tax changes for
                families in years. New tax brackets for parents and married
                couples with children can save up to &euro;1,625 per parent.
                Here&apos;s everything you need to know.
              </p>
            </header>

            <nav className="p-6 bg-muted/30 rounded-2xl mb-12 not-prose">
              <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#overview" className="text-primary hover:underline">
                    1. Budget 2026 Overview
                  </a>
                </li>
                <li>
                  <a
                    href="#family-tax"
                    className="text-primary hover:underline"
                  >
                    2. New Family Tax Brackets
                  </a>
                </li>
                <li>
                  <a
                    href="#tax-savings"
                    className="text-primary hover:underline"
                  >
                    3. How Much Can You Save?
                  </a>
                </li>
                <li>
                  <a
                    href="#eligibility"
                    className="text-primary hover:underline"
                  >
                    4. Who Qualifies?
                  </a>
                </li>
                <li>
                  <a href="#pensions" className="text-primary hover:underline">
                    5. Pension Tax Exemption
                  </a>
                </li>
                <li>
                  <a href="#property" className="text-primary hover:underline">
                    6. Property & Inheritance Changes
                  </a>
                </li>
                <li>
                  <a href="#business" className="text-primary hover:underline">
                    7. Business & Investment Incentives
                  </a>
                </li>
                <li>
                  <a href="#cola" className="text-primary hover:underline">
                    8. COLA 2026
                  </a>
                </li>
                <li>
                  <a href="#faqs" className="text-primary hover:underline">
                    9. FAQs
                  </a>
                </li>
              </ul>
            </nav>

            {/* Overview Section */}
            <section id="overview">
              <h2>1. Budget 2026 Overview</h2>
              <p>
                Malta&apos;s 2026 Budget, presented by Finance Minister Clyde
                Caruana, focuses heavily on{" "}
                <strong>supporting families with children</strong> through the
                tax system. Against the backdrop of Malta&apos;s declining birth
                rate, the government has introduced new income tax brackets
                specifically designed for parents and married couples with
                children.
              </p>
              <p>
                The Maltese economy continues its strong performance with real
                GDP growth expected at <strong>4.1%</strong>, and the budget
                deficit is projected to decrease to <strong>2.8%</strong> in
                2026, which should lead Malta to exit the EU&apos;s Excessive
                Deficit Procedure.
              </p>

              <div className="grid md:grid-cols-3 gap-4 not-prose my-8">
                <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    &euro;1,625
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Max tax savings per parent (2026)
                  </p>
                </div>
                <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-center">
                  <Landmark className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    100%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Pension income tax exempt
                  </p>
                </div>
                <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-center">
                  <Home className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-amber-600 mb-1">
                    &euro;400K
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Inheritance duty threshold
                  </p>
                </div>
              </div>
            </section>

            {/* New Family Tax Brackets */}
            <section id="family-tax" className="mt-12">
              <h2>2. New Family Tax Brackets</h2>
              <p>
                The most significant change in the 2026 Budget is the
                introduction of{" "}
                <strong>new income tax brackets for families</strong>. These
                apply to married couples and parents with{" "}
                <strong>qualifying children</strong> (under 18, or under 23 if
                in full-time education). The new rates provide wider 0% and 15%
                bands, meaning more of your income is taxed at lower rates.
              </p>

              <h3>Married Taxpayers - One Child</h3>
              <div className="overflow-x-auto my-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Income Range</th>
                      <th className="text-left py-3 px-4">Rate</th>
                      <th className="text-left py-3 px-4">Subtract</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">&euro;0 - &euro;17,500</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-semibold">
                          0%
                        </span>
                      </td>
                      <td className="py-3 px-4">&euro;0</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">&euro;17,501 - &euro;26,500</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-600 rounded-full text-xs font-semibold">
                          15%
                        </span>
                      </td>
                      <td className="py-3 px-4">&euro;2,625</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">&euro;26,501 - &euro;60,000</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-amber-500/10 text-amber-600 rounded-full text-xs font-semibold">
                          25%
                        </span>
                      </td>
                      <td className="py-3 px-4">&euro;5,275</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">&euro;60,001+</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-red-500/10 text-red-600 rounded-full text-xs font-semibold">
                          35%
                        </span>
                      </td>
                      <td className="py-3 px-4">&euro;11,275</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>Married Taxpayers - Two or More Children</h3>
              <div className="overflow-x-auto my-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Income Range</th>
                      <th className="text-left py-3 px-4">Rate</th>
                      <th className="text-left py-3 px-4">Subtract</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">&euro;0 - &euro;22,500</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-semibold">
                          0%
                        </span>
                      </td>
                      <td className="py-3 px-4">&euro;0</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">&euro;22,501 - &euro;32,000</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-600 rounded-full text-xs font-semibold">
                          15%
                        </span>
                      </td>
                      <td className="py-3 px-4">&euro;3,375</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">&euro;32,001 - &euro;60,000</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-amber-500/10 text-amber-600 rounded-full text-xs font-semibold">
                          25%
                        </span>
                      </td>
                      <td className="py-3 px-4">&euro;6,575</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">&euro;60,001+</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-red-500/10 text-red-600 rounded-full text-xs font-semibold">
                          35%
                        </span>
                      </td>
                      <td className="py-3 px-4">&euro;12,575</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>Parent Taxpayers - One Child</h3>
              <div className="overflow-x-auto my-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Income Range</th>
                      <th className="text-left py-3 px-4">Rate</th>
                      <th className="text-left py-3 px-4">Subtract</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">&euro;0 - &euro;14,500</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-semibold">
                          0%
                        </span>
                      </td>
                      <td className="py-3 px-4">&euro;0</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">&euro;14,501 - &euro;21,000</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-600 rounded-full text-xs font-semibold">
                          15%
                        </span>
                      </td>
                      <td className="py-3 px-4">&euro;2,175</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">&euro;21,001 - &euro;60,000</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-amber-500/10 text-amber-600 rounded-full text-xs font-semibold">
                          25%
                        </span>
                      </td>
                      <td className="py-3 px-4">&euro;4,275</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">&euro;60,001+</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-red-500/10 text-red-600 rounded-full text-xs font-semibold">
                          35%
                        </span>
                      </td>
                      <td className="py-3 px-4">&euro;10,270</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>Parent Taxpayers - Two or More Children</h3>
              <div className="overflow-x-auto my-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Income Range</th>
                      <th className="text-left py-3 px-4">Rate</th>
                      <th className="text-left py-3 px-4">Subtract</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">&euro;0 - &euro;18,500</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-semibold">
                          0%
                        </span>
                      </td>
                      <td className="py-3 px-4">&euro;0</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">&euro;18,501 - &euro;25,500</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-600 rounded-full text-xs font-semibold">
                          15%
                        </span>
                      </td>
                      <td className="py-3 px-4">&euro;2,775</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">&euro;25,501 - &euro;60,000</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-amber-500/10 text-amber-600 rounded-full text-xs font-semibold">
                          25%
                        </span>
                      </td>
                      <td className="py-3 px-4">&euro;5,325</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">&euro;60,001+</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-red-500/10 text-red-600 rounded-full text-xs font-semibold">
                          35%
                        </span>
                      </td>
                      <td className="py-3 px-4">&euro;11,325</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl my-6 not-prose">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <strong className="text-foreground">
                      Single Taxpayers:
                    </strong>
                    <p className="text-muted-foreground mt-1">
                      Tax brackets for single taxpayers without children remain
                      unchanged in 2026. See our{" "}
                      <Link
                        href="/blog/malta-tax-rates-2026-complete-guide"
                        className="text-primary hover:underline"
                      >
                        complete tax rates guide
                      </Link>{" "}
                      for all brackets.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Tax Savings Section */}
            <section id="tax-savings" className="mt-12">
              <h2>3. How Much Can You Save?</h2>
              <p>
                The new family tax brackets are being{" "}
                <strong>phased in over three years</strong> (2026-2028). The
                maximum tax savings per parent with two or more children are:
              </p>

              <div className="grid md:grid-cols-3 gap-4 my-8 not-prose">
                <div className="p-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl text-center">
                  <div className="text-sm text-muted-foreground mb-2">2026</div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    &euro;1,625
                  </div>
                  <p className="text-sm text-muted-foreground">
                    per parent/year
                  </p>
                </div>
                <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl text-center">
                  <div className="text-sm text-muted-foreground mb-2">2027</div>
                  <div className="text-3xl font-bold text-indigo-600 mb-2">
                    &euro;3,250
                  </div>
                  <p className="text-sm text-muted-foreground">
                    per parent/year
                  </p>
                </div>
                <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl text-center">
                  <div className="text-sm text-muted-foreground mb-2">2028</div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    &euro;5,000
                  </div>
                  <p className="text-sm text-muted-foreground">
                    per parent/year
                  </p>
                </div>
              </div>

              <h3>Calculation Example</h3>
              <div className="p-6 bg-muted/50 rounded-2xl my-6 not-prose">
                <h4 className="font-semibold mb-4">
                  Example: Married couple, 2 children, &euro;45,000 gross salary
                  each
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-muted-foreground mb-2">
                        Previous Married Rate (No Children)
                      </p>
                      <p>
                        Tax: &euro;45,000 &times; 25% - &euro;3,650 ={" "}
                        <strong>&euro;7,600</strong>
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-muted-foreground mb-2">
                        New Rate (2+ Children)
                      </p>
                      <p>
                        Tax: &euro;45,000 &times; 25% - &euro;6,575 ={" "}
                        <strong>&euro;4,675</strong>
                      </p>
                    </div>
                  </div>
                  <hr className="my-3 border-border/50" />
                  <p>
                    <strong className="text-green-600">
                      Saving per parent: &euro;2,925/year
                    </strong>{" "}
                    (capped at &euro;1,625 in 2026)
                  </p>
                  <p>
                    <strong className="text-green-600">
                      Combined household saving: up to &euro;3,250/year in 2026
                    </strong>
                  </p>
                </div>
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl my-6 not-prose">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <strong className="text-foreground">
                      Use Our Salary Calculator:
                    </strong>
                    <p className="text-muted-foreground mt-1">
                      Our{" "}
                      <Link
                        href="/salary"
                        className="text-primary hover:underline"
                      >
                        Malta Salary Calculator
                      </Link>{" "}
                      has been updated with all the new 2026 tax brackets. Enter
                      your salary and select your family status to see exact
                      savings.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Eligibility Section */}
            <section id="eligibility" className="mt-12">
              <h2>4. Who Qualifies for the New Rates?</h2>
              <p>
                Not all married taxpayers or parents benefit from the new rates.
                You must meet specific criteria:
              </p>

              <h3>Qualifying Child Definition</h3>
              <ul>
                <li>
                  Under <strong>18 years</strong> of age, OR
                </li>
                <li>
                  Under <strong>23 years</strong> of age and in{" "}
                  <strong>full-time education</strong>
                </li>
              </ul>

              <h3>Married Rates Requirements</h3>
              <ul>
                <li>
                  Couple is <strong>married</strong> and{" "}
                  <strong>Malta-resident</strong>
                </li>
                <li>
                  At least one spouse holds <strong>Maltese</strong>,{" "}
                  <strong>EU</strong>, or <strong>EEA nationality</strong>, OR
                </li>
                <li>
                  Both are <strong>long-term residents</strong> with children
                  born and residing in Malta
                </li>
              </ul>

              <h3>Parent Rates Requirements</h3>
              <ul>
                <li>
                  Individual is <strong>Malta-resident</strong>
                </li>
                <li>
                  Taxpayer is Maltese, EU/EEA national, or long-term resident
                  with children born in Malta
                </li>
                <li>
                  Non-parent guardians must be married or have registered
                  cohabitation with the child&apos;s parent
                </li>
              </ul>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl my-6 not-prose">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <strong className="text-foreground">
                      FS4 Form Update Required:
                    </strong>
                    <p className="text-muted-foreground mt-1">
                      The Malta Tax and Customs Administration has updated the
                      FS4 Payee Status Declaration Form. Employees should submit
                      a new FS4 to their employer to benefit from the new rates.
                      Employers must update payroll systems accordingly.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Pension Section */}
            <section id="pensions" className="mt-12">
              <h2>5. Pension Tax Exemption</h2>
              <p>
                From 2026, Malta has introduced a{" "}
                <strong>full tax exemption on pension income</strong>. This is a
                major improvement over previous years where only partial
                exemptions existed.
              </p>

              <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl my-6 not-prose">
                <Landmark className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-lg mb-2">
                  What&apos;s Changed?
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>
                    <CheckCircle2 className="h-4 w-4 text-green-500 inline mr-2" />
                    Pension income up to{" "}
                    <strong>double the maximum statutory pension</strong>{" "}
                    (including bonuses) is fully exempt
                  </li>
                  <li>
                    <CheckCircle2 className="h-4 w-4 text-green-500 inline mr-2" />
                    Applies to all pensioners from{" "}
                    <strong>1 January 2026</strong>
                  </li>
                  <li>
                    <CheckCircle2 className="h-4 w-4 text-green-500 inline mr-2" />
                    Significant savings for retirees who previously paid tax on
                    pension income
                  </li>
                </ul>
              </div>

              <p>
                This change makes Malta even more attractive as a retirement
                destination. Read our{" "}
                <Link
                  href="/blog/malta-pension-system-2026-guide"
                  className="text-primary hover:underline"
                >
                  Malta Pension System Guide
                </Link>{" "}
                for more details about the pension system.
              </p>
            </section>

            {/* Property Section */}
            <section id="property" className="mt-12">
              <h2>6. Property & Inheritance Changes</h2>
              <p>
                The 2026 Budget includes significant changes to property-related
                taxation:
              </p>

              <h3>Inheritance Stamp Duty</h3>
              <p>
                The reduced duty rate of <strong>3.5%</strong> on inherited
                property has been extended from the first &euro;200,000 to the
                first <strong>&euro;400,000</strong>. This effectively doubles
                the tax relief for people inheriting family property.
              </p>

              <div className="p-6 bg-muted/50 rounded-2xl my-6 not-prose">
                <h4 className="font-semibold mb-4">
                  Inheritance Tax Savings Example
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    Property value: <strong>&euro;350,000</strong>
                  </p>
                  <hr className="my-3 border-border/50" />
                  <p>
                    Previous: &euro;200,000 &times; 3.5% + &euro;150,000 &times;
                    5% = &euro;7,000 + &euro;7,500 ={" "}
                    <strong>&euro;14,500</strong>
                  </p>
                  <p>
                    New: &euro;350,000 &times; 3.5% ={" "}
                    <strong>&euro;12,250</strong>
                  </p>
                  <hr className="my-3 border-border/50" />
                  <p className="text-green-600 font-semibold">
                    Saving: &euro;2,250
                  </p>
                </div>
              </div>

              <h3>First-Time Buyers Scheme</h3>
              <p>
                The First-Time Buyers scheme has been{" "}
                <strong>enshrined in law permanently</strong>. The rules have
                also been amended so that ownership of non-residential property
                will <strong>no longer disqualify</strong> eligibility for the
                scheme.
              </p>

              <p>
                Use our{" "}
                <Link
                  href="/calculators/stamp-duty"
                  className="text-primary hover:underline"
                >
                  Stamp Duty Calculator
                </Link>{" "}
                to calculate your exact property transfer costs.
              </p>
            </section>

            {/* Business Section */}
            <section id="business" className="mt-12">
              <h2>7. Business & Investment Incentives</h2>
              <p>
                The Budget introduces several measures to support business
                growth and investment:
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-8 not-prose">
                <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                  <Building2 className="h-8 w-8 text-purple-600 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">
                    Micro Invest Scheme
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      Malta: up to <strong>&euro;65,000</strong> tax credit
                    </li>
                    <li>
                      Gozo: up to <strong>&euro;85,000</strong> tax credit
                    </li>
                    <li>Increased from previous limits</li>
                  </ul>
                </div>
                <div className="p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl">
                  <TrendingDown className="h-8 w-8 text-cyan-600 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">R&D Deduction</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      <strong>175%</strong> tax deduction on R&D expenditure
                    </li>
                    <li>Eligible research and innovation costs</li>
                    <li>Encourages technology investment</li>
                  </ul>
                </div>
              </div>

              <h3>New Investment Tax Credit</h3>
              <p>
                A new investment tax credit has been introduced offering{" "}
                <strong>60% of qualifying capital expenditure</strong>,
                claimable over four years. This benefits businesses making
                significant investments in growth.
              </p>

              <h3>Technology & AI Incentives</h3>
              <p>
                Tax deductions on investments related to{" "}
                <strong>
                  Artificial Intelligence, digitalisation, modernisation,
                  automation, and cybersecurity
                </strong>{" "}
                will be accelerated over a span of <strong>two years</strong>{" "}
                instead of the standard depreciation period.
              </p>

              <p>
                Self-employed individuals should also check our{" "}
                <Link
                  href="/blog/malta-self-employment-tax-guide-2026"
                  className="text-primary hover:underline"
                >
                  Self-Employment Tax Guide
                </Link>{" "}
                for tax planning tips.
              </p>
            </section>

            {/* COLA Section */}
            <section id="cola" className="mt-12">
              <h2>8. COLA 2026</h2>
              <p>
                The Cost of Living Adjustment (COLA) for 2026 is{" "}
                <strong>&euro;4.66 per week</strong>, reflecting lower inflation
                compared to previous years. This brings the cumulative COLA to
                &euro;10.36 per week (&euro;538.72 annually).
              </p>

              <div className="overflow-x-auto my-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Year</th>
                      <th className="text-left py-3 px-4">Weekly COLA</th>
                      <th className="text-left py-3 px-4">Annual Equivalent</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">2024</td>
                      <td className="py-3 px-4">&euro;12.81</td>
                      <td className="py-3 px-4">&euro;666.12</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">2025</td>
                      <td className="py-3 px-4">&euro;5.24</td>
                      <td className="py-3 px-4">&euro;272.48</td>
                    </tr>
                    <tr className="border-b bg-primary/5">
                      <td className="py-3 px-4 font-semibold">2026</td>
                      <td className="py-3 px-4 font-semibold">&euro;4.66</td>
                      <td className="py-3 px-4 font-semibold">&euro;242.32</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                COLA is automatically added to all salaries and is{" "}
                <strong>not subject to income tax</strong>. Read more in our{" "}
                <Link
                  href="/blog/understanding-cola-malta-2026"
                  className="text-primary hover:underline"
                >
                  COLA Guide
                </Link>
                .
              </p>
            </section>

            {/* FAQs Section */}
            <section id="faqs" className="mt-12">
              <h2>9. Frequently Asked Questions</h2>

              <div className="space-y-6 not-prose">
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h3 className="font-semibold mb-2">
                    How much can families save with the new Malta 2026 tax
                    brackets?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Families with two or more children can save up to
                    &euro;1,625 per parent in 2026. These savings increase to
                    &euro;3,250 in 2027 and &euro;5,000 in 2028 as the new
                    brackets are phased in over three years.
                  </p>
                </div>

                <div className="p-4 bg-muted/30 rounded-xl">
                  <h3 className="font-semibold mb-2">
                    Who qualifies for the new family tax rates?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    To qualify, you must be Malta-resident and married or a
                    parent with qualifying children under 18 (or under 23 if in
                    full-time education). At least one spouse must hold Maltese,
                    EU/EEA nationality, or both must be long-term residents with
                    children born in Malta.
                  </p>
                </div>

                <div className="p-4 bg-muted/30 rounded-xl">
                  <h3 className="font-semibold mb-2">
                    Is pension income tax-free in Malta from 2026?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, from 2026 all pension income up to double the maximum
                    statutory pension amount (including bonuses) is fully exempt
                    from income tax.
                  </p>
                </div>

                <div className="p-4 bg-muted/30 rounded-xl">
                  <h3 className="font-semibold mb-2">
                    What changed for property inheritance tax?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    The reduced stamp duty rate of 3.5% on inherited property
                    has been extended from the first &euro;200,000 to the first
                    &euro;400,000, effectively doubling the tax relief on
                    inherited properties.
                  </p>
                </div>

                <div className="p-4 bg-muted/30 rounded-xl">
                  <h3 className="font-semibold mb-2">
                    What is the COLA increase for 2026?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    The COLA for 2026 is &euro;4.66 per week (&euro;242.32
                    annually), reflecting lower inflation compared to previous
                    years.
                  </p>
                </div>
              </div>
            </section>

            {/* Calculator CTA */}
            <div className="not-prose mt-16 p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-indigo-500/10 border border-blue-500/20">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                    <Calculator className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold mb-2">
                    Calculate Your 2026 Net Salary
                  </h3>
                  <p className="text-muted-foreground">
                    Our salary calculator is updated with all 2026 Budget
                    changes. See exactly how the new family tax brackets affect
                    your take-home pay.
                  </p>
                </div>
                <Link
                  href="/salary"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
                >
                  Try Calculator
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Related Articles */}
            <section className="mt-12">
              <h2>Related Guides</h2>
              <ul>
                <li>
                  <Link href="/blog/malta-tax-rates-2026-complete-guide">
                    Malta Tax Rates 2026: Complete Guide to Income Tax Brackets
                  </Link>
                </li>
                <li>
                  <Link href="/blog/malta-ssc-contributions-2026-explained">
                    Malta SSC Contributions 2026: Rates, Caps & Categories
                  </Link>
                </li>
                <li>
                  <Link href="/blog/understanding-cola-malta-2026">
                    Understanding COLA in Malta 2026
                  </Link>
                </li>
                <li>
                  <Link href="/blog/malta-pension-system-2026-guide">
                    Malta Pension System 2026: State Pension Guide
                  </Link>
                </li>
                <li>
                  <Link href="/blog/malta-stamp-duty-complete-guide-2026">
                    Malta Stamp Duty 2026: Complete Guide
                  </Link>
                </li>
                <li>
                  <Link href="/blog/malta-first-time-buyer-scheme-2026">
                    Malta First-Time Buyer Scheme 2026
                  </Link>
                </li>
              </ul>
            </section>

            {/* Sources */}
            <section className="mt-12">
              <h2>Sources</h2>
              <ul className="text-sm">
                <li>
                  <a
                    href="https://finance.gov.mt/wp-content/uploads/2025/11/Budget-Speech-2026.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Malta Budget Speech 2026 - Ministry of Finance
                  </a>
                </li>
                <li>
                  <a
                    href="https://mtca.gov.mt/docs/default-source/documents/2026-tax-rates.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    2026 Tax Rates - Malta Tax and Customs Administration
                  </a>
                </li>
                <li>
                  <a
                    href="https://kpmg.com/us/en/taxnewsflash/news/2025/10/malta-tax-measures-2026-budget.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    KPMG - Malta Tax Measures in 2026 Budget
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.deloitte.com/mt/en/services/tax/services/malta-budget-2026.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Deloitte Malta - Budget 2026
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.grantthornton.com.mt/malta-budget-2026/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Grant Thornton Malta - Budget 2026
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
