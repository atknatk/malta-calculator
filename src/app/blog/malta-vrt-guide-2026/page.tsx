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
  ClipboardCheck,
} from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";
import { BlogArticleAuthor } from "@/components/blog/blog-article-author";

export const metadata: Metadata = {
  ...defaultMetadata,
  title:
    "Malta VRT (MOT) 2026: Vehicle Roadworthiness Test Guide | Malta Calculator",
  description:
    "Malta VRT 2026 guide. Vehicle roadworthiness test fees, frequency, requirements, and what to expect during inspection.",
  keywords: [
    "Malta VRT",
    "Malta MOT",
    "Malta vehicle test",
    "Transport Malta inspection",
  ],
  alternates: pageAlternates("/blog/malta-vrt-guide-2026"),
  openGraph: {
    ...ogMetadata,
    title: "Malta VRT 2026 Guide",
    url: `${SITE_URL}/blog/malta-vrt-guide-2026`,
    type: "article",
    images: [getBlogOgImage("Malta VRT 2026 Guide")],
  },
  twitter: { ...twitterMetadata, title: "Malta VRT 2026 Guide" },
};

const ARTICLE_SOURCES = [
  {
    name: "Transport Malta - Vehicle Roadworthiness Test (VRT)",
    url: "https://transport.gov.mt/land-transport/vehicles/vehicle-technical-inspection",
  },
];

export default function VRTGuidePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta VRT 2026: Complete Guide"
        description="Complete guide to vehicle roadworthiness test in Malta."
        slug="malta-vrt-guide-2026"
        datePublished="2026-01-01"
        sources={ARTICLE_SOURCES}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          { name: "VRT Guide", url: `${SITE_URL}/blog/malta-vrt-guide-2026` },
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
                  <Clock className="h-4 w-4" /> 5 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta VRT (MOT) 2026
              </h1>
              <p className="text-xl text-muted-foreground">
                Vehicle roadworthiness test requirements.
              </p>
            </header>

            <section id="what-is-vrt">
              <h2>What is VRT?</h2>
              <p>
                VRT (Vehicle Roadworthiness Test) is Malta&apos;s equivalent of
                the UK MOT. It ensures vehicles meet safety and environmental
                standards for road use.
              </p>
            </section>

            <section id="fees" className="mt-12">
              <h2>Test Fees</h2>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3">Vehicle Type</th>
                      <th className="border border-border p-3">Test Fee</th>
                      <th className="border border-border p-3">Re-test</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">Private Car</td>
                      <td className="border border-border p-3">€36</td>
                      <td className="border border-border p-3">€18</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">Motorcycle</td>
                      <td className="border border-border p-3">€25</td>
                      <td className="border border-border p-3">€12</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        Light Commercial
                      </td>
                      <td className="border border-border p-3">€42</td>
                      <td className="border border-border p-3">€21</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Heavy Commercial
                      </td>
                      <td className="border border-border p-3">€58</td>
                      <td className="border border-border p-3">€29</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">Bus</td>
                      <td className="border border-border p-3">€65</td>
                      <td className="border border-border p-3">€32</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">Trailer</td>
                      <td className="border border-border p-3">€30</td>
                      <td className="border border-border p-3">€15</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="frequency" className="mt-12">
              <h2>Test Frequency</h2>
              <ul>
                <li>
                  <strong>Cars/Motorcycles (0-4 years):</strong> No test
                  required
                </li>
                <li>
                  <strong>Cars/Motorcycles (4-10 years):</strong> Every 2 years
                </li>
                <li>
                  <strong>Cars/Motorcycles (10+ years):</strong> Annual
                </li>
                <li>
                  <strong>Commercial vehicles:</strong> Annual from first year
                </li>
                <li>
                  <strong>Buses:</strong> Every 6 months
                </li>
              </ul>
            </section>

            <section id="checklist" className="mt-12">
              <h2>What to Bring</h2>
              <ul>
                <li>Vehicle registration document (log book)</li>
                <li>Valid insurance certificate</li>
                <li>Photo ID</li>
                <li>Appointment confirmation</li>
              </ul>
            </section>

            <BlogArticleAuthor
              datePublished="2026-01-01"
              sources={ARTICLE_SOURCES}
            />
            <BlogArticleFooter
              slug="malta-vrt-guide-2026"
              title="Malta VRT 2026 Guide"
              ctaTitle="Calculate VRT Fees"
              ctaLink="/calculators/vrt"
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
