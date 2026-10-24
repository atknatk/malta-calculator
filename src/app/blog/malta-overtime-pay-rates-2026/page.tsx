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
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { BlogComments } from "@/components/blog/blog-comments";
import { getApprovedComments } from "@/lib/blog/get-comments";
import {
  GuideTocCollapsible,
  GuideTocSidebar,
  type TocSection,
} from "@/components/guide/guide-toc";
import { GuideShare } from "@/components/guide/guide-share";
import { GuideAbout } from "@/components/guide/guide-about";
import { GuideRelated } from "@/components/guide/guide-related";
import { OvertimeQuickCheck } from "./_components/overtime-quick-check";

const SLUG = "malta-overtime-pay-rates-2026";
const TITLE = "Malta Overtime Pay 2026: Complete Guide";
const ARTICLE_URL = `${SITE_URL}/blog/${SLUG}`;

const SECTIONS: TocSection[] = [
  { id: "overview", label: "What is overtime?" },
  { id: "rates", label: "Overtime pay rates" },
  { id: "calculation", label: "Calculation example" },
  { id: "wro", label: "Wage Regulation Orders" },
  { id: "limits", label: "Working time limits" },
];

const RELATED_GUIDES = [
  {
    href: "/blog/malta-vacation-leave-entitlement-2026",
    tag: "Employment · 5 min read",
    title: "Malta Vacation Leave 2026: Complete Guide",
  },
  {
    href: "/blog/malta-notice-period-employment-guide-2026",
    tag: "Employment · 6 min read",
    title: "Malta Notice Period 2026: Complete Guide",
  },
  {
    href: "/blog/malta-part-time-employment-rights",
    tag: "Employment · 6 min read",
    title: "Malta Part-Time Employment Rights 2026",
  },
];

// Rehber gövdesi tipografisi (prose yerine tasarımın ölçüleri)
const h2Class = "font-cal text-2xl leading-[1.25] md:text-[28px]";
const pClass = "text-base leading-[1.75] md:text-[17px]";
const ulClass =
  "flex list-disc flex-col gap-2 pl-[22px] text-base leading-[1.7] md:text-[17px]";
const sectionClass = "flex scroll-mt-6 flex-col gap-3 md:gap-3.5";

const ARTICLE_SOURCES = [
  {
    name: "Department of Industrial and Employment Relations (DIER) - Malta",
    url: "https://dier.gov.mt",
  },
  {
    name: "Employment and Industrial Relations Act (EIRA) - legislation.mt",
    url: "https://legislation.mt",
  },
];

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
  alternates: pageAlternates("/blog/malta-overtime-pay-rates-2026"),
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

