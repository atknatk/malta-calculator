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
  Users,
  FileText,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Globe,
  Sparkles,
  Hourglass,
} from "lucide-react";
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";
import { BlogArticleAuthor } from "@/components/blog/blog-article-author";

export const metadata: Metadata = {
  ...defaultMetadata,
  title:
    "Malta Family Reunification 2026: Complete Salary Guide | Malta Calculator",
  description:
    "Malta family reunification 2026: new NSO wage thresholds, waiting periods (12 months, 2 years, KEI/SEI immediate), salary tables, documents, health screening.",
  keywords: [
    "Malta family reunification",
    "Malta family visa",
    "Malta family member policy",
    "Malta sponsor family",
    "Malta immigration salary",
    "Malta family permit salary",
    "Malta residence permit family",
    "Identità family reunification",
    "Malta TCN family visa",
    "Malta non-EU family",
    "Malta KEI family sponsorship",
    "Malta Specialist Employee Initiative family",
    "Malta dependent parent visa",
    "Malta dependent adult family member",
    "Malta median wage 2025",
    "Malta family reunification waiting period",
    "Malta bring children KEI SEI",
  ],
  alternates: pageAlternates("/blog/malta-family-reunification-guide-2026"),
  openGraph: {
    ...ogMetadata,
    title: "Malta Family Reunification 2026: Complete Salary Guide",
    url: `${SITE_URL}/blog/malta-family-reunification-guide-2026`,
    type: "article",
    images: [
      getBlogOgImage("Malta Family Reunification 2026: Complete Salary Guide"),
    ],
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Family Reunification 2026: Complete Salary Guide",
  },
};

const LAST_UPDATED = "2026-10-20";

const ARTICLE_SOURCES = [
  {
    name: "Identità Malta - Family Reunification (Forms G.01 / G.02)",
    url: "https://identita.gov.mt/family-reunification/",
  },
  {
    name: "Identità Malta - Family Member Permit",
    url: "https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/non-employment-permits/family-member/",
  },
  {
    name: "Identità Malta - Family Members Policy",
    url: "https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/non-employment-permits/family-members-policy/",
  },
  {
    name: "Subsidiary Legislation 217.06 - Family Reunification Regulations",
    url: "https://legislation.mt/eli/sl/217.6/eng/pdf",
  },
  {
    name: "Identità - FAQs SIGMA 2025/26: Residence Permits & Family Reunification",
    url: "https://identita.gov.mt/wp-content/uploads/2025/09/FAQs-Residence-Permits-Malta-002.pdf",
  },
  {
    name: "Identità - FAQs SIGMA 2025/26: Highly Qualified Permits (KEI, SEI, Blue Card)",
    url: "https://identita.gov.mt/wp-content/uploads/2025/09/FAQs-Highly-Qualified-1.pdf",
  },
  {
    name: "NSO Malta - Labour Market (mean and median annual basic salary)",
    url: "https://nso.gov.mt/labour_market/",
  },
  {
    name: "Health Promotion & Disease Prevention - Family Reunification Health Screening",
    url: "https://hpdp.gov.mt/idcu/health_screening/family_reunification",
  },
];

const FAQS = [
  {
    question: "How long do I have to wait before bringing my family to Malta?",
    answer:
      "Under the Family Member Policy you must wait 12 calendar months from the date your first residence permit was issued. Under S.L. 217.06 Identità requires 2 years of lawful residence. KEI and SEI holders with an Approval in Principle can apply immediately if they earn at least €50,000 gross (+€6,000 per extra dependant), and EU Blue Card holders have no waiting period.",
  },
  {
    question:
      "Can KEI or SEI holders bring their children to Malta immediately?",
    answer:
      "Yes, if they hold an Approval in Principle, earn at least €50,000 gross for themselves and one dependant plus €6,000 for each additional dependant, have €100,000 health cover per dependant and have applied for a private school place for school-age children. The SEI permit itself needs only €30,000, so SEI holders below the €50,000 fast-track must wait 12 months.",
  },
  {
    question:
      "What is the minimum salary for family reunification in Malta in 2026?",
    answer:
      "Under S.L. 217.06 you need the NSO average gross basic wage (€25,730 for 2025) plus 20% per family member — €30,876 gross for one family member. Under the Family Member Policy your net income must reach €22,728 for one family member, based on Identità's €18,940 median wage figure.",
  },
  {
    question: "Will the Family Member Policy threshold increase?",
    answer:
      "Probably. NSO has published a 2025 median annual basic salary of €22,266, while Identità still quotes €18,940. If Identità adopts the new median, the net requirement for one family member would rise from €22,728 to about €26,719.",
  },
  {
    question: "Do family members need health screening in Malta?",
    answer:
      "Yes. All third-country nationals entering under family reunification must complete health screening once. Since 29 June 2026 only the new screening forms are accepted. Children from high TB-risk countries take a Mantoux test and, from age 11, a chest X-ray.",
  },
];

