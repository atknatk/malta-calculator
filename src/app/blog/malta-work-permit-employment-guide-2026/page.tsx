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
  FileCheck,
  Building2,
  Globe,
  Shield,
  Briefcase,
  Users,
  CheckCircle2,
} from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";
import { BlogArticleAuthor } from "@/components/blog/blog-article-author";

const ARTICLE_SOURCES = [
  {
    name: "Identità Malta - Residence & Work Permits",
    url: "https://identita.gov.mt",
  },
  {
    name: "Department of Industrial & Employment Relations (DIER)",
    url: "https://dier.gov.mt",
  },
];

export const metadata: Metadata = {
  ...defaultMetadata,
  title:
    "Malta Work Permit 2026: Complete Guide for EU & Non-EU Workers | Malta Calculator",
  description:
    "Complete guide to working in Malta for EU and Non-EU nationals. Learn about work permits, employment licenses, Jobsplus registration, and your rights as an employee in Malta.",
  keywords: [
    "Malta work permit",
    "Malta employment license",
    "Malta work visa",
    "Malta Jobsplus",
    "working in Malta",
    "Malta EU worker rights",
    "Malta non-EU work permit",
    "Malta TCN permit",
    "Malta employment 2026",
    "Malta expat work",
  ],
  alternates: pageAlternates("/blog/malta-work-permit-employment-guide-2026"),
  openGraph: {
    ...ogMetadata,
    title: "Malta Work Permit 2026: Complete Guide for EU & Non-EU Workers",
    url: `${SITE_URL}/blog/malta-work-permit-employment-guide-2026`,
    type: "article",
    images: [
      getBlogOgImage(
        "Malta Work Permit 2026: Complete Guide for EU & Non-EU Workers",
      ),
    ],
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Work Permit 2026: Complete Guide for EU & Non-EU Workers",
  },
};

export default function MaltaWorkPermitGuidePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Work Permit 2026: Complete Guide for EU & Non-EU Workers"
        description="Complete guide to working in Malta including work permits, employment licenses, and worker rights."
        slug="malta-work-permit-employment-guide-2026"
        datePublished="2026-02-01"
        sources={ARTICLE_SOURCES}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Work Permit Guide",
            url: `${SITE_URL}/blog/malta-work-permit-employment-guide-2026`,
          },
        ]}
      />
      <main role="main" aria-label="Malta Work Permit Guide 2026">
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
                  Employment Guide
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
                Malta Work Permit 2026: Complete Guide for EU &amp; Non-EU
                Workers
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Everything you need to know about working legally in Malta. From
                EU freedom of movement to Third Country National (TCN) permits,
                employment licenses, and your rights as an employee.
              </p>
            </header>

            <nav className="p-6 bg-muted/30 rounded-2xl mb-12 not-prose">
              <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#overview" className="text-primary hover:underline">
                    1. Overview: Working in Malta
                  </a>
                </li>
                <li>
                  <a
                    href="#eu-nationals"
                    className="text-primary hover:underline"
                  >
                    2. EU/EEA/Swiss Nationals
                  </a>
                </li>
                <li>
                  <a
                    href="#non-eu-nationals"
                    className="text-primary hover:underline"
                  >
                    3. Non-EU (Third Country) Nationals
                  </a>
                </li>
                <li>
                  <a
                    href="#employment-license"
                    className="text-primary hover:underline"
                  >
                    4. Employment License Process
                  </a>
                </li>
                <li>
                  <a href="#jobsplus" className="text-primary hover:underline">
                    5. Jobsplus Registration
                  </a>
                </li>
                <li>
                  <a
                    href="#employee-rights"
                    className="text-primary hover:underline"
                  >
                    6. Employee Rights in Malta
                  </a>
                </li>
                <li>
                  <a
                    href="#key-agencies"
                    className="text-primary hover:underline"
                  >
                    7. Key Government Agencies
                  </a>
                </li>
              </ul>
            </nav>

            <section id="overview">
              <h2>1. Overview: Working in Malta</h2>
              <p>
                Malta is a popular destination for international workers due to
                its:
              </p>
              <ul>
                <li>
                  <strong>Strategic location</strong> in the Mediterranean
                </li>
                <li>
                  <strong>English-speaking environment</strong> (official
                  language alongside Maltese)
                </li>
                <li>
                  <strong>Growing economy</strong> with strong iGaming, fintech,
                  and tourism sectors
                </li>
                <li>
                  <strong>Competitive tax schemes</strong> for expats (HQP,
                  QRTE)
                </li>
                <li>
                  <strong>EU membership</strong> since 2004
                </li>
              </ul>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl not-prose my-6">
                <p className="text-sm">
                  <strong>💡 Key Point:</strong> Your right to work in Malta
                  depends on your nationality.
                  <strong> EU/EEA/Swiss nationals</strong> have automatic
                  rights, while <strong>non-EU nationals</strong> need an
                  employment license (work permit).
                </p>
              </div>
            </section>

            <section id="eu-nationals" className="mt-12">
              <h2>2. EU/EEA/Swiss Nationals</h2>
              <p>
                Under the <strong>Freedom of Movement</strong> principle,
                citizens of EU member states, EEA countries (Iceland,
                Liechtenstein, Norway), and Switzerland can work in Malta
                without restrictions.
              </p>

              <div className="grid md:grid-cols-2 gap-4 not-prose my-6">
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                  <CheckCircle2 className="h-6 w-6 text-green-600 mb-2" />
                  <h4 className="font-semibold mb-2">What You Can Do</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Work without a permit</li>
                    <li>• Start employment immediately</li>
                    <li>• Be self-employed</li>
                    <li>• Access same rights as Maltese workers</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <FileCheck className="h-6 w-6 text-primary mb-2" />
                  <h4 className="font-semibold mb-2">What You Need</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Valid EU passport or ID card</li>
                    <li>• Residence card if staying &gt; 3 months</li>
                    <li>• Social Security Number for contributions</li>
                    <li>• Tax number from IRD</li>
                  </ul>
                </div>
              </div>

              <h3>Residence Documentation for EU Citizens</h3>
              <p>
                While you don&apos;t need a work permit, if you plan to stay in
                Malta for more than <strong>3 months</strong>, you should
                register with <strong>Identità</strong> (Identity Malta) for a
                residence document.
              </p>

              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Stay Duration
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Requirements
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">
                        Up to 3 months
                      </td>
                      <td className="border border-border p-3">
                        Valid passport or national ID only
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        More than 3 months
                      </td>
                      <td className="border border-border p-3">
                        Register for EU Residence Certificate
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        After 5 years
                      </td>
                      <td className="border border-border p-3">
                        Eligible for Permanent Residence
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="non-eu-nationals" className="mt-12">
              <h2>3. Non-EU (Third Country) Nationals</h2>
              <p>
                <strong>Third Country Nationals (TCNs)</strong> from non-EU
                countries need an <strong>employment license</strong>
                (commonly called a work permit) before they can legally work in
                Malta.
              </p>

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl not-prose my-6">
                <p className="text-sm">
                  <strong>⚠️ Important:</strong> The employer must apply for the
                  employment license on behalf of the employee. You cannot apply
                  for a work permit yourself.
                </p>
              </div>

              <h3>Types of Employment Licenses</h3>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Type
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Description
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        Standard License
                      </td>
                      <td className="border border-border p-3">
                        General employment for most sectors
                      </td>
                      <td className="border border-border p-3">
                        1 year (renewable)
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-medium">
                        Key Employee
                      </td>
                      <td className="border border-border p-3">
                        Senior/specialized positions
                      </td>
                      <td className="border border-border p-3">
                        Up to 3 years
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        Intra-Company Transfer
                      </td>
                      <td className="border border-border p-3">
                        Transfer from overseas branch
                      </td>
                      <td className="border border-border p-3">
                        Up to 3 years
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-medium">
                        Single Permit
                      </td>
                      <td className="border border-border p-3">
                        Combined residence and work
                      </td>
                      <td className="border border-border p-3">
                        1 year (renewable)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="employment-license" className="mt-12">
              <h2>4. Employment License Process</h2>

              <h3>Step-by-Step Application</h3>
              <div className="space-y-4 not-prose my-6">
                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      Employer Registers with Jobsplus
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Company must have an active Jobsplus account
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      Labour Market Test (if required)
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Employer must prove no suitable EU workers available (some
                      exemptions apply)
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Submit Application</h4>
                    <p className="text-sm text-muted-foreground">
                      Online application via Jobsplus with all required
                      documents
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold">Processing &amp; Approval</h4>
                    <p className="text-sm text-muted-foreground">
                      Typically 4-8 weeks depending on sector
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    5
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      Employee Arrives &amp; Registers
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Apply for residence permit, SSN, and tax number
                    </p>
                  </div>
                </div>
              </div>

              <h3>Required Documents</h3>
              <ul>
                <li>
                  <strong>Employee:</strong> Valid passport, CV, qualifications,
                  police clearance
                </li>
                <li>
                  <strong>Employer:</strong> Employment contract, job
                  description, company registration
                </li>
                <li>
                  <strong>Both:</strong> Completed application forms, processing
                  fee
                </li>
              </ul>
            </section>

            <section id="jobsplus" className="mt-12">
              <h2>5. Jobsplus Registration</h2>
              <p>
                <strong>Jobsplus</strong> is Malta&apos;s public employment
                service and the main agency for:
              </p>

              <div className="grid md:grid-cols-3 gap-4 not-prose my-6">
                <div className="p-4 rounded-xl bg-muted/30 border border-border text-center">
                  <Briefcase className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">Employment Licenses</h4>
                  <p className="text-xs text-muted-foreground">
                    For non-EU workers
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">Job Matching</h4>
                  <p className="text-xs text-muted-foreground">
                    Connecting employers &amp; jobseekers
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border text-center">
                  <FileCheck className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">Engagement Forms</h4>
                  <p className="text-xs text-muted-foreground">
                    Mandatory employment registration
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl not-prose my-6">
                <p className="text-sm">
                  <strong>💡 For Employers:</strong> All employment in Malta
                  must be registered through Jobsplus using the{" "}
                  <strong>Engagement Form</strong>. This triggers automatic SSN
                  issuance for eligible workers.
                </p>
              </div>
            </section>

            <section id="employee-rights" className="mt-12">
              <h2>6. Employee Rights in Malta</h2>
              <p>
                All employees in Malta, regardless of nationality, are entitled
                to:
              </p>

              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Right
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Details (2026)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        Minimum Wage
                      </td>
                      <td className="border border-border p-3">
                        €213.54/week (€928.70/month)
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-medium">
                        COLA
                      </td>
                      <td className="border border-border p-3">
                        €10.36/week Cost of Living Adjustment
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        Annual Leave
                      </td>
                      <td className="border border-border p-3">
                        Minimum 192 hours (24 8-hour days)
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-medium">
                        Public Holidays
                      </td>
                      <td className="border border-border p-3">
                        14 national public holidays
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        Working Hours
                      </td>
                      <td className="border border-border p-3">
                        Max 48 hours/week (including overtime)
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-medium">
                        Overtime Pay
                      </td>
                      <td className="border border-border p-3">
                        1.5x normal rate (2x on Sundays/holidays)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        Maternity Leave
                      </td>
                      <td className="border border-border p-3">
                        18 weeks paid leave
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-medium">
                        Sick Leave
                      </td>
                      <td className="border border-border p-3">
                        Statutory sick pay after 3 waiting days
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="key-agencies" className="mt-12">
              <h2>7. Key Government Agencies</h2>

              <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <Globe className="h-6 w-6 text-primary mb-2" />
                  <h4 className="font-semibold mb-1">Jobsplus</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Employment services &amp; work permits
                  </p>
                  <a
                    href="https://jobsplus.gov.mt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    jobsplus.gov.mt →
                  </a>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <Shield className="h-6 w-6 text-primary mb-2" />
                  <h4 className="font-semibold mb-1">Identità Malta</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Residence permits &amp; ID cards
                  </p>
                  <a
                    href="https://identita.gov.mt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    identita.gov.mt →
                  </a>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <Building2 className="h-6 w-6 text-primary mb-2" />
                  <h4 className="font-semibold mb-1">Social Security</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    SSN &amp; contributions
                  </p>
                  <a
                    href="https://socialsecurity.gov.mt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    socialsecurity.gov.mt →
                  </a>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <FileCheck className="h-6 w-6 text-primary mb-2" />
                  <h4 className="font-semibold mb-1">Inland Revenue (IRD)</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Tax numbers &amp; tax matters
                  </p>
                  <a
                    href="https://cfr.gov.mt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    cfr.gov.mt →
                  </a>
                </div>
              </div>
            </section>

            <BlogArticleAuthor
              datePublished="2026-02-01"
              sources={ARTICLE_SOURCES}
            />
            <BlogArticleFooter
              slug="malta-work-permit-employment-guide-2026"
              title="Malta Work Permit 2026: Complete Guide for EU & Non-EU Workers"
              ctaTitle="Calculate Your Malta Salary"
              ctaDescription="Planning to work in Malta? Use our salary calculator to understand your net salary, tax obligations, and social security contributions."
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false;
export const dynamic = "force-static";
