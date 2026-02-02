"use client";
import {
  Gauge,
  TrendingUp,
  Coins,
  Receipt,
  Wallet,
} from "lucide-react";
import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from "framer-motion";
import { Month, MonthlySalaryInput, MonthlySalaryOutput, SalaryCalculatorConfig } from "@/types/salary-calculator-type";
import { SalaryFormCard } from "@/components/salary/form-card";
import { SalaryCalculatorForm, type MonthlyBonuses } from "./salary-input-form";
import { SalaryTable } from "./salary-table";
import { MobileMonthlyCards } from "./mobile-monthly-cards";
import { calculateMonthlyDeductions } from "@/utils/salary-calculator";
import { SSCCategory, TaxRateType, SimpleTaxType, ChildCount } from "@/config/malta-tax-config";
import { cn } from "@/lib/utils";
import { useQueryStates } from "nuqs";
import { salarySearchParams, type SalarySearchParams } from "../search-params";

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
    })
  );

  return (
    <motion.span className={className}>
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </motion.span>
  );
}

// Animated counter for integers (no decimals)
function AnimatedCounterInt({
  value,
  className,
  prefix = "",
  suffix = "",
}: {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  const animatedValue = useAnimatedNumber(value);
  const displayValue = useTransform(animatedValue, (v) =>
    Math.round(v).toLocaleString("en-US")
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
        variantStyles[variant]
      )}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3.5 w-3.5 opacity-70 flex-shrink-0" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className={cn(
        "text-sm sm:text-base font-bold",
        variant !== "default" && variantStyles[variant].split(" ").slice(1).join(" ")
      )}>
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
  // nuqs ile URL state yönetimi
  const [queryParams, setQueryParams] = useQueryStates(salarySearchParams, {
    shallow: false, // Server'a bildir, SSR güncelle
    throttleMs: 100, // Fast updates for responsive counter
  });

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
        rootMargin: '0px',
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    observer.observe(summaryCardRef.current);

    return () => {
      observer.disconnect();
    };
  }, []); // Only run once on mount

  // Parse monthlyBonuses from JSON string
  const parsedMonthlyBonuses = useMemo((): MonthlyBonuses => {
    if (!queryParams.monthlyBonuses) return {};
    try {
      return JSON.parse(queryParams.monthlyBonuses) as MonthlyBonuses;
    } catch {
      return {};
    }
  }, [queryParams.monthlyBonuses]);

  // Mevcut form değerlerini URL params'tan al
  const formValues = useMemo(() => ({
    grossSalary: queryParams.salary,
    year: queryParams.year,
    taxRateType: queryParams.taxType,
    childCount: (queryParams.childCount ?? 0) as 0 | 1 | 2,
    sscCategory: queryParams.sscCategory,
    birthYear: queryParams.birthYear,
    startOfMonth: queryParams.startOfMonth as Month,
    endOfMonth: queryParams.endOfMonth as Month,
    yearlyNonTaxBenefit: queryParams.yearlyNonTaxBenefit,
    yearlyTaxableBenefit: queryParams.yearlyTaxableBenefit,
    monthlyBonus: queryParams.monthlyBonus,
    allowanceBonus: queryParams.allowanceBonus,
    monthlyBonuses: parsedMonthlyBonuses,
  }), [queryParams, parsedMonthlyBonuses]);

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

  // URL params değiştiğinde hesapla
  useEffect(() => {
    const grossSalary = formValues.grossSalary ?? 25000;
    const allowanceBonus = formValues.allowanceBonus || 0;

    const monthlySalaries: MonthlySalaryInput[] = [];
    for (const month of Object.values(Month)) {
      // Per-month bonus: check if this month has a specific bonus
      const monthBonus = formValues.monthlyBonuses[month] || 0;

      monthlySalaries.push({
        month,
        allowanceBonus,
        bonus: monthBonus, // Per-month bonus
        grossWage: grossSalary > 0 ? Number((grossSalary / 12).toFixed(2)) : 0,
      });
    }

    const calculatedData = calculateMonthlyDeductions(monthlySalaries, config);
    setData(calculatedData);
  }, [formValues, config]);

  // Tablo içinden değer değiştiğinde güncelle (grossWage değiştiğinde fill-down)
  useEffect(() => {
    if (isUpdatingRef.current) {
      isUpdatingRef.current = false;
      previousDataRef.current = data;
      return;
    }
    if (data.length === 0) return;

    // Check for grossWage changes
    const lastChangedGrossIndex = data.findIndex((item, index) => {
      return item.grossWage !== previousDataRef.current[index]?.grossWage;
    });

    // Handle grossWage propagation (fill down behavior)
    if (lastChangedGrossIndex !== -1 && lastChangedGrossIndex !== data.length - 1) {
      const updatedData = data.map((item, index) => {
        if (index > lastChangedGrossIndex) {
          return { ...item, grossWage: data[lastChangedGrossIndex].grossWage };
        }
        return item;
      });

      isUpdatingRef.current = true;
      const monthlySalaries: MonthlySalaryInput[] = [];
      for (const line of updatedData) {
        const safeGrossWage = isNaN(Number(line.grossWage)) ? 0 : Number(line.grossWage);
        monthlySalaries.push({
          month: line.month,
          allowanceBonus: formValues.allowanceBonus || 0,
          bonus: formValues.monthlyBonuses[line.month] || 0,
          grossWage: safeGrossWage,
        });
      }
      const calculatedData = calculateMonthlyDeductions(monthlySalaries, config);
      setData(calculatedData);
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
      }
    };
  }, [data]);

  // Form value update handler - URL'i günceller
  const handleValuesChange = (values: Partial<typeof formValues>) => {
    // Mark that user has made changes
    setHasUserMadeChanges(true);

    // Serialize monthlyBonuses to JSON string for URL
    const monthlyBonusesJson = values.monthlyBonuses && Object.keys(values.monthlyBonuses).length > 0
      ? JSON.stringify(values.monthlyBonuses)
      : "";

    setQueryParams({
      salary: values.grossSalary,
      year: values.year,
      taxType: values.taxRateType as any,
      childCount: values.childCount,
      sscCategory: values.sscCategory as any,
      birthYear: values.birthYear,
      startOfMonth: values.startOfMonth as any,
      endOfMonth: values.endOfMonth as any,
      yearlyNonTaxBenefit: values.yearlyNonTaxBenefit,
      yearlyTaxableBenefit: values.yearlyTaxableBenefit,
      monthlyBonus: values.monthlyBonus,
      allowanceBonus: values.allowanceBonus,
      monthlyBonuses: monthlyBonusesJson,
    });
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
                  <span className="text-sm text-muted-foreground block mb-1">Monthly Net</span>
                  <AnimatedCounter
                    value={summary.monthly.net}
                    className="text-2xl sm:text-3xl font-bold text-primary"
                    prefix="€"
                    decimals={2}
                  />
                </div>
              </div>
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

      {/* Mobile Floating Net Salary Card - iOS Liquid Glass Effect - Positioned at TOP */}
      <AnimatePresence>
        {isMobile && hasUserMadeChanges && (isSalaryInputFocused || !isSummaryVisible) && summary && (
          <motion.div
            initial={{ y: -100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              mass: 0.8,
            }}
            className="fixed top-0 left-0 right-0 z-50 p-3 pt-[max(0.75rem,env(safe-area-inset-top))]"
          >
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              {/* iOS Liquid Glass Base - Multiple translucent layers */}
              <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70" />

              {/* Frosted glass blur layer */}
              <div className="absolute inset-0 backdrop-blur-2xl backdrop-saturate-150" />

              {/* Subtle gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/20 dark:from-white/10 dark:to-white/5" />

              {/* Top highlight edge - liquid glass reflection */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/30" />

              {/* Subtle inner glow */}
              <div className="absolute inset-0 rounded-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />

              {/* Border */}
              <div className="absolute inset-0 rounded-3xl border border-white/50 dark:border-white/20" />

              {/* Content */}
              <div className="relative px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Icon with frosted background */}
                    <div className="p-2.5 rounded-2xl bg-green-500/15 dark:bg-green-400/20 backdrop-blur-sm border border-green-500/20">
                      <Wallet className="h-5 w-5 text-green-700 dark:text-green-400" />
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider block">
                        Monthly Net
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 text-[10px]">
                        After tax & SSC
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <AnimatedCounter
                      value={summary.monthly.net}
                      className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-400 block"
                      prefix="€"
                      decimals={2}
                    />
                    <span className="text-gray-600 dark:text-gray-300 text-xs font-medium">
                      <AnimatedCounterInt
                        value={summary.annual.net}
                        prefix="€"
                        suffix="/year"
                      />
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

