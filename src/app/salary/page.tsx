import { BackButton } from "@/components/layout/back-button";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
} from "../shared-metadata";
import { SalaryCalculatorServer } from "./_components/salary-calculator-server";
import SalaryPlaygroundCards from "./_components/play-ground-cart";
import { salaryParamsCache } from "./search-params";

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

  const title = `Malta Salary Calculator: ${formattedSalary}/year | ${params.year} Net Pay`;
  const description = `Calculate your Malta net salary for ${params.year}. Gross salary: ${formattedSalary}, Tax status: ${taxTypeLabel}, SSC Category: ${params.sscCategory}. Detailed breakdown including tax deductions, SSC contributions, and COLA.`;

  return {
    ...defaultMetadata,
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/salary`,
    },
    openGraph: {
      ...ogMetadata,
      title,
      description,
      url: `${SITE_URL}/salary`,
    },
    twitter: {
      ...twitterMetadata,
      title,
      description,
    },
  };
}

export default async function SalaryCalculatorPage({
  searchParams,
}: PageProps) {
  // Parse URL params server-side for SSR
  const params = await salaryParamsCache.parse(searchParams);

  return (
    <main role="main" aria-label="Malta Salary Calculator">
      <BackButton href="/" />
      <div className="grid w-full grid-cols-1 gap-4 xs:grid-cols-2">
        <SalaryCalculatorServer initialParams={params}>
          <SalaryPlaygroundCards />
        </SalaryCalculatorServer>
      </div>
    </main>
  );
}

