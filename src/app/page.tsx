import { MarketingLayout } from "@/components/layout/marketing-layout";
import { MenuBox } from "@/components/marketing/menu-box";
import {
  FAQPageJsonLd,
  OrganizationJsonLd,
  WebApplicationJsonLd,
  SiteNavigationJsonLd,
  WebsiteJsonLd,
} from "@/components/json-ld";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
} from "./shared-metadata";
import { SalaryCalculatorServer } from "./salary/_components/salary-calculator-server";
import SalaryPlaygroundCards from "./salary/_components/play-ground-cart";
import { salaryParamsCache } from "./salary/search-params";
import { CompactHero } from "@/components/marketing/compact-hero";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await salaryParamsCache.parse(searchParams);
  const salary = params.salary;
  const formattedSalary = new Intl.NumberFormat("en-MT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(salary);

  const taxTypeLabel =
    params.taxType === "single"
      ? "Single"
      : params.taxType === "married"
        ? "Married"
        : "Parent";

  const title = `Malta Salary Calculator 2026 | Free Tax & Net Pay Calculator`;
  const description = `Calculate your Malta net salary for ${params.year}. Gross salary: ${formattedSalary}, Tax status: ${taxTypeLabel}. Accurate tax deductions, SSC contributions, and COLA. Malta's #1 salary calculator.`;

  return {
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
}

export default async function Home({ searchParams }: PageProps) {
  // Parse URL params server-side for SSR
  const params = await salaryParamsCache.parse(searchParams);

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
          <SalaryCalculatorServer initialParams={params}>
            <SalaryPlaygroundCards />
          </SalaryCalculatorServer>
        </div>

        {/* Other Calculators */}
        <MenuBox />
      </main>
    </MarketingLayout>
  );
}
