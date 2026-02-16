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
  Globe,
  CheckCircle,
} from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";

export const metadata: Metadata = {
  ...defaultMetadata,
  title:
    "Malta Expat Tax: Highly Qualified Persons (HQP) 15% Flat Rate Guide | Malta Calculator",
  description:
    "Complete guide to Malta's Highly Qualified Persons (HQP) tax scheme. Learn about the 15% flat tax rate for expats, eligibility requirements, qualifying sectors (iGaming, finance, aviation), and application process.",
  keywords: [
    "Malta HQP tax scheme",
    "Malta expat tax",
    "Malta 15% flat tax",
    "Highly Qualified Persons Malta",
    "Malta iGaming tax",
    "Malta finance tax",
    "Malta expat salary",
    "Malta tax for foreigners",
  ],
  alternates: {
    canonical: `${SITE_URL}/blog/malta-expat-tax-hqp-scheme-guide`,
  },
  openGraph: {
    ...ogMetadata,
    title:
      "Malta Expat Tax: Highly Qualified Persons (HQP) 15% Flat Rate Guide",
    url: `${SITE_URL}/blog/malta-expat-tax-hqp-scheme-guide`,
    type: "article",
    images: [
      getBlogOgImage(
        "Malta Expat Tax: Highly Qualified Persons (HQP) 15% Flat Rate Guide",
      ),
    ],
  },
  twitter: {
    ...twitterMetadata,
    title:
      "Malta Expat Tax: Highly Qualified Persons (HQP) 15% Flat Rate Guide",
  },
};

