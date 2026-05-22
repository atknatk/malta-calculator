"use client";
import {
  Gauge,
  TrendingUp,
  Coins,
  Receipt,
  Wallet,
  FileText,
  Target,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import {
  Month,
  MonthlySalaryInput,
  MonthlySalaryOutput,
  SalaryCalculatorConfig,
} from "@/types/salary-calculator-type";
import { SalaryFormCard } from "@/components/salary/form-card";
import { CalculatorModeToggle } from "@/components/salary/mode-toggle";
import {
  NetToGrossCalculatorForm,
  type MonthlyBonuses,
  type NetToGrossFormValues,
} from "./net-to-gross-input-form";
import { SalaryTable } from "@/app/salary/_components/salary-table";
import { MobileMonthlyCards } from "@/app/salary/_components/mobile-monthly-cards";
import { NetToGrossShareButtons } from "./net-to-gross-share-buttons";
import { calculateMonthlyDeductions } from "@/utils/salary-calculator";
import { calculateGrossFromNet } from "@/utils/net-to-gross-calculator";
import {
  SSCCategory,
  TaxRateType,
  SimpleTaxType,
  ChildCount,
} from "@/config/malta-tax-config";
import type { NetToGrossSearchParams } from "../search-params";
import { AnimatedCounter } from "@/app/salary/_components/animated-counter";
import {
  SummaryCard,
  type Summary,
} from "@/app/salary/_components/summary-card";
import { FloatingNetCard } from "@/app/salary/_components/floating-net-card";
import { serializeSalaryParams } from "@/app/salary/search-params";

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
// Helpers
// ---------------------------------------------------------------------------

function buildConfig(
  values: ReturnType<typeof useFormValues>,
): SalaryCalculatorConfig {
  return {
    year: parseInt(values.year),
    taxRateType: values.taxRateType as TaxRateType,
    simpleTaxType: values.taxRateType as SimpleTaxType,
    childCount: values.childCount as ChildCount,
    sscCategory: values.sscCategory as SSCCategory,
    birthDate: new Date(values.birthYear, 0, 1),
    yearlyNonTaxBenefit: values.yearlyNonTaxBenefit,
    yearlyTaxableBenefit: values.yearlyTaxableBenefit,
    monthlyBonus: values.monthlyBonus,
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
// Form values hook
// ---------------------------------------------------------------------------

function useFormValues(localParams: NetToGrossSearchParams) {
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
      targetNet: localParams.net,
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
      includeBonusesInTarget: localParams.includeBonusesInTarget,
    }),
    [localParams, parsedMonthlyBonuses],
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface NetToGrossCalculatorClientProps {
  initialData: MonthlySalaryOutput[];
  initialAnnualGross: number;
  initialMonthlyGross: number;
  initialParams: NetToGrossSearchParams;
}

export function NetToGrossCalculatorClient({
  initialData,
  initialAnnualGross,
  initialMonthlyGross,
  initialParams,
}: NetToGrossCalculatorClientProps) {
  const [localParams, setLocalParams] =
    useState<NetToGrossSearchParams>(initialParams);
  const [data, setData] = useState<MonthlySalaryOutput[]>(initialData);
  const [derivedGross, setDerivedGross] = useState({
    annual: initialAnnualGross,
    monthly: initialMonthlyGross,
  });
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [hasUserMadeChanges, setHasUserMadeChanges] = useState(false);

  const isUpdatingRef = React.useRef(false);
  const previousDataRef = React.useRef<MonthlySalaryOutput[]>(data);
  const summaryCardRef = React.useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();
  const isSummaryVisible = useSummaryVisibility(summaryCardRef);
  const formValues = useFormValues(localParams);

  const config = useMemo(() => buildConfig(formValues), [formValues]);

  // Form değişince → bisection ile target net'i veren gross'u yeniden hesapla
  const reverseResult = useMemo(
    () =>
      calculateGrossFromNet(
        {
          targetAnnualNet: formValues.targetNet ?? 0,
          includeBonusesInTarget: formValues.includeBonusesInTarget,
          allowanceBonus: formValues.allowanceBonus,
          monthlyBonuses: formValues.monthlyBonuses,
        },
        config,
      ),
    [
      formValues.targetNet,
      formValues.includeBonusesInTarget,
      formValues.allowanceBonus,
      formValues.monthlyBonuses,
      config,
    ],
  );

  // Form-driven update sync
  const prevReverseRef = React.useRef(reverseResult);
  const isFormDrivenUpdate = React.useRef(false);
  if (prevReverseRef.current !== reverseResult) {
    prevReverseRef.current = reverseResult;
    isFormDrivenUpdate.current = true;
    setData(reverseResult.monthly);
    setDerivedGross({
      annual: reverseResult.annualGross,
      monthly: reverseResult.monthlyGross,
    });
  }

  // Table-driven grossWage fill-down (manual override)
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
      const recalculated = calculateMonthlyDeductions(monthlySalaries, config);
      setData(recalculated);

      // Derived gross güncelle (manual override sonrası)
      const annual = recalculated.reduce((sum, d) => sum + d.grossWage, 0);
      setDerivedGross({ annual, monthly: annual / 12 });
    }

    previousDataRef.current = data;
  }, [data, config, formValues.allowanceBonus, formValues.monthlyBonuses]);

  const summary = useMemo(() => calculateSummary(data), [data]);

  // Form handler
  const handleValuesChange = (values: Partial<NetToGrossFormValues>) => {
    setHasUserMadeChanges(true);

    const monthlyBonusesJson =
      values.monthlyBonuses && Object.keys(values.monthlyBonuses).length > 0
        ? JSON.stringify(values.monthlyBonuses)
        : "";

    setLocalParams((prev) => ({
      ...prev,
      net: values.targetNet ?? prev.net,
      year: values.year ?? prev.year,
      taxType:
        (values.taxRateType as NetToGrossSearchParams["taxType"]) ??
        prev.taxType,
      childCount: values.childCount ?? prev.childCount,
      sscCategory:
        (values.sscCategory as NetToGrossSearchParams["sscCategory"]) ??
        prev.sscCategory,
      birthYear: values.birthYear ?? prev.birthYear,
      startOfMonth:
        (values.startOfMonth as NetToGrossSearchParams["startOfMonth"]) ??
        prev.startOfMonth,
      endOfMonth:
        (values.endOfMonth as NetToGrossSearchParams["endOfMonth"]) ??
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
      includeBonusesInTarget:
        values.includeBonusesInTarget ?? prev.includeBonusesInTarget,
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

  // Build the "switch to gross→net" link with carried-over params.
  // /salary expects `salary` (annual gross) — pass the derived annual gross.
  const switchToGrossHref = useMemo(() => {
    return serializeSalaryParams("/salary", {
      salary: Math.round(derivedGross.annual),
      year: localParams.year,
      taxType: localParams.taxType,
      childCount: localParams.childCount,
      sscCategory: localParams.sscCategory,
      birthYear: localParams.birthYear,
      startOfMonth: localParams.startOfMonth,
      endOfMonth: localParams.endOfMonth,
      yearlyNonTaxBenefit: localParams.yearlyNonTaxBenefit,
      yearlyTaxableBenefit: localParams.yearlyTaxableBenefit,
      monthlyBonus: localParams.monthlyBonus,
      allowanceBonus: localParams.allowanceBonus,
      monthlyBonuses: localParams.monthlyBonuses,
    });
  }, [localParams, derivedGross.annual]);

  const showFloatingCard =
    isMobile &&
    hasUserMadeChanges &&
    (isInputFocused || !isSummaryVisible) &&
    !!summary;

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="lg:col-span-2">
        <CalculatorModeToggle
          active="net-to-gross"
          otherHref={switchToGrossHref}
        />
      </div>

      {/* Two Column Layout: Form + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Calculator Form */}
        <SalaryFormCard
          title="Net to Gross Calculator"
          variant="primary"
          icon={Target}
        >
          <NetToGrossCalculatorForm
            values={formValues}
            onValuesChange={handleValuesChange}
            onFocusChange={(focused) => setIsInputFocused(focused)}
          />
        </SalaryFormCard>

        {/* Right Column: Summary */}
        {summary && (
          <div ref={summaryCardRef}>
            <SalaryFormCard title="Required Gross" icon={Gauge}>
              <div className="grid grid-cols-2 gap-2">
                <SummaryCard
                  icon={TrendingUp}
                  label="Annual Gross"
                  value={`€${Math.round(summary.annual.gross).toLocaleString()}`}
                  variant="success"
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
                />
              </div>

              {/* Monthly Gross Highlight */}
              <div className="mt-3 p-4 bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-green-500/10 rounded-xl border border-green-500/20">
                <div className="text-center">
                  <span className="text-sm text-muted-foreground block mb-1">
                    Monthly Gross Salary Required
                  </span>
                  <AnimatedCounter
                    value={summary.monthly.gross}
                    className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-400"
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

              <NetToGrossShareButtons
                annualGross={summary.annual.gross}
                monthlyGross={summary.monthly.gross}
                calculatorParams={localParams}
              />
            </SalaryFormCard>
          </div>
        )}
      </div>

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
