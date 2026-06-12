"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Euro,
  Calculator,
  Info,
  CalendarDays,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  calculateInWorkBenefit,
  formatCurrency,
  type HouseholdType,
  type InWorkBenefitOutput,
} from "@/utils/in-work-benefit-calculator";

const HOUSEHOLD_OPTIONS: Array<{
  value: HouseholdType;
  label: string;
  detail: string;
}> = [
  {
    value: "singleParent",
    label: "Single parent",
    detail: "Income €6,600–€35,000",
  },
  {
    value: "coupleBothWorking",
    label: "Couple — both working",
    detail: "Combined €10,000–€50,000",
  },
  {
    value: "coupleOneWorking",
    label: "Couple — one working",
    detail: "Income €6,600–€35,000",
  },
];

export function InWorkBenefitCalculator() {
  const [householdType, setHouseholdType] =
    useState<HouseholdType>("coupleBothWorking");
  const [annualIncome, setAnnualIncome] = useState(28000);
  const [lowerEarnerIncome, setLowerEarnerIncome] = useState(10000);
  const [childCount, setChildCount] = useState(2);

  const result = useMemo<InWorkBenefitOutput>(() => {
    return calculateInWorkBenefit({
      householdType,
      annualIncome,
      childCount,
      lowerEarnerIncome,
    });
  }, [householdType, annualIncome, childCount, lowerEarnerIncome]);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 sm:space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Users className="h-4 w-4" />
          Family Benefits
        </div>
        <h1 className="font-cal text-3xl md:text-4xl font-bold">
          In-Work Benefit Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto px-2">
          Check if your working family qualifies for Malta&apos;s In-Work
          Benefit in 2026 and the maximum yearly amount per child.
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
              <span className="font-semibold">Household Details</span>
            </div>

            {/* Household type — dikey radio kartlar (mobile-first) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">
                Household Type
              </label>
              {HOUSEHOLD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setHouseholdType(option.value)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 p-3 rounded-xl border text-left transition-all min-h-12",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                    householdType === option.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:bg-muted",
                  )}
                >
                  <span className="text-sm font-medium">{option.label}</span>
                  <span
                    className={cn(
                      "text-xs",
                      householdType === option.value
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground",
                    )}
                  >
                    {option.detail}
                  </span>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Euro className="h-4 w-4 text-primary/70" />
                {householdType === "coupleBothWorking"
                  ? "Combined Annual Employment Income"
                  : "Annual Employment Income"}
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
            </div>

            {householdType === "coupleBothWorking" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                  <Euro className="h-4 w-4 text-primary/70" />
                  Lower Earner&apos;s Annual Income
                </label>
                <NumericInput
                  value={lowerEarnerIncome}
                  onChange={(v) => setLowerEarnerIncome(v === "" ? 0 : v)}
                  min={0}
                  allowDecimals={false}
                  suffix="€"
                  className="h-12 text-base px-4"
                />
                <p className="text-xs text-muted-foreground">
                  The both-working rates require each parent to earn at least
                  €3,000.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">
                Children Under 23 Living at Home
              </label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setChildCount(n)}
                    className={cn(
                      "min-w-12 min-h-12 px-4 rounded-lg text-sm font-medium transition-all",
                      childCount === n
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border border-border hover:bg-muted",
                    )}
                  >
                    {n}
                  </button>
                ))}
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
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/20">
                {result.eligible ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <XCircle className="h-5 w-5 text-primary" />
                )}
              </div>
              <span className="font-semibold">
                {result.eligible ? "You Qualify" : "Eligibility Result"}
              </span>
            </div>

            {result.eligible ? (
              <>
                <div className="text-center py-4 sm:py-6">
                  <motion.div
                    key={result.annualMax}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary break-words"
                  >
                    {formatCurrency(result.annualMax)}
                  </motion.div>
                  <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                    maximum per year ·{" "}
                    <strong>{formatCurrency(result.maxPerChild)}</strong> per
                    child
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                    <span className="text-sm text-muted-foreground">
                      Rate Band
                    </span>
                    <span className="font-semibold">
                      {result.band === "full"
                        ? "Full rate band"
                        : "Reduced flat rate (€327)"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                    <span className="text-sm text-muted-foreground">
                      Children Counted
                    </span>
                    <span className="font-semibold">{childCount}</span>
                  </div>
                </div>

                {/* Quarterly schedule — mobilde 2 sütun */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      Quarterly Payments (up to)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["January", "April", "July", "October"].map((month) => (
                      <div
                        key={month}
                        className="p-3 rounded-xl bg-background/60 text-center"
                      >
                        <p className="text-xs text-muted-foreground">{month}</p>
                        <p className="text-sm font-bold">
                          {formatCurrency(result.quarterlyMax)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-6 text-center space-y-3">
                <p className="text-lg font-semibold">
                  Not eligible with these details
                </p>
                <p className="text-sm text-muted-foreground px-2">
                  {result.ineligibleReason}
                </p>
              </div>
            )}

            {result.reroutedToOneWorking && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs text-muted-foreground">
                  Because the lower earner makes under €3,000, the{" "}
                  <strong>couple — one working</strong> rates were applied
                  instead.
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
                  Important Notes
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>
                    Figures show the <strong>maximum</strong> for your band —
                    the exact award tapers with income on the official DSS scale
                  </li>
                  <li>
                    Paid quarterly (first Saturday of January, April, July,
                    October) into your bank account
                  </li>
                  <li>2026 awards are based on your 2024 declared income</li>
                  <li>
                    Apply or renew through mysocialsecurity.gov.mt — children
                    must be under 23 and living with you
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
