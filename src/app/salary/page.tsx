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
      ? "Bekar / Single"
      : params.taxType === "married"
        ? "Evli / Married"
        : "Ebeveyn / Parent";

  const title = `Malta Net Maaş: ${formattedSalary}/yıl | ${params.year} Hesaplama`;
  const description = `Malta ${params.year} net maaş hesaplayıcı. Brüt maaş: ${formattedSalary}, Vergi tipi: ${taxTypeLabel}, SSC: ${params.sscCategory}. Vergi kesintisi, SSC katkısı ve COLA dahil detaylı döküm. Calculate Malta net salary with tax deductions, SSC contributions and COLA breakdown.`;

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

