import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { SalaryCalculatorServer } from "@/app/salary/_components/salary-calculator-server";
import SalaryPlaygroundCards from "@/app/salary/_components/play-ground-cart";
import { defaultSalaryParams } from "@/app/salary/search-params";
import type { SalarySearchParams } from "@/app/salary/search-params";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

interface SharedCalculationPageProps {
  params: Promise<{ token: string }>;
}

export default async function SharedCalculationPage({
  params,
}: SharedCalculationPageProps) {
  const { token } = await params;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("saved_calculations")
    .select("params, expires_at, view_count")
    .eq("token", token)
    .single();

  if (error || !data) {
    notFound();
  }

  // Expired check
  if (new Date() > new Date(data.expires_at)) {
    notFound();
  }

  // view_count artir (fire and forget)
  supabase
    .from("saved_calculations")
    .update({ view_count: (data.view_count ?? 0) + 1 })
    .eq("token", token)
    .then();

  // params'i SalarySearchParams'a donustur, eksik alanlari default ile doldur
  const savedParams = data.params as Record<string, unknown>;
  const initialParams: SalarySearchParams = {
    ...defaultSalaryParams,
    ...(savedParams as Partial<SalarySearchParams>),
  };

  return (
    <MarketingLayout>
      <main role="main" aria-label="Malta Salary Calculator - Shared">
        <div className="grid w-full grid-cols-1 gap-4 xs:grid-cols-2">
          <SalaryCalculatorServer initialParams={initialParams}>
            <SalaryPlaygroundCards />
          </SalaryCalculatorServer>
        </div>
      </main>
    </MarketingLayout>
  );
}
