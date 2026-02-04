import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
} from "@/app/shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Calculator,
  TrendingUp,
} from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title:
    "Understanding COLA in Malta 2026: Cost of Living Adjustment Guide | Malta Calculator",
  description:
    "What is COLA in Malta and how does it affect your salary? Complete guide to the Cost of Living Adjustment for 2026. Learn about COLA history, calculation method, and the €10.36 weekly allowance.",
  keywords: [
    "Malta COLA 2026",
    "Malta cost of living adjustment",
    "COLA Malta salary",
    "Malta COLA allowance",
    "Malta inflation adjustment",
    "COLA tax Malta",
    "Malta salary increase 2026",
  ],
  alternates: {
    canonical: `${SITE_URL}/blog/understanding-cola-malta-2026`,
  },
  openGraph: {
    ...ogMetadata,
    title: "Understanding COLA in Malta 2026: Cost of Living Adjustment Guide",
    url: `${SITE_URL}/blog/understanding-cola-malta-2026`,
    type: "article",
  },
  twitter: {
    ...twitterMetadata,
    title: "Understanding COLA in Malta 2026: Cost of Living Adjustment Guide",
  },
};

export default function MaltaCOLAPage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Understanding COLA in Malta 2026: Cost of Living Adjustment Guide"
        description="What is COLA in Malta and how does it affect your salary? Complete guide to the Cost of Living Adjustment."
        slug="understanding-cola-malta-2026"
        datePublished="2026-01-01"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "COLA Guide 2026",
            url: `${SITE_URL}/blog/understanding-cola-malta-2026`,
          },
        ]}
      />
      <main role="main" aria-label="Malta COLA 2026 Guide">
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
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold rounded-full">
                  Salary Guide
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  January 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />5 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Understanding COLA in Malta 2026: Cost of Living Adjustment
                Guide
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                COLA is a crucial component of every salary in Malta. Learn what
                it is, how it&apos;s calculated, and how much you&apos;ll
                receive in 2026.
              </p>
            </header>

            <nav className="p-6 bg-muted/30 rounded-2xl mb-12 not-prose">
              <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#what-is-cola"
                    className="text-primary hover:underline"
                  >
                    1. What is COLA?
                  </a>
                </li>
                <li>
                  <a href="#cola-2026" className="text-primary hover:underline">
                    2. COLA Rates for 2026
                  </a>
                </li>
                <li>
                  <a
                    href="#how-calculated"
                    className="text-primary hover:underline"
                  >
                    3. How is COLA Calculated?
                  </a>
                </li>
                <li>
                  <a
                    href="#cola-history"
                    className="text-primary hover:underline"
                  >
                    4. COLA History (2020-2026)
                  </a>
                </li>
                <li>
                  <a
                    href="#tax-treatment"
                    className="text-primary hover:underline"
                  >
                    5. Tax Treatment of COLA
                  </a>
                </li>
                <li>
                  <a href="#impact" className="text-primary hover:underline">
                    6. Impact on Your Salary
                  </a>
                </li>
              </ul>
            </nav>

            <section id="what-is-cola">
              <h2>1. What is COLA?</h2>
              <p>
                <strong>COLA (Cost of Living Adjustment)</strong> is a mandatory
                annual allowance that all employers in Malta must pay to their
                employees. It&apos;s designed to help workers keep up with
                inflation and maintain their purchasing power.
              </p>
              <p>Key characteristics of COLA:</p>
              <ul>
                <li>
                  <strong>Universal</strong> - Every employee receives it,
                  regardless of salary level
                </li>
                <li>
                  <strong>Flat rate</strong> - The same amount for everyone (not
                  percentage-based)
                </li>
                <li>
                  <strong>Annual increase</strong> - Adjusted each year based on
                  inflation
                </li>
                <li>
                  <strong>Tax-free</strong> - Not subject to income tax
                </li>
                <li>
                  <strong>Cumulative</strong> - Each year&apos;s COLA is added
                  to the previous total
                </li>
              </ul>
            </section>

            <section id="cola-2026" className="mt-12">
              <h2>2. COLA Rates for 2026</h2>

              <div className="p-8 bg-gradient-to-br from-emerald-500/10 to-green-500/5 rounded-3xl border border-emerald-500/20 not-prose my-8 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-emerald-600" />
                <div className="text-4xl font-bold text-emerald-600 mb-2">
                  €10.36
                </div>
                <div className="text-lg text-muted-foreground mb-4">
                  per week (2026 increase)
                </div>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-sm">
                  <div className="p-4 bg-white/50 dark:bg-white/5 rounded-xl">
                    <div className="font-semibold">Monthly</div>
                    <div className="text-xl font-bold text-primary">€44.89</div>
                  </div>
                  <div className="p-4 bg-white/50 dark:bg-white/5 rounded-xl">
                    <div className="font-semibold">Annual</div>
                    <div className="text-xl font-bold text-primary">
                      €538.72
                    </div>
                  </div>
                </div>
              </div>

              <p>
                For 2026, the COLA increase is <strong>€10.36 per week</strong>,
                which translates to approximately{" "}
                <strong>€538.72 per year</strong>. This is added to the
                cumulative COLA from previous years.
              </p>
            </section>

            <section id="how-calculated" className="mt-12">
              <h2>3. How is COLA Calculated?</h2>
              <p>
                COLA is calculated by the government based on the{" "}
                <strong>Retail Price Index (RPI)</strong>, which measures the
                change in prices of goods and services consumed by households.
              </p>
              <p>The formula considers:</p>
              <ul>
                <li>The 12-month average of the RPI</li>
                <li>Comparison with the previous year&apos;s RPI</li>
                <li>Conversion to a weekly monetary value</li>
              </ul>
              <p>
                This ensures COLA reflects actual inflation experienced by
                consumers in Malta.
              </p>
            </section>

            <section id="cola-history" className="mt-12">
              <h2>4. COLA History (2020-2026)</h2>
              <p>Here&apos;s how COLA has increased over recent years:</p>

              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Year
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Weekly Increase
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Annual Increase
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Context
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">2020</td>
                      <td className="border border-border p-3">€1.75</td>
                      <td className="border border-border p-3">€91.00</td>
                      <td className="border border-border p-3 text-xs text-muted-foreground">
                        Pre-pandemic levels
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">2021</td>
                      <td className="border border-border p-3">€1.75</td>
                      <td className="border border-border p-3">€91.00</td>
                      <td className="border border-border p-3 text-xs text-muted-foreground">
                        COVID-19 impact
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">2022</td>
                      <td className="border border-border p-3">€1.75</td>
                      <td className="border border-border p-3">€91.00</td>
                      <td className="border border-border p-3 text-xs text-muted-foreground">
                        Government price caps
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">2023</td>
                      <td className="border border-border p-3">€9.90</td>
                      <td className="border border-border p-3">€514.80</td>
                      <td className="border border-border p-3 text-xs text-muted-foreground">
                        High inflation year
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">2024</td>
                      <td className="border border-border p-3">€5.84</td>
                      <td className="border border-border p-3">€303.68</td>
                      <td className="border border-border p-3 text-xs text-muted-foreground">
                        Continued adjustments
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">2025</td>
                      <td className="border border-border p-3">€5.24</td>
                      <td className="border border-border p-3">€272.48</td>
                      <td className="border border-border p-3 text-xs text-muted-foreground">
                        Stabilizing inflation
                      </td>
                    </tr>
                    <tr className="bg-emerald-500/10">
                      <td className="border border-border p-3 font-semibold">
                        2026
                      </td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        €10.36
                      </td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        €538.72
                      </td>
                      <td className="border border-border p-3 text-xs font-medium">
                        Current year
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="tax-treatment" className="mt-12">
              <h2>5. Tax Treatment of COLA</h2>
              <p>
                One of the key benefits of COLA is that it is{" "}
                <strong>completely tax-free</strong>. This means:
              </p>
              <ul>
                <li>
                  COLA is <strong>not subject to income tax</strong>
                </li>
                <li>
                  It does <strong>not count toward your taxable income</strong>
                </li>
                <li>You receive the full COLA amount without any deductions</li>
              </ul>

              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl not-prose">
                <p className="text-sm">
                  <strong>✅ Tax-Free Benefit:</strong> Your €538.72 annual COLA
                  for 2026 is yours to keep in full — it&apos;s not taxed and
                  doesn&apos;t push you into a higher tax bracket.
                </p>
              </div>
            </section>

            <section id="impact" className="mt-12">
              <h2>6. Impact on Your Salary</h2>
              <p>
                COLA is typically included in your total salary package.
                Here&apos;s an example:
              </p>

              <h3>Example: Employee with €25,000 base salary</h3>
              <div className="p-6 bg-muted/30 rounded-xl not-prose my-4">
                <ul className="space-y-2 text-sm">
                  <li>• Base salary: €25,000</li>
                  <li>• COLA 2026: €538.72</li>
                  <li>
                    • Total gross: <strong>€25,538.72</strong>
                  </li>
                  <li className="pt-2 border-t border-border">
                    <span>Taxable portion: </span>
                    <strong className="text-primary">€25,000</strong>
                    <span className="text-muted-foreground text-xs">
                      {" "}
                      (COLA is tax-free)
                    </span>
                  </li>
                </ul>
              </div>

              <p>
                This means you benefit from the full COLA amount without it
                increasing your tax liability.
              </p>
            </section>

            <div className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-3xl border border-border/50 not-prose text-center">
              <Calculator className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-cal font-bold mb-4">
                See COLA in Your Salary Breakdown
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Our Malta Salary Calculator shows exactly how COLA affects your
                net salary, with a detailed breakdown of all components.
              </p>
              <Link
                href="/salary"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
              >
                Calculate Now
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
