import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
  getBlogOgImage,
  pageAlternates,
} from "@/app/shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Calculator,
} from "lucide-react";
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  HowToJsonLd,
} from "@/components/json-ld";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";
import { BlogArticleAuthor } from "@/components/blog/blog-article-author";
import { Budget2027Update } from "@/app/blog/_shared/budget-2027-update";

const ARTICLE_SOURCES = [
  {
    name: "Malta Tax and Customs Administration - Tax Rates 2026",
    url: "https://mtca.gov.mt/personal-tax/tax-rates/tax-ratesindividuals",
  },
  {
    name: "Malta Tax & Customs Administration (MTCA)",
    url: "https://mtca.gov.mt/personal-tax/tax-rates/tax-ratesindividuals",
  },
  {
    name: "Department of Social Security Malta",
    url: "https://socialsecurity.gov.mt",
  },
];

export const metadata: Metadata = {
  ...defaultMetadata,
  title:
    "Malta Tax Rates 2026: Complete Guide to Income Tax Brackets | Malta Calculator",
  description:
    "Malta income tax rates 2026: official brackets for single, married and parent taxpayers, the new child-based rates, examples and the subtraction formula.",
  keywords: [
    "Malta tax rates 2026",
    "Malta income tax brackets",
    "Malta tax calculator",
    "Malta single tax rates",
    "Malta married tax rates",
    "Malta parent tax rates",
    "Malta tax thresholds",
    "Malta 35% tax bracket",
  ],
  alternates: pageAlternates("/blog/malta-tax-rates-2026-complete-guide"),
  openGraph: {
    ...ogMetadata,
    title: "Malta Tax Rates 2026: Complete Guide to Income Tax Brackets",
    url: `${SITE_URL}/blog/malta-tax-rates-2026-complete-guide`,
    type: "article",
    images: [
      getBlogOgImage(
        "Malta Tax Rates 2026: Complete Guide to Income Tax Brackets",
      ),
    ],
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Tax Rates 2026: Complete Guide to Income Tax Brackets",
  },
};

