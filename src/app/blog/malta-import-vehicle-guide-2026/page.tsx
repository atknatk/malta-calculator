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
import { ArrowLeft, ArrowRight, Calendar, Clock, Ship } from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";
import { BlogArticleAuthor } from "@/components/blog/blog-article-author";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Importing a Vehicle to Malta 2026: Complete Guide | Malta Calculator",
  description:
    "Malta vehicle import 2026 guide. EU and non-EU import rules, registration tax, VAT, customs duties, and step-by-step process.",
  keywords: [
    "Malta import vehicle",
    "Malta car import",
    "Malta customs vehicle",
    "Transport Malta import",
  ],
  alternates: { canonical: `${SITE_URL}/blog/malta-import-vehicle-guide-2026` },
  openGraph: {
    ...ogMetadata,
    title: "Malta Vehicle Import 2026 Guide",
    url: `${SITE_URL}/blog/malta-import-vehicle-guide-2026`,
    type: "article",
    images: [getBlogOgImage("Malta Vehicle Import 2026 Guide")],
  },
  twitter: { ...twitterMetadata, title: "Malta Vehicle Import 2026 Guide" },
};

const ARTICLE_SOURCES = [
  {
    name: "Transport Malta - Importing a Vehicle",
    url: "https://transport.gov.mt/land-transport/vehicles/importing-a-vehicle",
  },
  {
    name: "Malta Customs Department - Vehicle Importation",
    url: "https://customs.gov.mt",
  },
];

export default function ImportVehicleGuidePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Importing a Vehicle to Malta 2026: Complete Guide"
        description="Complete guide to importing a vehicle to Malta."
        slug="malta-import-vehicle-guide-2026"
        datePublished="2026-01-01"
        sources={ARTICLE_SOURCES}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Import Vehicle",
            url: `${SITE_URL}/blog/malta-import-vehicle-guide-2026`,
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
                  <Clock className="h-4 w-4" /> 9 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Importing a Vehicle to Malta 2026
              </h1>
              <p className="text-xl text-muted-foreground">
                Complete guide to importing your car.
              </p>
            </header>

            <section id="eu-imports">
              <h2>Importing from EU Countries</h2>
              <p>
                Importing a used vehicle from an EU country is straightforward:
              </p>
              <ul>
                <li>
                  <strong>No import duty</strong>
                </li>
                <li>
                  <strong>No VAT</strong> on used vehicles
                </li>
                <li>Only pay CO2-based registration tax</li>
                <li>VRT inspection required</li>
              </ul>
              <h3>Required Documents</h3>
              <ul>
                <li>Original registration document</li>
                <li>De-registration certificate from origin country</li>
                <li>Purchase invoice or contract</li>
                <li>Valid insurance</li>
                <li>COC (Certificate of Conformity) if available</li>
              </ul>
            </section>

            <section id="non-eu-imports" className="mt-12">
              <h2>Importing from Non-EU Countries</h2>
              <p>Non-EU imports incur additional costs:</p>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3">Tax/Fee</th>
                      <th className="border border-border p-3">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">Import Duty</td>
                      <td className="border border-border p-3">
                        10% of CIF value
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">VAT</td>
                      <td className="border border-border p-3">
                        18% of (CIF + duty)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        Registration Tax
                      </td>
                      <td className="border border-border p-3">CO2-based</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                <strong>CIF</strong> = Cost + Insurance + Freight (total landed
                cost)
              </p>
            </section>

            <section id="process" className="mt-12">
              <h2>Registration Process</h2>
              <ol>
                <li>Clear customs (non-EU only)</li>
                <li>Apply for vehicle valuation</li>
                <li>Pay registration tax</li>
                <li>Book and pass VRT inspection</li>
                <li>Obtain number plates</li>
                <li>Register at Transport Malta</li>
              </ol>
            </section>

            <section id="costs" className="mt-12">
              <h2>Fixed Fees</h2>
              <ul>
                <li>
                  <strong>VRT Inspection:</strong> €36
                </li>
                <li>
                  <strong>Number Plates:</strong> €35
                </li>
                <li>
                  <strong>Registration Fee:</strong> €50
                </li>
              </ul>
            </section>

            <BlogArticleAuthor
              datePublished="2026-01-01"
              sources={ARTICLE_SOURCES}
            />
            <BlogArticleFooter
              slug="malta-import-vehicle-guide-2026"
              title="Malta Vehicle Import 2026 Guide"
              ctaTitle="Calculate Import Costs"
              ctaLink="/calculators/import-vehicle"
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
