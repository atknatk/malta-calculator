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
    "Malta Road License (Circulation Tax) 2026: Complete Guide | Malta Calculator",
  description:
    "Malta road licence 2026: annual fees by CO2 band and car age, pre-2009 engine cc rates, motorcycles, €0 for EVs and PHEVs, LPG discount, vintage and late fees.",
  keywords: [
    "Malta road license",
    "Malta circulation tax",
    "Malta vehicle tax",
    "Transport Malta license",
  ],
  alternates: pageAlternates("/blog/malta-road-license-guide-2026"),
  openGraph: {
    ...ogMetadata,
    title: "Malta Road License 2026 Guide",
    url: `${SITE_URL}/blog/malta-road-license-guide-2026`,
    type: "article",
    images: [getBlogOgImage("Malta Road License 2026 Guide")],
  },
  twitter: { ...twitterMetadata, title: "Malta Road License 2026 Guide" },
};

const ARTICLE_SOURCES = [
  {
    name: "Transport Malta - Road Licence (Circulation Tax)",
    url: "https://transport.gov.mt/land-transport/vehicles/road-licence",
  },
];

export default function RoadLicenseGuidePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Road License 2026: Complete Guide"
        description="Complete guide to annual road license in Malta."
        slug="malta-road-license-guide-2026"
        datePublished="2026-01-01"
        sources={ARTICLE_SOURCES}
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
                capacity, fuel type, and CO2 emissions. The rates below follow
                Transport Malta&apos;s SOPV 33 (version 15, in force from 1
                January 2026). The vehicle&apos;s age is counted in calendar
                years from its <strong>year of manufacture</strong>, not from
                when it was first registered in Malta, and the fee rises as the
                car gets older.
              </p>
            </section>

            <section id="rates" className="mt-12">
              <h2>Cars Registered from 2009: Fees by CO2 Band</h2>
              <p>
                Cars (M1) registered from 2009 pay according to their CO2
                emissions and age. Cars tested under WLTP use wider CO2 bands
                with the same amounts. Diesel cars use the same CO2 bands plus
                particulate (PM) bands; a diesel with PM up to 0.005 g/km pays
                the petrol rates shown here.
              </p>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3">
                        NEDC CO2 (g/km)
                      </th>
                      <th className="border border-border p-3">
                        WLTP CO2 (g/km)
                      </th>
                      <th className="border border-border p-3">Years 0-4</th>
                      <th className="border border-border p-3">Year 5</th>
                      <th className="border border-border p-3">Year 14+</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">Up to 100</td>
                      <td className="border border-border p-3">Up to 125</td>
                      <td className="border border-border p-3">€100</td>
                      <td className="border border-border p-3">€125</td>
                      <td className="border border-border p-3">€295</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">101-130</td>
                      <td className="border border-border p-3">126-175</td>
                      <td className="border border-border p-3">€125</td>
                      <td className="border border-border p-3">€153</td>
                      <td className="border border-border p-3">€339</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">131-140</td>
                      <td className="border border-border p-3">176-200</td>
                      <td className="border border-border p-3">€140</td>
                      <td className="border border-border p-3">€170</td>
                      <td className="border border-border p-3">€374</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">141-150</td>
                      <td className="border border-border p-3">201-225</td>
                      <td className="border border-border p-3">€160</td>
                      <td className="border border-border p-3">€195</td>
                      <td className="border border-border p-3">€433</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">151-180</td>
                      <td className="border border-border p-3">226-250</td>
                      <td className="border border-border p-3">€205</td>
                      <td className="border border-border p-3">€250</td>
                      <td className="border border-border p-3">€556</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">181-220</td>
                      <td className="border border-border p-3">251-275</td>
                      <td className="border border-border p-3">€275</td>
                      <td className="border border-border p-3">€338</td>
                      <td className="border border-border p-3">€762</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">221-250</td>
                      <td className="border border-border p-3">276-300</td>
                      <td className="border border-border p-3">€375</td>
                      <td className="border border-border p-3">€463</td>
                      <td className="border border-border p-3">€1,057</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">Over 250</td>
                      <td className="border border-border p-3">Over 300</td>
                      <td className="border border-border p-3">€525</td>
                      <td className="border border-border p-3">€650</td>
                      <td className="border border-border p-3">€1,125</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Amounts between year 5 and year 14 rise gradually each year.
              </p>
            </section>

            <section id="pre-2009" className="mt-12">
              <h2>Cars Registered Before 2009: Fees by Engine Size</h2>
              <p>
                Older cars pay by engine capacity. The figures below are for
                petrol cars aged 0-6 years; diesel rates are slightly higher,
                and fees rise with age up to year 19 and beyond.
              </p>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3">Engine (cc)</th>
                      <th className="border border-border p-3">
                        Annual Fee (petrol, years 0-6)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">Up to 1300cc</td>
                      <td className="border border-border p-3">€90</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">1301-1449cc</td>
                      <td className="border border-border p-3">€120</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">1450-1500cc</td>
                      <td className="border border-border p-3">€135</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">1501-1800cc</td>
                      <td className="border border-border p-3">€145</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">1801-2000cc</td>
                      <td className="border border-border p-3">€225</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">Over 2000cc</td>
                      <td className="border border-border p-3">€395</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="motorcycles" className="mt-12">
              <h2>Motorcycles</h2>
              <ul>
                <li>
                  <strong>Up to 125cc:</strong> €10 per year
                </li>
                <li>
                  <strong>126-350cc:</strong> €25 per year
                </li>
                <li>
                  <strong>Over 350cc:</strong> from €70 to €80, rising with age
                </li>
              </ul>
            </section>

            <section id="exemptions" className="mt-12">
              <h2>Exemptions & Discounts</h2>
              <ul>
                <li>
                  <strong>
                    Electric vehicles and plug-in hybrids with at least 50 km
                    electric range:
                  </strong>{" "}
                  €0 for years 0-5, then €10 per year
                </li>
                <li>
                  <strong>Regular (non-plug-in) hybrids:</strong> no separate
                  discount. They pay by CO2 band, using the CO2 value on the
                  Certificate of Conformity reduced by 30%.
                </li>
                <li>
                  <strong>LPG conversions:</strong> 10% reduction
                </li>
                <li>
                  <strong>Vintage vehicles (30+ years, certified):</strong> the
                  annual licence fee is waived apart from an €8 administration
                  fee, as long as the vehicle stays within the 3,000 km per year
                  limit (vehicles over 50 years old and motorcycles are exempt
                  from the limit)
                </li>
              </ul>
            </section>

            <section id="late-renewal" className="mt-12">
              <h2>Late Renewal Penalty</h2>
              <p>
                If you renew more than 3 months late, a penalty of €10 per month
                applies, up to a maximum of €100. If your vehicle is due a
                roadworthiness test (VRT), the pass must be dated within 90 days
                before the renewal.
              </p>
            </section>

            <section id="payment" className="mt-12">
              <h2>Payment Options</h2>
              <ul>
                <li>Pay for 3, 6, or 12 months</li>
                <li>Online via Transport Malta website</li>
                <li>At Transport Malta offices</li>
                <li>Through authorized agents</li>
              </ul>
              <p>
                Rates are correct as of October 2026. Budget 2027, presented on
                26 October 2026, may change road licence rates, so recheck with
                Transport Malta after the budget.
              </p>
            </section>

            <BlogArticleAuthor
              datePublished="2026-01-01"
              sources={ARTICLE_SOURCES}
            />
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
