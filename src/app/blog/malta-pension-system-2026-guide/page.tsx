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
  title: "Malta Pension System 2026: State Pension Guide | Malta Calculator",
  description:
    "Malta pension system 2026 explained. State pension eligibility, contribution requirements, two-thirds pension, minimum pension rates, and retirement age.",
  keywords: [
    "Malta pension",
    "Malta state pension",
    "Malta retirement",
    "Malta pension age",
    "Malta two-thirds pension",
  ],
  alternates: { canonical: `${SITE_URL}/blog/malta-pension-system-2026-guide` },
  openGraph: {
    ...ogMetadata,
    title: "Malta Pension System 2026: Complete Guide",
    url: `${SITE_URL}/blog/malta-pension-system-2026-guide`,
    type: "article",
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Pension System 2026: Complete Guide",
  },
};

export default function MaltaPensionSystemPage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Pension System 2026: State Pension Guide"
        description="Complete guide to Malta's state pension system, eligibility, and contribution requirements."
        slug="malta-pension-system-2026-guide"
        datePublished="2026-01-01"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Pension System",
            url: `${SITE_URL}/blog/malta-pension-system-2026-guide`,
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
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-sm font-semibold rounded-full">
                  Retirement
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> January 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> 8 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Pension System 2026: State Pension Guide
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Understanding Malta&apos;s state pension system and how to
                maximize your retirement benefits.
              </p>
            </header>

            <section id="types">
              <h2>Types of State Pension</h2>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3">Type</th>
                      <th className="border border-border p-3">Requirement</th>
                      <th className="border border-border p-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Two-Thirds Pension
                      </td>
                      <td className="border border-border p-3">
                        Full contribution history
                      </td>
                      <td className="border border-border p-3 text-primary">
                        ~67% of best 3-year average
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        National Minimum Pension
                      </td>
                      <td className="border border-border p-3">
                        Minimum contributions
                      </td>
                      <td className="border border-border p-3">
                        ~€160/week (2026)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="retirement-age" className="mt-12">
              <h2>Retirement Age</h2>
              <p>Retirement age in Malta depends on your year of birth:</p>
              <ul>
                <li>
                  Born before 1952: <strong>61 years</strong>
                </li>
                <li>
                  Born 1952-1955: <strong>62 years</strong>
                </li>
                <li>
                  Born 1956-1958: <strong>63 years</strong>
                </li>
                <li>
                  Born 1959-1961: <strong>64 years</strong>
                </li>
                <li>
                  Born 1962 onwards: <strong>65 years</strong>
                </li>
              </ul>
            </section>

            <section id="contributions" className="mt-12">
              <h2>Contribution Requirements</h2>
              <p>To qualify for the full two-thirds pension, you need:</p>
              <ul>
                <li>
                  <strong>Minimum 10 years</strong> of paid/credited
                  contributions
                </li>
                <li>
                  <strong>Yearly average</strong> of at least 15 contributions
                </li>
                <li>
                  Contributions from employment, self-employment, or credits
                </li>
              </ul>
            </section>

            <section id="calculation" className="mt-12">
              <h2>How Pension is Calculated</h2>
              <p>The two-thirds pension is based on:</p>
              <ul>
                <li>
                  Average of your <strong>best 3 consecutive years</strong> of
                  earnings
                </li>
                <li>
                  Subject to a <strong>maximum pensionable income</strong> cap
                </li>
                <li>Pro-rata reduction for incomplete contribution years</li>
              </ul>
            </section>

            <div className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-3xl border border-border/50 not-prose text-center">
              <Calculator className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-cal font-bold mb-4">
                Plan Your Retirement
              </h2>
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
