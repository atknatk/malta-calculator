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
  Stethoscope,
  AlertCircle,
  CheckCircle2,
  Globe,
  Syringe,
  FileText,
  XCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";
import { BlogArticleAuthor } from "@/components/blog/blog-article-author";

const ARTICLE_SOURCES = [
  {
    name: "Identità Malta — Mandatory Change to Health Screening Process (Work Permits)",
    url: "https://identita.gov.mt/mandatory-change-to-health-screening-process-work-permits-only/",
  },
  {
    name: "Health Promotion and Disease Prevention (HPDP) — IDCU Work Permits",
    url: "https://hpdp.gov.mt/idcu/work_permits_for_first_time_applicants",
  },
  {
    name: "Identità Malta — Single Permit",
    url: "https://identita.gov.mt/single-permit/",
  },
];

export const metadata: Metadata = {
  ...defaultMetadata,
  title:
    "Malta Work Permit Health Screening 2026: New Online HPDP System (4 May)",
  description:
    "From 4 May 2026 Malta's work permit health screening must use the new automated HPDP system. TB X-rays, vaccinations, exempt jobs, transition rules and 15-day timeline.",
  keywords: [
    "Malta work permit health screening",
    "Malta work permit TB test",
    "Malta chest X-ray work permit",
    "HPDP Malta",
    "Malta IDCU work permit",
    "Identità health screening 2026",
    "Malta TCN medical screening",
    "Malta high TB risk countries 2025",
    "Malta work permit vaccination",
    "Malta polio diphtheria immunity",
    "Malta hepatitis B work permit",
    "Malta measles healthcare worker",
    "Malta work permit medical 4 May 2026",
    "Malta automated health screening system",
  ],
  alternates: pageAlternates("/blog/malta-work-permit-health-screening-2026"),
  openGraph: {
    ...ogMetadata,
    title:
      "Malta Work Permit Health Screening 2026: New Online HPDP System (4 May)",
    url: `${SITE_URL}/blog/malta-work-permit-health-screening-2026`,
    type: "article",
    images: [
      getBlogOgImage(
        "Malta Work Permit Health Screening 2026: New Online HPDP System",
      ),
    ],
  },
  twitter: {
    ...twitterMetadata,
    title:
      "Malta Work Permit Health Screening 2026: New Online HPDP System (4 May)",
  },
};

