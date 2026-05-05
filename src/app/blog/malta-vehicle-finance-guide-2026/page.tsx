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
  Calculator,
  Car,
  Banknote,
  Wallet,
  Percent,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Scale,
} from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";
import { BlogArticleAuthor } from "@/components/blog/blog-article-author";

export const metadata: Metadata = {
  ...defaultMetadata,
  title:
    "Malta Vehicle Finance Guide 2026: Car Loans & Hire Purchase | Malta Calculator",
  description:
    "Complete 2026 guide to financing a vehicle in Malta — bank car loans, dealer hire purchase, deposit rules, interest rates, APRC, and total cost of borrowing.",
  keywords: [
    "Malta vehicle finance",
    "Malta car loan",
    "Malta hire purchase",
    "BOV motor loan",
    "HSBC Malta car loan",
    "APS car finance",
    "Finance House Malta",
    "Malta dealer finance",
    "Malta car loan interest rates",
    "Malta auto finance APRC",
  ],
  alternates: pageAlternates("/blog/malta-vehicle-finance-guide-2026"),
  openGraph: {
    ...ogMetadata,
    title: "Malta Vehicle Finance Guide 2026: Car Loans & Hire Purchase",
    url: `${SITE_URL}/blog/malta-vehicle-finance-guide-2026`,
    type: "article",
    images: [getBlogOgImage("Malta Vehicle Finance Guide 2026")],
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Vehicle Finance Guide 2026",
  },
};

const ARTICLE_SOURCES = [
  {
    name: "Bank of Valletta — Motor Loan",
    url: "https://www.bov.com/motorloans",
  },
  {
    name: "HSBC Malta — Car Loans",
    url: "https://www.hsbc.com.mt/loans/products/car/",
  },
  {
    name: "Finance House — Car Loan",
    url: "https://financehouse.mt/financing-solutions/cars/",
  },
  {
    name: "Central Bank of Malta — Interest Rates",
    url: "https://www.centralbankmalta.org/interest-rates-and-key-financial-market-rates",
  },
  {
    name: "Malta Financial Services Authority (MFSA) — Consumer Credit",
    url: "https://www.mfsa.mt/consumers/consumer-credit",
  },
];

export default function MaltaVehicleFinanceGuidePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Vehicle Finance Guide 2026: Car Loans & Hire Purchase"
        description="Complete 2026 guide to vehicle finance in Malta — bank car loans, dealer hire purchase, deposit rules, interest rates and APRC."
        slug="malta-vehicle-finance-guide-2026"
        datePublished="2026-05-04"
        sources={ARTICLE_SOURCES}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Malta Vehicle Finance Guide 2026",
            url: `${SITE_URL}/blog/malta-vehicle-finance-guide-2026`,
          },
        ]}
      />
      <main role="main">
        <Shell className="max-w-4xl py-8 sm:py-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 sm:mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>

          <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-24">
            {/* Header */}
            <header className="mb-8 sm:mb-12 not-prose">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 text-xs sm:text-sm font-semibold rounded-full">
                  Banking & Loans
                </span>
                <span className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> May 2026
                </span>
                <span className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> 12 min read
                </span>
              </div>
              <h1 className="font-cal text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                Malta Vehicle Finance Guide 2026
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                Everything you need to know about financing a car or asset in
                Malta — bank car loans, dealer hire purchase, deposit rules,
                interest rates and the true cost of borrowing.
              </p>
            </header>

            {/* TL;DR */}
            <div className="not-prose p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 mb-8 sm:mb-12">
              <h2 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2">
                <Banknote className="h-5 w-5 text-cyan-600" /> Quick Summary
              </h2>
              <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
                <li>
                  <strong className="text-foreground">
                    Typical dealer offer:
                  </strong>{" "}
                  25% deposit, 60 months, ~6-9% annual interest.
                </li>
                <li>
                  <strong className="text-foreground">Bank car loans:</strong>{" "}
                  BOV from 4.75% (variable), HSBC 6.50% IR / 6.70% APRC fixed,
                  often 0% deposit needed.
                </li>
                <li>
                  <strong className="text-foreground">EV/hybrid scheme:</strong>{" "}
                  APS Bank offers 0% interest on green vehicle loans
                  (EU-funded).
                </li>
                <li>
                  <strong className="text-foreground">
                    APRC matters more than IR
                  </strong>
                  — it includes fees and reflects the true cost.
                </li>
              </ul>
            </div>

            {/* What is vehicle finance */}
            <section id="what-is-vehicle-finance">
              <h2>What Is Vehicle Finance in Malta?</h2>
              <p>
                Vehicle finance is any credit product used to spread the cost of
                buying a car, motorcycle, van or even a caravan over a number of
                months. In Malta there are two dominant routes: a{" "}
                <strong>bank car loan</strong> and a{" "}
                <strong>dealer hire-purchase agreement</strong>. Both work the
                same way mathematically — a deposit (or no deposit) plus fixed
                monthly instalments — but the legal ownership, paperwork and
                interest rates differ.
              </p>
              <p>
                Use the{" "}
                <Link
                  href="/calculators/vehicle-finance"
                  className="text-cyan-700 dark:text-cyan-400 font-medium hover:underline"
                >
                  Malta Vehicle Finance Calculator
                </Link>{" "}
                to see the deposit, monthly instalment and total cost for any
                combination of price, term and rate.
              </p>
            </section>

            {/* Comparison table */}
            <section id="loan-vs-hp" className="mt-10 sm:mt-12">
              <h2>Bank Car Loan vs Dealer Hire Purchase</h2>
              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 sm:p-3 text-left">
                        Feature
                      </th>
                      <th className="border border-border p-2 sm:p-3 text-left">
                        Bank Car Loan
                      </th>
                      <th className="border border-border p-2 sm:p-3 text-left">
                        Hire Purchase (HP)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-2 sm:p-3 font-medium">
                        Ownership
                      </td>
                      <td className="border border-border p-2 sm:p-3">
                        You own the car from day one
                      </td>
                      <td className="border border-border p-2 sm:p-3">
                        Finance company owns it until final payment
                      </td>
                    </tr>
                    <tr className="bg-muted/40">
                      <td className="border border-border p-2 sm:p-3 font-medium">
                        Deposit
                      </td>
                      <td className="border border-border p-2 sm:p-3">
                        0% common (BOV, HSBC)
                      </td>
                      <td className="border border-border p-2 sm:p-3">
                        Typically 10-25%, up to 50%
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2 sm:p-3 font-medium">
                        Interest rate
                      </td>
                      <td className="border border-border p-2 sm:p-3">
                        4.75% - 6.50%
                      </td>
                      <td className="border border-border p-2 sm:p-3">
                        6% - 9% (sometimes 13%+ APRC after fees)
                      </td>
                    </tr>
                    <tr className="bg-muted/40">
                      <td className="border border-border p-2 sm:p-3 font-medium">
                        Term
                      </td>
                      <td className="border border-border p-2 sm:p-3">
                        Up to 7 years (BOV up to 15)
                      </td>
                      <td className="border border-border p-2 sm:p-3">
                        12-60 months (sometimes 84)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2 sm:p-3 font-medium">
                        Approval
                      </td>
                      <td className="border border-border p-2 sm:p-3">
                        Slower, full credit check, payslips
                      </td>
                      <td className="border border-border p-2 sm:p-3">
                        Faster, often same-day at the dealership
                      </td>
                    </tr>
                    <tr className="bg-muted/40">
                      <td className="border border-border p-2 sm:p-3 font-medium">
                        Early repayment
                      </td>
                      <td className="border border-border p-2 sm:p-3">
                        Often 0% fee (HSBC) or capped at 1%
                      </td>
                      <td className="border border-border p-2 sm:p-3">
                        Settlement figure provided; some interest unwound
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2 sm:p-3 font-medium">
                        Best for
                      </td>
                      <td className="border border-border p-2 sm:p-3">
                        Lowest total cost, cleanest paperwork
                      </td>
                      <td className="border border-border p-2 sm:p-3">
                        Speed, weaker credit profile, manufacturer promo rates
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Lenders */}
            <section id="malta-lenders" className="mt-10 sm:mt-12">
              <h2>Malta Vehicle Finance Lenders (2026)</h2>

              <div className="not-prose grid sm:grid-cols-2 gap-4 my-6">
                <LenderCard
                  name="Bank of Valletta (BOV) Motor Loan"
                  rate="from 4.75% variable"
                  highlight="No deposit required, life cover up to €25,000, max term 15 years."
                />
                <LenderCard
                  name="HSBC Malta Car Loan"
                  rate="6.50% IR / 6.70% APRC"
                  highlight="Fixed rate, 100% financing for Premier/Advance/Personal customers, no early repayment penalty."
                />
                <LenderCard
                  name="APS Bank Green Vehicle Loan"
                  rate="0% (EU-funded)"
                  highlight="Special scheme for fully electric or plug-in hybrid vehicles, regional development fund-backed."
                />
                <LenderCard
                  name="Finance House (HP)"
                  rate="from 5.5% IR · ~10-13% APRC"
                  highlight="0% deposit up to €20k, 25% deposit on cars >€100k, 4.75% banking fee, max 7 years."
                />
                <LenderCard
                  name="BNF Bank Personal Loan"
                  rate="around 7%"
                  highlight="Branch network and salary-account discounts available."
                />
                <LenderCard
                  name="Dealer Hire Purchase"
                  rate="6-9% IR (varies)"
                  highlight="Toyota, Hyundai, Cars and More etc. — quick approval, often 25% deposit & 60-month term."
                />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground italic">
                Rates indicative as published in early 2026. Always confirm the
                APRC (which includes arrangement fees) directly with the lender
                — that&apos;s the only fair way to compare offers.
              </p>
            </section>

            {/* Worked example */}
            <section id="worked-example" className="mt-10 sm:mt-12">
              <h2>Worked Example: 25% / 60 months / 8% Interest</h2>
              <p>
                The most common quote you&apos;ll see at a Maltese dealer is{" "}
                <strong>
                  25% deposit, 60 monthly instalments, 8% annual interest rate
                </strong>
                . Here&apos;s how that breaks down for a €40,000 car:
              </p>
              <div className="not-prose p-5 sm:p-6 rounded-2xl bg-card border border-border/50 my-6 space-y-2">
                <ExampleRow label="Vehicle price" value="€40,000" />
                <ExampleRow
                  label="Deposit (25%)"
                  value="€10,000"
                  tone="emerald"
                />
                <ExampleRow label="Financed amount" value="€30,000" strong />
                <ExampleRow
                  label="Monthly instalment (60 mo @ 8%)"
                  value="€608.29"
                  tone="cyan"
                />
                <ExampleRow
                  label="Total interest paid"
                  value="€6,498"
                  tone="amber"
                />
                <ExampleRow
                  label="Total repayment over 5 years"
                  value="€36,498"
                />
                <div className="h-px bg-border my-2" />
                <ExampleRow
                  label="Grand total cost"
                  value="€46,498"
                  strong
                  tone="violet"
                />
              </div>
              <p>
                That €6,498 of interest is the real cost of borrowing. If the
                same buyer had taken a BOV motor loan at 4.75% with 0% deposit
                on €40,000 over 60 months, the monthly instalment would be
                around €749 but the total interest only ~€4,950 — saving over
                €1,500 versus the dealer HP, even though the monthly is higher.
              </p>
            </section>

            {/* APRC explained */}
            <section id="aprc" className="mt-10 sm:mt-12">
              <h2>IR vs APRC: Which Number Should You Compare?</h2>
              <p>
                Maltese lenders quote two different rates and confusing them is
                the #1 way to overpay:
              </p>
              <ul>
                <li>
                  <strong>Interest Rate (IR):</strong> the rate applied to your
                  outstanding balance each month. Lower number, but doesn&apos;t
                  include fees.
                </li>
                <li>
                  <strong>Annual Percentage Rate of Charge (APRC):</strong> the
                  effective cost — interest plus arrangement, banking and
                  administration fees expressed as one annual number.
                </li>
              </ul>
              <p>
                A €10,000 Finance House car loan at <strong>9% IR</strong> over
                5 years works out to <strong>13.46% APRC</strong> once the 4.75%
                banking fee and €10 monthly HP-bill fees are baked in. The IR
                alone hides one third of the true cost.
              </p>
              <div className="not-prose p-4 sm:p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 my-6 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/80 m-0">
                  <strong>Always compare APRC, not IR.</strong> Two finance
                  offers with the same IR can have very different APRCs once
                  fees are added.
                </p>
              </div>
            </section>

            {/* SECCI — how to read the form */}
            <section id="secci" className="mt-10 sm:mt-12">
              <h2>How to Read Your Malta SECCI Form</h2>
              <p>
                Before any consumer credit agreement in Malta is signed, the
                lender must give you a{" "}
                <strong>Standard European Consumer Credit Information</strong>{" "}
                (SECCI) form — a one-page summary of every cost, fee, right and
                obligation. EU law requires this to make finance offers
                comparable. Here&apos;s how to decode the seven sections:
              </p>

              <div className="not-prose p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 my-6">
                <div className="flex items-center gap-2 mb-3 text-sm font-semibold">
                  <FileText className="h-5 w-5 text-cyan-700 dark:text-cyan-400" />
                  Real-world example: Finance House SECCI 2026
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  €13,000 motor vehicle loan over 72 months at 5.50% borrowing
                  rate:
                </p>
                <div className="space-y-2 text-sm sm:text-base">
                  <SecciRow label="Total amount of credit" value="€13,000.00" />
                  <SecciRow label="Duration" value="72 months" />
                  <SecciRow
                    label="Borrowing rate (IR)"
                    value="5.50% p.a. fixed"
                  />
                  <SecciRow label="Monthly instalment" value="€266.63" strong />
                  <SecciRow
                    label="Total amount payable"
                    value="€19,197.36"
                    strong
                  />
                  <div className="h-px bg-border my-2" />
                  <p className="text-[11px] sm:text-xs uppercase tracking-wider text-muted-foreground font-semibold pt-1">
                    Cost of credit (the APRC includes these)
                  </p>
                  <SecciRow
                    label="Processing fee (4.75% of credit)"
                    value="€617.50"
                    tone="rose"
                  />
                  <SecciRow
                    label="Financing & Factoring fee"
                    value="€1,982.50"
                    tone="rose"
                  />
                  <SecciRow
                    label="Bills of exchange fee"
                    value="€720.00"
                    tone="rose"
                  />
                  <SecciRow
                    label="Total interest"
                    value="€2,877.36"
                    tone="amber"
                  />
                  <div className="h-px bg-border my-2" />
                  <SecciRow
                    label="APR (true cost)"
                    value="13.82%"
                    strong
                    tone="rose"
                  />
                  <p className="text-[11px] sm:text-xs text-muted-foreground italic mt-2">
                    Headline IR 5.50% becomes a 13.82% APR once the three fees
                    are amortised into the loan principal — a 2.5× hidden cost
                    multiplier.
                  </p>
                </div>
              </div>

              <h3 className="mt-8">What each SECCI section means</h3>
              <ol className="space-y-2.5">
                <li>
                  <strong>1. Identity & contact details</strong> — who the
                  lender is. Verify the lender is licensed by the MFSA before
                  signing anything.
                </li>
                <li>
                  <strong>2. Description of the credit product</strong> — type
                  (motor vehicle loan, hire purchase, personal loan), total
                  amount, duration, monthly instalment, total payable. Compare{" "}
                  <em>total payable</em> not just monthly.
                </li>
                <li>
                  <strong>3. Costs of the credit</strong> — borrowing rate (IR)
                  + APR with itemised fees + late payment penalties. The APR is
                  the only fair comparison number.
                </li>
                <li>
                  <strong>4. Other important legal aspects</strong> — your
                  withdrawal right, early repayment right, database checks, and
                  how long the offer is valid (usually 7 days from issue).
                </li>
              </ol>

              <p className="mt-4">
                If a Maltese dealer or finance company asks you to sign without
                providing a SECCI, walk away — under EU consumer credit rules
                they{" "}
                <strong>
                  must give it to you free of charge before any agreement is
                  binding
                </strong>
                .
              </p>
            </section>

            {/* EU rights */}
            <section id="eu-rights" className="mt-10 sm:mt-12">
              <h2>Your EU Consumer Credit Rights in Malta</h2>
              <p>
                Maltese vehicle finance is governed by Directive 2008/48/EC (the
                EU Consumer Credit Directive) as transposed into Maltese law.
                These rights apply to <strong>every</strong> regulated car loan,
                hire-purchase and personal loan and cannot be signed away:
              </p>

              <div className="not-prose grid sm:grid-cols-2 gap-3 sm:gap-4 my-6">
                <RightCard
                  icon={<Scale className="h-5 w-5" />}
                  title="14-day cooling-off period"
                  body="You can withdraw from the credit agreement within 14 calendar days without giving any reason. The lender simply unwinds the deal."
                />
                <RightCard
                  icon={<Calculator className="h-5 w-5" />}
                  title="Right to repay early"
                  body="At any time, in part or in full. Early repayment fee capped at 1% of the outstanding balance (0.5% if less than 12 months remain)."
                />
                <RightCard
                  icon={<FileText className="h-5 w-5" />}
                  title="Right to a draft agreement"
                  body="On request, the lender must give you a free copy of the draft credit agreement so you can review it before signing."
                />
                <RightCard
                  icon={<ShieldCheck className="h-5 w-5" />}
                  title="Database disclosure"
                  body="If your application is rejected because of a credit-database check (MACM, Credit Info), the lender must tell you immediately and free of charge."
                />
                <RightCard
                  icon={<Clock className="h-5 w-5" />}
                  title="SECCI validity (7 days)"
                  body="The pre-contractual quote in the SECCI is binding on the lender for at least 7 days from issue — they cannot quietly change the terms."
                />
                <RightCard
                  icon={<Banknote className="h-5 w-5" />}
                  title="Itemised APR disclosure"
                  body="The APR must include every fee that affects the cost of the credit. If a fee isn't in the APR but appears in the contract, push back."
                />
              </div>
            </section>

            {/* Late & default fees */}
            <section id="default-fees" className="mt-10 sm:mt-12">
              <h2>Late Payment & Default Fees: The Real Cost of Missing One</h2>
              <p>
                APR is calculated assuming you pay every instalment on time.
                Miss one and a separate set of fees kicks in. These typical
                Finance House SECCI rates are <strong>not in the APR</strong>{" "}
                and can spiral fast:
              </p>

              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-rose-500/10">
                      <th className="border border-border p-2 sm:p-3 text-left">
                        Months overdue
                      </th>
                      <th className="border border-border p-2 sm:p-3 text-right">
                        Late fee (€)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-2 sm:p-3">
                        1 month
                      </td>
                      <td className="border border-border p-2 sm:p-3 text-right tabular-nums">
                        €10
                      </td>
                    </tr>
                    <tr className="bg-muted/40">
                      <td className="border border-border p-2 sm:p-3">
                        2 months
                      </td>
                      <td className="border border-border p-2 sm:p-3 text-right tabular-nums">
                        €20
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2 sm:p-3">
                        3 months
                      </td>
                      <td className="border border-border p-2 sm:p-3 text-right tabular-nums">
                        €30
                      </td>
                    </tr>
                    <tr className="bg-muted/40">
                      <td className="border border-border p-2 sm:p-3">
                        4 months
                      </td>
                      <td className="border border-border p-2 sm:p-3 text-right tabular-nums">
                        €40
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2 sm:p-3">
                        5+ months
                      </td>
                      <td className="border border-border p-2 sm:p-3 text-right tabular-nums">
                        €50 + legal
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>On top of arrears interest, lenders also charge:</p>
              <ul>
                <li>
                  <strong>€15</strong> — direct debit rejected payment
                </li>
                <li>
                  <strong>€20</strong> — returned cheque
                </li>
                <li>
                  <strong>€20</strong> — final warning letter
                </li>
                <li>
                  <strong>€25</strong> — legal letter
                </li>
                <li>
                  <strong>€50</strong> — legal administration fee
                </li>
                <li>
                  <strong>€14</strong> — credit-reference agency pressure letter
                </li>
                <li>
                  <strong>Court costs</strong> — uncapped, if the case escalates
                </li>
              </ul>

              <p>
                Worst case: if you stop paying, the finance company can recover
                the vehicle (you signed <strong>Bills of Exchange</strong> as
                security) and pursue you for the residual debt. Always set up a
                direct debit and make sure your account has buffer at month-end.
              </p>
            </section>

            {/* Compulsory items */}
            <section id="compulsory" className="mt-10 sm:mt-12">
              <h2>What&apos;s Compulsory in a Maltese HP Agreement</h2>
              <p>Every Maltese hire-purchase and most car loans require:</p>
              <ul>
                <li>
                  <strong>Comprehensive vehicle insurance</strong> for the full
                  finance term — third-party cover alone won&apos;t satisfy the
                  lender.
                </li>
                <li>
                  <strong>Direct debit</strong> for monthly payments —
                  manual/standing-order payments are usually not accepted.
                </li>
                <li>
                  <strong>Bills of Exchange</strong> — postdated promissory
                  notes signed as security. Each one is a legally enforceable
                  payment instrument.
                </li>
                <li>
                  <strong>Vehicle transfer restriction</strong> — you cannot
                  resell, gift or export the vehicle while the loan is open.
                  Title is recorded against the lender.
                </li>
              </ul>
              <p>
                For boats and other secured assets, a{" "}
                <strong>general hypothec registration fee (€49)</strong> is
                added at registration.
              </p>
            </section>

            {/* How much can I borrow */}
            <section id="how-much" className="mt-10 sm:mt-12">
              <h2>How Much Can I Borrow in Malta?</h2>
              <p>
                Most Maltese banks lend a multiple of your annual net salary,
                capped by your debt-to-income ratio (typically 40-45% of net
                income across all loan repayments). HSBC Malta, for instance,
                lends up to:
              </p>
              <ul>
                <li>
                  <strong>€70,000</strong> for HSBC Premier customers
                </li>
                <li>
                  <strong>€50,000</strong> for Advance and Personal Banking
                  customers
                </li>
              </ul>
              <p>
                BOV motor loans depend on income level and can extend to 15
                years. Dealers offering hire purchase usually cap unsecured
                amounts around €100,000 and require a higher deposit (often 25%)
                on vehicles above that.
              </p>
              <p>
                Rule of thumb: keep your{" "}
                <strong>monthly car repayment under 15% of net salary</strong>{" "}
                to leave room for fuel, insurance, road licence, VRT and
                servicing.
              </p>
            </section>

            {/* Total cost of ownership */}
            <section id="tco" className="mt-10 sm:mt-12">
              <h2>The Bigger Picture: Total Cost of Ownership</h2>
              <p>
                Loan instalments aren&apos;t the only cost of running a vehicle
                in Malta. When budgeting, layer in:
              </p>
              <ul>
                <li>
                  <Link href="/calculators/vehicle-registration-tax">
                    Vehicle Registration Tax (CO₂-based)
                  </Link>{" "}
                  — paid once at registration
                </li>
                <li>
                  <Link href="/calculators/road-license">
                    Road Licence (annual circulation tax)
                  </Link>{" "}
                  — paid every year
                </li>
                <li>
                  <Link href="/calculators/vrt">VRT roadworthiness test</Link> —
                  required regularly after the vehicle is 4 years old
                </li>
                <li>
                  <strong>Insurance</strong> — comprehensive cover often
                  required by the lender during the finance period
                </li>
                <li>
                  <strong>Fuel</strong> — Malta&apos;s grid price for
                  petrol/diesel was €1.34-€1.41/L through 2025
                </li>
                <li>
                  <strong>Servicing & tyres</strong> — budget €400-€800/year
                </li>
              </ul>
              <p>
                If you&apos;re importing a vehicle, also use the{" "}
                <Link href="/calculators/import-vehicle">
                  Malta Import Vehicle Calculator
                </Link>{" "}
                to estimate the landed cost before financing.
              </p>
            </section>

            {/* Tips */}
            <section id="tips" className="mt-10 sm:mt-12">
              <h2>10 Practical Tips for Maltese Vehicle Finance</h2>
              <ol className="space-y-2">
                <li>
                  <strong>Get pre-approved by a bank first</strong> — that
                  becomes your cash-buyer leverage at the dealership.
                </li>
                <li>
                  <strong>Ask the dealer to match the bank APRC.</strong>{" "}
                  Manufacturer subvention often means they can.
                </li>
                <li>
                  <strong>Negotiate price separately from finance.</strong>{" "}
                  Dealers can disguise discounts as &quot;low rates&quot;.
                </li>
                <li>
                  <strong>Pay 25%+ deposit if you can.</strong> It cuts total
                  interest and the lender risk premium.
                </li>
                <li>
                  <strong>Pick the shortest term you can afford.</strong> A
                  60-month deal beats 84 months on total interest by 30%+.
                </li>
                <li>
                  <strong>
                    Check if PPI/credit-life insurance is bundled.
                  </strong>{" "}
                  Often optional and overpriced.
                </li>
                <li>
                  <strong>Confirm early-repayment fees in writing.</strong> EU
                  consumer credit law caps these at 1%.
                </li>
                <li>
                  <strong>Consider an EV/hybrid loan</strong> — APS Bank&apos;s
                  0% scheme can save thousands.
                </li>
                <li>
                  <strong>Review the agreement&apos;s arrears clauses</strong> —
                  late fees in Malta can compound quickly (€2/day at some
                  lenders).
                </li>
                <li>
                  <strong>Run the numbers in our calculator</strong> before you
                  sign anything.
                </li>
              </ol>
            </section>

            {/* CTAs */}
            <div className="mt-12 sm:mt-16 p-6 sm:p-8 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 rounded-2xl sm:rounded-3xl border border-cyan-500/20 not-prose text-center">
              <Calculator className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-cyan-600" />
              <h2 className="text-xl sm:text-2xl font-cal font-bold mb-2 sm:mb-4">
                Run Your Malta Vehicle Finance Numbers
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-5 sm:mb-6 max-w-xl mx-auto">
                See your monthly instalment, total interest and grand total cost
                in seconds — adjust deposit, term and rate to find the sweet
                spot.
              </p>
              <Link
                href="/calculators/vehicle-finance"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl bg-cyan-600 text-white font-semibold hover:bg-cyan-500 transition-colors text-sm sm:text-base"
              >
                Open Vehicle Finance Calculator{" "}
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>

            {/* Related */}
            <section className="mt-10 sm:mt-12">
              <h2 className="text-xl sm:text-2xl font-cal font-bold mb-4">
                Related Calculators & Guides
              </h2>
              <div className="not-prose grid sm:grid-cols-2 gap-3 sm:gap-4">
                <RelatedLink
                  href="/calculators/personal-loan"
                  title="Personal Loan Calculator"
                  description="For unsecured loans without a deposit."
                  icon={<Banknote className="h-5 w-5" />}
                />
                <RelatedLink
                  href="/calculators/mortgage"
                  title="Mortgage Calculator"
                  description="Home loan with 10%+ deposit."
                  icon={<Wallet className="h-5 w-5" />}
                />
                <RelatedLink
                  href="/calculators/vehicle-registration-tax"
                  title="Vehicle Registration Tax"
                  description="One-off tax paid at registration."
                  icon={<Car className="h-5 w-5" />}
                />
                <RelatedLink
                  href="/blog/malta-personal-loan-guide-2026"
                  title="Personal Loan Guide 2026"
                  description="Rates, requirements and bank comparison."
                  icon={<Percent className="h-5 w-5" />}
                />
              </div>
            </section>

            <BlogArticleAuthor
              datePublished="2026-05-04"
              sources={ARTICLE_SOURCES}
            />
            <BlogArticleFooter
              slug="malta-vehicle-finance-guide-2026"
              title="Malta Vehicle Finance Guide 2026"
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

