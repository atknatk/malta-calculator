"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Car,
  Euro,
  Calculator,
  Calendar,
  Percent,
  TrendingUp,
  Wallet,
  Banknote,
  Info,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  calculateVehicleFinance,
  formatCurrency,
  formatCurrencyPrecise,
  formatTerm,
  MALTA_LENDER_BENCHMARKS,
  VEHICLE_FINANCE_CONSTRAINTS,
  type VehicleFinanceResult,
} from "@/utils/vehicle-finance-calculator";

const PRICE_PRESETS = [
  { label: "Used Car", value: 12_000 },
  { label: "Family Car", value: 25_000 },
  { label: "SUV", value: 40_000 },
  { label: "Premium", value: 60_000 },
];

export function VehicleFinanceCalculator() {
  const [totalPrice, setTotalPrice] = useState<number>(
    VEHICLE_FINANCE_CONSTRAINTS.DEFAULT_PRICE,
  );
  const [depositPercent, setDepositPercent] = useState<number>(
    VEHICLE_FINANCE_CONSTRAINTS.DEFAULT_DEPOSIT_PERCENT,
  );
  const [termMonths, setTermMonths] = useState<number>(
    VEHICLE_FINANCE_CONSTRAINTS.DEFAULT_TERM_MONTHS,
  );
  const [annualRate, setAnnualRate] = useState<number>(
    VEHICLE_FINANCE_CONSTRAINTS.DEFAULT_RATE,
  );
  const [showSchedule, setShowSchedule] = useState(false);
  const [showLenders, setShowLenders] = useState(false);

  const result = useMemo<VehicleFinanceResult>(
    () =>
      calculateVehicleFinance({
        totalPrice,
        depositPercent,
        termMonths,
        annualInterestRate: annualRate,
      }),
    [totalPrice, depositPercent, termMonths, annualRate],
  );

  // Cost breakdown bars (0-100% of largest item)
  const breakdown = [
    {
      label: "Vehicle Price",
      value: totalPrice,
      tone: "bg-cyan-500/70",
    },
    {
      label: "Deposit (Down Payment)",
      value: result.depositAmount,
      tone: "bg-emerald-500/70",
    },
    {
      label: "Total Interest",
      value: result.totalInterest,
      tone: "bg-amber-500/70",
    },
    {
      label: "Grand Total Cost",
      value: result.grandTotal,
      tone: "bg-violet-500/70",
    },
  ];
  const maxBar = Math.max(...breakdown.map((b) => b.value), 1);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 sm:space-y-4 px-2"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 text-xs sm:text-sm font-medium">
          <Car className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Malta Vehicle Finance
        </div>
        <h1 className="font-cal text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
          Vehicle Finance Calculator
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Estimate your deposit, monthly instalment and total cost for a car
          loan or hire purchase agreement in Malta.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* INPUTS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 sm:space-y-6"
        >
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-cyan-500/5 via-background to-secondary/5 border border-border/50 space-y-5 sm:space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl bg-cyan-500/10">
                <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-600" />
              </div>
              <span className="font-semibold text-sm sm:text-base">
                Finance Details
              </span>
            </div>

            {/* Total price */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Euro className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-500/70" />
                Vehicle / Asset Price
              </label>
              <NumericInput
                value={totalPrice}
                onChange={(v) =>
                  setTotalPrice(
                    v === "" ? VEHICLE_FINANCE_CONSTRAINTS.MIN_PRICE : v,
                  )
                }
                min={VEHICLE_FINANCE_CONSTRAINTS.MIN_PRICE}
                max={VEHICLE_FINANCE_CONSTRAINTS.MAX_PRICE}
                allowDecimals={false}
                suffix="€"
                className="h-12 sm:h-14 text-lg sm:text-xl px-4 sm:px-5 focus:border-cyan-500 focus:ring-cyan-500/20"
              />
              <input
                type="range"
                min={VEHICLE_FINANCE_CONSTRAINTS.MIN_PRICE}
                max={VEHICLE_FINANCE_CONSTRAINTS.MAX_PRICE}
                step={500}
                value={totalPrice}
                onChange={(e) => setTotalPrice(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-cyan-500"
                aria-label="Vehicle price slider"
              />
              <div className="flex justify-between text-[11px] sm:text-xs text-muted-foreground">
                <span>
                  {formatCurrency(VEHICLE_FINANCE_CONSTRAINTS.MIN_PRICE)}
                </span>
                <span>
                  {formatCurrency(VEHICLE_FINANCE_CONSTRAINTS.MAX_PRICE)}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2">
                {PRICE_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setTotalPrice(preset.value)}
                    className={cn(
                      "px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-all border",
                      totalPrice === preset.value
                        ? "bg-cyan-500 text-white border-cyan-500"
                        : "bg-background border-border hover:bg-muted",
                    )}
                  >
                    {preset.label} · {formatCurrency(preset.value)}
                  </button>
                ))}
              </div>
            </div>

            {/* Deposit */}
            <div className="space-y-2 sm:space-y-3">
              <label className="text-xs sm:text-sm font-medium text-foreground/70 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Wallet className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-500/70" />
                  Deposit
                </span>
                <span className="text-cyan-600 font-semibold tabular-nums">
                  {depositPercent}% · {formatCurrency(result.depositAmount)}
                </span>
              </label>
              <input
                type="range"
                min={VEHICLE_FINANCE_CONSTRAINTS.MIN_DEPOSIT_PERCENT}
                max={VEHICLE_FINANCE_CONSTRAINTS.MAX_DEPOSIT_PERCENT}
                step={5}
                value={depositPercent}
                onChange={(e) =>
                  setDepositPercent(parseInt(e.target.value, 10))
                }
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-cyan-500"
                aria-label="Deposit percentage slider"
              />
              <div className="flex justify-between text-[11px] sm:text-xs text-muted-foreground">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>80%</span>
              </div>
            </div>

            {/* Term */}
            <div className="space-y-2 sm:space-y-3">
              <label className="text-xs sm:text-sm font-medium text-foreground/70 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-500/70" />
                  Repayment Term
                </span>
                <span className="text-cyan-600 font-semibold tabular-nums">
                  {termMonths} mo · {formatTerm(termMonths)}
                </span>
              </label>
              <input
                type="range"
                min={VEHICLE_FINANCE_CONSTRAINTS.MIN_TERM_MONTHS}
                max={VEHICLE_FINANCE_CONSTRAINTS.MAX_TERM_MONTHS}
                step={6}
                value={termMonths}
                onChange={(e) => setTermMonths(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-cyan-500"
                aria-label="Term in months slider"
              />
              <div className="flex justify-between text-[11px] sm:text-xs text-muted-foreground">
                <span>1 yr</span>
                <span>5 yrs</span>
                <span>7 yrs</span>
                <span>10 yrs</span>
              </div>
            </div>

            {/* Interest rate */}
            <div className="space-y-2 sm:space-y-3">
              <label className="text-xs sm:text-sm font-medium text-foreground/70 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Percent className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-500/70" />
                  Annual Interest Rate
                </span>
                <span className="text-cyan-600 font-semibold tabular-nums">
                  {annualRate.toFixed(1)}%
                </span>
              </label>
              <input
                type="range"
                min={VEHICLE_FINANCE_CONSTRAINTS.MIN_RATE}
                max={VEHICLE_FINANCE_CONSTRAINTS.MAX_RATE}
                step={0.25}
                value={annualRate}
                onChange={(e) => setAnnualRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-cyan-500"
                aria-label="Annual interest rate slider"
              />
              <div className="flex justify-between text-[11px] sm:text-xs text-muted-foreground">
                <span>0%</span>
                <span>8%</span>
                <span>15%</span>
                <span>25%</span>
              </div>
            </div>
          </div>

          {/* Lender benchmarks (collapsible) */}
          <button
            type="button"
            onClick={() => setShowLenders(!showLenders)}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors text-sm font-medium"
            aria-expanded={showLenders}
          >
            <span className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-cyan-600" />
              Malta Lender Rate Benchmarks (2026)
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                showLenders && "rotate-180",
              )}
            />
          </button>
          {showLenders && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-xl bg-muted/30 space-y-2">
                {MALTA_LENDER_BENCHMARKS.map((lender) => (
                  <button
                    key={lender.name}
                    type="button"
                    onClick={() => setAnnualRate(lender.rate)}
                    className={cn(
                      "w-full flex items-center justify-between p-2.5 sm:p-3 rounded-lg text-left text-xs sm:text-sm transition-all",
                      Math.abs(annualRate - lender.rate) < 0.01
                        ? "bg-cyan-500 text-white"
                        : "bg-background hover:bg-cyan-500/10 border border-border",
                    )}
                  >
                    <span className="font-medium">{lender.name}</span>
                    <span className="flex items-center gap-2">
                      <span className="opacity-70 hidden sm:inline">
                        {lender.type}
                      </span>
                      <span className="font-semibold tabular-nums">
                        {lender.rate.toFixed(2)}%
                      </span>
                    </span>
                  </button>
                ))}
                <p className="text-[11px] sm:text-xs text-muted-foreground px-2 pt-1">
                  Indicative APR/IR ranges from publicly published lender pages.
                  Confirm current rates with the lender.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* RESULTS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Top metrics — 3 cards mobile-first */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <MetricCard
              label="Deposit"
              sub="upfront"
              value={formatCurrency(result.depositAmount)}
              tone="emerald"
            />
            <MetricCard
              label="Financed"
              sub="loan amount"
              value={formatCurrency(result.financedAmount)}
              tone="slate"
            />
            <MetricCard
              label="Monthly"
              sub={`for ${termMonths} mo`}
              value={formatCurrency(result.monthlyPayment)}
              tone="cyan"
              highlight
            />
          </div>

          {/* Hero monthly */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-secondary/10 border border-cyan-500/20">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="p-2 sm:p-2.5 rounded-xl bg-cyan-500/20">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-700 dark:text-cyan-400" />
              </div>
              <span className="font-semibold text-sm sm:text-base">
                Monthly Instalment
              </span>
            </div>
            <div className="text-center py-3 sm:py-5">
              <motion.div
                key={Math.round(result.monthlyPayment * 100)}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-cyan-700 dark:text-cyan-400 tabular-nums break-words"
              >
                {formatCurrencyPrecise(result.monthlyPayment)}
              </motion.div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                per month for{" "}
                <strong className="text-foreground">
                  {formatTerm(termMonths)}
                </strong>{" "}
                at {annualRate.toFixed(2)}%
              </p>
            </div>

            {/* Summary rows */}
            <div className="space-y-2 sm:space-y-2.5">
              <SummaryRow
                label="Vehicle price"
                value={formatCurrency(totalPrice)}
              />
              <SummaryRow
                label={`Deposit (${depositPercent}%)`}
                value={`− ${formatCurrency(result.depositAmount)}`}
                tone="emerald"
              />
              <SummaryRow
                label="Financed amount"
                value={formatCurrency(result.financedAmount)}
                strong
              />
              <SummaryRow
                label="Total interest"
                value={`+ ${formatCurrency(result.totalInterest)}`}
                tone="amber"
              />
              <SummaryRow
                label="Total repayment"
                value={formatCurrency(result.totalRepayment)}
              />
              <div className="h-px bg-border my-1.5" />
              <SummaryRow
                label="Grand total cost"
                value={formatCurrency(result.grandTotal)}
                strong
                tone="violet"
              />
            </div>
          </div>

          {/* Cost breakdown bars */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-card border border-border/50">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 sm:mb-4">
              Cost breakdown
            </p>
            <div className="space-y-2.5 sm:space-y-3">
              {breakdown.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold tabular-nums">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                  <div className="h-1.5 sm:h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(item.value / maxBar) * 100}%`,
                      }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className={cn("h-full rounded-full", item.tone)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info box */}
          <div className="p-3 sm:p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex gap-2.5 sm:gap-3">
              <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  Malta Hire Purchase Tip
                </p>
                <p>
                  Dealer hire-purchase typically asks for a 25% deposit with the
                  balance over 60 months at around 6-9% interest. Maltese banks
                  (BOV, HSBC, APS) often offer 0% deposit car loans at lower
                  rates — but stricter credit checks.
                </p>
              </div>
            </div>
          </div>

          {/* Schedule toggle */}
          <button
            type="button"
            onClick={() => setShowSchedule(!showSchedule)}
            className="w-full py-2.5 sm:py-3 rounded-xl border border-border hover:bg-muted transition-colors text-xs sm:text-sm font-medium"
            aria-expanded={showSchedule}
          >
            {showSchedule ? "Hide" : "Show"} first 12-month repayment schedule
          </button>
        </motion.div>
      </div>

      {/* Schedule */}
      {showSchedule && result.schedule.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-x-auto -mx-2 sm:mx-0"
        >
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-muted/30 border border-border/50 mx-2 sm:mx-0">
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
              First 12 Months Repayment Schedule
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] sm:text-sm tabular-nums">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-1 sm:p-2 font-medium">
                      Mo
                    </th>
                    <th className="text-right py-2 px-1 sm:p-2 font-medium">
                      Payment
                    </th>
                    <th className="text-right py-2 px-1 sm:p-2 font-medium">
                      Principal
                    </th>
                    <th className="text-right py-2 px-1 sm:p-2 font-medium">
                      Interest
                    </th>
                    <th className="text-right py-2 px-1 sm:p-2 font-medium">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.slice(0, 12).map((row) => (
                    <tr key={row.month} className="border-b border-border/40">
                      <td className="py-1.5 px-1 sm:p-2">{row.month}</td>
                      <td className="text-right py-1.5 px-1 sm:p-2">
                        {formatCurrencyPrecise(row.payment)}
                      </td>
                      <td className="text-right py-1.5 px-1 sm:p-2">
                        {formatCurrencyPrecise(row.principal)}
                      </td>
                      <td className="text-right py-1.5 px-1 sm:p-2 text-amber-700 dark:text-amber-500">
                        {formatCurrencyPrecise(row.interest)}
                      </td>
                      <td className="text-right py-1.5 px-1 sm:p-2 font-medium">
                        {formatCurrency(row.remainingBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {result.schedule.length > 12 && (
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-3 text-center">
                … and {result.schedule.length - 12} more months in the
                amortization plan.
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface MetricCardProps {
  label: string;
  sub: string;
  value: string;
  tone: "cyan" | "emerald" | "slate";
  highlight?: boolean;
}

function MetricCard({ label, sub, value, tone, highlight }: MetricCardProps) {
  const toneClasses: Record<MetricCardProps["tone"], string> = {
    cyan: "from-cyan-500/15 to-cyan-500/5 border-cyan-500/30 text-cyan-700 dark:text-cyan-400",
    emerald:
      "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400",
    slate:
      "from-slate-500/10 to-slate-500/5 border-slate-500/20 text-foreground",
  };

  return (
    <div
      className={cn(
        "p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br border text-center",
        toneClasses[tone],
        highlight && "ring-1 ring-cyan-500/30",
      )}
    >
      <p className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-base sm:text-xl md:text-2xl font-bold mt-1 tabular-nums break-words">
        {value}
      </p>
      <p className="text-[9px] sm:text-[11px] text-muted-foreground mt-0.5">
        {sub}
      </p>
    </div>
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
  strong?: boolean;
  tone?: "amber" | "emerald" | "violet";
}

function SummaryRow({ label, value, strong, tone }: SummaryRowProps) {
  const toneClass =
    tone === "amber"
      ? "text-amber-700 dark:text-amber-500"
      : tone === "emerald"
        ? "text-emerald-700 dark:text-emerald-400"
        : tone === "violet"
          ? "text-violet-700 dark:text-violet-400"
          : "text-foreground";

  return (
    <div className="flex justify-between items-center text-xs sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "tabular-nums",
          strong ? "font-semibold" : "font-medium",
          toneClass,
        )}
      >
        {value}
      </span>
    </div>
  );
}
