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
} from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";
import { BlogArticleAuthor } from "@/components/blog/blog-article-author";

const ARTICLE_SOURCES = [
  {
    name: "Department of Social Security - Malta",
    url: "https://socialsecurity.gov.mt",
  },
  {
    name: "Malta Tax and Customs Administration (MTCA) - Malta",
    url: "https://mtca.gov.mt",
  },
];

export const metadata: Metadata = {
  ...defaultMetadata,
  title:
    "Malta SSC Contributions 2026: Rates, Caps & Categories Explained | Malta Calculator",
  description:
    "Malta SSC 2026 explained: Class 1 rates (10%), the €55.93 weekly cap, categories A to F, the 1962 birth-year threshold and employer contributions.",
  keywords: [
    "Malta SSC 2026",
    "Malta social security contributions",
    "Malta SSC rates",
    "Malta SSC caps",
    "Malta Class 1 contributions",
    "Malta SSC categories",
    "Malta employer SSC",
    "Malta 1962 age threshold",
  ],
  alternates: pageAlternates("/blog/malta-ssc-contributions-2026-explained"),
  openGraph: {
    ...ogMetadata,
    title: "Malta SSC Contributions 2026: Rates, Caps & Categories Explained",
    url: `${SITE_URL}/blog/malta-ssc-contributions-2026-explained`,
    type: "article",
    images: [
      getBlogOgImage(
        "Malta SSC Contributions 2026: Rates, Caps & Categories Explained",
      ),
    ],
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta SSC Contributions 2026: Rates, Caps & Categories Explained",
  },
};

