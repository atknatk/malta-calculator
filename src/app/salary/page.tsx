import { MarketingLayout } from "@/components/layout/marketing-layout";
import { SalaryCalculatorServer } from "./_components/salary-calculator-server";
import SalaryPlaygroundCards from "./_components/play-ground-cart";
import { salaryParamsCache } from "./search-params";
import type { SearchParams } from "nuqs/server";
import type { Metadata } from "next";
import { SITE_URL } from "../shared-metadata";

// Query params okudugu icin dynamic
export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: SITE_URL },
};

/**
 * /salary?params... - Paylasilmis hesaplama URL'lerini destekler.
 * Ana sayfa (/) static kalir, bu sayfa dynamic olarak query params ile calisir.
 */
export default async function SalaryCalculatorPage({
  searchParams,
}: PageProps) {
  const params = await salaryParamsCache.parse(searchParams);

  return (
    <MarketingLayout>
      <main role="main" aria-label="Malta Salary Calculator">
        <div className="grid w-full grid-cols-1 gap-4 xs:grid-cols-2">
          <SalaryCalculatorServer initialParams={params}>
            <SalaryPlaygroundCards />
          </SalaryCalculatorServer>
        </div>
      </main>
    </MarketingLayout>
  );
}
