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
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";
import { BlogArticleAuthor } from "@/components/blog/blog-article-author";

const LAST_UPDATED = "2026-10-21";

const ARTICLE_SOURCES = [
  {
    name: "Department of Industrial and Employment Relations (DIER) - Malta",
    url: "https://dier.gov.mt",
  },
  {
    name: "Department of Social Security - Malta",
    url: "https://socialsecurity.gov.mt",
  },
  {
    name: "Department of Social Security - Work-Life Balance (parental leave benefit)",
    url: "https://socialsecurity.gov.mt/en/work-live-balance",
  },
  {
    name: "Mondaq - New family-related leave entitlements: the 2026 reforms",
    url: "https://www.mondaq.com/employee-rights-labour-relations/1849162/new-family-related-leave-entitlements-an-overview-of-the-2026-reforms",
  },
];

const FAQS = [
  {
    question: "Is parental leave paid in Malta?",
    answer:
      "Partly. Each parent gets four months of parental leave per child, to be used before the child turns eight. The first eight weeks are non-transferable and paid by the Department of Social Security at the married Sickness Benefit rate. The remaining eight weeks are unpaid and can be transferred to the other parent.",
  },
  {
    question: "Is there miscarriage leave in Malta?",
    answer:
      "Yes. Since 1 January 2026 employees get seven working days of paid leave after a miscarriage before the 22nd week of pregnancy. The other prospective parent is also entitled. After the 22nd week, maternity leave applies instead.",
  },
  {
    question: "Do self-employed parents get parental leave benefit in Malta?",
    answer:
      "Yes. From 1 January 2026 (applied retrospectively) self-employed, adoptive and foster parents can claim four months of parental leave benefit per child before the child turns eight. The first two months are paid and non-transferable; the last two are unpaid and transferable.",
  },
];

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
  alternates: pageAlternates("/blog/malta-maternity-leave-2026-guide"),
  openGraph: {
    ...ogMetadata,
    title: "Malta Maternity Leave 2026: Complete Guide",
    url: `${SITE_URL}/blog/malta-maternity-leave-2026-guide`,
    type: "article",
    images: [getBlogOgImage("Malta Maternity Leave 2026: Complete Guide")],
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
        dateModified={LAST_UPDATED}
        sources={ARTICLE_SOURCES}
      />
      <CustomFAQJsonLd questions={FAQS} />
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
                  <Calendar className="h-4 w-4" /> Updated{" "}
                  <time dateTime={LAST_UPDATED}>October 2026</time>
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
                        Maternity Leave Benefit: €229.44/week (equal to the
                        national minimum wage, paid by DSS)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        Self-occupied mothers
                      </td>
                      <td className="border border-border p-3">
                        Maternity Benefit €229.44/week × 14 + Maternity Leave
                        Benefit €229.44/week × 4
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        No employer-paid leave
                      </td>
                      <td className="border border-border p-3">
                        Flat-rate Maternity Benefit €147.95/week × 14
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
                  <strong>4 months</strong> of parental leave per parent, per
                  child
                </li>
                <li>Must be taken before the child turns 8</li>
                <li>
                  <strong>First 8 weeks:</strong> non-transferable and paid by
                  the Department of Social Security at the married Sickness
                  Benefit rate
                </li>
                <li>
                  <strong>Last 8 weeks:</strong> unpaid and transferable to the
                  other parent
                </li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Rules from the Work-Life Balance for Parents and Carers
                Regulations (L.N. 201 of 2022).
              </p>
            </section>

            <section id="reforms-2026" className="mt-12">
              <h2>New in 2026: Additional Family Leave</h2>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">
                        Leave
                      </th>
                      <th className="border border-border p-3 text-left">
                        Entitlement
                      </th>
                      <th className="border border-border p-3 text-left">
                        From
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        Miscarriage leave
                      </td>
                      <td className="border border-border p-3">
                        7 working days paid, for a miscarriage before week 22 —
                        for both prospective parents
                      </td>
                      <td className="border border-border p-3">1 Jan 2026</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-medium">
                        Parental bereavement leave
                      </td>
                      <td className="border border-border p-3">
                        7 working days in total on the death of a child under 18
                      </td>
                      <td className="border border-border p-3">1 Jan 2026</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        Self-employed parental leave benefit
                      </td>
                      <td className="border border-border p-3">
                        4 months per child (incl. adoptive and foster parents):
                        first 2 months paid, last 2 unpaid
                      </td>
                      <td className="border border-border p-3">
                        1 Jan 2026 (retrospective)
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-medium">
                        Recognised parents of children born abroad
                      </td>
                      <td className="border border-border p-3">
                        Up to 18 weeks (14 employer-paid, 4 unpaid), shareable
                        between both parents or 9 weeks each
                      </td>
                      <td className="border border-border p-3">21 Jun 2026</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <BlogArticleAuthor
              datePublished="2026-01-01"
              dateModified={LAST_UPDATED}
              sources={ARTICLE_SOURCES}
            />
            <BlogArticleFooter
              slug="malta-maternity-leave-2026-guide"
              title="Malta Maternity Leave 2026: Complete Guide"
              ctaTitle="Calculate Maternity Benefits"
              ctaLink="/calculators/maternity"
              ctaLinkText="Try Maternity Calculator"
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
