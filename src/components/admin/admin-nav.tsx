"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  ArrowUpRight,
  Calculator,
  FileText,
  LayoutDashboard,
  Plus,
  Settings,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PLAN_LABELS } from "./admin-ui";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  match: (path: string) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    match: (p) => p.startsWith("/dashboard"),
  },
  {
    href: "/payslips",
    label: "Payslips",
    icon: FileText,
    match: (p) => p.startsWith("/payslips") || p.startsWith("/payslip/"),
  },
  {
    href: "/employees",
    label: "Employees",
    icon: Users,
    match: (p) => p.startsWith("/employees"),
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    match: (p) => p.startsWith("/settings"),
  },
];

interface AdminNavProps {
  companyName: string | null;
  companyLogo: string | null;
  plan: string | null;
}

function CompanyMark({
  name,
  logo,
}: {
  name: string;
  logo: string | null;
}): JSX.Element {
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={logo}
        alt=""
        className="size-10 shrink-0 rounded-xl bg-white object-contain p-1"
      />
    );
  }
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-md-primary text-sm font-semibold text-md-on-primary">
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}

export default function AdminNav({
  companyName,
  companyLogo,
  plan,
}: AdminNavProps): JSX.Element {
  const pathname = usePathname() ?? "";
  const onWizard = pathname.startsWith("/payslip/new");

  return (
    <>
      {/* Navigation drawer (lg+) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col bg-md-surface-container-low px-3 pb-4 pt-5 lg:flex print:hidden">
        <Link
          href="/dashboard"
          className="mb-6 flex items-center gap-3 rounded-2xl px-3 py-1"
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md-1">
            <Calculator className="size-5" />
          </div>
          <div className="leading-tight">
            <p className="text-[15px] font-semibold text-md-on-surface">
              Malta Calculator
            </p>
            <p className="text-xs text-md-on-surface-variant">
              Payroll workspace
            </p>
          </div>
        </Link>

        {!onWizard && (
          <Link
            href="/payslip/new"
            className="mb-6 ml-1 inline-flex h-14 w-fit items-center gap-3 rounded-2xl bg-md-primary-container pl-4 pr-5 text-sm font-medium text-md-on-primary-container shadow-md-2 transition hover:shadow-md-3"
          >
            <Plus className="size-6" />
            New payslip
          </Link>
        )}

        <nav aria-label="Main" className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-14 items-center gap-3 rounded-full px-4 text-sm font-medium transition-colors",
                  active
                    ? "bg-md-secondary-container font-semibold text-md-on-secondary-container"
                    : "text-md-on-surface-variant hover:bg-md-on-surface/[0.06]",
                )}
              >
                <Icon className="size-6" strokeWidth={active ? 2.2 : 1.8} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="my-4 h-px bg-md-outline-variant/60" />

        <Link
          href="/"
          className="flex h-12 items-center gap-3 rounded-full px-4 text-sm text-md-on-surface-variant transition-colors hover:bg-md-on-surface/[0.06]"
        >
          <Calculator className="size-5" strokeWidth={1.8} />
          Public calculators
          <ArrowUpRight className="ml-auto size-4 opacity-60" />
        </Link>

        <div className="mt-auto space-y-3">
          {plan && plan !== "pro" && (
            <Link
              href="/pricing"
              className="block rounded-3xl bg-gradient-to-br from-md-primary-container to-md-tertiary-container p-4 text-md-on-primary-container transition hover:shadow-md-2"
            >
              <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="size-4" />
                Upgrade to {plan === "free" ? "Basic" : "Pro"}
              </div>
              <p className="text-xs opacity-80">
                {plan === "free"
                  ? "Your logo on payslips, 10 employees and no branding."
                  : "Up to 100 employees and payslips a month."}
              </p>
            </Link>
          )}

          {companyName && (
            <div className="flex items-center gap-3 rounded-3xl bg-md-surface-container-high p-3">
              <CompanyMark name={companyName} logo={companyLogo} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-md-on-surface">
                  {companyName}
                </p>
                <p className="text-xs text-md-on-surface-variant">
                  {PLAN_LABELS[plan ?? "free"]} plan
                </p>
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          )}
        </div>
      </aside>

      {/* Top app bar (mobil / tablet) */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 bg-md-surface/90 px-4 backdrop-blur-md lg:hidden print:hidden">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
          {companyName ? (
            <CompanyMark name={companyName} logo={companyLogo} />
          ) : (
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              <Calculator className="size-5" />
            </div>
          )}
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[15px] font-semibold text-md-on-surface">
              {companyName ?? "Malta Calculator"}
            </p>
            {plan && (
              <p className="text-xs text-md-on-surface-variant">
                {PLAN_LABELS[plan]} plan
              </p>
            )}
          </div>
        </Link>
        <div className="ml-auto">
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Navigation bar (mobil) */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-30 grid h-20 grid-cols-4 bg-md-surface-container pb-[env(safe-area-inset-bottom)] lg:hidden print:hidden"
      >
        {NAV_ITEMS.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="flex flex-col items-center justify-center gap-1"
            >
              <span
                className={cn(
                  "flex h-8 w-16 items-center justify-center rounded-full transition-colors",
                  active
                    ? "bg-md-secondary-container text-md-on-secondary-container"
                    : "text-md-on-surface-variant",
                )}
              >
                <Icon className="size-6" strokeWidth={active ? 2.2 : 1.8} />
              </span>
              <span
                className={cn(
                  "text-xs",
                  active
                    ? "font-semibold text-md-on-surface"
                    : "font-medium text-md-on-surface-variant",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* FAB (mobil) */}
      {!onWizard && (
        <Link
          href="/payslip/new"
          aria-label="New payslip"
          className="fixed bottom-24 right-4 z-30 flex size-14 items-center justify-center rounded-2xl bg-md-primary-container text-md-on-primary-container shadow-md-3 lg:hidden print:hidden"
        >
          <Plus className="size-6" />
        </Link>
      )}
    </>
  );
}
