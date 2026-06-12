"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Baby, Euro, Calculator, Info, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  calculateMaternity,
  formatCurrency,
  getMaternityRates,
  type MaternityOutput,
  type MaternityStatus,
} from "@/utils/maternity-calculator";

const STATUS_OPTIONS: Array<{
  value: MaternityStatus;
  label: string;
  detail: string;
}> = [
  {
    value: "employed",
    label: "Employed",
    detail: "14 weeks full pay + 4 weeks benefit",
  },
  {
    value: "selfOccupied",
    label: "Self-occupied",
    detail: "€221.78/week × 14 + 4 weeks benefit",
  },
  {
    value: "notEntitled",
    label: "Not in employment",
    detail: "Flat €140.29/week × 14",
  },
];

export function MaternityCalculator() {
  const [weeklyGrossSalary, setWeeklyGrossSalary] = useState(500);
  const [status, setStatus] = useState<MaternityStatus>("employed");

  const rates = getMaternityRates();

  const result = useMemo<MaternityOutput>(() => {
    return calculateMaternity({ weeklyGrossSalary, status });
  }, [weeklyGrossSalary, status]);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 sm:space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Baby className="h-4 w-4" />
          Family & Children
        </div>
        <h1 className="font-cal text-3xl md:text-4xl font-bold">
          Maternity Leave Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto px-2">
          Work out your income during Malta&apos;s 18-week maternity leave —
          employer-paid weeks, the government benefit, and paternity leave.
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
              <span className="font-semibold">Your Situation</span>
            </div>

            {/* Status — dikey radio kartlar */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">
                Employment Status
              </label>
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatus(option.value)}
                  className={cn(
                    "w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3 p-3 rounded-xl border text-left transition-all min-h-12",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                    status === option.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:bg-muted",
                  )}
                >
                  <span className="text-sm font-medium">{option.label}</span>
                  <span
                    className={cn(
                      "text-xs",
                      status === option.value
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground",
                    )}
                  >
                    {option.detail}
                  </span>
                </button>
              ))}
            </div>

            {status === "employed" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                  <Euro className="h-4 w-4 text-primary/70" />
                  Weekly Gross Salary
                </label>
                <NumericInput
                  value={weeklyGrossSalary}
                  onChange={(v) => setWeeklyGrossSalary(v === "" ? 0 : v)}
                  min={0}
                  allowDecimals={false}
                  suffix="€"
                  className="h-14 sm:h-16 text-xl sm:text-2xl px-4 sm:px-5"
                  suffixClassName="text-lg"
                />
                <p className="text-xs text-muted-foreground">
                  Your employer pays this in full for the first 14 weeks.
                </p>
              </div>
            )}
          </div>

          {/* Paternity card */}
          <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-sky-500/10 to-blue-500/5 border border-sky-500/20 space-y-2">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-sky-600" />
              <span className="font-semibold text-sm">
                Paternity Leave (fathers)
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Fathers get <strong>{result.paternityDays} working days</strong>{" "}
              of paternity leave on full pay, funded by the employer, on the
              birth or adoption of a child.
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
                <Baby className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">
                Income Over {result.totalWeeks} Weeks
              </span>
            </div>

            <div className="text-center py-4 sm:py-6">
              <motion.div
                key={result.totalPay}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary break-words"
              >
                {formatCurrency(result.totalPay)}
              </motion.div>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                total during maternity leave
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Weeks 1–14 (
                  {result.first14Source === "employer"
                    ? "employer, full salary"
                    : "government benefit"}
                  )
                </span>
                <span className="font-semibold">
                  {formatCurrency(result.first14WeeksPay)}
                </span>
              </div>
              {result.totalWeeks === 18 && (
                <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                  <span className="text-sm text-muted-foreground">
                    Weeks 15–18 (government, €{rates.MLB_WEEKLY}/week)
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(result.last4WeeksPay)}
                  </span>
                </div>
              )}
              {status === "employed" && result.incomeLossVsFullSalary > 0 && (
                <div className="flex justify-between items-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <span className="text-sm text-muted-foreground">
                    vs full salary for {result.totalWeeks} weeks
                  </span>
                  <span className="font-semibold text-amber-600">
                    -{formatCurrency(result.incomeLossVsFullSalary)}
                  </span>
                </div>
              )}
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
                    Maternity leave is <strong>18 weeks</strong>: at least 6
                    must be taken after the birth
                  </li>
                  <li>
                    The 4-week Maternity Leave Benefit (€{rates.MLB_WEEKLY}
                    /week) is paid by the government — apply via
                    mysocialsecurity.gov.mt
                  </li>
                  <li>
                    Self-occupied mothers receive €
                    {rates.BENEFIT_SELF_OCCUPIED_WEEKLY}/week for 14 weeks
                    instead of employer pay
                  </li>
                  <li>2026 rates per the Social Security Act</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
