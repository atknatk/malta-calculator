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
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";
import { BlogArticleAuthor } from "@/components/blog/blog-article-author";

export const metadata: Metadata = {
  ...defaultMetadata,
  title:
    "Malta 15% Expat Tax 2026: HSI Rules (Formerly HQP) | Malta Calculator",
  description:
    "Malta's 15% expat tax in 2026: the Highly Skilled Individuals Rules that replaced HQP. €65,000 threshold, eligible employers, transition rules and savings.",
  keywords: [
    "Malta HQP tax scheme",
    "Malta expat tax",
    "Malta 15% flat tax",
    "Highly Qualified Persons Malta",
    "Malta Highly Skilled Individuals Rules",
    "Malta iGaming tax",
    "Malta finance tax",
    "Malta expat salary",
    "Malta tax for foreigners",
  ],
  alternates: pageAlternates("/blog/malta-expat-tax-hqp-scheme-guide"),
  openGraph: {
    ...ogMetadata,
    title: "Malta 15% Expat Tax 2026: HSI Rules (Formerly HQP)",
    url: `${SITE_URL}/blog/malta-expat-tax-hqp-scheme-guide`,
    type: "article",
    images: [
      getBlogOgImage("Malta 15% Expat Tax 2026: HSI Rules (Formerly HQP)"),
    ],
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta 15% Expat Tax 2026: HSI Rules (Formerly HQP)",
  },
};

const ARTICLE_SOURCES = [
  {
    name: "Legal Notice 20 of 2026 - Tax Treatment of Highly Skilled Individuals Rules",
    url: "https://legislation.mt",
  },
  {
    name: "Malta Enterprise - Highly Qualified Persons Scheme",
    url: "https://maltaenterprise.com/support/highly-qualified-persons/",
  },
];

