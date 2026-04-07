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
  Award,
  BadgeCheck,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Crown,
  Euro,
  ExternalLink,
  FileText,
  GraduationCap,
  Info,
  Megaphone,
  Rocket,
  Timer,
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
import { PolicyTimeline } from "@/app/blog/_shared/policy-timeline";

// All facts in this article are cited against primary sources from
// Malta's identity, employment and skills authorities. Whenever a
// figure is updated upstream, refresh this list and the inline copy.
const ARTICLE_SOURCES = [
  {
    name: "Identità — Single Permit (overview)",
    url: "https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/employment-related-permits/single-permit/",
  },
  {
    name: "Identità — Single Permit Application & Fees",
    url: "https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/employment-related-permits/single-permit/single-permit-application/",
  },
  {
    name: "Identità — Who is Eligible",
    url: "https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/employment-related-permits/single-permit/who-is-eligible/",
  },
  {
    name: "Identità — Documents Required",
    url: "https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/employment-related-permits/single-permit/documents-required/",
  },
  {
    name: "Identità — Application Processing Period",
    url: "https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/employment-related-permits/single-permit/application-processing-period/",
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
    name: "Identità — Pre-Departure Course (Skills Pass)",
    url: "https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/employment-related-permits/single-permit/expatriates-unit-single-permit-pre-departure-course/",
  },
  {
    name: "Identità — Change of Employer",
    url: "https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/employment-related-permits/change-of-designation-or-employer/change-of-employer/",
  },
  {
    name: "Identità — Malta Labour Migration Policy Fact Sheet (July 2025)",
    url: "https://identita.gov.mt/wp-content/uploads/2025/07/Fact-Sheet.pdf",
  },
  {
    name: "Skills Pass Portal",
    url: "https://skillspass.org.mt/",
  },
];

export const metadata: Metadata = {
  ...defaultMetadata,
  title:
    "Malta Single Permit Guide 2026: Cost, Eligibility & Application Steps",
  description:
    "Complete 2026 guide to Malta's Single Permit for non-EU workers. Verified fees (€600 / €150), KEI €45K, SEI €30K, the Skills Pass and the 30+30 day post-termination grace period.",
  keywords: [
    "malta single permit",
    "malta single permit 2026",
    "malta single permit cost",
    "malta single permit fee",
    "malta work permit non-eu",
    "malta key employee initiative",
    "malta specialist employee initiative",
    "malta skills pass",
    "malta pre-departure course",
    "malta change of employer single permit",
  ],
  alternates: pageAlternates("/blog/malta-single-permit-guide-2026"),
  openGraph: {
    ...ogMetadata,
    title:
      "Malta Single Permit Guide 2026: Cost, Eligibility & Application Steps",
    url: `${SITE_URL}/blog/malta-single-permit-guide-2026`,
    type: "article",
    images: [getBlogOgImage("Malta Single Permit Guide 2026")],
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Single Permit Guide 2026",
  },
};

