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
  AlertCircle,
  Bus,
  Baby,
  Car,
  FileText,
  Calculator,
  Building2,
} from "lucide-react";
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";
import { BlogArticleAuthor } from "@/components/blog/blog-article-author";

const SLUG = "malta-budget-2027-third-country-nationals";
const TITLE = "Malta Budget 2027 for TCNs: New Fees & Lost Benefits";
const SHORT_TITLE = "Malta Budget 2027 for Third-Country Nationals";
const DESCRIPTION =
  "Budget 2027 hits non-EU workers in Malta: €800 permit fee, €400 yearly infrastructure levy, €83/month licence fee, no free bus or childcare. Dates, exemptions.";

const ARTICLE_SOURCES = [
  {
    name: "Ministry for Finance — Budget 2027",
    url: "https://finance.gov.mt/budget27/",
  },
  {
    name: "Identità — Renewal of Single Permit (current €150 fee)",
    url: "https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/employment-related-permits/single-permit/renewal-of-single-permit/",
  },
  {
    name: "CSB Group — Malta Budget 2027: Key Tax Measures",
    url: "https://www.csbgroup.com/articles/malta-budget-measures-2027/",
  },
  {
    name: "MaltaToday — Budget 2027: more fees, less benefits for third-country nationals",
    url: "https://www.maltatoday.com.mt/news/budget-2027/145287/budget_2027__more_fees_less_benefits_for_thirdcountry_nationals",
  },
  {
    name: "TVMnews — Budget 2027: higher work permit fees",
    url: "https://tvmnews.mt/en/news/budget-2027-higher-tourist-taxes-work-permit-fees-and-gozo-ferry-fees-for-non-residents/",
  },
];

const FAQS = [
  {
    question: "When do the Budget 2027 TCN measures start?",
    answer:
      "They were announced in the Budget speech on 26 October 2026 and apply from 1 January 2027. The exact rules will be set by legal notices that had not been published at the time of writing, so details can still change.",
  },
  {
    question: "How much is a Malta work permit in 2027?",
    answer:
      "A new single permit application rises from €600 to €800. On top of that, a new €400 annual infrastructure contribution is charged on new applications and on every renewal. The renewal fee remains €150, so a renewal costs €550 a year in total. Under-18s are exempt from the contribution.",
  },
  {
    question: "Who keeps free public transport and free childcare?",
    answer:
      "Maltese and Gozitan citizens, resident EU citizens and long-term residents. Third-country nationals without long-term residence lose free Tallinja travel and the atypical working hours cheque, and cannot register a new child for free childcare. Children already enrolled keep their place.",
  },
  {
    question: "What is the €83 driving licence fee?",
    answer:
      "A monthly administrative fee of €83 (about €996 a year) on Category B and B1 licences issued to or renewed by third-country nationals from 2027. EU/EEA citizens, long-term residents and their spouses, UK, Australian and UAE citizens, and people whose permit is for a driving job are reported as exempt. Renewal is blocked while the fee is unpaid.",
  },
  {
    question: "Can I keep driving on my foreign licence in Malta?",
    answer:
      "Residence permit holders can use their non-EU licence for 12 months from arrival, and from 2027 that period no longer restarts when you leave Malta and come back. For people already in Malta, the 12 months count from their last entry before 1 January 2027. After that you need a Maltese or EU licence.",
  },
  {
    question: "Do long-term residents pay the new fees?",
    answer:
      "No. Long-term residence status (usually after five years of legal residence plus income, accommodation and integration conditions) keeps access to free transport, childcare and the atypical cheque, and exempts you and your spouse from the €83 licence fee. Living in Malta for five years does not grant the status automatically: you must apply.",
  },
];

