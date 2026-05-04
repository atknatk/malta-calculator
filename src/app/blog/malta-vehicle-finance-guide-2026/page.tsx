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

export const revalidate = false;
export const dynamic = "force-static";