export default function MaltaSinglePermitGuide2026Page() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Single Permit Guide 2026: Cost, Eligibility & Application Steps"
        description="Verified, source-cited 2026 guide to Malta's Single Permit. Covers government fees, KEI and SEI fast-track routes, the mandatory Pre-Departure Course (Skills Pass), the 30+30 day post-termination grace period, and the full document checklist."
        slug="malta-single-permit-guide-2026"
        datePublished="2026-04-07"
        sources={ARTICLE_SOURCES}
      />
      <HowToJsonLd
        name="How to Apply for a Malta Single Permit (2026)"
        description="Step-by-step process an employer follows to sponsor a third-country national for a Malta Single Permit, including the new Pre-Departure Course requirement."
        totalTime="PT8W"
        steps={[
          {
            name: "Confirm employer registration with Jobsplus",
            text: "The Maltese employer must already be registered with Jobsplus and able to demonstrate compliance with Malta's labour-market rules before sponsoring a third-country national.",
          },
          {
            name: "Advertise the vacancy",
            text: "Standard Single Permit applications need a vacancy advertised on Jobsplus and EURES for at least 3 weeks within the 2 months before applying. KEI, SEI, EU Blue Card and Skilled Occupation List applications need only one advert on a local media platform for 2 weeks.",
          },
          {
            name: "Complete the Pre-Departure Course",
            text: "First-time third-country nationals enrol on skillspass.org.mt, complete two online modules (Living and Working in Malta + Rights and Obligations), pass a 20-minute interview at ITS Malta or an authorised Global Assessment Centre, and pay €250.",
          },
          {
            name: "Submit the application via the Single Permit Portal",
            text: "The employer logs into singlepermit.gov.mt, fills the form, uploads the document checklist (passport, contract, advert, accommodation, MQRIC qualifications, health insurance, etc.) and pays the €600 government fee.",
          },
          {
            name: "Confirm and finalise online",
            text: "The third-country national receives an email link to confirm and validate the data. Once confirmed, the employer finalises the submission and Identità begins processing.",
          },
          {
            name: "Wait for the Approval in Principle",
            text: "Identità processes applications within roughly two months on average (the legal maximum is four months). When approved, the applicant receives an Approval in Principle letter and, if needed, applies for an entry visa within 180 days.",
          },
          {
            name: "Capture biometrics in Malta",
            text: "After arrival, the applicant books a biometrics appointment at the Expatriates Unit. Once captured, an Interim Receipt with a Temporary Authorisation to Work is issued and the residence card is mailed.",
          },
        ]}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Malta Single Permit Guide 2026",
            url: `${SITE_URL}/blog/malta-single-permit-guide-2026`,
          },
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "How much does the Malta Single Permit cost in 2026?",
            answer:
              "The Identità government fee is €600 for a first-time Single Permit and €150 per year for renewals. A change of employer also costs €600, while a transfer of business or merger is €300. Live-in carers pay €27.50. From January 2026, first-time third-country nationals must also pay €250 for the mandatory Pre-Departure Course on the Skills Pass portal.",
          },
          {
            question:
              "What is the salary threshold for the Key Employee Initiative (KEI)?",
            answer:
              "The Key Employee Initiative requires a minimum annual gross salary of €45,000 plus certified qualifications, warrants or proof of work experience for a managerial or highly technical role. KEI permits are valid for one year initially and renewable for up to three years on the strength of a valid contract and a stamped annual tax declaration.",
          },
          {
            question: "What is the difference between KEI and SEI in Malta?",
            answer:
              "KEI is the fast-track route for managerial or highly technical roles paying at least €45,000 per year. SEI is an alternative fast-track route for highly skilled specialists paying at least €30,000 per year, who hold either an MQF Level 6 qualification or a lower qualification plus three years of certified relevant experience. SEI applications are processed within 15 working days of a complete submission.",
          },
          {
            question:
              "Is the Pre-Departure Course mandatory for the Malta Single Permit?",
            answer:
              "Yes. From January 2026 every first-time third-country national applying for a Malta Single Permit must complete a mandatory Pre-Departure Course on skillspass.org.mt. The course consists of two online modules — Living and Working in Malta, and Rights and Obligations in the Workplace — and a 20-minute live interview at ITS Malta or an authorised Global Assessment Centre. The fee is €250 and the process must be finished within 42 days. Identità began verifying certificates on 1 March 2026.",
          },
          {
            question: "How long does the Malta Single Permit take to process?",
            answer:
              "Subsidiary Legislation 217.17 allows Identità up to four months to process a Single Permit application. The average processing time is closer to two months once the file is complete. Specialist Employee Initiative (SEI) applications are processed within 15 working days of a complete submission.",
          },
          {
            question:
              "Can I change employer on a Malta Single Permit after losing my job?",
            answer:
              "Yes, in most cases. The safest route is for the new employer to file a Change of Employer application before your current contract ends, which keeps your residency valid throughout processing. If you have already been terminated, Subsidiary Legislation 217.17 gives you an automatic 30-day grace period to stay in Malta and search. You can extend it by another 30 days — up to 60 days in total — by submitting proof of financial self-sufficiency. While the grace period is running, the new employer can still file the Change of Employer application. After day 60 the standard first-time eligibility criteria apply, which usually means leaving Schengen and restarting from abroad.",
          },
          {
            question:
              "Who can apply for the Malta Single Permit and who cannot?",
            answer:
              "Third-country nationals (non-EU/EEA/Swiss) with a job offer from a Maltese-registered company that is also registered with Jobsplus are eligible. The employer files the application; only live-in carers can submit directly. Beneficiaries of refugee, subsidiary or temporary humanitarian protection, including those awaiting a decision on their status, are not eligible.",
          },
          {
            question: "What documents are required for a Single Permit?",
            answer:
              "Identità publishes a checklist that includes the applicant's passport (valid for at least 8 months) plus a full PDF copy, a signed Europass CV, a health insurance policy with at least €100,000 of coverage, a signed employment contract, a Position Description form, a Jobsplus Declaration of Suitability, proof of advertisement, qualification certificates with MQRIC recognition, an accommodation agreement plus Lease Agreement Attestation, and a signed Privacy Policy. Additional documents may be requested depending on the role.",
          },
          {
            question:
              "When did Malta's new Single Permit rules come into force?",
            answer:
              "Malta's 2025 Labour Migration Policy rolls out in four phases. The first wave came into force on 1 August 2025 (new fees of €600 / €150, termination rate thresholds, the extended 30-day grace period, KEI €45,000 / SEI €30,000 salary thresholds, and the 4-day Jobsplus form rule). A second wave landed on 1 October 2025 (no in-country applications from tourist visas, mandatory salary payment via licensed financial institutions, fixed renewal periods, and the 60-day interim permit for visa-waiver countries). A third wave is expected from January 2026 (First Employment Rule, mandatory Pre-Departure Course, suitability check). The fourth wave — the Register of Exemplary Employers, occupation-specific salary study, and high-risk country list — runs from October 2026 onwards.",
          },
          {
            question: "What is the First Employment Rule for Malta employers?",
            answer:
              "Expected from January 2026, the First Employment Rule requires employers to already employ a minimum number of Maltese, EU/EEA, Swiss or long-term-resident workers before applying for foreign hires. The minimums are: Micro (1–9 employees) → 2 such workers; Small (10–49) → 4; Medium (50–249) → 20; Large (250+) → 40. Companies whose workforce is more than 80% foreign will additionally face enhanced labour market needs testing. KEI applications, sports, students and healthcare are exempt from this rule.",
          },
        ]}
      />
      <main role="main" aria-label="Malta Single Permit Guide 2026">
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
                  Immigration
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  April 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  14 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Single Permit Guide 2026: Cost, Eligibility &amp;
                Application Steps
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Everything a non-EU worker or a Maltese employer needs to know
                about the Single Permit in 2026 — verified line by line against
                the Identità Expatriates Unit pages and the July 2025 Labour
                Migration Policy Fact Sheet. Fees, KEI / SEI thresholds, the
                mandatory Pre-Departure Course, the 30 + 30 day post-termination
                grace period and the full document checklist are all covered.
              </p>
            </header>

            {/* Verification banner */}
            <div className="not-prose mb-10 flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm">
              <BadgeCheck className="h-5 w-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div>
                <strong>Last verified 7 April 2026.</strong> Every figure on
                this page was cross-checked against the Identità Expatriates
                Unit pages and the Skills Pass portal. See the{" "}
                <a href="#sources" className="underline font-semibold">
                  full source list
                </a>{" "}
                at the end.
              </div>
            </div>

            {/* Key Takeaways */}
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl mb-10 not-prose">
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-primary">
                  Key Takeaways
                </h2>
              </div>

              {/* Top-line facts */}
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>
                    The Malta Single Permit is the residence-plus-work permit
                    for non-EU nationals, regulated by{" "}
                    <strong>Subsidiary Legislation 217.17</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>
                    <strong>KEI</strong> requires a minimum annual gross salary
                    of <strong>€45,000</strong>; <strong>SEI</strong> requires{" "}
                    <strong>€30,000</strong> plus an MQF Level 6 qualification
                    or three years of certified experience.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>
                    From <strong>January 2026</strong> a mandatory{" "}
                    <strong>Pre-Departure Course</strong> (€250) is required for
                    every first-time applicant; Identità began verifying
                    certificates on <strong>1 March 2026</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>
                    Average processing time is{" "}
                    <strong>around two months</strong>; the legal maximum is
                    four. SEI applications are processed within{" "}
                    <strong>15 working days</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>
                    After termination the worker keeps an automatic{" "}
                    <strong>30-day</strong> grace period in Malta, extendable by
                    another <strong>30 days</strong> with proof of financial
                    self-sufficiency — a 60-day maximum window for a Change of
                    Employer application.
                  </span>
                </li>
              </ul>

              {/* Fee schedule — broken out into a clean grid */}
              <div className="mt-5 rounded-xl border border-primary/15 bg-background/40 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">
                  Identità government fees · 2026
                </p>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-baseline justify-between border-b border-border/40 pb-1.5">
                    <dt className="text-muted-foreground">First-time</dt>
                    <dd className="font-bold tabular-nums">€600</dd>
                  </div>
                  <div className="flex items-baseline justify-between border-b border-border/40 pb-1.5">
                    <dt className="text-muted-foreground">Renewal</dt>
                    <dd className="font-bold tabular-nums">€150 / yr</dd>
                  </div>
                  <div className="flex items-baseline justify-between border-b border-border/40 pb-1.5">
                    <dt className="text-muted-foreground">
                      Change of employer
                    </dt>
                    <dd className="font-bold tabular-nums">€600</dd>
                  </div>
                  <div className="flex items-baseline justify-between border-b border-border/40 pb-1.5">
                    <dt className="text-muted-foreground">
                      Change of designation
                    </dt>
                    <dd className="font-bold tabular-nums">€300</dd>
                  </div>
                  <div className="flex items-baseline justify-between sm:col-span-2 border-b border-border/40 pb-1.5">
                    <dt className="text-muted-foreground">
                      Health / elderly / disability care (any type)
                    </dt>
                    <dd className="font-bold tabular-nums">€150</dd>
                  </div>
                  <div className="flex items-baseline justify-between sm:col-span-2">
                    <dt className="text-muted-foreground">
                      Pre-Departure Course (first-timers)
                    </dt>
                    <dd className="font-bold tabular-nums">+€250</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Table of Contents */}
            <nav className="p-6 bg-muted/30 rounded-2xl mb-12 not-prose">
              <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
              <ol className="space-y-2 text-sm">
                <li>
                  <a
                    href="#what-is-it"
                    className="text-primary hover:underline"
                  >
                    1. What Is the Malta Single Permit?
                  </a>
                </li>
                <li>
                  <a href="#timeline" className="text-primary hover:underline">
                    2. What Changes, When — The 2025–2026 Timeline
                  </a>
                </li>
                <li>
                  <a
                    href="#who-is-eligible"
                    className="text-primary hover:underline"
                  >
                    3. Who Is Eligible (and Who Is Not)?
                  </a>
                </li>
                <li>
                  <a href="#cost" className="text-primary hover:underline">
                    4. How Much Does the Single Permit Cost in 2026?
                  </a>
                </li>
                <li>
                  <a href="#documents" className="text-primary hover:underline">
                    5. What Documents Are Required?
                  </a>
                </li>
                <li>
                  <a href="#process" className="text-primary hover:underline">
                    6. How the Application Works (Step by Step)
                  </a>
                </li>
                <li>
                  <a href="#kei-sei" className="text-primary hover:underline">
                    7. KEI and SEI: The Fast-Track Routes
                  </a>
                </li>
                <li>
                  <a
                    href="#skills-pass"
                    className="text-primary hover:underline"
                  >
                    8. The Pre-Departure Course (Skills Pass)
                  </a>
                </li>
                <li>
                  <a
                    href="#processing-time"
                    className="text-primary hover:underline"
                  >
                    9. How Long Does Processing Take?
                  </a>
                </li>
                <li>
                  <a
                    href="#change-employer"
                    className="text-primary hover:underline"
                  >
                    10. Changing Employer on a Single Permit
                  </a>
                </li>
                <li>
                  <a
                    href="#after-termination"
                    className="text-primary hover:underline"
                  >
                    11. What Happens After Termination
                  </a>
                </li>
                <li>
                  <a href="#tax-link" className="text-primary hover:underline">
                    12. Net Pay, SSC and Tax for Permit Holders
                  </a>
                </li>
                <li>
                  <a
                    href="#employer-rules"
                    className="text-primary hover:underline"
                  >
                    13. Employer Compliance Rules at a Glance
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
            <section id="what-is-it">
              <h2>1. What Is the Malta Single Permit?</h2>
              <p>
                The Malta Single Permit is a combined residence and work
                authorisation issued to third-country nationals (non-EU,
                non-EEA, non-Swiss) who have a job offer from a company
                registered and operating in Malta. It is regulated by{" "}
                <strong>Subsidiary Legislation 217.17</strong> and merges what
                used to be two separate processes — the employment licence and
                the residence permit — into a single application handled by
                Identità&apos;s Expatriates Unit.
              </p>

              <div className="not-prose my-6 rounded-2xl border border-border/60 bg-muted/30 p-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  <Info className="h-4 w-4" /> Quick definition
                </div>
                <p className="text-sm leading-relaxed">
                  A Single Permit is a temporary residence-plus-work permit,
                  issued for an initial period of more than six months and
                  renewable, that authorises a non-EU worker to live in Malta
                  and take up the specific employment named in the application.
                  It is tied to one employer and one designated role — changes
                  to either invalidate the permit and require a new application.
                </p>
              </div>

              <p>
                The Single Permit does <strong>not</strong> authorise its holder
                to:
              </p>
              <ul>
                <li>
                  carry out paid work for any employer other than the one
                  identified in the application;
                </li>
                <li>
                  perform tasks unrelated to the specific employment activity
                  declared in the application; or
                </li>
                <li>be assigned duties outside Maltese territory.</li>
              </ul>
              <p>
                Applications can be filed while the third-country national is
                still abroad (outside Schengen) or while legally staying in
                Malta or another Schengen state on a valid visa or residence
                permit. Only the Maltese employer can submit the application —
                the third-country national cannot apply directly. The one
                exception is live-in carers, who may apply themselves provided
                the employer endorses the file.
              </p>
            </section>

            {/* Section 2 — POLICY TIMELINE (NEW) */}
            <section id="timeline" className="mt-12">
              <h2>2. What Changes, When — The 2025–2026 Timeline</h2>
              <p>
                Malta&apos;s 2025 Labour Migration Policy introduces 32
                recommendations that roll out in four phases between August 2025
                and late 2026. Some are already in force (new fees, termination
                thresholds, the 30-day grace period). Others are expected to
                land formally in January 2026 (the First Employment Rule, the
                suitability check, the mandatory Pre-Departure Course). And a
                third wave — the Register of Exemplary Employers,
                occupation-specific salary studies, and high-risk country lists
                — kicks in from October 2026 onwards.
              </p>
              <p>
                The visual timeline below shows every major rule, sorted by
                effective date, with a status badge so you can see at a glance
                what is live today versus what is still expected. Every entry is
                sourced from the Identità Labour Migration Policy Fact Sheet
                (July 2025).
              </p>

              <PolicyTimeline />
            </section>

            {/* Section 3 */}
            <section id="who-is-eligible" className="mt-12">
              <h2>3. Who Is Eligible (and Who Is Not)?</h2>
              <p>
                Any third-country national with a job offer from a
                Malta-registered company can apply, provided that the employer
                is also registered with Jobsplus. Identità only processes
                applications where, at the time of filing, the applicant is
                either still in their country of residence (&quot;Still
                Abroad&quot;) or is legally staying in Malta on a valid permit
                or visa.
              </p>

              <h3>Who can apply</h3>
              <ul>
                <li>
                  Non-EU/EEA/Swiss nationals with a signed job offer from a
                  Maltese-registered employer.
                </li>
                <li>
                  Crew members joining a vessel in Malta (treated as &quot;Still
                  Abroad&quot;).
                </li>
                <li>
                  Innovators in start-up projects endorsed by Malta Enterprise
                  (typically routed through KEI).
                </li>
                <li>
                  Live-in carers — the only category permitted to submit the
                  application directly, provided the employer endorses it.
                </li>
              </ul>

              <h3>Who cannot apply</h3>
              <ul>
                <li>
                  Beneficiaries of a protection certificate (refugee, subsidiary
                  or temporary humanitarian protection).
                </li>
                <li>
                  People awaiting a decision on a protection or immigration
                  case.
                </li>
                <li>
                  Anyone holding a Schengen visa that does not permit
                  employment, when trying to apply from inside Malta — these
                  applications are rejected.
                </li>
              </ul>

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl not-prose my-4">
                <p className="text-sm">
                  <strong>Note for employers:</strong> if it emerges during
                  processing that the applicant does not actually meet the S.L.
                  217.17 criteria, the application is refused with{" "}
                  <strong>no recourse to refund</strong>. Vet eligibility
                  carefully before paying the €600 government fee.
                </p>
              </div>
            </section>

            {/* Section 3 — COST */}
            <section id="cost" className="mt-12">
              <h2>4. How Much Does the Single Permit Cost in 2026?</h2>
              <p>
                In 2026 the Malta Single Permit costs{" "}
                <strong>€600 for a first-time application</strong> and{" "}
                <strong>€150 per year for renewals</strong>, paid online when
                the application is finalised. A change of employer is also €600,
                a change of designation or a transfer of business is €300, and
                live-in carers pay €27.50. Roles in the health sector and in the
                care of the elderly or persons with disabilities are capped at
                €150 across all application types. First-time applicants from
                January 2026 must additionally pay <strong>€250</strong> for the
                mandatory Pre-Departure Course on the Skills Pass portal.
              </p>

              <h3>Official Identità fee schedule (2026)</h3>
              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Application type
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Government fee
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        First-time Single Permit
                      </td>
                      <td className="border border-border p-3">€600</td>
                      <td className="border border-border p-3">
                        Per application; Pre-Departure Course adds €250
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        Renewal
                      </td>
                      <td className="border border-border p-3">
                        €150 per year
                      </td>
                      <td className="border border-border p-3">
                        Up to 3 years for KEI / SEI / EU Blue Card
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Change of employer
                      </td>
                      <td className="border border-border p-3">€600</td>
                      <td className="border border-border p-3">
                        Same fee as a fresh first-time application
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        Change of designation
                      </td>
                      <td className="border border-border p-3">€300</td>
                      <td className="border border-border p-3">
                        New role within the same employer
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Transfer of business / merger
                      </td>
                      <td className="border border-border p-3">€300</td>
                      <td className="border border-border p-3">
                        Where the existing employment is taken over
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        Health sector &amp; elderly / disability care
                      </td>
                      <td className="border border-border p-3">
                        €150 (all types)
                      </td>
                      <td className="border border-border p-3">
                        Fee cap across every application type
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Live-in carer
                      </td>
                      <td className="border border-border p-3">€27.50</td>
                      <td className="border border-border p-3">
                        New, renewal or change of employer
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        Pre-Departure Course (Skills Pass)
                      </td>
                      <td className="border border-border p-3">€250</td>
                      <td className="border border-border p-3">
                        Mandatory for first-time TCNs from January 2026
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                The all-in cost of bringing a new third-country worker to Malta
                in 2026 — government fee plus the Pre-Departure Course —
                therefore starts from <strong>€850</strong>, before any paid
                recruitment advertising. The table below shows common real-world
                scenarios with the exact totals you can expect.
              </p>

              <h3>Cost scenarios: what you actually pay</h3>
              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Scenario
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Identità fee
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Pre-Departure
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">
                        First-time hire (standard role)
                      </td>
                      <td className="border border-border p-3">€600</td>
                      <td className="border border-border p-3">€250</td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        €850
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        First-time nurse or care worker
                      </td>
                      <td className="border border-border p-3">€150</td>
                      <td className="border border-border p-3">€250</td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        €400
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        2-year renewal (standard)
                      </td>
                      <td className="border border-border p-3">
                        €300 (€150 × 2)
                      </td>
                      <td className="border border-border p-3">—</td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        €300
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        3-year KEI renewal
                      </td>
                      <td className="border border-border p-3">
                        €450 (€150 × 3)
                      </td>
                      <td className="border border-border p-3">—</td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        €450
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        Change of employer
                      </td>
                      <td className="border border-border p-3">€600</td>
                      <td className="border border-border p-3">—</td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        €600
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Change of designation (same employer)
                      </td>
                      <td className="border border-border p-3">€300</td>
                      <td className="border border-border p-3">—</td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        €300
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        Live-in carer (first-time, from abroad)
                      </td>
                      <td className="border border-border p-3">€27.50</td>
                      <td className="border border-border p-3">€250</td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        €277.50
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="not-prose my-6 rounded-2xl border border-border/60 bg-muted/30 p-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  <Info className="h-4 w-4" /> Worked example
                </div>
                <p className="text-sm leading-relaxed">
                  A Malta-registered software company sponsoring a senior
                  developer from India in April 2026 pays the €600 first-time
                  Identità fee, the €250 Pre-Departure Course, and around €0 for
                  advertising (Jobsplus and EURES are free), for a total of{" "}
                  <strong>€850</strong>. If the same company is an approved
                  health operator recruiting a staff nurse, the Identità fee
                  drops to €150 and the total falls to <strong>€400</strong>.
                </p>
              </div>
            </section>

            {/* Section 4 — DOCUMENTS */}
            <section id="documents" className="mt-12">
              <h2>5. What Documents Are Required?</h2>
              <p>
                Identità publishes a single canonical checklist for all Single
                Permit applications, including renewals and change of employer.
                The exact contents may vary by role — regulated professions
                require additional warrants — but the core list is stable.
              </p>

              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Document
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        What Identità wants
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Passport
                      </td>
                      <td className="border border-border p-3">
                        Original at appointment + full PDF copy (including blank
                        pages); valid for at least 8 more months from the
                        application date.
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        Curriculum Vitae
                      </td>
                      <td className="border border-border p-3">
                        Europass format, signed by the applicant.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Health insurance
                      </td>
                      <td className="border border-border p-3">
                        Minimum coverage <strong>€100,000</strong> for
                        outpatient and hospital care in Malta and, where
                        relevant, the rest of Europe. Must cover the entire
                        permit period.
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        Health screening certificate
                      </td>
                      <td className="border border-border p-3">
                        For nationalities listed by HPDP. The final approval
                        certificate is required — proof of application is not
                        sufficient.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Employment contract
                      </td>
                      <td className="border border-border p-3">
                        Original signed by both employer and applicant. The
                        position must match every other document.
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        Jobsplus Declaration of Suitability
                      </td>
                      <td className="border border-border p-3">
                        Filled out and signed by the employer. For recruitment
                        cases the relevant certificates and reference letters
                        must accompany it.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Position Description
                      </td>
                      <td className="border border-border p-3">
                        Filled out and signed by both employer and applicant on
                        the official Jobsplus template.
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        Proof of advertisement
                      </td>
                      <td className="border border-border p-3">
                        Standard route: Jobsplus + EURES, minimum 3 weeks within
                        2 months prior. KEI / SEI / Blue Card / Skilled
                        Occupation List: one local media advert, minimum 2
                        weeks.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Qualifications
                      </td>
                      <td className="border border-border p-3">
                        Certificates accompanied by MQRIC recognition (or the
                        MQRIC application receipt if still pending).
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        Accommodation
                      </td>
                      <td className="border border-border p-3">
                        Original lease with both parties&apos; details,
                        Declaration by Landlord, Lease Agreement Attestation and
                        Housing Authority approval (Cap. 604).
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Privacy Policy
                      </td>
                      <td className="border border-border p-3">
                        Identità privacy form signed by both applicant and
                        employer.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                Identità may request additional documentation depending on the
                case. Always cross-check the active checklist on the{" "}
                <a
                  href="https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/employment-related-permits/single-permit/documents-required/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Identità Documents Required page
                </a>{" "}
                before submitting.
              </p>
            </section>

            {/* Section 5 — PROCESS */}
            <section id="process" className="mt-12">
              <h2>6. How the Application Works (Step by Step)</h2>
              <p>
                The Single Permit is filed online through the Identità
                Expatriates Portal at{" "}
                <a
                  href="https://singlepermit.gov.mt/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  singlepermit.gov.mt
                </a>
                . Only the employer holds the login; the third-country national
                receives a confirmation email partway through. The seven steps
                below mirror the workflow Identità expects.
              </p>

              <ol className="not-prose mt-6 space-y-4">
                {[
                  {
                    title:
                      "Step 1 — Confirm employer registration with Jobsplus",
                    body: "The Maltese employer must already be registered with Jobsplus and able to demonstrate compliance with Malta's labour-market rules before sponsoring a third-country national.",
                  },
                  {
                    title: "Step 2 — Advertise the vacancy",
                    body: "Standard applications need a Jobsplus + EURES advert running at least 3 weeks within the 2 months before submission. KEI, SEI, EU Blue Card and Skilled Occupation List applications need only a 2-week local media advert.",
                  },
                  {
                    title: "Step 3 — Complete the Pre-Departure Course",
                    body: "First-time third-country nationals enrol on skillspass.org.mt, complete the two online modules, sit a 20-minute interview at ITS Malta or an authorised Global Assessment Centre and pay €250.",
                  },
                  {
                    title: "Step 4 — Submit the application via the portal",
                    body: "The employer logs into singlepermit.gov.mt, fills the form, uploads the document checklist and pays the €600 government fee.",
                  },
                  {
                    title: "Step 5 — Confirm and finalise online",
                    body: "The applicant receives an email link to confirm and validate the data. Once confirmed, the employer finalises the submission and Identità begins processing.",
                  },
                  {
                    title: "Step 6 — Wait for the Approval in Principle",
                    body: "Average processing time is around two months (legal maximum: four). Approved applicants receive an Approval in Principle letter and may apply for an entry visa within 180 days.",
                  },
                  {
                    title: "Step 7 — Capture biometrics in Malta",
                    body: "After arrival the applicant books biometrics at the Expatriates Unit. Once captured, an Interim Receipt with a Temporary Authorisation to Work is issued and the residence card is mailed home.",
                  },
                ].map((step) => (
                  <li
                    key={step.title}
                    className="rounded-2xl border border-border/60 bg-muted/20 p-5"
                  >
                    <h3 className="text-base font-bold mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.body}</p>
                  </li>
                ))}
              </ol>
            </section>

            {/* Section 6 — KEI/SEI */}
            <section id="kei-sei" className="mt-12">
              <h2>7. KEI and SEI: The Fast-Track Routes</h2>
              <p>
                Malta runs two fast-track routes for highly qualified
                third-country nationals. The{" "}
                <strong>Key Employee Initiative (KEI)</strong> is for managerial
                and highly technical roles paying at least €45,000 a year. The{" "}
                <strong>Specialist Employee Initiative (SEI)</strong> is the
                alternative for highly skilled specialists who do not qualify
                for KEI but earn at least €30,000 and hold the right academic,
                vocational or technical credentials.
              </p>

              {/* KEI / SEI explainer cards */}
              <div className="not-prose my-8 grid gap-5 md:grid-cols-2">
                {/* KEI */}
                <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-background to-emerald-500/5 p-6 md:p-7">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                      Fast-track · Managerial &amp; Highly Technical
                    </span>
                    <Crown className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="!mt-0 mb-2 text-2xl font-bold">
                    Key Employee Initiative
                  </h3>
                  <p className="mb-5 text-sm text-muted-foreground">
                    For senior managers and highly technical specialists. The
                    premium fast-track route under S.L. 217.17.
                  </p>
                  <dl className="space-y-2.5 text-sm">
                    <KeiSeiFact
                      icon={<Euro className="h-4 w-4" />}
                      label="Salary threshold"
                      value="€45,000 / yr (was €35,000)"
                    />
                    <KeiSeiFact
                      icon={<GraduationCap className="h-4 w-4" />}
                      label="Qualifications"
                      value="Certified qualifications, warrants or proof of experience"
                    />
                    <KeiSeiFact
                      icon={<Megaphone className="h-4 w-4" />}
                      label="Job advert"
                      value="2 weeks on local media"
                    />
                    <KeiSeiFact
                      icon={<Rocket className="h-4 w-4" />}
                      label="Start-up route"
                      value="Open to Malta Enterprise–endorsed innovators"
                    />
                    <KeiSeiFact
                      icon={<Calendar className="h-4 w-4" />}
                      label="Duration"
                      value="1 yr initial · up to 3 yrs renewal"
                    />
                    <KeiSeiFact
                      icon={<CreditCard className="h-4 w-4" />}
                      label="Fee"
                      value="€600 first-time · €150 / yr renewal"
                    />
                  </dl>
                  <a
                    href="https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/employment-related-permits/highly-qualified-individuals/key-employee-initiative/who-is-eligible/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
                  >
                    Official Identità KEI page
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {/* SEI */}
                <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-6 md:p-7">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full bg-primary/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                      Alternative Fast-track · Skilled Specialists
                    </span>
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="!mt-0 mb-2 text-2xl font-bold">
                    Specialist Employee Initiative
                  </h3>
                  <p className="mb-5 text-sm text-muted-foreground">
                    For skilled specialists who do not qualify for KEI but have
                    strong academic, vocational or technical credentials.
                  </p>
                  <dl className="space-y-2.5 text-sm">
                    <KeiSeiFact
                      icon={<Euro className="h-4 w-4" />}
                      label="Salary threshold"
                      value="€30,000 / yr (was €25,000)"
                    />
                    <KeiSeiFact
                      icon={<GraduationCap className="h-4 w-4" />}
                      label="Qualifications"
                      value="MQF Level 6+ OR 3+ years certified experience"
                    />
                    <KeiSeiFact
                      icon={<Megaphone className="h-4 w-4" />}
                      label="Job advert"
                      value="2 weeks on local media"
                    />
                    <KeiSeiFact
                      icon={<Timer className="h-4 w-4" />}
                      label="Processing"
                      value="15 working days from complete submission"
                    />
                    <KeiSeiFact
                      icon={<Calendar className="h-4 w-4" />}
                      label="Duration"
                      value="Up to 3 yrs on renewal"
                    />
                    <KeiSeiFact
                      icon={<CreditCard className="h-4 w-4" />}
                      label="Fee"
                      value="€600 per application"
                    />
                  </dl>
                  <a
                    href="https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/employment-related-permits/highly-qualified-individuals/specialist-employee-initiative/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    Official Identità SEI page
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <h3>KEI vs SEI at a glance</h3>
              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Criterion
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        KEI
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        SEI
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Minimum gross salary
                      </td>
                      <td className="border border-border p-3">€45,000/yr</td>
                      <td className="border border-border p-3">€30,000/yr</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        Role profile
                      </td>
                      <td className="border border-border p-3">
                        Managerial / highly technical
                      </td>
                      <td className="border border-border p-3">
                        Highly skilled specialist (any sector)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Qualification standard
                      </td>
                      <td className="border border-border p-3">
                        Certified qualifications, warrants or proof of
                        experience
                      </td>
                      <td className="border border-border p-3">
                        MQF Level 6+, or lower qualifications + 3 years of
                        certified relevant experience
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        Job advert
                      </td>
                      <td className="border border-border p-3">
                        2 weeks on a local media platform
                      </td>
                      <td className="border border-border p-3">
                        2 weeks on a local media platform
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Processing time
                      </td>
                      <td className="border border-border p-3">Fast-tracked</td>
                      <td className="border border-border p-3">
                        15 working days from complete submission
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        Permit duration
                      </td>
                      <td className="border border-border p-3">
                        1 year initial, renewable up to 3 years
                      </td>
                      <td className="border border-border p-3">
                        Up to 3 years on renewal
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Government fee
                      </td>
                      <td className="border border-border p-3">
                        €600 + €150/yr renewal
                      </td>
                      <td className="border border-border p-3">€600</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                KEI is also extended to innovators in start-up projects endorsed
                by Malta Enterprise. SEI applications are submitted under the
                same Single Permit Regulations (S.L. 217.17) and accept the same
                forms with the SEI suffix. Both routes require a stamped annual
                tax declaration on renewal — KEI renewals additionally need a
                valid definite or indefinite contract.
              </p>

              <h3>Which route fits which worker? Four real profiles</h3>
              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Worker profile
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Salary
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Credentials
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Recommended route
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">
                        Senior software architect, head of engineering
                      </td>
                      <td className="border border-border p-3">€60,000 / yr</td>
                      <td className="border border-border p-3">
                        10+ years managerial experience
                      </td>
                      <td className="border border-border p-3 font-semibold text-emerald-600 dark:text-emerald-400">
                        KEI
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Biomedical engineer on a research project
                      </td>
                      <td className="border border-border p-3">€38,000 / yr</td>
                      <td className="border border-border p-3">
                        MSc in Biomedical Engineering (MQF Level 7)
                      </td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        SEI
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        Time-served carpenter with no degree
                      </td>
                      <td className="border border-border p-3">€32,000 / yr</td>
                      <td className="border border-border p-3">
                        10 years certified trade experience
                      </td>
                      <td className="border border-border p-3 font-semibold text-primary">
                        SEI (via experience route)
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Junior marketing coordinator
                      </td>
                      <td className="border border-border p-3">€22,000 / yr</td>
                      <td className="border border-border p-3">
                        BA in Marketing
                      </td>
                      <td className="border border-border p-3 font-semibold text-amber-600 dark:text-amber-400">
                        Standard Single Permit
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="not-prose my-6 rounded-2xl border border-border/60 bg-muted/30 p-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  <Info className="h-4 w-4" /> Quick decision rules
                </div>
                <ul className="space-y-1.5 text-sm leading-relaxed">
                  <li>
                    <strong>Salary ≥ €45,000</strong> and a managerial / highly
                    technical role → <strong>KEI</strong>.
                  </li>
                  <li>
                    <strong>Salary ≥ €30,000</strong> + MQF Level 6+ degree OR
                    3+ years of certified experience → <strong>SEI</strong>.
                  </li>
                  <li>
                    Neither of the above →{" "}
                    <strong>Standard Single Permit</strong> under S.L. 217.17,
                    with the full 3-week Jobsplus + EURES advert.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 7 — SKILLS PASS */}
            <section id="skills-pass" className="mt-12">
              <h2>8. The Pre-Departure Course (Skills Pass)</h2>
              <p>
                Since January 2026, every first-time Single Permit applicant
                must complete a mandatory Pre-Departure Course before Identità
                will issue Approval in Principle. The course is hosted on{" "}
                <a
                  href="https://skillspass.org.mt/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  skillspass.org.mt
                </a>{" "}
                and is administered by the Pre-Departure Course Unit. Two key
                dates: the portal opened on <strong>5 January 2026</strong>, and
                Identità began verifying certificates on{" "}
                <strong>1 March 2026</strong>.
              </p>

              <h3>Part 1 — National integration (mandatory for everyone)</h3>
              <ul>
                <li>
                  Two online modules: <em>Living and Working in Malta</em> and{" "}
                  <em>Rights and Obligations in the Workplace</em>.
                </li>
                <li>
                  Each module runs <strong>10–12 hours</strong> of video
                  lessons, reading and assignments, with an end-of-module
                  assessment.
                </li>
                <li>
                  A <strong>20-minute live online interview</strong> conducted
                  at ITS Malta or an authorised Global Assessment Centre
                  verifies English proficiency and understanding.
                </li>
                <li>
                  The whole of Part 1 must be completed within{" "}
                  <strong>42 days</strong> of starting the course.
                </li>
                <li>
                  Course fee: <strong>€250</strong>.
                </li>
              </ul>

              <h3>Part 2 — Sector-specific (only for claimed sectors)</h3>
              <p>
                Sectors governed by their own subsidiary legislation also need a
                sector certification on top of Part 1. As of April 2026 the only
                claimed sector is <strong>Tourism &amp; Hospitality</strong>,
                where successful completion of the additional modules issues the
                full Skills Pass alongside the Pre-Departure Certificate.
              </p>

              <h3>
                Sample Skills Pass timeline (start to Identità submission)
              </h3>
              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Day
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Milestone
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Outcome
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Day 0
                      </td>
                      <td className="border border-border p-3">
                        Candidate registers on skillspass.org.mt and pays the
                        €250 course fee
                      </td>
                      <td className="border border-border p-3">
                        Course access granted
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        Day 1 – 10
                      </td>
                      <td className="border border-border p-3">
                        Module 1: <em>Living and Working in Malta</em> (10–12
                        hours + assessment)
                      </td>
                      <td className="border border-border p-3">
                        Module 1 passed
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Day 11 – 25
                      </td>
                      <td className="border border-border p-3">
                        Module 2:{" "}
                        <em>Rights and Obligations in the Workplace</em> (10–12
                        hours + assessment)
                      </td>
                      <td className="border border-border p-3">
                        Module 2 passed
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        Day 26 – 40
                      </td>
                      <td className="border border-border p-3">
                        20-minute live interview at ITS Malta or an authorised
                        Global Assessment Centre
                      </td>
                      <td className="border border-border p-3">
                        Pre-Departure Certificate issued
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Day 42 (latest)
                      </td>
                      <td className="border border-border p-3">
                        Hard deadline to complete Part 1
                      </td>
                      <td className="border border-border p-3">
                        Miss it and the course must restart
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-semibold">
                        Day 43 +
                      </td>
                      <td className="border border-border p-3">
                        Employer lodges the Single Permit application on
                        singlepermit.gov.mt with the certificate attached
                      </td>
                      <td className="border border-border p-3">
                        Identità processing begins
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                In round numbers, plan on a <strong>6-week window</strong>{" "}
                between the day the candidate pays the course fee and the day
                the Single Permit application can be filed. That is on top of
                Identità&apos;s own two-month average processing time, so the
                full lead time from recruitment decision to an approved permit
                is typically <strong>3 to 4 months</strong>.
              </p>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl not-prose my-4">
                <p className="text-sm">
                  <strong>Heads up:</strong> the in-country portion of
                  Identità&apos;s Single Permit process only begins after the
                  Pre-Departure Certificate has been verified. Build this 6-week
                  buffer into the recruitment timeline, especially if you are
                  hiring for a start date after a fixed onboarding milestone.
                </p>
              </div>
            </section>

            {/* Section 8 — PROCESSING TIME */}
            <section id="processing-time" className="mt-12">
              <h2>9. How Long Does Processing Take?</h2>
              <p>
                Subsidiary Legislation 217.17 gives Identità up to{" "}
                <strong>four months</strong> to process a Single Permit
                application. In practice the average is closer to{" "}
                <strong>two months</strong>, measured from the date a complete
                file is submitted. SEI applications follow a separate, statutory{" "}
                <strong>15 working day</strong> processing window — but only
                from the moment all required documents are present.
              </p>

              <p>
                Real-time application status is visible from the Single Permit
                Portal dashboard, both for the employer and (via the emailed
                link) for the third-country national. Status codes are explained
                in the portal&apos;s User Manual.
              </p>

              <h3>How to keep your file fast</h3>
              <ul>
                <li>
                  Submit a complete checklist on day one — the clock only starts
                  when nothing is missing.
                </li>
                <li>
                  Ensure the Europass CV, employment contract, position
                  description and advert all describe the same job title and
                  duties.
                </li>
                <li>
                  Lodge MQRIC recognition early; attach the receipt if the
                  certificate is still pending.
                </li>
                <li>
                  For SEI, double-check that proof of three years&apos;
                  experience or an MQF Level 6+ certificate is in the file
                  before paying.
                </li>
              </ul>
            </section>

            {/* Section 9 — CHANGE EMPLOYER */}
            <section id="change-employer" className="mt-12">
              <h2>10. Changing Employer on a Single Permit</h2>
              <p>
                The Single Permit is tied to one employer and one designation.
                Any change makes the existing permit null and void and triggers
                a new application. Identità lets the new employer submit a
                Change of Employer application <strong>before</strong> the
                third-country national terminates the previous contract — the
                safest option, because residency stays valid throughout
                processing.
              </p>

              <p>
                If the third-country national has already been terminated,
                Subsidiary Legislation 217.17 gives them a grace period of{" "}
                <strong>30 days</strong> to remain in Malta and look for a new
                job. The worker can extend that window by another{" "}
                <strong>30 days</strong> — up to{" "}
                <strong>60 days in total</strong> — if they can prove financial
                self-sufficiency. While the grace period is running, a new
                employer can still file a Change of Employer application. After
                day 60 the standard eligibility and legality criteria of S.L.
                217.17 apply in full, which usually means leaving Schengen and
                submitting a fresh first-time Single Permit from abroad.
              </p>

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl not-prose my-4">
                <p className="text-sm">
                  <strong>Fee reminder:</strong> a Change of Employer is €600. A
                  change of designation, or a transfer of business or merger
                  where the new employer effectively inherits the existing
                  employment, is €300.
                </p>
              </div>

              <h3>Change of employer decision scenarios</h3>
              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Situation
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Action
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Outcome
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">
                        Worker is still actively employed
                      </td>
                      <td className="border border-border p-3">
                        New employer files a Change of Employer before the
                        current contract ends
                      </td>
                      <td className="border border-border p-3 font-semibold text-emerald-600 dark:text-emerald-400">
                        Residency stays valid; safest path
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Terminated 15 days ago (inside initial 30)
                      </td>
                      <td className="border border-border p-3">
                        New employer lodges the application immediately
                      </td>
                      <td className="border border-border p-3 font-semibold text-emerald-600 dark:text-emerald-400">
                        Processed; worker stays on automatic grace period
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        Terminated 40 days ago, funds available
                      </td>
                      <td className="border border-border p-3">
                        Worker submits proof of financial self-sufficiency; new
                        employer files the application
                      </td>
                      <td className="border border-border p-3 font-semibold text-amber-600 dark:text-amber-400">
                        Extended 30-day window applies
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Terminated 75 days ago
                      </td>
                      <td className="border border-border p-3">
                        Grace period has expired
                      </td>
                      <td className="border border-border p-3 font-semibold text-red-600 dark:text-red-400">
                        Must leave Schengen and restart as first-time
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 10 — TERMINATION */}
            <section id="after-termination" className="mt-12">
              <h2>11. What Happens After Termination</h2>
              <p>
                Termination of employment is the moment a Single Permit is most
                exposed. The permit was issued for one specific employer, so
                once the employment ends the legal basis for residence falls
                away. The grace period introduced by a 2025 amendment to S.L.
                217.17 is your lifeline: it gives the worker time to find a new
                job and gives a new employer time to file a Change of Employer
                application before the window closes.
              </p>

              <h3>The two-stage grace period</h3>
              <ul>
                <li>
                  <strong>Stage 1 — automatic 30 days.</strong> Every Single
                  Permit holder whose employment is terminated gets an automatic
                  30-day grace period to stay in Malta and seek a new role. No
                  paperwork or proof is needed.
                </li>
                <li>
                  <strong>Stage 2 — optional 30 days extension.</strong> The
                  worker can apply for a further 30 days — up to{" "}
                  <strong>60 days in total</strong> — by submitting proof of
                  financial self-sufficiency. This extended grace period was
                  introduced by a legislative amendment and applies to every
                  termination effected from <strong>1 August 2025</strong>.
                </li>
              </ul>

              {/* Static CSS-only visual timeline of the grace period */}
              <div className="not-prose my-8">
                <div className="mb-3 flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span>Day 0 (termination)</span>
                  <span>Day 30</span>
                  <span>Day 60</span>
                </div>
                <div className="flex h-10 overflow-hidden rounded-xl border border-border/60">
                  <div
                    className="flex items-center justify-center bg-emerald-500/20 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
                    style={{ width: "50%" }}
                  >
                    Automatic 30 days
                  </div>
                  <div
                    className="flex items-center justify-center border-l border-dashed border-border/70 bg-amber-500/20 text-xs font-semibold text-amber-700 dark:text-amber-300"
                    style={{ width: "50%" }}
                  >
                    +30 days with financial proof
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                    <strong className="text-foreground">
                      Stage 1 (Days 1 – 30)
                    </strong>
                    <br />
                    Granted automatically. Worker stays in Malta, lodges a new
                    job offer and the new employer files a Change of Employer
                    application.
                  </div>
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                    <strong className="text-foreground">
                      Stage 2 (Days 31 – 60)
                    </strong>
                    <br />
                    Extension requires documentary proof of financial
                    self-sufficiency. Change of Employer applications filed in
                    this window are still processed.
                  </div>
                </div>
              </div>

              <h3>Practical sequence after termination</h3>
              <ol>
                <li>
                  <strong>Day 0:</strong> The previous employer notifies
                  Jobsplus of the termination within the legal deadline.
                </li>
                <li>
                  <strong>Days 1 – 30 (automatic grace):</strong> Source a new
                  job offer, sign a contract and run the 2-week / 3-week vacancy
                  advert as required.
                </li>
                <li>
                  <strong>Day 30:</strong> If no new employer has filed yet,
                  submit proof of financial self-sufficiency to Identità to
                  unlock the 30-day extension.
                </li>
                <li>
                  <strong>Days 31 – 60 (extended grace):</strong> The new
                  employer submits the Change of Employer application on
                  singlepermit.gov.mt. Filing inside this window keeps you in
                  the fast-track route.
                </li>
                <li>
                  <strong>Day 60+:</strong> The grace period has closed. The
                  application defaults to the standard first-time eligibility
                  process, which usually means returning to your country of
                  residence and starting again.
                </li>
              </ol>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl not-prose my-4">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <p className="text-sm">
                    <strong>Source note:</strong> the 30 + 30 day grace period
                    is set out in the Malta Labour Migration Policy Fact Sheet
                    published by Identità in July 2025. It applies to all
                    terminations effected from 1 August 2025. For cases that
                    pre-date that amendment, the legacy rules in force at the
                    time of termination apply.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 11 — TAX LINK */}
            <section id="tax-link" className="mt-12">
              <h2>12. Net Pay, SSC and Tax for Permit Holders</h2>
              <p>
                A Single Permit holder is taxed and contributes to social
                security on exactly the same basis as a Maltese employee. Your
                gross salary is subject to Malta&apos;s progressive income tax
                brackets (FSS), employee Social Security Contributions (10% of
                weekly wage, capped weekly), and the quarterly tax-free Cost of
                Living Adjustment (COLA). Highly qualified individuals on KEI
                may also benefit from the 15% flat-rate scheme — see the related
                guide below.
              </p>

              <p>
                Use these Malta Calculator tools to translate your job offer
                into a precise take-home figure before signing the contract:
              </p>
              <ul>
                <li>
                  <Link href="/salary">Malta Salary Calculator</Link> —
                  gross-to-net for 2026 with full breakdown.
                </li>
                <li>
                  <Link href="/blog/malta-tax-rates-2026-complete-guide">
                    Malta Tax Rates 2026
                  </Link>{" "}
                  — every income tax bracket, side by side.
                </li>
                <li>
                  <Link href="/blog/malta-ssc-contributions-2026-explained">
                    Malta SSC Contributions 2026
                  </Link>{" "}
                  — categories, caps and weekly maxima.
                </li>
                <li>
                  <Link href="/blog/malta-expat-tax-hqp-scheme-guide">
                    Malta HQP / 15% Expat Tax Scheme
                  </Link>{" "}
                  — when KEI overlaps with the highly qualified persons scheme.
                </li>
              </ul>

              {/* CTA Box */}
              <div className="mt-12 p-8 bg-gradient-to-br from-primary/10 via-background to-secondary/5 border border-primary/20 rounded-3xl not-prose">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">
                    Translate the Offer into Take-Home Pay
                  </h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Plug the gross salary from your Malta employment contract into
                  our free Salary Calculator and get an exact monthly net figure
                  with FSS, SSC and COLA accounted for — useful for negotiating
                  before you sign.
                </p>
                <Link
                  href="/salary"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                >
                  Open Malta Salary Calculator
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {/* Section 12 — Employer Compliance Rules at a Glance */}
            <section id="employer-rules" className="mt-12">
              <h2>13. Employer Compliance Rules at a Glance</h2>
              <p>
                Most of this guide is written for the foreign worker. But the
                Single Permit application is filed by the employer, and the 2025
                Malta Labour Migration Policy introduced a long list of
                employer-side rules that decide whether your application is even
                processed. This section is a compact reference. The full
                breakdown — termination rate maths, the First Employment Rule,
                Jobsplus form deadlines, the disability quota and the Exemplary
                Employer register — lives in our dedicated{" "}
                <Link href="/blog/malta-single-permit-employer-compliance-2026">
                  Malta Single Permit — Employer Compliance Guide 2026
                </Link>
                .
              </p>

              <p>
                The single biggest variable is <strong>company size</strong>.
                Almost every new rule has different thresholds for Micro (1–9),
                Small (10–49), Medium (50–249) and Large (250+) employers. Use
                the checker below to see exactly what applies to you.
              </p>

              <CompanySizeRulesChecker />

              <h3>The rules every employer must know</h3>
              <ol>
                <li>
                  <strong>Termination rate threshold (1 Aug 2025).</strong>{" "}
                  Jobsplus rejects Single Permit applications if your
                  termination rate exceeds the limit for your size band: 50% for
                  Small, 45% for Medium, 40% for Large. The limits start 15
                  percentage points higher and tighten by 1 July 2026. Companies
                  under 10 employees, KEI applications, sports, students and
                  healthcare are <strong>exempt</strong>.
                </li>
                <li>
                  <strong>Workforce application limits (1 Aug 2025).</strong>{" "}
                  How many new foreign worker applications you can submit, as a
                  percentage of your headcount 12 months earlier: Micro 200%,
                  Small 100%, Medium 50%, Large 25%. Same exempt categories.
                </li>
                <li>
                  <strong>First Employment Rule (Jan 2026).</strong> Before
                  hiring foreign workers you must already employ a minimum
                  number of Maltese, EU/EEA, Swiss or long-term-resident staff:{" "}
                  <strong>Micro 2 / Small 4 / Medium 20 / Large 40</strong>.
                  Companies over 80% foreign workforce face enhanced labour
                  market needs testing.
                </li>
                <li>
                  <strong>Disability quota (in force).</strong> The Persons with
                  Disability (Employment) Act requires at least{" "}
                  <strong>2%</strong> of your workforce to be persons with
                  disabilities, or you must pay an annual contribution.
                  Non-compliance suspends pending Single Permit applications.
                </li>
                <li>
                  <strong>Job advert rules (1 Aug 2025).</strong> Standard
                  Single Permits need a 3-week advert on <strong>both</strong>{" "}
                  Jobsplus and EURES, within 2 months of submission. KEI, SEI,
                  EU Blue Card and Skilled Occupation List applications need
                  only one local-media advert for 2 weeks.
                </li>
                <li>
                  <strong>Redundancy block (1 Aug 2025).</strong> If you made
                  someone redundant in the previous 12 months for the same role
                  you are now trying to fill with a foreign national, the
                  application is rejected. No exceptions.
                </li>
                <li>
                  <strong>4-day Jobsplus form rule (1 Aug 2025).</strong>{" "}
                  Engagement and termination forms must be filed within 4
                  working days. Miss the deadline and all your pending Single
                  Permit applications (except renewals) are suspended. Repeat
                  offenders can be disqualified from submitting new
                  applications.
                </li>
                <li>
                  <strong>No cash salaries (1 Aug 2025).</strong> Foreign
                  workers whose employment is registered on or after 1 August
                  2025 must be paid through a licensed financial institution.
                  Cash payments are not permitted.
                </li>
                <li>
                  <strong>
                    No financial compensation from employees (1 Aug 2025).
                  </strong>{" "}
                  Employers cannot ask foreign workers for any payment in return
                  for hiring, recruitment or termination. This addresses
                  reported exploitation in some sectors.
                </li>
                <li>
                  <strong>Tourist-visa loophole closed (1 Oct 2025).</strong>{" "}
                  Foreign nationals already in Malta on a visa that does not
                  permit employment cannot apply for a Single Permit from within
                  Malta. They must leave Malta and apply from abroad.
                </li>
                <li>
                  <strong>Interim 60-day permit (1 Oct 2025).</strong> Nationals
                  of visa-waiver countries who apply for a Single Permit within
                  60 days of entering the Schengen Area receive an interim
                  permit covering them while the application is processed. From
                  day 61 onwards they must wait outside Schengen.
                </li>
                <li>
                  <strong>Fixed renewal periods (1 Oct 2025).</strong> Up to 2
                  years for standard renewals; up to 3 years for KEI, SEI and EU
                  Blue Card. Identità&apos;s discretion to vary these periods
                  has been removed. Low-skilled workers enrolled in Identità
                  training programmes get 2-year renewals.
                </li>
                <li>
                  <strong>Newly registered businesses (Jan 2026).</strong> New
                  companies lose their automatic exemption from the Labour
                  Market Needs Test. New businesses without any Maltese, EU
                  national or long-term resident among their owners can no
                  longer apply for foreign workers — except for FDI cases backed
                  by Malta Enterprise.
                </li>
                <li>
                  <strong>Desk investigations (Jan 2026).</strong> Employers who
                  breach employment law face up to 12 months&apos;
                  disqualification from submitting new Single Permit
                  applications. Outstanding tax or social security debt triggers
                  disqualification until cleared.
                </li>
                <li>
                  <strong>
                    Register of Exemplary Employers (Oct 2026 onwards).
                  </strong>{" "}
                  Compliant employers who invest in official training will be
                  eligible for a fast-track register, with streamlined labour
                  market testing and 2–4 year renewal periods for their staff.
                </li>
              </ol>

              <div className="not-prose my-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <p className="mb-2 text-sm font-semibold text-primary">
                  Need the deep dive?
                </p>
                <p className="mb-3 text-sm text-muted-foreground">
                  The points above are the headline rules. For the maths behind
                  the termination rate, the exact form deadlines, worked Micro /
                  Small / Medium / Large examples and the full FAQ for HR teams,
                  read the dedicated guide.
                </p>
                <Link
                  href="/blog/malta-single-permit-employer-compliance-2026"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  Open the Employer Compliance Guide
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {/* Section 13 — FAQ */}
            <section id="faq" className="mt-12">
              <h2>14. Frequently Asked Questions</h2>

              <h3>How much does the Malta Single Permit cost in 2026?</h3>
              <p>
                The Identità government fee is <strong>€600</strong> for a
                first-time Single Permit and <strong>€150 per year</strong> for
                renewals. A change of employer is also €600, while a transfer of
                business or merger is €300, and live-in carers pay €27.50. From
                January 2026, first-time third-country nationals must
                additionally pay <strong>€250</strong> for the Pre-Departure
                Course on the Skills Pass portal.
              </p>

              <h3>
                What is the salary threshold for the Key Employee Initiative
                (KEI)?
              </h3>
              <p>
                KEI requires a minimum annual gross salary of{" "}
                <strong>€45,000</strong> plus certified qualifications, warrants
                or proof of work experience for a managerial or highly technical
                role. KEI permits are valid for one year initially and renewable
                for up to three years on the strength of a valid contract and a
                stamped annual tax declaration.
              </p>

              <h3>What is the difference between KEI and SEI in Malta?</h3>
              <p>
                KEI is the fast-track route for managerial or highly technical
                roles paying at least €45,000 per year. SEI is an alternative
                fast-track route for highly skilled specialists paying at least
                €30,000 per year, who hold either an MQF Level 6 qualification
                or a lower qualification plus three years of certified relevant
                experience. SEI applications are processed within{" "}
                <strong>15 working days</strong> of a complete submission.
              </p>

              <h3>
                Is the Pre-Departure Course mandatory for the Malta Single
                Permit?
              </h3>
              <p>
                Yes. From January 2026 every first-time third-country national
                must complete a mandatory Pre-Departure Course on
                skillspass.org.mt — two online modules,{" "}
                <em>Living and Working in Malta</em> and{" "}
                <em>Rights and Obligations in the Workplace</em>, plus a
                20-minute live interview. The fee is €250 and the process must
                be finished within 42 days. Identità began verifying
                certificates on 1 March 2026.
              </p>

              <h3>How long does the Malta Single Permit take to process?</h3>
              <p>
                S.L. 217.17 gives Identità up to four months. The average
                processing time is closer to two months once the file is
                complete. SEI applications are processed within{" "}
                <strong>15 working days</strong> of a complete submission.
              </p>

              <h3>
                Can I change employer on a Malta Single Permit after losing my
                job?
              </h3>
              <p>
                Yes, in most cases. The safest route is for the new employer to
                file a Change of Employer application before your current
                contract ends, which keeps your residency valid throughout
                processing. If you have already been terminated, S.L. 217.17
                gives you an automatic <strong>30-day grace period</strong> to
                stay in Malta and find a new job, extendable by another{" "}
                <strong>30 days</strong> with proof of financial
                self-sufficiency — up to <strong>60 days in total</strong>.
                While the grace period is running, the new employer can still
                file the Change of Employer application. After day 60 the
                standard first-time eligibility criteria apply, which usually
                means restarting from abroad.
              </p>

              <h3>Who can apply for the Malta Single Permit and who cannot?</h3>
              <p>
                Third-country nationals (non-EU/EEA/Swiss) with a job offer from
                a Maltese-registered company that is also registered with
                Jobsplus are eligible. The employer files the application; only
                live-in carers can submit directly. Beneficiaries of refugee,
                subsidiary or temporary humanitarian protection — including
                those awaiting a decision on their status — are not eligible.
              </p>

              <h3>What documents are required for a Single Permit?</h3>
              <p>
                Identità publishes a checklist that includes the
                applicant&apos;s passport (valid for at least 8 months) plus a
                full PDF copy, a signed Europass CV, a health insurance policy
                with at least €100,000 of coverage, a signed employment
                contract, a Position Description form, a Jobsplus Declaration of
                Suitability, proof of advertisement (Jobsplus + EURES for 3
                weeks, or 2 weeks of local media for KEI/SEI), qualification
                certificates with MQRIC recognition, an accommodation agreement
                plus Lease Agreement Attestation, and a signed Privacy Policy.
                Additional documents may be requested depending on the role.
              </p>
            </section>

            {/* Related Guides */}
            <section className="mt-12 not-prose">
              <h2 className="text-2xl font-bold mb-6">Related Guides</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    href: "/blog/malta-work-permit-employment-guide-2026",
                    title: "Malta Work Permit & Employment Guide 2026",
                    desc: "EU vs non-EU employment routes, Jobsplus rules and worker rights.",
                  },
                  {
                    href: "/blog/malta-expat-tax-hqp-scheme-guide",
                    title: "Malta Highly Qualified Persons (HQP) Scheme",
                    desc: "How the 15% flat-rate scheme overlaps with KEI for senior hires.",
                  },
                  {
                    href: "/blog/malta-family-reunification-guide-2026",
                    title: "Malta Family Reunification Guide 2026",
                    desc: "Bringing your spouse and dependants to Malta as a permit holder.",
                  },
                  {
                    href: "/blog/how-to-calculate-net-salary-malta-2026",
                    title: "How to Calculate Net Salary in Malta 2026",
                    desc: "Step-by-step gross-to-net guide with worked examples.",
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

            {/* Sources anchor target */}
            <div id="sources" />

            {/* Disclaimer */}
            <div className="not-prose mt-12 rounded-2xl border border-border/50 bg-muted/20 p-5 text-sm text-muted-foreground">
              <strong className="text-foreground">Disclaimer:</strong> This
              guide is for general information only and is not legal,
              immigration or tax advice. The Malta Single Permit framework is
              updated regularly; for binding guidance contact the Identità
              Expatriates Unit on <a href="tel:+35625904800">+356 2590 4800</a>{" "}
              or{" "}
              <a href="mailto:singlepermit.identita@gov.mt">
                singlepermit.identita@gov.mt
              </a>
              , or instruct a licensed Maltese immigration consultant.
            </div>

            <BlogArticleAuthor
              datePublished="2026-04-07"
              sources={ARTICLE_SOURCES}
            />

            <BlogArticleFooter
              slug="malta-single-permit-guide-2026"
              title="Malta Single Permit Guide 2026"
              ctaDescription="Plug your Malta job offer into the free Salary Calculator to get a precise gross-to-net figure for 2026 — fully accounting for FSS, SSC and COLA."
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false;
export const dynamic = "force-static";

function KeiSeiFact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="flex-1">
        <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {label}
        </dt>
        <dd className="text-sm font-semibold text-foreground">{value}</dd>
      </div>
    </div>
  );
}
