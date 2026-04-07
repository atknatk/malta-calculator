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
  AlertTriangle,
  BadgeCheck,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  CustomFAQJsonLd,
  HowToJsonLd,
} from "@/components/json-ld";
import { BlogArticleAuthor } from "@/components/blog/blog-article-author";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";
import { CompanySizeRulesChecker } from "@/app/blog/_shared/company-size-rules-checker";

const ARTICLE_SOURCES = [
  {
    name: "Identità — Malta Labour Migration Policy Fact Sheet (July 2025)",
    url: "https://identita.gov.mt/wp-content/uploads/2025/07/Fact-Sheet.pdf",
  },
  {
    name: "Identità — Single Permit (overview)",
    url: "https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/employment-related-permits/single-permit/",
  },
  {
    name: "Identità — Key Employee Initiative (KEI)",
    url: "https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/employment-related-permits/highly-qualified-individuals/key-employee-initiative/who-is-eligible/",
  },
  {
    name: "Identità — Specialist Employee Initiative (SEI)",
    url: "https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/employment-related-permits/highly-qualified-individuals/specialist-employee-initiative/who-is-eligible/",
  },
  {
    name: "Jobsplus — Employment Forms & Notifications",
    url: "https://jobsplus.gov.mt/employers-mt-MT-en-GB/forms",
  },
  {
    name: "Persons with Disability (Employment) Act, Cap. 210",
    url: "https://legislation.mt/eli/cap/210/eng",
  },
  {
    name: "Skills Pass Portal",
    url: "https://skillspass.org.mt/",
  },
];

export const metadata: Metadata = {
  ...defaultMetadata,
  title:
    "Malta Single Permit — Employer Compliance Guide 2026 | Malta Calculator",
  description:
    "Every Malta Single Permit employer rule for 2026: termination rate thresholds, workforce limits, First Employment Rule (Micro 2 / Small 4 / Medium 20 / Large 40), disability quota, Jobsplus deadlines and the Exemplary Employer register.",
  keywords: [
    "malta single permit employer compliance",
    "malta termination rate threshold",
    "malta first employment rule",
    "malta workforce application limits",
    "malta jobsplus 4-day rule",
    "malta disability employment quota",
    "malta single permit employer rules 2026",
    "malta labour migration policy 2025",
    "malta exemplary employer register",
    "malta redundancy block single permit",
  ],
  alternates: pageAlternates(
    "/blog/malta-single-permit-employer-compliance-2026",
  ),
  openGraph: {
    ...ogMetadata,
    title: "Malta Single Permit — Employer Compliance Guide 2026",
    url: `${SITE_URL}/blog/malta-single-permit-employer-compliance-2026`,
    type: "article",
    images: [
      getBlogOgImage("Malta Single Permit — Employer Compliance Guide 2026"),
    ],
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Single Permit — Employer Compliance Guide 2026",
    images: [
      getBlogOgImage("Malta Single Permit — Employer Compliance Guide 2026"),
    ],
  },
};