export const metadata: Metadata = {
  ...defaultMetadata,
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Malta Budget 2027 TCN",
    "Malta third country nationals 2027",
    "Malta work permit fee 2027",
    "Malta infrastructure contribution €400",
    "Malta €83 driving licence fee",
    "Malta free public transport TCN",
    "Malta free childcare TCN",
    "Malta atypical hours cheque",
    "Malta foreign driving licence 12 months",
    "Malta long-term residence benefits",
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

function Row({ cells }: { cells: React.ReactNode[] }) {
  return (
    <tr className="border-b border-border/50">
      {cells.map((c, i) => (
        <td key={i} className="p-3 align-top">
          {c}
        </td>
      ))}
    </tr>
  );
}

export default function MaltaBudget2027TcnPage() {
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
                <span className="px-3 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-semibold rounded-full">
                  Immigration · Budget 2027
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  October 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />9 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Budget 2027 for Third-Country Nationals: Every New Fee and Lost
                Benefit
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Malta&apos;s Budget 2027, presented on{" "}
                <strong>26 October 2026</strong>, makes living and working in
                Malta noticeably more expensive for non-EU workers without
                long-term residence. Work permits cost more, a new{" "}
                <strong>€400 yearly infrastructure contribution</strong> is
                introduced, and free buses, free childcare and the atypical
                hours cheque are reserved for citizens, EU nationals and
                long-term residents from <strong>1 January 2027</strong>.
              </p>
            </header>

            <div className="not-prose mb-10 p-6 rounded-2xl bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-rose-500/10 border border-rose-500/20">
              <div className="flex gap-3">
                <AlertCircle className="h-6 w-6 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    The changes at a glance (from 1 January 2027)
                  </h2>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>
                      • New work permit application:{" "}
                      <strong>€600 → €800</strong>
                    </li>
                    <li>
                      • New <strong>€400 per year</strong> infrastructure
                      contribution on new permits and renewals (under-18s
                      exempt)
                    </li>
                    <li>
                      • <strong>€83 per month</strong> administrative fee on
                      Category B/B1 driving licences issued or renewed from 2027
                    </li>
                    <li>
                      • Free public transport, the atypical hours cheque and
                      free childcare (new registrations) limited to Maltese, EU
                      citizens and long-term residents
                    </li>
                    <li>
                      • Foreign licence valid for 12 months from arrival, with
                      no reset when you re-enter Malta
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="not-prose mb-12 p-6 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-3">
                <Calculator className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">
                    What will it cost your household?
                  </strong>{" "}
                  Enter your permit, transport, driving and childcare situation
                  and get your extra 2027 cost.
                </p>
              </div>
              <Link
                href="/calculators/tcn-budget-2027"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold whitespace-nowrap hover:opacity-90"
              >
                Open calculator
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <section id="who">
              <h2>Who is affected?</h2>
              <p>
                The measures target{" "}
                <strong>third-country nationals (TCNs)</strong> — people who are
                not citizens of an EU/EEA country or Switzerland — who live in
                Malta on a single permit or another residence permit and do{" "}
                <strong>not</strong> hold long-term residence status. The
                Government&apos;s line is that foreign workers remain welcome
                but should &quot;contribute towards the country for what they
                receive back, including the use of infrastructure&quot;.
              </p>
              <p>
                <strong>Not affected:</strong> Maltese and Gozitan citizens,
                EU/EEA citizens living in Malta, and long-term residents.
                Reports mention five years of residence, but long-term status is
                not automatic: you need to apply and meet the income,
                accommodation and integration conditions.
              </p>
            </section>

            <section id="permits" className="mt-12">
              <h2>
                1. Work permit fees and the €400 infrastructure contribution
              </h2>
              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="p-3 text-left">Item</th>
                      <th className="p-3 text-left">2026</th>
                      <th className="p-3 text-left">From 2027</th>
                    </tr>
                  </thead>
                  <tbody>
                    <Row
                      cells={[
                        "New single permit application",
                        "€600",
                        <strong key="a">€800</strong>,
                      ]}
                    />
                    <Row
                      cells={[
                        "Single permit renewal fee",
                        "€150",
                        "€150 (no change announced)",
                      ]}
                    />
                    <Row
                      cells={[
                        "Infrastructure contribution",
                        "—",
                        <strong key="b">€400 per person, every year</strong>,
                      ]}
                    />
                    <Row
                      cells={[
                        "First year, new worker",
                        "€600",
                        <strong key="c">€1,200</strong>,
                      ]}
                    />
                    <Row
                      cells={[
                        "Each renewal year",
                        "€150",
                        <strong key="d">€550</strong>,
                      ]}
                    />
                  </tbody>
                </table>
              </div>
              <p>
                The contribution applies to new applicants and to TCNs already
                in Malta when they renew. Minors are exempt. Other Identità
                permit fees are also due to rise, but the Budget did not give
                figures. Together, the permit changes are expected to raise
                about <strong>€80 million</strong>.
              </p>
              <p>
                Who pays is not set out in the Budget. In practice the
                application fee is usually covered by the employer; the €400
                contribution is described as a charge on the worker. Employers
                should check their contracts and budget for the higher cost of
                new hires. See our{" "}
                <Link href="/blog/malta-single-permit-employer-compliance-2026">
                  employer compliance guide
                </Link>
                .
              </p>
            </section>

            <section id="transport" className="mt-12">
              <h2>
                <Bus className="inline h-6 w-6 mr-2 -mt-1" />
                2. Free public transport ends for TCNs
              </h2>
              <p>
                Free bus travel with a personalised Tallinja card was introduced
                in October 2022 for all residents. From 2027 it is limited to
                Maltese and Gozitan citizens, resident EU citizens and long-term
                residents. Other TCNs will pay standard fares; regular commuters
                have been quoted around <strong>€33 a month</strong>.
              </p>
            </section>

            <section id="childcare" className="mt-12">
              <h2>
                <Baby className="inline h-6 w-6 mr-2 -mt-1" />
                3. Free childcare for new registrations
              </h2>
              <p>
                The Free Childcare Scheme (since 2014) will no longer accept new
                registrations from TCN families without long-term residence.
                Families <strong>already using the scheme keep it</strong> until
                their children outgrow it. A new child registered in 2027 will
                be charged the centre&apos;s private rate, which varies widely
                by centre and hours. Check your entitlement today with our{" "}
                <Link href="/calculators/childcare">
                  Free Childcare Calculator
                </Link>
                .
              </p>
            </section>

            <section id="atypical" className="mt-12">
              <h2>4. Atypical working hours cheque</h2>
              <p>
                The yearly cheque for workers with atypical hours (night,
                weekend and shift work; reported at about €150) will only be
                paid to Maltese, EU citizens and long-term residents. Combined,
                the transport, childcare, licence and cheque changes are
                expected to save or raise about <strong>€46 million</strong>.
              </p>
            </section>

            <section id="driving" className="mt-12">
              <h2>
                <Car className="inline h-6 w-6 mr-2 -mt-1" />
                5. Driving: €83 a month and the 12-month rule
              </h2>
              <p>
                Two changes affect TCN drivers. First, a residence permit holder
                can drive on a non-EU licence for{" "}
                <strong>12 months from arrival</strong>, and the period no
                longer restarts after a trip abroad. For people already living
                in Malta, the 12 months count from their last entry before 1
                January 2027. After that, a Maltese or EU licence is needed.
              </p>
              <p>
                Second, a <strong>€83 monthly administrative fee</strong> (about
                €996 a year) applies to Category B and B1 licences issued or
                renewed for TCNs from 2027. Reported exemptions:
              </p>
              <ul>
                <li>EU and EEA citizens</li>
                <li>Long-term residence permit holders and their spouses</li>
                <li>Citizens of the UK, Australia and the UAE</li>
                <li>
                  People whose residence permit is for a driving job (e.g.
                  drivers and couriers)
                </li>
              </ul>
              <p>
                The licence will expire with the residence permit and cannot be
                renewed while charges are outstanding. How the fee is collected
                (monthly or upfront for the licence period) has not been
                published yet. For the regular Transport Malta licence fees see
                our{" "}
                <Link href="/blog/malta-drivers-license-guide-2026">
                  driving licence guide
                </Link>
                .
              </p>
            </section>

            <section id="example" className="mt-12">
              <h2>Worked example: a two-earner TCN family</h2>
              <p>
                Two adults renew their single permits in 2027, both commute by
                bus, one drives for personal use, and they register a new baby
                at a childcare centre charging €400 a month.
              </p>
              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-sm">
                  <tbody>
                    <Row
                      cells={["Infrastructure contribution (2 × €400)", "€800"]}
                    />
                    <Row cells={["Bus fares (2 × €33 × 12)", "€792"]} />
                    <Row cells={["Driving licence fee (€83 × 12)", "€996"]} />
                    <Row cells={["Childcare (€400 × 12)", "€4,800"]} />
                    <tr className="bg-muted/40 font-semibold">
                      <td className="p-3">Extra cost in 2027</td>
                      <td className="p-3">€7,388</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Without the new child the extra cost is €2,588 a year, or about
                €216 a month. The €150 renewal fees are not included because
                they did not change.
              </p>
            </section>

            <section id="other" className="mt-12">
              <h2>
                <Building2 className="inline h-6 w-6 mr-2 -mt-1" />
                What did not change
              </h2>
              <ul>
                <li>
                  Income tax rates and SSC rates are the same for everyone,
                  including TCNs. The new 2027 family tax bands apply to parents
                  regardless of nationality. See our{" "}
                  <Link href="/blog/malta-budget-2027-guide">
                    Budget 2027 tax guide
                  </Link>
                  .
                </li>
                <li>
                  The COLA increase (€6.41 a week) and the higher minimum wage
                  (€239.85 a week) apply to all employees.
                </li>
                <li>
                  Eligibility for the €1,000 Super Bonus has not been confirmed
                  for TCNs: some reports say it is limited to Maltese, EU
                  citizens and long-term residents. Wait for the official scheme
                  rules.
                </li>
              </ul>
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

            <div className="mt-16 p-8 bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-rose-500/10 rounded-3xl border border-rose-500/20 not-prose text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-rose-600" />
              <h2 className="text-2xl font-cal font-bold mb-4">
                Planning your next permit?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Read the full single permit process, or work out your exact 2027
                costs.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/calculators/tcn-budget-2027"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors"
                >
                  TCN 2027 Cost Calculator
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/blog/malta-single-permit-guide-2026"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-border bg-background text-foreground font-semibold hover:bg-muted/50 transition-colors"
                >
                  Single Permit Guide
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>

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
