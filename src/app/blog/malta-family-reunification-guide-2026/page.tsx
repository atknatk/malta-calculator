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
} from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";
import { BlogArticleAuthor } from "@/components/blog/blog-article-author";

export const metadata: Metadata = {
  ...defaultMetadata,
  title:
    "Malta Family Reunification 2026: Complete Salary Guide | Malta Calculator",
  description:
    "Malta family reunification 2026: salary thresholds for S.L. 217.06 and the Family Member Policy, KEI/Specialist exception (€50,000 + €6,000), eligible income sources, documents and 60-day decision timeline.",
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
    "Malta median wage 2024",
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
];

export default function FamilyReunificationGuidePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Family Reunification 2026: Complete Salary Guide"
        description="Complete guide to family reunification salary requirements in Malta."
        slug="malta-family-reunification-guide-2026"
        datePublished="2026-02-02"
        sources={ARTICLE_SOURCES}
      />
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
                  February 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  10 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Family Reunification 2026: Complete Salary Requirements
                Guide
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Planning to bring your family to Malta? This comprehensive guide
                explains the two main schemes for family reunification, their
                salary requirements, and how to calculate the minimum income you
                need.
              </p>
            </header>

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
                    href="#two-schemes"
                    className="text-primary hover:underline"
                  >
                    2. Two Schemes Explained
                  </a>
                </li>
                <li>
                  <a
                    href="#salary-requirements"
                    className="text-primary hover:underline"
                  >
                    3. Salary Requirements & Eligible Income
                  </a>
                </li>
                <li>
                  <a href="#examples" className="text-primary hover:underline">
                    4. Calculation Examples
                  </a>
                </li>
                <li>
                  <a href="#documents" className="text-primary hover:underline">
                    5. Required Documents
                  </a>
                </li>
                <li>
                  <a
                    href="#application"
                    className="text-primary hover:underline"
                  >
                    6. Application Process
                  </a>
                </li>
                <li>
                  <a
                    href="#exclusions"
                    className="text-primary hover:underline"
                  >
                    7. Who Is Excluded
                  </a>
                </li>
                <li>
                  <a href="#faqs" className="text-primary hover:underline">
                    8. FAQs
                  </a>
                </li>
              </ul>
            </nav>

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
                    217.06 — adult dependants (e.g. an elderly parent or a
                    dependent sibling) may be considered.
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
                  <li>• Single Permit holders with 1+ year residence</li>
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
                    <p className="text-xs text-muted-foreground pt-2 border-t border-border/50">
                      ⏱ Decision: up to <strong>9 months</strong> · 📋 Forms{" "}
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
                      <strong>€18,940 (Identità, June 2024)</strong>.
                      &quot;Net&quot; = gross income minus income tax and social
                      security contributions, declared with the Commissioner of
                      Revenue.
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

            <section id="salary-requirements" className="mt-12">
              <h2>3. Salary Requirements</h2>
              <p className="text-sm text-muted-foreground">
                Figures below use the <strong>2025 average gross wage</strong>{" "}
                published by NSO Malta (€24,976) for S.L. 217.06, and the{" "}
                <strong>median net wage of €18,940</strong> referenced by
                Identità as of <strong>June 2024</strong> for the Family Member
                Policy.
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
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        1 member
                      </td>
                      <td className="border border-border p-3">
                        €29,971/year (€2,498/month)
                      </td>
                      <td className="border border-border p-3">
                        €22,728/year (€1,894/month)
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-medium">
                        2 members
                      </td>
                      <td className="border border-border p-3">
                        €34,966/year (€2,914/month)
                      </td>
                      <td className="border border-border p-3">
                        €26,516/year (€2,210/month)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        3 members
                      </td>
                      <td className="border border-border p-3">
                        €39,962/year (€3,330/month)
                      </td>
                      <td className="border border-border p-3">
                        €30,304/year (€2,525/month)
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-medium">
                        4 members
                      </td>
                      <td className="border border-border p-3">
                        €44,957/year (€3,746/month)
                      </td>
                      <td className="border border-border p-3">
                        €34,092/year (€2,841/month)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-muted-foreground">
                * Family Reunification figures use the 2025 NSO average gross
                wage (€24,976). Family Member Policy figures use Identità&apos;s
                median net wage (€18,940, June 2024). Both are updated
                periodically — verify against the official sources before
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
              <h2>4. Calculation Examples</h2>

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
                      €24,976 + (€24,976 × 20%) ={" "}
                      <strong>€29,971 gross/year</strong>
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
                      €24,976 + (€24,976 × 20% × 3) ={" "}
                      <strong>€39,962 gross/year</strong>
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
              </div>
            </section>

            <section id="documents" className="mt-12">
              <h2>5. Required Documents</h2>
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
                      • Valid passport (min. <strong>8 months validity</strong>{" "}
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
                    <li>• Medical certificates</li>
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
              <h2>6. Application Process</h2>

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
              </div>
            </section>

            <section id="exclusions" className="mt-12">
              <h2>7. Who Is Excluded</h2>
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
                    Student Exceptions
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    The 12-month sponsor tenure waiting period{" "}
                    <strong>may not apply</strong> to students of specified
                    institutions, including:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Institute of Tourism Studies (ITS)</li>
                    <li>
                      • Malta College of Arts, Science and Technology (MCAST)
                    </li>
                    <li>• University of Malta</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3 italic">
                    Always confirm directly with Identità — student status alone
                    does not guarantee approval.
                  </p>
                </div>
              </div>
            </section>

            <section id="faqs" className="mt-12">
              <h2>8. Frequently Asked Questions</h2>

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
                    valid for at least 1 year and have reasonable prospects of
                    permanent residence. Under the Family Member Policy you must
                    wait <strong>12 calendar months</strong> from the date your
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
                    , who may apply earlier.
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
                    (e.g. an elderly parent or a dependent sibling), provided
                    you can document financial or physical dependency on the
                    sponsor.
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
                    Identità&apos;s Family Member Policy page lists the €18,940
                    net median wage <strong>as of June 2024</strong>. The figure
                    is reviewed periodically and may rise as Malta&apos;s median
                    wage rises. The 20% per-family-member uplift applies to the
                    median wage, so a future revision will affect both the base
                    threshold and the uplift simultaneously. Always cross-check
                    the latest number with Identità before submitting.
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
                Use our Family Reunification Calculator to find out the exact
                minimum salary you need to sponsor your family members under
                both schemes.
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
