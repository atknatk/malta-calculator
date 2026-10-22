"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  FilePlus2,
  Loader2,
  Send,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BulkPayslipRow } from "@/app/actions/payslip-actions";
import type {
  PayslipSSCCategory,
  PayslipSalaryConfig,
  PayslipTaxType,
} from "@/lib/payslip/compute";
import { PAYSLIP_STATUS } from "@/utils/payslip-details";
import {
  Avatar,
  CardHeader,
  MdCard,
  StatusChip,
  formatEuro,
  mdButton,
  mdInput,
} from "@/components/admin/admin-ui";
import PayslipStatusChip from "@/components/admin/payslip-status-chip";

interface BulkPayslipFlowProps {
  period: { month: number; year: number };
  rows: BulkPayslipRow[];
  issueRemaining: number;
  issueLimit: number;
}

interface RowInput {
  annualGross: string;
  /** "taxType:childCount" */
  taxStatus: string;
  sscCategory: PayslipSSCCategory;
  bonus: string;
  allowance: string;
}

interface ItemResult {
  employeeId?: string;
  payslipId?: string;
  success: boolean;
  error?: string;
}

const MONTH_NAMES = Array.from({ length: 12 }, (_, i) =>
  new Date(2000, i).toLocaleDateString("en-GB", { month: "long" }),
);

const TAX_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "single:0", label: "Single" },
  { value: "married:0", label: "Married" },
  { value: "married:1", label: "Married · 1 child" },
  { value: "married:2", label: "Married · 2+ children" },
  { value: "parent:0", label: "Parent" },
  { value: "parent:1", label: "Parent · 1 child" },
  { value: "parent:2", label: "Parent · 2+ children" },
];

const SSC_OPTIONS: { value: PayslipSSCCategory; label: string }[] = [
  { value: "C", label: "C · Full-time" },
  { value: "B", label: "B · Part-time" },
  { value: "A", label: "A · Under 18" },
  { value: "D", label: "D" },
];

const cellInput = cn(mdInput, "h-10 min-w-0 rounded-lg px-3 tabular-nums");
const cellSelect = cn(mdInput, "h-10 rounded-lg px-2");

function initialInput(defaults: PayslipSalaryConfig | null): RowInput {
  return {
    annualGross: defaults?.annualGross ? String(defaults.annualGross) : "",
    taxStatus: `${defaults?.taxType ?? "single"}:${defaults?.childCount ?? 0}`,
    sscCategory: defaults?.sscCategory ?? "C",
    bonus: "",
    allowance: "",
  };
}

