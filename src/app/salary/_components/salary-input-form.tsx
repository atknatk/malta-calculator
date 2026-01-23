"use client";
import { z } from "zod";
import { Month } from "@/types/salary-calculator-type";
import { useEffect, useState, useRef } from "react";
import { getAvailableYears, isChildCountEffective } from "@/config/malta-tax-config";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Settings2, Euro, Calendar, Users, Shield, Gift, Wallet, Sparkles, Baby } from "lucide-react";
import { cn } from "@/lib/utils";

const monthValues = Object.values(Month) as [Month, ...Month[]];
const allYears = getAvailableYears().map(y => y.toString());
// Only show last 3 years for cleaner UI
const availableYears = allYears.slice(-3) as [string, ...string[]];
const currentYear = new Date().getFullYear().toString();

// Form values type - URL params ile uyumlu
export type SalaryFormValues = {
  grossSalary: number;
  year: string;
  taxRateType: "single" | "married" | "parent";
  childCount: 0 | 1 | 2;  // Çocuk sayısı: 0, 1, 2+ (2026+ için etkili)
  sscCategory: "A" | "B" | "C";
  birthYear: number;
  startOfMonth?: Month;
  endOfMonth?: Month;
  yearlyNonTaxBenefit: number;
  yearlyTaxableBenefit: number;
  monthlyBonus: number;
  allowanceBonus: number;
};

// Premium Number Input Component - Mobile Optimized
function PremiumInput({
  icon: Icon,
  label,
  value,
  onChange,
  suffix,
  description,
  large,
}: {
  icon?: typeof Euro;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  suffix?: string;
  description?: string;
  large?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-primary/70" />}
        {label}
      </label>
      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="number"
            step="100"
            inputMode="decimal"
            pattern="[0-9]*"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            className={cn(
              "w-full bg-background border border-border",
              "focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none",
              "text-foreground font-semibold placeholder:text-muted-foreground/50",
              "transition-all duration-200 rounded-xl",
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
              large
                ? "h-16 text-2xl px-5 pr-16"
                : "h-14 text-lg px-4 pr-12"
            )}
          />
          {suffix && (
            <div className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 font-medium text-muted-foreground/70",
              large ? "text-lg" : "text-base"
            )}>
              {suffix}
            </div>
          )}
        </div>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground/60 pl-1">{description}</p>
      )}
    </motion.div>
  );
}

// Premium Toggle Group with shadcn outline button group style
function PremiumToggleGroup<T extends string>({
  options,
  value,
  onChange,
  labels,
  size = "default",
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  labels?: Partial<Record<T, string>>;
  size?: "sm" | "default" | "lg";
}) {
  const sizeClasses = {
    sm: "h-10 text-xs px-4",
    default: "h-12 text-sm px-5",
    lg: "h-14 text-base px-6",
  };

  return (
    <div className="w-full inline-flex items-center rounded-lg border border-input bg-background shadow-sm">
      {options.map((option, index) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "flex-1 relative font-medium transition-all duration-200",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:z-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
            // First item - rounded left
            index === 0 && "rounded-l-lg",
            // Last item - rounded right
            index === options.length - 1 && "rounded-r-lg",
            // Middle items - no rounding
            index !== 0 && index !== options.length - 1 && "rounded-none",
            // Divider between items
            index !== 0 && "border-l border-input",
            // Selected state
            value === option
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : "bg-background text-foreground",
            sizeClasses[size]
          )}
        >
          {labels?.[option] || option}
        </button>
      ))}
    </div>
  );
}

// Section with glassmorphism
function GlassSection({
  icon: Icon,
  title,
  children,
  delay = 0,
}: {
  icon: typeof Settings2;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/25 via-blue-500/20 to-violet-500/15 border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <span className="font-semibold text-foreground tracking-tight">{title}</span>
      </div>
      <div className="space-y-4 pl-1">
        {children}
      </div>
    </motion.div>
  );
}

