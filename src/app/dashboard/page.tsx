import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  CreditCard,
  FileText,
  Plus,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import {
  getCompany,
  getUsageLimits,
  getRecentPayslips,
} from "@/app/actions/payslip-actions";
import {
  Avatar,
  CardHeader,
  EmptyState,
  LinearProgress,
  MdCard,
  PLAN_LABELS,
  PageHeader,
  StatusChip,
  formatEuro,
  mdButton,
} from "@/components/admin/admin-ui";
import PayslipStatusChip from "@/components/admin/payslip-status-chip";
import ManageSubscriptionButton from "./_components/manage-subscription-button";

const UNLIMITED = 999999;

function greeting(): string {
  // Malta saatine göre selamlama
  const hour = Number(
    new Date().toLocaleString("en-GB", {
      hour: "numeric",
      hour12: false,
      timeZone: "Europe/Malta",
    }),
  );
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

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

  const drafts = recentPayslips.filter((p) => p.status === "draft").length;

  const stats = [
    {
      label: "Employees",
      icon: Users,
      used: usage.employees.used,
      limit: usage.employees.limit,
      href: "/employees",
      tone: "bg-md-tertiary-container text-md-on-tertiary-container",
    },
    {
      label: "Payslips this month",
      icon: FileText,
      used: usage.payslips.used,
      limit: usage.payslips.limit,
      href: "/payslips",
      tone: "bg-md-primary-container text-md-on-primary-container",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow={<span className="hidden lg:inline">{company.name}</span>}
        title={`${greeting()}, ${user?.firstName || "there"}`}
        description="Here's what's happening with your payroll this month."
        actions={
          <>
            <Link
              href="/employees"
              className={mdButton({ variant: "outlined" })}
            >
              <UserPlus />
              Add employee
            </Link>
            <Link href="/payslip/new" className={mdButton()}>
              <Plus />
              New payslip
            </Link>
          </>
        }
      />

      {/* Usage & plan */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const unlimited = stat.limit >= UNLIMITED;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-3xl bg-md-surface-container-lowest p-4 shadow-md-1 sm:p-5 transition hover:shadow-md-2 dark:bg-md-surface-container-low"
            >
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={`flex size-10 items-center justify-center rounded-xl ${stat.tone}`}
                >
                  <Icon className="size-5" />
                </div>
                <ChevronRight className="size-5 text-md-on-surface-variant opacity-0 transition group-hover:opacity-100" />
              </div>
              <p className="text-[13px] text-md-on-surface-variant">
                {stat.label}
              </p>
              <p className="mt-1 text-[32px] font-normal leading-10 tracking-tight text-md-on-surface">
                {stat.used}
                <span className="text-lg text-md-on-surface-variant">
                  {" "}
                  / {unlimited ? "∞" : stat.limit}
                </span>
              </p>
              {!unlimited && (
                <LinearProgress
                  value={stat.used}
                  max={stat.limit}
                  className="mt-3"
                />
              )}
            </Link>
          );
        })}

        <div className="col-span-2 flex flex-col rounded-3xl bg-gradient-to-br from-md-primary-container via-md-secondary-container to-md-tertiary-container p-5 text-md-on-primary-container md:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/50 dark:bg-black/20">
              <CreditCard className="size-5" />
            </div>
            <StatusChip className="bg-white/60 text-md-on-primary-container dark:bg-black/25">
              Current plan
            </StatusChip>
          </div>
          <p className="text-[13px] opacity-80">Subscription</p>
          <p className="mt-1 text-[32px] leading-10 tracking-tight">
            {PLAN_LABELS[company.plan]}
          </p>
          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-3">
            {company.plan !== "pro" && (
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
              >
                <Sparkles className="size-4" />
                {company.plan === "free"
                  ? "Upgrade to Basic · €4.99/mo"
                  : "Upgrade to Pro · €29.99/mo"}
              </Link>
            )}
            {company.plan !== "free" && <ManageSubscriptionButton compact />}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent payslips */}
        <MdCard className="lg:col-span-2">
          <CardHeader
            title="Recent payslips"
            subtitle={
              drafts > 0
                ? `${drafts} draft${drafts === 1 ? "" : "s"} waiting to be issued`
                : "Your latest payroll activity"
            }
            action={
              recentPayslips.length > 0 && (
                <Link
                  href="/payslips"
                  className={mdButton({ variant: "text", size: "sm" })}
                >
                  View all
                  <ArrowRight />
                </Link>
              )
            }
          />

          {recentPayslips.length === 0 ? (
            <EmptyState
              icon={<FileText />}
              title="No payslips yet"
              description="Create your first payslip. It takes about a minute, and Malta tax, SSC and COLA are worked out for you."
              action={
                <Link href="/payslip/new" className={mdButton()}>
                  <Plus />
                  Create payslip
                </Link>
              }
            />
          ) : (
            <ul className="px-2 pb-3">
              {recentPayslips.map((payslip) => {
                const isDraft = payslip.status === "draft";
                return (
                  <li key={payslip.id}>
                    <Link
                      href={`/payslip/${payslip.id}`}
                      className="flex items-center gap-4 rounded-2xl px-4 py-3 transition hover:bg-md-on-surface/[0.04]"
                    >
                      <Avatar name={payslip.employee.name} />
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2 truncate text-sm font-medium text-md-on-surface">
                          {payslip.employee.name}
                          {isDraft && (
                            <PayslipStatusChip status={payslip.status} />
                          )}
                        </p>
                        <p className="text-[13px] text-md-on-surface-variant">
                          {new Date(
                            payslip.period_year,
                            payslip.period_month - 1,
                          ).toLocaleDateString("en-GB", {
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold tabular-nums text-md-on-surface">
                          {formatEuro(payslip.net_salary)}
                        </p>
                        <p className="text-xs text-md-on-surface-variant">
                          Net pay
                        </p>
                      </div>
                      <ChevronRight className="hidden size-5 text-md-on-surface-variant sm:block" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </MdCard>

        {/* Shortcuts */}
        <MdCard>
          <CardHeader title="Shortcuts" subtitle="Common tasks" />
          <ul className="px-2 pb-3">
            {[
              {
                href: "/payslip/new",
                icon: Plus,
                title: "Create payslip",
                desc: "Run payroll for one employee",
              },
              {
                href: "/employees",
                icon: Users,
                title: "Manage employees",
                desc: "Add, edit or remove staff",
              },
              {
                href: "/settings",
                icon: Building2,
                title: "Company settings",
                desc: "Logo, address and tax number",
              },
              {
                href: "/settings#billing",
                icon: CreditCard,
                title: "Plan & billing",
                desc: "Usage, invoices and upgrades",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-4 rounded-2xl px-4 py-3 transition hover:bg-md-on-surface/[0.04]"
                  >
                    <div className="flex size-10 items-center justify-center rounded-full bg-md-surface-container-high text-md-on-surface-variant">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-md-on-surface">
                        {item.title}
                      </p>
                      <p className="text-[13px] text-md-on-surface-variant">
                        {item.desc}
                      </p>
                    </div>
                    <ChevronRight className="size-5 text-md-on-surface-variant" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </MdCard>
      </div>
    </>
  );
}
