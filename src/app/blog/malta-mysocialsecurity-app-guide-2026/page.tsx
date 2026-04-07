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
  Smartphone,
  Download,
  Bell,
  CreditCard,
  FileText,
  Shield,
  User,
  CheckCircle2,
} from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";
import { BlogArticleAuthor } from "@/components/blog/blog-article-author";

const ARTICLE_SOURCES = [
  {
    name: "Department of Social Security - mySocialSecurity Portal",
    url: "https://mysocialsecurity.gov.mt",
  },
  {
    name: "Department of Social Security - Benefits & Services",
    url: "https://socialsecurity.gov.mt",
  },
];

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "mySocialSecurity Malta App 2026: Complete Guide | Malta Calculator",
  description:
    "Complete guide to mySocialSecurity Malta app. Learn how to register, update bank details, check contribution history, apply for benefits, and manage your social security online.",
  keywords: [
    "mySocialSecurity Malta",
    "Malta social security app",
    "Malta SSC online",
    "Malta pension app",
    "Malta benefits app",
    "mySocialSecurity registration",
    "Malta e-services",
    "Malta digital government",
    "Malta social security online",
  ],
  alternates: pageAlternates("/blog/malta-mysocialsecurity-app-guide-2026"),
  openGraph: {
    ...ogMetadata,
    title: "mySocialSecurity Malta App 2026: Complete Guide",
    url: `${SITE_URL}/blog/malta-mysocialsecurity-app-guide-2026`,
    type: "article",
    images: [getBlogOgImage("mySocialSecurity Malta App 2026: Complete Guide")],
  },
  twitter: {
    ...twitterMetadata,
    title: "mySocialSecurity Malta App 2026: Complete Guide",
  },
};

