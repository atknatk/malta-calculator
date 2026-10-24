"use client";

import Link from "next/link";
import { useState } from "react";
import { Month } from "@/types/salary-calculator-type";
import {
  getAvailableYears,
  isChildCountEffective,
} from "@/config/malta-tax-config";
import { MoneyField } from "@/components/salary/money-field";
import { SegmentedControl } from "@/components/salary/segmented-control";
import type { SalarySearchParams } from "../search-params";
import { SalaryMoreOptions } from "./salary-more-options";

export type MonthlyBonuses = Partial<Record<Month, number>>;

// Son 3 vergi yılı
const yearOptions = getAvailableYears()
  .slice(-3)
  .map((year) => ({ value: String(year), label: String(year) }));

const statusOptions = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "parent", label: "Parent" },
] as const;

const statusHelp: Record<SalarySearchParams["taxType"], string> = {
  single: "For people who are not married and do not maintain a child.",
  married: "For married couples who opt for joint computation.",
  parent: "For single, separated or widowed parents who maintain a child.",
};

const childOptions = [
  { value: 0, label: "None" },
  { value: 1, label: "1 child" },
  { value: 2, label: "2 or more" },
] as const;

const sscOptions = [
  { value: "C", label: "Full-time" },
  { value: "B", label: "Part-time" },
  { value: "A", label: "Under 18" },
] as const;

function sscHelp(category: SalarySearchParams["sscCategory"], born: number) {
  if (category === "A") return "SSC Category A: a flat €6.62 a week.";
  if (category === "B")
    return "SSC Category B: 10% of your basic wage, up to €22.94 a week.";
  return `SSC Category C: 10% of your basic wage, up to ${born < 1962 ? "€49.04" : "€55.93"} a week.`;
}

const periodOptions = [
  { value: "year", label: "Per year" },
  { value: "month", label: "Per month" },
] as const;

interface Props {
  params: SalarySearchParams;
  bonuses: MonthlyBonuses;
  onParamsChange: (patch: Partial<SalarySearchParams>) => void;
  onSalaryChange: (salary: number) => void;
  onBonusesChange: (bonuses: MonthlyBonuses) => void;
  onResetOptions: () => void;
  switchToNetHref: string;
  monthsWorked: number;
}

export function SalaryForm({
  params,
  bonuses,
  onParamsChange,
  onSalaryChange,
  onBonusesChange,
  onResetOptions,
  switchToNetHref,
}: Props) {
  // Tutar yıllık mı aylık mı girilsin (URL'de her zaman yıllık brüt tutulur)
  const [period, setPeriod] = useState<"year" | "month">("year");
  const year = parseInt(params.year);
  const showChildren =
    isChildCountEffective(year) && params.taxType !== "single";

  return (
    <div className="flex flex-col gap-[22px] rounded-[20px] border bg-card px-[18px] pb-[18px] pt-4 shadow-sm md:gap-6 md:rounded-3xl md:px-6 md:py-5 lg:gap-[26px] lg:px-8 lg:pb-6 lg:pt-7">
      {/* Hesap modu: Net → Gross ayrı sayfada */}
      <div
        role="group"
        aria-label="Calculation"
        className="grid grid-cols-2 gap-1 rounded-[14px] bg-muted p-1"
      >
        <span
          aria-current="page"
          className="flex min-h-[54px] flex-col items-center justify-center gap-px rounded-[10px] bg-card text-foreground shadow-sm lg:min-h-14"
        >
          <span className="text-[15px] font-semibold">Gross → Net</span>
          <span className="text-xs text-muted-foreground">
            From gross salary
          </span>
        </span>
        <Link
          href={switchToNetHref}
          className="flex min-h-[54px] flex-col items-center justify-center gap-px rounded-[10px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:min-h-14"
        >
          <span className="text-[15px] font-semibold">Net → Gross</span>
          <span className="text-xs">From take-home pay</span>
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <span id="tax-year-label" className="text-sm font-semibold">
          Tax year
        </span>
        <SegmentedControl
          labelledBy="tax-year-label"
          options={yearOptions}
          value={params.year}
          onChange={(value) =>
            onParamsChange({
              year: value,
              // Başlangıç tarihi seçilen yıla taşınır
              startDate: params.startDate
                ? value + params.startDate.slice(4)
                : "",
            })
          }
          stretch
          className="sm:inline-grid sm:self-start"
          itemClassName="tabular-nums sm:px-3.5"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="gross-salary" className="text-sm font-semibold">
            Gross salary
          </label>
          <SegmentedControl
            ariaLabel="Amount period"
            options={periodOptions}
            value={period}
            onChange={setPeriod}
            itemClassName="h-[38px] px-2.5 text-[13px] sm:h-[30px] sm:px-3"
          />
        </div>
        <MoneyField
          id="gross-salary"
          size="lg"
          value={period === "month" ? params.salary / 12 : params.salary}
          onValueChange={(value) =>
            onSalaryChange(Math.round(period === "month" ? value * 12 : value))
          }
          suffix={period === "month" ? "/ month" : "/ year"}
          aria-describedby="gross-salary-help"
        />
        <p id="gross-salary-help" className="text-[13px] text-muted-foreground">
          Before tax. Statutory bonuses are added for you.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <span id="tax-status-label" className="text-sm font-semibold">
          Tax status
        </span>
        <SegmentedControl
          labelledBy="tax-status-label"
          variant="outlined"
          options={statusOptions}
          value={params.taxType}
          onChange={(taxType) =>
            onParamsChange(
              taxType === "single" ? { taxType, childCount: 0 } : { taxType },
            )
          }
          stretch
        />
        <p className="text-[13px] text-muted-foreground">
          {statusHelp[params.taxType]}
        </p>
      </div>

      {showChildren ? (
        <div className="flex flex-col gap-2">
          <span id="children-label" className="text-sm font-semibold">
            Children you maintain
          </span>
          <SegmentedControl
            labelledBy="children-label"
            variant="outlined"
            options={childOptions}
            value={(params.childCount ?? 0) as 0 | 1 | 2}
            onChange={(childCount) => onParamsChange({ childCount })}
            stretch
          />
          <p className="text-[13px] text-muted-foreground">
            From 2026, your rate depends on how many children you maintain.
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <span id="employment-label" className="text-sm font-semibold">
          Employment
        </span>
        <SegmentedControl
          labelledBy="employment-label"
          variant="outlined"
          options={sscOptions}
          value={params.sscCategory}
          onChange={(sscCategory) => onParamsChange({ sscCategory })}
          stretch
        />
        <p className="text-[13px] text-muted-foreground">
          {sscHelp(params.sscCategory, params.birthYear)}
        </p>
      </div>

      <SalaryMoreOptions
        params={params}
        bonuses={bonuses}
        onParamsChange={onParamsChange}
        onBonusesChange={onBonusesChange}
        onReset={onResetOptions}
      />
    </div>
  );
}
