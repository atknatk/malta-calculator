"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Home, Euro, Calculator, Info, Percent, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import type { ChildCount, SimpleTaxType } from "@/config/malta-tax-config";
import {
  calculateRentalTax,
  formatCurrency,
  type RentalTaxOutput,
} from "@/utils/rental-tax-calculator";

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

export function RentalTaxCalculator() {
  const [grossRent, setGrossRent] = useState(12000);
  const [otherIncome, setOtherIncome] = useState(25000);
  const [taxType, setTaxType] = useState<SimpleTaxType>("single");
  const [childCount, setChildCount] = useState<ChildCount>(0);
  const [groundRent, setGroundRent] = useState(0);
  const [licenceFee, setLicenceFee] = useState(0);
  const [loanInterest, setLoanInterest] = useState(0);

  const result = useMemo<RentalTaxOutput>(() => {
    return calculateRentalTax({
      grossRent,
      otherIncome,
      taxType,
      childCount,
      groundRent,
      licenceFee,
      loanInterest,
    });
  }, [
    grossRent,
    otherIncome,
    taxType,
    childCount,
    groundRent,
    licenceFee,
    loanInterest,
  ]);

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
          <Home className="h-4 w-4" />
          Property Tax
        </div>
        <h1 className="font-cal text-3xl md:text-4xl font-bold">
          Rental Income Tax Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto px-2">
          Compare Malta&apos;s 15% flat rate (TA24) against declaring rent at
          progressive rates — and see which saves you money.
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
              <span className="font-semibold">Rental Details</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Euro className="h-4 w-4 text-primary/70" />
                Annual Gross Rental Income
              </label>
              <NumericInput
                value={grossRent}
                onChange={(v) => setGrossRent(v === "" ? 0 : v)}
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
                Other Annual Income (salary etc.)
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
                Determines the marginal rate used in the progressive option.
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

            <div className="pt-2 border-t border-border/50 space-y-4">
              <p className="text-sm font-medium text-foreground/70">
                Deductions (progressive option only)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Ground Rent
                  </label>
                  <NumericInput
                    value={groundRent}
                    onChange={(v) => setGroundRent(v === "" ? 0 : v)}
                    min={0}
                    allowDecimals={false}
                    suffix="€"
                    className="h-12 text-base px-3"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Licence Fee
                  </label>
                  <NumericInput
                    value={licenceFee}
                    onChange={(v) => setLicenceFee(v === "" ? 0 : v)}
                    min={0}
                    allowDecimals={false}
                    suffix="€"
                    className="h-12 text-base px-3"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Loan Interest
                  </label>
                  <NumericInput
                    value={loanInterest}
                    onChange={(v) => setLoanInterest(v === "" ? 0 : v)}
                    min={0}
                    allowDecimals={false}
                    suffix="€"
                    className="h-12 text-base px-3"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                A 20% maintenance allowance is applied automatically on the
                progressive route.
              </p>
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
          {/* Recommendation Card */}
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
                    ? "15% Flat Rate (TA24)"
                    : "Progressive Declaration"}
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

            {/* Side-by-side comparison — mobilde alt alta */}
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
                  Option A — TA24 Flat
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  {formatCurrency(result.flatTax)}
                </p>
                <p className="text-xs text-muted-foreground">
                  15% of gross rent, no deductions, final tax
                </p>
              </div>
              <div
                className={cn(
                  "p-4 rounded-2xl border space-y-1",
                  result.recommended === "progressive"
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-background/50 border-border/50",
                )}
              >
                <p className="text-xs text-muted-foreground">
                  Option B — Progressive
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  {formatCurrency(result.progressiveTax)}
                </p>
                <p className="text-xs text-muted-foreground">
                  At your {result.progressiveMarginalRate}% marginal rate after
                  deductions
                </p>
              </div>
            </div>

            {/* Progressive breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Maintenance Allowance (20%)
                </span>
                <span className="font-semibold text-sm">
                  -{formatCurrency(result.maintenanceAllowance)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Total Deductions
                </span>
                <span className="font-semibold text-sm">
                  -{formatCurrency(result.totalDeductions)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Taxable Profit (progressive)
                </span>
                <span className="font-semibold text-sm">
                  {formatCurrency(result.taxableProfit)}
                </span>
              </div>
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
                    The 15% TA24 rate is a <strong>final</strong> tax on gross
                    rent — no expenses can be deducted
                  </li>
                  <li>
                    One method per year, applied to all your rental properties
                  </li>
                  <li>
                    Progressive route: deduct ground rent, licence fees, loan
                    interest + 20% maintenance allowance
                  </li>
                  <li>TA24 is due by 30 April of the following year</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Rate badge */}
          <div className="p-4 rounded-xl bg-muted/30 flex items-center gap-3">
            <Percent className="h-5 w-5 text-primary flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Effective rate on your gross rent:{" "}
              <strong className="text-foreground">
                {grossRent > 0
                  ? (
                      (Math.min(result.flatTax, result.progressiveTax) /
                        grossRent) *
                      100
                    ).toFixed(1)
                  : "0"}
                %
              </strong>{" "}
              with the recommended option
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
