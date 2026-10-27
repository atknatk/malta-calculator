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
import { Budget2027Update } from "@/app/blog/_shared/budget-2027-update";

const ARTICLE_SOURCES = [
  {
    name: "Department of Industrial and Employment Relations (DIER) - Malta",
    url: "https://dier.gov.mt",
  },
  {
    name: "Department of Social Security - Malta",
    url: "https://socialsecurity.gov.mt",
  },
];

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Malta Minimum Wage 2026: Complete Guide | Malta Calculator",
  description:
    "Malta minimum wage 2026: €229.44/week (≈€994/month) for workers aged 18+. Age rates, how the 2026 increase was built and how it compares to average pay.",
  keywords: [
    "Malta minimum wage 2026",
    "Malta minimum salary",
    "Malta national minimum wage",
    "Malta wage rates",
  ],
  alternates: pageAlternates("/blog/malta-minimum-wage-2026-guide"),
  openGraph: {
    ...ogMetadata,
    title: "Malta Minimum Wage 2026: Complete Guide",
    url: `${SITE_URL}/blog/malta-minimum-wage-2026-guide`,
    type: "article",
    images: [getBlogOgImage("Malta Minimum Wage 2026: Complete Guide")],
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Minimum Wage 2026: Complete Guide",
  },
};

export default function MaltaMinimumWagePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Minimum Wage 2026: Complete Guide"
        description="Complete guide to Malta's National Minimum Wage for 2026. Learn about current rates, annual increases, and comparisons."
        slug="malta-minimum-wage-2026-guide"
        datePublished="2026-01-01"
        dateModified="2026-10-27"
        sources={ARTICLE_SOURCES}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Malta Minimum Wage 2026",
            url: `${SITE_URL}/blog/malta-minimum-wage-2026-guide`,
          },
        ]}
      />
      <main role="main">
        <Shell className="max-w-4xl py-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>

          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <header className="mb-12 not-prose">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-green-500/10 text-green-600 text-sm font-semibold rounded-full">
                  Salary Guide
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> January 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> 5 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Minimum Wage 2026: Complete Guide
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Everything you need to know about Malta&apos;s National Minimum
                Wage for 2026, including current rates, exemptions, and
                comparisons.
              </p>
            </header>

            <Budget2027Update
              title="Minimum wage 2027: €239.85 a week"
              items={[
                <>
                  Budget 2027 raises the minimum wage by{" "}
                  <strong>€10.41 a week</strong> (including the €6.41 COLA),
                  from €229.44 to <strong>€239.85</strong> for workers aged 18+
                </>,
                <>
                  That is about €12,472 a year; minimum-wage earners still pay
                  no income tax
                </>,
                <>
                  The Low Wage Commission will be reappointed to agree increases
                  from 2028
                </>,
              ]}
            />

            <section id="current-rates">
              <h2>2026 Minimum Wage Rates</h2>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Period
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Amount (Gross)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">Weekly</td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        €229.44
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">Monthly</td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        €994.24
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">Annual</td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        €11,930.88
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                The National Minimum Wage (NMW) in Malta is updated annually.
                For 2026, the weekly rate for full-time workers aged 18 and over
                is <strong>€229.44</strong> (up from €221.78 in 2025). The €7.66
                increase is made up of the 2026 COLA (Cost of Living Adjustment)
                of €4.66 per week plus a further €3.00 statutory increase.
                Monthly and annual figures above are based on 52 weeks (€229.44
                × 52 ÷ 12).
              </p>
              <p>
                Lower rates apply to younger workers:{" "}
                <strong>€222.66/week</strong> at age 17 and{" "}
                <strong>€219.82/week</strong> under 17.
              </p>
            </section>

            <section id="who-applies" className="mt-12">
              <h2>Who Does the Minimum Wage Apply To?</h2>
              <ul>
                <li>
                  <strong>Full-time employees</strong> - 40 hours per week
                </li>
                <li>
                  <strong>Part-time employees</strong> - Pro-rata calculation
                </li>
                <li>
                  <strong>All sectors</strong> - Unless covered by a Wage
                  Regulation Order with higher rates
                </li>
              </ul>
              <p>
                Note: Minimum wage earners also receive the statutory bonuses
                (€121.16 in March and September, €135.10 in June and December)
                on top of the weekly wage.
              </p>
            </section>

            <section id="comparison" className="mt-12">
              <h2>Comparison with Average Salary</h2>
              <div className="p-6 bg-muted/30 rounded-xl not-prose">
                <ul className="space-y-2 text-sm">
                  <li>
                    • <strong>Minimum Wage:</strong> €11,931/year
                  </li>
                  <li>
                    • <strong>Average Salary (Malta):</strong> ~€25,000/year
                  </li>
                  <li>
                    • <strong>Median Salary:</strong> ~€20,000/year
                  </li>
                </ul>
              </div>
            </section>

            <BlogArticleAuthor
              datePublished="2026-01-01"
              dateModified="2026-10-27"
              sources={ARTICLE_SOURCES}
            />
            <BlogArticleFooter
              slug="malta-minimum-wage-2026-guide"
              title="Malta Minimum Wage 2026: Complete Guide"
              ctaTitle="Calculate Your Net Salary"
              ctaDescription="See how much you take home after tax and SSC deductions."
              ctaLinkText="Try Salary Calculator"
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
