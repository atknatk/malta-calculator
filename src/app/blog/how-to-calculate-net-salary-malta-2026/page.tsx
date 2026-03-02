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
  Euro,
  CheckCircle,
  Info,
} from "lucide-react";
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "How to Calculate Net Salary in Malta 2026 | Gross to Net Guide",
  description:
    "Step-by-step guide to calculating your net salary in Malta 2026. Learn how income tax, SSC contributions, and COLA affect your take-home pay with real examples.",
  keywords: [
    "calculate net salary malta",
    "malta take home pay",
    "gross to net salary malta",
    "malta salary after tax",
    "net pay calculator malta 2026",
    "how much tax on salary malta",
    "malta payroll calculation",
    "malta income tax calculation example",
  ],
  alternates: {
    canonical: `${SITE_URL}/blog/how-to-calculate-net-salary-malta-2026`,
  },
  openGraph: {
    ...ogMetadata,
    title: "How to Calculate Your Net Salary in Malta (2026 Guide)",
    url: `${SITE_URL}/blog/how-to-calculate-net-salary-malta-2026`,
    type: "article",
    images: [
      getBlogOgImage("How to Calculate Your Net Salary in Malta (2026 Guide)"),
    ],
  },
  twitter: {
    ...twitterMetadata,
    title: "How to Calculate Your Net Salary in Malta (2026 Guide)",
  },
};