export default function MaltaWorkPermitHealthScreeningPage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Work Permit Health Screening 2026: New Online HPDP System (4 May)"
        description="Identità's mandatory health screening for work permits switches to a fully automated HPDP system on 4 May 2026. Required tests, exempt jobs, transition deadlines and timeline."
        slug="malta-work-permit-health-screening-2026"
        datePublished="2026-05-07"
        sources={ARTICLE_SOURCES}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Work Permit Health Screening Guide",
            url: `${SITE_URL}/blog/malta-work-permit-health-screening-2026`,
          },
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question:
              "When does Malta's new mandatory health screening system for work permits start?",
            answer:
              "The new automated HPDP health screening system became mandatory on 4 May 2026 for all work permit applications, renewals and job changes. Paper-based submissions dated on or before 30 April 2026 are accepted only if received by 5 May 2026; later paper submissions are not processed.",
          },
          {
            question: "Who needs health screening for a Malta work permit?",
            answer:
              "All Third Country Nationals (TCNs) applying for a work permit are covered, including applicants from low-TB-risk countries and those in 'other' job categories. Applicants from high or very high TB-risk countries — or who spent six months or more in such a country — must produce a chest X-ray taken within six weeks of the application. Additional vaccination and immunity tests apply by job category.",
          },
          {
            question: "Which jobs are exempt from health screening in Malta?",
            answer:
              "Applicants who are not from a high TB-risk country and are working in administrative roles, construction, professional football, hairdressing, transport, cleaning, security, delivery or non-medical laboratory work are not required to undergo health screening. The exemption falls away if the applicant is from a high or very high TB-risk country.",
          },
          {
            question: "What tests are required for a Malta work permit?",
            answer:
              "All employees regardless of role must demonstrate full immunity to polio and diphtheria. A chest X-ray is required for high-TB-risk-country applicants and is valid only if taken within six weeks of application. Healthcare workers, carers, nannies and child carers also need measles immunity (two doses or a blood test) and hepatitis B testing or a vaccination course. Specific blood investigations vary by profession.",
          },
          {
            question: "Where do I get tested for a Malta work permit?",
            answer:
              "Tests are conducted locally in Malta in the private sector. The new automated system, the user manual and training videos are published on the Health Promotion and Disease Prevention (HPDP) website at https://hpdp.gov.mt/idcu/work_permits_for_first_time_applicants. Applicants must give doctors their name, surname, ID card number, passport number, residence system number or HS code so the doctor can submit the file.",
          },
          {
            question:
              "How long does the Malta work permit health screening take?",
            answer:
              "Vetting of a correctly completed application takes up to 15 working days from receipt. Incomplete submissions are not processed — doctors cannot proceed without all required information and documentation.",
          },
          {
            question:
              "Are renewal health-screening rules different from first-time applications?",
            answer:
              "Yes. For renewals, chest X-rays are accepted only if taken within one year of the renewal application, while other blood investigations remain valid for up to two years. The countries of residence in the past period and the current job category still determine which tests are required.",
          },
        ]}
      />
      <main
        role="main"
        aria-label="Malta Work Permit Health Screening Guide 2026"
      >
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
                <span className="px-3 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-semibold rounded-full">
                  Immigration · Health
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  May 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />9 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Work Permit Health Screening 2026: New Mandatory Online
                System
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                As of <strong>4 May 2026</strong>, Identità has switched the
                health-screening process for work-permit applications to a new
                automated system run by Health Promotion and Disease Prevention
                (HPDP). Paper submissions are no longer accepted. Here is what
                applicants, doctors and employers need to know.
              </p>
            </header>

            <div className="not-prose mb-10 p-6 rounded-2xl bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-rose-500/10 border border-rose-500/20">
              <div className="flex gap-3">
                <AlertCircle className="h-6 w-6 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    Key dates at a glance
                  </h2>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>
                      • <strong>4 May 2026</strong> — automated HPDP system
                      becomes mandatory for all work-permit health screening
                    </li>
                    <li>
                      • <strong>30 April 2026</strong> — last date a paper
                      submission can be dated
                    </li>
                    <li>
                      • <strong>5 May 2026</strong> — final cut-off for
                      receiving the dated paper submission. Anything received
                      later is not processed.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <nav className="p-6 bg-muted/30 rounded-2xl mb-12 not-prose">
              <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#overview" className="text-primary hover:underline">
                    1. Overview
                  </a>
                </li>
                <li>
                  <a
                    href="#whats-changing"
                    className="text-primary hover:underline"
                  >
                    2. What Is Changing on 4 May 2026
                  </a>
                </li>
                <li>
                  <a href="#who-needs" className="text-primary hover:underline">
                    3. Who Needs Health Screening
                  </a>
                </li>
                <li>
                  <a href="#tests" className="text-primary hover:underline">
                    4. Required Tests &amp; Vaccinations
                  </a>
                </li>
                <li>
                  <a href="#exempt" className="text-primary hover:underline">
                    5. Exempt Job Categories
                  </a>
                </li>
                <li>
                  <a href="#procedure" className="text-primary hover:underline">
                    6. The New Application Procedure
                  </a>
                </li>
                <li>
                  <a href="#renewals" className="text-primary hover:underline">
                    7. Renewals vs First-Time Applicants
                  </a>
                </li>
                <li>
                  <a href="#timeline" className="text-primary hover:underline">
                    8. Timeline &amp; Common Reasons for Delays
                  </a>
                </li>
                <li>
                  <a href="#resources" className="text-primary hover:underline">
                    9. Resources &amp; Contact
                  </a>
                </li>
                <li>
                  <a href="#faqs" className="text-primary hover:underline">
                    10. FAQs
                  </a>
                </li>
              </ul>
            </nav>

            <section id="overview">
              <h2>1. Overview</h2>
              <p>
                Malta requires most third-country national (TCN) workers to
                complete a <strong>health-screening process</strong> before a
                work permit is issued. Until now the process relied on
                paper-based forms submitted through the doctor and the
                Industrial Diseases Control Unit (IDCU) at Health Promotion and
                Disease Prevention (HPDP). On <strong>4 May 2026</strong>,
                Identità announced that the process is now fully automated and{" "}
                <strong>paper submissions are no longer accepted</strong>.
              </p>
              <p>
                The change applies equally to{" "}
                <strong>
                  new applications, renewals, and changes of employer
                </strong>
                . The clinical content — which tests are required, in which
                situation — has not been relaxed; it has been digitised.
              </p>
            </section>

            <section id="whats-changing" className="mt-12">
              <h2>2. What Is Changing on 4 May 2026</h2>

              <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
                <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                  <XCircle className="h-8 w-8 text-rose-600 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">
                    Before (until 30 April 2026)
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Paper application forms accepted</li>
                    <li>• Limited to specific job categories</li>
                    <li>• Manual handling and posting</li>
                    <li>• Country/risk checks done on paper</li>
                  </ul>
                </div>
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">
                    After (from 4 May 2026)
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      • Submissions made online via the HPDP automated system
                    </li>
                    <li>
                      • Covers <strong>all TCNs</strong>, including from
                      low-TB-risk countries and &quot;other&quot; job categories
                    </li>
                    <li>
                      • Doctors complete the file digitally with applicant
                      identifiers
                    </li>
                    <li>
                      • System cannot proceed without complete information and
                      documents
                    </li>
                  </ul>
                </div>
              </div>

              <p>
                Identità has stated that paper submissions{" "}
                <strong>dated on or before 30 April 2026</strong> are accepted
                only if they reach Identità by <strong>5 May 2026</strong>.
                Anything received after that date is no longer processed and the
                applicant must restart on the automated platform.
              </p>
            </section>

            <section id="who-needs" className="mt-12">
              <h2>3. Who Needs Health Screening</h2>
              <p>
                Health screening is a clinical filter, not an immigration
                filter. It is driven by two factors:
              </p>
              <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
                <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                  <Globe className="h-8 w-8 text-blue-600 mb-3" />
                  <h4 className="font-semibold text-base mb-2">
                    Country of origin / residence
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Applicants from countries classified by HPDP as{" "}
                    <strong>High or Very High TB Risk</strong>, or who spent six
                    months or more in such a country, require a chest X-ray
                    taken within <strong>six weeks</strong> of submitting the
                    application. The current high-risk country list is published
                    by HPDP and updated periodically (October 2025 list at the
                    time of writing).
                  </p>
                </div>
                <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                  <Stethoscope className="h-8 w-8 text-purple-600 mb-3" />
                  <h4 className="font-semibold text-base mb-2">Job category</h4>
                  <p className="text-sm text-muted-foreground">
                    Healthcare workers, carers, nannies, child carers, food
                    handlers and laboratory staff face additional checks
                    (measles, hepatitis B, vaccination cards, food handler QR
                    card). Other applicants must still meet baseline polio and
                    diphtheria immunity.
                  </p>
                </div>
              </div>
              <p>
                The new system explicitly extends to applicants from{" "}
                <strong>low-TB-risk countries</strong> and to those previously
                grouped under <strong>&quot;other&quot;</strong> job categories
                — both must now go through the automated process even if no
                chest X-ray is ultimately required.
              </p>
            </section>

            <section id="tests" className="mt-12">
              <h2>4. Required Tests &amp; Vaccinations</h2>

              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Test / Requirement
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Who needs it
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Validity / Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        Chest X-ray (TB screening)
                      </td>
                      <td className="border border-border p-3">
                        Applicants from High/Very High TB-risk countries, or who
                        spent 6+ months in one
                      </td>
                      <td className="border border-border p-3">
                        Must be taken within <strong>6 weeks</strong> of
                        application
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-medium">
                        Polio &amp; Diphtheria immunity
                      </td>
                      <td className="border border-border p-3">
                        <strong>All employees</strong>, regardless of role
                      </td>
                      <td className="border border-border p-3">
                        Vaccination card or blood test
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        Measles immunity
                      </td>
                      <td className="border border-border p-3">
                        Healthcare workers, carers, nannies, child carers
                      </td>
                      <td className="border border-border p-3">
                        Two documented doses or immunity blood test
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-medium">
                        Hepatitis B
                      </td>
                      <td className="border border-border p-3">
                        Healthcare professionals, carers and certain related
                        roles
                      </td>
                      <td className="border border-border p-3">
                        Blood test or completed vaccination course
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        Food Handler&apos;s Document
                      </td>
                      <td className="border border-border p-3">
                        Food handlers (catering, food production, food retail)
                      </td>
                      <td className="border border-border p-3">
                        Card with <strong>QR code</strong>
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-medium">
                        Profession-specific blood investigations
                      </td>
                      <td className="border border-border p-3">
                        Varies by job (e.g. lab work, healthcare)
                      </td>
                      <td className="border border-border p-3">
                        Specified by HPDP based on the role
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="not-prose p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <div className="flex gap-3">
                  <Syringe className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">
                      Local private sector:
                    </strong>{" "}
                    Tests must be carried out{" "}
                    <strong>locally in Malta in the private sector</strong>.
                    Tests done abroad are generally not accepted unless HPDP
                    confirms otherwise. Costs are paid by the applicant and vary
                    between clinics.
                  </p>
                </div>
              </div>
            </section>

            <section id="exempt" className="mt-12">
              <h2>5. Exempt Job Categories</h2>
              <p>
                If you are <strong>not</strong> from a high TB-risk country{" "}
                <strong>and</strong> your role is in one of the categories
                below, HPDP&apos;s rules indicate that no health screening is
                required. The exemption disappears the moment either condition
                fails.
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 not-prose my-8">
                {[
                  "Administrative jobs",
                  "Construction",
                  "Professional football",
                  "Hairdressing",
                  "Transport",
                  "Cleaning",
                  "Security",
                  "Delivery",
                  "Non-medical laboratory work",
                ].map((role) => (
                  <div
                    key={role}
                    className="p-3 rounded-xl border border-border bg-muted/30 text-sm flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <span>{role}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Even when the role is exempt, all employees must still satisfy
                the <strong>polio and diphtheria immunity</strong> requirement.
              </p>
            </section>

            <section id="procedure" className="mt-12">
              <h2>6. The New Application Procedure</h2>

              <div className="space-y-4 not-prose my-8">
                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Identify the applicant</h4>
                    <p className="text-sm text-muted-foreground">
                      Provide the doctor with full name and surname, ID card
                      number, passport number, residence-system number, or HS
                      code. Without these the doctor cannot open a file in the
                      automated system.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      Complete medical assessments
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Carry out the chest X-ray (if required), vaccination
                      checks, and any role-specific blood investigations at a
                      local private clinic. Keep the original results — the
                      doctor uploads them through the system.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      Doctor submits the file digitally
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      The doctor logs into the HPDP automated system, enters the
                      applicant identifiers, attaches medical reports,
                      vaccination cards, the chest X-ray report (if applicable)
                      and any role-specific certifications, and submits the
                      file. Incomplete files cannot be submitted.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold">HPDP / IDCU vetting</h4>
                    <p className="text-sm text-muted-foreground">
                      Vetting takes up to <strong>15 working days</strong> from
                      receipt of a correctly completed file. The result feeds
                      back into the Identità work-permit decision.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="renewals" className="mt-12">
              <h2>7. Renewals vs First-Time Applicants</h2>
              <p>
                The same automated system handles renewals and changes of
                employer, but the validity windows for previous results are more
                generous:
              </p>
              <ul>
                <li>
                  <strong>Chest X-rays</strong> are accepted only if taken{" "}
                  <strong>within 1 year</strong> of the renewal application.
                </li>
                <li>
                  <strong>Other blood investigations</strong> remain valid for
                  up to <strong>2 years</strong>.
                </li>
                <li>
                  Whether new tests are needed at all depends on the
                  applicant&apos;s countries of residence over the past period
                  and on the current job category.
                </li>
              </ul>
              <p>
                If the previous test results are still valid the renewal can be
                a quick paperless check; if they have expired the applicant must
                complete the relevant items afresh before the doctor can submit.
              </p>
            </section>

            <section id="timeline" className="mt-12">
              <h2>8. Timeline &amp; Common Reasons for Delays</h2>
              <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
                <div className="p-6 bg-muted/30 border border-border rounded-2xl">
                  <h3 className="font-semibold text-lg mb-3">
                    Standard timeline
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Chest X-ray: same-day at most clinics</li>
                    <li>• Blood tests: 1–3 working days for results</li>
                    <li>
                      • HPDP vetting: up to <strong>15 working days</strong>
                    </li>
                    <li>
                      • Health-screening result then feeds the Identità
                      work-permit decision
                    </li>
                  </ul>
                </div>
                <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                  <h3 className="font-semibold text-lg mb-3">
                    Common delay triggers
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Missing residence system / HS code</li>
                    <li>• Chest X-ray older than six weeks</li>
                    <li>• Polio/diphtheria proof not provided</li>
                    <li>
                      • Healthcare role without measles or hepatitis B records
                    </li>
                    <li>• Food handler missing the QR-coded card</li>
                    <li>• Tests carried out abroad rather than locally</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="resources" className="mt-12">
              <h2>9. Resources &amp; Contact</h2>
              <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
                <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                  <ShieldCheck className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">
                    Official platforms
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>
                      •{" "}
                      <a
                        href="https://hpdp.gov.mt/idcu/work_permits_for_first_time_applicants"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        HPDP / IDCU — work-permit screening portal
                      </a>{" "}
                      (system access, user manual, training videos, country
                      list)
                    </li>
                    <li>
                      •{" "}
                      <a
                        href="https://identita.gov.mt/mandatory-change-to-health-screening-process-work-permits-only/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Identità — official notice of the change
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <Phone className="h-8 w-8 text-emerald-600 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">
                    Identità contact
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>
                      • <strong>Phone:</strong> +356 2590 4000
                    </li>
                    <li>
                      • <strong>Address:</strong> Identità, Triq il-Wied,
                      L-Imsida, MSD 9020, Malta
                    </li>
                    <li>
                      • <strong>Website:</strong>{" "}
                      <a
                        href="https://identita.gov.mt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        identita.gov.mt
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="faqs" className="mt-12">
              <h2>10. Frequently Asked Questions</h2>

              <div className="space-y-4 not-prose my-8">
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    Does the new system change which tests are required?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    No. The clinical content — TB chest X-ray, polio/diphtheria
                    immunity, measles for healthcare/care roles, hepatitis B,
                    food handler card and so on — is unchanged. What changed on
                    4 May 2026 is the <strong>submission method</strong>: paper
                    forms are out, the HPDP automated system is in.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    Can I use a chest X-ray taken in my home country?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    HPDP requires tests to be carried out{" "}
                    <strong>locally in Malta in the private sector</strong>.
                    Plan the chest X-ray for after arrival and within six weeks
                    of the work-permit submission.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    Do EU/EEA/Swiss workers need health screening for a Malta
                    work permit?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    The new system is published in the context of work permits
                    for <strong>third-country nationals</strong>. EU/EEA/Swiss
                    workers do not need a Maltese work permit, so HPDP&apos;s
                    work-permit screening process generally does not apply to
                    them — although employers in healthcare and food may still
                    require their own occupational health checks.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    What does the doctor need from me to start the file?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Your full name and surname, plus at least one of: ID card
                    number, passport number, residence system number, or HS
                    code. The doctor cannot open or submit the file in the
                    automated system without this.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    My employer is changing — do I need a new health screening?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    A change of employer goes through the new automated process.
                    Existing chest X-rays remain valid up to one year and other
                    blood investigations up to two years from the test date, so
                    a fresh round may not be needed if your earlier results are
                    still in date and your job category has not changed
                    materially.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    What happens if my paper submission arrives after 5 May
                    2026?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Identità has stated it will <strong>not process</strong>{" "}
                    paper submissions received after 5 May 2026, even if dated
                    on or before 30 April 2026. The applicant must restart on
                    the HPDP automated platform.
                  </p>
                </div>
              </div>
            </section>

            <div className="mt-16 p-8 bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-rose-500/10 rounded-3xl border border-rose-500/20 not-prose text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-rose-600" />
              <h2 className="text-2xl font-cal font-bold mb-4">
                Working in Malta? Read our companion guides
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                The health screening sits inside a wider work-permit and
                residency process. Check our complete guides for the rest of the
                picture.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/blog/malta-work-permit-employment-guide-2026"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors"
                >
                  Malta Work Permit Guide
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
              datePublished="2026-05-07"
              sources={ARTICLE_SOURCES}
            />
            <BlogArticleFooter
              slug="malta-work-permit-health-screening-2026"
              title="Malta Work Permit Health Screening 2026: New Online HPDP System"
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false;
export const dynamic = "force-static";
