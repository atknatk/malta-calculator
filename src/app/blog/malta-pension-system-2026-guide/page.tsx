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
import { Budget2027Update } from "@/app/blog/_shared/budget-2027-update";

const ARTICLE_SOURCES = [
  {
    name: "Department of Social Security - Pensions",
    url: "https://socialsecurity.gov.mt/en/pensions/",
  },
  {
    name: "DSS - Pensions Information (2026)",
    url: "https://socialsecurity.gov.mt/en/information-and-applications-for-benefits-and-services/contributory-pensions/retirement-pension/pensions-information",
  },
  {
    name: "DSS - Pension enhancements timeline",
    url: "https://socialsecurity.gov.mt/en/timeline/pension-enhancements/",
  },
  {
    name: "MTCA - Tax exemption on pension income after 61",
    url: "https://mtca.gov.mt/personal-tax/pensioners/tax-exemption-on-pension-income-received-after-61-years-of-age",
  },
  {
    name: "Legal Notice 53 of 2026",
    url: "https://legislation.mt/eli/ln/2026/53/eng",
  },
];

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Malta Pension System 2026: State Pension Guide | Malta Calculator",
  description:
    "Malta pension system 2026 explained. State pension eligibility, contribution requirements, two-thirds pension, minimum pension rates, and retirement age.",
  keywords: [
    "Malta pension",
    "Malta state pension",
    "Malta retirement",
    "Malta pension age",
    "Malta two-thirds pension",
  ],
  alternates: pageAlternates("/blog/malta-pension-system-2026-guide"),
  openGraph: {
    ...ogMetadata,
    title: "Malta Pension System 2026: Complete Guide",
    url: `${SITE_URL}/blog/malta-pension-system-2026-guide`,
    type: "article",
    images: [getBlogOgImage("Malta Pension System 2026: Complete Guide")],
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Pension System 2026: Complete Guide",
  },
};

