import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  getCompany,
  getUsageLimits,
  getRecentPayslips,
} from "@/app/actions/payslip-actions";

export default async function DashboardPage() {
  const [{ userId }, user] = await Promise.all([auth(), currentUser()]);

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user has a company, redirect to onboarding if not
  const company = await getCompany();

  if (!company) {
    redirect("/onboarding");
  }

  // Get usage limits and recent payslips in parallel
  const [usage, recentPayslips] = await Promise.all([
    getUsageLimits(),
    getRecentPayslips(5),
  ]);

  const planLabels: Record<string, string> = {
    free: "Free Plan",
    basic: "Basic Plan",
    pro: "Pro Plan",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-bold text-amber-600">
              Malta Calculator
            </Link>
            <span className="rounded-md bg-gradient-to-r from-violet-500 to-purple-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Beta
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {company.name}
            </span>
            <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900 dark:text-amber-300">
              {planLabels[company.plan]}
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
            Hello, {user?.firstName || "User"} 👋
          </h1>
          <p className="mb-8 text-slate-500">
            Welcome to your {company.name} dashboard
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Quick Actions */}
            <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-800 dark:border-slate-700">
              <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  href="/payslip/new"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-3 font-medium text-white transition hover:bg-amber-700"
                >
                  <span>➕</span>
                  Create New Payslip
                </Link>
                <Link
                  href="/employees"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <span>👥</span>
                  Manage Employees
                </Link>
                <Link
                  href="/settings"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <span>⚙️</span>
                  Company Settings
                </Link>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-800 dark:border-slate-700">
              <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                This Month&apos;s Usage
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700">
                  <span className="text-slate-600 dark:text-slate-300">
                    👥 Employees
                  </span>
                  <span className="text-xl font-bold text-amber-600">
                    {usage.employees.used}/
                    {usage.employees.limit === 999999
                      ? "∞"
                      : usage.employees.limit}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700">
                  <span className="text-slate-600 dark:text-slate-300">
                    📄 Payslips (This Month)
                  </span>
                  <span className="text-xl font-bold text-amber-600">
                    {usage.payslips.used}/
                    {usage.payslips.limit === 999999
                      ? "∞"
                      : usage.payslips.limit}
                  </span>
                </div>
              </div>
              {company.plan === "free" && (
                <Link
                  href="/pricing"
                  className="mt-4 block text-center text-sm font-medium text-amber-600 hover:text-amber-700"
                >
                  ⬆️ Upgrade to increase limits
                </Link>
              )}
            </div>

            {/* Recent Payslips */}
            <div className="rounded-xl border bg-white p-6 shadow-sm md:col-span-2 dark:bg-slate-800 dark:border-slate-700">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Recent Payslips
                </h2>
                {recentPayslips.length > 0 && (
                  <Link
                    href="/payslips"
                    className="text-sm font-medium text-amber-600 hover:text-amber-700"
                  >
                    View all →
                  </Link>
                )}
              </div>

              {recentPayslips.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-slate-600">
                  <p className="text-slate-500">No payslips created yet</p>
                  <p className="mt-2 text-sm text-slate-400">
                    Click the button above to create your first payslip
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentPayslips.map((payslip) => (
                    <div
                      key={payslip.id}
                      className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3 dark:border-slate-700"
                    >
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {payslip.employee.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {new Date(
                            payslip.period_year,
                            payslip.period_month - 1,
                          ).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-amber-600">
                          €{payslip.net_salary.toLocaleString()}
                        </p>
                        <Link
                          href={`/payslip/${payslip.id}`}
                          className="text-sm text-slate-500 hover:text-amber-600"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
