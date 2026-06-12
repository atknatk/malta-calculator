"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Euro, Calculator, Info, Scale, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import type { ChildCount, SimpleTaxType } from "@/config/malta-tax-config";
import {
  calculatePartTimeTax,
  formatCurrency,
  type PartTimeTaxOutput,
  type PartTimeWorkType,
} from "@/utils/part-time-tax-calculator";

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

export function PartTimeCalculator() {
  const [partTimeIncome, setPartTimeIncome] = useState(8000);
  const [workType, setWorkType] = useState<PartTimeWorkType>("employment");
  const [otherIncome, setOtherIncome] = useState(25000);
  const [taxType, setTaxType] = useState<SimpleTaxType>("single");
  const [childCount, setChildCount] = useState<ChildCount>(0);

  const result = useMemo<PartTimeTaxOutput>(() => {
    return calculatePartTimeTax({
      partTimeIncome,
      workType,
      otherIncome,
      taxType,
      childCount,
    });
  }, [partTimeIncome, workType, otherIncome, taxType, childCount]);

  const flatWins = result.recommended === "flat";

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 sm:space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Clock className="h-4 w-4" />
          Employment
        </div>
        <h1 className="font-cal text-3xl md:text-4xl font-bold">
          Part-Time Tax Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto px-2">
          Compare Malta&apos;s 10% part-time tax rate (TA22/TA23) with declaring
          the income at progressive rates.
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
              <span className="font-semibold">Part-Time Income</span>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Type of Part-Time Work
              </label>
              <ToggleGroup
                options={["employment", "selfEmployment"] as const}
                value={workType}
                onChange={setWorkType}
                labels={{
                  employment: "Employment (TA23)",
                  selfEmployment: "Self-Employed (TA22)",
                }}
              />
              <p className="text-xs text-muted-foreground">
                10% applies to the first{" "}
                <strong>{formatCurrency(result.cap)}</strong> per year for this
                type.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Euro className="h-4 w-4 text-primary/70" />
                Annual Part-Time Income
              </label>
              <NumericInput
                value={partTimeIncome}
                onChange={(v) => setPartTimeIncome(v === "" ? 0 : v)}
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
                Income From Your Main Job (annual)
              </label>
              <NumericInput
                value={otherIncome}
                onChange={(v) => setOtherIncome(v === "" ? 0 : v)}
                min={0}
                allowDecimals={false}
                suffix="€"
                className="h-12 text-base px-4"
              />
              <p className="text-xs text-muted-foreground">
                Used to work out your marginal rate if you declare instead.
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
              <span className="font-semibold">Best Option for You</span>
            </div>

            <div className="text-center py-4">
              <motion.div
                key={result.recommended}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl sm:text-3xl font-bold text-primary"
              >
                {result.recommended === "equal"
                  ? "Both options are equal"
                  : flatWins
                    ? "10% Part-Time Rate"
                    : "Declare at Progressive Rates"}
              </motion.div>
              {result.recommended !== "equal" && (
                <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                  Saves you{" "}
                  <strong className="text-green-600">
                    {formatCurrency(result.savings)}
                  </strong>{" "}
                  per year
                </p>
              )}
            </div>

            {/* Comparison — mobilde alt alta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                className={cn(
                  "p-4 rounded-2xl border space-y-1",
                  flatWins
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-background/50 border-border/50",
                )}
              >
                <p className="text-xs text-muted-foreground">
                  Option A — 10% Final Tax
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  {formatCurrency(result.flatOptionTax)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {result.excessAmount > 0
                    ? `10% on ${formatCurrency(result.cappedAmount)} + marginal tax on ${formatCurrency(result.excessAmount)} excess`
                    : `10% on ${formatCurrency(result.cappedAmount)}, final`}
                </p>
              </div>
              <div
                className={cn(
                  "p-4 rounded-2xl border space-y-1",
                  result.recommended === "declare"
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-background/50 border-border/50",
                )}
              >
                <p className="text-xs text-muted-foreground">
                  Option B — Full Declaration
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  {formatCurrency(result.declareOptionTax)}
                </p>
                <p className="text-xs text-muted-foreground">
                  At your {result.declareMarginalRate}% marginal rate
                </p>
              </div>
            </div>

            {result.excessAmount > 0 && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">
                    {formatCurrency(result.excessAmount)}
                  </strong>{" "}
                  exceeds the {formatCurrency(result.cap)} cap and must be
                  declared at progressive rates even under the 10% scheme.
                </p>
              </div>
            )}
          </div>

          {/* Eligibility */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex gap-3">
              <FileText className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  Eligibility for the 10% rate
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>
                    You must also have a full-time job, be a pensioner or a
                    full-time student
                  </li>
                  <li>
                    Self-employed: registered with Jobsplus, max 2 employees,
                    proper records kept
                  </li>
                  <li>
                    The part-time work must be for a different employer than
                    your full-time job
                  </li>
                  <li>
                    TA22/TA23 filing deadline: 30 April of the following year
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 rounded-xl bg-muted/30 flex items-center gap-3">
            <Info className="h-5 w-5 text-primary flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              The 10% option is <strong>not always cheaper</strong> — if your
              total income sits in Malta&apos;s 0% or 15% bands, declaring can
              beat the flat rate. This calculator checks both for you.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
