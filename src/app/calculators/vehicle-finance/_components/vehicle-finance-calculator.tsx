"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Euro,
  Calculator,
  Calendar,
  Percent,
  TrendingUp,
  Wallet,
  Banknote,
  Info,
  ChevronDown,
  Receipt,
  AlertTriangle,
  ShieldAlert,
  Eye,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  calculateVehicleFinance,
  formatCurrency,
  formatCurrencyPrecise,
  formatTerm,
  MALTA_LENDER_BENCHMARKS,
  FEE_PRESETS,
  LATE_PAYMENT_FEES,
  DEFAULT_FEES,
  VEHICLE_FINANCE_CONSTRAINTS,
  type VehicleFinanceResult,
} from "@/utils/vehicle-finance-calculator";

const PRICE_PRESETS = [
  { label: "Used Car", value: 12_000 },
  { label: "Family Car", value: 25_000 },
  { label: "SUV", value: 40_000 },
  { label: "Premium", value: 60_000 },
];

// Defaults model the most common Malta dealer hire-purchase quote
// (Finance House style: 4.75% banking + €10/mo draft) so a first-time
// visitor immediately sees the realistic APRC, not a cleaned-up version.
const DEFAULT_BANKING_FEE = 4.75;
const DEFAULT_DRAFT_FEE = 10;
const DEFAULT_MAINTENANCE_FEE = 0;
const DEFAULT_RATE = 5.5; // tipik dealer "headline IR"

