"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Gift,
  Euro,
  Calculator,
  Info,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import type { ChildCount, SimpleTaxType } from "@/config/malta-tax-config";
import {
  calculateBonusTax,
  formatCurrency,
  type BonusTaxOutput,
} from "@/utils/bonus-tax-calculator";

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

export function BonusTaxCalculator() {
  const [annualSalary, setAnnualSalary] = useState(30000);
  const [bonusAmount, setBonusAmount] = useState(2000);
  const [taxType, setTaxType] = useState<SimpleTaxType>("single");
  const [childCount, setChildCount] = useState<ChildCount>(0);

  const result = useMemo<BonusTaxOutput>(() => {
    return calculateBonusTax({
      annualSalary,
      bonusAmount,
      taxType,
      childCount,
    });
  }, [annualSalary, bonusAmount, taxType, childCount]);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 sm:space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Gift className="h-4 w-4" />
          Employment
        </div>
        <h1 className="font-cal text-3xl md:text-4xl font-bold">
          Bonus Tax Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto px-2">
          See exactly how much tax Malta&apos;s FSS system takes from your bonus
          — and what lands in your pocket.
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
              <span className="font-semibold">Salary & Bonus</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Euro className="h-4 w-4 text-primary/70" />
                Annual Gross Salary (excluding bonus)
              </label>
              <NumericInput
                value={annualSalary}
                onChange={(v) => setAnnualSalary(v === "" ? 0 : v)}
                min={0}
                allowDecimals={false}
                suffix="€"
                className="h-14 sm:h-16 text-xl sm:text-2xl px-4 sm:px-5"
                suffixClassName="text-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Gift className="h-4 w-4 text-primary/70" />
                Bonus Amount
              </label>
              <NumericInput
                value={bonusAmount}
                onChange={(v) => setBonusAmount(v === "" ? 0 : v)}
                min={0}
                allowDecimals={false}
                suffix="€"
                className="h-14 sm:h-16 text-xl sm:text-2xl px-4 sm:px-5"
                suffixClassName="text-lg"
              />
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
          </div>

          {/* Quick presets */}
          <div className="p-4 rounded-xl bg-muted/30 space-y-3">
            <p className="text-sm font-medium text-foreground/70">
              Common Bonus Amounts
            </p>
            <div className="flex flex-wrap gap-2">
              {[500, 1000, 2000, 5000, 10000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBonusAmount(amount)}
                  className={cn(
                    "px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                    bonusAmount === amount
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border border-border hover:bg-muted",
                  )}
                >
                  {formatCurrency(amount)}
                </button>
              ))}
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
                <Gift className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">Your Net Bonus</span>
            </div>

            <div className="text-center py-4 sm:py-6">
              <motion.div
                key={result.netBonus}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary break-words"
              >
                {formatCurrency(result.netBonus)}
              </motion.div>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                Tax on bonus: <strong>{formatCurrency(result.bonusTax)}</strong>{" "}
                ({result.bonusEffectiveRate.toFixed(1)}%)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Gross Bonus
                </span>
                <span className="font-semibold">
                  {formatCurrency(bonusAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Marginal Tax Rate Applied
                </span>
                <span className="font-semibold">{result.marginalRate}%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Annual Tax (salary only)
                </span>
                <span className="font-semibold">
                  {formatCurrency(result.salaryOnlyTax)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Annual Tax (salary + bonus)
                </span>
                <span className="font-semibold">
                  {formatCurrency(result.totalTax)}
                </span>
              </div>
            </div>
          </div>

          {/* Bracket warning */}
          {result.pushesToHigherBracket && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">
                    Bracket jump
                  </p>
                  <p className="text-muted-foreground text-xs">
                    This bonus pushes part of your income into the{" "}
                    {result.marginalRate}% bracket. Only the portion above the
                    threshold is taxed at the higher rate — your existing salary
                    is not re-taxed.
                  </p>
                </div>
              </div>
            </div>
          )}

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
                    Bonuses are taxed at your <strong>marginal rate</strong>{" "}
                    under FSS — there is no separate &quot;bonus tax&quot; in
                    Malta
                  </li>
                  <li>
                    SSC is calculated on your basic weekly wage —{" "}
                    <strong>not</strong> on bonuses
                  </li>
                  <li>
                    The statutory government bonus (COLA) is separate from
                    performance bonuses
                  </li>
                  <li>Uses 2026 tax brackets for your selected status</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted/30 flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Of every €100 bonus, you keep{" "}
              <strong className="text-foreground">
                €{(100 - result.bonusEffectiveRate).toFixed(0)}
              </strong>{" "}
              at your current income level.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
