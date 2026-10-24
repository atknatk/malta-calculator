"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { Month } from "@/types/salary-calculator-type";
import type { SalaryCalculatorConfig } from "@/types/salary-calculator-type";
import { serializeNetToGrossParams } from "@/app/net-to-gross/search-params";
import {
  buildEmploymentConfig,
  calculateMonthlyDeductions,
  calculateYearEndTaxPosition,
  parseDateOnly,
} from "@/utils/salary-calculator";
import type {
  ChildCount,
  SSCCategory,
  SimpleTaxType,
  TaxRateType,
} from "@/config/malta-tax-config";
import type { SalarySearchParams } from "../search-params";
import {
  buildMonthlyInputs,
  findTaxBandRate,
  summarizeTotals,
} from "../_lib/salary-view";
import { SalaryForm, type MonthlyBonuses } from "./salary-form";
import { SalaryResult } from "./salary-result";
import { SalaryBreakdown } from "./salary-breakdown";
import { SalaryResultBar } from "./salary-result-bar";

const blankWages = (): (number | null)[] => Array(12).fill(null);

function parseBonuses(json: string): MonthlyBonuses {
  if (!json) return {};
  try {
    return JSON.parse(json) as MonthlyBonuses;
  } catch {
    return {};
  }
}

function buildConfig(params: SalarySearchParams): SalaryCalculatorConfig {
  const year = parseInt(params.year);
  return {
    year,
    taxRateType: params.taxType as TaxRateType,
    simpleTaxType: params.taxType as SimpleTaxType,
    childCount: (params.childCount ?? 0) as ChildCount,
    sscCategory: params.sscCategory as SSCCategory,
    birthDate: new Date(params.birthYear, 0, 1),
    yearlyNonTaxBenefit: params.yearlyNonTaxBenefit,
    yearlyTaxableBenefit: params.yearlyTaxableBenefit,
    monthlyBonus: params.monthlyBonus,
    enableCOLA: true,
    ...buildEmploymentConfig({
      year,
      startDate: params.startDate,
      startOfMonth: params.startOfMonth,
      endOfMonth: params.endOfMonth,
      previousTaxableIncome: params.prevIncome,
      previousTaxPaid: params.prevTax,
      includeStartWeekSSC: params.startWeekSSC,
    }),
  };
}

export type ResultView = "month" | "year";

interface SalaryCalculatorClientProps {
  children?: React.ReactNode;
  initialParams: SalarySearchParams;
}

export function SalaryCalculatorClient({
  children,
  initialParams,
}: SalaryCalculatorClientProps) {
  // --- State ---
  const [params, setParams] = useState<SalarySearchParams>(initialParams);
  // Tablodan düzenlenen aylık brüt ücretler; maaş değişince sıfırlanır
  const [wageOverrides, setWageOverrides] = useState(blankWages);
  const [view, setView] = useState<ResultView>("month");
  const resultRef = React.useRef<HTMLElement>(null);

  const bonuses = useMemo(
    () => parseBonuses(params.monthlyBonuses),
    [params.monthlyBonuses],
  );

  // --- Derived calculations ---
  const config = useMemo(() => buildConfig(params), [params]);
  const data = useMemo(
    () =>
      calculateMonthlyDeductions(
        buildMonthlyInputs({
          annualSalary: params.salary,
          wageOverrides,
          allowance: params.allowanceBonus,
          bonuses,
        }),
        config,
      ),
    [params.salary, params.allowanceBonus, wageOverrides, bonuses, config],
  );
  const totals = useMemo(() => summarizeTotals(data), [data]);
  const bandRate = useMemo(() => findTaxBandRate(data, config), [data, config]);

  // Yıl ortası giriş/çıkış veya önceki işveren varsa yıl sonu mahsup tahmini
  const hasPartialYear =
    !!config.employmentStartDate ||
    !!config.employmentEndDate ||
    !!config.previousEmployment;
  const yearEndPosition = useMemo(
    () => (hasPartialYear ? calculateYearEndTaxPosition(data, config) : null),
    [data, config, hasPartialYear],
  );

  // --- Handlers ---
  const updateParams = (patch: Partial<SalarySearchParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  };

  const setSalary = (salary: number) => {
    updateParams({ salary });
    setWageOverrides(blankWages());
  };

  const setBonuses = (next: MonthlyBonuses) => {
    updateParams({
      monthlyBonuses: Object.keys(next).length > 0 ? JSON.stringify(next) : "",
    });
  };

  // Yeni ücret sonraki aylara da taşınır
  const setWage = (index: number, wage: number) => {
    setWageOverrides((prev) =>
      prev.map((value, i) => (i >= index ? wage : value)),
    );
  };

  const setMonthBonus = (month: Month, amount: number) => {
    const next = { ...bonuses };
    if (amount > 0) next[month] = amount;
    else delete next[month];
    setBonuses(next);
  };

  const resetOptions = () => {
    updateParams({
      birthYear: 1990,
      startDate: "",
      startOfMonth: "January",
      endOfMonth: "December",
      startWeekSSC: true,
      prevIncome: 0,
      prevTax: 0,
      yearlyNonTaxBenefit: 0,
      yearlyTaxableBenefit: 0,
      allowanceBonus: 0,
      monthlyBonuses: "",
    });
    setWageOverrides(blankWages());
  };

  // --- Net → Gross: parametreler taşınarak ayrı hesaplayıcıya geçilir ---
  const switchToNetHref = useMemo(
    () =>
      serializeNetToGrossParams("/net-to-gross", {
        net: totals.paid > 0 ? Math.round(totals.paid) : 20000,
        year: params.year,
        taxType: params.taxType,
        childCount: params.childCount,
        sscCategory: params.sscCategory,
        birthYear: params.birthYear,
        startOfMonth: params.startOfMonth,
        endOfMonth: params.endOfMonth,
        yearlyNonTaxBenefit: params.yearlyNonTaxBenefit,
        yearlyTaxableBenefit: params.yearlyTaxableBenefit,
        monthlyBonus: params.monthlyBonus,
        allowanceBonus: params.allowanceBonus,
        monthlyBonuses: params.monthlyBonuses,
        includeBonusesInTarget: true,
      }),
    [params, totals.paid],
  );

  const startDate = config.employmentStartDate;
  const monthsWorked = Math.max(1, totals.monthsWorked);

  return (
    <div className="flex w-full flex-col">
      <section
        aria-label="Calculator"
        className="mt-5 grid items-start gap-4 md:mt-7 md:grid-cols-[minmax(0,1fr)_320px] md:gap-5 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-6"
      >
        <SalaryForm
          params={params}
          bonuses={bonuses}
          onParamsChange={updateParams}
          onSalaryChange={setSalary}
          onBonusesChange={setBonuses}
          onResetOptions={resetOptions}
          switchToNetHref={switchToNetHref}
          monthsWorked={monthsWorked}
        />
        <SalaryResult
          ref={resultRef}
          view={view}
          onViewChange={setView}
          totals={totals}
          monthsWorked={monthsWorked}
          bandRate={bandRate}
          yearEndPosition={yearEndPosition}
          params={params}
        />
      </section>

      {children}

      <SalaryBreakdown
        data={data}
        year={params.year}
        startDate={startDate ?? parseDateOnly(params.startDate)}
        wageOverrides={wageOverrides}
        bonuses={bonuses}
        onWageChange={setWage}
        onBonusChange={setMonthBonus}
        onResetEdits={() => setWageOverrides(blankWages())}
      />

      <SalaryResultBar
        resultRef={resultRef}
        view={view}
        paid={totals.paid}
        monthsWorked={monthsWorked}
      />
    </div>
  );
}
