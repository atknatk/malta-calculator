import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { getCompany, getPayslips } from "@/app/actions/payslip-actions";
import { PAYSLIP_STATUS, type PayslipStatus } from "@/utils/payslip-details";

const FILTERS: { label: string; value?: PayslipStatus }[] = [
  { label: "All" },
  { label: "Drafts", value: PAYSLIP_STATUS.DRAFT },
  { label: "Issued", value: PAYSLIP_STATUS.FINAL },
];

const fmt = (amount: number): string =>
  `€${amount.toLocaleString("en-MT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default async function PayslipsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const company = await getCompany();

  if (!company) {
    redirect("/onboarding");
  }

  const params = await searchParams;
  const status = FILTERS.find((f) => f.value === params.status)?.value;
  const payslips = await getPayslips(status);

  // Dönemlere göre grupla (en yeni dönem üstte)
  const groups = new Map<string, typeof payslips>();
  for (const payslip of payslips) {
    const key = new Date(
      payslip.period_year,
      payslip.period_month - 1,
    ).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    groups.set(key, [...(groups.get(key) ?? []), payslip]);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-xl font-bold text-amber-600"
            >
              Malta Calculator
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-600 dark:text-slate-400">Payslips</span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Payslips
              </h1>
              <p className="text-sm text-slate-500">{company.name}</p>
            </div>
            <Link
              href="/payslip/new"
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
            >
              + New Payslip
            </Link>
          </div>

          <div className="mb-6 flex gap-2">
            {FILTERS.map((filter) => (
              <Link
                key={filter.label}
                href={
                  filter.value
                    ? `/payslips?status=${filter.value}`
                    : "/payslips"
                }
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition",
                  status === filter.value
                    ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                    : "border-slate-200 text-slate-600 hover:border-amber-300 dark:border-slate-700 dark:text-slate-400",
                )}
              >
                {filter.label}
              </Link>
            ))}
          </div>

          {payslips.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-600 dark:bg-slate-800">
              <p className="text-slate-500">
                {status === PAYSLIP_STATUS.DRAFT
                  ? "No drafts. Save a payslip as a draft to review it before issuing."
                  : "No payslips yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {[...groups.entries()].map(([period, items]) => (
                <section key={period}>
                  <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {period}
                  </h2>
                  <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border bg-white shadow-sm dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-800">
                    {items.map((payslip) => {
                      const isDraft =
                        payslip.status === PAYSLIP_STATUS.DRAFT;
                      return (
                        <div
                          key={payslip.id}
                          className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-slate-900 dark:text-white">
                                {payslip.employee.name}
                              </p>
                              <span
                                className={cn(
                                  "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                                  isDraft
                                    ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
                                )}
                              >
                                {isDraft ? "Draft" : "Issued"}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              {payslip.employee.position || "—"} · Gross{" "}
                              {fmt(payslip.gross_salary)} · Updated{" "}
                              {new Date(payslip.updated_at).toLocaleDateString(
                                "en-GB",
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-amber-600">
                              {fmt(payslip.net_salary)}
                            </span>
                            {isDraft && (
                              <Link
                                href={`/payslip/new?draft=${payslip.id}`}
                                className="text-sm text-slate-500 hover:text-amber-600"
                              >
                                Edit
                              </Link>
                            )}
                            <Link
                              href={`/payslip/${payslip.id}`}
                              className="text-sm font-medium text-slate-700 hover:text-amber-600 dark:text-slate-300"
                            >
                              {isDraft ? "Review →" : "View →"}
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
