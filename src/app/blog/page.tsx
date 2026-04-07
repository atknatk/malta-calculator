import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
  pageAlternates,
} from "../shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { BlogGrid, type BlogPost } from "./_components/blog-grid";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Blog | Malta Tax & Salary Guides | Malta Calculator",
  description:
    "Expert guides on Malta tax rates, SSC contributions, COLA, and salary calculations. Stay updated with the latest Malta employment and tax regulations for 2024-2026.",
  alternates: pageAlternates("/blog"),
  openGraph: {
    ...ogMetadata,
    title: "Blog | Malta Tax & Salary Guides",
    url: `${SITE_URL}/blog`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Blog | Malta Tax & Salary Guides",
  },
};

const blogPosts: BlogPost[] = [
  {
    slug: "malta-single-permit-employer-compliance-2026",
    title: "Malta Single Permit — Employer Compliance Guide 2026",
    description:
      "Every employer-side rule for 2026: termination rate thresholds, workforce limits, First Employment Rule (Micro 2 / Small 4 / Medium 20 / Large 40), disability quota and Jobsplus deadlines.",
    date: "April 2026",
    readTime: "13 min read",
    category: "Employer Guide",
    featured: true,
  },
  {
    slug: "malta-single-permit-guide-2026",
    title: "Malta Single Permit Guide 2026: Cost, Eligibility & Application",
    description:
      "Verified 2026 guide to Malta's Single Permit for non-EU workers. Fees (€600/€150), KEI €45K, SEI €30K, the new Skills Pass and the 60-day employer change window.",
    date: "April 2026",
    readTime: "14 min read",
    category: "Immigration",
    featured: true,
  },
  {
    slug: "malta-double-taxation-treaty-guide-2026",
    title: "Malta Double Taxation Treaty Guide 2026",
    description:
      "Complete guide to Malta's 80+ double taxation treaties. DTA relief mechanisms, foreign tax credits, unilateral relief, FRFTC, and withholding tax rates explained.",
    date: "March 2026",
    readTime: "11 min read",
    category: "Tax Guide",
    featured: true,
  },
  {
    slug: "malta-crypto-digital-asset-tax-guide-2026",
    title: "Malta Crypto & Digital Asset Tax Guide 2026",
    description:
      "Complete guide to cryptocurrency taxation in Malta. Learn about crypto income tax rates, capital gains, VFA framework, NFT taxation, and Bitcoin reporting.",
    date: "February 2026",
    readTime: "12 min read",
    category: "Tax Guide",
    featured: true,
  },
  {
    slug: "how-to-calculate-net-salary-malta-2026",
    title: "How to Calculate Your Net Salary in Malta (2026 Guide)",
    description:
      "Step-by-step guide to calculating your Malta net salary in 2026. Income tax brackets, SSC contributions, COLA, and worked examples for single, married, and parent taxpayers.",
    date: "March 2026",
    readTime: "10 min read",
    category: "Calculator Guide",
    featured: true,
  },
  {
    slug: "malta-property-transfer-tax-guide-2026",
    title: "Malta Property Transfer Tax Guide 2026",
    description:
      "Complete guide to Malta property transfer tax 2026. Stamp duty rates (5%, 3.5%), notarial fees, capital gains tax, and all costs when buying property.",
    date: "February 2026",
    readTime: "10 min read",
    category: "Tax Guide",
    featured: true,
  },
  {
    slug: "malta-budget-2026-family-tax-savings-guide",
    title: "Malta Budget 2026: New Family Tax Savings & Key Changes",
    description:
      "Complete guide to Malta Budget 2026 changes. New tax brackets for families save up to \u20AC1,625/year. Pension exemptions, property relief & business incentives.",
    date: "February 2026",
    readTime: "12 min read",
    category: "Budget Guide",
    featured: true,
  },
  {
    slug: "malta-public-holidays-2026-complete-guide",
    title: "Malta Public Holidays 2026: Complete List of 14 Official Holidays",
    description:
      "All 14 public holidays in Malta for 2026 with dates, meanings, long weekends & employment rights. Plan your year!",
    date: "February 2026",
    readTime: "8 min read",
    category: "Holidays",
    featured: true,
  },
  {
    slug: "malta-tax-rates-2026-complete-guide",
    title: "Malta Tax Rates 2026: Complete Guide to Income Tax Brackets",
    description:
      "Everything you need to know about Malta's 2026 income tax rates. Comprehensive breakdown of tax brackets for single, married, and parent taxpayers.",
    date: "January 2026",
    readTime: "8 min read",
    category: "Tax Guide",
  },
  {
    slug: "malta-ssc-contributions-2026-explained",
    title: "Malta SSC Contributions 2026: Rates, Caps & Categories",
    description:
      "Complete guide to Social Security Contributions in Malta for 2026. Learn about Class 1 employee rates, weekly caps, and the 1962 age threshold.",
    date: "January 2026",
    readTime: "6 min read",
    category: "SSC Guide",
  },
  {
    slug: "understanding-cola-malta-2026",
    title: "Understanding COLA in Malta 2026: Cost of Living Adjustment",
    description:
      "What is COLA and how does it affect your salary in Malta? Complete explanation of the Cost of Living Adjustment and 2026 rates.",
    date: "January 2026",
    readTime: "5 min read",
    category: "Salary Guide",
  },
  {
    slug: "malta-expat-tax-hqp-scheme-guide",
    title: "Malta Expat Tax: HQP 15% Flat Rate Guide",
    description:
      "Guide to Malta's Highly Qualified Persons tax scheme. Learn about the 15% flat tax rate for expats and eligibility requirements.",
    date: "January 2026",
    readTime: "7 min read",
    category: "Expat Guide",
  },
  {
    slug: "malta-minimum-wage-2026-guide",
    title: "Malta Minimum Wage 2026: €213.54/Week Complete Guide",
    description:
      "Malta minimum wage 2026 guide. Current rates at €213.54/week (€928.70/month). Learn about the National Minimum Wage.",
    date: "January 2026",
    readTime: "5 min read",
    category: "Salary Guide",
  },
  {
    slug: "malta-part-time-employment-rights",
    title: "Malta Part-Time Employment Rights 2026",
    description:
      "Malta part-time employment rights and benefits. Pro-rata salary calculations, minimum hours, and vacation entitlements.",
    date: "January 2026",
    readTime: "6 min read",
    category: "Employment",
  },
  {
    slug: "malta-maternity-leave-2026-guide",
    title: "Malta Maternity Leave 2026: 18 Weeks Entitlement",
    description:
      "Malta maternity leave 2026 guide. 18 weeks paid leave, 10 days paternity leave, and benefit calculations.",
    date: "January 2026",
    readTime: "7 min read",
    category: "Family",
  },
  {
    slug: "malta-13th-month-salary-bonus-explained",
    title: "Malta 13th Month Salary (Bonus) Explained",
    description:
      "Malta 13th month salary and government statutory bonuses explained. Tax treatment and payment schedules.",
    date: "January 2026",
    readTime: "5 min read",
    category: "Salary Guide",
  },
  {
    slug: "malta-tax-refund-guide-2026",
    title: "Malta Tax Refund 2026: How to Claim Back Overpaid Tax",
    description:
      "Malta tax refund guide 2026. Learn how to claim back overpaid income tax with FS3 forms and IRD process.",
    date: "January 2026",
    readTime: "6 min read",
    category: "Tax Guide",
  },
  {
    slug: "malta-self-employment-tax-guide-2026",
    title: "Malta Self-Employment Tax Guide 2026",
    description:
      "Malta self-employment tax guide. Income tax, provisional tax payments, Class 2 SSC, and deductible business expenses.",
    date: "January 2026",
    readTime: "8 min read",
    category: "Self-Employment",
  },
  {
    slug: "malta-rental-income-tax-15-percent-guide",
    title: "Malta Rental Income Tax: 15% Flat Rate Guide",
    description:
      "Malta rental income tax guide. 15% flat rate option vs progressive tax comparison and deductible expenses.",
    date: "January 2026",
    readTime: "6 min read",
    category: "Property",
  },
  {
    slug: "malta-first-time-buyer-scheme-2026",
    title: "Malta First-Time Buyer Scheme 2026",
    description:
      "Malta first-time property buyer benefits. Reduced stamp duty at 3.5%, grant eligibility, and property value limits.",
    date: "January 2026",
    readTime: "5 min read",
    category: "Property",
  },
  {
    slug: "malta-stamp-duty-complete-guide-2026",
    title: "Malta Stamp Duty 2026: Complete Guide to Property Tax",
    description:
      "Malta stamp duty complete guide. 5% standard rate, 3.5% first-time buyer, exemptions, and calculation examples.",
    date: "January 2026",
    readTime: "7 min read",
    category: "Property",
  },
  {
    slug: "malta-pension-system-2026-guide",
    title: "Malta Pension System 2026: State Pension Guide",
    description:
      "Malta pension system explained. State pension eligibility, contribution requirements, and retirement age.",
    date: "January 2026",
    readTime: "8 min read",
    category: "Retirement",
  },
  // Employment calculators blog posts
  {
    slug: "malta-notice-period-employment-guide-2026",
    title: "Malta Notice Period Guide 2026: Employment Termination Rules",
    description:
      "Complete guide to notice periods in Malta. Learn about probation periods, minimum notice requirements based on service years.",
    date: "January 2026",
    readTime: "5 min read",
    category: "Employment",
  },
  {
    slug: "malta-retirement-age-guide-2026",
    title: "Malta Retirement Age 2026: Complete Pension Age Guide",
    description:
      "Malta retirement age guide. Learn about pension eligibility, transitional arrangements, and how to calculate your retirement date.",
    date: "January 2026",
    readTime: "6 min read",
    category: "Retirement",
  },
  {
    slug: "malta-vacation-leave-entitlement-2026",
    title: "Malta Vacation Leave 2026: Annual Leave Entitlement",
    description:
      "Malta vacation leave guide. Minimum 192 hours (24 days) annual leave, public holidays, and carry-over rules.",
    date: "January 2026",
    readTime: "5 min read",
    category: "Employment",
  },
  {
    slug: "malta-overtime-pay-rates-2026",
    title: "Malta Overtime Pay Rates 2026: 1.5x & 2x Guide",
    description:
      "Malta overtime pay guide. Standard 1.5x rate, 2x for Sundays and public holidays, and calculation examples.",
    date: "January 2026",
    readTime: "5 min read",
    category: "Salary Guide",
  },
  // Banking blog posts
  {
    slug: "malta-mortgage-guide-2026",
    title: "Malta Mortgage Guide 2026: Home Loan Essentials",
    description:
      "Complete guide to mortgages in Malta. 10% minimum deposit, LTV ratios, interest rates, and monthly payment calculations.",
    date: "January 2026",
    readTime: "6 min read",
    category: "Banking",
  },
  {
    slug: "malta-savings-interest-guide-2026",
    title: "Malta Savings Interest Guide 2026: Compound Interest & Tax",
    description:
      "Malta savings interest guide. Compound interest calculations, 15% withholding tax, and maximizing your returns.",
    date: "January 2026",
    readTime: "5 min read",
    category: "Banking",
  },
  {
    slug: "malta-personal-loan-guide-2026",
    title: "Malta Personal Loan Guide 2026: Rates & Repayment",
    description:
      "Malta personal loan guide. Interest rates, repayment terms, eligibility requirements, and monthly payment calculator.",
    date: "January 2026",
    readTime: "5 min read",
    category: "Banking",
  },
  {
    slug: "malta-expat-mortgage-guide-2026",
    title: "Malta Expat Mortgage Guide 2026: AIP Permit & Stamp Duty",
    description:
      "Expat property buying guide. AIP permit requirements, 5-year residency rule, 5% stamp duty (1%+4%), and financing options.",
    date: "January 2026",
    readTime: "8 min read",
    category: "Expat Guide",
  },
  // Transport blog posts
  {
    slug: "malta-vehicle-registration-tax-guide-2026",
    title: "Malta Vehicle Registration Tax 2026: CO2-Based Tax Guide",
    description:
      "Malta vehicle registration tax guide. CO2 emission bands, electric vehicle exemptions, age depreciation, and EU/non-EU import rules.",
    date: "January 2026",
    readTime: "8 min read",
    category: "Transport",
  },
  {
    slug: "malta-road-license-guide-2026",
    title: "Malta Road License 2026: Annual Circulation Tax Guide",
    description:
      "Malta road license guide. Annual fees by engine capacity, electric vehicle exemptions, vintage rates, and payment options.",
    date: "January 2026",
    readTime: "6 min read",
    category: "Transport",
  },
  {
    slug: "malta-drivers-license-guide-2026",
    title: "Malta Driving License 2026: Fees, Tests & Requirements",
    description:
      "Malta driving license guide. License fees, theory and practical tests, categories, and age requirements.",
    date: "January 2026",
    readTime: "7 min read",
    category: "Transport",
  },
  {
    slug: "malta-vrt-guide-2026",
    title: "Malta VRT 2026: Vehicle Roadworthiness Test Guide",
    description:
      "Malta VRT (MOT) guide. Test fees, frequency by vehicle type, what to bring, and re-test information.",
    date: "January 2026",
    readTime: "5 min read",
    category: "Transport",
  },
  {
    slug: "malta-import-vehicle-guide-2026",
    title: "Importing a Vehicle to Malta 2026: Complete Guide",
    description:
      "Malta vehicle import guide. EU and non-EU rules, registration tax, VAT, customs duties, and step-by-step process.",
    date: "January 2026",
    readTime: "9 min read",
    category: "Transport",
  },
  // Employment & Social Security blog posts
  {
    slug: "malta-social-security-number-guide-2026",
    title: "Malta Social Security Number 2026: Complete SSN Guide",
    description:
      "Complete guide to Malta Social Security Number (SSN). How to apply, eligibility requirements, required documents for EU/Non-EU nationals.",
    date: "February 2026",
    readTime: "8 min read",
    category: "Employment",
  },
  {
    slug: "malta-work-permit-employment-guide-2026",
    title: "Malta Work Permit 2026: EU & Non-EU Workers Guide",
    description:
      "Complete guide to working in Malta. Work permits, employment licenses, Jobsplus registration, and employee rights.",
    date: "February 2026",
    readTime: "10 min read",
    category: "Employment",
  },
  {
    slug: "malta-mysocialsecurity-app-guide-2026",
    title: "mySocialSecurity Malta App 2026: Complete Guide",
    description:
      "Complete guide to mySocialSecurity Malta app. Register, update bank details, check contributions, and apply for benefits.",
    date: "February 2026",
    readTime: "7 min read",
    category: "Digital Guide",
  },
  // Immigration blog posts
  {
    slug: "malta-family-reunification-guide-2026",
    title: "Malta Family Reunification 2026: Complete Salary Guide",
    description:
      "Complete guide to family reunification salary requirements in Malta. Two schemes explained with calculation examples.",
    date: "February 2026",
    readTime: "10 min read",
    category: "Immigration",
  },
  // Family benefits blog posts
  {
    slug: "malta-childrens-allowance-guide-2026",
    title: "Malta Children's Allowance 2026: Complete Guide & Calculator",
    description:
      "Complete guide to Malta Children's Allowance. Eligibility, calculation formula, rates (€8.66-€27.29/week), and child birth bonus.",
    date: "February 2026",
    readTime: "12 min read",
    category: "Family",
  },
];

export default function BlogPage() {
  return (
    <MarketingLayout>
      <main role="main" aria-label="Malta Calculator Blog">
        <Shell className="py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-sm font-medium text-primary mb-6">
              <BookOpen className="h-4 w-4" />
              <span>{blogPosts.length} Expert Guides</span>
            </div>
            <h1 className="font-cal text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Malta Tax & Salary Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              In-depth guides on Malta&apos;s tax system, SSC contributions,
              banking, and everything you need to understand your finances.
            </p>
          </div>

          {/* Blog Grid with Filtering */}
          <BlogGrid posts={blogPosts} />

          {/* CTA Section */}
          <div className="mt-16 text-center p-8 rounded-3xl bg-muted/30 border border-border/50">
            <h2 className="text-2xl font-cal font-bold mb-4">
              Ready to Calculate Your Salary?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Use our free Malta Salary Calculator to get accurate net salary
              calculations with all the tax rates and SSC contributions
              explained in our guides.
            </p>
            <Link
              href="/salary"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
            >
              Try Salary Calculator
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
