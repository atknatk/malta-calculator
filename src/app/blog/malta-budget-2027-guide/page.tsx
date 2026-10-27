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
  Sparkles,
  Calculator,
  PiggyBank,
  Users,
  Globe,
} from "lucide-react";
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";
import { BlogArticleAuthor } from "@/components/blog/blog-article-author";

const SLUG = "malta-budget-2027-guide";
const TITLE = "Malta Budget 2027: Tax Bands, COLA €6.41 & Super Bonus";
const SHORT_TITLE = "Malta Budget 2027 Guide";
const DESCRIPTION =
  "Malta Budget 2027 explained: new family tax bands, €6.41 COLA, €239.85 minimum wage, €1,000 Super Bonus, +€10 pensions and TCN fees, with 2027 tax tables.";

const ARTICLE_SOURCES = [
  {
    name: "Ministry for Finance — Budget 2027",
    url: "https://finance.gov.mt/budget27/",
  },
  {
    name: "CSB Group — Malta Budget 2027: Key Tax Measures",
    url: "https://www.csbgroup.com/articles/malta-budget-measures-2027/",
  },
  {
    name: "Forvis Mazars — Malta Budget 2027",
    url: "https://www.forvismazars.com/mt/en/insights/latest-news/malta-budget-2027",
  },
  {
    name: "PwC Malta — Malta Budget 2027",
    url: "https://www.pwc.com/mt/en/publications/malta-budget/malta-budget-2027.html",
  },
  {
    name: "RSM Malta — Progressive parent tax rates (2025–2028)",
    url: "https://www.rsm.global/malta/news/malta-introduces-progressive-parent-tax-rates-2026-budget",
  },
  {
    name: "MTCA — Tax rates for individuals",
    url: "https://mtca.gov.mt/personal-tax/tax-rates/tax-ratesindividuals",
  },
];

const FAQS = [
  {
    question: "What is the COLA for 2027 in Malta?",
    answer:
      "The cost of living adjustment for 2027 is €6.41 per week (€333.32 a year) for full-time employees, up from €4.66 in 2026. Part-timers get it pro rata. It is added to the basic wage, so it is taxable and subject to SSC.",
  },
  {
    question: "What is the minimum wage in Malta in 2027?",
    answer:
      "The national minimum wage rises by €10.41 a week including COLA, from €229.44 to €239.85 a week for workers aged 18 and over (about €12,472 a year). Minimum-wage earners continue to pay no income tax.",
  },
  {
    question: "Do the tax bands change in 2027?",
    answer:
      "Only for parents and married couples with children. The tax-free band rises to €20,000 for married couples with one child, €30,000 with two or more children, €16,000 for a parent with one child and €24,000 for a parent with two or more. Single, married-without-children and parent-without-children rates are unchanged, and the 35% rate still starts above €60,000.",
  },
  {
    question: "Who gets the €1,000 Super Bonus?",
    answer:
      "People who were employed or self-employed in 2025, including working pensioners and part-timers. Those who earned at least €12,000 receive €1,000 tax-free; lower earners get a reduced amount (€500 to €925). It is paid by the Government in the first quarter of 2027, not through payroll. Final eligibility rules are still awaited.",
  },
  {
    question: "How much do pensions increase in 2027?",
    answer:
      "Retirement, invalidity and widow's pensions rise by €10 a week from January 2027 (including COLA). The tax-free threshold on pension income rises by €520 to €37,624, and the maximum pensionable income for pensioners born before 1962 rises to €28,000.",
  },
  {
    question: "Do social security contributions change in 2027?",
    answer:
      "No. The Budget did not change SSC rates or the retirement age. The weekly maximum Class 1 contribution has stayed at €55.93 (post-1962) since 2024; the Department of Social Security publishes the 2027 table in January.",
  },
];

