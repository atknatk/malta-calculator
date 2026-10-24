"use client";

import * as React from "react";
import { ChevronDown, Columns3 } from "lucide-react";
import type {
  Month,
  MonthlySalaryOutput,
} from "@/types/salary-calculator-type";
import { cn } from "@/lib/utils";
import { MoneyField } from "@/components/salary/money-field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BREAKDOWN_COLUMNS,
  type BreakdownColumnKey,
  DESKTOP_DEFAULT_COLUMNS,
  MONTHS,
  TABLET_DEFAULT_COLUMNS,
  columnTotal,
  columnValue,
  formatEuro,
  partialMonthLabel,
} from "../_lib/salary-view";

// Tabloda gri gösterilen ara değer sütunları
const MUTED_COLUMNS = new Set<BreakdownColumnKey>([
  "gov",
  "nonTax",
  "taxBen",
  "base",
  "s",
  "inc",
  "cum",
  "t",
]);
// Tablette ilk 4, mobilde ilk 3 ay; geri kalanı "Show all" ile
const TABLET_ROWS = 4;
const MOBILE_ROWS = 3;

const defaultColumns = (): BreakdownColumnKey[] =>
  typeof window !== "undefined" && window.innerWidth < 1024
    ? TABLET_DEFAULT_COLUMNS
    : DESKTOP_DEFAULT_COLUMNS;

interface Props {
  data: MonthlySalaryOutput[];
  year: string;
  startDate?: Date;
  wageOverrides: (number | null)[];
  bonuses: Partial<Record<Month, number>>;
  onWageChange: (index: number, wage: number) => void;
  onBonusChange: (month: Month, amount: number) => void;
  onResetEdits: () => void;
}

function StatutoryTag({ amount }: { amount: number }) {
  return (
    <span
      title="Statutory bonus this month"
      className="whitespace-nowrap rounded-full border border-secondary/40 px-[7px] text-[11px] font-semibold leading-[18px] text-secondary-ink"
    >
      +{formatEuro(amount)}
    </span>
  );
}

