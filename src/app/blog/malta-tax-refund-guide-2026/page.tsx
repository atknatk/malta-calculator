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

const ARTICLE_SOURCES = [
  {
    name: "Commissioner for Revenue (CFR) - Income Tax Returns",
    url: "https://cfr.gov.mt/en/individuals/Pages/Income-Tax-Returns.aspx",
  },
  {
    name: "Malta Tax Compliance Authority (MTCA)",
    url: "https://mtca.gov.mt",
  },
];

export const metadata: Metadata = {
  ...defaultMetadata,
  title:
    "Malta Tax Refund 2026: How to Claim Back Overpaid Tax | Malta Calculator",
  description:
    "Malta tax refund guide 2026. Learn how to claim back overpaid income tax, FS3/FS7 forms, online submission process, and expected refund timelines.",
  keywords: [
    "Malta tax refund",
    "Malta overpaid tax",
    "Malta IRD refund",
    "Malta FS3 form",
    "Malta tax return",
  ],
  alternates: pageAlternates("/blog/malta-tax-refund-guide-2026"),
  openGraph: {
    ...ogMetadata,
    title: "Malta Tax Refund 2026: How to Claim Back",
    url: `${SITE_URL}/blog/malta-tax-refund-guide-2026`,
    type: "article",
    images: [getBlogOgImage("Malta Tax Refund 2026: How to Claim Back")],
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Tax Refund 2026: How to Claim Back",
  },
};

export default function MaltaTaxRefundPage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Tax Refund 2026: How to Claim Back Overpaid Tax"
        description="Complete guide to claiming tax refunds in Malta including FS3 forms and IRD process."
        slug="malta-tax-refund-guide-2026"
        datePublished="2026-01-01"
        sources={ARTICLE_SOURCES}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Tax Refund Guide",
            url: `${SITE_URL}/blog/malta-tax-refund-guide-2026`,
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
                  Tax Guide
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> January 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> 6 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Tax Refund 2026: How to Claim Back Overpaid Tax
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Overpaid tax in Malta? Here&apos;s how to claim your refund from
                the Inland Revenue Department.
              </p>
            </header>

            <section id="when-refund">
              <h2>When Can You Claim a Tax Refund?</h2>
              <p>You may be entitled to a tax refund if:</p>
              <ul>
                <li>Your employer deducted too much tax (FSS basis)</li>
                <li>You worked part of the year and overpaid</li>
                <li>You have deductible expenses not accounted for</li>
                <li>Your marriage status changed during the year</li>
                <li>You&apos;re entitled to tax credits not applied</li>
              </ul>
            </section>

            <section id="process" className="mt-12">
              <h2>How to Claim Your Refund</h2>
              <ol>
                <li>
                  <strong>Collect your FS3</strong> - Your employer provides
                  this by end of February
                </li>
                <li>
                  <strong>File online</strong> - Use the IRD CFR portal at
                  cfr.gov.mt
                </li>
                <li>
                  <strong>Submit by June 30</strong> - Deadline for previous
                  year returns
                </li>
                <li>
                  <strong>Wait for assessment</strong> - IRD will review and
                  issue refund
                </li>
              </ol>
            </section>

            <section id="timeline" className="mt-12">
              <h2>Refund Timeline</h2>
              <div className="p-6 bg-muted/30 rounded-xl not-prose">
                <ul className="space-y-2 text-sm">
                  <li>
                    • <strong>FS3 received:</strong> By end of February
                  </li>
                  <li>
                    • <strong>Filing deadline:</strong> June 30
                  </li>
                  <li>
                    • <strong>Processing time:</strong> 2-6 months typically
                  </li>
                  <li>
                    • <strong>Refund method:</strong> Direct bank transfer
                  </li>
                </ul>
              </div>
            </section>

            <BlogArticleAuthor
              datePublished="2026-01-01"
              sources={ARTICLE_SOURCES}
            />
            <BlogArticleFooter
              slug="malta-tax-refund-guide-2026"
              title="Malta Tax Refund 2026: How to Claim Back"
              ctaTitle="Check Your Tax Liability"
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
