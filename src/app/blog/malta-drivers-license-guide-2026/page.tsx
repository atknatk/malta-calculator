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
  CreditCard,
} from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";
import { BlogArticleAuthor } from "@/components/blog/blog-article-author";

export const metadata: Metadata = {
  ...defaultMetadata,
  title:
    "Malta Driving License 2026: Fees, Tests & Requirements | Malta Calculator",
  description:
    "Malta driving license 2026 guide. License fees, theory and practical test costs, categories, age requirements, and renewal process explained.",
  keywords: [
    "Malta driving license",
    "Malta license test",
    "Transport Malta license",
    "Malta driving test fees",
  ],
  alternates: {
    canonical: `${SITE_URL}/blog/malta-drivers-license-guide-2026`,
  },
  openGraph: {
    ...ogMetadata,
    title: "Malta Driving License 2026 Guide",
    url: `${SITE_URL}/blog/malta-drivers-license-guide-2026`,
    type: "article",
    images: [getBlogOgImage("Malta Driving License 2026 Guide")],
  },
  twitter: { ...twitterMetadata, title: "Malta Driving License 2026 Guide" },
};

const ARTICLE_SOURCES = [
  {
    name: "Transport Malta - Driving Licences",
    url: "https://transport.gov.mt/land-transport/driving-licences",
  },
];

export default function DriversLicenseGuidePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Driving License 2026: Complete Guide"
        description="Complete guide to driving license in Malta."
        slug="malta-drivers-license-guide-2026"
        datePublished="2026-01-01"
        sources={ARTICLE_SOURCES}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Driving License",
            url: `${SITE_URL}/blog/malta-drivers-license-guide-2026`,
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
                  <Clock className="h-4 w-4" /> 7 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Driving License 2026
              </h1>
              <p className="text-xl text-muted-foreground">
                Fees, tests, and requirements explained.
              </p>
            </header>

            <section id="categories">
              <h2>License Categories</h2>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3">Category</th>
                      <th className="border border-border p-3">Vehicle Type</th>
                      <th className="border border-border p-3">Min Age</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        AM
                      </td>
                      <td className="border border-border p-3">
                        Moped (up to 50cc)
                      </td>
                      <td className="border border-border p-3">16</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        A1
                      </td>
                      <td className="border border-border p-3">
                        Motorcycle up to 125cc
                      </td>
                      <td className="border border-border p-3">16</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        A2
                      </td>
                      <td className="border border-border p-3">
                        Motorcycle up to 35kW
                      </td>
                      <td className="border border-border p-3">18</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        A
                      </td>
                      <td className="border border-border p-3">
                        Full Motorcycle
                      </td>
                      <td className="border border-border p-3">24</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        B
                      </td>
                      <td className="border border-border p-3">Car</td>
                      <td className="border border-border p-3">18</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        C
                      </td>
                      <td className="border border-border p-3">Heavy Lorry</td>
                      <td className="border border-border p-3">21</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        D
                      </td>
                      <td className="border border-border p-3">Bus</td>
                      <td className="border border-border p-3">24</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="fees" className="mt-12">
              <h2>License Fees</h2>
              <ul>
                <li>
                  <strong>1 year validity:</strong> €15
                </li>
                <li>
                  <strong>5 year validity:</strong> €30
                </li>
                <li>
                  <strong>10 year validity:</strong> €45
                </li>
                <li>
                  <strong>International Permit:</strong> €23
                </li>
                <li>
                  <strong>Replacement:</strong> €25
                </li>
              </ul>
            </section>

            <section id="tests" className="mt-12">
              <h2>Test Fees</h2>
              <ul>
                <li>
                  <strong>Theory Test:</strong> €30
                </li>
                <li>
                  <strong>Practical Test (Car):</strong> €60
                </li>
                <li>
                  <strong>Practical Test (Motorcycle):</strong> €55
                </li>
                <li>
                  <strong>Practical Test (Lorry/Bus):</strong> €80-€110
                </li>
              </ul>
            </section>

            <section id="validity" className="mt-12">
              <h2>Validity by Age</h2>
              <ul>
                <li>
                  <strong>Under 65:</strong> Up to 10 years
                </li>
                <li>
                  <strong>65-70:</strong> Maximum 5 years
                </li>
                <li>
                  <strong>Over 70:</strong> Maximum 1 year (medical required)
                </li>
              </ul>
            </section>

            <BlogArticleAuthor
              datePublished="2026-01-01"
              sources={ARTICLE_SOURCES}
            />
            <BlogArticleFooter
              slug="malta-drivers-license-guide-2026"
              title="Malta Driving License 2026 Guide"
              ctaTitle="Calculate License Costs"
              ctaLink="/calculators/drivers-license"
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
