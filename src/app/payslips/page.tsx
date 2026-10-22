import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  FileText,
  Pencil,
  Plus,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCompany, getPayslips } from "@/app/actions/payslip-actions";
import { PAYSLIP_STATUS, type PayslipStatus } from "@/utils/payslip-details";
import {
  Avatar,
  EmptyState,
  MdCard,
  PageHeader,
  formatEuro,
  mdButton,
  mdInput,
} from "@/components/admin/admin-ui";
import PayslipStatusChip from "@/components/admin/payslip-status-chip";

const FILTERS: { label: string; value?: PayslipStatus }[] = [
  { label: "All" },
  { label: "Drafts", value: PAYSLIP_STATUS.DRAFT },
  { label: "Issued", value: PAYSLIP_STATUS.FINAL },
  { label: "Void", value: PAYSLIP_STATUS.VOID },
];

export default async function PayslipsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
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
  const query = params.q?.trim() ?? "";
  const allPayslips = await getPayslips(status);

  // Çalışan adı / kodu / pozisyonuna göre basit arama
  const needle = query.toLowerCase();
  const payslips = needle
    ? allPayslips.filter((p) =>
        [p.employee.name, p.employee.employee_code, p.employee.position]
          .filter(Boolean)
          .some((v) => v!.toLowerCase().includes(needle)),
      )
    : allPayslips;

  // Dönemlere göre grupla (en yeni dönem üstte)
  const groups = new Map<string, typeof payslips>();
  for (const payslip of payslips) {
    const key = new Date(
      payslip.period_year,
      payslip.period_month - 1,
    ).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    groups.set(key, [...(groups.get(key) ?? []), payslip]);
  }

  const filterHref = (value?: PayslipStatus): string => {
    const qs = new URLSearchParams();
    if (value) qs.set("status", value);
    if (query) qs.set("q", query);
    const str = qs.toString();
    return str ? `/payslips?${str}` : "/payslips";
  };

  return (
    <>
      <PageHeader
        title="Payslips"
        description={`${allPayslips.length} payslip${allPayslips.length === 1 ? "" : "s"}${status ? ` · ${FILTERS.find((f) => f.value === status)?.label.toLowerCase()}` : ""}`}
        actions={
          <Link href="/payslip/new" className={mdButton()}>
            <Plus />
            New payslip
          </Link>
        }
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist">
          {FILTERS.map((filter) => {
            const active = status === filter.value;
            return (
              <Link
                key={filter.label}
                href={filterHref(filter.value)}
                role="tab"
                aria-selected={active}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition",
                  active
                    ? "border-transparent bg-md-secondary-container text-md-on-secondary-container"
                    : "border-md-outline-variant text-md-on-surface-variant hover:bg-md-on-surface/[0.06]",
                )}
              >
                {active && <Check className="size-4" />}
                {filter.label}
              </Link>
            );
          })}
        </div>

        <form action="/payslips" className="relative sm:w-72">
          {status && <input type="hidden" name="status" value={status} />}
          <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-md-on-surface-variant" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search employee"
            aria-label="Search payslips by employee"
            className={cn(mdInput, "h-11 rounded-full pl-11")}
          />
        </form>
      </div>

      {payslips.length === 0 ? (
        <MdCard>
          <EmptyState
            icon={<FileText />}
            title={
              query
                ? `No payslips match “${query}”`
                : status === PAYSLIP_STATUS.DRAFT
                  ? "No drafts"
                  : "No payslips yet"
            }
            description={
              query
                ? "Try another name or clear the search."
                : status === PAYSLIP_STATUS.DRAFT
                  ? "Save a payslip as a draft to review it before issuing."
                  : "Payslips you create will show up here, grouped by pay period."
            }
            action={
              query ? (
                <Link
                  href={filterHref(status)}
                  className={mdButton({ variant: "outlined" })}
                >
                  Clear search
                </Link>
              ) : (
                <Link href="/payslip/new" className={mdButton()}>
                  <Plus />
                  Create payslip
                </Link>
              )
            }
          />
        </MdCard>
      ) : (
        <div className="space-y-8">
          {[...groups.entries()].map(([period, items]) => {
            const totalNet = items.reduce((sum, p) => sum + p.net_salary, 0);
            return (
              <section key={period}>
                <div className="mb-3 flex items-baseline justify-between px-2">
                  <h2 className="text-sm font-medium text-md-on-surface">
                    {period}
                  </h2>
                  <p className="text-xs text-md-on-surface-variant">
                    {items.length} payslip{items.length === 1 ? "" : "s"} · Net{" "}
                    {formatEuro(totalNet)}
                  </p>
                </div>
                <MdCard className="overflow-hidden">
                  <ul className="divide-y divide-md-outline-variant/50">
                    {items.map((payslip) => {
                      const isDraft = payslip.status === PAYSLIP_STATUS.DRAFT;
                      return (
                        <li
                          key={payslip.id}
                          className="flex flex-wrap items-center gap-4 px-5 py-4 transition hover:bg-md-on-surface/[0.03]"
                        >
                          <Avatar name={payslip.employee.name} />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate text-sm font-medium text-md-on-surface">
                                {payslip.employee.name}
                              </p>
                              <PayslipStatusChip status={payslip.status} />
                            </div>
                            <p className="mt-0.5 text-[13px] text-md-on-surface-variant">
                              {payslip.employee.position || "—"} · Gross{" "}
                              {formatEuro(payslip.gross_salary)} · Updated{" "}
                              {new Date(payslip.updated_at).toLocaleDateString(
                                "en-GB",
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-3">
                            <div className="mr-2 text-right">
                              <p className="text-sm font-semibold tabular-nums text-md-on-surface">
                                {formatEuro(payslip.net_salary)}
                              </p>
                              <p className="text-xs text-md-on-surface-variant">
                                Net pay
                              </p>
                            </div>
                            {isDraft && (
                              <Link
                                href={`/payslip/new?draft=${payslip.id}`}
                                aria-label={`Edit draft for ${payslip.employee.name}`}
                                className="flex size-10 items-center justify-center rounded-full text-md-on-surface-variant transition hover:bg-md-on-surface/[0.08]"
                              >
                                <Pencil className="size-[18px]" />
                              </Link>
                            )}
                            <Link
                              href={`/payslip/${payslip.id}`}
                              className={mdButton({
                                variant: isDraft ? "tonal" : "text",
                                size: "sm",
                              })}
                            >
                              {isDraft ? "Review" : "View"}
                              <ChevronRight />
                            </Link>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </MdCard>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
