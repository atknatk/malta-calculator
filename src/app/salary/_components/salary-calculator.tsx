"use client";
import Link from "next/link";
import {
  Gauge,
  TrendingUp,
  Coins,
  Receipt,
  Wallet,
  FileText,
} from "lucide-react";
import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import {
  Month,
  MonthlySalaryInput,
  MonthlySalaryOutput,
  SalaryCalculatorConfig,
} from "@/types/salary-calculator-type";
import { SalaryFormCard } from "@/components/salary/form-card";
import { SalaryCalculatorForm, type MonthlyBonuses } from "./salary-input-form";
import { SalaryTable } from "./salary-table";
import { MobileMonthlyCards } from "./mobile-monthly-cards";
import { SalaryShareButtons } from "./salary-share-buttons";
import { calculateMonthlyDeductions } from "@/utils/salary-calculator";
import {
  SSCCategory,
  TaxRateType,
  SimpleTaxType,
  ChildCount,
} from "@/config/malta-tax-config";
import type { SalarySearchParams } from "../search-params";
import { AnimatedCounter } from "./animated-counter";
import { SummaryCard, type Summary } from "./summary-card";
import { FloatingNetCard } from "./floating-net-card";

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  return isMobile;
}

function useSummaryVisibility(ref: React.RefObject<HTMLDivElement | null>) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return isVisible;
}

// ---------------------------------------------------------------------------
// Salary calculation helpers
// ---------------------------------------------------------------------------

function buildMonthlySalaries(
  formValues: ReturnType<typeof useFormValues>,
): MonthlySalaryInput[] {
  const grossSalary = formValues.grossSalary ?? 25000;
  const allowanceBonus = formValues.allowanceBonus || 0;
  const monthlyGross =
    grossSalary > 0 ? Number((grossSalary / 12).toFixed(2)) : 0;

  return Object.values(Month).map((month) => ({
    month,
    allowanceBonus,
    bonus: formValues.monthlyBonuses[month] || 0,
    grossWage: monthlyGross,
  }));
}

function buildConfig(
  formValues: ReturnType<typeof useFormValues>,
): SalaryCalculatorConfig {
  return {
    year: parseInt(formValues.year),
    taxRateType: formValues.taxRateType as TaxRateType,
    simpleTaxType: formValues.taxRateType as SimpleTaxType,
    childCount: formValues.childCount as ChildCount,
    sscCategory: formValues.sscCategory as SSCCategory,
    birthDate: new Date(formValues.birthYear, 0, 1),
    yearlyNonTaxBenefit: formValues.yearlyNonTaxBenefit,
    yearlyTaxableBenefit: formValues.yearlyTaxableBenefit,
    monthlyBonus: formValues.monthlyBonus,
    enableCOLA: true,
  };
}

function calculateSummary(data: MonthlySalaryOutput[]): Summary | null {
  if (data.length === 0) return null;

  const totalGross = data.reduce((sum, d) => sum + d.grossTotal, 0);
  const totalSSC = data.reduce((sum, d) => sum + d.sscTax, 0);
  const totalTax = data.reduce((sum, d) => sum + d.incomeTax, 0);
  const totalNet = data.reduce((sum, d) => sum + d.net, 0);

  return {
    annual: { gross: totalGross, ssc: totalSSC, tax: totalTax, net: totalNet },
    monthly: {
      gross: totalGross / 12,
      ssc: totalSSC / 12,
      tax: totalTax / 12,
      net: totalNet / 12,
    },
  };
}

// ---------------------------------------------------------------------------
// Form values hook - localParams → form field mapping
// ---------------------------------------------------------------------------

