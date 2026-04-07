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

const ARTICLE_SOURCES = [
  {
    name: "Malta Commissioner for Revenue - Tax Rates 2026",
    url: "https://cfr.gov.mt/en/Tax-Encyclopaedia/Pages/Tax-Rates.aspx",
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
    "Complete guide to Malta income tax rates for 2026. Detailed breakdown of tax brackets for single (0-35%), married, and parent taxpayers. Includes examples, thresholds, and calculation methods.",
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
            text: "Calculate your total annual gross salary including any bonuses, but excluding COLA and statutory government bonuses which are tax-exempt.",
          },
          {
            name: "Apply the tax brackets",
            text: "Use Malta's progressive tax brackets for your status. For example, a single taxpayer pays 0% on the first €9,100, 15% on €9,101-€14,500, 25% on €14,501-€60,000, and 35% above €60,000.",
          },
          {
            name: "Calculate using the formula",
            text: "Apply the formula: Tax = (Gross Income × Rate) − Deduction. The deduction amount is pre-calculated for each bracket to simplify computation.",
          },
          {
            name: "Deduct SSC and add COLA",
            text: "Subtract Social Security Contributions (10% of basic weekly wage, capped at €55.93/week for 2026) and add COLA (€512.52 annually for 2026) to determine your final net salary.",
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
              <p>For 2026, Malta has three main tax computation categories:</p>
              <ul>
                <li>
                  <strong>Single</strong> - For unmarried individuals
                </li>
                <li>
                  <strong>Married</strong> - For married couples (joint
                  computation)
                </li>
                <li>
                  <strong>Parent</strong> - For single parents with dependent
                  children
                </li>
              </ul>
              <p>
                Each category has different tax brackets and thresholds, with
                married taxpayers and parents enjoying more favorable rates than
                single taxpayers.
              </p>
            </section>

            <section id="single-rates" className="mt-12">
              <h2>2. Single Taxpayer Tax Rates 2026</h2>
              <p>
                The following table shows the income tax brackets for{" "}
                <strong>single taxpayers</strong> in Malta for 2026:
              </p>

              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Annual Income (€)
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Tax Rate
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Tax on Band
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">€0 - €9,100</td>
                      <td className="border border-border p-3 font-semibold text-green-600">
                        0%
                      </td>
                      <td className="border border-border p-3">€0</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        €9,101 - €14,500
                      </td>
                      <td className="border border-border p-3 font-semibold text-yellow-600">
                        15%
                      </td>
                      <td className="border border-border p-3">Up to €810</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        €14,501 - €19,500
                      </td>
                      <td className="border border-border p-3 font-semibold text-orange-600">
                        25%
                      </td>
                      <td className="border border-border p-3">Up to €1,250</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        €19,501 - €60,000
                      </td>
                      <td className="border border-border p-3 font-semibold text-orange-600">
                        25%
                      </td>
                      <td className="border border-border p-3">
                        Up to €10,125
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">Over €60,000</td>
                      <td className="border border-border p-3 font-semibold text-red-600">
                        35%
                      </td>
                      <td className="border border-border p-3">
                        35% of excess
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl not-prose">
                <p className="text-sm">
                  <strong>💡 Key Point:</strong> The first €9,100 of income is
                  completely tax-free for single taxpayers. This is known as the
                  &quot;personal allowance&quot; or tax-free threshold.
                </p>
              </div>
            </section>

            <section id="married-rates" className="mt-12">
              <h2>3. Married Taxpayer Tax Rates 2026</h2>
              <p>
                Married taxpayers in Malta benefit from higher tax-free
                thresholds and more favorable brackets:
              </p>

              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Annual Income (€)
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Tax Rate
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Tax on Band
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">€0 - €12,700</td>
                      <td className="border border-border p-3 font-semibold text-green-600">
                        0%
                      </td>
                      <td className="border border-border p-3">€0</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        €12,701 - €21,200
                      </td>
                      <td className="border border-border p-3 font-semibold text-yellow-600">
                        15%
                      </td>
                      <td className="border border-border p-3">Up to €1,275</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        €21,201 - €28,700
                      </td>
                      <td className="border border-border p-3 font-semibold text-orange-600">
                        25%
                      </td>
                      <td className="border border-border p-3">Up to €1,875</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        €28,701 - €60,000
                      </td>
                      <td className="border border-border p-3 font-semibold text-orange-600">
                        25%
                      </td>
                      <td className="border border-border p-3">Up to €7,825</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">Over €60,000</td>
                      <td className="border border-border p-3 font-semibold text-red-600">
                        35%
                      </td>
                      <td className="border border-border p-3">
                        35% of excess
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                <strong>Married taxpayers save €540/year</strong> compared to
                single taxpayers at the same income level, thanks to the higher
                tax-free threshold (€12,700 vs €9,100).
              </p>
            </section>

            <section id="parent-rates" className="mt-12">
              <h2>4. Parent Taxpayer Tax Rates 2026</h2>
              <p>
                Single parents with dependent children qualify for the
                &quot;Parent&quot; tax computation, which offers similar
                benefits to married taxpayers:
              </p>

              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Annual Income (€)
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Tax Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">€0 - €10,500</td>
                      <td className="border border-border p-3 font-semibold text-green-600">
                        0%
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        €10,501 - €15,800
                      </td>
                      <td className="border border-border p-3 font-semibold text-yellow-600">
                        15%
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        €15,801 - €21,200
                      </td>
                      <td className="border border-border p-3 font-semibold text-orange-600">
                        25%
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        €21,201 - €60,000
                      </td>
                      <td className="border border-border p-3 font-semibold text-orange-600">
                        25%
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">Over €60,000</td>
                      <td className="border border-border p-3 font-semibold text-red-600">
                        35%
                      </td>
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
                  <li>
                    • First €9,100 @ 0% = <strong>€0</strong>
                  </li>
                  <li>
                    • €9,101 - €14,500 (€5,400) @ 15% = <strong>€810</strong>
                  </li>
                  <li>
                    • €14,501 - €19,500 (€5,000) @ 25% = <strong>€1,250</strong>
                  </li>
                  <li>
                    • €19,501 - €30,000 (€10,500) @ 25% ={" "}
                    <strong>€2,625</strong>
                  </li>
                  <li className="pt-2 border-t border-border font-semibold">
                    Total Annual Tax ={" "}
                    <strong className="text-primary">€4,685</strong>
                  </li>
                </ul>
              </div>

              <h3>Example 2: Married Taxpayer Earning €50,000</h3>
              <div className="p-6 bg-muted/30 rounded-xl not-prose my-4">
                <ul className="space-y-2 text-sm">
                  <li>
                    • First €12,700 @ 0% = <strong>€0</strong>
                  </li>
                  <li>
                    • €12,701 - €21,200 (€8,500) @ 15% = <strong>€1,275</strong>
                  </li>
                  <li>
                    • €21,201 - €28,700 (€7,500) @ 25% = <strong>€1,875</strong>
                  </li>
                  <li>
                    • €28,701 - €50,000 (€21,300) @ 25% ={" "}
                    <strong>€5,325</strong>
                  </li>
                  <li className="pt-2 border-t border-border font-semibold">
                    Total Annual Tax ={" "}
                    <strong className="text-primary">€8,475</strong>
                  </li>
                </ul>
              </div>
            </section>

            <section id="deductions" className="mt-12">
              <h2>6. Tax-Free Income & Deductions</h2>
              <p>Certain types of income are not subject to tax in Malta:</p>
              <ul>
                <li>
                  <strong>COLA (Cost of Living Adjustment)</strong> - The annual
                  COLA payment of €538.72 (2026) is tax-free
                </li>
                <li>
                  <strong>Statutory Bonuses</strong> - Government-mandated
                  bonuses are tax-exempt
                </li>
                <li>
                  <strong>Children&apos;s Allowance</strong> - Social benefits
                  for children are not taxable
                </li>
              </ul>
            </section>

            <BlogArticleAuthor
              datePublished="2026-01-01"
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
