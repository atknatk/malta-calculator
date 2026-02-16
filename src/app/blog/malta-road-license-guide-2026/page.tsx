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
import { ArrowLeft, ArrowRight, Calendar, Clock, Car } from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";

export const metadata: Metadata = {
  ...defaultMetadata,
  title:
    "Malta Road License (Circulation Tax) 2026: Complete Guide | Malta Calculator",
  description:
    "Malta road license 2026 guide. Annual vehicle tax rates by engine capacity, CO2 surcharges, electric vehicle exemptions, and payment options.",
  keywords: [
    "Malta road license",
    "Malta circulation tax",
    "Malta vehicle tax",
    "Transport Malta license",
  ],
  alternates: { canonical: `${SITE_URL}/blog/malta-road-license-guide-2026` },
  openGraph: {
    ...ogMetadata,
    title: "Malta Road License 2026 Guide",
    url: `${SITE_URL}/blog/malta-road-license-guide-2026`,
    type: "article",
    images: [getBlogOgImage("Malta Road License 2026 Guide")],
  },
  twitter: { ...twitterMetadata, title: "Malta Road License 2026 Guide" },
};

export default function RoadLicenseGuidePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Road License 2026: Complete Guide"
        description="Complete guide to annual road license in Malta."
        slug="malta-road-license-guide-2026"
        datePublished="2026-01-01"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Road License",
            url: `${SITE_URL}/blog/malta-road-license-guide-2026`,
          },
        ]}
      />
      <main role="main">
        <Shell className="max-w-4xl py-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
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
                  <Clock className="h-4 w-4" /> 6 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Road License 2026
              </h1>
              <p className="text-xl text-muted-foreground">
                Annual vehicle circulation tax explained.
              </p>
            </header>

            <section id="overview">
              <h2>What is Road License?</h2>
              <p>
                Road license (circulation tax) is an annual fee to legally drive
                your vehicle on Malta&apos;s roads. Fees are based on engine
                capacity, fuel type, and CO2 emissions.
              </p>
            </section>

            <section id="rates" className="mt-12">
              <h2>Fee Rates by Engine Capacity</h2>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3">Engine (cc)</th>
                      <th className="border border-border p-3">Annual Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">Up to 1000cc</td>
                      <td className="border border-border p-3">€60</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">1001-1200cc</td>
                      <td className="border border-border p-3">€80</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">1201-1400cc</td>
                      <td className="border border-border p-3">€100</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">1401-1600cc</td>
                      <td className="border border-border p-3">€130</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">1601-1800cc</td>
                      <td className="border border-border p-3">€160</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">1801-2000cc</td>
                      <td className="border border-border p-3">€200</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">2001-2500cc</td>
                      <td className="border border-border p-3">€280</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">2501-3000cc</td>
                      <td className="border border-border p-3">€380</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">3000cc+</td>
                      <td className="border border-border p-3">€500</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="exemptions" className="mt-12">
              <h2>Exemptions & Discounts</h2>
              <ul>
                <li>
                  <strong>Electric vehicles:</strong> 100% exempt (FREE)
                </li>
                <li>
                  <strong>Plug-in hybrids:</strong> 50% discount
                </li>
                <li>
                  <strong>Hybrids:</strong> 25% discount
                </li>
                <li>
                  <strong>LPG:</strong> 15% discount
                </li>
                <li>
                  <strong>Vintage (25+ years):</strong> Flat €30/year
                </li>
              </ul>
            </section>

            <section id="payment" className="mt-12">
              <h2>Payment Options</h2>
              <ul>
                <li>Pay for 3, 6, or 12 months</li>
                <li>Online via Transport Malta website</li>
                <li>At Transport Malta offices</li>
                <li>Through authorized agents</li>
              </ul>
            </section>

            <BlogArticleFooter
              slug="malta-road-license-guide-2026"
              title="Malta Road License 2026 Guide"
              ctaTitle="Calculate Your License Fee"
              ctaLink="/calculators/road-license"
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
