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
import { motion } from "framer-motion";
import { Month, MonthlySalaryInput, MonthlySalaryOutput, SalaryCalculatorConfig } from "@/types/salary-calculator-type";
import { SalaryFormCard } from "@/components/salary/form-card";
import { SalaryCalculatorForm } from "./salary-input-form";
import { SalaryTable } from "./salary-table";
import { MobileMonthlyCards } from "./mobile-monthly-cards";
import { calculateMonthlyDeductions, defaultConfig } from "@/utils/salary-calculator";
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
    success: "bg-green-500/10 text-green-600 dark:text-green-400",
    warning: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    danger: "bg-red-500/10 text-red-600 dark:text-red-400",
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
    throttleMs: 500, // Debounce for smooth UX
  });

  const [data, setData] = useState<MonthlySalaryOutput[]>(initialData);
  const isUpdatingRef = React.useRef(false);
  const previousDataRef = React.useRef<MonthlySalaryOutput[]>(data);
  const isMobile = useIsMobile();

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
  }), [queryParams]);

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
    const grossSalary = formValues.grossSalary ?? 36000;
    const allowanceBonus = formValues.allowanceBonus || 0;

    const monthlySalaries: MonthlySalaryInput[] = [];
    for (const month of Object.values(Month)) {
      monthlySalaries.push({
        month,
        allowanceBonus,
        grossWage: grossSalary > 0 ? Number((grossSalary / 12).toFixed(2)) : 0,
      });
    }

    const calculatedData = calculateMonthlyDeductions(monthlySalaries, config);
    setData(calculatedData);
  }, [formValues, config]);

  // Tablo içinden değer değiştiğinde güncelle
  useEffect(() => {
    if (isUpdatingRef.current) {
      isUpdatingRef.current = false;
      previousDataRef.current = data;
      return;
    }
    if (data.length === 0) return;

    const lastChangedIndex = data.findIndex((item, index) => {
      return item.grossWage !== previousDataRef.current[index]?.grossWage;
    });

    if (lastChangedIndex === -1 || lastChangedIndex === data.length - 1) {
      previousDataRef.current = data;
      return;
    }

    const updatedData = data.map((item, index) => {
      if (index > lastChangedIndex) {
        return { ...item, grossWage: data[lastChangedIndex].grossWage };
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
        grossWage: safeGrossWage,
      });
    }
    const calculatedData = calculateMonthlyDeductions(monthlySalaries, config);
    setData(calculatedData);
  }, [data, config, formValues.allowanceBonus]);

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
          />
        </SalaryFormCard>

        {/* Right Column: Summary */}
        {summary && (
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
                <span className="text-2xl sm:text-3xl font-bold text-primary">
                  €{summary.monthly.net.toFixed(2)}
                </span>
              </div>
            </div>
          </SalaryFormCard>
        )}
      </div>

      {children}

      {/* Full Width Table */}
      <SalaryFormCard title="Monthly Breakdown" className="w-full">
        {isMobile ? (
          <MobileMonthlyCards data={data} setData={setData} />
        ) : (
          <SalaryTable data={data} setData={setData} />
        )}
      </SalaryFormCard>
    </div>
  );
}