function LenderCard({
  name,
  rate,
  highlight,
}: {
  name: string;
  rate: string;
  highlight: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border/50">
      <p className="font-semibold text-sm sm:text-base">{name}</p>
      <p className="text-cyan-700 dark:text-cyan-400 font-medium text-sm mt-1 mb-2">
        {rate}
      </p>
      <p className="text-xs sm:text-sm text-muted-foreground">{highlight}</p>
    </div>
  );
}

function ExampleRow({
  label,
  value,
  strong,
  tone,
}: {
  label: string;
  value: string;
  strong?: boolean;
  tone?: "cyan" | "amber" | "emerald" | "violet";
}) {
  const toneClass =
    tone === "amber"
      ? "text-amber-700 dark:text-amber-500"
      : tone === "emerald"
        ? "text-emerald-700 dark:text-emerald-400"
        : tone === "cyan"
          ? "text-cyan-700 dark:text-cyan-400"
          : tone === "violet"
            ? "text-violet-700 dark:text-violet-400"
            : "text-foreground";
  return (
    <div className="flex justify-between items-center text-sm sm:text-base">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`tabular-nums ${strong ? "font-semibold" : "font-medium"} ${toneClass}`}
      >
        {value}
      </span>
    </div>
  );
}

function RelatedLink({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all"
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm group-hover:text-cyan-600 transition-colors">
          {title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-cyan-600 group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}

function SecciRow({
  label,
  value,
  strong,
  tone,
}: {
  label: string;
  value: string;
  strong?: boolean;
  tone?: "rose" | "amber";
}) {
  const toneClass =
    tone === "rose"
      ? "text-rose-700 dark:text-rose-400"
      : tone === "amber"
        ? "text-amber-700 dark:text-amber-500"
        : "text-foreground";
  return (
    <div className="flex justify-between items-center text-xs sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`tabular-nums ${strong ? "font-bold text-base" : "font-medium"} ${toneClass}`}
      >
        {value}
      </span>
    </div>
  );
}

function RightCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-card border border-emerald-500/20">
      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 mb-2">
        {icon}
        <p className="font-semibold text-sm sm:text-base">{title}</p>
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

export const revalidate = false;
export const dynamic = "force-static";