export default function MySocialSecurityGuidePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="mySocialSecurity Malta App 2026: Complete Guide"
        description="Complete guide to the mySocialSecurity Malta app for managing social security online."
        slug="malta-mysocialsecurity-app-guide-2026"
        datePublished="2026-02-01"
        sources={ARTICLE_SOURCES}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "mySocialSecurity Guide",
            url: `${SITE_URL}/blog/malta-mysocialsecurity-app-guide-2026`,
          },
        ]}
      />
      <main role="main" aria-label="mySocialSecurity Malta Guide">
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
                  Digital Guide
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  February 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />7 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                mySocialSecurity Malta App 2026: Complete Guide
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Everything you need to know about Malta&apos;s official
                mySocialSecurity app. Manage your social security online, update
                bank details, check contributions, and apply for benefits from
                your phone or computer.
              </p>
            </header>

            <nav className="p-6 bg-muted/30 rounded-2xl mb-12 not-prose">
              <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#what-is" className="text-primary hover:underline">
                    1. What is mySocialSecurity?
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-primary hover:underline">
                    2. Key Features
                  </a>
                </li>
                <li>
                  <a
                    href="#registration"
                    className="text-primary hover:underline"
                  >
                    3. How to Register
                  </a>
                </li>
                <li>
                  <a
                    href="#bank-details"
                    className="text-primary hover:underline"
                  >
                    4. Updating Bank Details
                  </a>
                </li>
                <li>
                  <a
                    href="#contributions"
                    className="text-primary hover:underline"
                  >
                    5. Checking Contribution History
                  </a>
                </li>
                <li>
                  <a href="#benefits" className="text-primary hover:underline">
                    6. Available Benefits
                  </a>
                </li>
                <li>
                  <a href="#tips" className="text-primary hover:underline">
                    7. Tips &amp; Troubleshooting
                  </a>
                </li>
              </ul>
            </nav>

            <section id="what-is">
              <h2>1. What is mySocialSecurity?</h2>
              <p>
                <strong>mySocialSecurity</strong> is Malta&apos;s official
                digital platform for managing your social security affairs.
                It&apos;s provided by the{" "}
                <strong>Department of Social Security</strong>
                and allows you to:
              </p>
              <ul>
                <li>
                  View your Social Security Number and registration details
                </li>
                <li>Check your contribution history</li>
                <li>Update your contact and banking information</li>
                <li>Apply for various social security benefits</li>
                <li>Download official certificates and statements</li>
              </ul>

              <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
                <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl text-center">
                  <Smartphone className="h-12 w-12 mx-auto text-primary mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Mobile App</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Available for iOS and Android devices
                  </p>
                  <div className="flex gap-2 justify-center">
                    <a
                      href="https://apps.apple.com/mt/app/mysocialsecurity/id1558893771"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-black text-white text-xs rounded-lg hover:bg-black/90"
                    >
                      App Store
                    </a>
                    <a
                      href="https://play.google.com/store/apps/details?id=mt.gov.sid.mysocialsecurity"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700"
                    >
                      Google Play
                    </a>
                  </div>
                </div>
                <div className="p-6 bg-secondary/5 border border-secondary/20 rounded-2xl text-center">
                  <Download className="h-12 w-12 mx-auto text-secondary mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Web Portal</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Access from any browser
                  </p>
                  <a
                    href="https://mysocialsecurity.gov.mt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-secondary text-white text-xs rounded-lg hover:bg-secondary/90 inline-block"
                  >
                    Visit Portal →
                  </a>
                </div>
              </div>
            </section>

            <section id="features" className="mt-12">
              <h2>2. Key Features</h2>

              <div className="grid md:grid-cols-3 gap-4 not-prose my-8">
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <User className="h-6 w-6 text-primary mb-2" />
                  <h4 className="font-semibold text-sm mb-1">
                    Personal Details
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    View and update your personal information
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <CreditCard className="h-6 w-6 text-primary mb-2" />
                  <h4 className="font-semibold text-sm mb-1">Bank Details</h4>
                  <p className="text-xs text-muted-foreground">
                    Add or change bank account for benefit payments
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <FileText className="h-6 w-6 text-primary mb-2" />
                  <h4 className="font-semibold text-sm mb-1">
                    Contribution History
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    View your SSC payment records
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <Bell className="h-6 w-6 text-primary mb-2" />
                  <h4 className="font-semibold text-sm mb-1">Notifications</h4>
                  <p className="text-xs text-muted-foreground">
                    Get updates on your applications
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <Shield className="h-6 w-6 text-primary mb-2" />
                  <h4 className="font-semibold text-sm mb-1">
                    Benefits Status
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Track your benefit applications
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <Download className="h-6 w-6 text-primary mb-2" />
                  <h4 className="font-semibold text-sm mb-1">Certificates</h4>
                  <p className="text-xs text-muted-foreground">
                    Download official documents
                  </p>
                </div>
              </div>
            </section>

            <section id="registration" className="mt-12">
              <h2>3. How to Register</h2>
              <p>
                To use mySocialSecurity, you need to register using your{" "}
                <strong>e-ID Malta</strong>
                credentials. Here&apos;s how:
              </p>

              <div className="space-y-4 not-prose my-8">
                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Get e-ID Malta</h4>
                    <p className="text-sm text-muted-foreground">
                      If you don&apos;t have e-ID credentials, visit{" "}
                      <a
                        href="https://eid.gov.mt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        eid.gov.mt
                      </a>{" "}
                      to register for a digital identity.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      Download the App or Visit Website
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Download from App Store/Google Play or visit
                      mysocialsecurity.gov.mt
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Log In with e-ID</h4>
                    <p className="text-sm text-muted-foreground">
                      Use your e-ID credentials to authenticate securely
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold">Complete Your Profile</h4>
                    <p className="text-sm text-muted-foreground">
                      Add your email, phone, and bank details for benefit
                      payments
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl not-prose my-6">
                <p className="text-sm">
                  <strong>💡 Tip:</strong> You can authenticate using:
                </p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>
                    • <strong>e-ID App</strong> - Mobile authentication
                  </li>
                  <li>
                    • <strong>e-ID Card + Reader</strong> - Physical card with
                    PIN
                  </li>
                  <li>
                    • <strong>Username + Password + OTP</strong> - For web
                    portal
                  </li>
                </ul>
              </div>
            </section>

            <section id="bank-details" className="mt-12">
              <h2>4. Updating Bank Details</h2>
              <p>
                It&apos;s essential to keep your bank details updated to receive
                benefit payments correctly.
              </p>

              <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl not-prose my-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  How to Update Bank Details
                </h3>
                <ol className="space-y-2 text-sm">
                  <li>1. Log in to mySocialSecurity</li>
                  <li>
                    2. Go to <strong>&quot;Profile&quot;</strong> or{" "}
                    <strong>&quot;My Details&quot;</strong>
                  </li>
                  <li>
                    3. Click <strong>&quot;Banking Information&quot;</strong>
                  </li>
                  <li>4. Enter your IBAN (MT format)</li>
                  <li>5. Verify with your bank account holder name</li>
                  <li>6. Save changes</li>
                </ol>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl not-prose my-6">
                <p className="text-sm">
                  <strong>⚠️ Important:</strong> The bank account must be in{" "}
                  <strong>your own name</strong>. Benefit payments cannot be
                  made to third-party accounts. Use a Malta-based bank with an
                  IBAN starting with <strong>MT</strong>.
                </p>
              </div>
            </section>

            <section id="contributions" className="mt-12">
              <h2>5. Checking Contribution History</h2>
              <p>
                Your Social Security Contributions (SSC) record is vital for:
              </p>
              <ul>
                <li>Pension eligibility (need minimum stamps)</li>
                <li>Sickness and injury benefits</li>
                <li>Unemployment benefits</li>
                <li>Maternity/paternity benefits</li>
              </ul>

              <h3>What You Can See</h3>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Information
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        Total Contributions
                      </td>
                      <td className="border border-border p-3">
                        Number of weekly stamps/contributions paid
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-medium">
                        Yearly Breakdown
                      </td>
                      <td className="border border-border p-3">
                        Contributions per tax year
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        Employer History
                      </td>
                      <td className="border border-border p-3">
                        List of employers who paid contributions on your behalf
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3 font-medium">
                        Class Type
                      </td>
                      <td className="border border-border p-3">
                        Class 1 (employed) or Class 2 (self-employed)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">
                        Gaps
                      </td>
                      <td className="border border-border p-3">
                        Periods with missing contributions
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl not-prose">
                <p className="text-sm">
                  <strong>💡 For Pension:</strong> You need a minimum number of
                  paid or credited contributions to qualify for a state pension.
                  Check your record regularly to ensure there are no gaps. You
                  can make voluntary contributions to fill gaps.
                </p>
              </div>
            </section>

            <section id="benefits" className="mt-12">
              <h2>6. Available Benefits</h2>
              <p>
                Through mySocialSecurity, you can apply for various social
                security benefits:
              </p>

              <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <h4 className="font-semibold mb-2">Contributory Benefits</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Retirement Pension</li>
                    <li>• Sickness Benefit</li>
                    <li>• Injury Benefit</li>
                    <li>• Unemployment Benefit</li>
                    <li>• Maternity Benefit</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <h4 className="font-semibold mb-2">
                    Non-Contributory Benefits
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Social Assistance</li>
                    <li>• Age Pension</li>
                    <li>• Disability Assistance</li>
                    <li>• Carer&apos;s Allowance</li>
                    <li>• Children&apos;s Allowance</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="tips" className="mt-12">
              <h2>7. Tips &amp; Troubleshooting</h2>

              <h3>Common Issues</h3>
              <div className="space-y-4 not-prose my-6">
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold text-sm mb-1">
                    Can&apos;t log in?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Make sure your e-ID is active. Visit eid.gov.mt to reset
                    credentials if needed.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold text-sm mb-1">
                    Missing contributions?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Contact the Department of Social Security with payslips
                    showing SSC deductions.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold text-sm mb-1">
                    App not working?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Ensure you have the latest version. Clear cache or reinstall
                    if issues persist.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold text-sm mb-1">Need help?</h4>
                  <p className="text-sm text-muted-foreground">
                    Visit{" "}
                    <a
                      href="https://contactdss.gov.mt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      contactdss.gov.mt
                    </a>{" "}
                    or call 153 (Servizz.gov helpline).
                  </p>
                </div>
              </div>

              <h3>Best Practices</h3>
              <ul>
                <li>
                  <strong>Keep details updated</strong> - Especially email,
                  phone, and bank details
                </li>
                <li>
                  <strong>Check contributions regularly</strong> - At least once
                  a year
                </li>
                <li>
                  <strong>Enable notifications</strong> - Stay informed about
                  your applications
                </li>
                <li>
                  <strong>Download important documents</strong> - Keep copies of
                  certificates and statements
                </li>
                <li>
                  <strong>Report issues promptly</strong> - If you notice
                  missing contributions, act fast
                </li>
              </ul>
            </section>

            <BlogArticleAuthor
              datePublished="2026-02-01"
              sources={ARTICLE_SOURCES}
            />
            <BlogArticleFooter
              slug="malta-mysocialsecurity-app-guide-2026"
              title="mySocialSecurity Malta App 2026: Complete Guide"
              ctaTitle="Understand Your SSC Deductions"
              ctaDescription="Use our salary calculator to see exactly how much SSC is deducted from your salary and how it affects your net pay."
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false;
export const dynamic = "force-static";
