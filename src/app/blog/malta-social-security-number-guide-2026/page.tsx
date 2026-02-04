import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
} from "@/app/shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Calculator,
  FileText,
  User,
  Plane,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title:
    "Malta Social Security Number 2026: Complete SSN Guide | Malta Calculator",
  description:
    "Complete guide to Malta Social Security Number (SSN). Learn how to apply, eligibility requirements, required documents for EU/Non-EU nationals, and the automatic SSN issuance process.",
  keywords: [
    "Malta Social Security Number",
    "Malta SSN",
    "Malta NI number",
    "Malta national insurance number",
    "Malta SSN application",
    "Malta work permit SSN",
    "Malta expat SSN",
    "mySocialSecurity Malta",
    "Malta SSN 2026",
  ],
  alternates: {
    canonical: `${SITE_URL}/blog/malta-social-security-number-guide-2026`,
  },
  openGraph: {
    ...ogMetadata,
    title: "Malta Social Security Number 2026: Complete SSN Guide",
    url: `${SITE_URL}/blog/malta-social-security-number-guide-2026`,
    type: "article",
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Social Security Number 2026: Complete SSN Guide",
  },
};

export default function MaltaSSNGuidePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Social Security Number 2026: Complete SSN Guide"
        description="Complete guide to Malta Social Security Number (SSN) including application process, eligibility, and required documents."
        slug="malta-social-security-number-guide-2026"
        datePublished="2026-02-01"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Social Security Number Guide",
            url: `${SITE_URL}/blog/malta-social-security-number-guide-2026`,
          },
        ]}
      />
      <main role="main" aria-label="Malta Social Security Number Guide">
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
                  <Clock className="h-4 w-4" />8 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Social Security Number 2026: Complete SSN Guide
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Everything you need to know about obtaining a Social Security
                Number (SSN) in Malta. From automatic issuance to manual
                applications, eligibility criteria, and required documents.
              </p>
            </header>

            <nav className="p-6 bg-muted/30 rounded-2xl mb-12 not-prose">
              <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#what-is-ssn"
                    className="text-primary hover:underline"
                  >
                    1. What is a Social Security Number?
                  </a>
                </li>
                <li>
                  <a
                    href="#who-needs-ssn"
                    className="text-primary hover:underline"
                  >
                    2. Who Needs an SSN?
                  </a>
                </li>
                <li>
                  <a
                    href="#automatic-issuance"
                    className="text-primary hover:underline"
                  >
                    3. Automatic SSN Issuance (Since July 2025)
                  </a>
                </li>
                <li>
                  <a
                    href="#eligibility"
                    className="text-primary hover:underline"
                  >
                    4. Eligibility Requirements
                  </a>
                </li>
                <li>
                  <a
                    href="#required-documents"
                    className="text-primary hover:underline"
                  >
                    5. Required Documents
                  </a>
                </li>
                <li>
                  <a
                    href="#how-to-apply"
                    className="text-primary hover:underline"
                  >
                    6. How to Apply
                  </a>
                </li>
                <li>
                  <a
                    href="#special-categories"
                    className="text-primary hover:underline"
                  >
                    7. Special Worker Categories
                  </a>
                </li>
              </ul>
            </nav>

            <section id="what-is-ssn">
              <h2>1. What is a Social Security Number?</h2>
              <p>
                A <strong>Social Security Number (SSN)</strong>, formerly known
                as the National Insurance (N.I.) Number, is a unique identifier
                that registers individuals under the{" "}
                <strong>Social Security Act (Cap. 318)</strong>. This number is
                essential for:
              </p>
              <ul>
                <li>Paying social security contributions</li>
                <li>Receiving benefits (pension, sickness, unemployment)</li>
                <li>Employment registration in Malta</li>
                <li>Tax purposes</li>
              </ul>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl not-prose my-6">
                <p className="text-sm">
                  <strong>💡 Important:</strong> Your SSN is issued{" "}
                  <strong>only once</strong> and remains valid throughout your
                  lifetime. It&apos;s a permanent identifier for all social
                  security matters in Malta.
                </p>
              </div>
            </section>

            <section id="who-needs-ssn" className="mt-12">
              <h2>2. Who Needs an SSN?</h2>

              <h3>Who Already Has One (Since October 2016)</h3>
              <p>
                <strong>Maltese citizens</strong> holding a permanent Maltese
                Identity Card (series M, L, G, H) no longer receive a separate
                SSN. Instead, their{" "}
                <strong>Identity Card number serves as their SSN</strong>.
              </p>

              <h3>Who Needs to Apply</h3>
              <div className="grid md:grid-cols-2 gap-4 not-prose my-6">
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <User className="h-6 w-6 text-primary mb-2" />
                  <h4 className="font-semibold mb-2">EU Nationals</h4>
                  <p className="text-sm text-muted-foreground">
                    EU citizens who don&apos;t wish to apply for a Maltese
                    Residence Card under the Freedom of Movement Act.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <FileText className="h-6 w-6 text-primary mb-2" />
                  <h4 className="font-semibold mb-2">Residence Card Holders</h4>
                  <p className="text-sm text-muted-foreground">
                    Employees and self-employed persons with a Maltese Residence
                    Card ending in &apos;A&apos;.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <Plane className="h-6 w-6 text-primary mb-2" />
                  <h4 className="font-semibold mb-2">Non-EU Workers</h4>
                  <p className="text-sm text-muted-foreground">
                    Those without a permanent Maltese Residence Card who are
                    starting employment.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <Building2 className="h-6 w-6 text-primary mb-2" />
                  <h4 className="font-semibold mb-2">Cross-Border Workers</h4>
                  <p className="text-sm text-muted-foreground">
                    Workers subject to Maltese legislation under EU Regulation
                    883/2004.
                  </p>
                </div>
              </div>
            </section>

            <section id="automatic-issuance" className="mt-12">
              <h2>3. Automatic SSN Issuance (Since July 2025)</h2>
              <p>
                <strong>As of July 2025</strong>, Malta introduced automatic SSN
                issuance to streamline the process:
              </p>

              <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl not-prose my-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  How Automatic Issuance Works
                </h3>
                <ol className="space-y-2 text-sm">
                  <li>
                    1. Employer submits an online{" "}
                    <strong>Engagement Form</strong> to Jobsplus
                  </li>
                  <li>
                    2. Employee/self-employed details are forwarded to the
                    Department of Social Security
                  </li>
                  <li>
                    3. If eligible, an{" "}
                    <strong>SSN is issued automatically</strong>
                  </li>
                  <li>
                    4. SSN and Registration Certificate sent by post or email
                  </li>
                </ol>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl not-prose my-6">
                <p className="text-sm">
                  <strong>⚠️ Requirement:</strong> The{" "}
                  <strong>Maltese Identity Card number is mandatory</strong> for
                  automatic issuance. If not provided, you must apply manually
                  through the online application or by visiting a Servizz.gov
                  hub.
                </p>
              </div>
            </section>

            <section id="eligibility" className="mt-12">
              <h2>4. Eligibility Requirements</h2>
              <p>You may be eligible for a Social Security Number if:</p>

              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Requirement
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        No existing SSN
                      </td>
                      <td className="border border-border p-3">
                        You don&apos;t already possess a Maltese Social Security
                        Number
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-medium">
                        Employment status
                      </td>
                      <td className="border border-border p-3">
                        You are being engaged for employment or starting
                        self-employment
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        Age requirement
                      </td>
                      <td className="border border-border p-3">
                        At least 14 years old. If of compulsory school age,
                        parent/guardian must first apply through National School
                        Support Services
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="required-documents" className="mt-12">
              <h2>5. Required Documents</h2>

              <h3>
                EU Nationals (Employed/Self-Employed) without Maltese ID Card
              </h3>
              <ul>
                <li>
                  Copy of work contract showing employment/self-employment in
                  Malta
                </li>
              </ul>

              <h3>Non-EU Nationals (Employed)</h3>
              <ul>
                <li>
                  Copy of work contract signed by employer (with start date)
                </li>
                <li>
                  Copy of Employment Licence (Work Permit) with RefCom number
                </li>
              </ul>

              <h3>Non-EU Nationals Married to Maltese/EU Citizen</h3>
              <ul>
                <li>
                  Letter from Department of Citizenship and Expatriates
                  confirming right to work
                </li>
                <li>Copy of work contract with start date</li>
              </ul>

              <h3>Non-EU Nationals (Self-Employed)</h3>
              <ul>
                <li>Copy of Employment Licence</li>
              </ul>

              <h3>Non-EU Nationals with EU Directive Permits</h3>
              <ul>
                <li>Copy of work contract with start date</li>
                <li>
                  Copy of relevant permit (from ID document or Identità
                  certificate)
                </li>
              </ul>

              <h3>Asylum Seekers</h3>
              <ul>
                <li>Copy of work contract with start date</li>
                <li>Relevant asylum documentation</li>
              </ul>
            </section>

            <section id="how-to-apply" className="mt-12">
              <h2>6. How to Apply</h2>
              <p>There are two ways to apply for an SSN:</p>

              <div className="grid md:grid-cols-2 gap-6 not-prose my-8">
                <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl">
                  <h3 className="font-semibold text-lg mb-3">
                    Online Application
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Fill in and submit your application online through the
                    official Social Security portal.
                  </p>
                  <a
                    href="https://socialsecurity.gov.mt/en/ssnen/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    Apply Online →
                  </a>
                </div>

                <div className="p-6 bg-secondary/5 border border-secondary/20 rounded-2xl">
                  <h3 className="font-semibold text-lg mb-3">In Person</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Visit any Servizz.gov hub with your documents for in-person
                    assistance.
                  </p>
                  <a
                    href="https://contactdss.gov.mt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-secondary hover:underline"
                  >
                    Find a Hub →
                  </a>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl not-prose">
                <p className="text-sm">
                  <strong>💡 Tip:</strong> After registration, update your
                  contact and banking details through the{" "}
                  <a
                    href="https://mysocialsecurity.gov.mt/?lang=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    mySocialSecurity
                  </a>{" "}
                  app to receive benefits directly to your bank account.
                </p>
              </div>
            </section>

            <section id="special-categories" className="mt-12">
              <h2>7. Special Worker Categories</h2>
              <p>
                Certain categories of workers may have their employer request an
                SSN on their behalf:
              </p>

              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Category
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        Aircrew
                      </td>
                      <td className="border border-border p-3">
                        Flight/cabin crew with Malta as home base, subject to
                        Maltese legislation under EU Regulation 883/2004
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-medium">
                        Seafarer
                      </td>
                      <td className="border border-border p-3">
                        Workers on Maltese-flagged vessels, subject to Maltese
                        legislation
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        Transport Worker
                      </td>
                      <td className="border border-border p-3">
                        Workers with transport-related duties across multiple EU
                        states
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-medium">
                        EU Cross-Border Worker
                      </td>
                      <td className="border border-border p-3">
                        Workers residing in one EU state with activities
                        crossing into Malta
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        EUNA
                      </td>
                      <td className="border border-border p-3">
                        EU Nationals registered with a Maltese Employer
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <div className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-3xl border border-border/50 not-prose text-center">
              <Calculator className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-cal font-bold mb-4">
                Calculate Your SSC Contributions
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Once you have your SSN, use our salary calculator to understand
                your social security contributions and net salary in Malta.
              </p>
              <Link
                href="/salary"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
              >
                Calculate Salary
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false;
export const dynamic = "force-static";
