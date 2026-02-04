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
} from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Malta Minimum Wage 2026: Complete Guide | Malta Calculator",
  description:
    "Malta minimum wage 2026 guide. Current rates at €213.54/week (€928.70/month). Learn about the National Minimum Wage, annual increases, and how it compares to average salaries.",
  keywords: [
    "Malta minimum wage 2026",
    "Malta minimum salary",
    "Malta national minimum wage",
    "Malta wage rates",
  ],
  alternates: { canonical: `${SITE_URL}/blog/malta-minimum-wage-2026-guide` },
  openGraph: {
    ...ogMetadata,
    title: "Malta Minimum Wage 2026: Complete Guide",
    url: `${SITE_URL}/blog/malta-minimum-wage-2026-guide`,
    type: "article",
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
                        €213.54
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">Monthly</td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        €928.70
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">Annual</td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        €11,104.08
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                The National Minimum Wage (NMW) in Malta is updated annually.
                For 2026, the weekly rate is <strong>€213.54</strong>, which
                includes the COLA (Cost of Living Adjustment) of €10.36 per
                week.
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
                Note: Employees under 17 or in their first 6 months of
                employment may receive 95% of the minimum wage.
              </p>
            </section>

            <section id="comparison" className="mt-12">
              <h2>Comparison with Average Salary</h2>
              <div className="p-6 bg-muted/30 rounded-xl not-prose">
                <ul className="space-y-2 text-sm">
                  <li>
                    • <strong>Minimum Wage:</strong> €11,104/year
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

            <div className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-3xl border border-border/50 not-prose text-center">
              <Calculator className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-cal font-bold mb-4">
                Calculate Your Net Salary
              </h2>
              <p className="text-muted-foreground mb-6">
                See how much you take home after tax and SSC deductions.
              </p>
              <Link
                href="/salary"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
              >
                Try Salary Calculator <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
