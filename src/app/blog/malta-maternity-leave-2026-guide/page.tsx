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
    "Malta Maternity Leave 2026: 18 Weeks Entitlement Guide | Malta Calculator",
  description:
    "Malta maternity leave 2026 guide. 18 weeks paid leave, 10 days paternity leave, benefit calculations, and employer obligations explained.",
  keywords: [
    "Malta maternity leave 2026",
    "Malta maternity benefit",
    "Malta paternity leave",
    "Malta parental leave",
  ],
  alternates: {
    canonical: `${SITE_URL}/blog/malta-maternity-leave-2026-guide`,
  },
  openGraph: {
    ...ogMetadata,
    title: "Malta Maternity Leave 2026: Complete Guide",
    url: `${SITE_URL}/blog/malta-maternity-leave-2026-guide`,
    type: "article",
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Maternity Leave 2026: Complete Guide",
  },
};

export default function MaltaMaternityLeavePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Maternity Leave 2026: 18 Weeks Entitlement Guide"
        description="Complete guide to maternity and paternity leave entitlements in Malta for 2026."
        slug="malta-maternity-leave-2026-guide"
        datePublished="2026-01-01"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Maternity Leave 2026",
            url: `${SITE_URL}/blog/malta-maternity-leave-2026-guide`,
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
                <span className="px-3 py-1 bg-pink-500/10 text-pink-600 text-sm font-semibold rounded-full">
                  Family
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> January 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> 7 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Maternity Leave 2026: 18 Weeks Entitlement Guide
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Everything you need to know about maternity, paternity, and
                parental leave in Malta.
              </p>
            </header>

            <section id="maternity">
              <h2>Maternity Leave</h2>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">
                        Aspect
                      </th>
                      <th className="border border-border p-3 text-left">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">Duration</td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        18 weeks
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Mandatory before birth
                      </td>
                      <td className="border border-border p-3">
                        4 weeks minimum
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        First 14 weeks
                      </td>
                      <td className="border border-border p-3">
                        Full salary (employer paid)
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">Weeks 15-18</td>
                      <td className="border border-border p-3">
                        Flat-rate benefit (SSC funded)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="paternity" className="mt-12">
              <h2>Paternity Leave</h2>
              <ul>
                <li>
                  <strong>Duration:</strong> 10 working days
                </li>
                <li>
                  <strong>When:</strong> Within 6 months of birth
                </li>
                <li>
                  <strong>Pay:</strong> Full salary (employer paid)
                </li>
              </ul>
            </section>

            <section id="parental" className="mt-12">
              <h2>Parental Leave</h2>
              <p>
                In addition to maternity/paternity leave, parents are entitled
                to:
              </p>
              <ul>
                <li>
                  <strong>4 months</strong> unpaid parental leave per parent
                </li>
                <li>Can be taken until child is 8 years old</li>
                <li>1 month is non-transferable between parents</li>
              </ul>
            </section>

            <div className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-3xl border border-border/50 not-prose text-center">
              <Calculator className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-cal font-bold mb-4">
                Calculate Maternity Benefits
              </h2>
              <Link
                href="/calculators/maternity"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
              >
                Try Maternity Calculator <ArrowRight className="h-5 w-5" />
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