export default function MaltaPensionSystemPage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Pension System 2026: State Pension Guide"
        description="Complete guide to Malta's state pension system, eligibility, and contribution requirements."
        slug="malta-pension-system-2026-guide"
        datePublished="2026-01-01"
        dateModified="2026-10-27"
        sources={ARTICLE_SOURCES}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Pension System",
            url: `${SITE_URL}/blog/malta-pension-system-2026-guide`,
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
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-sm font-semibold rounded-full">
                  Retirement
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> January 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> 8 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Pension System 2026: State Pension Guide
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Understanding Malta&apos;s state pension system and how to
                maximize your retirement benefits.
              </p>
            </header>

            <Budget2027Update
              title="Pensions in 2027 (Budget 2027)"
              items={[
                <>
                  Retirement, invalidity and widow's pensions rise by{" "}
                  <strong>€10 a week</strong> from January 2027 (including COLA)
                </>,
                <>
                  Tax-free pension income threshold rises by €520 to{" "}
                  <strong>€37,624</strong>
                </>,
                <>
                  Maximum pensionable income for pensioners born before 1962
                  rises to <strong>€28,000</strong>
                </>,
                <>
                  Retirement age and contribution rates are unchanged; pension
                  contributions can be transferred between spouses in certain
                  cases
                </>,
              ]}
            />

            <section id="types">
              <h2>Types of State Pension</h2>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3">Type</th>
                      <th className="border border-border p-3">Requirement</th>
                      <th className="border border-border p-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Two-Thirds Pension
                      </td>
                      <td className="border border-border p-3">
                        Full contribution history
                      </td>
                      <td className="border border-border p-3 text-primary">
                        Up to two-thirds of pensionable income
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        National Minimum Pension
                      </td>
                      <td className="border border-border p-3">
                        Minimum contributions
                      </td>
                      <td className="border border-border p-3">
                        Set yearly by DSS (+€10/week for all pensions in 2026)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="retirement-age" className="mt-12">
              <h2>Retirement Age</h2>
              <p>Retirement age in Malta depends on your year of birth:</p>
              <ul>
                <li>
                  Born before 1952: <strong>61 years</strong> (60 for women)
                </li>
                <li>
                  Born 1952-1955: <strong>62 years</strong>
                </li>
                <li>
                  Born 1956-1958: <strong>63 years</strong>
                </li>
                <li>
                  Born 1959-1961: <strong>64 years</strong>
                </li>
                <li>
                  Born 1962 onwards: <strong>65 years</strong>
                </li>
              </ul>
            </section>

            <section id="contributions" className="mt-12">
              <h2>Contribution Requirements</h2>
              <p>To qualify for a contributory pension you need:</p>
              <ul>
                <li>
                  <strong>Minimum 10 years</strong> (520 weeks) of paid
                  contributions for a reduced, pro-rata pension. If you were
                  born from 1962 you also need 12 years in total, of which up to
                  2 can be credited
                </li>
                <li>
                  For the <strong>full</strong> two-thirds pension: 30 years
                  (born before 1952), 35 years (born 1952-1961), 40 years (born
                  1962-1968), 41 years (born 1969-1975) or{" "}
                  <strong>42 years</strong> (born 1976 or later)
                </li>
                <li>
                  Contributions from employment, self-employment, or credits
                </li>
              </ul>
            </section>

            <section id="calculation" className="mt-12">
              <h2>How Pension is Calculated</h2>
              <p>The two-thirds pension is based on:</p>
              <ul>
                <li>
                  Born before 1962: average of your{" "}
                  <strong>best 3 consecutive years</strong> in the last 10 (11,
                  12 or 13 if you retire at 62, 63 or 64)
                </li>
                <li>
                  Born from 1962: average of your{" "}
                  <strong>best 10 calendar years</strong> in the last 40
                </li>
                <li>
                  Subject to a <strong>maximum pensionable income</strong>{" "}
                  (2026: €25,500 if born before 1962, €29,083.36 if born from
                  1962)
                </li>
                <li>Pro-rata reduction for incomplete contribution years</li>
              </ul>
              <p>
                The <strong>maximum pension in 2026</strong> is therefore about
                €19,389 a year (€373 a week) if you were born from 1962, and
                €17,000 a year (€327 a week) if you were born before 1962.
              </p>
            </section>

            <section id="credits" className="mt-12">
              <h2>Contribution Credits</h2>
              <ul>
                <li>
                  <strong>Child-rearing credits</strong> (born from 1962): 4
                  years for each of the first 3 children; 2 years from the 4th
                  child if you return to work for at least as long. Doubled for
                  a child with a disability. From 2026, credits for the first
                  three children run to the child&apos;s 10th year
                </li>
                <li>
                  Born 1952-1961: 2 years per child for the first 3 children, 1
                  year from the 4th
                </li>
                <li>
                  <strong>Study credits</strong>: credited weeks for each year
                  of full-time study, e.g. 26 weeks a year at MQF level 6-7 and
                  52 weeks a year at level 8 (born from 1962)
                </li>
                <li>
                  From 2026 you can pay up to <strong>5 years</strong> of
                  missing contributions to reach the 10-year minimum, even if
                  you are no longer working
                </li>
              </ul>
            </section>

            <section id="early-and-deferred" className="mt-12">
              <h2>Retiring at 61 or Deferring</h2>
              <p>
                With the full number of paid contribution years for your birth
                year you can retire from <strong>age 61</strong>, provided you
                do not work until your statutory pension age. The pension is not
                reduced. If you qualify but wait, the pension is increased for
                life:
              </p>
              <ul>
                <li>Claim at 62: +6.5%</li>
                <li>Claim at 63: +13.5%</li>
                <li>Claim at 64: +21%</li>
                <li>Claim at 65: +29%</li>
              </ul>
              <p>There is no extra increase for claiming after age 65.</p>
            </section>

            <section id="tax" className="mt-12">
              <h2>Tax on Pensions and Private Pensions</h2>
              <ul>
                <li>
                  From basis year 2026, the total pension income of people aged
                  61+ (state, service, occupational, private and foreign) is{" "}
                  <strong>100% tax-exempt up to €37,104</strong> a year (LN 53
                  of 2026). Other income, such as a salary, is taxed normally
                </li>
                <li>
                  The old pensioners&apos; tax rebate ended for income after 31
                  December 2025
                </li>
                <li>
                  <strong>Personal Retirement Scheme</strong>: 25% tax credit on
                  contributions up to €3,000 (max €750 a year). Voluntary
                  occupational pension schemes get a separate 25% credit, also
                  capped at €750 for the employee
                </li>
              </ul>
            </section>

            <section id="changes-2026" className="mt-12">
              <h2>What Changed in 2026</h2>
              <ul>
                <li>
                  All retirement, invalidity, widow&apos;s and age pensions rose
                  by <strong>€10 per week</strong> (€4.66 COLA plus €5.34)
                </li>
                <li>
                  People born from 1976 need <strong>42 years</strong> of
                  contributions for a full pension (previously 41)
                </li>
                <li>
                  The maximum pensionable income rose to €29,083.36 (born from
                  1962) and €25,500 (born before 1962)
                </li>
                <li>
                  Pension income of people aged 61+ is now{" "}
                  <strong>fully exempt from income tax</strong> up to a cap of
                  about €37,104 a year (it was 80% exempt in 2025)
                </li>
              </ul>
            </section>

            <section id="budget-2027" className="mt-12">
              <h2>What to Watch in Budget 2027</h2>
              <p>
                Budget 2027 is presented on 26 October 2026. The government has
                already ruled out raising the pension age or contribution rates,
                but expect a new weekly pension increase plus COLA, a higher
                maximum pensionable income for those born before 1962 (to be
                equalised by 2028), a uniform €21.53 weekly cost-of-living bonus
                for all pensioners and a reform of widows&apos; pensions. We
                will update this guide once the measures are published.
              </p>
            </section>

            <BlogArticleAuthor
              datePublished="2026-01-01"
              dateModified="2026-10-27"
              sources={ARTICLE_SOURCES}
            />
            <BlogArticleFooter
              slug="malta-pension-system-2026-guide"
              title="Malta Pension System 2026: Complete Guide"
              ctaTitle="Plan Your Retirement"
              ctaLink="/calculators/pension"
              ctaLinkText="Try Pension Calculator"
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
