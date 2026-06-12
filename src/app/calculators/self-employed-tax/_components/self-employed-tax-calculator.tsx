"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Euro,
  Calculator,
  Info,
  CalendarDays,
  Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import type { ChildCount, SimpleTaxType } from "@/config/malta-tax-config";
import {
  calculateSelfEmployedTax,
  formatCurrency,
  type SelfEmployedTaxOutput,
} from "@/utils/self-employed-tax-calculator";

// Mobile-first toggle: dar ekranda eşit bölünür, dokunma hedefi ≥44px
function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
  labels,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  labels?: Partial<Record<T, string>>;
}) {
  return (
    <div className="w-full grid auto-cols-fr grid-flow-col rounded-lg border border-input bg-background shadow-sm">
      {options.map((option, index) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "relative font-medium transition-all duration-200 min-h-12 text-sm px-2",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:z-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
            index === 0 && "rounded-l-lg",
            index === options.length - 1 && "rounded-r-lg",
            index !== 0 && "border-l border-input",
            value === option
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : "bg-background text-foreground",
          )}
        >
          {labels?.[option] || option}
        </button>
      ))}
    </div>
  );
}

export function SelfEmployedTaxCalculator() {
  const [grossRevenue, setGrossRevenue] = useState(40000);
  const [businessExpenses, setBusinessExpenses] = useState(8000);
  const [taxType, setTaxType] = useState<SimpleTaxType>("single");
  const [childCount, setChildCount] = useState<ChildCount>(0);
  const [bornBefore1962, setBornBefore1962] = useState<"no" | "yes">("no");

  const result = useMemo<SelfEmployedTaxOutput>(() => {
    return calculateSelfEmployedTax({
      grossRevenue,
      businessExpenses,
      taxType,
      childCount,
      bornBefore1962: bornBefore1962 === "yes",
    });
  }, [grossRevenue, businessExpenses, taxType, childCount, bornBefore1962]);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 sm:space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Briefcase className="h-4 w-4" />
          Self-Employed
        </div>
        <h1 className="font-cal text-3xl md:text-4xl font-bold">
          Self-Employed Tax Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto px-2">
          Income tax, Class 2 SSC and provisional tax instalments for
          self-occupied persons in Malta — all in one estimate for 2026.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border/50 space-y-5 sm:space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">Business Income</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Euro className="h-4 w-4 text-primary/70" />
                Annual Gross Revenue
              </label>
              <NumericInput
                value={grossRevenue}
                onChange={(v) => setGrossRevenue(v === "" ? 0 : v)}
                min={0}
                allowDecimals={false}
                suffix="€"
                className="h-14 sm:h-16 text-xl sm:text-2xl px-4 sm:px-5"
                suffixClassName="text-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Euro className="h-4 w-4 text-primary/70" />
                Deductible Business Expenses
              </label>
              <NumericInput
                value={businessExpenses}
                onChange={(v) => setBusinessExpenses(v === "" ? 0 : v)}
                min={0}
                allowDecimals={false}
                suffix="€"
                className="h-12 text-base px-4"
              />
              <p className="text-xs text-muted-foreground">
                Expenses incurred wholly and exclusively for the business (rent,
                materials, insurance, professional fees…).
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Tax Status
              </label>
              <ToggleGroup
                options={["single", "married", "parent"] as const}
                value={taxType}
                onChange={setTaxType}
                labels={{
                  single: "Single",
                  married: "Married",
                  parent: "Parent",
                }}
              />
              {taxType !== "single" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/70">
                    Dependent Children
                  </label>
                  <ToggleGroup
                    options={["0", "1", "2"] as const}
                    value={String(childCount) as "0" | "1" | "2"}
                    onChange={(v) => setChildCount(Number(v) as ChildCount)}
                    labels={{ "0": "None", "1": "1 child", "2": "2+" }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Were you born before 1962?
              </label>
              <ToggleGroup
                options={["no", "yes"] as const}
                value={bornBefore1962}
                onChange={setBornBefore1962}
                labels={{ no: "1962 or later", yes: "Before 1962" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Result Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 sm:space-y-6"
        >
          <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/20">
                <Percent className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">Your Net Income</span>
            </div>

            <div className="text-center py-4 sm:py-6">
              <motion.div
                key={result.netIncome}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary break-words"
              >
                {formatCurrency(result.netIncome)}
              </motion.div>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                after tax & SSC · effective burden{" "}
                <strong>{result.effectiveRate.toFixed(1)}%</strong>
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Net Profit (taxable)
                </span>
                <span className="font-semibold">
                  {formatCurrency(result.netProfit)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Income Tax (marginal {result.marginalRate}%)
                </span>
                <span className="font-semibold">
                  -{formatCurrency(result.incomeTax)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Class 2 SSC (category {result.sscCategory})
                </span>
                <span className="font-semibold">
                  -{formatCurrency(result.sscAnnual)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-primary/10 border border-primary/20">
                <span className="text-sm font-medium">Total Burden</span>
                <span className="font-bold text-primary">
                  {formatCurrency(result.totalBurden)}
                </span>
              </div>
            </div>
          </div>

          {/* PT instalments */}
          <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-500/20 space-y-4">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-emerald-600" />
              <span className="font-semibold text-sm">
                Provisional Tax Instalments (20% / 30% / 50%)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {result.ptInstalments.map((inst) => (
                <div
                  key={inst.label}
                  className="p-3 rounded-xl bg-background/60 text-center"
                >
                  <p className="text-xs text-muted-foreground">{inst.label}</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(inst.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  Important Notes
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>
                    Class 2 SSC is legally based on the{" "}
                    <strong>previous year&apos;s</strong> net income — this
                    estimate uses your current profit
                  </li>
                  <li>
                    Provisional tax is based on your last self-assessment; new
                    businesses may have no PT in year one
                  </li>
                  <li>
                    Working part-time alongside a job? The 10% TA22 regime may
                    be cheaper — see our part-time calculator
                  </li>
                  <li>2026 brackets and Class 2 rates (MTCA)</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
