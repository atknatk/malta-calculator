import { BackButton } from "@/components/layout/back-button";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
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

  return {
    ...defaultMetadata,
    title: `Malta Salary Calculator - ${formattedSalary}/year`,
    description: `Calculate your net salary in Malta for ${params.year}. Gross salary: ${formattedSalary}, Tax type: ${params.taxType}, SSC category: ${params.sscCategory}.`,
    openGraph: {
      ...ogMetadata,
      title: `Malta Salary Calculator - ${formattedSalary}/year`,
      url: "https://maltacalculator.com/salary",
    },
    twitter: {
      ...twitterMetadata,
      title: `Malta Salary Calculator - ${formattedSalary}/year`,
    },
  };
}

export default async function SalaryCalculatorPage({
  searchParams,
}: PageProps) {
  // Parse URL params server-side for SSR
  const params = await salaryParamsCache.parse(searchParams);

  return (
    <>
      <BackButton href="/" />
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 sm:grid-cols-2">
        <SalaryCalculatorServer initialParams={params}>
          <SalaryPlaygroundCards />
        </SalaryCalculatorServer>
      </div>
    </>
  );
}