// Collapsible Advanced Settings
function AdvancedSettings({
  isOpen,
  onToggle,
  children,
}: {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300",
          "bg-gradient-to-r from-slate-50 via-cyan-50/30 to-blue-50/20 dark:from-slate-800/90 dark:via-cyan-900/20 dark:to-blue-900/10 hover:from-slate-100 hover:via-cyan-100/40 hover:to-blue-100/30",
          "border border-border/30 hover:border-border/50",
          "group"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Settings2 className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground">Advanced Settings</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="p-1"
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-6 space-y-6 px-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SalaryCalculatorForm({
  values: valuesProp,
  onValuesChange: onValuesChangeProp,
}: {
  values?: Partial<SalaryFormValues>;
  onValuesChange?: (values: Partial<SalaryFormValues>) => void;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Default values merged with props
  const formValues: SalaryFormValues = {
    grossSalary: valuesProp?.grossSalary ?? 36000,
    year: valuesProp?.year ?? currentYear,
    taxRateType: valuesProp?.taxRateType ?? "single",
    childCount: valuesProp?.childCount ?? 0,
    sscCategory: valuesProp?.sscCategory ?? "C",
    birthYear: valuesProp?.birthYear ?? 1990,
    startOfMonth: valuesProp?.startOfMonth ?? Month.January,
    endOfMonth: valuesProp?.endOfMonth ?? Month.December,
    yearlyNonTaxBenefit: valuesProp?.yearlyNonTaxBenefit ?? 0,
    yearlyTaxableBenefit: valuesProp?.yearlyTaxableBenefit ?? 0,
    monthlyBonus: valuesProp?.monthlyBonus ?? 0,
    allowanceBonus: valuesProp?.allowanceBonus ?? 0,
  };

  // Çocuk sayısı seçici gösterilsin mi?
  const showChildCount = isChildCountEffective(parseInt(formValues.year)) &&
    (formValues.taxRateType === 'married' || formValues.taxRateType === 'parent');

  const updateValue = <K extends keyof SalaryFormValues>(key: K, value: SalaryFormValues[K]) => {
    onValuesChangeProp?.({ ...valuesProp, [key]: value });
  };

  return (
    <div className="space-y-8">
      {/* Hero Section - Gross Salary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-violet-500/15 rounded-3xl" />

        <div className="relative p-6 rounded-3xl border border-primary/10 space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold text-sm uppercase tracking-wide">Your Salary</span>
          </div>

          <PremiumInput
            label="Annual Gross Salary"
            value={formValues.grossSalary || ""}
            onChange={(v) => updateValue("grossSalary", v === "" ? 0 : parseFloat(v) || 0)}
            suffix="€/yr"
            description="Enter your total annual gross salary before any deductions"
            large
          />
        </div>
      </motion.div>

      {/* Primary Settings */}
      <div className="space-y-6">
        <GlassSection icon={Calendar} title="Tax Year" delay={0.1}>
          <PremiumToggleGroup
            options={availableYears}
            value={formValues.year}
            onChange={(v) => updateValue("year", v)}
            size="lg"
          />
        </GlassSection>

        <GlassSection icon={Users} title="Tax Rate Type" delay={0.15}>
          <PremiumToggleGroup
            options={["single", "married", "parent"] as const}
            value={formValues.taxRateType}
            onChange={(v) => {
              // Single seçildiğinde childCount'u da sıfırla, tek çağrıda güncelle
              if (v === 'single') {
                onValuesChangeProp?.({ ...valuesProp, taxRateType: v, childCount: 0 });
              } else {
                updateValue("taxRateType", v);
              }
            }}
            labels={{
              single: "👤 Single",
              married: "💑 Married",
              parent: "👨‍👩‍👧 Parent",
            }}
            size="lg"
          />
        </GlassSection>

        {/* Çocuk Sayısı - 2026+ için ve married/parent seçildiğinde göster */}
        <AnimatePresence>
          {showChildCount && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GlassSection icon={Baby} title="Number of Children" delay={0.18}>
                <PremiumToggleGroup
                  options={["0", "1", "2"] as const}
                  value={formValues.childCount.toString() as "0" | "1" | "2"}
                  onChange={(v) => updateValue("childCount", parseInt(v) as 0 | 1 | 2)}
                  labels={{
                    "0": "No children",
                    "1": "1 child",
                    "2": "2+ children",
                  }}
                  size="default"
                />
                <p className="text-xs text-muted-foreground/60 mt-2">
                  From 2026, tax rates vary based on the number of children. This affects your tax deductions.
                </p>
              </GlassSection>
            </motion.div>
          )}
        </AnimatePresence>

        <GlassSection icon={Shield} title="SSC Category" delay={0.2}>
          <PremiumToggleGroup
            options={["A", "B", "C"] as const}
            value={formValues.sscCategory}
            onChange={(v) => updateValue("sscCategory", v)}
            labels={{
              A: "Under 18",
              B: "Part-time",
              C: "Full-time",
            }}
            size="default"
          />
          <p className="text-xs text-muted-foreground/60">
            Category C is the standard for full-time employees. SSC rates vary based on birth year (before/after 1962).
          </p>
        </GlassSection>
      </div>

      {/* Advanced Settings */}
      <AdvancedSettings isOpen={showAdvanced} onToggle={() => setShowAdvanced(!showAdvanced)}>
        {/* Birth Year */}
        <PremiumInput
          icon={Calendar}
          label="Birth Year"
          value={formValues.birthYear}
          onChange={(v) => updateValue("birthYear", parseInt(v) || 1990)}
          description="Used to determine SSC rates (born before/after 1962)"
        />

        {/* Period Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">Start Month</label>
            <select
              value={formValues.startOfMonth}
              onChange={(e) => updateValue("startOfMonth", e.target.value as Month)}
              className="w-full h-12 px-4 rounded-xl bg-background/80 backdrop-blur-sm border-2 border-border/50 
                         focus:border-primary focus:ring-0 focus:outline-none
                         text-foreground font-medium transition-all duration-300 appearance-none
                         cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
            >
              {monthValues.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">End Month</label>
            <select
              value={formValues.endOfMonth}
              onChange={(e) => updateValue("endOfMonth", e.target.value as Month)}
              className="w-full h-12 px-4 rounded-xl bg-background/80 backdrop-blur-sm border-2 border-border/50 
                         focus:border-primary focus:ring-0 focus:outline-none
                         text-foreground font-medium transition-all duration-300 appearance-none
                         cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
            >
              {monthValues.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Benefits Section */}
        <GlassSection icon={Gift} title="Benefits" delay={0}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PremiumInput
              label="Yearly Non-Tax Benefit"
              value={formValues.yearlyNonTaxBenefit}
              onChange={(v) => updateValue("yearlyNonTaxBenefit", parseFloat(v) || 0)}
              suffix="€"
            />
            <PremiumInput
              label="Yearly Taxable Benefit"
              value={formValues.yearlyTaxableBenefit}
              onChange={(v) => updateValue("yearlyTaxableBenefit", parseFloat(v) || 0)}
              suffix="€"
            />
          </div>
        </GlassSection>

        {/* Bonus Section */}
        <GlassSection icon={Wallet} title="Bonuses" delay={0}>
          <PremiumInput
            label="Monthly Bonus"
            value={formValues.monthlyBonus}
            onChange={(v) => updateValue("monthlyBonus", parseFloat(v) || 0)}
            suffix="€"
          />
          <PremiumInput
            label="Monthly Allowance"
            value={formValues.allowanceBonus}
            onChange={(v) => updateValue("allowanceBonus", parseFloat(v) || 0)}
            suffix="€"
          />
        </GlassSection>
      </AdvancedSettings>
    </div>
  );
}
