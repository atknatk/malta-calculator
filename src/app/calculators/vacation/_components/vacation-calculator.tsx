"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Palmtree, Info, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  calculateVacationLeave,
  getPublicHolidayInfo,
  getAvailableVacationYears,
  type VacationLeaveOutput,
} from "@/utils/vacation-calculator";

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
            "flex-1 relative font-medium transition-all duration-200 h-12 text-sm px-3",
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

export function VacationCalculator() {
  const availableYears = getAvailableVacationYears();
  const currentYear = new Date().getFullYear();

  const [weeklyHours, setWeeklyHours] = useState(40);
  const [year, setYear] = useState(currentYear.toString());
  const [monthsWorked, setMonthsWorked] = useState(12);

  const result = useMemo<VacationLeaveOutput>(() => {
    return calculateVacationLeave({
      weeklyHours,
      year: parseInt(year),
      monthsWorked,
    });
  }, [weeklyHours, year, monthsWorked]);

  const holidayInfo = getPublicHolidayInfo(parseInt(year));

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Palmtree className="h-4 w-4" />
          Leave Entitlement
        </div>
        <h1 className="font-cal text-3xl md:text-4xl font-bold">
          Vacation Days Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Calculate your annual leave entitlement based on Malta employment law.
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
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">Working Details</span>
            </div>

            {/* Year Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Year
              </label>
              <ToggleGroup
                options={availableYears.map(String) as [string, ...string[]]}
                value={year}
                onChange={setYear}
              />
            </div>

            {/* Weekly Hours Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary/70" />
                Weekly Working Hours
              </label>
              <NumericInput
                value={weeklyHours}
                onChange={(v) => setWeeklyHours(v === "" ? 40 : v)}
                min={1}
                max={48}
                allowDecimals={false}
                className="h-14 px-4 text-lg"
              />
              <p className="text-xs text-muted-foreground">
                Standard full-time is 40 hours/week
              </p>
            </div>

            {/* Months Worked */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary/70" />
                Months Worked in {year}
              </label>
              <NumericInput
                value={monthsWorked}
                onChange={(v) => setMonthsWorked(v === "" ? 12 : v)}
                min={1}
                max={12}
                allowDecimals={false}
                className="h-14 px-4 text-lg"
              />
              <p className="text-xs text-muted-foreground">
                For pro-rata calculation if not working full year
              </p>
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
                <Sun className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">Your Vacation Entitlement</span>
            </div>

            <div className="text-center py-6">
              <motion.div
                key={result.totalHours}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl md:text-6xl font-bold text-primary"
              >
                {result.isProRata ? result.proRataHours : result.totalHours}h
              </motion.div>
              <p className="text-muted-foreground mt-2">
                (
                {result.isProRata
                  ? (result.proRataHours! / 8).toFixed(1)
                  : result.totalDays}{" "}
                working days)
              </p>
              {result.isProRata && (
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                  Pro-rata for {monthsWorked} months
                </p>
              )}
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Base Entitlement
                </span>
                <span className="font-semibold">
                  {result.baseHours}h ({result.baseHours / 8} days)
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Public Holiday Additions
                </span>
                <span className="font-semibold text-green-600">
                  +{result.publicHolidayHours}h
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-primary/10 border border-primary/20">
                <span className="text-sm font-medium">Total {year}</span>
                <span className="font-bold text-primary">
                  {result.totalHours}h
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm">
              <p className="text-sm text-muted-foreground">
                <strong>Employment Type:</strong> {result.description}
              </p>
            </div>
          </div>

          {/* Public Holiday Info */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex gap-3">
              <Calendar className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">
                  {holidayInfo.count} Public Holidays on Weekends in {year}
                </p>
                <p className="text-muted-foreground text-xs">
                  {holidayInfo.note}. These add {holidayInfo.extraHours}h to
                  your entitlement.
                </p>
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
                  <li>Minimum legal entitlement is 192 hours for full-time</li>
                  <li>
                    Up to 50% of unused leave may carry over (with approval)
                  </li>
                  <li>Leave accrues monthly on a pro-rata basis</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
