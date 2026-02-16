import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
  getBlogOgImage,
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

export const metadata: Metadata = {
  ...defaultMetadata,
  title:
    "Malta Overtime Pay 2026: Rates & Calculation Guide | Malta Calculator",
  description:
    "Malta overtime pay guide for 2026. 1.5x rate for weekdays, 2x rate for Sundays and public holidays under employment law.",
  keywords: [
    "Malta overtime pay",
    "Malta overtime rates",
    "Malta 1.5x overtime",
    "Malta weekend overtime",
  ],
  alternates: { canonical: `${SITE_URL}/blog/malta-overtime-pay-rates-2026` },
  openGraph: {
    ...ogMetadata,
    title: "Malta Overtime Pay 2026: Complete Guide",
    url: `${SITE_URL}/blog/malta-overtime-pay-rates-2026`,
    type: "article",
    images: [getBlogOgImage("Malta Overtime Pay 2026: Complete Guide")],
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Overtime Pay 2026: Complete Guide",
  },
};

export default function MaltaOvertimePayGuidePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Overtime Pay 2026: Rates & Calculation Guide"
        description="Complete guide to overtime pay rates in Malta."
        slug="malta-overtime-pay-rates-2026"
        datePublished="2026-01-01"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Overtime Pay Guide",
            url: `${SITE_URL}/blog/malta-overtime-pay-rates-2026`,
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
                <span className="px-3 py-1 bg-orange-500/10 text-orange-600 text-sm font-semibold rounded-full">
                  Employment
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> January 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> 5 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Overtime Pay 2026: Complete Guide
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Understanding overtime rates and calculations in Malta.
              </p>
            </header>

            <section id="overview">
              <h2>What is Overtime?</h2>
              <p>
                Overtime in Malta refers to work performed beyond the standard{" "}
                <strong>40-hour work week</strong>. The Employment and
                Industrial Relations Act (EIRA) regulates minimum overtime
                compensation.
              </p>
            </section>

            <section id="rates">
              <h2>Overtime Pay Rates</h2>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3">
                        Type of Overtime
                      </th>
                      <th className="border border-border p-3">Rate</th>
                      <th className="border border-border p-3">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">
                        Weekday Overtime
                      </td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        1.5×
                      </td>
                      <td className="border border-border p-3">150%</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Sunday / Rest Day
                      </td>
                      <td className="border border-border p-3 font-semibold text-green-600">
                        2.0×
                      </td>
                      <td className="border border-border p-3">200%</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        Public Holiday
                      </td>
                      <td className="border border-border p-3 font-semibold text-green-600">
                        2.0×
                      </td>
                      <td className="border border-border p-3">200%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="calculation" className="mt-12">
              <h2>Calculation Example</h2>
              <div className="p-6 bg-muted/30 rounded-xl not-prose">
                <h3 className="font-semibold mb-4">Hourly Rate: €15/hour</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    • Weekday overtime (10h): €15 × 1.5 × 10 ={" "}
                    <strong>€225</strong>
                  </li>
                  <li>
                    • Sunday overtime (10h): €15 × 2.0 × 10 ={" "}
                    <strong className="text-primary">€300</strong>
                  </li>
                  <li>
                    • Holiday overtime (10h): €15 × 2.0 × 10 ={" "}
                    <strong className="text-primary">€300</strong>
                  </li>
                </ul>
              </div>
            </section>

            <section id="wro" className="mt-12">
              <h2>Wage Regulation Orders (WROs)</h2>
              <p>
                Many sectors have specific{" "}
                <strong>Wage Regulation Orders</strong> that may specify
                different overtime rates:
              </p>
              <ul>
                <li>Construction industry may have different rates</li>
                <li>Hospitality sector has specific provisions</li>
                <li>Professional offices may offer enhanced rates</li>
              </ul>
              <p>
                Always check your sector&apos;s WRO for specific requirements.
              </p>
            </section>

            <section id="limits" className="mt-12">
              <h2>Working Time Limits</h2>
              <ul>
                <li>
                  Maximum <strong>48 hours/week</strong> average (including
                  overtime)
                </li>
                <li>Calculated over a 17-week reference period</li>
                <li>Can only be exceeded with written employee consent</li>
              </ul>
            </section>

            <BlogArticleFooter
              slug="malta-overtime-pay-rates-2026"
              title="Malta Overtime Pay 2026: Complete Guide"
              ctaTitle="Calculate Your Overtime Pay"
              ctaLink="/calculators/overtime"
              ctaLinkText="Try Overtime Calculator"
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