export default function MaltaTaxRates2026Page() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Tax Rates 2026: Complete Guide to Income Tax Brackets"
        description="Complete guide to Malta income tax rates for 2026 including brackets for single, married, and parent taxpayers."
        slug="malta-tax-rates-2026-complete-guide"
        datePublished="2026-01-01"
        dateModified="2026-10-27"
        sources={ARTICLE_SOURCES}
      />
      <HowToJsonLd
        name="How to Calculate Income Tax in Malta"
        description="Step-by-step guide to calculating your Malta income tax based on your tax status and income level."
        totalTime="PT2M"
        steps={[
          {
            name: "Determine your tax status",
            text: "Identify whether you file as Single, Married, or Parent. For 2026, married and parent categories have sub-categories based on number of children (0, 1, or 2+).",
          },
          {
            name: "Find your gross annual income",
            text: "Calculate your total annual gross salary including any bonuses and the statutory government bonuses (€512.52 in 2026), which are taxable.",
          },
          {
            name: "Apply the tax brackets",
            text: "Use Malta's progressive tax brackets for your status. For example, in 2026 a single taxpayer pays 0% on the first €12,000, 15% on €12,001-€16,000, 25% on €16,001-€60,000, and 35% above €60,000.",
          },
          {
            name: "Calculate using the formula",
            text: "Apply the formula: Tax = (Gross Income × Rate) − Deduction. The deduction amount is pre-calculated for each bracket to simplify computation.",
          },
          {
            name: "Deduct SSC and add COLA",
            text: "Subtract Social Security Contributions (10% of basic weekly wage, capped at €55.93/week for 2026) and income tax from your gross pay (including the taxable €512.52 statutory bonuses) to determine your final net salary.",
          },
        ]}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Tax Rates 2026",
            url: `${SITE_URL}/blog/malta-tax-rates-2026-complete-guide`,
          },
        ]}
      />
      <main role="main" aria-label="Malta Tax Rates 2026 Guide">
        <Shell className="max-w-4xl py-12">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <article className="prose prose-neutral dark:prose-invert max-w-none">
            {/* Header */}
            <header className="mb-12 not-prose">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                  Tax Guide
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  January 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />8 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Tax Rates 2026: Complete Guide to Income Tax Brackets
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Everything you need to know about Malta&apos;s income tax system
                for 2026. This comprehensive guide covers all tax brackets,
                rates, and thresholds for single, married, and parent taxpayers.
              </p>
            </header>

            <Budget2027Update
              title="2027 tax bands announced in Budget 2027"
              linkLabel="See the full 2027 tax tables"
              items={[
                <>
                  Single, married (no children) and parent (no children) rates
                  stay the same in 2027
                </>,
                <>
                  Tax-free band rises to <strong>€20,000</strong> (married, 1
                  child), <strong>€30,000</strong> (married, 2+),{" "}
                  <strong>€16,000</strong> (parent, 1 child) and{" "}
                  <strong>€24,000</strong> (parent, 2+)
                </>,
                <>
                  Income above €60,000 is still taxed at 35%; no change to
                  income tax rates
                </>,
                <>
                  The <Link href="/">salary calculator</Link> now includes the
                  2027 bands
                </>,
              ]}
            />

            {/* Table of Contents */}
            <nav className="p-6 bg-muted/30 rounded-2xl mb-12 not-prose">
              <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#overview" className="text-primary hover:underline">
                    1. Overview of Malta&apos;s Tax System
                  </a>
                </li>
                <li>
                  <a
                    href="#single-rates"
                    className="text-primary hover:underline"
                  >
                    2. Single Taxpayer Rates
                  </a>
                </li>
                <li>
                  <a
                    href="#married-rates"
                    className="text-primary hover:underline"
                  >
                    3. Married Taxpayer Rates
                  </a>
                </li>
                <li>
                  <a
                    href="#parent-rates"
                    className="text-primary hover:underline"
                  >
                    4. Parent Taxpayer Rates
                  </a>
                </li>
                <li>
                  <a href="#examples" className="text-primary hover:underline">
                    5. Calculation Examples
                  </a>
                </li>
                <li>
                  <a
                    href="#deductions"
                    className="text-primary hover:underline"
                  >
                    6. Tax-Free Income & Deductions
                  </a>
                </li>
              </ul>
            </nav>

            {/* Content */}
            <section id="overview">
              <h2>1. Overview of Malta&apos;s Tax System</h2>
              <p>
                Malta operates a <strong>progressive income tax system</strong>,
                meaning the more you earn, the higher percentage of tax you pay
                on your income above certain thresholds. The tax rates range
                from <strong>0% to 35%</strong> depending on your income level
                and tax status.
              </p>
              <p>
                For 2026 there are three main computation types, and since 1
                January 2026 the married and parent rates are further split by
                the number of qualifying children (seven rate tables in total):
              </p>
              <ul>
                <li>
                  <strong>Single</strong> - For unmarried individuals
                </li>
                <li>
                  <strong>Married</strong> - For married couples (joint
                  computation): no children, one child, or two or more children
                </li>
                <li>
                  <strong>Parent</strong> - For single parents maintaining a
                  child: no qualifying child, one child, or two or more children
                </li>
              </ul>
              <p>
                A qualifying child is under 18, or under 23 if in full-time
                education. All figures below are the official 2026 rates
                published by the Malta Tax and Customs Administration (MTCA).
                Tax is worked out with the formula
                <strong>Tax = Chargeable Income × Rate − Subtract</strong>.
              </p>
            </section>

            <section id="single-rates" className="mt-12">
              <h2>2. Single Taxpayer Tax Rates 2026</h2>
              <p>
                The following table shows the income tax brackets for
                <strong>single taxpayers</strong> in Malta for 2026 (unchanged
                from 2025):
              </p>
              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Chargeable Income (€)
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Rate
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Subtract (€)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">0 – 12,000</td>
                      <td className="border border-border p-3 font-semibold">
                        0%
                      </td>
                      <td className="border border-border p-3">0</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        12,001 – 16,000
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        15%
                      </td>
                      <td className="border border-border p-3">1,800</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        16,001 – 60,000
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        25%
                      </td>
                      <td className="border border-border p-3">3,400</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        60,001 and over
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        35%
                      </td>
                      <td className="border border-border p-3">9,400</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl not-prose">
                <p className="text-sm">
                  <strong>💡 Key Point:</strong> The first
                  <strong>€12,000</strong> of chargeable income is taxed at 0%
                  for single taxpayers.
                </p>
              </div>
            </section>

            <section id="married-rates" className="mt-12">
              <h2>3. Married Taxpayer Tax Rates 2026</h2>
              <h3>Married - No Qualifying Children</h3>
              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Chargeable Income (€)
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Rate
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Subtract (€)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">0 – 15,000</td>
                      <td className="border border-border p-3 font-semibold">
                        0%
                      </td>
                      <td className="border border-border p-3">0</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        15,001 – 23,000
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        15%
                      </td>
                      <td className="border border-border p-3">2,250</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        23,001 – 60,000
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        25%
                      </td>
                      <td className="border border-border p-3">4,550</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        60,001 and over
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        35%
                      </td>
                      <td className="border border-border p-3">10,550</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h3>Married - One Child</h3>
              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Chargeable Income (€)
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Rate
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Subtract (€)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">0 – 17,500</td>
                      <td className="border border-border p-3 font-semibold">
                        0%
                      </td>
                      <td className="border border-border p-3">0</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        17,501 – 26,500
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        15%
                      </td>
                      <td className="border border-border p-3">2,625</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        26,501 – 60,000
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        25%
                      </td>
                      <td className="border border-border p-3">5,275</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        60,001 and over
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        35%
                      </td>
                      <td className="border border-border p-3">11,275</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h3>Married - Two or More Children</h3>
              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Chargeable Income (€)
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Rate
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Subtract (€)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">0 – 22,500</td>
                      <td className="border border-border p-3 font-semibold">
                        0%
                      </td>
                      <td className="border border-border p-3">0</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        22,501 – 32,000
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        15%
                      </td>
                      <td className="border border-border p-3">3,375</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        32,001 – 60,000
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        25%
                      </td>
                      <td className="border border-border p-3">6,575</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        60,001 and over
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        35%
                      </td>
                      <td className="border border-border p-3">12,575</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                The child-based married rates are new for 2026 and are being
                phased in further in 2027 and 2028. See our
                <Link
                  href="/blog/malta-budget-2026-family-tax-savings-guide"
                  className="text-primary hover:underline"
                >
                  Budget 2026 family tax guide
                </Link>
                for the eligibility rules.
              </p>
            </section>

            <section id="parent-rates" className="mt-12">
              <h2>4. Parent Taxpayer Tax Rates 2026</h2>
              <p>
                Single parents maintaining a child qualify for the
                &quot;Parent&quot; computation:
              </p>
              <h3>Parent - Standard Rates</h3>
              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Chargeable Income (€)
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Rate
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Subtract (€)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">0 – 13,000</td>
                      <td className="border border-border p-3 font-semibold">
                        0%
                      </td>
                      <td className="border border-border p-3">0</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        13,001 – 17,500
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        15%
                      </td>
                      <td className="border border-border p-3">1,950</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        17,501 – 60,000
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        25%
                      </td>
                      <td className="border border-border p-3">3,700</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        60,001 and over
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        35%
                      </td>
                      <td className="border border-border p-3">9,700</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h3>Parent - One Child</h3>
              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Chargeable Income (€)
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Rate
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Subtract (€)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">0 – 14,500</td>
                      <td className="border border-border p-3 font-semibold">
                        0%
                      </td>
                      <td className="border border-border p-3">0</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        14,501 – 21,000
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        15%
                      </td>
                      <td className="border border-border p-3">2,175</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        21,001 – 60,000
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        25%
                      </td>
                      <td className="border border-border p-3">4,275</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        60,001 and over
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        35%
                      </td>
                      <td className="border border-border p-3">10,275</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h3>Parent - Two or More Children</h3>
              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Chargeable Income (€)
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Rate
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Subtract (€)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">0 – 18,500</td>
                      <td className="border border-border p-3 font-semibold">
                        0%
                      </td>
                      <td className="border border-border p-3">0</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        18,501 – 25,500
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        15%
                      </td>
                      <td className="border border-border p-3">2,775</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        25,501 – 60,000
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        25%
                      </td>
                      <td className="border border-border p-3">5,325</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        60,001 and over
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        35%
                      </td>
                      <td className="border border-border p-3">11,325</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="examples" className="mt-12">
              <h2>5. Calculation Examples</h2>

              <h3>Example 1: Single Taxpayer Earning €30,000</h3>
              <div className="p-6 bg-muted/30 rounded-xl not-prose my-4">
                <ul className="space-y-2 text-sm">
                  <li>• Band: €16,001 – €60,000 (25%, subtract €3,400)</li>
                  <li>• €30,000 × 25% = €7,500</li>
                  <li>• €7,500 − €3,400</li>
                  <li className="pt-2 border-t border-border">
                    <span>Total Annual Tax = </span>
                    <strong className="text-primary">€4,100</strong>
                  </li>
                </ul>
              </div>

              <h3>Example 2: Married Couple Earning €50,000 (No Children)</h3>
              <div className="p-6 bg-muted/30 rounded-xl not-prose my-4">
                <ul className="space-y-2 text-sm">
                  <li>• Band: €23,001 – €60,000 (25%, subtract €4,550)</li>
                  <li>• €50,000 × 25% = €12,500</li>
                  <li>• €12,500 − €4,550</li>
                  <li className="pt-2 border-t border-border">
                    <span>Total Annual Tax = </span>
                    <strong className="text-primary">€7,950</strong>
                  </li>
                </ul>
              </div>

              <h3>Example 3: Married Couple Earning €50,000 (Two Children)</h3>
              <div className="p-6 bg-muted/30 rounded-xl not-prose my-4">
                <ul className="space-y-2 text-sm">
                  <li>• Band: €32,001 – €60,000 (25%, subtract €6,575)</li>
                  <li>• €50,000 × 25% = €12,500</li>
                  <li>• €12,500 − €6,575</li>
                  <li className="pt-2 border-t border-border">
                    <span>Total Annual Tax = </span>
                    <strong className="text-primary">€5,925</strong>
                    <span className="text-muted-foreground text-xs">
                      {" "}
                      (€2,025 less than without children)
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            <section id="deductions" className="mt-12">
              <h2>6. Tax-Free Income & Deductions</h2>
              <p>Some income is exempt or taxed separately in Malta:</p>
              <ul>
                <li>
                  <strong>Children&apos;s Allowance</strong> - Social security
                  benefits for children are not taxable
                </li>
                <li>
                  <strong>Pension income</strong> - From 2026, qualifying
                  pension income of people aged 61+ is fully exempt, subject to
                  a cap
                </li>
                <li>
                  <strong>Bank interest</strong> - Can be taxed at a 15% final
                  withholding tax instead of your normal rates
                </li>
              </ul>
              <p>
                Note that <strong>COLA</strong> (part of your basic wage) and
                the <strong>statutory bonuses</strong> (€512.52 a year) are
                <strong>taxable</strong> in Malta. They are not tax-free.
              </p>
            </section>

            <BlogArticleAuthor
              datePublished="2026-01-01"
              dateModified="2026-10-27"
              sources={ARTICLE_SOURCES}
            />

            <BlogArticleFooter
              slug="malta-tax-rates-2026-complete-guide"
              title="Malta Tax Rates 2026: Complete Guide to Income Tax Brackets"
              ctaDescription="Use our free Malta Salary Calculator to get your exact tax amount, SSC contributions, and net salary for 2026."
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
