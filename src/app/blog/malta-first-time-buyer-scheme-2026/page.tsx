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
    "Malta First-Time Buyer Scheme 2026: Stamp Duty & Benefits | Malta Calculator",
  description:
    "Malta first-time property buyer benefits 2026. Reduced stamp duty at 3.5%, grant eligibility, property value limits, and application requirements.",
  keywords: [
    "Malta first-time buyer",
    "Malta first property",
    "Malta stamp duty reduction",
    "Malta property grant",
  ],
  alternates: {
    canonical: `${SITE_URL}/blog/malta-first-time-buyer-scheme-2026`,
  },
  openGraph: {
    ...ogMetadata,
    title: "Malta First-Time Buyer Scheme 2026",
    url: `${SITE_URL}/blog/malta-first-time-buyer-scheme-2026`,
    type: "article",
    images: [getBlogOgImage("Malta First-Time Buyer Scheme 2026")],
  },
  twitter: { ...twitterMetadata, title: "Malta First-Time Buyer Scheme 2026" },
};

export default function MaltaFirstTimeBuyerPage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta First-Time Buyer Scheme 2026: Stamp Duty & Benefits"
        description="Complete guide to first-time property buyer benefits in Malta including reduced stamp duty."
        slug="malta-first-time-buyer-scheme-2026"
        datePublished="2026-01-01"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "First-Time Buyer",
            url: `${SITE_URL}/blog/malta-first-time-buyer-scheme-2026`,
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
                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-600 text-sm font-semibold rounded-full">
                  Property
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> January 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> 5 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta First-Time Buyer Scheme 2026
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Save thousands on your first property purchase with Malta&apos;s
                first-time buyer benefits.
              </p>
            </header>

            <section id="benefits">
              <h2>Key Benefits</h2>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3">Benefit</th>
                      <th className="border border-border p-3">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">
                        Reduced Stamp Duty
                      </td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        3.5% instead of 5%
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Stamp Duty Exemption
                      </td>
                      <td className="border border-border p-3">
                        First €200,000 exempt
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        Property Limit
                      </td>
                      <td className="border border-border p-3">
                        €200,000 value
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="savings" className="mt-12">
              <h2>Savings Example</h2>
              <div className="p-6 bg-muted/30 rounded-xl not-prose">
                <h3 className="font-semibold mb-4">Property worth €180,000</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    • Normal Stamp Duty (5%): <strong>€9,000</strong>
                  </li>
                  <li>
                    • First-Time Buyer (3.5%):{" "}
                    <strong className="text-primary">€6,300</strong>
                  </li>
                  <li>
                    • With exemption (first €200k):{" "}
                    <strong className="text-green-600">€0</strong>
                  </li>
                </ul>
              </div>
            </section>

            <section id="eligibility" className="mt-12">
              <h2>Eligibility Requirements</h2>
              <ul>
                <li>Never owned immovable property before</li>
                <li>
                  Property must be your <strong>sole ordinary residence</strong>
                </li>
                <li>Property value within limits</li>
                <li>Must reside in property for minimum period</li>
              </ul>
            </section>

            <BlogArticleFooter
              slug="malta-first-time-buyer-scheme-2026"
              title="Malta First-Time Buyer Scheme 2026"
              ctaTitle="Calculate Your Savings"
              ctaLink="/calculators/first-time-buyer"
              ctaLinkText="Try First-Time Buyer Calculator"
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