export function VehicleFinanceCalculator() {
  const [totalPrice, setTotalPrice] = useState<number>(19_000);
  const [depositPercent, setDepositPercent] = useState<number>(0);
  const [termMonths, setTermMonths] = useState<number>(60);
  const [annualRate, setAnnualRate] = useState<number>(DEFAULT_RATE);
  const [bankingFeePercent, setBankingFeePercent] =
    useState<number>(DEFAULT_BANKING_FEE);
  const [monthlyDraftFee, setMonthlyDraftFee] =
    useState<number>(DEFAULT_DRAFT_FEE);
  const [maintenanceFee, setMaintenanceFee] = useState<number>(
    DEFAULT_MAINTENANCE_FEE,
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
        bankingFeePercent,
        monthlyDraftFee,
        maintenanceFee,
      }),
    [
      totalPrice,
      depositPercent,
      termMonths,
      annualRate,
      bankingFeePercent,
      monthlyDraftFee,
      maintenanceFee,
    ],
  );

  const hasFees =
    bankingFeePercent > 0 || monthlyDraftFee > 0 || maintenanceFee > 0;
  const aprcDelta = Math.max(
    0,
    result.effectiveAnnualRate - result.nominalAnnualRate,
  );
  const aprcMultiplier =
    result.nominalAnnualRate > 0
      ? result.effectiveAnnualRate / result.nominalAnnualRate
      : 0;

  // Cost breakdown bars
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
    ...(hasFees
      ? [
          {
            label: "Total Fees",
            value: result.totalFees,
            tone: "bg-rose-500/70",
          },
        ]
      : []),
    {
      label: "Grand Total Cost",
      value: result.grandTotal,
      tone: "bg-violet-500/70",
    },
  ];
  const maxBar = Math.max(...breakdown.map((b) => b.value), 1);

  const applyFeePreset = (preset: (typeof FEE_PRESETS)[number]) => {
    setBankingFeePercent(preset.bankingFeePercent);
    setMonthlyDraftFee(preset.monthlyDraftFee);
    setMaintenanceFee(preset.maintenanceFee);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header — buyer-focused */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 sm:space-y-4 px-2"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 text-xs sm:text-sm font-medium">
          <ShieldAlert className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Malta Buyer Protection
        </div>
        <h1 className="font-cal text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
          Vehicle Finance Calculator
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          See the <strong className="text-foreground">true cost (APRC)</strong>{" "}
          a Malta dealer or finance company is charging you — not just the
          friendly-looking headline rate. Built for buyers, useful for sellers.
        </p>
      </motion.div>

      {/* MAIN HERO — APRC vs IR side by side, BIG */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
      >
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-secondary/10 border border-cyan-500/30">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-700 dark:text-cyan-400" />
            <span className="font-semibold text-xs sm:text-sm uppercase tracking-wider text-muted-foreground">
              Monthly Instalment
            </span>
          </div>
          <motion.div
            key={Math.round(result.monthlyPayment * 100)}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyan-700 dark:text-cyan-400 tabular-nums break-words"
          >
            {formatCurrencyPrecise(result.monthlyPayment)}
          </motion.div>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-1.5 sm:mt-2">
            × {termMonths} months ={" "}
            <strong className="text-foreground tabular-nums">
              {formatCurrency(result.totalRepayment)}
            </strong>
          </p>
        </div>

        <div
          className={cn(
            "p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-colors relative overflow-hidden",
            aprcDelta > 1
              ? "bg-gradient-to-br from-rose-500/15 via-amber-500/10 to-rose-500/5 border-rose-500/40"
              : "bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 border-emerald-500/30",
          )}
        >
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Eye
              className={cn(
                "h-4 w-4 sm:h-5 sm:w-5",
                aprcDelta > 1
                  ? "text-rose-700 dark:text-rose-400"
                  : "text-emerald-700 dark:text-emerald-400",
              )}
            />
            <span className="font-semibold text-xs sm:text-sm uppercase tracking-wider text-muted-foreground">
              True APRC
            </span>
            {aprcDelta > 0.1 && (
              <span className="ml-auto px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-700 dark:text-rose-300 text-[10px] sm:text-[11px] font-bold">
                +{aprcDelta.toFixed(2)}%
              </span>
            )}
          </div>
          <motion.div
            key={Math.round(result.effectiveAnnualRate * 100)}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className={cn(
              "text-3xl sm:text-4xl md:text-5xl font-bold tabular-nums",
              aprcDelta > 1
                ? "text-rose-700 dark:text-rose-400"
                : "text-emerald-700 dark:text-emerald-400",
            )}
          >
            {result.effectiveAnnualRate.toFixed(2)}%
          </motion.div>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-1.5 sm:mt-2">
            Dealer says{" "}
            <strong className="text-foreground">
              {result.nominalAnnualRate.toFixed(2)}% IR
            </strong>{" "}
            ·{" "}
            {aprcDelta > 0.1 ? (
              <>
                you actually pay{" "}
                <strong className="text-rose-600 dark:text-rose-400">
                  {aprcMultiplier.toFixed(1)}× that
                </strong>
              </>
            ) : (
              "no hidden fees detected"
            )}
          </p>
        </div>
      </motion.div>

      {/* Shock-comparison banner when APRC is significantly higher than IR */}
      {aprcDelta > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-5 rounded-2xl bg-rose-500/5 border border-rose-500/30"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm">
              <p className="font-semibold text-foreground mb-1 text-sm sm:text-base">
                The {result.nominalAnnualRate.toFixed(2)}% rate on your contract
                is{" "}
                <span className="text-rose-700 dark:text-rose-400">
                  really {result.effectiveAnnualRate.toFixed(2)}%
                </span>
              </p>
              <p className="text-muted-foreground">
                This finance offer adds{" "}
                <strong className="text-foreground">
                  {formatCurrency(result.totalFees)}
                </strong>{" "}
                in fees on top of{" "}
                <strong className="text-foreground">
                  {formatCurrency(result.totalInterest)}
                </strong>{" "}
                of pure interest. Total cost of borrowing:{" "}
                <strong className="text-rose-700 dark:text-rose-400">
                  {formatCurrency(result.totalCostOfBorrowing)}
                </strong>{" "}
                on a{" "}
                <strong className="text-foreground">
                  {formatCurrency(result.baseLoanAmount)}
                </strong>{" "}
                loan. Always ask the lender for the APRC in writing — under EU
                consumer credit law it must be disclosed.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* INPUTS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 sm:space-y-5"
        >
          {/* Loan basics */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-cyan-500/5 via-background to-secondary/5 border border-border/50 space-y-5 sm:space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl bg-cyan-500/10">
                <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-600" />
              </div>
              <span className="font-semibold text-sm sm:text-base">
                Loan Details
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
              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
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
                  Headline Interest Rate (IR)
                </span>
                <span className="text-cyan-600 font-semibold tabular-nums">
                  {annualRate.toFixed(2)}%
                </span>
              </label>
              <NumericInput
                value={annualRate}
                onChange={(v) => setAnnualRate(v === "" ? 0 : v)}
                min={VEHICLE_FINANCE_CONSTRAINTS.MIN_RATE}
                max={VEHICLE_FINANCE_CONSTRAINTS.MAX_RATE}
                step={0.25}
                allowDecimals
                suffix="%"
                className="h-11 text-base px-3 sm:px-4"
              />
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

          {/* FEES — always visible, side-by-side inputs */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-rose-500/5 via-background to-amber-500/5 border border-rose-500/20 space-y-4">
            <div className="flex items-start sm:items-center gap-3 flex-wrap">
              <div className="p-2 sm:p-2.5 rounded-xl bg-rose-500/10">
                <Receipt className="h-4 w-4 sm:h-5 sm:w-5 text-rose-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm sm:text-base">
                  Fees & Hidden Charges
                </p>
                <p className="text-[11px] sm:text-xs text-muted-foreground">
                  These are what turn the headline IR into the real APRC
                </p>
              </div>
              {hasFees && (
                <span className="px-2 py-1 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-400 text-[10px] sm:text-xs font-bold tabular-nums">
                  +{formatCurrency(result.totalFees)}
                </span>
              )}
            </div>

            {/* Fee preset chips */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {FEE_PRESETS.map((preset) => {
                const active =
                  Math.abs(bankingFeePercent - preset.bankingFeePercent) <
                    0.01 &&
                  Math.abs(monthlyDraftFee - preset.monthlyDraftFee) < 0.01 &&
                  Math.abs(maintenanceFee - preset.maintenanceFee) < 0.5;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyFeePreset(preset)}
                    className={cn(
                      "px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-[11px] sm:text-xs font-medium transition-all border text-left",
                      active
                        ? "bg-rose-500 text-white border-rose-500"
                        : "bg-background border-border hover:bg-rose-500/10",
                    )}
                    title={preset.description}
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>

            {/* Three fee inputs in a tight grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FeeInput
                label="Banking Fee"
                sublabel="% of loan · one-off"
                value={bankingFeePercent}
                onChange={setBankingFeePercent}
                suffix="%"
                max={VEHICLE_FINANCE_CONSTRAINTS.MAX_BANKING_FEE_PERCENT}
                step={0.25}
                allowDecimals
                computed={
                  bankingFeePercent > 0
                    ? formatCurrency(result.bankingFeeAmount)
                    : undefined
                }
              />
              <FeeInput
                label="Draft Fee"
                sublabel="€ per month"
                value={monthlyDraftFee}
                onChange={setMonthlyDraftFee}
                suffix="€"
                max={VEHICLE_FINANCE_CONSTRAINTS.MAX_MONTHLY_DRAFT_FEE}
                step={1}
                allowDecimals={false}
                computed={
                  monthlyDraftFee > 0
                    ? `${formatCurrency(result.totalDraftFees)} total`
                    : undefined
                }
              />
              <FeeInput
                label="Maintenance Fee"
                sublabel="€ one-off"
                value={maintenanceFee}
                onChange={setMaintenanceFee}
                suffix="€"
                max={VEHICLE_FINANCE_CONSTRAINTS.MAX_MAINTENANCE_FEE}
                step={50}
                allowDecimals={false}
                computed={
                  maintenanceFee > 0
                    ? formatCurrency(result.maintenanceFeeAmount)
                    : undefined
                }
              />
            </div>

            <p className="text-[11px] sm:text-xs text-muted-foreground italic">
              Banking + maintenance fees are added to your loan principal (so
              you also pay interest on them). Draft fees are added to every
              monthly bill.
            </p>
          </div>

          {/* Lender benchmarks (collapsible — secondary info) */}
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
                  Indicative IR ranges from publicly published lender pages.
                  Confirm current rates with the lender.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* RESULTS column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 sm:space-y-5"
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
              sub="incl. fees"
              value={formatCurrency(result.financedAmount)}
              tone="slate"
            />
            <MetricCard
              label="Total Cost"
              sub="of borrowing"
              value={formatCurrency(result.totalCostOfBorrowing)}
              tone="rose"
              highlight
            />
          </div>

          {/* Detailed breakdown */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-card border border-border/50">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 sm:mb-4">
              Where your money goes
            </p>
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
                label="Base loan amount"
                value={formatCurrency(result.baseLoanAmount)}
              />
              {bankingFeePercent > 0 && (
                <SummaryRow
                  label={`+ Banking fee (${bankingFeePercent.toFixed(2)}%)`}
                  value={formatCurrency(result.bankingFeeAmount)}
                  tone="rose"
                />
              )}
              {maintenanceFee > 0 && (
                <SummaryRow
                  label="+ Maintenance fee"
                  value={formatCurrency(result.maintenanceFeeAmount)}
                  tone="rose"
                />
              )}
              <SummaryRow
                label="Financed (with fees)"
                value={formatCurrency(result.financedAmount)}
                strong
              />
              <SummaryRow
                label="Total interest"
                value={`+ ${formatCurrency(result.totalInterest)}`}
                tone="amber"
              />
              {monthlyDraftFee > 0 && (
                <SummaryRow
                  label={`+ Draft fees (${termMonths} × ${formatCurrency(monthlyDraftFee)})`}
                  value={formatCurrency(result.totalDraftFees)}
                  tone="rose"
                />
              )}
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

          {/* Smart-buyer checklist */}
          <div className="p-3 sm:p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex gap-2.5 sm:gap-3">
              <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  Smart-buyer checklist
                </p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Ask for the APRC in writing, not just the IR</li>
                  <li>Compare with BOV (from 4.75%) or HSBC (6.50% IR)</li>
                  <li>
                    Processing/banking fee &gt; 4% on loan? Negotiate or walk
                    away
                  </li>
                  <li>Confirm early-repayment fee in writing (EU cap = 1%)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* SECCI / EU Rights — accordion */}
          <DisclosureCard
            icon={<Scale className="h-4 w-4 text-emerald-600" />}
            title="Your EU Consumer Credit Rights"
            badge="SECCI"
            tone="emerald"
          >
            <ul className="space-y-1.5 text-xs sm:text-sm text-muted-foreground">
              <Right text="14-day cooling-off period to withdraw without giving a reason" />
              <Right text="Right to repay early at any time (fee capped at 1% of outstanding)" />
              <Right text="Right to a free copy of the draft credit agreement on request" />
              <Right text="SECCI form pre-contractual info valid for 7 days" />
              <Right text="Lender must inform you immediately and free of charge if a credit-database check (MACM, Credit Info) leads to refusal" />
            </ul>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-2 italic">
              Mandatory disclosures under the EU Consumer Credit Directive
              (Directive 2008/48/EC) as transposed into Maltese law.
            </p>
          </DisclosureCard>

          {/* Late & default fees — accordion */}
          <DisclosureCard
            icon={<AlertTriangle className="h-4 w-4 text-rose-600" />}
            title="Late Payment & Default Fees"
            badge="info"
            tone="rose"
          >
            <p className="text-[11px] sm:text-xs text-muted-foreground mb-2">
              Typical Maltese finance company schedule (Finance House SECCI). If
              you miss instalments these add up fast — they are{" "}
              <strong className="text-foreground">not</strong> in the APRC
              above:
            </p>
            <div className="space-y-1.5">
              <p className="text-[11px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground">
                When overdue
              </p>
              <div className="grid grid-cols-5 gap-1 text-center">
                {LATE_PAYMENT_FEES.map((row) => (
                  <div
                    key={row.months}
                    className="p-2 rounded-lg bg-rose-500/5 border border-rose-500/10"
                  >
                    <p className="text-[10px] text-muted-foreground">
                      {row.months}mo
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-rose-700 dark:text-rose-400 tabular-nums">
                      €{row.fee}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground mt-3">
                Default & admin charges
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {DEFAULT_FEES.map((fee) => (
                  <div
                    key={fee.name}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-[11px] sm:text-xs"
                  >
                    <span className="text-muted-foreground truncate pr-1">
                      {fee.name}
                    </span>
                    <span className="font-semibold tabular-nums whitespace-nowrap">
                      €{fee.fee}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </DisclosureCard>

          {/* What you must do — compulsory items */}
          <DisclosureCard
            icon={<ShieldCheck className="h-4 w-4 text-amber-600" />}
            title="Compulsory in Maltese HP Agreements"
            badge="must"
            tone="amber"
          >
            <ul className="space-y-1.5 text-xs sm:text-sm text-muted-foreground">
              <Right
                text="Comprehensive vehicle insurance for the entire finance term"
                tone="amber"
              />
              <Right
                text="Direct debit set up for monthly payments"
                tone="amber"
              />
              <Right
                text="Bills of Exchange (postdated promissory notes) signed as security"
                tone="amber"
              />
              <Right
                text="Vehicle transfer restriction — you cannot resell during HP"
                tone="amber"
              />
            </ul>
          </DisclosureCard>

          {/* Schedule toggle */}
          <button
            type="button"
            onClick={() => setShowSchedule(!showSchedule)}
            className="w-full py-2.5 sm:py-3 rounded-xl border border-border hover:bg-muted transition-colors text-xs sm:text-sm font-medium"
            aria-expanded={showSchedule}
          >
            {showSchedule ? "Hide" : "Show"} first 12-month repayment schedule
          </button>

          {/* Cross-link to full guide */}
          <Link
            href="/blog/malta-vehicle-finance-guide-2026"
            className="group flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/5 border border-cyan-500/30 hover:border-cyan-500/60 transition-all"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-colors">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] sm:text-xs text-cyan-700 dark:text-cyan-400 font-semibold uppercase tracking-wider">
                Full Guide
              </p>
              <p className="font-semibold text-sm sm:text-base group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors">
                Malta Vehicle Finance Guide 2026
              </p>
              <p className="text-[11px] sm:text-xs text-muted-foreground">
                SECCI explained · IR vs APRC · lender comparison
              </p>
            </div>
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-700 dark:text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </Link>
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

interface FeeInputProps {
  label: string;
  sublabel: string;
  value: number;
  onChange: (v: number) => void;
  suffix: string;
  max: number;
  step: number;
  allowDecimals: boolean;
  computed?: string;
}

function FeeInput({
  label,
  sublabel,
  value,
  onChange,
  suffix,
  max,
  step,
  allowDecimals,
  computed,
}: FeeInputProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-1">
        <p className="text-xs sm:text-sm font-medium leading-tight">{label}</p>
      </div>
      <p className="text-[10px] sm:text-[11px] text-muted-foreground -mt-1">
        {sublabel}
      </p>
      <NumericInput
        value={value}
        onChange={(v) => onChange(v === "" ? 0 : v)}
        min={0}
        max={max}
        step={step}
        allowDecimals={allowDecimals}
        suffix={suffix}
        className="h-11 text-base sm:text-sm px-3 sm:px-4 focus:border-rose-500 focus:ring-rose-500/20"
      />
      {computed && (
        <p className="text-[10px] sm:text-[11px] font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
          = {computed}
        </p>
      )}
    </div>
  );
}

interface MetricCardProps {
  label: string;
  sub: string;
  value: string;
  tone: "cyan" | "emerald" | "slate" | "rose";
  highlight?: boolean;
}

function MetricCard({ label, sub, value, tone, highlight }: MetricCardProps) {
  const toneClasses: Record<MetricCardProps["tone"], string> = {
    cyan: "from-cyan-500/15 to-cyan-500/5 border-cyan-500/30 text-cyan-700 dark:text-cyan-400",
    emerald:
      "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400",
    slate:
      "from-slate-500/10 to-slate-500/5 border-slate-500/20 text-foreground",
    rose: "from-rose-500/10 to-rose-500/5 border-rose-500/30 text-rose-700 dark:text-rose-400",
  };

  return (
    <div
      className={cn(
        "p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br border text-center",
        toneClasses[tone],
        highlight && "ring-1 ring-rose-500/30",
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
  tone?: "amber" | "emerald" | "violet" | "rose";
}

function SummaryRow({ label, value, strong, tone }: SummaryRowProps) {
  const toneClass =
    tone === "amber"
      ? "text-amber-700 dark:text-amber-500"
      : tone === "emerald"
        ? "text-emerald-700 dark:text-emerald-400"
        : tone === "violet"
          ? "text-violet-700 dark:text-violet-400"
          : tone === "rose"
            ? "text-rose-700 dark:text-rose-400"
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

interface DisclosureCardProps {
  icon: React.ReactNode;
  title: string;
  badge?: string;
  tone: "emerald" | "rose" | "amber";
  children: React.ReactNode;
}

function DisclosureCard({
  icon,
  title,
  badge,
  tone,
  children,
}: DisclosureCardProps) {
  const [open, setOpen] = useState(false);

  const toneClasses: Record<DisclosureCardProps["tone"], string> = {
    emerald: "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10",
    rose: "border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10",
    amber: "border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10",
  };

  const badgeClasses: Record<DisclosureCardProps["tone"], string> = {
    emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    rose: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
    amber: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  };

  return (
    <div
      className={cn(
        "rounded-xl border overflow-hidden transition-colors",
        toneClasses[tone],
      )}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 text-left"
        aria-expanded={open}
      >
        <div className="flex-shrink-0">{icon}</div>
        <span className="flex-1 font-medium text-xs sm:text-sm">{title}</span>
        {badge && (
          <span
            className={cn(
              "px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase",
              badgeClasses[tone],
            )}
          >
            {badge}
          </span>
        )}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform flex-shrink-0",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden"
        >
          <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-1 sm:pt-2 border-t border-border/30">
            {children}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Right({
  text,
  tone = "emerald",
}: {
  text: string;
  tone?: "emerald" | "amber";
}) {
  return (
    <li className="flex gap-2 items-start">
      <span
        className={cn(
          "flex-shrink-0 mt-1 h-1.5 w-1.5 rounded-full",
          tone === "amber" ? "bg-amber-500" : "bg-emerald-500",
        )}
      />
      <span>{text}</span>
    </li>
  );
}
