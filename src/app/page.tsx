import { MarketingLayout } from "@/components/layout/marketing-layout";
import { MoreCalculators } from "@/components/marketing/more-calculators";
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
import { SalaryHero } from "./salary/_components/salary-hero";
import { AffiliateCard } from "@/components/affiliate/affiliate-card";
import { SponsorStrip } from "@/components/marketing/sponsor-strip";

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

      <SalaryHero />

      {/* Hesaplayıcı + aylık döküm */}
      <SalaryCalculatorServer initialParams={defaultSalaryParams}>
        <SalaryPlaygroundCards />
      </SalaryCalculatorServer>

      {/* Contextual affiliate suggestion (dormant until offers are activated) */}
      <AffiliateCard slug="salary" />

      {/* Other Calculators */}
      <MoreCalculators />

      {/* Featured Guides - SEO Internal Linking */}
      <FeaturedGuides />

      {/* B2B Payslip CTA */}
      <PayslipCTA />

      <SponsorStrip className="mt-10 md:mt-12 lg:mt-14" />
    </MarketingLayout>
  );
}