export default function HowToCalculateNetSalaryMalta2026Page() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="How to Calculate Your Net Salary in Malta (2026 Guide)"
        description="Complete step-by-step guide to calculating your net salary in Malta for 2026, including income tax brackets, SSC contributions, and COLA adjustments."
        slug="how-to-calculate-net-salary-malta-2026"
        datePublished="2026-03-02"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "How to Calculate Net Salary Malta 2026",
            url: `${SITE_URL}/blog/how-to-calculate-net-salary-malta-2026`,
          },
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "How do I calculate my net salary in Malta?",
            answer:
              "To calculate your Malta net salary: (1) Start with your gross annual salary. (2) Calculate your SSC employee contribution (10% of weekly wage, capped at €55.93/week for post-1962 births). (3) Calculate income tax using Malta's progressive brackets (0-35%) based on your status — single, married, or parent. (4) Subtract both SSC and income tax from gross salary to get net. (5) Add your COLA payments (€512.52/year total) which are tax-free.",
          },
          {
            question: "What is the income tax rate in Malta for 2026?",
            answer:
              "Malta uses a progressive income tax system for 2026. Single taxpayers pay 0% on the first €12,000, 15% from €12,001 to €16,000, 25% from €16,001 to €60,000, and 35% above €60,000. Married taxpayers with no children pay 0% on the first €15,000. A new 2026 feature allows higher thresholds for married couples and single parents with children.",
          },
          {
            question: "How much SSC do I pay in Malta in 2026?",
            answer:
              "As an employee in Malta you pay 10% of your weekly gross wage as SSC (Social Security Contribution). This is capped at €55.93 per week if you were born after 1962 (€49.04/week if born before 1962). Part-time workers earning at or below the minimum wage (€225/week) are capped at €22.94/week. Annual maximum SSC for full-time employees born after 1962 is €2,908.36.",
          },
          {
            question: "What is COLA and how does it affect my salary in Malta?",
            answer:
              "COLA (Cost of Living Adjustment) is a mandatory government-prescribed payment added to employee salaries quarterly. In 2026, COLA is paid in March (€121.16), June (€135.10), September (€121.16), and December (€135.10) — totalling €512.52 per year. COLA is exempt from income tax but is included in your gross salary for SSC purposes.",
          },
          {
            question:
              "Does Malta's 2026 tax system change based on number of children?",
            answer:
              "Yes — 2026 introduced child-sensitive tax brackets in Malta. Married taxpayers with 1 child have a €17,500 tax-free threshold (vs €15,000 without children). Married with 2+ children enjoy a €22,500 tax-free threshold. Single parents with 1 child get €14,500 tax-free (vs €13,000). These higher thresholds can save families up to €1,625/year in income tax.",
          },
          {
            question:
              "What is the difference between gross and net salary in Malta?",
            answer:
              "Gross salary in Malta is your total pay before deductions. Net salary (take-home pay) is what you receive after deducting income tax (FSS) and employee SSC contributions. For a single person earning €30,000 gross in 2026, income tax is €4,100 and SSC is approximately €2,908, giving a net salary of around €22,992 — plus €512 in tax-free COLA payments.",
          },
        ]}
      />
      <main role="main" aria-label="How to Calculate Net Salary in Malta 2026">
        <Shell className="max-w-4xl py-12">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <article className="prose prose-neutral dark:prose-invert max-w-none">
            {/* Header */}
            <header className="mb-12 not-prose">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                  Calculator Guide
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  March 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  10 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                How to Calculate Your Net Salary in Malta (2026 Guide)
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Wondering how much of your Malta salary you actually take home?
                This step-by-step guide explains exactly how to calculate your
                net pay in 2026 — covering income tax (FSS), Social Security
                Contributions (SSC), COLA, and the new child-sensitive tax
                brackets introduced this year.
              </p>
            </header>

            {/* Key Takeaways */}
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl mb-10 not-prose">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-primary">
                  Key Takeaways
                </h2>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  Net salary = Gross salary − Income Tax (FSS) − Employee SSC
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  Malta 2026 income tax rates: 0%, 15%, 25%, 35% — brackets vary
                  by marital status and number of children
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  Employee SSC = 10% of weekly wage, capped at €55.93/week (born
                  after 1962) or €49.04/week (born before 1962)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  COLA (€512.52/year total) is paid quarterly and is tax-exempt
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  New 2026: married with 2+ children enjoy a €22,500 tax-free
                  threshold — up to €1,625/year in savings
                </li>
              </ul>
            </div>

            {/* Table of Contents */}
            <nav className="p-6 bg-muted/30 rounded-2xl mb-12 not-prose">
              <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#formula" className="text-primary hover:underline">
                    1. The Net Salary Formula
                  </a>
                </li>
                <li>
                  <a href="#ssc" className="text-primary hover:underline">
                    2. How Is SSC Calculated in Malta?
                  </a>
                </li>
                <li>
                  <a
                    href="#income-tax"
                    className="text-primary hover:underline"
                  >
                    3. How Is Income Tax (FSS) Calculated?
                  </a>
                </li>
                <li>
                  <a
                    href="#tax-brackets-2026"
                    className="text-primary hover:underline"
                  >
                    4. 2026 Tax Brackets for All Categories
                  </a>
                </li>
                <li>
                  <a href="#cola" className="text-primary hover:underline">
                    5. COLA and Government Bonuses
                  </a>
                </li>
                <li>
                  <a href="#examples" className="text-primary hover:underline">
                    6. Worked Examples
                  </a>
                </li>
                <li>
                  <a
                    href="#comparison"
                    className="text-primary hover:underline"
                  >
                    7. Net Salary Comparison Table
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-primary hover:underline">
                    8. Frequently Asked Questions
                  </a>
                </li>
              </ul>
            </nav>

            {/* Section 1 */}
            <section id="formula">
              <h2>1. The Net Salary Formula</h2>
              <p>
                Calculating your net salary in Malta in 2026 requires three
                steps. The core formula is:
              </p>

              <div className="p-6 bg-muted/40 border border-border rounded-xl not-prose my-6">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="h-5 w-5 text-primary" />
                  <span className="font-bold text-lg">Net Salary Formula</span>
                </div>
                <p className="font-mono text-sm">
                  <strong>Net Annual Salary</strong> = Gross Salary − Employee
                  SSC − Income Tax (FSS)
                </p>
                <p className="font-mono text-sm mt-2">
                  <strong>Take-Home Pay</strong> = Net Annual Salary + COLA
                  Payments (tax-free)
                </p>
              </div>

              <p>The three key deductions from your gross salary are:</p>
              <ul>
                <li>
                  <strong>Employee SSC</strong> — Social Security Contribution,
                  paid to the Department for Social Security (DSS)
                </li>
                <li>
                  <strong>Income Tax (FSS)</strong> — Final Settlement System
                  tax withheld by your employer and paid to the Commissioner for
                  Revenue (CFR)
                </li>
              </ul>
              <p>
                COLA (Cost of Living Adjustment) is{" "}
                <strong>added on top</strong> of your gross salary each quarter
                and is <strong>tax-free</strong>, so it increases your net pay
                without increasing your tax liability.
              </p>
            </section>

            {/* Section 2 */}
            <section id="ssc" className="mt-12">
              <h2>2. How Is SSC Calculated in Malta?</h2>
              <p>
                SSC (Social Security Contributions) in Malta are calculated on a{" "}
                <strong>weekly basis</strong>. As an employee (Class 1
                contributor), you pay{" "}
                <strong>10% of your weekly gross wage</strong>. Your employer
                matches this with an additional 10% (employer&apos;s
                contribution).
              </p>

              <h3>SSC Categories and Weekly Caps (2026)</h3>
              <p>
                The category you fall into depends on your age and whether you
                earn above or below the minimum wage:
              </p>

              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Category
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Who Qualifies
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Max Employee SSC/Week
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Annual Max (52 weeks)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        A
                      </td>
                      <td className="border border-border p-3">
                        Under 18 years old
                      </td>
                      <td className="border border-border p-3">€6.62</td>
                      <td className="border border-border p-3">€344.24</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        B
                      </td>
                      <td className="border border-border p-3">
                        Part-time / at or below minimum wage (€225/week)
                      </td>
                      <td className="border border-border p-3">€22.94</td>
                      <td className="border border-border p-3">€1,192.88</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        C (born after 1962)
                      </td>
                      <td className="border border-border p-3">
                        Full-time, weekly wage above €225
                      </td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        €55.93
                      </td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        €2,908.36
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        C (born before 1962)
                      </td>
                      <td className="border border-border p-3">
                        Full-time, weekly wage above €225, older worker
                      </td>
                      <td className="border border-border p-3">€49.04</td>
                      <td className="border border-border p-3">€2,550.08</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl not-prose my-4">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    <strong>How the cap works:</strong> Employee SSC = 10% of
                    weekly gross wage. If your weekly wage is €576 (above the
                    €559.31 cap for post-1962 births), your SSC is capped at
                    €55.93. The cap applies to the SSC calculation, not your
                    wage. Source:{" "}
                    <a
                      href="https://socialsecurity.gov.mt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      socialsecurity.gov.mt
                    </a>
                  </p>
                </div>
              </div>

              <h3>How to Calculate Your Monthly SSC</h3>
              <p>
                Because Malta uses a <strong>weekly SSC system</strong>, the
                monthly amount varies depending on how many Mondays fall in that
                month (4 or 5). Annually however, there are always 52 weeks:
              </p>
              <ul>
                <li>Annual SSC = Weekly SSC × 52 weeks</li>
                <li>Monthly SSC (average) = Annual SSC ÷ 12</li>
              </ul>

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl not-prose my-4">
                <p className="text-sm">
                  <strong>Example:</strong> If you earn €40,000/year (€769.23
                  weekly), your weekly SSC is capped at €55.93. Annual SSC =
                  €55.93 × 52 = <strong>€2,908.36</strong>. Average monthly SSC
                  = €2,908.36 ÷ 12 = <strong>€242.36/month</strong>.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="income-tax" className="mt-12">
              <h2>3. How Is Income Tax (FSS) Calculated?</h2>
              <p>
                Malta uses a <strong>Final Settlement System (FSS)</strong>,
                where your employer withholds income tax from each paycheck and
                remits it directly to the{" "}
                <a
                  href="https://cfr.gov.mt"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Commissioner for Revenue (CFR)
                </a>
                . At year-end, you file a tax return (Form TA24) to confirm or
                adjust the amounts.
              </p>
              <p>
                Income tax is calculated on your{" "}
                <strong>annual taxable income</strong>, which is your gross
                salary (excluding COLA and statutory bonuses, which are
                tax-free). Malta&apos;s progressive system means higher income
                is taxed at higher rates — but only the portion <em>above</em>{" "}
                each threshold.
              </p>

              <h3>Step-by-Step Income Tax Calculation</h3>
              <ol>
                <li>
                  Determine your <strong>tax computation type</strong>: Single,
                  Married (no children / 1 child / 2+ children), or Parent (no
                  children / 1 child / 2+ children)
                </li>
                <li>
                  Look up your <strong>tax bracket</strong> using the 2026 table
                  below
                </li>
                <li>
                  Apply the rate to each portion of income within the bracket
                </li>
                <li>
                  Sum the tax from each bracket to get your total annual tax
                </li>
              </ol>
            </section>

            {/* Section 4 */}
            <section id="tax-brackets-2026" className="mt-12">
              <h2>4. 2026 Tax Brackets for All Categories</h2>
              <p>
                A major change for 2026 is that Malta introduced{" "}
                <strong>child-sensitive tax brackets</strong>. Married taxpayers
                and single parents with children now benefit from substantially
                higher tax-free thresholds. Source:{" "}
                <a
                  href="https://cfr.gov.mt"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  cfr.gov.mt
                </a>
              </p>

              <h3>Single Taxpayer</h3>
              <div className="overflow-x-auto not-prose my-4">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Annual Income (€)
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Tax Rate
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Max Tax in Band
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">€0 – €12,000</td>
                      <td className="border border-border p-3 font-semibold text-green-600">
                        0%
                      </td>
                      <td className="border border-border p-3">€0</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        €12,001 – €16,000
                      </td>
                      <td className="border border-border p-3 font-semibold text-yellow-600">
                        15%
                      </td>
                      <td className="border border-border p-3">€600</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        €16,001 – €60,000
                      </td>
                      <td className="border border-border p-3 font-semibold text-orange-600">
                        25%
                      </td>
                      <td className="border border-border p-3">€11,000</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">Over €60,000</td>
                      <td className="border border-border p-3 font-semibold text-red-600">
                        35%
                      </td>
                      <td className="border border-border p-3">
                        35% of excess
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>Married Taxpayer (All Scenarios)</h3>
              <div className="overflow-x-auto not-prose my-4">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Income (€)
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        No Children
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        1 Child
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        2+ Children
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">0% band</td>
                      <td className="border border-border p-3 text-green-600 font-semibold">
                        €0–€15,000
                      </td>
                      <td className="border border-border p-3 text-green-600 font-semibold">
                        €0–€17,500
                      </td>
                      <td className="border border-border p-3 text-green-600 font-semibold">
                        €0–€22,500
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">15% band</td>
                      <td className="border border-border p-3 text-yellow-600">
                        €15,001–€23,000
                      </td>
                      <td className="border border-border p-3 text-yellow-600">
                        €17,501–€26,500
                      </td>
                      <td className="border border-border p-3 text-yellow-600">
                        €22,501–€32,000
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">25% band</td>
                      <td className="border border-border p-3 text-orange-600">
                        €23,001–€60,000
                      </td>
                      <td className="border border-border p-3 text-orange-600">
                        €26,501–€60,000
                      </td>
                      <td className="border border-border p-3 text-orange-600">
                        €32,001–€60,000
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">35% band</td>
                      <td className="border border-border p-3 text-red-600">
                        Over €60,000
                      </td>
                      <td className="border border-border p-3 text-red-600">
                        Over €60,000
                      </td>
                      <td className="border border-border p-3 text-red-600">
                        Over €60,000
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>Single Parent Taxpayer (All Scenarios)</h3>
              <div className="overflow-x-auto not-prose my-4">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Income (€)
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        No Children
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        1 Child
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        2+ Children
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">0% band</td>
                      <td className="border border-border p-3 text-green-600 font-semibold">
                        €0–€13,000
                      </td>
                      <td className="border border-border p-3 text-green-600 font-semibold">
                        €0–€14,500
                      </td>
                      <td className="border border-border p-3 text-green-600 font-semibold">
                        €0–€18,500
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">15% band</td>
                      <td className="border border-border p-3 text-yellow-600">
                        €13,001–€17,500
                      </td>
                      <td className="border border-border p-3 text-yellow-600">
                        €14,501–€21,000
                      </td>
                      <td className="border border-border p-3 text-yellow-600">
                        €18,501–€25,500
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">25% band</td>
                      <td className="border border-border p-3 text-orange-600">
                        €17,501–€60,000
                      </td>
                      <td className="border border-border p-3 text-orange-600">
                        €21,001–€60,000
                      </td>
                      <td className="border border-border p-3 text-orange-600">
                        €25,501–€60,000
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">35% band</td>
                      <td className="border border-border p-3 text-red-600">
                        Over €60,000
                      </td>
                      <td className="border border-border p-3 text-red-600">
                        Over €60,000
                      </td>
                      <td className="border border-border p-3 text-red-600">
                        Over €60,000
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl not-prose mt-4">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    <strong>2026 change:</strong> The child-sensitive tax
                    categories only apply from 2026 onwards. In 2025 and
                    earlier, there were only 3 categories (Single, Married,
                    Parent) without child-count distinctions. Source:{" "}
                    <a
                      href="https://cfr.gov.mt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      cfr.gov.mt
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="cola" className="mt-12">
              <h2>5. COLA and Government Bonuses</h2>
              <p>
                In addition to your base salary, Malta employees receive
                mandatory <strong>COLA (Cost of Living Adjustment)</strong>{" "}
                payments. These are set by the government each year based on
                inflation and paid quarterly by your employer as part of your
                payslip.
              </p>

              <h3>2026 COLA Payment Schedule</h3>
              <div className="overflow-x-auto not-prose my-4">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Quarter
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Payment Month
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Amount
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Tax Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">Q1</td>
                      <td className="border border-border p-3">March</td>
                      <td className="border border-border p-3 font-semibold">
                        €121.16
                      </td>
                      <td className="border border-border p-3 text-green-600 font-semibold">
                        Tax-free
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">Q2</td>
                      <td className="border border-border p-3">June</td>
                      <td className="border border-border p-3 font-semibold">
                        €135.10
                      </td>
                      <td className="border border-border p-3 text-green-600 font-semibold">
                        Tax-free
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">Q3</td>
                      <td className="border border-border p-3">September</td>
                      <td className="border border-border p-3 font-semibold">
                        €121.16
                      </td>
                      <td className="border border-border p-3 text-green-600 font-semibold">
                        Tax-free
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">Q4</td>
                      <td className="border border-border p-3">December</td>
                      <td className="border border-border p-3 font-semibold">
                        €135.10
                      </td>
                      <td className="border border-border p-3 text-green-600 font-semibold">
                        Tax-free
                      </td>
                    </tr>
                    <tr className="border-t-2 border-primary/30">
                      <td
                        className="border border-border p-3 font-bold"
                        colSpan={2}
                      >
                        Annual Total
                      </td>
                      <td className="border border-border p-3 font-bold text-primary">
                        €512.52
                      </td>
                      <td className="border border-border p-3 text-green-600 font-bold">
                        All tax-free
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                COLA is paid by your employer as part of your monthly payslip in
                the relevant months. Because it is{" "}
                <strong>exempt from income tax</strong>, it increases your
                actual take-home pay by the full €512.52 over the year —
                regardless of your tax bracket.
              </p>

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl not-prose my-4">
                <p className="text-sm">
                  <strong>Note:</strong> COLA is separate from any contractual
                  annual pay rises your employer may give. All employees in
                  Malta are entitled to COLA — it is a statutory minimum
                  increase, not a discretionary bonus. Read more in our{" "}
                  <Link
                    href="/blog/understanding-cola-malta-2026"
                    className="underline text-primary"
                  >
                    COLA guide
                  </Link>
                  .
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="examples" className="mt-12">
              <h2>6. Worked Examples</h2>
              <p>
                Let&apos;s work through three real-world scenarios to show how
                the calculation looks in practice. All figures are for 2026 and
                assume the employee was born after 1962 (Category C New SSC).
              </p>

              <h3>Example 1: Single Taxpayer — €30,000 Gross</h3>
              <div className="p-6 bg-muted/30 rounded-xl not-prose my-4">
                <div className="flex items-center gap-2 mb-4">
                  <Euro className="h-5 w-5 text-primary" />
                  <span className="font-semibold">
                    Annual Gross Salary: €30,000
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-muted-foreground mb-1">
                      Step 1 — SSC Calculation:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>
                        Weekly wage: €30,000 ÷ 52 = <strong>€576.92</strong>
                      </li>
                      <li>
                        €576.92 &gt; €559.31 cap → SSC capped at{" "}
                        <strong>€55.93/week</strong>
                      </li>
                      <li>
                        Annual SSC: €55.93 × 52 ={" "}
                        <strong className="text-red-600">€2,908.36</strong>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-muted-foreground mb-1">
                      Step 2 — Income Tax (Single):
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>
                        €0–€12,000 @ 0% = <strong>€0</strong>
                      </li>
                      <li>
                        €12,001–€16,000 (€4,000) @ 15% = <strong>€600</strong>
                      </li>
                      <li>
                        €16,001–€30,000 (€14,000) @ 25% ={" "}
                        <strong>€3,500</strong>
                      </li>
                      <li className="font-bold">
                        Total Income Tax ={" "}
                        <strong className="text-red-600">€4,100</strong>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <p className="font-semibold text-muted-foreground mb-1">
                      Step 3 — Net Salary:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>
                        Gross: €30,000 − Income Tax: €4,100 − SSC: €2,908.36
                      </li>
                      <li className="font-bold text-lg">
                        Net Annual:{" "}
                        <strong className="text-primary">€22,991.64</strong>
                      </li>
                      <li>
                        + COLA: €512.52 (tax-free) →{" "}
                        <strong className="text-green-600">
                          Total Take-Home: €23,504.16
                        </strong>
                      </li>
                      <li className="text-muted-foreground">
                        Monthly net: ≈ <strong>€1,958.68</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <h3>Example 2: Married with 2 Children — €45,000 Gross</h3>
              <div className="p-6 bg-muted/30 rounded-xl not-prose my-4">
                <div className="flex items-center gap-2 mb-4">
                  <Euro className="h-5 w-5 text-primary" />
                  <span className="font-semibold">
                    Annual Gross Salary: €45,000 | Status: Married, 2 Children
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-muted-foreground mb-1">
                      Step 1 — SSC:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>
                        Weekly wage: €45,000 ÷ 52 = €865.38 &gt; cap →{" "}
                        <strong>€55.93/week</strong>
                      </li>
                      <li>
                        Annual SSC ={" "}
                        <strong className="text-red-600">€2,908.36</strong>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-muted-foreground mb-1">
                      Step 2 — Income Tax (Married, 2+ children):
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>
                        €0–€22,500 @ 0% = <strong>€0</strong>
                      </li>
                      <li>
                        €22,501–€32,000 (€9,500) @ 15% = <strong>€1,425</strong>
                      </li>
                      <li>
                        €32,001–€45,000 (€13,000) @ 25% ={" "}
                        <strong>€3,250</strong>
                      </li>
                      <li className="font-bold">
                        Total Income Tax ={" "}
                        <strong className="text-red-600">€4,675</strong>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <p className="font-semibold text-muted-foreground mb-1">
                      Step 3 — Net Salary:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>€45,000 − €4,675 − €2,908.36</li>
                      <li className="font-bold text-lg">
                        Net Annual:{" "}
                        <strong className="text-primary">€37,416.64</strong>
                      </li>
                      <li>
                        + COLA: €512.52 →{" "}
                        <strong className="text-green-600">
                          Total Take-Home: €37,929.16
                        </strong>
                      </li>
                      <li className="text-muted-foreground">
                        Monthly net: ≈ <strong>€3,160.76</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <h3>Example 3: Single Taxpayer — €60,000 Gross</h3>
              <div className="p-6 bg-muted/30 rounded-xl not-prose my-4">
                <div className="flex items-center gap-2 mb-4">
                  <Euro className="h-5 w-5 text-primary" />
                  <span className="font-semibold">
                    Annual Gross Salary: €60,000 | Status: Single
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-muted-foreground mb-1">
                      SSC: €55.93/week × 52 ={" "}
                      <strong className="text-red-600">€2,908.36</strong>
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-muted-foreground mb-1">
                      Income Tax (Single):
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>€0–€12,000 @ 0% = €0</li>
                      <li>€12,001–€16,000 @ 15% = €600</li>
                      <li>€16,001–€60,000 (€44,000) @ 25% = €11,000</li>
                      <li className="font-bold">
                        Total Tax ={" "}
                        <strong className="text-red-600">€11,600</strong>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <li className="font-bold text-lg">
                      Net Annual:{" "}
                      <strong className="text-primary">€45,491.64</strong>
                    </li>
                    <li>
                      + COLA →{" "}
                      <strong className="text-green-600">
                        Total Take-Home: €46,004.16
                      </strong>
                    </li>
                    <li className="text-muted-foreground">
                      Effective tax rate: 19.3% (combined tax + SSC)
                    </li>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="comparison" className="mt-12">
              <h2>7. Net Salary Comparison Table</h2>
              <p>
                The table below compares annual net salaries across different
                income levels and tax statuses for 2026. All figures assume
                employee born after 1962 (Category C New SSC) and include the
                annual COLA of €512.52.
              </p>

              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-primary/10">
                      <th className="border border-border p-3 text-left font-semibold">
                        Gross Salary
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Single
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Married (no children)
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Married (2+ children)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        €15,000
                      </td>
                      <td className="border border-border p-3">€12,867</td>
                      <td className="border border-border p-3">€13,017</td>
                      <td className="border border-border p-3 text-green-600 font-semibold">
                        €13,017
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        €25,000
                      </td>
                      <td className="border border-border p-3">€20,342</td>
                      <td className="border border-border p-3">€20,642</td>
                      <td className="border border-border p-3 text-green-600 font-semibold">
                        €20,792
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        €35,000
                      </td>
                      <td className="border border-border p-3">€28,342</td>
                      <td className="border border-border p-3">€28,792</td>
                      <td className="border border-border p-3 text-green-600 font-semibold">
                        €29,792
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        €50,000
                      </td>
                      <td className="border border-border p-3">€37,342</td>
                      <td className="border border-border p-3">€38,092</td>
                      <td className="border border-border p-3 text-green-600 font-semibold">
                        €39,342
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        €70,000
                      </td>
                      <td className="border border-border p-3">€49,842</td>
                      <td className="border border-border p-3">€50,342</td>
                      <td className="border border-border p-3 text-green-600 font-semibold">
                        €51,592
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl not-prose my-4">
                <p className="text-sm">
                  <strong>Note:</strong> These figures are approximate and
                  include COLA (€512.52). They assume standard deductions only.
                  For a precise calculation tailored to your situation, use our{" "}
                  <Link
                    href="/salary"
                    className="underline text-primary font-semibold"
                  >
                    Malta Salary Calculator
                  </Link>
                  .
                </p>
              </div>
            </section>

            {/* CTA Box */}
            <div className="mt-12 p-8 bg-gradient-to-br from-primary/10 via-background to-secondary/5 border border-primary/20 rounded-3xl not-prose">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">
                  Calculate Your Exact Net Salary
                </h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Use the free Malta Salary Calculator to get your precise
                take-home pay for any gross salary, tax status, and number of
                children — with a full monthly breakdown and COLA included.
              </p>
              <Link
                href="/salary"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
              >
                Open Malta Salary Calculator
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* FAQ Section */}
            <section id="faq" className="mt-12">
              <h2>8. Frequently Asked Questions</h2>

              <h3>How do I calculate my net salary in Malta?</h3>
              <p>
                Start with your gross annual salary. Subtract employee SSC (10%
                of weekly wage, capped at €55.93/week for post-1962 births).
                Then subtract income tax using the 2026 progressive brackets for
                your status (single/married/parent and number of children). The
                result is your net salary. Add COLA (€512.52/year, tax-free) to
                get total take-home pay.
              </p>

              <h3>What percentage of my Malta salary goes to tax?</h3>
              <p>
                Your effective tax rate depends on your income and status.
                Combined income tax + SSC effective rates in 2026:
              </p>
              <ul>
                <li>€20,000 gross (single): ~17% combined rate</li>
                <li>€35,000 gross (single): ~22% combined rate</li>
                <li>€50,000 gross (single): ~25% combined rate</li>
                <li>€70,000 gross (single): ~29% combined rate</li>
              </ul>

              <h3>Does my employer also pay SSC?</h3>
              <p>
                Yes. Your employer contributes an equal amount of SSC (10% of
                your weekly wage, same caps). This employer contribution does
                not come out of your salary — it&apos;s an additional cost borne
                by the company. For more details, see our{" "}
                <Link href="/blog/malta-employer-cost-hiring-guide-2026">
                  Malta Employer Cost guide
                </Link>
                .
              </p>

              <h3>Is COLA taxable in Malta?</h3>
              <p>
                No. COLA (Cost of Living Adjustment) payments are exempt from
                income tax in Malta. You receive the full €512.52 in 2026
                without any tax deduction. Learn more in our{" "}
                <Link href="/blog/understanding-cola-malta-2026">
                  COLA guide
                </Link>
                .
              </p>

              <h3>What changed in Malta&apos;s 2026 tax system?</h3>
              <p>
                The major 2026 change is child-sensitive tax brackets. For the
                first time, your number of dependent children affects your
                income tax brackets — not just whether you are married or a
                parent. Married couples with 2+ children now have a €22,500
                tax-free threshold (vs €12,000 for single). This can save
                families up to €1,625/year. See the{" "}
                <Link href="/blog/malta-budget-2026-family-tax-savings-guide">
                  Malta Budget 2026 guide
                </Link>{" "}
                for all changes.
              </p>

              <h3>How do I check if my employer is deducting the right tax?</h3>
              <p>
                You can verify your deductions by using the{" "}
                <Link href="/salary">Malta Salary Calculator</Link> with your
                exact gross salary and tax status. At year-end, review your FS3
                form (issued by your employer) and file your TA24 return through
                the{" "}
                <a
                  href="https://cfr.gov.mt"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CFR online portal
                </a>{" "}
                to confirm or claim a refund. See our{" "}
                <Link href="/blog/malta-tax-refund-guide-2026">
                  Malta Tax Refund guide
                </Link>
                .
              </p>
            </section>

            {/* Related Guides */}
            <section className="mt-12 not-prose">
              <h2 className="text-2xl font-bold mb-6">Related Guides</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    href: "/blog/malta-tax-rates-2026-complete-guide",
                    title: "Malta Tax Rates 2026: Complete Guide",
                    desc: "Full breakdown of all income tax brackets and thresholds",
                  },
                  {
                    href: "/blog/malta-ssc-contributions-2026-explained",
                    title: "Malta SSC Contributions 2026",
                    desc: "Rates, caps, and categories explained in detail",
                  },
                  {
                    href: "/blog/understanding-cola-malta-2026",
                    title: "Understanding COLA in Malta 2026",
                    desc: "What COLA is and how it affects your take-home pay",
                  },
                  {
                    href: "/blog/malta-budget-2026-family-tax-savings-guide",
                    title: "Malta Budget 2026: Family Tax Savings",
                    desc: "New child-sensitive brackets and what they save you",
                  },
                ].map((guide) => (
                  <Link
                    key={guide.href}
                    href={guide.href}
                    className="p-4 border border-border rounded-xl hover:border-primary/50 hover:bg-muted/30 transition-colors group"
                  >
                    <h3 className="font-semibold group-hover:text-primary transition-colors mb-1">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {guide.desc}
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            <BlogArticleFooter
              slug="how-to-calculate-net-salary-malta-2026"
              title="How to Calculate Your Net Salary in Malta (2026 Guide)"
              ctaDescription="Get your exact net salary in seconds — try the free Malta Salary Calculator with accurate 2026 tax brackets, SSC, and COLA."
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false;
export const dynamic = "force-static";