function useFormValues(localParams: SalarySearchParams) {
  const parsedMonthlyBonuses = useMemo((): MonthlyBonuses => {
    if (!localParams.monthlyBonuses) return {};
    try {
      return JSON.parse(localParams.monthlyBonuses) as MonthlyBonuses;
    } catch {
      return {};
    }
  }, [localParams.monthlyBonuses]);

  return useMemo(
    () => ({
      grossSalary: localParams.salary,
      year: localParams.year,
      taxRateType: localParams.taxType,
      childCount: (localParams.childCount ?? 0) as 0 | 1 | 2,
      sscCategory: localParams.sscCategory,
      birthYear: localParams.birthYear,
      startOfMonth: localParams.startOfMonth as Month,
      endOfMonth: localParams.endOfMonth as Month,
      yearlyNonTaxBenefit: localParams.yearlyNonTaxBenefit,
      yearlyTaxableBenefit: localParams.yearlyTaxableBenefit,
      monthlyBonus: localParams.monthlyBonus,
      allowanceBonus: localParams.allowanceBonus,
      monthlyBonuses: parsedMonthlyBonuses,
    }),
    [localParams, parsedMonthlyBonuses],
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface SalaryCalculatorClientProps {
  children: React.ReactNode;
  initialData: MonthlySalaryOutput[];
  initialSummary: Summary | null;
  initialParams: SalarySearchParams;
}

export function SalaryCalculatorClient({
  children,
  initialData,
  initialSummary,
  initialParams,
}: SalaryCalculatorClientProps) {
  // --- State ---
  const [localParams, setLocalParams] =
    useState<SalarySearchParams>(initialParams);
  const [data, setData] = useState<MonthlySalaryOutput[]>(initialData);
  const [isSalaryInputFocused, setIsSalaryInputFocused] = useState(false);
  const [hasUserMadeChanges, setHasUserMadeChanges] = useState(false);

  // --- Refs ---
  const isUpdatingRef = React.useRef(false);
  const previousDataRef = React.useRef<MonthlySalaryOutput[]>(data);
  const summaryCardRef = React.useRef<HTMLDivElement>(null);

  // --- Hooks ---
  const isMobile = useIsMobile();
  const isSummaryVisible = useSummaryVisibility(summaryCardRef);
  const formValues = useFormValues(localParams);

  // --- Derived calculations ---
  const config = useMemo(() => buildConfig(formValues), [formValues]);

  const calculatedData = useMemo(
    () => calculateMonthlyDeductions(buildMonthlySalaries(formValues), config),
    [formValues, config],
  );

  // Sync calculated data → state (derived state pattern)
  const prevCalcRef = React.useRef(calculatedData);
  const isFormDrivenUpdate = React.useRef(false);
  if (prevCalcRef.current !== calculatedData) {
    prevCalcRef.current = calculatedData;
    isFormDrivenUpdate.current = true;
    setData(calculatedData);
  }

  // Table-driven grossWage fill-down
  useEffect(() => {
    if (isFormDrivenUpdate.current) {
      isFormDrivenUpdate.current = false;
      previousDataRef.current = data;
      return;
    }
    if (isUpdatingRef.current) {
      isUpdatingRef.current = false;
      previousDataRef.current = data;
      return;
    }
    if (data.length === 0) return;

    const lastChangedGrossIndex = data.findIndex(
      (item, index) =>
        item.grossWage !== previousDataRef.current[index]?.grossWage,
    );

    if (
      lastChangedGrossIndex !== -1 &&
      lastChangedGrossIndex !== data.length - 1
    ) {
      const updatedData = data.map((item, index) =>
        index > lastChangedGrossIndex
          ? { ...item, grossWage: data[lastChangedGrossIndex].grossWage }
          : item,
      );

      isUpdatingRef.current = true;
      const monthlySalaries: MonthlySalaryInput[] = updatedData.map((line) => ({
        month: line.month,
        allowanceBonus: formValues.allowanceBonus || 0,
        bonus: formValues.monthlyBonuses[line.month] || 0,
        grossWage: isNaN(Number(line.grossWage)) ? 0 : Number(line.grossWage),
      }));
      setData(calculateMonthlyDeductions(monthlySalaries, config));
    }

    previousDataRef.current = data;
  }, [data, config, formValues.allowanceBonus, formValues.monthlyBonuses]);

  const summary = useMemo(() => calculateSummary(data), [data]);

  // --- Handlers ---
  const handleValuesChange = (values: Partial<typeof formValues>) => {
    setHasUserMadeChanges(true);

    const monthlyBonusesJson =
      values.monthlyBonuses && Object.keys(values.monthlyBonuses).length > 0
        ? JSON.stringify(values.monthlyBonuses)
        : "";

    setLocalParams((prev) => ({
      ...prev,
      salary: values.grossSalary ?? prev.salary,
      year: values.year ?? prev.year,
      taxType:
        (values.taxRateType as SalarySearchParams["taxType"]) ?? prev.taxType,
      childCount: values.childCount ?? prev.childCount,
      sscCategory:
        (values.sscCategory as SalarySearchParams["sscCategory"]) ??
        prev.sscCategory,
      birthYear: values.birthYear ?? prev.birthYear,
      startOfMonth:
        (values.startOfMonth as SalarySearchParams["startOfMonth"]) ??
        prev.startOfMonth,
      endOfMonth:
        (values.endOfMonth as SalarySearchParams["endOfMonth"]) ??
        prev.endOfMonth,
      yearlyNonTaxBenefit:
        values.yearlyNonTaxBenefit ?? prev.yearlyNonTaxBenefit,
      yearlyTaxableBenefit:
        values.yearlyTaxableBenefit ?? prev.yearlyTaxableBenefit,
      monthlyBonus: values.monthlyBonus ?? prev.monthlyBonus,
      allowanceBonus: values.allowanceBonus ?? prev.allowanceBonus,
      monthlyBonuses:
        monthlyBonusesJson !== undefined
          ? monthlyBonusesJson
          : prev.monthlyBonuses,
    }));
  };

  const handleBonusChange = (month: string, value: number) => {
    const newBonuses = { ...formValues.monthlyBonuses };
    if (value > 0) {
      newBonuses[month as Month] = value;
    } else {
      delete newBonuses[month as Month];
    }
    handleValuesChange({ ...formValues, monthlyBonuses: newBonuses });
  };

  // --- Floating card visibility ---
  const showFloatingCard =
    isMobile &&
    hasUserMadeChanges &&
    (isSalaryInputFocused || !isSummaryVisible) &&
    !!summary;

  // --- Render ---
  return (
    <div className="space-y-6">
      {/* Two Column Layout: Form + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Calculator Form */}
        <SalaryFormCard
          title="Salary Calculator"
          variant="primary"
          icon={Gauge}
        >
          <SalaryCalculatorForm
            values={formValues}
            onValuesChange={handleValuesChange}
            onFocusChange={(focused) => setIsSalaryInputFocused(focused)}
          />
        </SalaryFormCard>

        {/* Right Column: Summary */}
        {summary && (
          <div ref={summaryCardRef}>
            <SalaryFormCard title="Summary" icon={Wallet}>
              <div className="grid grid-cols-2 gap-2">
                <SummaryCard
                  icon={TrendingUp}
                  label="Gross"
                  value={`€${Math.round(summary.annual.gross).toLocaleString()}`}
                />
                <SummaryCard
                  icon={Coins}
                  label="SSC"
                  value={`€${Math.round(summary.annual.ssc).toLocaleString()}`}
                  variant="warning"
                />
                <SummaryCard
                  icon={Receipt}
                  label="Tax"
                  value={`€${Math.round(summary.annual.tax).toLocaleString()}`}
                  variant="danger"
                />
                <SummaryCard
                  icon={Wallet}
                  label="Net"
                  value={`€${Math.round(summary.annual.net).toLocaleString()}`}
                  variant="success"
                />
              </div>

              {/* Monthly Net Highlight */}
              <div className="mt-3 p-4 bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/10 rounded-xl border border-primary/20">
                <div className="text-center">
                  <span className="text-sm text-muted-foreground block mb-1">
                    Monthly Net
                  </span>
                  <AnimatedCounter
                    value={summary.monthly.net}
                    className="text-2xl sm:text-3xl font-bold text-primary"
                    prefix="€"
                    decimals={2}
                  />
                </div>
              </div>

              {/* Generate Payslip CTA */}
              <Link
                href="/sign-up"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:from-amber-600 hover:to-orange-700 hover:shadow-lg"
              >
                <FileText className="h-4 w-4" />
                Generate Payslip for Your Team
              </Link>

              {/* Share Buttons */}
              <SalaryShareButtons
                monthlyNet={summary.monthly.net}
                annualNet={summary.annual.net}
                calculatorParams={localParams}
              />
            </SalaryFormCard>
          </div>
        )}
      </div>

      {children}

      {/* Full Width Table */}
      <SalaryFormCard title="Monthly Breakdown" className="w-full">
        {isMobile ? (
          <MobileMonthlyCards
            data={data}
            setData={setData}
            onBonusChange={handleBonusChange}
          />
        ) : (
          <SalaryTable
            data={data}
            setData={setData}
            onBonusChange={handleBonusChange}
          />
        )}
      </SalaryFormCard>

      {/* Mobile Floating Net Salary Card */}
      {summary && (
        <FloatingNetCard visible={showFloatingCard} summary={summary} />
      )}
    </div>
  );
}