export const metadata: Metadata = {
  ...defaultMetadata,
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Malta Budget 2027",
    "Malta tax bands 2027",
    "Malta COLA 2027",
    "Malta minimum wage 2027",
    "Malta Super Bonus 2027",
    "Malta pension increase 2027",
    "Malta parent tax rates 2027",
    "Malta married tax rates 2027",
    "Malta budget 2027 summary",
  ],
  alternates: pageAlternates(`/blog/${SLUG}`),
  openGraph: {
    ...ogMetadata,
    title: TITLE,
    url: `${SITE_URL}/blog/${SLUG}`,
    type: "article",
    images: [getBlogOgImage(SHORT_TITLE)],
  },
  twitter: {
    ...twitterMetadata,
    title: TITLE,
  },
};

type Band = [string, string, string];

const BANDS_2027: Array<{ name: string; rows: Band[] }> = [
  {
    name: "Married, 1 child",
    rows: [
      ["€0 – €20,000", "0%", "€0"],
      ["€20,001 – €30,000", "15%", "€3,000"],
      ["€30,001 – €60,000", "25%", "€6,000"],
      ["Over €60,000", "35%", "€12,000"],
    ],
  },
  {
    name: "Married, 2+ children",
    rows: [
      ["€0 – €30,000", "0%", "€0"],
      ["€30,001 – €41,000", "15%", "€4,500"],
      ["€41,001 – €60,000", "25%", "€8,600"],
      ["Over €60,000", "35%", "€14,600"],
    ],
  },
  {
    name: "Parent, 1 child",
    rows: [
      ["€0 – €16,000", "0%", "€0"],
      ["€16,001 – €24,500", "15%", "€2,400"],
      ["€24,501 – €60,000", "25%", "€4,850"],
      ["Over €60,000", "35%", "€10,850"],
    ],
  },
  {
    name: "Parent, 2+ children",
    rows: [
      ["€0 – €24,000", "0%", "€0"],
      ["€24,001 – €33,500", "15%", "€3,600"],
      ["€33,501 – €60,000", "25%", "€6,950"],
      ["Over €60,000", "35%", "€12,950"],
    ],
  },
];

const TH = "p-3 text-left font-semibold";
const TD = "p-3 border-b border-border/50";