export default function FamilyReunificationGuidePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Family Reunification 2026: Complete Salary Guide"
        description="Complete guide to family reunification salary requirements in Malta."
        slug="malta-family-reunification-guide-2026"
        datePublished="2026-02-02"
        dateModified={LAST_UPDATED}
        sources={ARTICLE_SOURCES}
      />
      <CustomFAQJsonLd questions={FAQS} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Family Reunification Guide",
            url: `${SITE_URL}/blog/malta-family-reunification-guide-2026`,
          },
        ]}
      />
      <main role="main" aria-label="Malta Family Reunification Guide">
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
                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold rounded-full">
                  Immigration
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Updated <time dateTime={LAST_UPDATED}>October 2026</time>
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  12 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Family Reunification 2026: Complete Salary Requirements
                Guide
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Planning to bring your family to Malta? This guide explains the
                two main schemes for family reunification, how long you have to
                wait before applying, the salary you need with the latest NSO
                wage data, and the fast-track for KEI, SEI and Blue Card
                holders.
              </p>
            </header>

            <nav className="p-6 bg-muted/30 rounded-2xl mb-12 not-prose">
              <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#whats-new" className="text-primary hover:underline">
                    What&apos;s New — October 2026 Update
                  </a>
                </li>
                <li>
                  <a href="#overview" className="text-primary hover:underline">
                    1. Overview
                  </a>
                </li>
                <li>
                  <a
                    href="#two-schemes"
                    className="text-primary hover:underline"
                  >
                    2. Two Schemes Explained
                  </a>
                </li>
                <li>
                  <a
                    href="#waiting-periods"
                    className="text-primary hover:underline"
                  >
                    3. Waiting Periods: When Can You Apply?
                  </a>
                </li>
                <li>
                  <a
                    href="#salary-requirements"
                    className="text-primary hover:underline"
                  >
                    4. Salary Requirements & Eligible Income
                  </a>
                </li>
                <li>
                  <a href="#examples" className="text-primary hover:underline">
                    5. Calculation Examples
                  </a>
                </li>
                <li>
                  <a href="#documents" className="text-primary hover:underline">
                    6. Required Documents
                  </a>
                </li>
                <li>
                  <a
                    href="#application"
                    className="text-primary hover:underline"
                  >
                    7. Application Process
                  </a>
                </li>
                <li>
                  <a
                    href="#exclusions"
                    className="text-primary hover:underline"
                  >
                    8. Who Is Excluded
                  </a>
                </li>
                <li>
                  <a href="#faqs" className="text-primary hover:underline">
                    9. FAQs
                  </a>
                </li>
              </ul>
            </nav>

            <section
              id="whats-new"
              className="not-prose p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-primary/20 mb-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">
                  What&apos;s New — October 2026 Update
                </h2>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <strong className="text-foreground">
                    Higher S.L. 217.06 threshold.
                  </strong>{" "}
                  NSO&apos;s Labour Force Survey puts the 2025 average annual
                  basic salary at <strong>€25,730</strong> (up from €23,596 in
                  2024). S.L. 217.06 defines the &quot;average wage&quot; as
                  exactly this figure, so sponsoring one family member now needs{" "}
                  <strong>€30,876 gross</strong>.
                </li>
                <li>
                  <strong className="text-foreground">
                    Family Member Policy figure may rise.
                  </strong>{" "}
                  Identità still quotes a median of <strong>€18,940</strong>,
                  but NSO&apos;s 2025 median annual basic salary is{" "}
                  <strong>€22,266</strong>. If Identità adopts it, the net
                  requirement for one family member goes from €22,728 to about{" "}
                  <strong>€26,719</strong>.
                </li>
                <li>
                  <strong className="text-foreground">
                    KEI and SEI holders can bring spouse and children
                    immediately
                  </strong>{" "}
                  with an Approval in Principle and €50,000 gross (+€6,000 per
                  extra dependant). Identità confirmed this in its September
                  2025 SIGMA FAQs. Since August 2025 the KEI permit needs
                  €45,000 and the SEI permit €30,000, so many SEI holders earn
                  too little for the family fast-track.
                </li>
                <li>
                  <strong className="text-foreground">
                    Two-year rule for S.L. 217.06.
                  </strong>{" "}
                  Identità applies the full 2 years of lawful residence allowed
                  by Regulation 13 before a statutory family reunification
                  application. The Family Member Policy needs 12 months.
                </li>
                <li>
                  <strong className="text-foreground">
                    New health screening forms.
                  </strong>{" "}
                  Since <strong>29 June 2026</strong> the Health Screening Unit
                  only accepts the new family reunification forms. Submissions
                  on old forms are not processed.
                </li>
              </ul>
              <p className="text-xs text-muted-foreground mt-4">
                No new legal notice amending S.L. 217.06 or the Family Members
                Policy (v5.3, last updated April 2025) has been published as of
                October 2026. The calculator now includes a{" "}
                <Link
                  href="/calculators/family-reunification"
                  className="text-primary hover:underline"
                >
                  waiting period and salary check
                </Link>{" "}
                for Single Permit, KEI, SEI and Blue Card holders.
              </p>
            </section>

            <section id="overview">
              <h2>1. Overview</h2>
              <p>
                Malta offers pathways for <strong>non-EU nationals</strong>{" "}
                (Third Country Nationals - TCN) to bring their family members to
                live with them. The key requirement is demonstrating sufficient
                income to support your family without relying on Malta&apos;s
                social assistance system.
              </p>
              <p>
                The income requirements are based on the{" "}
                <strong>national average/median wage</strong>, with an
                additional percentage for each family member you wish to
                sponsor.
              </p>

              <h3 className="not-prose mt-8 text-lg font-semibold">
                Who Can You Sponsor?
              </h3>
              <p className="not-prose mt-2 text-sm text-muted-foreground">
                The two schemes recognise a different scope of family members.
                Choose the route that matches your situation.
              </p>

              <div className="grid md:grid-cols-2 gap-4 not-prose my-6">
                <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                  <FileText className="h-8 w-8 text-blue-600 mb-3" />
                  <h4 className="font-semibold text-base mb-2">
                    Under S.L. 217.06 (Family Reunification)
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Spouse aged 21 or over (monogamous marriage only)</li>
                    <li>• Unmarried minor children of sponsor and spouse</li>
                    <li>
                      • Unmarried minor children adopted under Maltese law
                    </li>
                    <li>• Children under sole custody of sponsor or spouse</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3 italic">
                    Per S.L. 217.06 Reg. 4. Adult children and parents are{" "}
                    <strong>not eligible</strong> under this regulation (limited
                    exception for unaccompanied minor refugees, Reg. 24).
                  </p>
                </div>
                <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                  <Users className="h-8 w-8 text-purple-600 mb-3" />
                  <h4 className="font-semibold text-base mb-2">
                    Under Family Member Policy (Identità)
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Spouse aged 21 or over (monogamous marriage only)</li>
                    <li>
                      • Unmarried children under 18 (including adopted under
                      Maltese law)
                    </li>
                    <li>
                      •{" "}
                      <strong>Dependent unmarried adult family members</strong>,
                      with documented evidence of financial or physical
                      dependency on the sponsor
                    </li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3 italic">
                    This wider scope is the main practical difference from S.L.
                    217.06 — adult dependants (e.g. an adult child or, in
                    exceptional cases, an elderly parent) may be considered.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-violet-500/10 border border-violet-500/20 rounded-2xl not-prose my-6">
                <Globe className="h-8 w-8 text-violet-600 mb-3" />
                <h4 className="font-semibold text-base mb-2">
                  Who Is This Guide For?
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Non-EU workers in Malta (Third Country Nationals)</li>
                  <li>• Single Permit holders with 12+ months of residence</li>
                  <li>• KEI, SEI and EU Blue Card holders (fast-track)</li>
                  <li>• Long-term residents</li>
                  <li>• Sponsors with reasonable prospects of permanence</li>
                </ul>
              </div>

              <div className="p-6 bg-muted/30 border border-border rounded-2xl not-prose my-6">
                <h3 className="font-semibold text-lg mb-3">
                  Sponsor Pre-Conditions
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>
                    • Hold a Malta residence permit valid for{" "}
                    <strong>at least 1 year</strong> (S.L. 217.06 Reg. 3)
                  </li>
                  <li>
                    • Have <strong>reasonable prospects</strong> of obtaining
                    permanent residence
                  </li>
                  <li>
                    • Under <strong>S.L. 217.06</strong>: have lived lawfully in
                    Malta for <strong>2 years</strong> before applying (Reg. 13;
                    Identità SIGMA FAQ 2025/26)
                  </li>
                  <li>
                    • Under <strong>Family Members Policy</strong>: wait{" "}
                    <strong>12 calendar months</strong> from the date your
                    initial permit was first issued before applying
                  </li>
                  <li>
                    •{" "}
                    <strong>
                      KEI / Specialist Employee Initiative exception
                    </strong>
                    : sponsors holding an approval-in-principle letter may apply
                    earlier if their gross annual income meets the enhanced
                    threshold —{" "}
                    <strong>€50,000 for the sponsor + one dependent</strong>{" "}
                    plus an additional{" "}
                    <strong>€6,000 for each further dependent</strong>
                  </li>
                  <li>
                    • Sponsors with pending refugee, temporary protection or
                    subsidiary protection status are{" "}
                    <strong>not eligible</strong> under S.L. 217.06
                  </li>
                </ul>
              </div>
            </section>

            <section id="two-schemes" className="mt-12">
              <h2>2. Two Schemes Explained</h2>
              <p>
                Malta has <strong>two distinct schemes</strong> for family
                reunification, each with different salary calculation methods:
              </p>

              <div className="space-y-6 not-prose my-8">
                <div className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg">
                      Family Reunification (S.L. 217.6)
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    The primary legal framework (S.L. 217.06) implementing EU
                    Directive 2003/86/EC on family reunification.
                  </p>
                  <div className="p-4 bg-background/50 rounded-xl space-y-2">
                    <p className="font-medium">💰 Salary Requirement:</p>
                    <p className="text-lg font-bold text-blue-600">
                      Average Wage (Gross) + 20% per family member
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Average wage = NSO Labour Force Survey average annual
                      gross basic salary: <strong>€25,730 (2025)</strong>. Only
                      basic salary from your main job counts — no overtime,
                      bonuses or allowances.
                    </p>
                    <p className="text-xs text-muted-foreground pt-2 border-t border-border/50">
                      ⏳ <strong>2 years</strong> lawful residence · ⏱ Decision:
                      up to <strong>9 months</strong> · 📋 Forms{" "}
                      <strong>G.01</strong> (new) / <strong>G.02</strong>{" "}
                      (renewal) · 💶 Fee: <strong>€50</strong>
                    </p>
                  </div>
                  <a
                    href="https://legislation.mt/eli/sl/217.6/eng/pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-4"
                  >
                    View Official Legislation →
                  </a>
                </div>

                <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Briefcase className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-lg">
                      Family Member Policy
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    An ex-gratia policy managed by Identità for sponsors and
                    family members who do not (yet) qualify under S.L. 217.06 —
                    notably <strong>dependent adult relatives</strong> who fall
                    outside the regulation&apos;s scope.
                  </p>
                  <div className="p-4 bg-background/50 rounded-xl space-y-2">
                    <p className="font-medium">💰 Salary Requirement:</p>
                    <p className="text-lg font-bold text-purple-600">
                      €18,940 net + 20% of the median wage per family member
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Median wage reference:{" "}
                      <strong>
                        €18,940 (Identità, NSO release of June 2024)
                      </strong>
                      . NSO&apos;s newer 2025 median is €22,266 — Identità has
                      not adopted it yet. &quot;Net&quot; = gross income minus
                      income tax and social security contributions, declared
                      with the Commissioner of Revenue.
                    </p>
                    <p className="text-xs text-muted-foreground pt-2 border-t border-border/50">
                      ⏱ Decision: within <strong>60 days</strong> · 🏥 Health
                      insurance: min <strong>€100,000</strong> European coverage
                      · ⏳ 12-month waiting period from initial permit
                      (KEI/Specialist exception applies)
                    </p>
                  </div>
                  <a
                    href="https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/non-employment-permits/family-members-policy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-purple-600 hover:underline mt-4"
                  >
                    View Official Policy →
                  </a>
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl not-prose">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground mb-1">
                      Important Note
                    </p>
                    <p className="text-sm text-muted-foreground">
                      The average/median wage figures are updated periodically
                      by the National Statistics Office (NSO). Always check with
                      Identità Malta for the latest requirements.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="waiting-periods" className="mt-12">
              <h2>3. Waiting Periods: When Can You Apply?</h2>
              <p>
                How soon you can bring your spouse and children depends on the
                permit you hold and the route you use. Months count from the
                date your <strong>first residence permit was issued</strong>,
                and applications filed too early are inadmissible.
              </p>

              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Sponsor
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Waiting period
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Income test
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        Single Permit — S.L. 217.06
                      </td>
                      <td className="border border-border p-3">2 years</td>
                      <td className="border border-border p-3">
                        €25,730 gross + 20% per member
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-medium">
                        Single Permit — Family Member Policy
                      </td>
                      <td className="border border-border p-3">12 months</td>
                      <td className="border border-border p-3">
                        €18,940 net + 20% per member
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        KEI holder (Approval in Principle)
                      </td>
                      <td className="border border-border p-3">
                        None — apply immediately
                      </td>
                      <td className="border border-border p-3">
                        €50,000 gross + €6,000 per extra dependant
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-medium">
                        SEI holder (Approval in Principle)
                      </td>
                      <td className="border border-border p-3">
                        None if €50,000+; otherwise 12 months
                      </td>
                      <td className="border border-border p-3">
                        €50,000 gross + €6,000 per extra dependant
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        EU Blue Card / ICT holder
                      </td>
                      <td className="border border-border p-3">
                        None — once Approval in Principle is issued
                      </td>
                      <td className="border border-border p-3">
                        Assessed under the Blue Card / ICT rules
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl not-prose my-6">
                <div className="flex gap-3">
                  <Hourglass className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p className="font-medium text-foreground">
                      KEI / SEI fast-track: extra conditions for children
                    </p>
                    <p>
                      • Health insurance of at least <strong>€100,000</strong>{" "}
                      per dependant, covering inpatient and outpatient care in
                      Malta and Europe for the whole permit period
                    </p>
                    <p>
                      • For children of compulsory school age, proof of an
                      application to a <strong>private school</strong> in Malta
                    </p>
                    <p>
                      • All other Family Member Policy conditions (documents,
                      accommodation, vetting) still apply
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Blue Card and ICT family members may also work straight away.
                Under S.L. 217.06, family members face a labour market test for
                their first 12 months. Family Member Policy dependants need
                their own Single Permit to work.
              </p>
            </section>

            <section id="salary-requirements" className="mt-12">
              <h2>4. Salary Requirements</h2>
              <p className="text-sm text-muted-foreground">
                Figures below use the{" "}
                <strong>2025 average gross basic wage</strong> from NSO&apos;s
                Labour Force Survey (€25,730) for S.L. 217.06, and
                Identità&apos;s <strong>median wage figure of €18,940</strong>{" "}
                for the Family Member Policy. The last column shows the Family
                Member Policy requirement if Identità adopts NSO&apos;s 2025
                median (€22,266).
              </p>

              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Family Members
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Family Reunification (Gross)
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Family Member Policy (Net)
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        If NSO 2025 Median Adopted (Net)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        1 member
                      </td>
                      <td className="border border-border p-3">
                        €30,876/year (€2,573/month)
                      </td>
                      <td className="border border-border p-3">
                        €22,728/year (€1,894/month)
                      </td>
                      <td className="border border-border p-3">
                        €26,719/year (€2,227/month)
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-medium">
                        2 members
                      </td>
                      <td className="border border-border p-3">
                        €36,022/year (€3,002/month)
                      </td>
                      <td className="border border-border p-3">
                        €26,516/year (€2,210/month)
                      </td>
                      <td className="border border-border p-3">
                        €31,172/year (€2,598/month)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        3 members
                      </td>
                      <td className="border border-border p-3">
                        €41,168/year (€3,431/month)
                      </td>
                      <td className="border border-border p-3">
                        €30,304/year (€2,525/month)
                      </td>
                      <td className="border border-border p-3">
                        €35,626/year (€2,969/month)
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-medium">
                        4 members
                      </td>
                      <td className="border border-border p-3">
                        €46,314/year (€3,860/month)
                      </td>
                      <td className="border border-border p-3">
                        €34,092/year (€2,841/month)
                      </td>
                      <td className="border border-border p-3">
                        €40,079/year (€3,340/month)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-muted-foreground">
                * Family Member Policy amounts are <strong>net</strong> income.
                As a guide, €22,728 net needs roughly €27,970 gross on married
                tax rates or €29,650 on single rates (2026 tax and SSC, no
                bonuses). For a spouse + 2 children (€30,304 net) that is about
                €38,220 gross (married). Verify figures with Identità before
                applying.
              </p>

              <div
                id="eligible-income"
                className="mt-12 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl not-prose"
              >
                <h3 className="font-semibold text-lg mb-3">
                  Eligible Income Sources (Family Member Policy)
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Identità counts the following toward the €18,940 + 20%
                  threshold, provided the income is{" "}
                  <strong>declared with the Commissioner of Revenue</strong>.
                  Income tax and social security contributions are deducted from
                  gross income to arrive at the &quot;net&quot; figure used in
                  the calculation.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Employment income (gross salary minus tax and SSC)</li>
                  <li>
                    • Social benefits — old-age pension, sickness benefit,
                    disability benefit, family allowances
                  </li>
                  <li>• Property rental income</li>
                  <li>• Unemployment benefit</li>
                  <li>• Housing benefit</li>
                  <li>• Regular cash transfers</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-4 italic">
                  Source: Identità Malta — Family Members Policy.
                </p>
              </div>
            </section>

            <section id="examples" className="mt-12">
              <h2>5. Calculation Examples</h2>

              <div className="space-y-6 not-prose my-8">
                <div className="p-6 bg-muted/30 rounded-2xl">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Example 1: Sponsoring Spouse Only
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Family Reunification:</strong>
                    </p>
                    <p className="pl-4">
                      €25,730 + (€25,730 × 20%) ={" "}
                      <strong>€30,876 gross/year</strong>
                    </p>
                    <p className="mt-4">
                      <strong>Family Member Policy:</strong>
                    </p>
                    <p className="pl-4">
                      €18,940 + (€18,940 × 20%) ={" "}
                      <strong>€22,728 net/year</strong>
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-muted/30 rounded-2xl">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Example 2: Sponsoring Spouse + 2 Children
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Family Reunification:</strong>
                    </p>
                    <p className="pl-4">
                      €25,730 + (€25,730 × 20% × 3) ={" "}
                      <strong>€41,168 gross/year</strong>
                    </p>
                    <p className="mt-4">
                      <strong>Family Member Policy:</strong>
                    </p>
                    <p className="pl-4">
                      €18,940 + (€18,940 × 20% × 3) ={" "}
                      <strong>€30,304 net/year</strong>
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-muted/30 rounded-2xl">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    Example 3: SEI Holder on €38,000 with Spouse + 1 Child
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>KEI/SEI fast-track:</strong>
                    </p>
                    <p className="pl-4">
                      €50,000 + €6,000 = <strong>€56,000 gross/year</strong> —
                      not met, so no immediate application.
                    </p>
                    <p className="mt-4">
                      <strong>Family Member Policy (after 12 months):</strong>
                    </p>
                    <p className="pl-4">
                      €18,940 + (€18,940 × 20% × 2) ={" "}
                      <strong>€26,516 net/year</strong>. €38,000 gross is about
                      €30,000 net on married rates, so this sponsor qualifies
                      once 12 months have passed.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="documents" className="mt-12">
              <h2>6. Required Documents</h2>
              <p>When applying for family reunification, you typically need:</p>

              <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <h4 className="font-semibold mb-3">For the Sponsor</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Valid residence permit (min. 1 year)</li>
                    <li>• Employment contract</li>
                    <li>
                      • Last <strong>6 months of payslips</strong> or other
                      proof of qualifying income
                    </li>
                    <li>• Tax returns (FS3)</li>
                    <li>
                      • Written application detailing the relationship and
                      residency arrangements (Family Member Policy)
                    </li>
                    <li>
                      • Proof of accommodation meeting health/safety standards
                    </li>
                    <li>
                      • Sickness insurance covering all risks — minimum{" "}
                      <strong>€100,000 European-territory cover</strong> under
                      the Family Member Policy
                    </li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <h4 className="font-semibold mb-3">For Family Members</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>
                      • Valid passport (min. <strong>6 months validity</strong>{" "}
                      at submission)
                    </li>
                    <li>
                      • Civil status certificates proving the relationship
                      (marriage, birth, adoption)
                    </li>
                    <li>• Marriage certificate (spouse must be 21+)</li>
                    <li>• Birth certificates (for minor children)</li>
                    <li>
                      • Evidence of financial or physical dependency (for adult
                      dependants under the Family Member Policy)
                    </li>
                    <li>• Police clearance certificates</li>
                    <li>
                      • Health screening approval email (new HPDP forms since 29
                      June 2026)
                    </li>
                    <li>• Photos (passport size)</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl not-prose mt-4">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">
                    Where family members must be:
                  </strong>{" "}
                  Under both schemes, family members generally must reside{" "}
                  <strong>outside Malta</strong> when the application is
                  submitted. The Director may accept in-country applications in
                  exceptional cases (e.g. minor children born in Malta).
                </p>
              </div>
            </section>

            <section id="application" className="mt-12">
              <h2>7. Application Process</h2>

              <div className="space-y-4 not-prose my-8">
                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Gather Documents</h4>
                    <p className="text-sm text-muted-foreground">
                      Collect all required documents and have them
                      translated/apostilled if needed. For S.L. 217.06 use Form{" "}
                      <strong>G.01</strong> (new application) or{" "}
                      <strong>G.02</strong> (renewal).
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Submit Application Online</h4>
                    <p className="text-sm text-muted-foreground">
                      Apply through the Expatriates Unit Portal at{" "}
                      <a
                        href="https://expatriates.identita.gov.mt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        expatriates.identita.gov.mt
                      </a>
                      . Family members must usually be outside Malta at the time
                      of submission.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Pay Fees</h4>
                    <p className="text-sm text-muted-foreground">
                      Application fee: <strong>€50</strong> for both new and
                      renewal applications under S.L. 217.06.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold">Wait for Decision</h4>
                    <p className="text-sm text-muted-foreground">
                      <strong>S.L. 217.06:</strong> decision within{" "}
                      <strong>9 months</strong> of application (longer in
                      complex cases). <strong>Family Members Policy:</strong>{" "}
                      decision within <strong>60 days</strong> of complete
                      submission. Once approved, family members can apply for an
                      entry visa.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    5
                  </div>
                  <div>
                    <h4 className="font-semibold">Complete Health Screening</h4>
                    <p className="text-sm text-muted-foreground">
                      Every family member must pass health screening once, and
                      only the{" "}
                      <a
                        href="https://hpdp.gov.mt/idcu/health_screening/family_reunification"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        new HPDP forms
                      </a>{" "}
                      have been accepted since 29 June 2026. Adults get a form
                      completed by a private doctor plus diphtheria, tetanus and
                      polio vaccines (rubella for women). Children from high
                      TB-risk countries take a Mantoux test and, from age 11, a
                      chest X-ray at the Floriana Health Screening Unit. Keep
                      the approval email for Identità and future renewals. See
                      our{" "}
                      <Link
                        href="/blog/malta-work-permit-health-screening-2026"
                        className="text-primary hover:underline"
                      >
                        health screening guide
                      </Link>{" "}
                      for the full process.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="exclusions" className="mt-12">
              <h2>8. Who Is Excluded</h2>
              <p>
                The Family Member Policy does <strong>not</strong> apply to the
                following groups, who fall under separate legal frameworks:
              </p>
              <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <h4 className="font-semibold text-base mb-3">
                    Outside the Policy
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• EU/EEA/Swiss citizens and their family members</li>
                    <li>
                      • Refugees and beneficiaries of subsidiary protection
                      (covered by separate refugee-family rules)
                    </li>
                    <li>
                      • Holders of{" "}
                      <strong>Specific Residence Authorisation</strong> (SRA)
                      status
                    </li>
                    <li>
                      • Holders of other specific residence documents issued
                      under Maltese law (e.g. permanent residence schemes with
                      their own family rules)
                    </li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <h4 className="font-semibold text-base mb-3">
                    Student Dependants: Work Exception
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Family Member Policy dependants cannot normally work, but
                    those studying at the institutions below{" "}
                    <strong>
                      may take up an apprenticeship, placement or internship
                    </strong>{" "}
                    (Cap. 576) without changing permit:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Institute of Tourism Studies (ITS)</li>
                    <li>
                      • Malta College of Arts, Science and Technology (MCAST)
                    </li>
                    <li>• University of Malta</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3 italic">
                    This does not shorten the sponsor&apos;s 12-month waiting
                    period. Always confirm details directly with Identità.
                  </p>
                </div>
              </div>
            </section>

            <section id="faqs" className="mt-12">
              <h2>9. Frequently Asked Questions</h2>

              <div className="space-y-4 not-prose my-8">
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    Which scheme should I apply under?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Family Reunification (S.L. 217.06) is the main legal pathway
                    and applies if you meet all conditions in the regulations.
                    The Family Members Policy is a non-statutory policy used by
                    Identità for sponsors who do not (yet) meet S.L. 217.06
                    requirements but qualify under separate criteria. Consult
                    Identità Malta for guidance on which route fits your
                    situation.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    Can I combine income with my spouse?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Under S.L. 217.06 the sponsor must demonstrate sufficient
                    individual stable resources. At renewal, contributions of
                    family members already in Malta to the household income may
                    be taken into account (Reg. 18).
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    How long does the process take?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Under <strong>S.L. 217.06</strong>, the Director must decide
                    within <strong>9 months</strong> of submission (extendable
                    in complex cases). Under the{" "}
                    <strong>Family Members Policy</strong>, the standard
                    decision time is <strong>60 days</strong> from a complete
                    submission.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    Can my family work in Malta?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Under S.L. 217.06 (Reg. 15), family members get the same
                    access to employment as the sponsor — but for the{" "}
                    <strong>first 12 months</strong> after arrival, their
                    employment is subject to a labour market assessment and an
                    employment licence requirement. Under the Family Members
                    Policy, residence does <strong>not</strong> automatically
                    grant employment rights — a separate Single Permit is
                    required.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    Do I have to wait before applying?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Under S.L. 217.06 you must hold a Malta residence permit
                    valid for at least 1 year, have reasonable prospects of
                    permanent residence and — in Identità&apos;s practice — have
                    lived lawfully in Malta for <strong>2 years</strong>. Under
                    the Family Member Policy you must wait{" "}
                    <strong>12 calendar months</strong> from the date your
                    initial permit was first issued — except for{" "}
                    <strong>
                      Key Employee / Specialist Employee Initiative
                    </strong>{" "}
                    holders with an approval-in-principle letter who meet the
                    enhanced gross-income threshold of{" "}
                    <strong>
                      €50,000 (sponsor + 1 dependent) plus €6,000 per additional
                      dependent
                    </strong>
                    , who may apply immediately. EU Blue Card holders have no
                    waiting period.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    Can I bring my children straight away on a KEI or SEI
                    permit?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, if you hold an Approval in Principle and earn at least{" "}
                    <strong>€50,000 gross</strong> for yourself and one
                    dependant, plus <strong>€6,000</strong> for each additional
                    dependant. Each child needs €100,000 health cover, and
                    school-age children need a private school application. On an
                    SEI salary below the fast-track threshold (the permit itself
                    needs only €30,000), you must wait 12 months and apply under
                    the Family Member Policy instead.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    Can I sponsor my parents or adult children?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    It depends on the scheme.{" "}
                    <strong>Under S.L. 217.06 (Reg. 4)</strong>, only spouses
                    aged 21+ in a monogamous marriage and unmarried minor
                    children qualify — adult children and parents are not
                    eligible (limited exception for unaccompanied minor
                    refugees, Reg. 24).{" "}
                    <strong>Under the Family Member Policy</strong>, Identità
                    explicitly recognises{" "}
                    <strong>dependent unmarried adult family members</strong>{" "}
                    (e.g. an adult child; parents only in exceptional cases),
                    provided you can document financial or physical dependency
                    on the sponsor.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    What income counts toward the €18,940 + 20% threshold?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Identità accepts employment income, social benefits
                    (old-age, sickness, disability, family allowances), property
                    rental income, unemployment and housing benefits, and
                    regular cash transfers — provided the income is{" "}
                    <strong>declared with the Commissioner of Revenue</strong>.
                    The figure used is <strong>net</strong>: gross income minus
                    income tax and social security contributions.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    Why is the median wage figure dated June 2024?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Identità&apos;s Family Member Policy (v5.3, updated April
                    2025) still quotes the €18,940 median from an NSO release of{" "}
                    <strong>June 2024</strong>. NSO has since published a 2025
                    median annual basic salary of <strong>€22,266</strong>.
                    Identità says the figure is reviewed when a new median is
                    published, and the 20% uplift is a share of the median, so
                    an update raises both. For one family member the net
                    requirement would go from €22,728 to about €26,719. Always
                    cross-check the latest number with Identità before
                    submitting.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    Does Family Member Policy approval grant the right to work?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    No. A residence permit issued under the Family Member Policy
                    is not, by itself, a work permit — the family member must
                    apply for a <strong>Single Permit</strong> separately if
                    they wish to take up employment in Malta.
                  </p>
                </div>
              </div>
            </section>

            <div className="mt-16 p-8 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-violet-500/10 rounded-3xl border border-indigo-500/20 not-prose text-center">
              <Calculator className="h-12 w-12 mx-auto mb-4 text-indigo-600" />
              <h2 className="text-2xl font-cal font-bold mb-4">
                Calculate Your Salary Requirement
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Use our Family Reunification Calculator to find the minimum
                salary for both schemes and check when you can apply with your
                Single Permit, KEI, SEI or Blue Card.
              </p>
              <Link
                href="/calculators/family-reunification"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
              >
                Calculate Now
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <BlogArticleAuthor
              datePublished="2026-02-02"
              dateModified={LAST_UPDATED}
              sources={ARTICLE_SOURCES}
            />
            <BlogArticleFooter
              slug="malta-family-reunification-guide-2026"
              title="Malta Family Reunification 2026: Complete Salary Guide"
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false;
export const dynamic = "force-static";
