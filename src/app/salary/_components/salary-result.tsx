"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { YearEndTaxPosition } from "@/utils/salary-calculator";
import { SegmentedControl } from "@/components/salary/segmented-control";
import type { SalarySearchParams } from "../search-params";
import {
  type SalaryTotals,
  formatEuro,
  formatEuroWhole,
  formatPercent,
  resultNote,
  shareOf,
} from "../_lib/salary-view";
import { AnimatedCounter } from "./animated-counter";
import { SalaryShareButtons } from "./salary-share-buttons";
import type { ResultView } from "./salary-calculator";

const viewOptions = [
  { value: "month", label: "Monthly" },
  { value: "year", label: "Yearly" },
] as const;

interface Props {
  view: ResultView;
  onViewChange: (view: ResultView) => void;
  totals: SalaryTotals;
  monthsWorked: number;
  bandRate: number;
  yearEndPosition: YearEndTaxPosition | null;
  params: SalarySearchParams;
}

export const SalaryResult = React.forwardRef<HTMLElement, Props>(
  function SalaryResult(
    {
      view,
      onViewChange,
      totals,
      monthsWorked,
      bandRate,
      yearEndPosition,
      params,
    },
    ref,
  ) {
    // Hareket azaltma tercihi yalnızca istemcide bilinir (hidrasyon farkı olmasın)
    const [reduceMotion, setReduceMotion] = React.useState(false);
    React.useEffect(() => {
      setReduceMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      );
    }, []);
    const partYear = monthsWorked < 12;
    const divisor = view === "month" ? monthsWorked : 1;
    const figure = Math.max(0, totals.paid / divisor);
    const unit =
      view === "month"
        ? partYear
          ? "per month worked"
          : "per month"
        : partYear
          ? "this year"
          : "per year";
    const otherPaid =
      view === "month" ? totals.paid : totals.paid / monthsWorked;
    const otherUnit =
      view === "month"
        ? partYear
          ? `over ${monthsWorked} ${monthsWorked === 1 ? "month" : "months"}`
          : "a year"
        : partYear
          ? "a month worked"
          : "a month";

    const segments = [
      {
        key: "net",
        share: shareOf(totals.paid, totals),
        className: "bg-success rounded-l-full",
      },
      {
        key: "tax",
        share: shareOf(totals.tax, totals),
        className: "bg-warning",
      },
      {
        key: "ssc",
        share: shareOf(totals.ssc, totals),
        className: "bg-secondary rounded-r-full",
      },
    ];

    const lines = [
      {
        label: "Gross pay",
        value: formatEuro(totals.grossPay / divisor),
        dot: "border-2 border-field",
      },
      {
        label: "Income tax",
        value: `−${formatEuro(totals.tax / divisor)}`,
        dot: "bg-warning",
      },
      {
        label: "Social security (SSC)",
        value: `−${formatEuro(totals.ssc / divisor)}`,
        dot: "bg-secondary",
      },
    ];

    return (
      <aside
        ref={ref}
        id="salary-result"
        aria-label="Your result"
        className="flex scroll-mt-4 flex-col gap-4 rounded-[20px] border bg-card p-[18px] shadow-[var(--shadow-elevation)] md:sticky md:top-4 md:rounded-3xl md:p-[22px] lg:top-6 lg:gap-5 lg:p-7"
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Take-home pay
          </h2>
          <SegmentedControl
            ariaLabel="Show amounts"
            options={viewOptions}
            value={view}
            onChange={onViewChange}
            itemClassName="h-[38px] px-3 text-[13px] sm:h-[30px]"
          />
        </div>

        <div className="flex flex-col gap-1 lg:gap-1.5">
          <div className="flex flex-wrap items-baseline gap-x-2 lg:gap-x-2.5">
            <span
              aria-hidden="true"
              className="text-[42px] font-bold leading-[1.1] tracking-[-0.03em] tabular-nums md:text-[38px] lg:text-[52px] lg:leading-[1.05]"
            >
              {reduceMotion ? (
                formatEuro(figure)
              ) : (
                <AnimatedCounter value={figure} prefix="€" decimals={2} />
              )}
            </span>
            <span
              aria-hidden="true"
              className="text-[15px] text-muted-foreground lg:text-base"
            >
              {unit}
            </span>
            <span className="sr-only" aria-live="polite">
              {`${formatEuro(figure)} ${unit}`}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatEuro(otherPaid)} {otherUnit} · you keep{" "}
            <strong className="font-semibold text-success">
              {formatPercent(shareOf(totals.paid, totals))}
            </strong>
          </p>
        </div>

        <div aria-hidden="true" className="flex h-2.5 gap-[3px]">
          {segments.map((segment) => (
            <span
              key={segment.key}
              className={cn(
                "basis-0 transition-[flex-grow] duration-300",
                segment.className,
              )}
              style={{ flexGrow: segment.share, flexShrink: 1 }}
            />
          ))}
        </div>

        <dl className="flex flex-col text-[15px] tabular-nums">
          {lines.map((line) => (
            <div
              key={line.label}
              className="flex h-11 items-center justify-between border-b"
            >
              <dt className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className={cn("h-2.5 w-2.5 rounded-full", line.dot)}
                />
                {line.label}
              </dt>
              <dd className="font-medium">{line.value}</dd>
            </div>
          ))}
          <div className="flex h-12 items-center justify-between">
            <dt className="flex items-center gap-2.5 font-semibold">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full bg-success"
              />
              Take-home pay
            </dt>
            <dd className="text-base font-bold">
              {formatEuro(totals.paid / divisor)}
            </dd>
          </div>
        </dl>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-xl bg-muted px-3 py-2.5">
            <div className="text-xs text-muted-foreground">
              Effective tax rate
            </div>
            <div className="text-[17px] font-semibold tabular-nums lg:text-lg">
              {formatPercent(shareOf(totals.tax, totals))}
            </div>
          </div>
          <div className="rounded-xl bg-muted px-3 py-2.5">
            <div className="text-xs text-muted-foreground">Your tax band</div>
            <div className="text-[17px] font-semibold tabular-nums lg:text-lg">
              {Math.round(bandRate * 100)}%
            </div>
          </div>
        </div>

        {yearEndPosition ? (
          <div className="flex flex-col gap-2 rounded-xl border px-4 py-3.5 text-[13px] tabular-nums">
            <span className="text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              Year-end tax position
            </span>
            {[
              [
                "Taxable income this year (all employers)",
                yearEndPosition.annualTaxableIncome,
              ],
              [
                "Actual tax due for the year",
                yearEndPosition.annualTaxLiability,
              ],
              [
                "FSS tax withheld (all employers)",
                yearEndPosition.totalTaxWithheld,
              ],
            ].map(([label, value]) => (
              <div
                key={label as string}
                className="flex items-baseline justify-between gap-3"
              >
                <span className="min-w-0 flex-1 text-muted-foreground">
                  {label}
                </span>
                <span className="shrink-0 font-medium">
                  {formatEuroWhole(value as number)}
                </span>
              </div>
            ))}
            {Math.abs(yearEndPosition.balance) >= 1 ? (
              <div className="flex items-baseline justify-between gap-3 border-t pt-2 text-sm font-semibold">
                <span className="min-w-0 flex-1">
                  {yearEndPosition.balance < 0
                    ? "Estimated refund via tax return"
                    : "Estimated balance due via tax return"}
                </span>
                <span
                  className={cn(
                    "shrink-0",
                    yearEndPosition.balance < 0
                      ? "text-success"
                      : "text-destructive",
                  )}
                >
                  {formatEuroWhole(Math.abs(yearEndPosition.balance))}
                </span>
              </div>
            ) : null}
          </div>
        ) : null}

        <p className="flex gap-2 text-[13px] leading-normal text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{resultNote(totals)}</span>
        </p>

        <SalaryShareButtons
          monthlyNet={totals.paid / monthsWorked}
          annualNet={totals.paid}
          calculatorParams={params}
        />

        <Link
          href="/sign-up"
          className="flex min-h-11 items-center justify-between gap-2.5 border-t pt-3 text-sm font-semibold text-primary-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span>Employer? Generate payslips for your team</span>
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </Link>
      </aside>
    );
  },
);