export default function MaltaBudget2027GuidePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title={TITLE}
        description={DESCRIPTION}
        slug={SLUG}
        datePublished="2026-10-27"
        sources={ARTICLE_SOURCES}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          { name: SHORT_TITLE, url: `${SITE_URL}/blog/${SLUG}` },
        ]}
      />
      <CustomFAQJsonLd questions={FAQS} />
      <main role="main" aria-label={SHORT_TITLE}>
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
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                  Tax · Budget 2027
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  October 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  10 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Budget 2027: What It Means for Your Salary, Tax and
                Pension
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Finance Minister Clyde Caruana presented Budget 2027 on{" "}
                <strong>26 October 2026</strong>. There are no increases in
                income tax, VAT or social security rates. Families with children
                get the second step of the parent tax cut, every employee gets a{" "}
                <strong>€6.41 weekly COLA</strong>, and 2025 workers receive a
                tax-free <strong>Super Bonus</strong> of up to €1,000.
              </p>
            </header>

            <div className="not-prose mb-10 grid sm:grid-cols-2 gap-4">
              {[
                ["COLA 2027", "€6.41 / week", "€333.32 a year, up from €4.66"],
                ["Minimum wage", "€239.85 / week", "+€10.41 including COLA"],
                ["Super Bonus", "Up to €1,000", "Tax-free, paid Q1 2027"],
                ["Pensions", "+€10 / week", "Tax-free up to €37,624"],
              ].map(([label, value, sub]) => (
                <div
                  key={label}
                  className="p-5 rounded-2xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-primary/20"
                >
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold text-primary">{value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{sub}</p>
                </div>
              ))}
            </div>

            <section id="wages">
              <h2>1. COLA and the minimum wage</h2>
              <p>
                The cost of living adjustment for 2027 is{" "}
                <strong>€6.41 per week</strong> (€333.32 a year) for full-time
                employees, paid pro rata to part-timers. It is part of the basic
                wage, so it is taxed and attracts SSC. The minimum wage goes up
                by <strong>€10.41 a week</strong> including COLA, under the 2023
                agreement, taking the adult rate from €229.44 to{" "}
                <strong>€239.85 a week</strong> (about €12,472 a year). The Low
                Wage Commission will be reappointed to agree increases from
                2028.
              </p>
              <p>
                The statutory bonuses are unchanged: €121.16 weekly allowance in
                March and September and €135.10 statutory bonus in June and
                December. More in our{" "}
                <Link href="/blog/understanding-cola-malta-2026">
                  COLA guide
                </Link>{" "}
                and{" "}
                <Link href="/blog/malta-minimum-wage-2026-guide">
                  minimum wage guide
                </Link>
                .
              </p>
            </section>

            <section id="tax" className="mt-12">
              <h2>2. The 2027 tax bands for families</h2>
              <p>
                Budget 2026 started a three-year cut for working parents. 2027
                is the second step. Single, married-without-children and
                parent-without-children rates do not change, and income above
                €60,000 is still taxed at 35%. The relief is applied through FSS
                automatically, so employers must use the new tables from the
                first 2027 payroll.
              </p>
              <div className="not-prose grid md:grid-cols-2 gap-4 my-8">
                {BANDS_2027.map((cat) => (
                  <div
                    key={cat.name}
                    className="rounded-2xl border border-border overflow-hidden"
                  >
                    <div className="px-4 py-3 bg-muted/40 font-semibold text-sm">
                      {cat.name} — 2027
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr>
                            <th className={TH}>Chargeable income</th>
                            <th className={TH}>Rate</th>
                            <th className={TH}>Subtract</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cat.rows.map((r) => (
                            <tr key={r[0]}>
                              <td className={TD}>{r[0]}</td>
                              <td className={TD}>{r[1]}</td>
                              <td className={TD}>{r[2]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                The tax-free thresholds and maximum savings are from the Budget.
                The 15%/25% limits and subtraction amounts are derived from them
                and match the published examples; check the final MTCA table
                once it is issued.
              </p>

              <h3>How much will you save?</h3>
              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted/40">
                      <th className={TH}>Category</th>
                      <th className={TH}>Tax on €30,000 (2026 → 2027)</th>
                      <th className={TH}>Tax on €42,000 (2026 → 2027)</th>
                      <th className={TH}>Max saving vs 2025</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [
                        "Married, 1 child",
                        "€2,225 → €1,500",
                        "€5,225 → €4,500",
                        "€1,450",
                      ],
                      [
                        "Married, 2+ children",
                        "€1,125 → €0",
                        "€3,925 → €1,900",
                        "€4,050",
                      ],
                      [
                        "Parent, 1 child",
                        "€3,225 → €2,650",
                        "€6,225 → €5,650",
                        "€1,150",
                      ],
                      [
                        "Parent, 2+ children",
                        "€2,175 → €900",
                        "€5,175 → €3,550",
                        "€3,250",
                      ],
                    ].map((r) => (
                      <tr key={r[0]}>
                        {r.map((c, i) => (
                          <td key={i} className={TD}>
                            {i === 0 ? <strong>{c}</strong> : c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                For 2028 the Budget confirmed the final step: tax-free
                thresholds of €22,500 (married, 1 child), €37,000 (married, 2+),
                €18,000 (parent, 1 child) and €30,000 (parent, 2+), worth up to
                €2,175, €6,000, €1,800 and €5,000 a year respectively.
              </p>
              <div className="not-prose my-8 p-6 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-3">
                  <Calculator className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Our salary calculator now has a <strong>2027</strong> year
                    option with the new bands, COLA and minimum wage.
                  </p>
                </div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold whitespace-nowrap hover:opacity-90"
                >
                  Calculate 2027 net pay
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <p>
                Spouses will also file <strong>separate tax returns</strong> by
                default, with joint filing as an option. This changes how you
                file, not how much tax you pay.
              </p>
            </section>

            <section id="super-bonus" className="mt-12">
              <h2>
                <Sparkles className="inline h-6 w-6 mr-2 -mt-1" />
                3. The €1,000 Super Bonus
              </h2>
              <p>
                Anyone who was employed or self-employed in 2025, including
                working pensioners and part-timers, receives a{" "}
                <strong>tax-free</strong> one-off payment in the first quarter
                of 2027, by cheque from the Government (not through payroll):
              </p>
              <ul>
                <li>2025 employment income of €12,000 or more: €1,000</li>
                <li>€11,000 – €11,999: €925</li>
                <li>Lower incomes: reduced amounts down to €500</li>
              </ul>
              <p>
                The full scale and the eligibility of non-EU workers have not
                been published yet; some reports say third-country nationals
                without long-term residence are excluded.
              </p>
            </section>

            <section id="pensions" className="mt-12">
              <h2>
                <PiggyBank className="inline h-6 w-6 mr-2 -mt-1" />
                4. Pensions
              </h2>
              <ul>
                <li>
                  Retirement, invalidity and widow&apos;s pensions:{" "}
                  <strong>+€10 a week</strong> from January 2027 (including
                  COLA)
                </li>
                <li>
                  Tax-free pension income threshold: €37,104 →{" "}
                  <strong>€37,624</strong>
                </li>
                <li>
                  Maximum pensionable income for pensioners born before 1962:
                  €25,500 → <strong>€28,000</strong>
                </li>
                <li>
                  Pension contributions can be transferred between spouses in
                  certain cases; details to follow
                </li>
                <li>Retirement age and contribution rates unchanged</li>
              </ul>
              <p>
                See our{" "}
                <Link href="/blog/malta-pension-system-2026-guide">
                  pension guide
                </Link>{" "}
                and <Link href="/calculators/pension">pension calculator</Link>.
              </p>
            </section>

            <section id="families" className="mt-12">
              <h2>
                <Users className="inline h-6 w-6 mr-2 -mt-1" />
                5. Families, carers and business
              </h2>
              <ul>
                <li>Carers Grant: up to €7,500 a year</li>
                <li>Adoption grant: +€1,000 to €13,000</li>
                <li>Foster parents: 10 extra days of paid leave</li>
                <li>
                  €500 per child in post-secondary education (first half of
                  2027)
                </li>
                <li>
                  Companies with turnover up to €1 million: 25% instead of 35%
                  on profits they retain or reinvest
                </li>
                <li>
                  VAT: fixed administrative penalties (€100 to €500) for missing
                  receipts instead of criminal proceedings
                </li>
              </ul>
            </section>

            <section id="tcn" className="mt-12">
              <h2>
                <Globe className="inline h-6 w-6 mr-2 -mt-1" />
                6. Non-EU workers and tourists
              </h2>
              <p>
                Third-country nationals without long-term residence face a €800
                work permit fee, a new €400 yearly infrastructure contribution,
                an €83 monthly driving licence fee and the end of free public
                transport and (for new registrations) free childcare. Full
                details in our{" "}
                <Link href="/blog/malta-budget-2027-third-country-nationals">
                  Budget 2027 TCN guide
                </Link>{" "}
                and the{" "}
                <Link href="/calculators/tcn-budget-2027">
                  TCN cost calculator
                </Link>
                .
              </p>
              <p>
                The tourist eco-contribution rises to €8 a night (capped at €64)
                in hotels and €10 a night (capped at €80) in short lets from 1
                January 2027.
              </p>
            </section>

            <section id="faqs" className="mt-12">
              <h2>Frequently Asked Questions</h2>
              <div className="not-prose space-y-4">
                {FAQS.map((f) => (
                  <div key={f.question} className="p-4 bg-muted/30 rounded-xl">
                    <h3 className="font-semibold mb-2">{f.question}</h3>
                    <p className="text-sm text-muted-foreground">{f.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <BlogArticleAuthor
              datePublished="2026-10-27"
              sources={ARTICLE_SOURCES}
            />
            <BlogArticleFooter slug={SLUG} title={SHORT_TITLE} />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false;
export const dynamic = "force-static";