export default async function MaltaOvertimePayGuidePage() {
  const initialComments = await getApprovedComments(SLUG);

  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Overtime Pay 2026: Rates & Calculation Guide"
        description="Complete guide to overtime pay rates in Malta."
        slug="malta-overtime-pay-rates-2026"
        datePublished="2026-01-01"
        sources={ARTICLE_SOURCES}
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
      <div className="grid w-full items-start gap-10 pt-2 md:pt-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14 lg:pt-8">
        <article className="mx-auto flex w-full min-w-0 max-w-[740px] flex-col gap-8 md:gap-9 lg:mx-0 lg:gap-10">
          <header className="flex flex-col gap-3 md:gap-3.5">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
                <li>
                  <Link
                    href="/"
                    className="hover:text-foreground hover:underline"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-foreground hover:underline"
                  >
                    Guides
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="font-medium text-foreground">
                  Overtime Pay Guide
                </li>
              </ol>
            </nav>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground md:mt-2">
              <span className="inline-flex h-7 items-center rounded-full bg-primary/10 px-3 text-[13px] font-semibold text-primary-ink">
                Employment
              </span>
              <span>January 2026</span>
              <span aria-hidden="true">·</span>
              <span>5 min read</span>
            </div>
            <h1 className="font-cal text-[34px] leading-[1.12] tracking-[-0.02em] md:text-[42px] lg:text-[46px]">
              {TITLE}
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              Understanding overtime rates and calculations in Malta.
            </p>
            <div className="flex items-center gap-3 pt-1.5">
              <span
                aria-hidden="true"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary-ink"
              >
                <BookOpen className="h-[18px] w-[18px]" />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold">
                  Malta Calculator Editorial Team
                </span>
                <span className="text-[13px] text-muted-foreground">
                  Published 1 January 2026 · Reviewed against official sources
                </span>
              </span>
            </div>
          </header>

          <div className="lg:hidden">
            <GuideTocCollapsible sections={SECTIONS} />
          </div>

          <section id="overview" className={sectionClass}>
            <h2 className={h2Class}>What is Overtime?</h2>
            <p className={pClass}>
              Overtime in Malta refers to work performed beyond the standard{" "}
              <strong>40-hour work week</strong>. The Employment and Industrial
              Relations Act (EIRA) regulates minimum overtime compensation.
            </p>
          </section>

          <section id="rates" className={sectionClass}>
            <h2 className={h2Class}>Overtime Pay Rates</h2>
            <div className="overflow-hidden rounded-2xl border bg-card">
              <table className="w-full border-collapse text-[15px] tabular-nums md:text-base">
                <thead>
                  <tr className="bg-muted text-sm text-muted-foreground">
                    <th
                      scope="col"
                      className="px-3.5 py-3 text-left font-semibold md:px-5 md:py-3.5"
                    >
                      Type of overtime
                    </th>
                    <th
                      scope="col"
                      className="px-3.5 py-3 text-right font-semibold md:px-5 md:py-3.5"
                    >
                      Rate
                    </th>
                    <th
                      scope="col"
                      className="px-3.5 py-3 text-right font-semibold md:px-5 md:py-3.5"
                    >
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Weekday overtime", "1.5×", "150%"],
                    ["Sunday / rest day", "2.0×", "200%"],
                    ["Public holiday", "2.0×", "200%"],
                  ].map(([type, rate, percent]) => (
                    <tr key={type} className="border-t">
                      <th
                        scope="row"
                        className="px-3.5 py-3 text-left font-medium md:px-5 md:py-3.5"
                      >
                        {type}
                      </th>
                      <td className="px-3.5 py-3 text-right font-bold text-primary-ink md:px-5 md:py-3.5">
                        {rate}
                      </td>
                      <td className="px-3.5 py-3 text-right md:px-5 md:py-3.5">
                        {percent}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="calculation" className={sectionClass}>
            <h2 className={h2Class}>Calculation Example</h2>
            <div className="flex flex-col gap-3 rounded-2xl bg-muted px-5 py-5 md:px-6 md:py-[22px]">
              <h3 className="text-[17px] font-semibold">
                Hourly rate: €15 an hour
              </h3>
              <ul className="flex list-disc flex-col gap-2 pl-5 text-base leading-relaxed tabular-nums">
                <li>
                  Weekday overtime (10h): €15 × 1.5 × 10 = <strong>€225</strong>
                </li>
                <li>
                  Sunday overtime (10h): €15 × 2.0 × 10 = <strong>€300</strong>
                </li>
                <li>
                  Holiday overtime (10h): €15 × 2.0 × 10 = <strong>€300</strong>
                </li>
              </ul>
            </div>
            <OvertimeQuickCheck layout="inline" className="lg:hidden" />
          </section>

          <section id="wro" className={sectionClass}>
            <h2 className={h2Class}>Wage Regulation Orders (WROs)</h2>
            <p className={pClass}>
              Many sectors have specific <strong>Wage Regulation Orders</strong>{" "}
              that may specify different overtime rates:
            </p>
            <ul className={ulClass}>
              <li>Construction industry may have different rates</li>
              <li>Hospitality sector has specific provisions</li>
              <li>Professional offices may offer enhanced rates</li>
            </ul>
            <p className={pClass}>
              Always check your sector&apos;s WRO for specific requirements.
            </p>
          </section>

          <section id="limits" className={sectionClass}>
            <h2 className={h2Class}>Working Time Limits</h2>
            <ul className={ulClass}>
              <li>
                Maximum <strong>48 hours a week</strong> on average, including
                overtime
              </li>
              <li>Calculated over a 17-week reference period</li>
              <li>Can only be exceeded with written employee consent</li>
            </ul>
          </section>

          <section
            aria-label="Calculate your overtime pay"
            className="flex flex-col items-start gap-4 rounded-[20px] border bg-band p-[22px] md:flex-row md:items-center md:justify-between md:px-7 md:py-6 lg:px-8 lg:py-7"
          >
            <span className="flex flex-col gap-1.5">
              <span className="font-cal text-[22px] leading-[1.25] text-band-foreground lg:text-2xl">
                Calculate Your Overtime Pay
              </span>
              <span className="text-[15px] text-band-muted">
                Weekday, rest day and public holiday rates, from your hourly
                rate or salary.
              </span>
            </span>
            <Link
              href="/calculators/overtime"
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-[10px] bg-band-cta px-[22px] text-[15px] font-semibold text-band-cta-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-band-accent focus-visible:ring-offset-2 focus-visible:ring-offset-band"
            >
              Try Overtime Calculator
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>

          <GuideAbout datePublished="2026-01-01" sources={ARTICLE_SOURCES} />

          <div className="flex flex-col gap-2.5 lg:hidden">
            <span className="text-sm font-semibold">Share this article</span>
            <GuideShare url={ARTICLE_URL} title={TITLE} />
          </div>

          {/* Yorumlar: tasarımda yok, onaya kadar korunuyor */}
          <BlogComments slug={SLUG} initialComments={initialComments} />
        </article>

        <aside className="sticky top-6 hidden flex-col gap-5 lg:flex">
          <GuideTocSidebar sections={SECTIONS} />
          <OvertimeQuickCheck layout="sidebar" />
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              Share this article
            </span>
            <GuideShare url={ARTICLE_URL} title={TITLE} />
          </div>
        </aside>
      </div>

      <GuideRelated title="More employment guides" guides={RELATED_GUIDES} />
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
