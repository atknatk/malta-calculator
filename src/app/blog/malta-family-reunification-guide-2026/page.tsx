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
    "Complete guide to family reunification in Malta. Learn salary requirements for Family Reunification (S.L. 217.6) and Family Member Policy. Calculate your minimum income to sponsor family members.",
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
  ],
  alternates: {
    canonical: `${SITE_URL}/blog/malta-family-reunification-guide-2026`,
  },
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
    name: "Identità Malta - Family Reunification",
    url: "https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/non-employment-permits/family-reunification/",
  },
  {
    name: "Identità Malta - Family Members Policy",
    url: "https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/non-employment-permits/family-members-policy/",
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
                    3. Salary Requirements
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
                  <a href="#faqs" className="text-primary hover:underline">
                    7. FAQs
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

              <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
                <div className="p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                  <Users className="h-8 w-8 text-indigo-600 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">
                    Who Can You Sponsor?
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Spouse or registered partner</li>
                    <li>• Minor children (under 18)</li>
                    <li>• Adult dependent children</li>
                    <li>• Dependent parents (in some cases)</li>
                  </ul>
                </div>
                <div className="p-6 bg-violet-500/10 border border-violet-500/20 rounded-2xl">
                  <Globe className="h-8 w-8 text-violet-600 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">
                    Who Is This For?
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Non-EU workers in Malta</li>
                    <li>• Single Permit holders</li>
                    <li>• Long-term residents</li>
                    <li>• TCN with valid residence</li>
                  </ul>
                </div>
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
                    The primary legal framework for family reunification under
                    Malta immigration law.
                  </p>
                  <div className="p-4 bg-background/50 rounded-xl">
                    <p className="font-medium mb-2">💰 Salary Requirement:</p>
                    <p className="text-lg font-bold text-blue-600">
                      Average Wage (Gross) + 20% per family member
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
                    An alternative policy managed by Identità for specific
                    cases.
                  </p>
                  <div className="p-4 bg-background/50 rounded-xl">
                    <p className="font-medium mb-2">💰 Salary Requirement:</p>
                    <p className="text-lg font-bold text-purple-600">
                      €18,940 Net + 20% of median wage per family member
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
              <h2>3. Salary Requirements (2025 Figures)</h2>

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
                * Based on 2025 average wage of €24,976 (gross) and median of
                €18,940 (net)
              </p>
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
                    <li>• Valid residence permit</li>
                    <li>• Employment contract</li>
                    <li>• Recent payslips (3-6 months)</li>
                    <li>• Tax returns (FS3)</li>
                    <li>• Proof of accommodation</li>
                    <li>• Health insurance</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <h4 className="font-semibold mb-3">For Family Members</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Valid passport</li>
                    <li>• Marriage certificate (for spouse)</li>
                    <li>• Birth certificates (for children)</li>
                    <li>• Police clearance certificates</li>
                    <li>• Medical certificates</li>
                    <li>• Photos (passport size)</li>
                  </ul>
                </div>
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
                      translated/apostilled if needed.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Submit Application</h4>
                    <p className="text-sm text-muted-foreground">
                      Apply through Identità Malta (online or in person).
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
                      Pay the application and residence permit fees.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold">Wait for Approval</h4>
                    <p className="text-sm text-muted-foreground">
                      Processing typically takes 3-6 months. Your family can
                      apply for visa once approved.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="faqs" className="mt-12">
              <h2>7. Frequently Asked Questions</h2>

              <div className="space-y-4 not-prose my-8">
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    Which scheme should I apply under?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Family Reunification (S.L. 217.6) is the main legal pathway.
                    Family Member Policy is typically for specific situations.
                    Consult Identità Malta for guidance.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    Can I combine income with my spouse?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Generally, the sponsor must demonstrate sufficient
                    individual income. Joint income may be considered in
                    specific circumstances.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    How long does the process take?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Typical processing time is 3-6 months, but can vary
                    depending on complexity and document verification
                    requirements.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    Can my family work in Malta?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Family members may apply for work permits after receiving
                    residence status. Specific conditions apply.
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
