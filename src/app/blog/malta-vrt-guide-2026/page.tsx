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
    "Malta VRT 2026: Vehicle Roadworthiness Test maximum fees (car €30.27), test intervals, the 90-day rule before road licence renewal and rules for imported cars.",
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
                In this guide, VRT means the{" "}
                <strong>Vehicle Roadworthiness Test</strong>, Malta&apos;s
                equivalent of the UK MOT. It is not the vehicle registration
                tax, which is a separate one-off tax paid when a car is first
                registered in Malta. The roadworthiness test checks that a
                vehicle meets safety and environmental standards, and it is
                carried out at testing stations licensed by Transport Malta
                under Subsidiary Legislation 65.15.
              </p>
            </section>

            <section id="fees" className="mt-12">
              <h2>Test Fees</h2>
              <p>
                S.L. 65.15 (Eighth Schedule) sets the <strong>maximum</strong>{" "}
                fees a testing station may charge, including VAT, in force since
                1 January 2023. Stations may charge less, so prices vary. A
                re-test may cost no more than 50% of the full fee.
              </p>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3">Vehicle Type</th>
                      <th className="border border-border p-3">
                        Maximum Test Fee
                      </th>
                      <th className="border border-border p-3">
                        Re-test (max 50%)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">
                        Private car / taxi / hire car (M1)
                      </td>
                      <td className="border border-border p-3">€30.27</td>
                      <td className="border border-border p-3">up to €15.14</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Motorcycle (Category VII)
                      </td>
                      <td className="border border-border p-3">€24.33</td>
                      <td className="border border-border p-3">up to €12.17</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        Light goods vehicle / van (N1)
                      </td>
                      <td className="border border-border p-3">€41.32</td>
                      <td className="border border-border p-3">up to €20.66</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Heavy goods vehicle (N2/N3)
                      </td>
                      <td className="border border-border p-3">€46.10</td>
                      <td className="border border-border p-3">up to €23.05</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        Bus (M2/M3) up to 3.5 t
                      </td>
                      <td className="border border-border p-3">€41.32</td>
                      <td className="border border-border p-3">up to €20.66</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Bus (M2/M3) over 3.5 t
                      </td>
                      <td className="border border-border p-3">€46.10</td>
                      <td className="border border-border p-3">up to €23.05</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        Trailer up to 3.5 t
                      </td>
                      <td className="border border-border p-3">€41.32</td>
                      <td className="border border-border p-3">up to €20.66</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Trailer over 3.5 t
                      </td>
                      <td className="border border-border p-3">€46.10</td>
                      <td className="border border-border p-3">up to €23.05</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="frequency" className="mt-12">
              <h2>Test Frequency</h2>
              <p>Test intervals are counted from first registration:</p>
              <ul>
                <li>
                  <strong>Private cars and hire cars (M1):</strong> first test
                  at 4 years, then every 2 years. Once the odometer passes
                  160,000 km, the test becomes annual.
                </li>
                <li>
                  <strong>Taxis, chauffeur-driven cars and ambulances:</strong>{" "}
                  annual from the first year.
                </li>
                <li>
                  <strong>Light goods vehicles / vans (N1):</strong> first test
                  at 2 years, then every 2 years (annual after 160,000 km).
                </li>
                <li>
                  <strong>Heavy goods vehicles (N2/N3) and buses:</strong>{" "}
                  annual from the first year.
                </li>
                <li>
                  <strong>Light trailers (O1/O2):</strong> first test at 2
                  years, then every 2 years. Heavy trailers (O3/O4) are tested
                  annually.
                </li>
                <li>
                  <strong>Motorcycles over 125cc:</strong> the interval is set
                  by ministerial notice, so confirm the current rule with
                  Transport Malta.
                </li>
              </ul>
            </section>

            <section id="road-licence" className="mt-12">
              <h2>VRT and Your Road Licence Renewal</h2>
              <p>
                When a test is due, you cannot renew the road licence without a
                pass. The VRT certificate must be dated{" "}
                <strong>within 90 days before</strong> the road licence renewal,
                so book the test in the three months before your licence
                expires.
              </p>
            </section>

            <section id="imports" className="mt-12">
              <h2>Imported Vehicles</h2>
              <ul>
                <li>
                  <strong>From outside the EU:</strong> a VRT is needed if the
                  vehicle is over 4 years old, or over 1 year old with more than
                  160,000 km (L-category vehicles such as motorcycles are
                  excluded from this rule).
                </li>
                <li>
                  <strong>From the UK:</strong> a VRT is needed unless the
                  vehicle has 160,000 km or less and is an M1 car up to 4 years
                  old (N1 vans up to 2 years old).
                </li>
                <li>
                  <strong>From the EU:</strong> a valid roadworthiness
                  certificate issued in another EU member state is recognised.
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
              <p>
                Fees and rules are correct as of October 2026. Budget 2027,
                presented on 26 October 2026, may change vehicle-related rates,
                so recheck with Transport Malta after the budget.
              </p>
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