export default function MaltaHQPPage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta 15% Expat Tax 2026: HSI Rules (Formerly HQP)"
        description="Guide to Malta's 15% flat tax for highly skilled expats under the 2026 HSI Rules, which replaced the HQP scheme."
        slug="malta-expat-tax-hqp-scheme-guide"
        datePublished="2026-01-01"
        dateModified="2026-10-21"
        sources={ARTICLE_SOURCES}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "HQP Expat Tax",
            url: `${SITE_URL}/blog/malta-expat-tax-hqp-scheme-guide`,
          },
        ]}
      />
      <main role="main" aria-label="Malta HQP Tax Scheme Guide">
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
                <span className="px-3 py-1 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-semibold rounded-full">
                  Expat Guide
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  January 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />7 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta 15% Expat Tax 2026: HSI Rules (Formerly HQP)
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                From 1 January 2026 the Highly Qualified Persons (HQP) scheme
                has been replaced by the{" "}
                <strong>Highly Skilled Individuals (HSI) Rules</strong>. The 15%
                flat rate remains, but the salary threshold, eligible employers
                and application route have changed.
              </p>
            </header>

            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl not-prose mb-10">
              <p className="text-sm">
                <strong>Updated October 2026:</strong> This guide was rewritten
                for the Tax Treatment of Highly Skilled Individuals Rules, 2026
                (Legal Notice 20 of 2026). No new HQP determinations were issued
                after 31 December 2025.
              </p>
            </div>

            <nav className="p-6 bg-muted/30 rounded-2xl mb-12 not-prose">
              <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#what-is-hqp"
                    className="text-primary hover:underline"
                  >
                    1. From HQP to HSI: What Changed?
                  </a>
                </li>
                <li>
                  <a href="#benefits" className="text-primary hover:underline">
                    2. Key Benefits
                  </a>
                </li>
                <li>
                  <a
                    href="#eligibility"
                    className="text-primary hover:underline"
                  >
                    3. Eligibility Requirements
                  </a>
                </li>
                <li>
                  <a
                    href="#qualifying-sectors"
                    className="text-primary hover:underline"
                  >
                    4. Eligible Employers & Roles
                  </a>
                </li>
                <li>
                  <a
                    href="#comparison"
                    className="text-primary hover:underline"
                  >
                    5. 15% Flat Rate vs Standard Tax Rates
                  </a>
                </li>
                <li>
                  <a
                    href="#application"
                    className="text-primary hover:underline"
                  >
                    6. How to Apply & Transition Rules
                  </a>
                </li>
              </ul>
            </nav>

            <section id="what-is-hqp">
              <h2>1. From HQP to HSI: What Changed?</h2>
              <p>
                The{" "}
                <strong>
                  Tax Treatment of Highly Skilled Individuals Rules, 2026
                </strong>{" "}
                came into force on 1 January 2026. They replace the Highly
                Qualified Persons Rules and four older sector regimes
                (innovation and creativity, aviation, maritime and offshore oil
                and gas, and senior staff of family offices and treasury
                operations) with one framework.
              </p>
              <ul>
                <li>
                  <strong>Same rate:</strong> qualifying employment income is
                  taxed at a flat <strong>15%</strong>
                </li>
                <li>
                  <strong>Lower threshold:</strong> at least
                  <strong>€65,000</strong> a year (excluding fringe benefits),
                  rising by €10,000 every five years
                </li>
                <li>
                  <strong>Wider scope:</strong> five competent authorities
                  instead of sector-by-sector schemes
                </li>
              </ul>
            </section>

            <section id="benefits" className="mt-12">
              <h2>2. Key Benefits</h2>
              <div className="grid md:grid-cols-2 gap-4 not-prose my-6">
                <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl text-center">
                  <div className="text-4xl font-bold text-primary mb-1">
                    15%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Flat tax rate on qualifying income up to €7 million a year
                  </p>
                </div>
                <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl text-center">
                  <div className="text-4xl font-bold text-primary mb-1">
                    5 + 5 + 5
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Initial 5 years, with two optional 5-year renewals
                  </p>
                </div>
              </div>
              <ul>
                <li>
                  The 15% rate is elective. No reliefs, deductions or credits
                  can be claimed against income taxed at 15%
                </li>
                <li>
                  Income above €7 million is taxed at the normal progressive
                  rates
                </li>
                <li>Normal Class 1 SSC rules still apply</li>
              </ul>
            </section>

            <section id="eligibility" className="mt-12">
              <h2>3. Eligibility Requirements</h2>
              <ul>
                <li>
                  <strong>Minimum income:</strong> qualifying employment income
                  of at least <strong>€65,000</strong> a year, which is lower
                  than the old HQP threshold
                </li>
                <li>
                  <strong>Not domiciled in Malta</strong>
                </li>
                <li>
                  <strong>Qualifications:</strong> a course of at least three
                  years, or at least five years of comparable professional
                  experience
                </li>
                <li>
                  <strong>Eligible office</strong> under a genuine employment
                  contract with a licensed or recognised employer
                </li>
                <li>
                  Stable resources, suitable accommodation, a valid travel
                  document and private health insurance for you and your family
                </li>
                <li>
                  You cannot have previously benefited under article 6 of the
                  Income Tax Act
                </li>
              </ul>
            </section>

            <section id="qualifying-sectors" className="mt-12">
              <h2>4. Eligible Employers & Roles</h2>
              <p>
                Your employer must be regulated, licensed or recognised by one
                of five competent authorities:
              </p>
              <ul>
                <li>Malta Financial Services Authority (MFSA)</li>
                <li>Malta Gaming Authority (MGA)</li>
                <li>Authority for Transport in Malta (Transport Malta)</li>
                <li>Office of the Chief Medical Officer</li>
                <li>Malta Enterprise</li>
              </ul>
              <p>
                Eligible offices are generally C-level and senior management
                roles and specialised STEM functions that fall within the
                employer&apos;s regulated activity.
              </p>
            </section>

            <section id="comparison" className="mt-12">
              <h2>5. 15% Flat Rate vs Standard Tax Rates</h2>
              <p>
                Here&apos;s how the 15% flat rate compares to the 2026 single
                tax rates at different salary levels:
              </p>

              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Annual Salary
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Standard Tax (Single, 2026)
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        HSI (15%)
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Annual Savings
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">€90,000</td>
                      <td className="border border-border p-3">€22,100</td>
                      <td className="border border-border p-3 text-primary font-semibold">
                        €13,500
                      </td>
                      <td className="border border-border p-3 font-semibold text-green-600">
                        €8,600
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">€120,000</td>
                      <td className="border border-border p-3">€32,600</td>
                      <td className="border border-border p-3 text-primary font-semibold">
                        €18,000
                      </td>
                      <td className="border border-border p-3 font-semibold text-green-600">
                        €14,600
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">€150,000</td>
                      <td className="border border-border p-3">€43,100</td>
                      <td className="border border-border p-3 text-primary font-semibold">
                        €22,500
                      </td>
                      <td className="border border-border p-3 font-semibold text-green-600">
                        €20,600
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">€200,000</td>
                      <td className="border border-border p-3">€60,600</td>
                      <td className="border border-border p-3 text-primary font-semibold">
                        €30,000
                      </td>
                      <td className="border border-border p-3 font-semibold text-green-600">
                        €30,600
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                At €200,000 a year, the 15% rate saves over €30,000 a year
                compared with the standard single rates.
              </p>
            </section>

            <section id="application" className="mt-12">
              <h2>6. How to Apply & Transition Rules</h2>
              <ul>
                <li>
                  Apply to the relevant competent authority (one of the five
                  bodies above). Processing can take up to 90 days
                </li>
                <li>
                  Applications are accepted from 1 January 2026 to 31 December
                  2035, and benefits apply to income up to 31 December 2040
                </li>
                <li>
                  <strong>Existing HQP beneficiaries</strong> must move to the
                  HSI Rules by 31 December 2028. If your old minimum income was
                  below €65,000 it stays the same in year one, rises by €10,000
                  in year two and reaches €65,000 in year three
                </li>
              </ul>
              <p>
                Because the rules are new, check the latest guidance from your
                competent authority and the Malta Tax and Customs Administration
                before you rely on the 15% rate.
              </p>
            </section>

            <BlogArticleAuthor
              datePublished="2026-01-01"
              dateModified="2026-10-21"
              sources={ARTICLE_SOURCES}
            />
            <BlogArticleFooter
              slug="malta-expat-tax-hqp-scheme-guide"
              title="Malta 15% Expat Tax 2026: HSI Rules (Formerly HQP)"
              ctaTitle="Compare Your Tax Options"
              ctaDescription="Use our Expatriate Tax Calculator to see the difference between standard tax rates and what you'd pay under the 15% HSI regime."
              ctaLink="/calculators/expatriate-tax"
              ctaLinkText="Try Expatriate Tax Calculator"
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
