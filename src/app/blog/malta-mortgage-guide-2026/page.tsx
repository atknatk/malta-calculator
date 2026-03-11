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
  Home,
} from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";
import { BlogArticleAuthor } from "@/components/blog/blog-article-author";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Malta Mortgage Guide 2026: Home Loan Essentials | Malta Calculator",
  description:
    "Complete guide to mortgages in Malta 2026. Learn about 10% minimum deposit, LTV ratios, interest rates, and calculate your monthly payments.",
  keywords: [
    "Malta mortgage",
    "Malta home loan",
    "Malta property loan",
    "Malta LTV",
    "Malta bank mortgage",
  ],
  alternates: { canonical: `${SITE_URL}/blog/malta-mortgage-guide-2026` },
  openGraph: {
    ...ogMetadata,
    title: "Malta Mortgage Guide 2026",
    url: `${SITE_URL}/blog/malta-mortgage-guide-2026`,
    type: "article",
    images: [getBlogOgImage("Malta Mortgage Guide 2026")],
  },
  twitter: { ...twitterMetadata, title: "Malta Mortgage Guide 2026" },
};

const ARTICLE_SOURCES = [
  {
    name: "Central Bank of Malta - Financial Stability",
    url: "https://www.centralbankmalta.org/financial-stability",
  },
  {
    name: "Malta Financial Services Authority (MFSA)",
    url: "https://www.mfsa.mt",
  },
];

export default function MaltaMortgageGuidePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Mortgage Guide 2026: Home Loan Essentials"
        description="Complete guide to getting a mortgage in Malta."
        slug="malta-mortgage-guide-2026"
        datePublished="2026-01-01"
        sources={ARTICLE_SOURCES}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Mortgage Guide",
            url: `${SITE_URL}/blog/malta-mortgage-guide-2026`,
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
                <span className="px-3 py-1 bg-sky-500/10 text-sky-600 text-sm font-semibold rounded-full">
                  Banking
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> January 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> 6 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Mortgage Guide 2026
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Everything you need to know about getting a home loan in Malta.
              </p>
            </header>

            <section id="overview">
              <h2>Understanding Mortgages in Malta</h2>
              <p>
                A mortgage (konut kredisi) is a loan secured against property,
                allowing you to purchase a home while repaying over an extended
                period. Malta&apos;s banks offer competitive mortgage products
                with terms typically ranging from 5 to 40 years.
              </p>
            </section>

            <section id="deposit" className="mt-12">
              <h2>Minimum Deposit Requirements</h2>
              <div className="p-6 bg-primary/5 rounded-xl not-prose my-6">
                <Home className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">
                  10% Minimum Deposit
                </h3>
                <p className="text-muted-foreground">
                  In Malta, banks typically require a minimum deposit of{" "}
                  <strong>10%</strong> of the property&apos;s purchase price,
                  meaning the maximum Loan-to-Value (LTV) ratio is{" "}
                  <strong>90%</strong>.
                </p>
              </div>
              <p>A higher deposit offers benefits:</p>
              <ul>
                <li>Lower monthly payments</li>
                <li>Potentially better interest rates</li>
                <li>Reduced total interest over the loan term</li>
                <li>More equity from day one</li>
              </ul>
            </section>

            <section id="rates" className="mt-12">
              <h2>Interest Rates</h2>
              <p>
                Mortgage interest rates in Malta vary between banks and depend
                on several factors:
              </p>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">
                        Rate Type
                      </th>
                      <th className="border border-border p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        Variable Rate
                      </td>
                      <td className="border border-border p-3">
                        Fluctuates with the ECB base rate. More common in Malta.
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-medium">
                        Fixed Rate
                      </td>
                      <td className="border border-border p-3">
                        Locked for a period (1-5 years typically), then converts
                        to variable.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        Tracker Rate
                      </td>
                      <td className="border border-border p-3">
                        Follows ECB rate plus a fixed margin.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                As of 2026, typical mortgage rates in Malta range from{" "}
                <strong>3.5% to 5.5%</strong> depending on the bank and loan
                conditions.
              </p>
            </section>

            <section id="costs" className="mt-12">
              <h2>Additional Costs</h2>
              <p>Beyond the deposit, budget for these additional expenses:</p>
              <ul>
                <li>
                  <strong>Stamp Duty:</strong> 5% of property value (exemptions
                  for first-time buyers)
                </li>
                <li>
                  <strong>Notary Fees:</strong> Typically 1-1.5% of property
                  value
                </li>
                <li>
                  <strong>Bank Fees:</strong> Arrangement fees, valuation fees
                </li>
                <li>
                  <strong>Insurance:</strong> Building insurance is mandatory
                </li>
              </ul>
            </section>

            <section id="eligibility" className="mt-12">
              <h2>Eligibility Criteria</h2>
              <p>Banks assess your application based on:</p>
              <ul>
                <li>
                  <strong>Income:</strong> Stable employment or business income
                </li>
                <li>
                  <strong>Debt-to-Income:</strong> Monthly repayments
                  shouldn&apos;t exceed ~30-40% of net income
                </li>
                <li>
                  <strong>Credit History:</strong> Clean payment history
                </li>
                <li>
                  <strong>Age:</strong> Loan must typically be repaid before
                  retirement age
                </li>
              </ul>
            </section>

            <div className="mt-16 p-8 bg-gradient-to-br from-sky-500/10 to-primary/5 rounded-3xl border border-border/50 not-prose text-center">
              <Calculator className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-cal font-bold mb-4">
                Calculate Your Mortgage
              </h2>
              <p className="text-muted-foreground mb-6">
                See your estimated monthly payments instantly.
              </p>
              <Link
                href="/calculators/mortgage"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
              >
                Try Mortgage Calculator <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <BlogArticleAuthor
              datePublished="2026-01-01"
              sources={ARTICLE_SOURCES}
            />
            <BlogArticleFooter
              slug="malta-mortgage-guide-2026"
              title="Malta Mortgage Guide 2026"
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
