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
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";
import { BlogArticleAuthor } from "@/components/blog/blog-article-author";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Malta Bank Interest Tax 2026: 15% or Declare Gross?",
  description:
    "Do you pay 15% tax on Maltese bank interest? When the 15% withholding tax applies, when to declare it gross at progressive rates, and why low earners pay €0.",
  keywords: [
    "Malta bank interest tax",
    "Malta 15% withholding tax interest",
    "Malta savings interest tax",
    "Malta declare interest gross",
    "Malta investment income tax",
    "tax on bank interest Malta",
  ],
  alternates: pageAlternates("/blog/malta-bank-interest-tax-guide-2026"),
  openGraph: {
    ...ogMetadata,
    title: "Malta Bank Interest Tax 2026: 15% or Declare Gross?",
    url: `${SITE_URL}/blog/malta-bank-interest-tax-guide-2026`,
    type: "article",
    images: [getBlogOgImage("Malta Bank Interest Tax 2026")],
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Bank Interest Tax 2026: 15% or Declare Gross?",
  },
};

const ARTICLE_SOURCES = [
  {
    name: "Malta Tax & Customs Administration (MTCA) — Tax Rates for Individuals",
    url: "https://mtca.gov.mt/personal-tax/tax-rates/tax-ratesindividuals/2026",
  },
  {
    name: "Income Tax Act (Cap. 123) — Investment Income Provisions",
    url: "https://legislation.mt/eli/cap/123/eng/pdf",
  },
  {
    name: "PwC Worldwide Tax Summaries — Malta, Individual income determination",
    url: "https://taxsummaries.pwc.com/malta/individual/income-determination",
  },
];

const FAQ = [
  {
    question:
      "If my income is under €10,000 and the bank did not deduct 15%, do I pay 15% on my interest?",
    answer:
      "No. The 15% is a final withholding tax that the bank deducts at source. If you received the interest gross (no 15% deducted), you declare it in your tax return and it is taxed at the normal progressive rates instead of a flat 15%. With total income under the €12,000 single tax-free band, the tax on that interest is €0.",
  },
  {
    question: "Can I reclaim 15% the bank already withheld?",
    answer:
      "No. The 15% withholding tax on bank interest is a final tax. Once it is deducted at source it cannot be refunded, even if your income is below the tax-free threshold. To get progressive treatment you must ask the bank to pay you gross before the interest is paid.",
  },
  {
    question: "Do I still need to declare interest I received gross?",
    answer:
      "Yes. Interest paid to you gross is not final-taxed, so it must be reported in your annual income tax return under investment income — even though the resulting tax may be €0 if you are within the tax-free band.",
  },
  {
    question: "When is the 15% withholding tax the better choice?",
    answer:
      "When your other income already pushes you into the 25% or 35% tax band. Then declaring interest gross would tax it at that higher marginal rate, so letting the bank take a flat 15% is cheaper. For low and middle earners in the 0% band, declaring gross wins.",
  },
];