export function SalaryBreakdown({
  data,
  year,
  startDate,
  wageOverrides,
  bonuses,
  onWageChange,
  onBonusChange,
  onResetEdits,
}: Props) {
  const [columns, setColumns] = React.useState<BreakdownColumnKey[]>(
    DESKTOP_DEFAULT_COLUMNS,
  );
  const [columnsOpen, setColumnsOpen] = React.useState(false);
  const [showAll, setShowAll] = React.useState(false);
  const [openMonth, setOpenMonth] = React.useState(-1);

  // Tablette varsayılan sütunlar daha az (mount sonrası; SSR masaüstü varsayılanıyla)
  React.useEffect(() => setColumns(defaultColumns()), []);

  const visible = BREAKDOWN_COLUMNS.filter((c) => columns.includes(c.key));
  const hasEdits = wageOverrides.some((wage) => wage !== null);
  const totalPaid = columnTotal(data, "paid") ?? 0;

  const toggleColumn = (key: BreakdownColumnKey) =>
    setColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );

  const renderCell = (
    row: MonthlySalaryOutput,
    index: number,
    key: BreakdownColumnKey,
  ) => {
    const active = row.employmentRatio > 0;
    const month = MONTHS[index];
    if (key === "wage") {
      return (
        <MoneyField
          id={`wage-${index}`}
          size="sm"
          prefix={null}
          value={row.grossWage}
          emptyWhenZero={!active}
          disabled={!active}
          onValueChange={(value) => onWageChange(index, value)}
          aria-label={`Gross wage in ${month}`}
        />
      );
    }
    if (key === "bonus") {
      return (
        <MoneyField
          id={`bonus-cell-${index}`}
          size="sm"
          prefix={null}
          value={bonuses[month] ?? 0}
          emptyWhenZero
          placeholder="0.00"
          disabled={!active}
          onValueChange={(value) => onBonusChange(month, value)}
          aria-label={`Bonus in ${month}`}
        />
      );
    }
    return formatEuro(columnValue(row, key));
  };

  return (
    <section
      aria-labelledby="breakdown-heading"
      className="mt-10 flex flex-col gap-3 md:mt-12 lg:mt-14 lg:gap-4"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2
            id="breakdown-heading"
            className="font-cal text-[22px] leading-[1.33] lg:text-2xl"
          >
            Monthly breakdown
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="md:hidden">
              Tap a month to edit its wage or bonus. A new wage carries on to
              later months.
            </span>
            <span className="hidden md:inline">
              Edit a gross wage or bonus below. A new wage carries on to the
              months after it.
            </span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {hasEdits ? (
            <button
              type="button"
              onClick={onResetEdits}
              className="h-11 rounded-[10px] px-2 text-sm font-semibold text-primary-ink transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-10 md:px-3.5"
            >
              Reset edits
            </button>
          ) : null}
          <Popover open={columnsOpen} onOpenChange={setColumnsOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="hidden h-10 items-center gap-2 rounded-[10px] border border-field bg-card px-3.5 text-sm font-semibold transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:inline-flex"
              >
                <Columns3 className="h-4 w-4" aria-hidden="true" />
                Columns
                <span className="text-[13px] font-medium tabular-nums text-muted-foreground">
                  {visible.length} of {BREAKDOWN_COLUMNS.length}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-[280px] rounded-[14px] p-2 shadow-[var(--shadow-elevation)]"
            >
              <div
                role="group"
                aria-label="Visible columns"
                className="flex flex-col"
              >
                {BREAKDOWN_COLUMNS.map((column) => (
                  <label
                    key={column.key}
                    className="flex h-9 cursor-pointer items-center gap-2.5 rounded-lg px-2 text-sm hover:bg-accent"
                  >
                    <input
                      type="checkbox"
                      checked={columns.includes(column.key)}
                      onChange={() => toggleColumn(column.key)}
                      className="h-[18px] w-[18px] accent-primary"
                    />
                    {column.label}
                  </label>
                ))}
                <div className="mt-1.5 flex gap-1.5 border-t pt-2">
                  <button
                    type="button"
                    onClick={() => setColumns(defaultColumns())}
                    className="h-9 flex-1 rounded-lg bg-muted text-[13px] font-semibold hover:bg-accent"
                  >
                    Default
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setColumns(BREAKDOWN_COLUMNS.map((c) => c.key))
                    }
                    className="h-9 flex-1 rounded-lg bg-muted text-[13px] font-semibold hover:bg-accent"
                  >
                    Show all
                  </button>
                  <button
                    type="button"
                    onClick={() => setColumnsOpen(false)}
                    className="h-9 flex-1 rounded-lg bg-primary text-[13px] font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Done
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Tablet ve masaüstü: tablo */}
      <div className="hidden overflow-hidden rounded-2xl border bg-card md:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm tabular-nums">
            <caption className="sr-only">Monthly breakdown for {year}</caption>
            <thead>
              <tr className="h-11 bg-muted text-[13px] font-semibold text-muted-foreground">
                <th
                  scope="col"
                  className="sticky left-0 z-[1] w-28 bg-muted pl-4 text-left lg:w-44 lg:pl-5"
                >
                  Month
                </th>
                {visible.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="min-w-24 whitespace-nowrap px-1.5 text-right last:pr-4 lg:min-w-28 lg:last:pr-5"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => {
                const active = row.employmentRatio > 0;
                const part = partialMonthLabel(row, index, startDate);
                return (
                  <tr
                    key={row.month}
                    className={cn(
                      "h-[52px] border-t transition-colors hover:bg-muted/55",
                      !active && "opacity-50",
                      index >= TABLET_ROWS && !showAll && "max-lg:hidden",
                    )}
                  >
                    <th
                      scope="row"
                      className="sticky left-0 z-[1] bg-card pl-4 text-left font-medium leading-tight lg:pl-5"
                    >
                      <span className="flex items-center gap-2">
                        {row.month}
                        {row.governmentBonus > 0 ? (
                          <StatutoryTag amount={row.governmentBonus} />
                        ) : null}
                      </span>
                      {part ? (
                        <span className="block text-xs font-normal text-muted-foreground">
                          {part}
                        </span>
                      ) : null}
                    </th>
                    {visible.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          "px-1.5 text-right last:pr-4 lg:last:pr-5",
                          MUTED_COLUMNS.has(column.key) &&
                            "text-muted-foreground",
                          column.key === "paid" && "font-semibold",
                        )}
                      >
                        {renderCell(row, index, column.key)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="h-[52px] border-t font-semibold">
                <th
                  scope="row"
                  className="sticky left-0 z-[1] bg-card pl-4 text-left lg:pl-5"
                >
                  Total {year}
                </th>
                {visible.map((column) => {
                  const total = columnTotal(data, column.key);
                  return (
                    <td
                      key={column.key}
                      className={cn(
                        "px-1.5 text-right last:pr-4 lg:last:pr-5",
                        column.key === "paid" && "text-success",
                      )}
                    >
                      {total === null ? "—" : formatEuro(total)}
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
        <button
          type="button"
          aria-expanded={showAll}
          onClick={() => setShowAll((value) => !value)}
          className="flex h-12 w-full items-center justify-center gap-2 border-t text-sm font-semibold text-primary-ink hover:bg-muted/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring lg:hidden"
        >
          {showAll ? "Show fewer months" : "Show all 12 months"}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              showAll && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Mobil: açılır ay kartları */}
      <div className="overflow-hidden rounded-2xl border bg-card tabular-nums md:hidden">
        {data.map((row, index) => {
          const active = row.employmentRatio > 0;
          const month = MONTHS[index];
          const part = partialMonthLabel(row, index, startDate);
          const isOpen = openMonth === index;
          const daysInMonth = new Date(parseInt(year), index + 1, 0).getDate();
          const lines: [string, string][] = [];
          if (part) {
            const days = Math.round(row.employmentRatio * daysInMonth);
            lines.push([
              "Days worked",
              `${days} of ${daysInMonth} · SSC for ${row.sscWeeks} ${row.sscWeeks === 1 ? "week" : "weeks"}`,
            ]);
          }
          if (row.governmentBonus > 0)
            lines.push(["Statutory bonus", formatEuro(row.governmentBonus)]);
          if (row.nonTaxBenefit + row.taxBenefit > 0)
            lines.push([
              "Benefits",
              formatEuro(row.nonTaxBenefit + row.taxBenefit),
            ]);
          lines.push(
            ["Gross total", formatEuro(row.grossTotal)],
            ["Social security (SSC)", `−${formatEuro(row.sscTax)}`],
            ["Income tax", `−${formatEuro(row.incomeTax)}`],
            ["Net", formatEuro(row.net)],
          );

          return (
            <div
              key={row.month}
              className={cn(
                "border-b",
                !active && "opacity-50",
                index >= MOBILE_ROWS && !showAll && "hidden",
              )}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`month-panel-${index}`}
                onClick={() => setOpenMonth(isOpen ? -1 : index)}
                className="flex min-h-16 w-full items-center gap-3 px-4 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="flex items-center gap-2 text-[15px] font-semibold">
                    {month}
                    {row.governmentBonus > 0 ? (
                      <StatutoryTag amount={row.governmentBonus} />
                    ) : null}
                  </span>
                  <span className="text-[13px] text-muted-foreground">
                    Gross {formatEuro(row.grossTotal)}
                    {part ? ` · ${part.toLowerCase()}` : ""}
                  </span>
                </span>
                <span className="text-base font-semibold">
                  {formatEuro(row.paid)}
                </span>
                <ChevronDown
                  className={cn(
                    "h-[18px] w-[18px] shrink-0 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </button>
              {isOpen ? (
                <div
                  id={`month-panel-${index}`}
                  className="flex flex-col gap-3 px-4 pb-4"
                >
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor={`m-wage-${index}`}
                        className="text-[13px] font-semibold"
                      >
                        Gross wage
                      </label>
                      <MoneyField
                        id={`m-wage-${index}`}
                        value={row.grossWage}
                        prefix={null}
                        emptyWhenZero={!active}
                        disabled={!active}
                        onValueChange={(value) => onWageChange(index, value)}
                        className="h-11 px-3"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor={`m-bonus-${index}`}
                        className="text-[13px] font-semibold"
                      >
                        Bonus
                      </label>
                      <MoneyField
                        id={`m-bonus-${index}`}
                        value={bonuses[month] ?? 0}
                        prefix={null}
                        emptyWhenZero
                        placeholder="0.00"
                        disabled={!active}
                        onValueChange={(value) => onBonusChange(month, value)}
                        className="h-11 px-3"
                      />
                    </div>
                  </div>
                  <dl className="flex flex-col text-sm">
                    {lines.map(([label, value]) => (
                      <div key={label} className="flex justify-between py-1.5">
                        <dt className="text-muted-foreground">{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                    <div className="mt-1 flex justify-between border-t pt-2 font-semibold">
                      <dt>Paid</dt>
                      <dd>{formatEuro(row.paid)}</dd>
                    </div>
                  </dl>
                </div>
              ) : null}
            </div>
          );
        })}
        <div className="flex justify-between border-b px-4 py-3.5 font-semibold">
          <span>Total {year}</span>
          <span className="text-success">{formatEuro(totalPaid)}</span>
        </div>
        <button
          type="button"
          aria-expanded={showAll}
          onClick={() => setShowAll((value) => !value)}
          className="flex h-[52px] w-full items-center justify-center gap-2 text-[15px] font-semibold text-primary-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        >
          {showAll ? "Show fewer months" : "Show all 12 months"}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              showAll && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>
      </div>

      <p className="text-[13px] text-muted-foreground">
        Income tax is withheld under the Final Settlement System (FSS), so
        months with a bonus or five paid weeks differ. Paid adds the untaxed
        half of any allowance to net pay.
      </p>
    </section>
  );
}