const toAmount = (value: string): number => {
  const n = parseFloat(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

function Checkbox({
  checked,
  indeterminate,
  disabled,
  onChange,
  label,
}: {
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}): JSX.Element {
  return (
    <input
      type="checkbox"
      aria-label={label}
      checked={checked}
      disabled={disabled}
      ref={(el) => {
        if (el) el.indeterminate = !!indeterminate && !checked;
      }}
      onChange={(e) => onChange(e.target.checked)}
      className="size-[18px] shrink-0 cursor-pointer rounded accent-md-primary disabled:cursor-not-allowed disabled:opacity-30"
    />
  );
}

function ResultBanner({
  tone,
  children,
  onClose,
}: {
  tone: "success" | "error";
  children: ReactNode;
  onClose: () => void;
}): JSX.Element {
  return (
    <div
      role="status"
      className={cn(
        "mx-6 mb-4 flex items-start gap-3 rounded-2xl px-4 py-3 text-sm",
        tone === "success"
          ? "bg-md-success-container text-md-on-success-container"
          : "bg-md-error-container text-md-on-error-container",
      )}
    >
      {tone === "success" ? (
        <CheckCircle2 className="mt-0.5 size-[18px] shrink-0" />
      ) : (
        <AlertTriangle className="mt-0.5 size-[18px] shrink-0" />
      )}
      <div className="min-w-0 flex-1">{children}</div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss"
        className="rounded-full p-0.5 opacity-70 hover:opacity-100"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export default function BulkPayslipFlow({
  period,
  rows,
  issueRemaining,
  issueLimit,
}: BulkPayslipFlowProps): JSX.Element {
  const router = useRouter();
  const now = new Date();
  const nameById = useMemo(
    () => new Map(rows.map((r) => [r.employee.id, r.employee.name])),
    [rows],
  );
  // Yayınlanınca satır taslak listesinden çıkar; sonuçlar için ada payslip
  // id'sinden ulaş
  const nameByPayslipId = useMemo(
    () =>
      new Map(
        rows
          .filter((r) => r.current)
          .map((r) => [r.current!.id, r.employee.name]),
      ),
    [rows],
  );

  // ---- Adım 1: taslak hazırlama ----
  const [inputs, setInputs] = useState<Record<string, RowInput>>(() =>
    Object.fromEntries(
      rows.map((r) => [r.employee.id, initialInput(r.defaults)]),
    ),
  );
  const preparable = rows.filter(
    (r) => r.current?.status !== PAYSLIP_STATUS.FINAL,
  );
  const [selected, setSelected] = useState<Set<string>>(
    () =>
      new Set(
        preparable
          .filter((r) => r.current === null && r.defaults?.annualGross)
          .map((r) => r.employee.id),
      ),
  );
  const [saving, setSaving] = useState(false);
  const [draftResults, setDraftResults] = useState<ItemResult[] | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);

  // ---- Adım 2: inceleme ve yayınlama ----
  const drafts = rows.filter(
    (r) => r.current?.status === PAYSLIP_STATUS.DRAFT,
  );
  const issuedCount = rows.filter(
    (r) => r.current?.status === PAYSLIP_STATUS.FINAL,
  ).length;
  const [toIssue, setToIssue] = useState<Set<string>>(
    () => new Set(drafts.map((r) => r.current!.id)),
  );
  const [confirming, setConfirming] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [issueResults, setIssueResults] = useState<ItemResult[] | null>(null);
  const [issueError, setIssueError] = useState<string | null>(null);

  // Yenilenen taslak listesinde artık olmayan seçimleri yok say
  const issueIds = drafts
    .map((r) => r.current!.id)
    .filter((id) => toIssue.has(id));
  const draftTotals = drafts
    .filter((r) => toIssue.has(r.current!.id))
    .reduce(
      (sum, r) => ({
        gross: sum.gross + r.current!.gross,
        tax: sum.tax + r.current!.incomeTax,
        ssc: sum.ssc + r.current!.sscEmployee,
        net: sum.net + r.current!.net,
      }),
      { gross: 0, tax: 0, ssc: 0, net: 0 },
    );

  const updateInput = (id: string, patch: Partial<RowInput>): void =>
    setInputs((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const toggle = (
    set: Set<string>,
    setter: (s: Set<string>) => void,
    id: string,
    on: boolean,
  ): void => {
    const next = new Set(set);
    if (on) next.add(id);
    else next.delete(id);
    setter(next);
  };

  const changePeriod = (month: number, year: number): void => {
    router.push(`/payslips/bulk?month=${month}&year=${year}`);
  };

  const selectedRows = preparable.filter((r) => selected.has(r.employee.id));
  const missingSalary = selectedRows.filter(
    (r) => toAmount(inputs[r.employee.id].annualGross) <= 0,
  );

  const handleSaveDrafts = async (): Promise<void> => {
    setSaving(true);
    setDraftError(null);
    setDraftResults(null);
    try {
      const items = selectedRows.map((r) => {
        const input = inputs[r.employee.id];
        const [taxType, childCount] = input.taxStatus.split(":");
        return {
          employeeId: r.employee.id,
          salaryConfig: {
            // Başlangıç tarihi, doğum yılı, önceki işveren vb. son bordrodan
            ...(r.defaults ?? { birthYear: 1990 }),
            annualGross: toAmount(input.annualGross),
            taxType: taxType as PayslipTaxType,
            childCount: Number(childCount),
            sscCategory: input.sscCategory,
          },
          bonus: toAmount(input.bonus),
          allowance: toAmount(input.allowance),
        };
      });

      const response = await fetch("/api/payslip/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "draft",
          periodMonth: period.month,
          periodYear: period.year,
          items,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        setDraftError(data.error || "Failed to save drafts");
        return;
      }
      const results = data.results as ItemResult[];
      setDraftResults(results);
      // Kaydedilenler incelemeye geçer: yayınlama listesine ekle
      setToIssue((prev) => {
        const next = new Set(prev);
        results.forEach((r) => r.success && r.payslipId && next.add(r.payslipId));
        return next;
      });
      setSelected(
        new Set(results.filter((r) => !r.success).map((r) => r.employeeId!)),
      );
      router.refresh();
    } catch {
      setDraftError("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleIssue = async (): Promise<void> => {
    setIssuing(true);
    setIssueError(null);
    setIssueResults(null);
    try {
      const response = await fetch("/api/payslip/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "issue", payslipIds: issueIds }),
      });
      const data = await response.json();
      if (!data.success) {
        setIssueError(data.error || "Failed to issue payslips");
        return;
      }
      setIssueResults(data.results as ItemResult[]);
      router.refresh();
    } catch {
      setIssueError("An error occurred");
    } finally {
      setIssuing(false);
      setConfirming(false);
    }
  };

  const years = Array.from(
    { length: 3 },
    (_, i) => now.getFullYear() - 2 + i,
  );
  const periodLabel = `${MONTH_NAMES[period.month - 1]} ${period.year}`;
  const allPreparableSelected =
    preparable.length > 0 && selectedRows.length === preparable.length;
  const allDraftsSelected =
    drafts.length > 0 && issueIds.length === drafts.length;
  const willIssue = Math.min(issueIds.length, issueRemaining);

  return (
    <div className="space-y-6">
      {/* Dönem */}
      <MdCard variant="filled" className="flex flex-wrap items-center gap-4 p-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-md-primary-container text-md-on-primary-container">
            <CalendarDays className="size-5" />
          </div>
          <div>
            <p className="text-[13px] text-md-on-surface-variant">Pay period</p>
            <p className="text-base font-medium text-md-on-surface">
              {periodLabel}
            </p>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <select
            aria-label="Month"
            value={period.month}
            onChange={(e) => changePeriod(Number(e.target.value), period.year)}
            className={cn(cellSelect, "w-36")}
          >
            {MONTH_NAMES.map((name, i) => (
              <option
                key={name}
                value={i + 1}
                disabled={new Date(period.year, i) > now}
              >
                {name}
              </option>
            ))}
          </select>
          <select
            aria-label="Year"
            value={period.year}
            onChange={(e) => {
              const year = Number(e.target.value);
              const month =
                year === now.getFullYear()
                  ? Math.min(period.month, now.getMonth() + 1)
                  : period.month;
              changePeriod(month, year);
            }}
            className={cn(cellSelect, "w-24")}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="flex w-full flex-wrap gap-2 text-[13px] text-md-on-surface-variant">
          <StatusChip>{rows.length} employees</StatusChip>
          <StatusChip tone="warning">{drafts.length} drafts</StatusChip>
          <StatusChip tone="success">{issuedCount} issued</StatusChip>
        </div>
      </MdCard>

      {/* 1. Taslak hazırla */}
      <MdCard>
        <CardHeader
          icon={<FilePlus2 />}
          title="1. Prepare drafts"
          subtitle="Salary settings come from each employee's latest payslip. Bonus and allowance are taxed with this month's pay."
        />

        {draftError && (
          <ResultBanner tone="error" onClose={() => setDraftError(null)}>
            {draftError}
          </ResultBanner>
        )}
        {draftResults && (
          <ResultBanner
            tone={draftResults.every((r) => r.success) ? "success" : "error"}
            onClose={() => setDraftResults(null)}
          >
            <p className="font-medium">
              {draftResults.filter((r) => r.success).length} of{" "}
              {draftResults.length} drafts saved. Review them below.
            </p>
            {draftResults
              .filter((r) => !r.success)
              .map((r) => (
                <p key={r.employeeId}>
                  {nameById.get(r.employeeId ?? "") ?? "Employee"}: {r.error}
                </p>
              ))}
          </ResultBanner>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-sm">
            <thead>
              <tr className="border-b border-md-outline-variant/60 text-left text-[12px] font-medium text-md-on-surface-variant">
                <th className="w-12 py-3 pl-6">
                  <Checkbox
                    label="Select all employees"
                    checked={allPreparableSelected}
                    indeterminate={selectedRows.length > 0}
                    disabled={preparable.length === 0}
                    onChange={(on) =>
                      setSelected(
                        on
                          ? new Set(preparable.map((r) => r.employee.id))
                          : new Set(),
                      )
                    }
                  />
                </th>
                <th className="py-3 pr-3">Employee</th>
                <th className="w-36 py-3 pr-3">Annual gross</th>
                <th className="w-48 py-3 pr-3">Tax status</th>
                <th className="w-36 py-3 pr-3">SSC</th>
                <th className="w-28 py-3 pr-3">Bonus</th>
                <th className="w-28 py-3 pr-3">Allowance</th>
                <th className="w-28 py-3 pr-6">This period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-md-outline-variant/40">
              {rows.map((row) => {
                const id = row.employee.id;
                const input = inputs[id];
                const locked = row.current?.status === PAYSLIP_STATUS.FINAL;
                const isSelected = selected.has(id);
                const missing =
                  isSelected && toAmount(input.annualGross) <= 0;
                return (
                  <tr
                    key={id}
                    className={cn(
                      "transition",
                      isSelected && "bg-md-primary/[0.04]",
                      locked && "opacity-60",
                    )}
                  >
                    <td className="py-3 pl-6">
                      <Checkbox
                        label={`Select ${row.employee.name}`}
                        checked={isSelected}
                        disabled={locked}
                        onChange={(on) => toggle(selected, setSelected, id, on)}
                      />
                    </td>
                    <td className="py-3 pr-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar name={row.employee.name} className="size-8 text-xs" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-md-on-surface">
                            {row.employee.name}
                          </p>
                          <p className="truncate text-xs text-md-on-surface-variant">
                            {[row.employee.position, row.employee.employee_code]
                              .filter(Boolean)
                              .join(" · ") || "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="0.01"
                        aria-label={`Annual gross for ${row.employee.name}`}
                        placeholder="€ / year"
                        value={input.annualGross}
                        disabled={locked}
                        onChange={(e) =>
                          updateInput(id, { annualGross: e.target.value })
                        }
                        className={cn(
                          cellInput,
                          missing && "border-md-error focus:border-md-error",
                        )}
                      />
                    </td>
                    <td className="py-3 pr-3">
                      <select
                        aria-label={`Tax status for ${row.employee.name}`}
                        value={input.taxStatus}
                        disabled={locked}
                        onChange={(e) =>
                          updateInput(id, { taxStatus: e.target.value })
                        }
                        className={cn(cellSelect, "w-full")}
                      >
                        {TAX_STATUS_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 pr-3">
                      <select
                        aria-label={`SSC category for ${row.employee.name}`}
                        value={input.sscCategory}
                        disabled={locked}
                        onChange={(e) =>
                          updateInput(id, {
                            sscCategory: e.target.value as PayslipSSCCategory,
                          })
                        }
                        className={cn(cellSelect, "w-full")}
                      >
                        {SSC_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 pr-3">
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="0.01"
                        aria-label={`Bonus for ${row.employee.name}`}
                        placeholder="0.00"
                        value={input.bonus}
                        disabled={locked}
                        onChange={(e) =>
                          updateInput(id, { bonus: e.target.value })
                        }
                        className={cellInput}
                      />
                    </td>
                    <td className="py-3 pr-3">
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="0.01"
                        aria-label={`Allowance for ${row.employee.name}`}
                        placeholder="0.00"
                        value={input.allowance}
                        disabled={locked}
                        onChange={(e) =>
                          updateInput(id, { allowance: e.target.value })
                        }
                        className={cellInput}
                      />
                    </td>
                    <td className="py-3 pr-6">
                      {row.current ? (
                        <PayslipStatusChip status={row.current.status} />
                      ) : row.hasVoided ? (
                        <StatusChip tone="info">Correction</StatusChip>
                      ) : (
                        <span className="text-xs text-md-on-surface-variant">
                          Not started
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-md-outline-variant/60 px-6 py-4">
          <p className="text-[13px] text-md-on-surface-variant">
            {missingSalary.length > 0
              ? `Enter the annual gross for ${missingSalary.length} selected employee${missingSalary.length === 1 ? "" : "s"}.`
              : "Existing drafts for this period are recalculated. Issued payslips are locked."}
          </p>
          <button
            type="button"
            onClick={handleSaveDrafts}
            disabled={
              saving || selectedRows.length === 0 || missingSalary.length > 0
            }
            className={mdButton({ variant: "tonal" })}
          >
            {saving ? <Loader2 className="animate-spin" /> : <FilePlus2 />}
            {saving
              ? "Calculating…"
              : `Save ${selectedRows.length} draft${selectedRows.length === 1 ? "" : "s"}`}
          </button>
        </div>
      </MdCard>

      {/* 2. İncele ve yayınla */}
      <MdCard>
        <CardHeader
          icon={<Send />}
          title="2. Review & issue"
          subtitle={`Drafts for ${periodLabel}. Open one to check the full payslip before issuing.`}
        />

        {issueError && (
          <ResultBanner tone="error" onClose={() => setIssueError(null)}>
            {issueError}
          </ResultBanner>
        )}
        {issueResults && (
          <ResultBanner
            tone={issueResults.every((r) => r.success) ? "success" : "error"}
            onClose={() => setIssueResults(null)}
          >
            <p className="font-medium">
              {issueResults.filter((r) => r.success).length} of{" "}
              {issueResults.length} payslips issued.
            </p>
            {issueResults
              .filter((r) => !r.success)
              .map((r) => (
                <p key={r.payslipId}>
                  {nameByPayslipId.get(r.payslipId ?? "") ?? "Payslip"}: {r.error}
                </p>
              ))}
          </ResultBanner>
        )}

        {drafts.length === 0 ? (
          <p className="px-6 pb-6 pt-2 text-sm text-md-on-surface-variant">
            No drafts for this period yet. Save drafts above to review them
            here.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-md-outline-variant/60 text-right text-[12px] font-medium text-md-on-surface-variant">
                    <th className="w-12 py-3 pl-6 text-left">
                      <Checkbox
                        label="Select all drafts"
                        checked={allDraftsSelected}
                        indeterminate={issueIds.length > 0}
                        onChange={(on) =>
                          setToIssue(
                            on
                              ? new Set(drafts.map((r) => r.current!.id))
                              : new Set(),
                          )
                        }
                      />
                    </th>
                    <th className="py-3 pr-3 text-left">Employee</th>
                    <th className="py-3 pr-3">Gross</th>
                    <th className="py-3 pr-3">Income tax</th>
                    <th className="py-3 pr-3">SSC</th>
                    <th className="py-3 pr-3">Net pay</th>
                    <th className="w-28 py-3 pr-6" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-md-outline-variant/40 tabular-nums">
                  {drafts.map((row) => {
                    const p = row.current!;
                    return (
                      <tr
                        key={p.id}
                        className={cn(toIssue.has(p.id) && "bg-md-primary/[0.04]")}
                      >
                        <td className="py-3 pl-6">
                          <Checkbox
                            label={`Issue payslip for ${row.employee.name}`}
                            checked={toIssue.has(p.id)}
                            onChange={(on) =>
                              toggle(toIssue, setToIssue, p.id, on)
                            }
                          />
                        </td>
                        <td className="py-3 pr-3">
                          <p className="font-medium text-md-on-surface">
                            {row.employee.name}
                          </p>
                          {(p.bonus > 0 || p.allowance > 0) && (
                            <p className="text-xs text-md-on-surface-variant">
                              {[
                                p.bonus > 0 && `Bonus ${formatEuro(p.bonus)}`,
                                p.allowance > 0 &&
                                  `Allowance ${formatEuro(p.allowance)}`,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          )}
                        </td>
                        <td className="py-3 pr-3 text-right">
                          {formatEuro(p.gross)}
                        </td>
                        <td className="py-3 pr-3 text-right text-md-on-surface-variant">
                          {formatEuro(p.incomeTax)}
                        </td>
                        <td className="py-3 pr-3 text-right text-md-on-surface-variant">
                          {formatEuro(p.sscEmployee)}
                        </td>
                        <td className="py-3 pr-3 text-right font-semibold text-md-on-surface">
                          {formatEuro(p.net)}
                        </td>
                        <td className="py-3 pr-6 text-right">
                          <Link
                            href={`/payslip/${p.id}`}
                            className={mdButton({ variant: "text", size: "sm" })}
                          >
                            Review
                            <ChevronRight />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-md-outline-variant/60 text-right font-medium tabular-nums text-md-on-surface">
                    <td className="py-3 pl-6" />
                    <td className="py-3 pr-3 text-left text-[13px] text-md-on-surface-variant">
                      {issueIds.length} selected
                    </td>
                    <td className="py-3 pr-3">{formatEuro(draftTotals.gross)}</td>
                    <td className="py-3 pr-3">{formatEuro(draftTotals.tax)}</td>
                    <td className="py-3 pr-3">{formatEuro(draftTotals.ssc)}</td>
                    <td className="py-3 pr-3 font-semibold">
                      {formatEuro(draftTotals.net)}
                    </td>
                    <td className="py-3 pr-6" />
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-md-outline-variant/60 px-6 py-4">
              <p className="text-[13px] text-md-on-surface-variant">
                {issueRemaining} of {issueLimit} payslips left to issue this
                month.
                {issueIds.length > issueRemaining &&
                  ` Only the first ${issueRemaining} will be issued; the rest stay as drafts.`}
              </p>
              {confirming ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[13px] font-medium text-md-on-surface">
                    Issued payslips are locked and visible to employees.
                  </span>
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    disabled={issuing}
                    className={mdButton({ variant: "text" })}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleIssue}
                    disabled={issuing}
                    className={mdButton()}
                  >
                    {issuing ? <Loader2 className="animate-spin" /> : <Send />}
                    {issuing ? "Issuing…" : `Confirm, issue ${willIssue}`}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  disabled={willIssue === 0}
                  className={mdButton()}
                >
                  <Send />
                  Issue {willIssue} payslip{willIssue === 1 ? "" : "s"}
                </button>
              )}
            </div>
          </>
        )}
      </MdCard>
    </div>
  );
}
