import { MarketingLayout } from "@/components/layout/marketing-layout";
import { MenuBox } from "@/components/marketing/menu-box";
import { PayslipCTA } from "@/components/marketing/payslip-cta";
import { FeaturedGuides } from "@/components/marketing/featured-guides";
import {
  FAQPageJsonLd,
  OrganizationJsonLd,
  WebApplicationJsonLd,
  SiteNavigationJsonLd,
  WebsiteJsonLd,
} from "@/components/json-ld";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
} from "./shared-metadata";
import { SalaryCalculatorServer } from "./salary/_components/salary-calculator-server";
import SalaryPlaygroundCards from "./salary/_components/play-ground-cart";
import { defaultSalaryParams } from "./salary/search-params";
import { CompactHero } from "@/components/marketing/compact-hero";
import { AffiliateCard } from "@/components/affiliate/affiliate-card";

// Static page - SEO için force-static
export const revalidate = false;
export const dynamic = "force-static";

const title = `Malta Salary Calculator 2026 | Free Tax & Net Pay`;
const description = `Calculate your Malta net salary for 2026. Accurate income tax deductions, SSC contributions, and COLA adjustments. Free online calculator for single, married & parent tax rates. Malta's #1 salary calculator.`;

export const metadata: Metadata = {
  ...defaultMetadata,
  title,
  description,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    ...ogMetadata,
    title,
    description,
    url: SITE_URL,
  },
  twitter: {
    ...twitterMetadata,
    title,
    description,
  },
};

export default function Home() {
  return (
    <MarketingLayout>
      {/* Structured Data for SEO */}
      <WebsiteJsonLd />
      <WebApplicationJsonLd />
      <FAQPageJsonLd />
      <OrganizationJsonLd />
      <SiteNavigationJsonLd />

      <main role="main" aria-label="Malta Salary Calculator">
        {/* Compact Hero - Mobile First */}
        <CompactHero />

        {/* Salary Calculator */}
        <div className="grid w-full grid-cols-1 gap-4 xs:grid-cols-2">
          <SalaryCalculatorServer initialParams={defaultSalaryParams}>
            <SalaryPlaygroundCards />
          </SalaryCalculatorServer>
        </div>

        {/* Contextual affiliate suggestion (dormant until offers are activated) */}
        <AffiliateCard slug="salary" />

        {/* Other Calculators */}
        <MenuBox />

        {/* B2B Payslip CTA */}
        <PayslipCTA />

        {/* Featured Guides - SEO Internal Linking */}
        <FeaturedGuides />
      </main>
    </MarketingLayout>
  );
}
