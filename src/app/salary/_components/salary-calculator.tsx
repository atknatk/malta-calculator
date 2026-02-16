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
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
  useMotionValue,
} from "framer-motion";
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
import { cn } from "@/lib/utils";
import type { SalarySearchParams } from "../search-params";

// Hook to detect mobile viewport
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

// Hook for animated counting number - ultra fast tween animation
function useAnimatedNumber(value: number) {
  const motionValue = useMotionValue(value);

  useEffect(() => {
    const controls = motionValue.set(value);
  }, [motionValue, value]);

  // Use animate for fast duration-based transition
  const animatedValue = useSpring(motionValue, {
    duration: 250, // 150ms - very fast
    bounce: 0,
  });

  return animatedValue;
}

// Animated counter component - fast counting effect
function AnimatedCounter({
  value,
  className,
  prefix = "",
  suffix = "",
  decimals = 2,
}: {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const animatedValue = useAnimatedNumber(value);
  const displayValue = useTransform(animatedValue, (v) =>
    v.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }),
  );

  return (
    <motion.span className={className}>
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </motion.span>
  );
}

// Summary type
interface Summary {
  annual: {
    gross: number;
    ssc: number;
    tax: number;
    net: number;
  };
  monthly: {
    gross: number;
    ssc: number;
    tax: number;
    net: number;
  };
}

