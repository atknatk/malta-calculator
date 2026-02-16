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
    "Malta Retirement Age 2026: Complete Guide by Birth Year | Malta Calculator",
  description:
    "Malta retirement age guide for 2026. Statutory retirement age from 61 to 65 based on birth year under the Social Security Act.",
  keywords: [
    "Malta retirement age",
    "Malta pension age",
    "Malta Social Security Act",
    "Malta retirement 2026",
  ],
  alternates: { canonical: `${SITE_URL}/blog/malta-retirement-age-guide-2026` },
  openGraph: {
    ...ogMetadata,
    title: "Malta Retirement Age 2026: Complete Guide",
    url: `${SITE_URL}/blog/malta-retirement-age-guide-2026`,
    type: "article",
    images: [getBlogOgImage("Malta Retirement Age 2026: Complete Guide")],
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Retirement Age 2026: Complete Guide",
  },
};

export default function MaltaRetirementAgeGuidePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Retirement Age 2026: Complete Guide by Birth Year"
        description="Complete guide to statutory retirement age in Malta based on birth year."
        slug="malta-retirement-age-guide-2026"
        datePublished="2026-01-01"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Retirement Age Guide",
            url: `${SITE_URL}/blog/malta-retirement-age-guide-2026`,
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
                <span className="px-3 py-1 bg-purple-500/10 text-purple-600 text-sm font-semibold rounded-full">
                  Retirement
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> January 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> 5 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Retirement Age 2026: Complete Guide
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Your statutory retirement age in Malta depends on when you were
                born.
              </p>
            </header>

            <section id="overview">
              <h2>How Retirement Age Works in Malta</h2>
              <p>
                The retirement age in Malta has been gradually increasing since
                reforms in 2007. Under the{" "}
                <strong>Social Security Act (Cap. 318)</strong>, your statutory
                retirement age is determined by your year of birth.
              </p>
            </section>

            <section id="rates">
              <h2>Retirement Age by Birth Year</h2>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3">
                        Year of Birth
                      </th>
                      <th className="border border-border p-3">
                        Retirement Age
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">
                        1951 or earlier
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        61 (Male) / 60 (Female)
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">1952 - 1955</td>
                      <td className="border border-border p-3 font-semibold">
                        62
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">1956 - 1958</td>
                      <td className="border border-border p-3 font-semibold">
                        63
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">1959 - 1961</td>
                      <td className="border border-border p-3 font-semibold">
                        64
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        1962 or later
                      </td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        65
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="early-retirement" className="mt-12">
              <h2>Early Retirement Option</h2>
              <p>
                You may be eligible to retire at <strong>61 years old</strong>{" "}
                if you meet these conditions:
              </p>
              <ul>
                <li>
                  At least <strong>35 years</strong> of National Insurance
                  contributions
                </li>
                <li>Minimum of 50 weekly contributions per year</li>
                <li>
                  Not engaged in any gainful occupation until statutory
                  retirement age
                </li>
              </ul>
              <p>Early retirement may result in a reduced pension amount.</p>
            </section>

            <section id="pension-eligibility" className="mt-12">
              <h2>Pension Eligibility</h2>
              <p>To qualify for a full pension in Malta, you generally need:</p>
              <ul>
                <li>To reach your statutory retirement age</li>
                <li>Sufficient National Insurance contributions</li>
                <li>At least 10 years of paid or credited contributions</li>
              </ul>
            </section>

            <BlogArticleFooter
              slug="malta-retirement-age-guide-2026"
              title="Malta Retirement Age 2026: Complete Guide"
              ctaTitle="Find Your Retirement Age"
              ctaLink="/calculators/retirement-age"
              ctaLinkText="Try Retirement Age Calculator"
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
