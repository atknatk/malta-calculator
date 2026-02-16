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
    "Malta Stamp Duty 2026: Complete Guide to Property Tax | Malta Calculator",
  description:
    "Malta stamp duty 2026 complete guide. 5% standard rate, 3.5% first-time buyer, exemptions, AIP considerations, and calculation examples.",
  keywords: [
    "Malta stamp duty",
    "Malta property tax",
    "Malta 5% stamp duty",
    "Malta AIP stamp duty",
  ],
  alternates: {
    canonical: `${SITE_URL}/blog/malta-stamp-duty-complete-guide-2026`,
  },
  openGraph: {
    ...ogMetadata,
    title: "Malta Stamp Duty 2026: Complete Guide",
    url: `${SITE_URL}/blog/malta-stamp-duty-complete-guide-2026`,
    type: "article",
    images: [getBlogOgImage("Malta Stamp Duty 2026: Complete Guide")],
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Stamp Duty 2026: Complete Guide",
  },
};

export default function MaltaStampDutyGuidePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Stamp Duty 2026: Complete Guide to Property Tax"
        description="Complete guide to stamp duty on property purchases in Malta."
        slug="malta-stamp-duty-complete-guide-2026"
        datePublished="2026-01-01"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Stamp Duty Guide",
            url: `${SITE_URL}/blog/malta-stamp-duty-complete-guide-2026`,
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
                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 text-sm font-semibold rounded-full">
                  Property
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> January 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> 7 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Stamp Duty 2026: Complete Guide
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Everything you need to know about stamp duty when buying
                property in Malta.
              </p>
            </header>

            <section id="rates">
              <h2>Stamp Duty Rates</h2>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3">Category</th>
                      <th className="border border-border p-3">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">
                        Standard Rate
                      </td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        5%
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        First-Time Buyer
                      </td>
                      <td className="border border-border p-3 font-semibold text-green-600">
                        3.5%
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        Gozo Properties
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        2% reduction
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Heritage Buildings (UCA)
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        2.5%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="calculation" className="mt-12">
              <h2>Calculation Example</h2>
              <div className="p-6 bg-muted/30 rounded-xl not-prose">
                <h3 className="font-semibold mb-4">Property: €350,000</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    • Standard (5%): <strong>€17,500</strong>
                  </li>
                  <li>
                    • First-Time Buyer (3.5%):{" "}
                    <strong className="text-primary">€12,250</strong>
                  </li>
                  <li>
                    • <strong>Savings:</strong>{" "}
                    <span className="text-green-600 font-semibold">€5,250</span>
                  </li>
                </ul>
              </div>
            </section>

            <section id="who-pays" className="mt-12">
              <h2>Who Pays Stamp Duty?</h2>
              <p>
                In Malta, stamp duty is traditionally paid by the{" "}
                <strong>buyer</strong>. It is due upon signing the final deed
                (konvenju finali) at the notary.
              </p>
            </section>

            <section id="aip" className="mt-12">
              <h2>AIP (Acquisition of Immovable Property)</h2>
              <p>
                Non-EU nationals may need an AIP permit to purchase property in
                Malta. Additional considerations apply:
              </p>
              <ul>
                <li>Permit fee of approximately €233</li>
                <li>Minimum property values may apply</li>
                <li>Processing time: 2-3 months</li>
              </ul>
            </section>

            <BlogArticleFooter
              slug="malta-stamp-duty-complete-guide-2026"
              title="Malta Stamp Duty 2026: Complete Guide"
              ctaTitle="Calculate Stamp Duty"
              ctaLink="/calculators/stamp-duty"
              ctaLinkText="Try Stamp Duty Calculator"
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