export default function EmployerCompliancePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Single Permit — Employer Compliance Guide 2026"
        description="Complete employer-side guide to Malta's 2025–2026 Single Permit rules: termination rate thresholds, workforce limits, First Employment Rule, disability quota, Jobsplus deadlines and the Exemplary Employer register."
        slug="malta-single-permit-employer-compliance-2026"
        datePublished="2026-04-07"
        sources={ARTICLE_SOURCES}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Single Permit Employer Compliance",
            url: `${SITE_URL}/blog/malta-single-permit-employer-compliance-2026`,
          },
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question:
              "What are the Malta Single Permit termination rate thresholds for employers in 2025–2026?",
            answer:
              "Effective 1 August 2025, Jobsplus reviews employer termination rates before processing Single Permit applications. Small companies (10–49 employees) face rejection above 50%, Medium (50–249) above 45% and Large (250+) above 40%. Initial thresholds are 15 percentage points higher and tighten to the targets by 1 July 2026. Companies with under 10 employees, KEI applications, sports, students and healthcare are exempt.",
          },
          {
            question:
              "What is the First Employment Rule for Malta employers from January 2026?",
            answer:
              "From January 2026 employers must already employ a minimum number of Maltese, EU/EEA, Swiss or long-term-resident workers before they can apply for foreign hires under a Single Permit: Micro (1–9 employees) need at least 2, Small (10–49) need 4, Medium (50–249) need 20 and Large (250+) need 40. Employers with over 80% foreign workforce face enhanced labour market needs testing.",
          },
          {
            question:
              "How many new foreign workers can a Malta employer hire under the workforce application limits?",
            answer:
              "The maximum number of new Single Permit applications per 12 months depends on company size and is calculated against the headcount 12 months before the application: Micro (1–9 employees) can apply for up to 200% of their workforce, Small (10–49) up to 100%, Medium (50–249) up to 50% and Large (250+) up to 25%. KEI, sports, students and healthcare are exempt.",
          },
          {
            question: "What is the Malta 4-day Jobsplus form rule?",
            answer:
              "Employers must submit Jobsplus engagement and termination forms within 4 working days of an employee starting or ending. Missing the deadline suspends all pending Single Permit applications (except renewals). Repeat offenders may be disqualified from filing new applications altogether.",
          },
          {
            question:
              "Does the Malta disability employment quota affect Single Permit applications?",
            answer:
              "Yes. The Persons with Disability (Employment) Act requires employers to have at least 2% of their workforce composed of persons with disabilities, or to pay an annual contribution. Failure to comply suspends all pending Single Permit applications, with the exception of renewals.",
          },
          {
            question: "What is the Malta Register of Exemplary Employers?",
            answer:
              "From October 2026 onwards, Identità is building a fast-track register for employers that fully comply with employment law and invest in official training schemes. Listed employers receive streamlined labour market testing and longer renewal periods of 2 to 4 years for their staff. The register is part of the wider Malta Labour Migration Policy reform.",
          },
          {
            question:
              "Can a Malta employer hire a foreign worker for a role they recently made redundant?",
            answer:
              "No. From 1 August 2025 the redundancy block rule applies: if you made an employee redundant in the previous 12 months for the same role you are now trying to fill with a foreign national, the Single Permit application is automatically rejected. There are no exceptions.",
          },
          {
            question:
              "Do Malta employers still need to advertise jobs before applying for a Single Permit?",
            answer:
              "Yes. Standard Single Permit applications need a vacancy advertised on both the Jobsplus portal and EURES for a minimum of 3 weeks within the 2 months before submission. KEI, SEI, EU Blue Card and Skilled Occupation List applications need only one local-media advert running for at least 2 weeks. Change-of-employer applications are exempt from advertising.",
          },
        ]}
      />
      <HowToJsonLd
        name="How to keep your Malta company compliant when hiring under a Single Permit"
        description="Six practical compliance steps every Malta employer should run before submitting a Single Permit application under the 2025–2026 Labour Migration Policy."
        totalTime="PT15M"
        steps={[
          {
            name: "Identify your company size band",
            text: "Classify your company as Micro (1–9), Small (10–49), Medium (50–249) or Large (250+). Almost every new rule has a different threshold per band.",
          },
          {
            name: "Check your termination rate against the threshold",
            text: "From 1 August 2025 Jobsplus rejects applications above 50% (Small), 45% (Medium) or 40% (Large). Micro companies are exempt. Initial thresholds are 15 points higher until 1 July 2026.",
          },
          {
            name: "Verify your minimum Maltese / EU headcount (Jan 2026 First Employment Rule)",
            text: "Confirm you already employ at least 2 (Micro), 4 (Small), 20 (Medium) or 40 (Large) Maltese, EU/EEA, Swiss or long-term-resident workers before applying.",
          },
          {
            name: "Check your disability quota and Jobsplus form filing",
            text: "Maintain at least 2% disabled workforce or pay the annual contribution. Submit engagement and termination forms within 4 working days of every change to avoid pending application suspensions.",
          },
          {
            name: "Run the correct vacancy advertisement",
            text: "Standard applications: 3 weeks on Jobsplus + 3 weeks on EURES, both within 2 months of submission. KEI / SEI / EU Blue Card / Skilled Occupation List: one local media advert for 2 weeks.",
          },
          {
            name: "Confirm no recent redundancies for the same role",
            text: "If you made anyone redundant in the previous 12 months for the role you now want to fill with a foreign national, the application will be rejected.",
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
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                  Employer Guide
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> April 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> 13 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Single Permit — Employer Compliance Guide 2026
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                The Malta Labour Migration Policy rewrote the rulebook for
                employers between August 2025 and January 2026. Here is every
                employer-side rule, sorted by company size, with no legal jargon
                — and a live checker so you can see exactly what applies to you.
              </p>
            </header>

            <div className="not-prose mb-10 flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm">
              <BadgeCheck className="h-5 w-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div>
                <strong>Last verified 7 April 2026.</strong> All thresholds are
                cross-referenced against the Identità Labour Migration Policy
                fact sheet (July 2025) and the Single Permit regulations under{" "}
                <strong>Subsidiary Legislation 217.17</strong>. Looking for the
                worker-side guide?{" "}
                <Link
                  href="/blog/malta-single-permit-guide-2026"
                  className="underline font-semibold"
                >
                  Open the Malta Single Permit Guide 2026
                </Link>
                .
              </div>
            </div>

            {/* Key Takeaways */}
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl mb-10 not-prose">
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-primary">
                  Employer Key Takeaways
                </h2>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>
                    <strong>Termination rate</strong> thresholds (1 Aug 2025):
                    Small 50% · Medium 45% · Large 40%. Companies under 10
                    employees are <strong>exempt</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>
                    <strong>Workforce limits</strong>: Micro 200% · Small 100% ·
                    Medium 50% · Large 25% — calculated against headcount 12
                    months earlier.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>
                    <strong>First Employment Rule</strong> (Jan 2026): minimum
                    Maltese/EU/long-term-resident headcount of{" "}
                    <strong>2 / 4 / 20 / 40</strong> for Micro / Small / Medium
                    / Large before any new foreign hire.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>
                    <strong>Disability quota</strong>: at least 2% of workforce,
                    or pay the annual contribution under the Persons with
                    Disability (Employment) Act.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>
                    <strong>4-day Jobsplus rule</strong>: engagement and
                    termination forms must be filed within 4 working days or
                    pending applications are suspended.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>
                    <strong>Redundancy block</strong>: if you made someone
                    redundant in the previous 12 months for the same role, your
                    application is automatically rejected.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>
                    <strong>Exemplary Employer register</strong> opens October
                    2026 with 2–4 year renewal periods for compliant employers.
                  </span>
                </li>
              </ul>
            </div>

            {/* Table of Contents */}
            <nav className="p-6 bg-muted/30 rounded-2xl mb-12 not-prose">
              <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
              <ol className="space-y-2 text-sm">
                <li>
                  <a href="#why" className="text-primary hover:underline">
                    1. Why Malta Rewrote the Rules
                  </a>
                </li>
                <li>
                  <a
                    href="#size-checker"
                    className="text-primary hover:underline"
                  >
                    2. Company Size Rules Checker
                  </a>
                </li>
                <li>
                  <a
                    href="#termination-rate"
                    className="text-primary hover:underline"
                  >
                    3. Termination Rate Thresholds (1 Aug 2025)
                  </a>
                </li>
                <li>
                  <a
                    href="#workforce-limits"
                    className="text-primary hover:underline"
                  >
                    4. Workforce Application Limits
                  </a>
                </li>
                <li>
                  <a
                    href="#first-employment"
                    className="text-primary hover:underline"
                  >
                    5. The First Employment Rule (Jan 2026)
                  </a>
                </li>
                <li>
                  <a
                    href="#disability-quota"
                    className="text-primary hover:underline"
                  >
                    6. Disability Employment Quota (2%)
                  </a>
                </li>
                <li>
                  <a
                    href="#advertising"
                    className="text-primary hover:underline"
                  >
                    7. Job Advertising and the Redundancy Block
                  </a>
                </li>
                <li>
                  <a
                    href="#jobsplus-deadlines"
                    className="text-primary hover:underline"
                  >
                    8. Jobsplus Form Deadlines (4-Day Rule)
                  </a>
                </li>
                <li>
                  <a
                    href="#wages-cash"
                    className="text-primary hover:underline"
                  >
                    9. Wages, Cash Bans and Worker Protection
                  </a>
                </li>
                <li>
                  <a
                    href="#renewals-tourist"
                    className="text-primary hover:underline"
                  >
                    10. Tourist-Visa Loophole and Fixed Renewals
                  </a>
                </li>
                <li>
                  <a
                    href="#new-businesses"
                    className="text-primary hover:underline"
                  >
                    11. Newly Registered Businesses (Jan 2026)
                  </a>
                </li>
                <li>
                  <a
                    href="#exemplary-register"
                    className="text-primary hover:underline"
                  >
                    12. Register of Exemplary Employers
                  </a>
                </li>
                <li>
                  <a href="#future" className="text-primary hover:underline">
                    13. Future Changes (Oct 2026 onwards)
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-primary hover:underline">
                    14. Frequently Asked Questions
                  </a>
                </li>
              </ol>
            </nav>

            {/* Section 1 */}
            <section id="why">
              <h2>1. Why Malta Rewrote the Rules</h2>
              <p>
                Roughly one in three people working in Malta today is a foreign
                national. The Single Permit system that managed that flow grew
                faster than the housing, transport and healthcare infrastructure
                underneath it. Rather than slow the tap, the government chose to
                fix the pipes — through the{" "}
                <strong>Malta Labour Migration Policy</strong>, a 32-point
                reform rolling out from August 2025 through late 2026.
              </p>
              <p>
                Most of the reform sits with employers. New hires now flow
                through a Jobsplus filter that checks termination rates,
                workforce composition, advertising history, redundancy history,
                disability compliance, payroll discipline and form filing speed
                — before the application even reaches Identità. If any of those
                checks fail, the application is rejected and the €600 government
                fee is <strong>not refundable</strong>.
              </p>
              <p>
                This guide is the practical version: every rule, who it applies
                to, when it kicks in, and what you need to do about it.
              </p>
            </section>

            {/* Section 2 — interactive checker */}
            <section id="size-checker" className="mt-12">
              <h2>2. Company Size Rules Checker</h2>
              <p>
                Almost every new rule has a different threshold for{" "}
                <strong>Micro (1–9)</strong>, <strong>Small (10–49)</strong>,{" "}
                <strong>Medium (50–249)</strong> and{" "}
                <strong>Large (250+)</strong> employers. Use the tool below to
                see your numbers in one place.
              </p>

              <CompanySizeRulesChecker />
            </section>

            {/* Section 3 */}
            <section id="termination-rate" className="mt-12">
              <h2>3. Termination Rate Thresholds (1 Aug 2025)</h2>
              <p>
                Jobsplus now calculates an employer&apos;s termination rate
                whenever a new Single Permit application is filed. Above the
                threshold, the application is rejected. The thresholds drop over
                time:
              </p>

              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Company size
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Initial threshold
                        <br />
                        (until 1 Jul 2026)
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Target threshold
                        <br />
                        (from 1 Jul 2026)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Micro (1–9)
                      </td>
                      <td
                        className="border border-border p-3 text-emerald-600 dark:text-emerald-400 font-semibold"
                        colSpan={2}
                      >
                        Exempt
                      </td>
                    </tr>
                    <tr className="bg-muted/40">
                      <td className="border border-border p-3 font-semibold">
                        Small (10–49)
                      </td>
                      <td className="border border-border p-3">65%</td>
                      <td className="border border-border p-3 font-semibold">
                        50%
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Medium (50–249)
                      </td>
                      <td className="border border-border p-3">60%</td>
                      <td className="border border-border p-3 font-semibold">
                        45%
                      </td>
                    </tr>
                    <tr className="bg-muted/40">
                      <td className="border border-border p-3 font-semibold">
                        Large (250+)
                      </td>
                      <td className="border border-border p-3">55%</td>
                      <td className="border border-border p-3 font-semibold">
                        40%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>How the rate is calculated</h3>
              <p>
                Jobsplus computes the termination rate as the proportion of
                employees whose engagement was terminated in the most recent
                12-month window (not headcount changes from new hires).
                Voluntary resignations, end of fixed-term contracts and
                completion of a project all count, regardless of who initiated
                the separation. KEI applications, sports professionals, students
                and healthcare or care-of-elderly roles are exempt.
              </p>

              <div className="not-prose my-6 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-rose-600 dark:text-rose-400" />
                <div>
                  <strong>Practical effect.</strong> A Small company that
                  terminated 6 people out of 12 in the last 12 months sits at
                  50% — already at the target threshold. Until 1 July 2026 they
                  remain inside the 65% initial limit, so a Single Permit
                  application would still be processed. From 1 July 2026 onwards
                  the same company is on the line and any further termination
                  tips them into rejection.
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="workforce-limits" className="mt-12">
              <h2>4. Workforce Application Limits</h2>
              <p>
                Independent of termination rate, every employer is also capped
                on how many <em>new</em> Single Permit applications they can
                submit per 12-month rolling window. The cap is a percentage of
                the headcount <strong>12 months before</strong> the application
                date — not today&apos;s headcount.
              </p>

              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Company size
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Max new applications
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Worked example
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Micro (1–9)
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        200%
                      </td>
                      <td className="border border-border p-3 text-muted-foreground">
                        8 employees → up to 16 new applications
                      </td>
                    </tr>
                    <tr className="bg-muted/40">
                      <td className="border border-border p-3 font-semibold">
                        Small (10–49)
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        100%
                      </td>
                      <td className="border border-border p-3 text-muted-foreground">
                        20 employees → up to 20 new applications
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Medium (50–249)
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        50%
                      </td>
                      <td className="border border-border p-3 text-muted-foreground">
                        100 employees → up to 50 new applications
                      </td>
                    </tr>
                    <tr className="bg-muted/40">
                      <td className="border border-border p-3 font-semibold">
                        Large (250+)
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        25%
                      </td>
                      <td className="border border-border p-3 text-muted-foreground">
                        500 employees → up to 125 new applications
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                The same exemption applies as for the termination rate
                threshold: KEI, sports, students and healthcare / elderly-care
                roles are not counted toward the limit.
              </p>
            </section>

            {/* Section 5 */}
            <section id="first-employment" className="mt-12">
              <h2>5. The First Employment Rule (Jan 2026)</h2>
              <p>
                Effective January 2026, before submitting any new Single Permit
                application an employer must already have a minimum number of{" "}
                <strong>Maltese, EU/EEA, Swiss</strong> or{" "}
                <strong>long-term-resident</strong> employees on the payroll.
                The minimum is set by company size:
              </p>

              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Company size
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Minimum Maltese/EU employees
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Micro (1–9)
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        2
                      </td>
                    </tr>
                    <tr className="bg-muted/40">
                      <td className="border border-border p-3 font-semibold">
                        Small (10–49)
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        4
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Medium (50–249)
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        20
                      </td>
                    </tr>
                    <tr className="bg-muted/40">
                      <td className="border border-border p-3 font-semibold">
                        Large (250+)
                      </td>
                      <td className="border border-border p-3 font-semibold">
                        40
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="not-prose my-6 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
                <Building2 className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                <div>
                  <strong>Watch the 80% line.</strong> Even if you meet the
                  minimum, employers whose foreign worker share exceeds 80% of
                  the workforce face an enhanced labour market needs test on
                  every new application. Practically, this means more
                  documentary scrutiny and longer processing.
                </div>
              </div>

              <p>
                Long-term residents — third-country nationals holding the EU
                long-term residence permit issued by Malta or another Member
                State — count toward this minimum. So do beneficiaries of
                international protection where Maltese law gives them equal
                treatment in employment.
              </p>
            </section>

            {/* Section 6 */}
            <section id="disability-quota" className="mt-12">
              <h2>6. Disability Employment Quota (2%)</h2>
              <p>
                The Persons with Disability (Employment) Act requires every
                employer with 20 or more employees to ensure that at least{" "}
                <strong>2% of their workforce</strong> consists of persons with
                disabilities, or to pay an annual contribution to the Lino
                Spiteri Foundation training fund. The contribution is tied to
                the number of disabled workers the employer is short.
              </p>
              <p>
                Since August 2025 the Single Permit application process is
                directly linked to this quota: if you are non-compliant — either
                because you have not hired the required number of persons with
                disabilities, or because your annual contribution is unpaid —
                Identità <strong>suspends all your pending applications</strong>{" "}
                except renewals. The suspension is lifted only when the
                non-compliance is resolved.
              </p>

              <div className="not-prose my-6 flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm">
                <ShieldCheck className="h-5 w-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <strong>Quick check.</strong> 50 employees → at least 1
                  disabled employee. 100 employees → at least 2. 250 employees →
                  at least 5. The fund-contribution alternative is calculated
                  against the same shortfall.
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="advertising" className="mt-12">
              <h2>7. Job Advertising and the Redundancy Block</h2>
              <p>
                For new Single Permit applications and applications for workers
                still abroad, the employer must run a vacancy advert in the
                right places, for the right duration, within the right window.
                The exact rules depend on the application type.
              </p>

              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Application type
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Advert requirement
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Standard Single Permit
                      </td>
                      <td className="border border-border p-3">
                        1 advert on Jobsplus + 1 advert on EURES, both running
                        for at least 3 weeks within the 2 months before
                        submission.
                      </td>
                    </tr>
                    <tr className="bg-muted/40">
                      <td className="border border-border p-3 font-semibold">
                        KEI / SEI / EU Blue Card / Skilled Occupation List
                      </td>
                      <td className="border border-border p-3">
                        1 advert on any local media platform for at least 2
                        weeks within the 2 months prior. Jobsplus / EURES not
                        required.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Change of employer
                      </td>
                      <td className="border border-border p-3 text-emerald-700 dark:text-emerald-400 font-semibold">
                        Exempt — no advert required.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>The redundancy block</h3>
              <p>
                If you made an employee redundant in the previous 12 months for
                the same role you are now trying to fill with a foreign
                national, the application is automatically rejected. There are
                no exceptions, no appeals, and no &ldquo;different title&rdquo;
                workarounds — Jobsplus checks the substance of the role, not the
                label.
              </p>
            </section>

            {/* Section 8 */}
            <section id="jobsplus-deadlines" className="mt-12">
              <h2>8. Jobsplus Form Deadlines (4-Day Rule)</h2>
              <p>
                Effective 1 August 2025, every engagement and termination of an
                employee — Maltese or foreign — must be reported to Jobsplus
                within <strong>4 working days</strong> of the start or end date.
                Miss the deadline and Identità immediately suspends all your
                pending Single Permit applications, with renewals as the only
                exception.
              </p>
              <p>
                Repeat lateness can escalate to a full disqualification:
                Identità may refuse to accept any new application from your
                company until the matter is resolved through Jobsplus.
              </p>

              <div className="not-prose my-6 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-rose-600 dark:text-rose-400" />
                <div>
                  <strong>HR action.</strong> Build the 4-day filing window into
                  your onboarding and offboarding workflow. Set a calendar
                  reminder for 2 working days after each event so the form is
                  filed inside the limit even if your HR contact is on leave.
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section id="wages-cash" className="mt-12">
              <h2>9. Wages, Cash Bans and Worker Protection</h2>
              <p>Two important wage rules took effect on 1 August 2025:</p>
              <ul>
                <li>
                  <strong>No cash salaries.</strong> Foreign workers whose
                  employment is registered on or after 1 August 2025 must be
                  paid via a licensed financial institution. Cash payments are
                  prohibited. The aim is to make wage theft and off-the-books
                  employment harder to hide.
                </li>
                <li>
                  <strong>No financial compensation from employees.</strong>{" "}
                  Employers cannot ask foreign workers for any payment in return
                  for being hired, recruited, retained or terminated. Recoupment
                  of recruitment costs from the employee is also prohibited.
                  This addresses reported exploitation in some sectors where
                  workers were effectively paying for their own jobs.
                </li>
              </ul>
              <p>
                Both rules are policed at application stage: if the employment
                contract or evidence presented to Identità breaches either rule,
                the application is rejected.
              </p>
            </section>

            {/* Section 10 */}
            <section id="renewals-tourist" className="mt-12">
              <h2>10. Tourist-Visa Loophole and Fixed Renewals</h2>
              <p>
                Effective 1 October 2025, foreign nationals already in Malta on
                a visa that <em>does not permit employment</em> — most commonly
                a tourist visa — cannot apply for a Single Permit from inside
                Malta. The application must be filed from abroad. Any
                application submitted in breach of this rule is rejected.
              </p>
              <p>
                The rule closes a widely-used grey area where workers arrived as
                tourists and converted their stay locally. If your candidate is
                already in Malta on a tourist visa, the cleanest path is to have
                them leave Schengen and start the application from their country
                of residence, building in the new{" "}
                <strong>Pre-Departure Course</strong> on the Skills Pass portal
                (€250, online, around 6 weeks).
              </p>

              <h3>Fixed renewal periods (1 Oct 2025)</h3>
              <p>
                Identità&apos;s discretion to grant non-standard renewal periods
                has been removed. The fixed durations are now:
              </p>
              <ul>
                <li>
                  Standard renewals — up to <strong>2 years</strong>.
                </li>
                <li>
                  KEI, SEI and EU Blue Card renewals — up to{" "}
                  <strong>3 years</strong>.
                </li>
                <li>
                  Low-skilled workers enrolled in Identità training programmes —
                  extended to <strong>2 years</strong>.
                </li>
              </ul>

              <h3>The 60-day interim permit</h3>
              <p>
                Nationals of visa-waiver countries who apply for a Single Permit
                within 60 days of entering the Schengen Area receive an interim
                permit covering them while the application is processed. From
                day 61 onwards no interim permit is issued and the worker must
                wait outside Schengen.
              </p>
            </section>

            {/* Section 11 */}
            <section id="new-businesses" className="mt-12">
              <h2>11. Newly Registered Businesses (Jan 2026)</h2>
              <p>
                Until December 2025 a brand-new company could apply for Single
                Permits without going through the standard Labour Market Needs
                Test, on the assumption that it had no existing workforce to
                test against. From January 2026 that exemption ends.
              </p>
              <p>
                In addition, a new business{" "}
                <strong>without any Maltese, EU national</strong> or{" "}
                <strong>long-term resident</strong> among its owners can no
                longer apply for foreign workers at all. The only exception is
                foreign direct investment cases backed by{" "}
                <strong>Malta Enterprise</strong>.
              </p>
              <p>
                If you are setting up a Malta company in 2026 with the intention
                of hiring abroad, build at least one Maltese or EU shareholder
                into the structure before incorporation — otherwise you will not
                be eligible to file a Single Permit application against the
                company.
              </p>
            </section>

            {/* Section 12 */}
            <section id="exemplary-register" className="mt-12">
              <h2>12. Register of Exemplary Employers</h2>
              <p>
                From October 2026 onwards, Identità is building a fast-track
                register of employers who have demonstrated full compliance with
                employment law and have invested in official training schemes.
                Listed employers receive:
              </p>
              <ul>
                <li>Streamlined labour market testing.</li>
                <li>
                  Renewal periods of <strong>2 to 4 years</strong> for their
                  staff, instead of the standard 1–2 year cycles.
                </li>
                <li>
                  Priority handling of applications by the Expatriates Unit.
                </li>
              </ul>
              <p>
                The exact eligibility criteria, application process and
                published register are still being finalised by Identità as part
                of the ongoing reform. For most employers the practical action
                today is the same: keep your termination rate, disability quota
                and Jobsplus filings clean, and document any official training
                programmes you participate in.
              </p>
            </section>

            {/* Section 13 */}
            <section id="future" className="mt-12">
              <h2>13. Future Changes (Oct 2026 onwards)</h2>
              <p>
                Three structural changes are still in the pipeline. They are
                announced in the Labour Migration Policy but not yet bound to a
                specific legal notice:
              </p>
              <ul>
                <li>
                  <strong>Occupation-specific salary study.</strong> A
                  comprehensive market study to set sector-specific salary
                  thresholds. Once published, employers will be expected to pay
                  foreign workers in line with the study, role by role.
                </li>
                <li>
                  <strong>List of high-risk countries.</strong> A list of third
                  countries flagged on security, public-policy or health
                  grounds. Low-skilled job applications from nationals of these
                  countries will be automatically rejected. Other categories
                  will be reviewed individually.
                </li>
                <li>
                  <strong>Quotas and hiring moratoria by occupation.</strong>{" "}
                  Jobsplus will continuously analyse labour market shortages and
                  surpluses and may impose temporary or permanent quotas — or
                  hiring bans — on specific occupations. Announcements will be
                  made at the time of imposition.
                </li>
              </ul>
            </section>

            {/* Section 14 — FAQ */}
            <section id="faq" className="mt-12">
              <h2>14. Frequently Asked Questions</h2>

              <h3>
                What are the Malta Single Permit termination rate thresholds in
                2025–2026?
              </h3>
              <p>
                Effective 1 August 2025, Jobsplus rejects Single Permit
                applications above 50% (Small, 10–49 employees), 45% (Medium,
                50–249) and 40% (Large, 250+). Initial thresholds are 15
                percentage points higher and tighten to the targets by 1 July
                2026. Companies with under 10 employees are exempt, as are KEI
                applications, sports professionals, students and healthcare or
                care-of-elderly roles.
              </p>

              <h3>What is the First Employment Rule for Malta employers?</h3>
              <p>
                From January 2026 employers must already employ a minimum number
                of Maltese, EU/EEA, Swiss or long-term-resident workers before
                applying for any new foreign hire: 2 (Micro, 1–9), 4 (Small,
                10–49), 20 (Medium, 50–249) and 40 (Large, 250+). Employers with
                over 80% foreign workforce face enhanced labour market needs
                testing.
              </p>

              <h3>How are workforce application limits calculated in Malta?</h3>
              <p>
                The maximum number of new Single Permit applications per
                12-month rolling window is calculated against the
                employer&apos;s headcount <strong>12 months before</strong> the
                application date. Micro (1–9) can apply for up to 200% of that
                historical headcount, Small for 100%, Medium for 50% and Large
                for 25%. KEI, sports, students and healthcare are exempt.
              </p>

              <h3>What is the Malta 4-day Jobsplus form rule?</h3>
              <p>
                Engagement and termination forms must be filed with Jobsplus
                within 4 working days of an employee starting or ending. Missing
                the deadline suspends all your pending Single Permit
                applications (except renewals). Repeat offenders may be
                disqualified from filing new applications altogether.
              </p>

              <h3>
                Does the Malta disability employment quota affect Single Permit
                applications?
              </h3>
              <p>
                Yes. The Persons with Disability (Employment) Act requires
                employers with 20 or more staff to have at least 2% of their
                workforce composed of persons with disabilities, or pay an
                annual contribution. Non-compliance suspends all pending Single
                Permit applications, with the exception of renewals.
              </p>

              <h3>What is the Malta Register of Exemplary Employers?</h3>
              <p>
                From October 2026 onwards, Identità is building a fast-track
                register for employers that fully comply with employment law and
                invest in official training schemes. Listed employers receive
                streamlined labour market testing and longer renewal periods of
                2 to 4 years for their staff. The criteria and application
                process are still being finalised as part of the wider Malta
                Labour Migration Policy reform.
              </p>

              <h3>
                Can a Malta employer hire a foreign worker for a role they
                recently made redundant?
              </h3>
              <p>
                No. From 1 August 2025 the redundancy block rule applies: if you
                made an employee redundant in the previous 12 months for the
                same role you are now trying to fill with a foreign national,
                the Single Permit application is automatically rejected. There
                are no exceptions.
              </p>

              <h3>
                Do Malta employers still need to advertise jobs before applying
                for a Single Permit?
              </h3>
              <p>
                Yes. Standard Single Permit applications need a vacancy
                advertised on both the Jobsplus portal and EURES for a minimum
                of 3 weeks within the 2 months before submission. KEI, SEI, EU
                Blue Card and Skilled Occupation List applications need only one
                local-media advert running for at least 2 weeks.
                Change-of-employer applications are exempt from advertising.
              </p>
            </section>

            <BlogArticleAuthor
              datePublished="2026-04-07"
              sources={ARTICLE_SOURCES}
            />

            {/* Worker guide cross-link */}
            <div className="not-prose my-12 rounded-3xl border border-primary/20 bg-primary/5 p-6 md:p-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                For your foreign workers
              </p>
              <h3 className="text-xl font-bold mb-2">
                Malta Single Permit Guide 2026
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                The full worker-side guide: eligibility, fees, KEI &amp; SEI,
                Skills Pass, processing time, change of employer and the 30+30
                day grace period after termination.
              </p>
              <Link
                href="/blog/malta-single-permit-guide-2026"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                Open the worker guide
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <BlogArticleFooter
              slug="malta-single-permit-employer-compliance-2026"
              title="Malta Single Permit — Employer Compliance Guide 2026"
              ctaTitle="Calculate Net Salaries for Your Hires"
              ctaDescription="Use our free Malta Salary Calculator to translate the gross salary in your job offer into a net monthly figure with FSS, SSC and COLA — useful for the wage justification step."
              ctaLink="/salary"
              ctaLinkText="Open Salary Calculator"
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false;
export const dynamic = "force-static";
