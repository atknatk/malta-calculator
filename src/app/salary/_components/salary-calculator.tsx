"use client"
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
import { SalaryCalculatorForm, SalaryFormValues } from "./salary-input-form";
import { SalaryTable } from "./salary-table";
import { MobileMonthlyCards } from "./mobile-monthly-cards";
import { calculateMonthlyDeductions, defaultConfig } from "@/utils/salary-calculator";
import { SSCCategory, TaxRateType } from "@/config/malta-tax-config";
import { cn } from "@/lib/utils";

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

// Animated Summary Card
function SummaryCard({
  icon: Icon,
  label,
  value,
  variant = "default",
  delay = 0,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  variant?: "default" | "success" | "warning" | "danger";
  delay?: number;
}) {
  const variantStyles = {
    default: "bg-muted",
    success: "bg-green-500/10 text-green-600 dark:text-green-400",
    warning: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    danger: "bg-red-500/10 text-red-600 dark:text-red-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.3, ease: "easeOut" }}
      className={cn(
        "p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02]",
        variantStyles[variant]
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 opacity-70" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className={cn(
        "text-xl sm:text-2xl font-bold",
        variant !== "default" && variantStyles[variant].split(" ").slice(1).join(" ")
      )}>
        {value}
      </div>
    </motion.div>
  );
}

export function SalaryCalculatorClient({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<MonthlySalaryOutput[]>([]);
  const [formValues, setFormValues] = useState<Partial<SalaryFormValues>>({});
  const isUpdatingRef = React.useRef(false);
  const previousDataRef = React.useRef<MonthlySalaryOutput[]>(data);
  const isMobile = useIsMobile();

  // Form değerlerinden config oluştur
  const config: SalaryCalculatorConfig = useMemo(() => {
    // Hafta sayısı override
    let weeksPerMonthOverride: number | undefined = undefined;
    if (formValues.weeksPerMonth === "4") weeksPerMonthOverride = 4;
    else if (formValues.weeksPerMonth === "5") weeksPerMonthOverride = 5;
    // "auto" durumunda undefined kalır, default değerler kullanılır

    return {
      year: formValues.year ? parseInt(formValues.year as string) : defaultConfig.year,
      taxRateType: (formValues.taxRateType as TaxRateType) || defaultConfig.taxRateType,
      sscCategory: (formValues.sscCategory as SSCCategory) || defaultConfig.sscCategory,
      birthDate: new Date(formValues.birthYear || 1990, 0, 1),
      yearlyNonTaxBenefit: formValues.yearlyNonTaxBenefit ?? defaultConfig.yearlyNonTaxBenefit,
      yearlyTaxableBenefit: formValues.yearlyTaxableBenefit ?? defaultConfig.yearlyTaxableBenefit,
      monthlyBonus: formValues.monthlyBonus ?? 0,
      enableCOLA: true, // COLA otomatik olarak eklenir
      weeksPerMonthOverride,
    };
  }, [formValues]);

  // Form değerleri değiştiğinde hesapla
  React.useEffect(() => {
    // Default gross salary: 36000 (schema default)
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
  React.useEffect(() => {
    if (isUpdatingRef.current) {
      isUpdatingRef.current = false;
      previousDataRef.current = data;
      return;
    }
    if (data.length === 0) return;

    // Get the index of the last changed item
    const lastChangedIndex = data.findIndex((item, index) => {
      return item.grossWage !== previousDataRef.current[index]?.grossWage;
    });

    if (lastChangedIndex === -1 || lastChangedIndex === data.length - 1) {
      previousDataRef.current = data;
      return;
    }

    // Create a new array with updated values for subsequent rows
    const updatedData = data.map((item, index) => {
      if (index > lastChangedIndex) {
        return { ...item, grossWage: data[lastChangedIndex].grossWage };
      }
      return item;
    });

    isUpdatingRef.current = true;
    const monthlySalaries: MonthlySalaryInput[] = [];
    for (const line of updatedData) {
      // NaN koruması
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

  // Yıllık ve aylık özet hesapla
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

  return (
    <>
      <SalaryFormCard
        title="Salary Calculator"
        variant="primary"
        icon={Gauge}
        className={"sm:col-span-3"}
      >
        <SalaryCalculatorForm
          values={formValues}
          onValuesChange={(v) => setFormValues(v as Partial<SalaryFormValues>)}
        />
      </SalaryFormCard>

      {children}

      {summary && (
        <SalaryFormCard title="Summary" className={"sm:col-span-3"}>
          {/* Annual Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <SummaryCard
              icon={TrendingUp}
              label="Annual Gross"
              value={`€${summary.annual.gross.toFixed(2)}`}
              delay={0}
            />
            <SummaryCard
              icon={Coins}
              label="Annual SSC"
              value={`€${summary.annual.ssc.toFixed(2)}`}
              variant="warning"
              delay={0.1}
            />
            <SummaryCard
              icon={Receipt}
              label="Annual Tax"
              value={`€${summary.annual.tax.toFixed(2)}`}
              variant="danger"
              delay={0.2}
            />
            <SummaryCard
              icon={Wallet}
              label="Annual Net"
              value={`€${summary.annual.net.toFixed(2)}`}
              variant="success"
              delay={0.3}
            />
          </div>

          {/* Monthly Net Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="mt-4 p-4 sm:p-6 bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-violet-500/10 rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-muted-foreground">Monthly Net Salary</span>
              <span className="text-3xl sm:text-4xl font-bold text-primary">
                €{summary.monthly.net.toFixed(2)}
              </span>
            </div>
          </motion.div>
        </SalaryFormCard>
      )}

      <SalaryFormCard title="Monthly Breakdown" className={"sm:col-span-3"}>
        {isMobile ? (
          <MobileMonthlyCards data={data} setData={setData} />
        ) : (
          <SalaryTable data={data} setData={setData} />
        )}
      </SalaryFormCard>
    </>
  );
}
