"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Baby,
  Euro,
  Calculator,
  Info,
  Clock,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  calculateChildcare,
  formatCurrency,
  type ChildcareOutput,
  type ParentActivity,
} from "@/utils/childcare-calculator";

const ACTIVITY_OPTIONS: Array<{ value: ParentActivity; label: string }> = [
  { value: "working", label: "Working" },
  { value: "fullTimeStudent", label: "Full-time student" },
  { value: "partTimeStudent", label: "Part-time student" },
  { value: "notWorking", label: "Not working" },
];

function ActivityPicker({
  label,
  activity,
  hours,
  onActivity,
  onHours,
}: {
  label: string;
  activity: ParentActivity;
  hours: number;
  onActivity: (a: ParentActivity) => void;
  onHours: (h: number) => void;
}) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground/70">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        {ACTIVITY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onActivity(option.value)}
            className={cn(
              "min-h-12 px-3 rounded-xl border text-sm font-medium transition-all",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
              activity === option.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border hover:bg-muted",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      {activity === "working" && (
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Weekly working hours
          </label>
          <NumericInput
            value={hours}
            onChange={(v) => onHours(v === "" ? 0 : v)}
            min={0}
            max={80}
            allowDecimals={false}
            className="h-12 text-base px-4"
          />
        </div>
      )}
    </div>
  );
}

export function ChildcareCalculator() {
  const [singleParent, setSingleParent] = useState<"no" | "yes">("no");
  const [activity1, setActivity1] = useState<ParentActivity>("working");
  const [hours1, setHours1] = useState(40);
  const [activity2, setActivity2] = useState<ParentActivity>("working");
  const [hours2, setHours2] = useState(30);
  const [hourlyRate, setHourlyRate] = useState(5);

  const result = useMemo<ChildcareOutput>(() => {
    return calculateChildcare({
      singleParent: singleParent === "yes",
      parent1: { activity: activity1, weeklyHours: hours1 },
      parent2:
        singleParent === "yes"
          ? undefined
          : { activity: activity2, weeklyHours: hours2 },
      privateHourlyRate: hourlyRate,
    });
  }, [singleParent, activity1, hours1, activity2, hours2, hourlyRate]);

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
          Free Childcare Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto px-2">
          Work out how many free childcare hours your family qualifies for under
          Malta&apos;s Free Childcare Scheme — and what they&apos;re worth.
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

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Are you a single parent?
              </label>
              <div className="w-full grid grid-cols-2 rounded-lg border border-input bg-background shadow-sm">
                {(["no", "yes"] as const).map((option, index) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSingleParent(option)}
                    className={cn(
                      "min-h-12 text-sm font-medium transition-all px-2",
                      index === 0
                        ? "rounded-l-lg"
                        : "rounded-r-lg border-l border-input",
                      singleParent === option
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-foreground hover:bg-accent",
                    )}
                  >
                    {option === "no" ? "Couple" : "Single parent"}
                  </button>
                ))}
              </div>
            </div>

            <ActivityPicker
              label={singleParent === "yes" ? "Your situation" : "Parent 1"}
              activity={activity1}
              hours={hours1}
              onActivity={setActivity1}
              onHours={setHours1}
            />

            {singleParent === "no" && (
              <ActivityPicker
                label="Parent 2"
                activity={activity2}
                hours={hours2}
                onActivity={setActivity2}
                onHours={setHours2}
              />
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Euro className="h-4 w-4 text-primary/70" />
                Private Childcare Hourly Rate (your area)
              </label>
              <NumericInput
                value={hourlyRate}
                onChange={(v) => setHourlyRate(v === "" ? 0 : v)}
                min={0}
                max={20}
                allowDecimals={true}
                suffix="€/h"
                className="h-12 text-base px-4"
              />
              <p className="text-xs text-muted-foreground">
                Used only to estimate the value of your free hours — enter what
                centres near you charge.
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
                {result.eligible ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <XCircle className="h-5 w-5 text-primary" />
                )}
              </div>
              <span className="font-semibold">
                {result.eligible ? "Your Free Hours" : "Eligibility Result"}
              </span>
            </div>

            {result.eligible ? (
              <>
                <div className="text-center py-4 sm:py-6">
                  <motion.div
                    key={result.totalMonthlyHours}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary"
                  >
                    {result.totalMonthlyHours}h
                  </motion.div>
                  <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                    free per month (≈ {result.weeklyEquivalent}h/week)
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                    <span className="text-sm text-muted-foreground">
                      Base hours ({result.baseWeeklyHours}h/week × 52 ÷ 12)
                    </span>
                    <span className="font-semibold">
                      {result.baseMonthlyHours}h
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                    <span className="text-sm text-muted-foreground">
                      +10% contingency
                    </span>
                    <span className="font-semibold">
                      {result.contingencyHours}h
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                    <span className="text-sm text-muted-foreground">
                      +Commuting allowance
                    </span>
                    <span className="font-semibold">
                      {result.commuteHours}h
                    </span>
                  </div>
                  {result.estimatedAnnualValue > 0 && (
                    <div className="flex justify-between items-center p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                      <span className="text-sm text-muted-foreground">
                        Estimated yearly value (at €{hourlyRate}/h)
                      </span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(result.estimatedAnnualValue)}
                      </span>
                    </div>
                  )}
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
                <p className="text-xs text-muted-foreground px-2">
                  Alternative: families using a registered centre outside the
                  scheme can claim a tax rebate of up to{" "}
                  {formatCurrency(result.taxRebateAlternative)} per child per
                  year.
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
                    Covers children from 3 months until Kindergarten 1
                    eligibility
                  </li>
                  <li>
                    Entitlement follows the hours of the parent who works the
                    least; both parents must work or study
                  </li>
                  <li>
                    Jobsplus pays the childcare centre directly — outings, food
                    and nappies are not covered
                  </li>
                  <li>
                    Apply through a registered childcare centre with your latest
                    3 payslips and an employer declaration
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted/30 flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Students count as <strong>40h/week</strong> (full-time) or{" "}
              <strong>20h/week</strong> (part-time) towards the entitlement.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
