"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Euro, Timer, Info, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  calculateOvertime,
  calculateHourlyRate,
  formatCurrency,
  getOvertimeRates,
  type OvertimeOutput,
  type OvertimeType,
} from "@/utils/overtime-calculator";

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

export function OvertimeCalculator() {
  const [inputType, setInputType] = useState<"hourly" | "annual">("hourly");
  const [hourlyRate, setHourlyRate] = useState(15);
  const [annualSalary, setAnnualSalary] = useState(25000);
  const [overtimeHours, setOvertimeHours] = useState(10);
  const [overtimeType, setOvertimeType] = useState<OvertimeType>("weekday");

  const effectiveHourlyRate =
    inputType === "hourly" ? hourlyRate : calculateHourlyRate(annualSalary);

  const result = useMemo<OvertimeOutput>(() => {
    return calculateOvertime({
      hourlyRate: effectiveHourlyRate,
      overtimeHours,
      overtimeType,
    });
  }, [effectiveHourlyRate, overtimeHours, overtimeType]);

  const rates = getOvertimeRates();

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Clock className="h-4 w-4" />
          Employment Tool
        </div>
        <h1 className="font-cal text-3xl md:text-4xl font-bold">
          Overtime Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Calculate your overtime pay based on Malta&apos;s employment
          regulations.
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
                <Euro className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">Rate Details</span>
            </div>

            {/* Input Type Toggle */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Calculate from
              </label>
              <ToggleGroup
                options={["hourly", "annual"] as const}
                value={inputType}
                onChange={setInputType}
                labels={{
                  hourly: "💵 Hourly Rate",
                  annual: "📊 Annual Salary",
                }}
              />
            </div>

            {/* Rate Input */}
            {inputType === "hourly" ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                  <Euro className="h-4 w-4 text-primary/70" />
                  Hourly Rate
                </label>
                <NumericInput
                  value={hourlyRate}
                  onChange={(v) => setHourlyRate(v === "" ? 0 : v)}
                  min={0}
                  allowDecimals={true}
                  suffix="€/hr"
                  className="h-14 px-4 text-lg"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                  <Euro className="h-4 w-4 text-primary/70" />
                  Annual Gross Salary
                </label>
                <NumericInput
                  value={annualSalary}
                  onChange={(v) => setAnnualSalary(v === "" ? 0 : v)}
                  min={0}
                  allowDecimals={false}
                  suffix="€/yr"
                  className="h-14 px-4 text-lg"
                />
                <p className="text-xs text-muted-foreground">
                  Hourly rate: {formatCurrency(effectiveHourlyRate)}/hr (based
                  on 40hr/week)
                </p>
              </div>
            )}

            {/* Overtime Hours */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Timer className="h-4 w-4 text-primary/70" />
                Overtime Hours
              </label>
              <NumericInput
                value={overtimeHours}
                onChange={(v) => setOvertimeHours(v === "" ? 0 : v)}
                min={0}
                allowDecimals={true}
                className="h-14 px-4 text-lg"
              />
            </div>

            {/* Overtime Type */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Overtime Type
              </label>
              <ToggleGroup
                options={["weekday", "sunday", "holiday"] as const}
                value={overtimeType}
                onChange={setOvertimeType}
                labels={{
                  weekday: "📅 Weekday",
                  sunday: "🌞 Sunday",
                  holiday: "🎉 Holiday",
                }}
              />
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
                <Euro className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">Overtime Pay</span>
            </div>

            <div className="text-center py-6">
              <motion.div
                key={result.totalOvertimePay}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl md:text-6xl font-bold text-primary"
              >
                {formatCurrency(result.totalOvertimePay)}
              </motion.div>
              <p className="text-muted-foreground mt-2">{result.description}</p>
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Base Hourly Rate
                </span>
                <span className="font-semibold">
                  {formatCurrency(result.baseHourlyRate)}/hr
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Multiplier
                </span>
                <span className="font-semibold text-primary">
                  {result.multiplier}×
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Overtime Rate
                </span>
                <span className="font-semibold">
                  {formatCurrency(result.overtimeRate)}/hr
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Hours Worked
                </span>
                <span className="font-semibold">{result.hours}h</span>
              </div>
            </div>
          </div>

          {/* Rate Table */}
          <div className="p-4 rounded-xl bg-muted/30">
            <div className="flex items-center gap-2 mb-3">
              <Percent className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Malta Overtime Rates</span>
            </div>
            <div className="space-y-2">
              {rates.map((rate) => (
                <div
                  key={rate.type}
                  className={cn(
                    "flex justify-between items-center p-2 rounded-lg text-sm",
                    rate.type === overtimeType ? "bg-primary/10" : "",
                  )}
                >
                  <span>{rate.label}</span>
                  <span className="font-medium">
                    {rate.rate} ({rate.percent})
                  </span>
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
                  <li>Maximum 48 hours/week average (including overtime)</li>
                  <li>Rates may vary by sector (Wage Regulation Orders)</li>
                  <li>Overtime must be agreed upon by both parties</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