export default function MaltaHQPPage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Expat Tax: Highly Qualified Persons (HQP) 15% Flat Rate Guide"
        description="Complete guide to Malta's HQP tax scheme with 15% flat tax rate for expats in iGaming, finance, and aviation."
        slug="malta-expat-tax-hqp-scheme-guide"
        datePublished="2026-01-01"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "HQP Expat Tax",
            url: `${SITE_URL}/blog/malta-expat-tax-hqp-scheme-guide`,
          },
        ]}
      />
      <main role="main" aria-label="Malta HQP Tax Scheme Guide">
        <Shell className="max-w-4xl py-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <header className="mb-12 not-prose">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-semibold rounded-full">
                  Expat Guide
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  January 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />7 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Expat Tax: Highly Qualified Persons (HQP) 15% Flat Rate
                Guide
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Moving to Malta for work? The HQP scheme offers a flat 15% tax
                rate for highly skilled professionals. Learn if you qualify and
                how to apply.
              </p>
            </header>

            <nav className="p-6 bg-muted/30 rounded-2xl mb-12 not-prose">
              <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#what-is-hqp"
                    className="text-primary hover:underline"
                  >
                    1. What is the HQP Scheme?
                  </a>
                </li>
                <li>
                  <a href="#benefits" className="text-primary hover:underline">
                    2. Key Benefits
                  </a>
                </li>
                <li>
                  <a
                    href="#eligibility"
                    className="text-primary hover:underline"
                  >
                    3. Eligibility Requirements
                  </a>
                </li>
                <li>
                  <a
                    href="#qualifying-sectors"
                    className="text-primary hover:underline"
                  >
                    4. Qualifying Sectors & Roles
                  </a>
                </li>
                <li>
                  <a
                    href="#comparison"
                    className="text-primary hover:underline"
                  >
                    5. HQP vs Standard Tax Rates
                  </a>
                </li>
                <li>
                  <a
                    href="#application"
                    className="text-primary hover:underline"
                  >
                    6. How to Apply
                  </a>
                </li>
              </ul>
            </nav>

            <section id="what-is-hqp">
              <h2>1. What is the HQP Scheme?</h2>
              <p>
                The <strong>Highly Qualified Persons (HQP) Rules</strong> is a
                special tax program designed to attract skilled professionals to
                Malta. Under this scheme, qualifying individuals pay a{" "}
                <strong>flat 15% tax rate</strong> on their employment income,
                instead of the standard progressive rates that can go up to 35%.
              </p>
              <p>
                The scheme was introduced to make Malta competitive in
                attracting talent to key industries such as:
              </p>
              <ul>
                <li>Financial services</li>
                <li>iGaming (online gaming)</li>
                <li>Aviation</li>
                <li>Yacht registration</li>
              </ul>
            </section>

            <section id="benefits" className="mt-12">
              <h2>2. Key Benefits</h2>

              <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
                <div className="p-6 bg-gradient-to-br from-violet-500/10 to-purple-500/5 rounded-2xl border border-violet-500/20">
                  <div className="text-3xl font-bold text-violet-600 mb-2">
                    15%
                  </div>
                  <div className="font-semibold mb-2">Flat Tax Rate</div>
                  <p className="text-sm text-muted-foreground">
                    Compared to up to 35% under standard rates
                  </p>
                </div>
                <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-green-500/5 rounded-2xl border border-emerald-500/20">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">
                    5 Years
                  </div>
                  <div className="font-semibold mb-2">Initial Period</div>
                  <p className="text-sm text-muted-foreground">
                    Extendable based on continued eligibility
                  </p>
                </div>
              </div>

              <p>Additional benefits of the HQP scheme include:</p>
              <ul>
                <li>
                  <strong>No minimum tax</strong> - The 15% rate applies from
                  the first Euro
                </li>
                <li>
                  <strong>Family-friendly</strong> - Spouse benefits from the
                  same tax treatment
                </li>
                <li>
                  <strong>SSC included</strong> - Normal SSC rules still apply
                </li>
                <li>
                  <strong>EU/EEA priority</strong> - Faster processing for EU
                  nationals
                </li>
              </ul>
            </section>

            <section id="eligibility" className="mt-12">
              <h2>3. Eligibility Requirements</h2>
              <p>
                To qualify for the HQP scheme, you must meet{" "}
                <strong>all</strong> of the following requirements:
              </p>

              <div className="space-y-4 not-prose my-8">
                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">
                      Minimum Salary Threshold
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Annual gross salary of at least <strong>€86,938</strong>{" "}
                      (2026 threshold)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Qualifying Employment</div>
                    <p className="text-sm text-muted-foreground">
                      Employment with a company licensed by a qualifying
                      regulator in Malta
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Qualifying Role</div>
                    <p className="text-sm text-muted-foreground">
                      Position requires specialized skills (management,
                      professional, or technical)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Non-Resident History</div>
                    <p className="text-sm text-muted-foreground">
                      Not resident in Malta for tax purposes in the 5 years
                      before employment
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="qualifying-sectors" className="mt-12">
              <h2>4. Qualifying Sectors & Roles</h2>
              <p>
                The HQP scheme covers specific regulated sectors. Your employer
                must hold a license from the relevant Maltese authority:
              </p>

              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Sector
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Regulator
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Example Roles
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Financial Services
                      </td>
                      <td className="border border-border p-3">MFSA</td>
                      <td className="border border-border p-3">
                        Fund managers, compliance, risk
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        iGaming
                      </td>
                      <td className="border border-border p-3">MGA</td>
                      <td className="border border-border p-3">
                        Platform leads, game developers, C-level
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Aviation
                      </td>
                      <td className="border border-border p-3">
                        Transport Malta
                      </td>
                      <td className="border border-border p-3">
                        Pilots, aviation engineers, directors
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        Maritime/Yachting
                      </td>
                      <td className="border border-border p-3">
                        Transport Malta
                      </td>
                      <td className="border border-border p-3">
                        Yacht management, captains
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl not-prose">
                <p className="text-sm">
                  <strong>💡 Note:</strong> IT roles in iGaming companies may
                  qualify if the company holds an MGA license and the role is
                  technical/specialized.
                </p>
              </div>
            </section>

            <section id="comparison" className="mt-12">
              <h2>5. HQP vs Standard Tax Rates</h2>
              <p>
                Here&apos;s how the HQP 15% flat rate compares to standard tax
                for different salary levels:
              </p>

              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Annual Salary
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Standard Tax (Single)
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        HQP (15%)
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Annual Savings
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">€90,000</td>
                      <td className="border border-border p-3">€22,685</td>
                      <td className="border border-border p-3 text-primary font-semibold">
                        €13,500
                      </td>
                      <td className="border border-border p-3 font-semibold text-green-600">
                        €9,185
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">€120,000</td>
                      <td className="border border-border p-3">€33,185</td>
                      <td className="border border-border p-3 text-primary font-semibold">
                        €18,000
                      </td>
                      <td className="border border-border p-3 font-semibold text-green-600">
                        €15,185
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">€150,000</td>
                      <td className="border border-border p-3">€43,685</td>
                      <td className="border border-border p-3 text-primary font-semibold">
                        €22,500
                      </td>
                      <td className="border border-border p-3 font-semibold text-green-600">
                        €21,185
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">€200,000</td>
                      <td className="border border-border p-3">€61,185</td>
                      <td className="border border-border p-3 text-primary font-semibold">
                        €30,000
                      </td>
                      <td className="border border-border p-3 font-semibold text-green-600">
                        €31,185
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                <strong>
                  At €200,000 annual salary, HQP saves over €30,000 per year
                </strong>{" "}
                compared to standard tax rates — a significant benefit for
                high-earning professionals.
              </p>
            </section>

            <section id="application" className="mt-12">
              <h2>6. How to Apply</h2>
              <p>The application process typically involves:</p>
              <ol>
                <li>
                  <strong>Employment offer</strong> - Secure a qualifying job
                  with a licensed employer
                </li>
                <li>
                  <strong>Employer application</strong> - Your employer submits
                  the HQP application on your behalf
                </li>
                <li>
                  <strong>Documentation</strong> - Provide proof of
                  qualifications, previous residence, contract
                </li>
                <li>
                  <strong>Approval</strong> - Malta Enterprise reviews and
                  approves the application
                </li>
                <li>
                  <strong>Tax card</strong> - Receive your tax card reflecting
                  the 15% rate
                </li>
              </ol>
              <p>
                Processing typically takes 4-6 weeks for EU nationals and may be
                longer for non-EU applicants.
              </p>
            </section>

            <BlogArticleFooter
              slug="malta-expat-tax-hqp-scheme-guide"
              title="Malta Expat Tax: Highly Qualified Persons (HQP) 15% Flat Rate Guide"
              ctaTitle="Compare Your Tax Options"
              ctaDescription="Use our Expatriate Tax Calculator to see the difference between standard tax rates and what you'd pay under the HQP scheme."
              ctaLink="/calculators/expatriate-tax"
              ctaLinkText="Try Expatriate Tax Calculator"
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