export default function MaltaBankInterestTaxPage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Bank Interest Tax 2026: 15% Withholding or Declare Gross?"
        description="When the 15% final withholding tax applies to Maltese bank interest, when to declare interest gross at progressive rates, and why low earners pay nothing."
        slug="malta-bank-interest-tax-guide-2026"
        datePublished="2026-06-13"
        sources={ARTICLE_SOURCES}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Bank Interest Tax",
            url: `${SITE_URL}/blog/malta-bank-interest-tax-guide-2026`,
          },
        ]}
      />
      <CustomFAQJsonLd questions={FAQ} />
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
                  <Calendar className="h-4 w-4" /> June 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> 8 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Bank Interest Tax 2026: 15% Withholding or Declare Gross?
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                One of the most common questions we get: &ldquo;My Maltese bank
                paid me interest without taking the 15% tax — do I now owe 15%
                when I file my return?&rdquo; The short answer is usually no.
                Here is exactly how it works.
              </p>
            </header>

            <section id="short-answer">
              <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl not-prose my-2">
                <h2 className="text-lg font-bold mb-2">The short answer</h2>
                <p className="text-sm text-muted-foreground">
                  The 15% is a <strong>final withholding tax</strong> that the
                  bank normally deducts <strong>at source</strong>. If your bank
                  did <strong>not</strong> deduct it, your interest is
                  &ldquo;gross&rdquo; and you must declare it — but it is then
                  taxed at the{" "}
                  <strong>normal progressive rates, not a flat 15%</strong>. If
                  your total income is under the tax-free band (
                  <strong>€12,000</strong> for a single person), the tax on that
                  interest is <strong>€0</strong>.
                </p>
              </div>
            </section>

            <section id="how-taxed" className="mt-12">
              <h2>How Malta taxes local bank interest</h2>
              <p>
                Under the Investment Income Provisions of the Income Tax Act
                (Cap. 123), interest paid by a Maltese bank to a resident
                individual is treated as investment income. The standard route
                is a <strong>15% final withholding tax (FWT)</strong>:
              </p>
              <ul>
                <li>
                  The bank <strong>deducts 15% at source</strong> before paying
                  you the interest.
                </li>
                <li>
                  It is a <strong>final tax</strong> — it settles your full
                  liability on that interest, so you do <strong>not</strong>{" "}
                  declare it in your return.
                </li>
                <li>
                  It is <strong>not refundable</strong> and cannot be claimed
                  back later.
                </li>
              </ul>
              <p>
                Crucially, this 15% route is <strong>optional</strong>. A
                resident can instead elect to receive the interest{" "}
                <strong>gross</strong> — which is exactly what happens when your
                bank pays you without deducting anything.
              </p>
            </section>

            <section id="gross-option" className="mt-12">
              <h2>What changes when the bank does not deduct the 15%</h2>
              <p>When interest is received gross, the treatment flips:</p>
              <ul>
                <li>
                  You <strong>must declare it</strong> in your annual return
                  (under &ldquo;Investment, Capital Gains and Other
                  income&rdquo;).
                </li>
                <li>
                  It is added to your other income and taxed at the{" "}
                  <strong>normal progressive rates (0%–35%)</strong> — not at a
                  flat 15%.
                </li>
                <li>
                  There is <strong>no option to tick a flat 15%</strong> inside
                  the return for interest you received gross. It is either
                  withheld by the bank at source, or declared at progressive
                  rates.
                </li>
              </ul>
            </section>

            <section id="comparison" className="mt-12">
              <h2>The two options compared</h2>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3">Option</th>
                      <th className="border border-border p-3">Rate</th>
                      <th className="border border-border p-3">Declared?</th>
                      <th className="border border-border p-3">Best for</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        15% Withholding (bank deducts)
                      </td>
                      <td className="border border-border p-3 text-primary font-semibold">
                        15% flat
                      </td>
                      <td className="border border-border p-3">No</td>
                      <td className="border border-border p-3">
                        Higher earners (25%–35% band)
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        Declare gross (progressive)
                      </td>
                      <td className="border border-border p-3">0%–35%</td>
                      <td className="border border-border p-3">Yes</td>
                      <td className="border border-border p-3">
                        Low / middle earners (0% band)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                The 2026 single tax bands start with a{" "}
                <strong>0% band on the first €12,000</strong> (€15,000 married,
                €13,000 parent). That zero band is the whole reason declaring
                can beat 15%.
              </p>
            </section>

            <section id="examples" className="mt-12">
              <h2>Worked examples (€1,000 of bank interest)</h2>

              <div className="p-6 bg-muted/30 rounded-xl not-prose my-6">
                <h3 className="font-semibold mb-3">
                  Example 1 — Low earner (single, €9,000 salary)
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    • <strong>15% withholding:</strong> €1,000 × 15% ={" "}
                    <strong className="text-primary">€150</strong>
                  </li>
                  <li>
                    • <strong>Declare gross:</strong> total income €10,000,
                    still inside the €12,000 0% band ={" "}
                    <strong className="text-green-600">€0</strong>
                  </li>
                </ul>
                <p className="text-xs mt-4 text-muted-foreground">
                  Declaring gross saves €150. This is the typical &ldquo;income
                  under €10,000&rdquo; case.
                </p>
              </div>

              <div className="p-6 bg-muted/30 rounded-xl not-prose my-6">
                <h3 className="font-semibold mb-3">
                  Example 2 — Middle earner near the threshold (single, €11,500)
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    • <strong>15% withholding:</strong>{" "}
                    <strong className="text-primary">€150</strong>
                  </li>
                  <li>
                    • <strong>Declare gross:</strong> only the slice above
                    €12,000 is taxed at 15% ={" "}
                    <strong className="text-green-600">€75</strong>
                  </li>
                </ul>
                <p className="text-xs mt-4 text-muted-foreground">
                  Declaring still wins because part of the interest sits in the
                  0% band.
                </p>
              </div>

              <div className="p-6 bg-muted/30 rounded-xl not-prose my-6">
                <h3 className="font-semibold mb-3">
                  Example 3 — Higher earner (single, €50,000 salary)
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    • <strong>15% withholding:</strong>{" "}
                    <strong className="text-green-600">€150</strong>
                  </li>
                  <li>
                    • <strong>Declare gross:</strong> taxed at the 25% marginal
                    rate = <strong className="text-primary">€250</strong>
                  </li>
                </ul>
                <p className="text-xs mt-4 text-muted-foreground">
                  Here the flat 15% withholding is cheaper — let the bank deduct
                  it.
                </p>
              </div>
            </section>

            <section id="declare-reminder" className="mt-12">
              <h2>Important: gross interest must still be declared</h2>
              <p>
                Because the bank did not deduct the tax, gross interest is{" "}
                <strong>not</strong> &ldquo;final-taxed.&rdquo; It is legally
                required to be reported in your income tax return. Even when the
                result is €0 tax, leaving it off the return would be an
                under-declaration. Declare it, and the tax simply computes to
                zero if you are within the tax-free band.
              </p>
              <p>
                A few caveats worth knowing: the figures above assume the
                amounts are your <em>total</em> chargeable income. Other income
                (a second job, pension, rental, or foreign income) can push you
                over the threshold so that part of the interest becomes taxable.
                Foreign bank interest follows different rules. And if your
                income rises above the tax-free band in future, the 15%
                withholding route may become the better default again.
              </p>
            </section>

            <section id="related" className="mt-12">
              <h2>Related reading</h2>
              <ul>
                <li>
                  <Link href="/blog/malta-savings-interest-guide-2026">
                    Malta Savings Interest Guide 2026
                  </Link>{" "}
                  — compound interest and how the 15% tax eats into returns.
                </li>
                <li>
                  <Link href="/blog/malta-tax-rates-2026-complete-guide">
                    Malta Tax Rates 2026
                  </Link>{" "}
                  — the full single, married and parent tax bands.
                </li>
                <li>
                  <Link href="/blog/malta-rental-income-tax-15-percent-guide">
                    Malta Rental Income Tax: 15% vs Progressive
                  </Link>{" "}
                  — the same flat-vs-progressive decision for landlords.
                </li>
              </ul>
            </section>

            <p className="text-xs text-muted-foreground mt-8">
              This guide is general information, not formal tax advice. Your
              outcome depends on your residence, domicile, marital status and
              all sources of income. Confirm your position with the Malta Tax
              &amp; Customs Administration (MTCA/CFR) or a qualified tax
              practitioner before filing.
            </p>

            <BlogArticleAuthor
              datePublished="2026-06-13"
              sources={ARTICLE_SOURCES}
            />
            <BlogArticleFooter
              slug="malta-bank-interest-tax-guide-2026"
              title="Malta Bank Interest Tax 2026"
              ctaTitle="Compare 15% vs Declaring Gross"
              ctaLink="/calculators/bank-interest-tax"
              ctaLinkText="Try the Bank Interest Tax Calculator"
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
