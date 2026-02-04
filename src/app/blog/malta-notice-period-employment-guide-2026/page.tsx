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
  title:
    "Malta Notice Period 2026: Complete Employment Guide | Malta Calculator",
  description:
    "Malta notice period guide for 2026. Learn the required notice periods from 1-12 weeks based on years of service under the Employment and Industrial Relations Act.",
  keywords: [
    "Malta notice period",
    "Malta employment termination",
    "Malta resignation notice",
    "EIRA Malta",
  ],
  alternates: {
    canonical: `${SITE_URL}/blog/malta-notice-period-employment-guide-2026`,
  },
  openGraph: {
    ...ogMetadata,
    title: "Malta Notice Period 2026: Complete Guide",
    url: `${SITE_URL}/blog/malta-notice-period-employment-guide-2026`,
    type: "article",
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Notice Period 2026: Complete Guide",
  },
};

export default function MaltaNoticePeriodGuidePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Notice Period 2026: Complete Employment Guide"
        description="Complete guide to notice periods under Malta employment law."
        slug="malta-notice-period-employment-guide-2026"
        datePublished="2026-01-01"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Notice Period Guide",
            url: `${SITE_URL}/blog/malta-notice-period-employment-guide-2026`,
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
                <span className="px-3 py-1 bg-blue-500/10 text-blue-600 text-sm font-semibold rounded-full">
                  Employment
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> January 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> 6 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Notice Period 2026: Complete Guide
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Understanding your rights and obligations when terminating
                employment in Malta.
              </p>
            </header>

            <section id="overview">
              <h2>What is a Notice Period?</h2>
              <p>
                A notice period is the time between when you announce your
                intention to leave a job and your actual last day. In Malta,
                notice periods are regulated by the{" "}
                <strong>Employment and Industrial Relations Act (EIRA)</strong>,
                specifically Article 36(5).
              </p>
            </section>

            <section id="rates">
              <h2>Notice Period Requirements</h2>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3">
                        Length of Service
                      </th>
                      <th className="border border-border p-3">
                        Minimum Notice
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">
                        Less than 1 month (Probation)
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        No notice required
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        1 to 6 months
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        1 week
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        6 months to 2 years
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        2 weeks
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">2 to 4 years</td>
                      <td className="border border-border p-3 font-semibold">
                        4 weeks
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">4 to 7 years</td>
                      <td className="border border-border p-3 font-semibold">
                        8 weeks
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">7 to 8 years</td>
                      <td className="border border-border p-3 font-semibold">
                        9 weeks
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">8 to 9 years</td>
                      <td className="border border-border p-3 font-semibold">
                        10 weeks
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        9 to 10 years
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        11 weeks
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        More than 10 years
                      </td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        12 weeks
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="probation" className="mt-12">
              <h2>Probation Period</h2>
              <p>During the probation period, special rules apply:</p>
              <ul>
                <li>
                  If employed <strong>less than 1 month</strong>: No notice
                  required
                </li>
                <li>
                  If employed <strong>more than 1 month</strong>: 1 week notice
                  applies
                </li>
                <li>Standard probation period is typically 6 months</li>
              </ul>
            </section>

            <section id="important-notes" className="mt-12">
              <h2>Important Considerations</h2>
              <ul>
                <li>
                  <strong>Notice starts</strong> the working day after it is
                  given
                </li>
                <li>Notice must be given in writing for best practice</li>
                <li>
                  Managerial positions may have longer contractual notice
                  periods
                </li>
                <li>
                  Payment in lieu of notice is permitted by mutual agreement
                </li>
              </ul>
            </section>

            <div className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-3xl border border-border/50 not-prose text-center">
              <Calculator className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-cal font-bold mb-4">
                Calculate Your Notice Period
              </h2>
              <Link
                href="/calculators/notice-period"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
              >
                Try Notice Period Calculator <ArrowRight className="h-5 w-5" />
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
