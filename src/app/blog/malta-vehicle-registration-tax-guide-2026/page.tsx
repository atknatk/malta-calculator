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
import { ArrowLeft, ArrowRight, Calendar, Clock, Car } from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";
import { BlogArticleAuthor } from "@/components/blog/blog-article-author";

export const metadata: Metadata = {
  ...defaultMetadata,
  title:
    "Malta Vehicle Registration Tax 2026: Complete Guide | Malta Calculator",
  description:
    "Malta vehicle registration tax 2026 guide. CO2-based tax rates, electric vehicle exemptions, age depreciation, and EU/non-EU import rules explained.",
  keywords: [
    "Malta vehicle registration tax",
    "Malta CO2 tax",
    "Malta car import tax",
    "Transport Malta registration",
  ],
  alternates: pageAlternates("/blog/malta-vehicle-registration-tax-guide-2026"),
  openGraph: {
    ...ogMetadata,
    title: "Malta Vehicle Registration Tax 2026 Guide",
    url: `${SITE_URL}/blog/malta-vehicle-registration-tax-guide-2026`,
    type: "article",
    images: [getBlogOgImage("Malta Vehicle Registration Tax 2026 Guide")],
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Vehicle Registration Tax 2026 Guide",
  },
};

const ARTICLE_SOURCES = [
  {
    name: "Transport Malta - Vehicle Registration Tax",
    url: "https://transport.gov.mt/land-transport/vehicles/vehicle-registration-tax",
  },
  {
    name: "Malta Commissioner for Revenue (CFR) - Vehicle Registration Tax",
    url: "https://cfr.gov.mt/en/customs/Pages/VehicleRegistrationTax.aspx",
  },
];

export default function VehicleRegistrationTaxGuidePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Vehicle Registration Tax 2026: Complete Guide"
        description="Complete guide to vehicle registration tax in Malta."
        slug="malta-vehicle-registration-tax-guide-2026"
        datePublished="2026-01-01"
        sources={ARTICLE_SOURCES}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Vehicle Registration Tax",
            url: `${SITE_URL}/blog/malta-vehicle-registration-tax-guide-2026`,
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
                <span className="px-3 py-1 bg-slate-500/10 text-slate-600 text-sm font-semibold rounded-full">
                  Transport
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> January 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> 8 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Vehicle Registration Tax 2026
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Everything you need to know about registering a vehicle in
                Malta.
              </p>
            </header>

            <section id="overview">
              <h2>How Registration Tax Works</h2>
              <p>
                Malta&apos;s vehicle registration tax is primarily based on{" "}
                <strong>CO2 emissions</strong>. The higher the emissions, the
                more tax you pay. This system encourages eco-friendly vehicle
                choices.
              </p>
            </section>

            <section id="co2-rates" className="mt-12">
              <h2>CO2 Tax Bands (2026)</h2>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3">CO2 (g/km)</th>
                      <th className="border border-border p-3">
                        Rate (€ per g/km)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">0 (Electric)</td>
                      <td className="border border-border p-3 text-green-600 font-semibold">
                        €0 (Exempt)
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">1-50</td>
                      <td className="border border-border p-3">€0</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">51-100</td>
                      <td className="border border-border p-3">€8</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">101-130</td>
                      <td className="border border-border p-3">€15</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">131-150</td>
                      <td className="border border-border p-3">€25</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">151-170</td>
                      <td className="border border-border p-3">€40</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">171-200</td>
                      <td className="border border-border p-3">€60</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">201-250</td>
                      <td className="border border-border p-3">€100</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">250+</td>
                      <td className="border border-border p-3 text-red-600 font-semibold">
                        €150
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="discounts" className="mt-12">
              <h2>Discounts & Exemptions</h2>
              <h3>Age Depreciation</h3>
              <p>Used vehicles receive tax discounts based on age:</p>
              <ul>
                <li>1 year old: 10% discount</li>
                <li>3 years old: 25% discount</li>
                <li>5 years old: 36% discount</li>
                <li>10+ years old: 52% discount</li>
              </ul>
              <h3>Eco Vehicle Discounts</h3>
              <ul>
                <li>
                  <strong>Electric:</strong> 100% exempt from CO2 tax
                </li>
                <li>
                  <strong>Plug-in Hybrid:</strong> 75% discount
                </li>
                <li>
                  <strong>Hybrid:</strong> 25% discount
                </li>
              </ul>
            </section>

            <section id="imports" className="mt-12">
              <h2>Importing a Vehicle</h2>
              <h3>From EU Countries</h3>
              <p>
                Used vehicles from EU: No import duty, no VAT. Only registration
                tax applies.
              </p>
              <h3>From Non-EU Countries</h3>
              <ul>
                <li>10% import duty on vehicle value</li>
                <li>18% VAT on (value + duty)</li>
                <li>Registration tax based on CO2</li>
              </ul>
            </section>

            <BlogArticleAuthor
              datePublished="2026-01-01"
              sources={ARTICLE_SOURCES}
            />
            <BlogArticleFooter
              slug="malta-vehicle-registration-tax-guide-2026"
              title="Malta Vehicle Registration Tax 2026 Guide"
              ctaTitle="Calculate Your Tax"
              ctaLink="/calculators/vehicle-registration-tax"
              ctaLinkText="Try Calculator"
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
