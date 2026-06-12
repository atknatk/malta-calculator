"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Stethoscope,
  Euro,
  Calculator,
  Info,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  calculateSickLeave,
  formatCurrency,
  getSickLeaveRates,
  type SickLeaveOutput,
  type SickMaritalStatus,
} from "@/utils/sick-leave-calculator";

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

export function SickLeaveCalculator() {
  const [weeklyGrossSalary, setWeeklyGrossSalary] = useState(500);
  const [sickDays, setSickDays] = useState(15);
  const [maritalStatus, setMaritalStatus] =
    useState<SickMaritalStatus>("singleOrOther");
  const [employerPaidDays, setEmployerPaidDays] = useState(10);

  const rates = getSickLeaveRates();

  const result = useMemo<SickLeaveOutput>(() => {
    return calculateSickLeave({
      weeklyGrossSalary,
      sickDays,
      maritalStatus,
      employerPaidDays,
    });
  }, [weeklyGrossSalary, sickDays, maritalStatus, employerPaidDays]);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 sm:space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Stethoscope className="h-4 w-4" />
          Employment
        </div>
        <h1 className="font-cal text-3xl md:text-4xl font-bold">
          Sick Leave Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto px-2">
          Estimate your income while off sick in Malta — employer-paid days plus
          the 2026 sickness benefit from social security.
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
              <span className="font-semibold">Sickness Details</span>
            </div>

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
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary/70" />
                Sick Days (working days)
              </label>
              <NumericInput
                value={sickDays}
                onChange={(v) => setSickDays(v === "" ? 0 : v)}
                min={0}
                allowDecimals={false}
                className="h-12 text-base px-4"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Marital Situation
              </label>
              <ToggleGroup
                options={["singleOrOther", "marriedMaintainingSpouse"] as const}
                value={maritalStatus}
                onChange={setMaritalStatus}
                labels={{
                  singleOrOther: "Single / spouse works",
                  marriedMaintainingSpouse: "Maintaining spouse",
                }}
              />
              <p className="text-xs text-muted-foreground">
                Sets the benefit rate: €{rates.DAILY_MARRIED}/day if you
                maintain a spouse not in full-time work, otherwise €
                {rates.DAILY_SINGLE}/day.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">
                Employer Full-Pay Sick Days (per your WRO)
              </label>
              <NumericInput
                value={employerPaidDays}
                onChange={(v) => setEmployerPaidDays(v === "" ? 0 : v)}
                min={0}
                allowDecimals={false}
                className="h-12 text-base px-4"
              />
              <p className="text-xs text-muted-foreground">
                Default is 2 working weeks (10 days) per year — many sector Wage
                Regulation Orders grant more.
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
          <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/20">
                <Stethoscope className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">
                Income for {sickDays} Sick Days
              </span>
            </div>

            <div className="text-center py-4 sm:py-6">
              <motion.div
                key={result.totalIncome}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary break-words"
              >
                {formatCurrency(result.totalIncome)}
              </motion.div>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                {result.incomeLoss > 0 ? (
                  <>
                    Income loss vs full pay:{" "}
                    <strong className="text-amber-600">
                      {formatCurrency(result.incomeLoss)}
                    </strong>
                  </>
                ) : (
                  <strong className="text-green-600">
                    No income loss — fully covered
                  </strong>
                )}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Employer-paid days ({result.employerDays} × full wage)
                </span>
                <span className="font-semibold">
                  {formatCurrency(result.employerPay)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Sickness benefit ({result.benefitDays} ×{" "}
                  {formatCurrency(result.dailyBenefitRate)})
                </span>
                <span className="font-semibold">
                  {formatCurrency(result.benefitPay)}
                </span>
              </div>
              {result.unpaidWaitingDays > 0 && (
                <div className="flex justify-between items-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <span className="text-sm text-muted-foreground">
                    Unpaid waiting days
                  </span>
                  <span className="font-semibold text-amber-600">
                    {result.unpaidWaitingDays} days
                  </span>
                </div>
              )}
            </div>
          </div>

          {result.exceedsAnnualCap && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Sickness benefit is capped at{" "}
                  <strong>{rates.MAX_BENEFIT_DAYS} days per year</strong>. Days
                  beyond the cap receive no benefit; after 156 continuous
                  benefit days the claim converts to the higher Increased
                  Sickness Benefit (€{rates.INCREASED_MARRIED}/€
                  {rates.INCREASED_SINGLE} daily).
                </p>
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
                    Benefit starts from the <strong>4th day</strong> of sickness
                    — a medical certificate (blue form) is required from day one
                  </li>
                  <li>
                    Your sector&apos;s Wage Regulation Order may grant more
                    employer-paid days (e.g., half-pay periods) — adjust the
                    field above
                  </li>
                  <li>
                    2026 daily rates: €{rates.DAILY_MARRIED} (maintaining
                    spouse) / €{rates.DAILY_SINGLE} (single or spouse working)
                  </li>
                  <li>
                    Submit certificates via mysocialsecurity.gov.mt within 10
                    days
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
