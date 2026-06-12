"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Euro,
  Calculator,
  Info,
  Scale,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import type { ChildCount, SimpleTaxType } from "@/config/malta-tax-config";
import {
  calculateExpatriateTax,
  formatCurrency,
  getHSIRules,
  type ExpatriateTaxOutput,
} from "@/utils/expatriate-tax-calculator";

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

export function ExpatriateTaxCalculator() {
  const [annualIncome, setAnnualIncome] = useState(100000);
  const [taxType, setTaxType] = useState<SimpleTaxType>("single");
  const [childCount, setChildCount] = useState<ChildCount>(0);

  const rules = getHSIRules();

  const result = useMemo<ExpatriateTaxOutput>(() => {
    return calculateExpatriateTax({ annualIncome, taxType, childCount });
  }, [annualIncome, taxType, childCount]);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 sm:space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Globe className="h-4 w-4" />
          Expat Tax
        </div>
        <h1 className="font-cal text-3xl md:text-4xl font-bold">
          Highly Skilled Individuals Tax Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto px-2">
          Malta&apos;s new 15% flat rate under L.N. 20 of 2026 — the framework
          replacing the HQP scheme. See your tax and savings vs standard rates.
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
              <span className="font-semibold">Employment Income</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Euro className="h-4 w-4 text-primary/70" />
                Annual Gross Employment Income
              </label>
              <NumericInput
                value={annualIncome}
                onChange={(v) => setAnnualIncome(v === "" ? 0 : v)}
                min={0}
                allowDecimals={false}
                suffix="€"
                className="h-14 sm:h-16 text-xl sm:text-2xl px-4 sm:px-5"
                suffixClassName="text-lg"
              />
              <p className="text-xs text-muted-foreground">
                Minimum €{rules.MIN_INCOME.toLocaleString("en-MT")} per year to
                qualify for the 15% rate.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Tax Status (for the standard-rate comparison)
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

            {/* Quick presets */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground/70">
                Common Salaries
              </p>
              <div className="flex flex-wrap gap-2">
                {[65000, 85000, 100000, 150000, 250000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setAnnualIncome(amount)}
                    className={cn(
                      "px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                      annualIncome === amount
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border border-border hover:bg-muted",
                    )}
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Eligible sectors */}
          <div className="p-4 rounded-xl bg-muted/30 space-y-2">
            <p className="text-sm font-medium text-foreground/70">
              Eligible Sectors (L.N. 20 of 2026)
            </p>
            <p className="text-xs text-muted-foreground">
              Financial services · Gaming · Aviation · Maritime · Oil & gas
              servicing · Family offices · Back office & treasury management.
              You must hold professional qualifications (or 5 years&apos;
              experience) and not be domiciled in Malta.
            </p>
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
                <Scale className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">
                {result.eligible ? "Your HSI Tax" : "Eligibility Check"}
              </span>
            </div>

            {result.eligible ? (
              <>
                <div className="text-center py-4 sm:py-6">
                  <motion.div
                    key={result.hsiTax}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary break-words"
                  >
                    {formatCurrency(result.hsiTax)}
                  </motion.div>
                  <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                    at the 15% flat rate
                    {result.savings > 0 && (
                      <>
                        {" "}
                        — saving{" "}
                        <strong className="text-green-600">
                          {formatCurrency(result.savings)}
                        </strong>
                        /year
                      </>
                    )}
                  </p>
                </div>

                {/* Comparison — mobilde alt alta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl border bg-green-500/10 border-green-500/30 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      HSI 15% Flat Rate
                    </p>
                    <p className="text-xl sm:text-2xl font-bold">
                      {formatCurrency(result.hsiTax)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Effective {result.hsiEffectiveRate.toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl border bg-background/50 border-border/50 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Standard Progressive
                    </p>
                    <p className="text-xl sm:text-2xl font-bold">
                      {formatCurrency(result.standardTax)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Marginal {result.standardMarginalRate}%
                    </p>
                  </div>
                </div>

                {result.amountAbove7M > 0 && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(result.amountAbove7M)} of your income
                      exceeds the €7,000,000 cap and is taxed at 35%.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="py-6 text-center space-y-3">
                <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
                <p className="text-lg font-semibold">
                  Below the €{rules.MIN_INCOME.toLocaleString("en-MT")}{" "}
                  threshold
                </p>
                <p className="text-sm text-muted-foreground px-2">
                  You need{" "}
                  <strong>{formatCurrency(result.shortfallToThreshold)}</strong>{" "}
                  more annual income to qualify for the HSI 15% rate. Standard
                  progressive rates apply: your tax would be{" "}
                  <strong>{formatCurrency(result.standardTax)}</strong>.
                </p>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  L.N. 20 of 2026 — Key Rules
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>
                    In force since <strong>1 January 2026</strong> — replaces
                    HQP and four other expat schemes
                  </li>
                  <li>
                    Benefit lasts 5 years, renewable twice; all benefits end on{" "}
                    {rules.SUNSET_DATE}
                  </li>
                  <li>Threshold rises by €10,000 every 5 years</li>
                  <li>
                    Requires private medical insurance and a valid travel
                    document; SSC contributions still apply
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
