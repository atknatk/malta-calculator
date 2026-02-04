"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Euro,
  Calculator,
  Info,
  Percent,
  Calendar,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  calculateMortgage,
  formatCurrency,
  formatCurrencyDecimal,
  getMortgageInfo,
  MORTGAGE_CONSTRAINTS,
  type MortgageOutput,
} from "@/utils/mortgage-calculator";

// Premium Toggle Group
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
    <div className="w-full inline-flex items-center rounded-lg border border-input bg-background shadow-sm">
      {options.map((option, index) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "flex-1 relative font-medium transition-all duration-200 h-12 text-sm px-4",
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

export function MortgageCalculator() {
  const [propertyPrice, setPropertyPrice] = useState(300000);
  const [depositPercent, setDepositPercent] = useState(20);
  const [interestRate, setInterestRate] = useState<number>(
    MORTGAGE_CONSTRAINTS.DEFAULT_INTEREST_RATE,
  );
  const [loanTermYears, setLoanTermYears] = useState(25);
  const [showSchedule, setShowSchedule] = useState(false);

  const result = useMemo<MortgageOutput>(() => {
    return calculateMortgage({
      propertyPrice,
      depositPercent: Math.max(
        depositPercent,
        MORTGAGE_CONSTRAINTS.MIN_DEPOSIT_PERCENT,
      ),
      interestRate,
      loanTermYears,
    });
  }, [propertyPrice, depositPercent, interestRate, loanTermYears]);

  const info = getMortgageInfo();

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Home className="h-4 w-4" />
          Home Loan
        </div>
        <h1 className="font-cal text-3xl md:text-4xl font-bold">
          Mortgage Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Calculate your monthly mortgage payments and see a detailed breakdown.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border/50 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">Loan Details</span>
            </div>

            {/* Property Price Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Euro className="h-4 w-4 text-primary/70" />
                Property Price
              </label>
              <NumericInput
                value={propertyPrice}
                onChange={(v) => setPropertyPrice(v === "" ? 50000 : v)}
                min={50000}
                allowDecimals={false}
                suffix="€"
                className="h-14 text-xl px-5"
                suffixClassName="text-base"
              />
            </div>

            {/* Deposit Percentage */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-primary/70" />
                  Deposit
                </span>
                <span className="text-primary font-semibold">
                  {depositPercent}% ({formatCurrency(result.depositAmount)})
                </span>
              </label>
              <input
                type="range"
                min={info.minDepositPercent}
                max="50"
                value={depositPercent}
                onChange={(e) => setDepositPercent(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{info.minDepositPercent}% (min)</span>
                <span>50%</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-primary/70" />
                  Interest Rate
                </span>
                <span className="text-primary font-semibold">
                  {interestRate.toFixed(2)}%
                </span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1%</span>
                <span>10%</span>
              </div>
            </div>

            {/* Loan Term */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary/70" />
                  Loan Term
                </span>
                <span className="text-primary font-semibold">
                  {loanTermYears} years
                </span>
              </label>
              <input
                type="range"
                min={info.minTermYears}
                max={info.maxTermYears}
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{info.minTermYears} years</span>
                <span>{info.maxTermYears} years</span>
              </div>
            </div>
          </div>

          {/* Quick presets */}
          <div className="p-4 rounded-xl bg-muted/30 space-y-3">
            <p className="text-sm font-medium text-foreground/70">
              Property Price Presets
            </p>
            <div className="flex flex-wrap gap-2">
              {[150000, 250000, 350000, 500000, 750000].map((price) => (
                <button
                  key={price}
                  onClick={() => setPropertyPrice(price)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    propertyPrice === price
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border border-border hover:bg-muted",
                  )}
                >
                  {formatCurrency(price)}
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
          className="space-y-6"
        >
          {/* Main Result Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/20">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">Monthly Payment</span>
            </div>

            <div className="text-center py-6">
              <motion.div
                key={result.monthlyPayment}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl md:text-6xl font-bold text-primary"
              >
                {formatCurrencyDecimal(result.monthlyPayment)}
              </motion.div>
              <p className="text-muted-foreground mt-2">
                per month for <strong>{loanTermYears} years</strong>
              </p>
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Property Price
                </span>
                <span className="font-semibold">
                  {formatCurrency(propertyPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Deposit ({depositPercent}%)
                </span>
                <span className="font-semibold text-green-600">
                  -{formatCurrency(result.depositAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-primary/10 border border-primary/20">
                <span className="text-sm text-muted-foreground">
                  Loan Amount
                </span>
                <span className="font-semibold text-primary">
                  {formatCurrency(result.loanAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Total Interest
                </span>
                <span className="font-semibold text-amber-600">
                  {formatCurrency(result.totalInterest)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Total Cost
                </span>
                <span className="font-semibold">
                  {formatCurrency(result.totalCost)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">LTV Ratio</span>
                <span className="font-semibold">{result.ltvRatio}%</span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  Malta Mortgage Info
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>
                    Minimum deposit is <strong>10%</strong> of property value
                  </li>
                  <li>Maximum LTV (Loan-to-Value) is 90%</li>
                  <li>Typical loan terms are 25-30 years</li>
                  <li>Interest rates vary between banks</li>
                  <li>Additional costs: stamp duty, notary fees, bank fees</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Toggle Schedule */}
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="w-full py-3 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium"
          >
            {showSchedule ? "Hide" : "Show"} Yearly Amortization Schedule
          </button>
        </motion.div>
      </div>

      {/* Amortization Schedule */}
      {showSchedule && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-x-auto"
        >
          <div className="p-6 rounded-3xl bg-muted/30 border border-border/50">
            <h3 className="font-semibold mb-4">Yearly Amortization Schedule</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 font-medium">Year</th>
                  <th className="text-right p-2 font-medium">Principal</th>
                  <th className="text-right p-2 font-medium">Interest</th>
                  <th className="text-right p-2 font-medium">Total</th>
                  <th className="text-right p-2 font-medium">Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.yearlySchedule.slice(0, 10).map((row) => (
                  <tr key={row.year} className="border-b border-border/50">
                    <td className="p-2">{row.year}</td>
                    <td className="text-right p-2">
                      {formatCurrency(row.principalPaid)}
                    </td>
                    <td className="text-right p-2 text-amber-600">
                      {formatCurrency(row.interestPaid)}
                    </td>
                    <td className="text-right p-2">
                      {formatCurrency(row.totalPaid)}
                    </td>
                    <td className="text-right p-2 font-medium">
                      {formatCurrency(row.remainingBalance)}
                    </td>
                  </tr>
                ))}
                {result.yearlySchedule.length > 10 && (
                  <tr className="text-muted-foreground">
                    <td colSpan={5} className="p-2 text-center">
                      ... and {result.yearlySchedule.length - 10} more years
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
