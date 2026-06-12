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
import {
  calculateSelfEmployedSSC,
  formatCurrency,
  getClass2Info,
  type SelfEmployedSSCOutput,
} from "@/utils/self-employed-ssc-calculator";

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

export function SelfEmployedSSCCalculator() {
  const [annualNetIncome, setAnnualNetIncome] = useState(20000);
  const [bornBefore1962, setBornBefore1962] = useState<"no" | "yes">("no");
  const [reducedRate, setReducedRate] = useState<"no" | "yes">("no");

  const info = getClass2Info();

  const result = useMemo<SelfEmployedSSCOutput>(() => {
    return calculateSelfEmployedSSC({
      annualNetIncome,
      bornBefore1962: bornBefore1962 === "yes",
      useReducedPartTimeRate: reducedRate === "yes",
    });
  }, [annualNetIncome, bornBefore1962, reducedRate]);

  const showReducedToggle = annualNetIncome <= info.SA_MAX_INCOME;

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
          Self-Employed SSC Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto px-2">
          Work out your Class 2 social security contributions for 2026 — SA, SB
          and SC categories with the three instalment amounts.
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
              <span className="font-semibold">Income Details</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Euro className="h-4 w-4 text-primary/70" />
                Last Year&apos;s Annual Net Income
              </label>
              <NumericInput
                value={annualNetIncome}
                onChange={(v) => setAnnualNetIncome(v === "" ? 0 : v)}
                min={0}
                allowDecimals={false}
                suffix="€"
                className="h-14 sm:h-16 text-xl sm:text-2xl px-4 sm:px-5"
                suffixClassName="text-lg"
              />
              <p className="text-xs text-muted-foreground">
                Class 2 SSC is based on the net income you earned in the
                previous calendar year.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Were you born before 1 January 1962?
              </label>
              <ToggleGroup
                options={["no", "yes"] as const}
                value={bornBefore1962}
                onChange={setBornBefore1962}
                labels={{ no: "1962 or later", yes: "Before 1962" }}
              />
            </div>

            {showReducedToggle && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground/70">
                  Part-time woman, student under 25, or pensioner?
                </label>
                <ToggleGroup
                  options={["no", "yes"] as const}
                  value={reducedRate}
                  onChange={setReducedRate}
                  labels={{ no: "No", yes: "Yes — 15% of earnings" }}
                />
                <p className="text-xs text-muted-foreground">
                  These groups may pay 15% of actual earnings instead of the SA
                  minimum of €{info.SA_WEEKLY_RATE}/week.
                </p>
              </div>
            )}
          </div>

          {/* 2026 rate table — mobilde satır kartları */}
          <div className="p-4 rounded-xl bg-muted/30 space-y-3">
            <p className="text-sm font-medium text-foreground/70">
              2026 Class 2 Bands
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between gap-2 p-2.5 rounded-lg bg-background">
                <span className="text-muted-foreground">
                  SA — up to €12,543.72
                </span>
                <span className="font-semibold shrink-0">€36.18/week</span>
              </div>
              <div className="flex justify-between gap-2 p-2.5 rounded-lg bg-background">
                <span className="text-muted-foreground">SB — middle band</span>
                <span className="font-semibold shrink-0">15% ÷ 52</span>
              </div>
              <div className="flex justify-between gap-2 p-2.5 rounded-lg bg-background">
                <span className="text-muted-foreground">
                  SC — over €25,500 (born &lt;1962)
                </span>
                <span className="font-semibold shrink-0">€73.56/week</span>
              </div>
              <div className="flex justify-between gap-2 p-2.5 rounded-lg bg-background">
                <span className="text-muted-foreground">
                  SC — over €29,083 (born 1962+)
                </span>
                <span className="font-semibold shrink-0">€83.89/week</span>
              </div>
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
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/20">
                  <Percent className="h-5 w-5 text-primary" />
                </div>
                <span className="font-semibold">Your Contribution</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                Category {result.category}
              </span>
            </div>

            <div className="text-center py-4 sm:py-6">
              <motion.div
                key={result.weeklyContribution}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary break-words"
              >
                {formatCurrency(result.weeklyContribution)}
              </motion.div>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                per week ·{" "}
                <strong>{formatCurrency(result.annualContribution)}</strong> per
                year
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Annual Total (52 weeks)
                </span>
                <span className="font-semibold">
                  {formatCurrency(result.annualContribution)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Effective Rate on Income
                </span>
                <span className="font-semibold">
                  {result.effectiveRate.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm">
              <p className="text-sm text-muted-foreground">
                {result.description}
              </p>
            </div>
          </div>

          {/* Instalments — mobilde alt alta */}
          <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-500/20 space-y-4">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-emerald-600" />
              <span className="font-semibold text-sm">
                Three Instalments (paid every 4 months)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {["April", "August", "December"].map((month) => (
                <div
                  key={month}
                  className="p-3 rounded-xl bg-background/60 text-center"
                >
                  <p className="text-xs text-muted-foreground">{month}</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(result.perInstalment)}
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
                    Based on the official MTCA Class 2 rates for{" "}
                    <strong>2026</strong>
                  </li>
                  <li>
                    Contributions count towards your state pension and
                    contributory benefits
                  </li>
                  <li>
                    Paying below the full rate may reduce your pension
                    entitlement
                  </li>
                  <li>
                    Income tax is separate — see our self-employed tax guide
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