// Summary Card
function SummaryCard({
  icon: Icon,
  label,
  value,
  variant = "default",
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  variant?: "default" | "success" | "warning" | "danger";
}) {
  const variantStyles = {
    default: "bg-muted",
    success: "bg-green-500/10 text-green-700 dark:text-green-400",
    warning: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
    danger: "bg-red-500/10 text-red-700 dark:text-red-400",
  };

  return (
    <div
      className={cn(
        "p-3 rounded-xl transition-all duration-300 hover:scale-[1.02]",
        variantStyles[variant],
      )}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3.5 w-3.5 opacity-70 flex-shrink-0" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div
        className={cn(
          "text-sm sm:text-base font-bold",
          variant !== "default" &&
            variantStyles[variant].split(" ").slice(1).join(" "),
        )}
      >
        {value}
      </div>
    </div>
  );
}

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
  // Local state - URL sync yok, aninda guncelleme
  const [localParams, setLocalParams] =
    useState<SalarySearchParams>(initialParams);

  const [data, setData] = useState<MonthlySalaryOutput[]>(initialData);
  const [isSalaryInputFocused, setIsSalaryInputFocused] = useState(false);
  const [isSummaryVisible, setIsSummaryVisible] = useState(true);
  const [hasUserMadeChanges, setHasUserMadeChanges] = useState(false);
  const isUpdatingRef = React.useRef(false);
  const previousDataRef = React.useRef<MonthlySalaryOutput[]>(data);
  const summaryCardRef = React.useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Track Summary card visibility with IntersectionObserver
  useEffect(() => {
    if (!summaryCardRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSummaryVisible(entry.isIntersecting);
      },
      {
        root: null, // viewport
        rootMargin: "0px",
        threshold: 0.1, // Trigger when 10% of the element is visible
      },
    );

    observer.observe(summaryCardRef.current);

    return () => {
      observer.disconnect();
    };
  }, []); // Only run once on mount

  // Parse monthlyBonuses from JSON string
  const parsedMonthlyBonuses = useMemo((): MonthlyBonuses => {
    if (!localParams.monthlyBonuses) return {};
    try {
      return JSON.parse(localParams.monthlyBonuses) as MonthlyBonuses;
    } catch {
      return {};
    }
  }, [localParams.monthlyBonuses]);

  // Mevcut form degerlerini local params'tan al
  const formValues = useMemo(
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

  // Form değerlerinden config oluştur
  const config: SalaryCalculatorConfig = useMemo(() => {
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
  }, [formValues]);

  // Hesaplama useMemo ile senkron yapilir (useEffect'teki double render kalkar)
  const calculatedData = useMemo(() => {
    const grossSalary = formValues.grossSalary ?? 25000;
    const allowanceBonus = formValues.allowanceBonus || 0;

    const monthlySalaries: MonthlySalaryInput[] = [];
    for (const month of Object.values(Month)) {
      const monthBonus = formValues.monthlyBonuses[month] || 0;
      monthlySalaries.push({
        month,
        allowanceBonus,
        bonus: monthBonus,
        grossWage: grossSalary > 0 ? Number((grossSalary / 12).toFixed(2)) : 0,
      });
    }

    return calculateMonthlyDeductions(monthlySalaries, config);
  }, [formValues, config]);

  // Form degisikliginde data'yi senkron guncelle (derived state pattern)
  const prevCalcRef = React.useRef(calculatedData);
  const isFormDrivenUpdate = React.useRef(false);
  if (prevCalcRef.current !== calculatedData) {
    prevCalcRef.current = calculatedData;
    isFormDrivenUpdate.current = true;
    setData(calculatedData);
  }

  // Tablo icinden deger degistiginde guncelle (grossWage fill-down)
  // Sadece tablo-driven degisikliklerde calisir, form-driven'da skip eder
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

    // Check for grossWage changes (only from table edits)
    const lastChangedGrossIndex = data.findIndex((item, index) => {
      return item.grossWage !== previousDataRef.current[index]?.grossWage;
    });

    if (
      lastChangedGrossIndex !== -1 &&
      lastChangedGrossIndex !== data.length - 1
    ) {
      const updatedData = data.map((item, index) => {
        if (index > lastChangedGrossIndex) {
          return { ...item, grossWage: data[lastChangedGrossIndex].grossWage };
        }
        return item;
      });

      isUpdatingRef.current = true;
      const monthlySalaries: MonthlySalaryInput[] = [];
      for (const line of updatedData) {
        const safeGrossWage = isNaN(Number(line.grossWage))
          ? 0
          : Number(line.grossWage);
        monthlySalaries.push({
          month: line.month,
          allowanceBonus: formValues.allowanceBonus || 0,
          bonus: formValues.monthlyBonuses[line.month] || 0,
          grossWage: safeGrossWage,
        });
      }
      setData(calculateMonthlyDeductions(monthlySalaries, config));
    }

    previousDataRef.current = data;
  }, [data, config, formValues.allowanceBonus, formValues.monthlyBonuses]);

  // Özet hesapla
  const summary = useMemo(() => {
    if (data.length === 0) return null;

    const totalGross = data.reduce((sum, d) => sum + d.grossTotal, 0);
    const totalSSC = data.reduce((sum, d) => sum + d.sscTax, 0);
    const totalTax = data.reduce((sum, d) => sum + d.incomeTax, 0);
    const totalNet = data.reduce((sum, d) => sum + d.net, 0);

    return {
      annual: {
        gross: totalGross,
        ssc: totalSSC,
        tax: totalTax,
        net: totalNet,
      },
      monthly: {
        gross: totalGross / 12,
        ssc: totalSSC / 12,
        tax: totalTax / 12,
        net: totalNet / 12,
      },
    };
  }, [data]);

  // Form value update handler - local state gunceller (URL sync yok, aninda)
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
              {/* Annual Summary Cards - 2x2 grid */}
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
            onBonusChange={(month, value) => {
              // Update URL state with new bonus value
              const newBonuses = { ...formValues.monthlyBonuses };
              if (value > 0) {
                newBonuses[month as Month] = value;
              } else {
                delete newBonuses[month as Month];
              }
              handleValuesChange({ ...formValues, monthlyBonuses: newBonuses });
            }}
          />
        ) : (
          <SalaryTable
            data={data}
            setData={setData}
            onBonusChange={(month, value) => {
              // Update URL state with new bonus value
              const newBonuses = { ...formValues.monthlyBonuses };
              if (value > 0) {
                newBonuses[month] = value;
              } else {
                delete newBonuses[month];
              }
              handleValuesChange({ ...formValues, monthlyBonuses: newBonuses });
            }}
          />
        )}
      </SalaryFormCard>

      {/* Mobile Floating Net Salary Card - Positioned at TOP */}
      <AnimatePresence>
        {isMobile &&
          hasUserMadeChanges &&
          (isSalaryInputFocused || !isSummaryVisible) &&
          summary && (
            <motion.div
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -80, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-0 left-0 right-0 z-50 p-3 pt-[max(0.75rem,env(safe-area-inset-top))]"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-white/50 dark:border-white/20">
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-green-500/15 border border-green-500/20">
                        <Wallet className="h-4 w-4 text-green-700 dark:text-green-400" />
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider block">
                          Monthly Net
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-[10px]">
                          After tax & SSC
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-700 dark:text-green-400 block">
                        €
                        {summary.monthly.net.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                        €
                        {Math.round(summary.annual.net).toLocaleString("en-US")}
                        /year
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}