export default function MaltaSSCPage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta SSC Contributions 2026: Rates, Caps & Categories Explained"
        description="Complete guide to Malta Social Security Contributions (SSC) for 2026 including Class 1 rates and categories."
        slug="malta-ssc-contributions-2026-explained"
        datePublished="2026-01-01"
        dateModified="2026-10-21"
        sources={ARTICLE_SOURCES}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "SSC Contributions 2026",
            url: `${SITE_URL}/blog/malta-ssc-contributions-2026-explained`,
          },
        ]}
      />
      <main role="main" aria-label="Malta SSC Contributions 2026 Guide">
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
                <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm font-semibold rounded-full">
                  SSC Guide
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  January 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />6 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta SSC Contributions 2026: Rates, Caps & Categories Explained
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                A complete guide to Social Security Contributions in Malta for
                2026. Understand your employee contributions, employer share,
                weekly caps, and which category applies to you.
              </p>
            </header>

            <nav className="p-6 bg-muted/30 rounded-2xl mb-12 not-prose">
              <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#what-is-ssc"
                    className="text-primary hover:underline"
                  >
                    1. What is SSC?
                  </a>
                </li>
                <li>
                  <a
                    href="#rates-2026"
                    className="text-primary hover:underline"
                  >
                    2. SSC Rates for 2026
                  </a>
                </li>
                <li>
                  <a
                    href="#categories"
                    className="text-primary hover:underline"
                  >
                    3. SSC Categories (A to F)
                  </a>
                </li>
                <li>
                  <a
                    href="#weekly-caps"
                    className="text-primary hover:underline"
                  >
                    4. Weekly Contribution Caps
                  </a>
                </li>
                <li>
                  <a
                    href="#age-threshold"
                    className="text-primary hover:underline"
                  >
                    5. The 1962 Age Threshold
                  </a>
                </li>
                <li>
                  <a
                    href="#calculation"
                    className="text-primary hover:underline"
                  >
                    6. How SSC is Calculated
                  </a>
                </li>
              </ul>
            </nav>

            <section id="what-is-ssc">
              <h2>1. What is SSC (Social Security Contributions)?</h2>
              <p>
                Social Security Contributions (SSC) in Malta are{" "}
                <strong>mandatory payments</strong> made by both employees and
                employers to fund the national social security system. This
                system provides benefits including:
              </p>
              <ul>
                <li>State pension</li>
                <li>Sickness benefits</li>
                <li>Unemployment benefits</li>
                <li>Maternity/paternity benefits</li>
                <li>Injury benefits</li>
              </ul>
              <p>
                SSC is classified into different &quot;Classes&quot; based on
                your employment status:
              </p>
              <ul>
                <li>
                  <strong>Class 1</strong> - Employed persons (shared between
                  employee and employer)
                </li>
                <li>
                  <strong>Class 2</strong> - Self-employed persons
                </li>
              </ul>
            </section>

            <section id="rates-2026" className="mt-12">
              <h2>2. SSC Rates for 2026</h2>
              <p>
                For <strong>Class 1 (employees)</strong>, the SSC rate for 2026
                is:
              </p>

              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Contributor
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Rate
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">Employee</td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        10%
                      </td>
                      <td className="border border-border p-3">
                        Of basic weekly wage
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">Employer</td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        10%
                      </td>
                      <td className="border border-border p-3">
                        Matching contribution
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Total
                      </td>
                      <td className="border border-border p-3 font-semibold text-secondary">
                        20%
                      </td>
                      <td className="border border-border p-3">
                        Combined contribution
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl not-prose">
                <p className="text-sm">
                  <strong>💡 Important:</strong> SSC is calculated on your{" "}
                  <strong>basic weekly wage</strong>, not including bonuses,
                  overtime, or other allowances. The 10% employee contribution
                  is automatically deducted from your salary.
                </p>
              </div>
            </section>

            <section id="categories" className="mt-12">
              <h2>3. SSC Categories (A to F)</h2>
              <p>
                Class 1 contributions are split into categories based on your{" "}
                <strong>age</strong>, your <strong>basic weekly wage</strong>{" "}
                and, for higher earners, your <strong>date of birth</strong>.
                The official 2026 rates are:
              </p>

              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Category
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Basic Weekly Wage
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Employee (weekly)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        A (under 18)
                      </td>
                      <td className="border border-border p-3">
                        Up to €229.44
                      </td>
                      <td className="border border-border p-3">€6.62</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        B (18 and over)
                      </td>
                      <td className="border border-border p-3">
                        Up to €229.44
                      </td>
                      <td className="border border-border p-3">
                        €22.94 (or 10% of wage if chosen)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        C1 (born up to 31 Dec 1961)
                      </td>
                      <td className="border border-border p-3">
                        €229.45 – €490.38
                      </td>
                      <td className="border border-border p-3">10% of wage</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        D1 (born up to 31 Dec 1961)
                      </td>
                      <td className="border border-border p-3">
                        €490.39 and over
                      </td>
                      <td className="border border-border p-3">€49.04</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        C2 (born from 1 Jan 1962)
                      </td>
                      <td className="border border-border p-3">
                        €229.45 – €559.30
                      </td>
                      <td className="border border-border p-3">10% of wage</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        D2 (born from 1 Jan 1962)
                      </td>
                      <td className="border border-border p-3">
                        €559.31 and over
                      </td>
                      <td className="border border-border p-3">€55.93</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        E / F (students)
                      </td>
                      <td className="border border-border p-3">-</td>
                      <td className="border border-border p-3">
                        10%, max €4.38 (under 18) / €7.94 (18+)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground">
                Source: Department of Social Security Class 1 rates for 2026.
                The employer pays the same amount, plus 0.3% of the basic wage
                to the Maternity Leave Trust Fund (e.g. €1.68/week in category
                D2).
              </p>
            </section>

            <section id="weekly-caps" className="mt-12">
              <h2>4. Weekly Contribution Caps</h2>
              <p>
                SSC contributions are{" "}
                <strong>capped at a maximum weekly amount</strong>. Once your
                basic weekly wage passes the ceiling for your birth-year group,
                your contribution stays fixed no matter how much more you earn.
              </p>

              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Born
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Wage Ceiling (weekly)
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Max Employee SSC
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Annual Max (52 weeks)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">
                        From 1 Jan 1962
                      </td>
                      <td className="border border-border p-3">€559.31</td>
                      <td className="border border-border p-3 font-semibold">
                        €55.93
                      </td>
                      <td className="border border-border p-3">€2,908.36</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Up to 31 Dec 1961
                      </td>
                      <td className="border border-border p-3">€490.39</td>
                      <td className="border border-border p-3 font-semibold">
                        €49.04
                      </td>
                      <td className="border border-border p-3">€2,550.08</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl not-prose">
                <p className="text-sm">
                  <strong>✅ Maximum Annual SSC (2026):</strong> If you were
                  born from 1962 onwards and earn above €559.31 a week (about
                  €29,084 a year), your maximum annual employee SSC is{" "}
                  <strong>€2,908.36</strong> (€55.93 × 52 weeks). In years with
                  53 Mondays, 53 weekly contributions are due.
                </p>
              </div>
            </section>

            <section id="age-threshold" className="mt-12">
              <h2>5. The 1962 Age Threshold</h2>
              <p>
                The <strong>1 January 1962</strong> birthdate is a critical
                threshold in Malta&apos;s SSC system. It determines:
              </p>
              <ul>
                <li>
                  Which higher-wage category you fall into (C1/D1 vs C2/D2)
                </li>
                <li>Your maximum weekly contribution cap</li>
                <li>Your maximum pensionable income and pension rules</li>
              </ul>
              <p>
                <strong>Born on or after 1 Jan 1962:</strong> categories C2/D2,
                with a higher cap (€55.93) and a higher maximum pensionable
                income.
              </p>
              <p>
                <strong>Born before 1 Jan 1962:</strong> categories C1/D1, with
                a lower cap (€49.04).
              </p>
            </section>

            <section id="calculation" className="mt-12">
              <h2>6. How SSC is Calculated</h2>

              <h3>Example: Employee earning €35,000/year (born after 1962)</h3>
              <div className="p-6 bg-muted/30 rounded-xl not-prose my-4">
                <ul className="space-y-2 text-sm">
                  <li>• Annual salary: €35,000</li>
                  <li>• Weekly wage: €35,000 ÷ 52 = €673.08</li>
                  <li>
                    • Weekly wage exceeds €559.31, so{" "}
                    <strong>cap applies</strong> (category D2)
                  </li>
                  <li>• Weekly employee SSC: €55.93 (capped)</li>
                  <li className="pt-2 border-t border-border">
                    <span>Annual SSC = €55.93 × 52 = </span>
                    <strong className="text-primary">€2,908.36</strong>
                  </li>
                </ul>
              </div>

              <h3>Example: Employee earning €20,000/year (born after 1962)</h3>
              <div className="p-6 bg-muted/30 rounded-xl not-prose my-4">
                <ul className="space-y-2 text-sm">
                  <li>• Annual salary: €20,000</li>
                  <li>• Weekly wage: €20,000 ÷ 52 = €384.62</li>
                  <li>
                    • Weekly wage is between €229.45 and €559.30, so 10% applies
                    (category C2)
                  </li>
                  <li>
                    • Weekly employee SSC: €384.62 × 10% ={" "}
                    <strong>€38.46</strong>
                  </li>
                  <li className="pt-2 border-t border-border">
                    <span>Annual SSC = €38.46 × 52 = </span>
                    <strong className="text-primary">€2,000.00</strong>
                  </li>
                </ul>
              </div>
            </section>

            <BlogArticleAuthor
              datePublished="2026-01-01"
              dateModified="2026-10-21"
              sources={ARTICLE_SOURCES}
            />
            <BlogArticleFooter
              slug="malta-ssc-contributions-2026-explained"
              title="Malta SSC Contributions 2026: Rates, Caps & Categories Explained"
              ctaTitle="Calculate Your SSC Automatically"
              ctaDescription="Employees: our Salary Calculator works out your Class 1 SSC. Self-occupied? Use the dedicated Class 2 SSC calculator for SA/SB/SC rates."
              ctaLink="/calculators/self-employed-ssc"
              ctaLinkText="Try Class 2 SSC Calculator"
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
