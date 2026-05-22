"use client";
import { Month } from "@/types/salary-calculator-type";
import { useState } from "react";
import {
  getAvailableYears,
  isChildCountEffective,
} from "@/config/malta-tax-config";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  Shield,
  Gift,
  Wallet,
  Sparkles,
  Baby,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PremiumInput,
  PremiumToggleGroup,
  GlassSection,
  AdvancedSettings,
} from "@/components/salary/form-primitives";

const monthValues = Object.values(Month) as [Month, ...Month[]];
const allYears = getAvailableYears().map((y) => y.toString());
const availableYears = allYears.slice(-3) as [string, ...string[]];
const currentYear = new Date().getFullYear().toString();

export type MonthlyBonuses = Partial<Record<Month, number>>;

export type NetToGrossFormValues = {
  targetNet: number;
  year: string;
  taxRateType: "single" | "married" | "parent";
  childCount: 0 | 1 | 2;
  sscCategory: "A" | "B" | "C";
  birthYear: number;
  startOfMonth?: Month;
  endOfMonth?: Month;
  yearlyNonTaxBenefit: number;
  yearlyTaxableBenefit: number;
  monthlyBonus: number;
  allowanceBonus: number;
  monthlyBonuses: MonthlyBonuses;
  includeBonusesInTarget: boolean;
};

export function NetToGrossCalculatorForm({
  values: valuesProp,
  onValuesChange: onValuesChangeProp,
  onFocusChange,
}: {
  values?: Partial<NetToGrossFormValues>;
  onValuesChange?: (values: Partial<NetToGrossFormValues>) => void;
  onFocusChange?: (focused: boolean) => void;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const formValues: NetToGrossFormValues = {
    targetNet: valuesProp?.targetNet ?? 20000,
    year: valuesProp?.year ?? currentYear,
    taxRateType: valuesProp?.taxRateType ?? "single",
    childCount: valuesProp?.childCount ?? 0,
    sscCategory: valuesProp?.sscCategory ?? "C",
    birthYear: valuesProp?.birthYear ?? 1990,
    startOfMonth: valuesProp?.startOfMonth ?? Month.January,
    endOfMonth: valuesProp?.endOfMonth ?? Month.December,
    yearlyNonTaxBenefit: valuesProp?.yearlyNonTaxBenefit ?? 0,
    yearlyTaxableBenefit: valuesProp?.yearlyTaxableBenefit ?? 0,
    monthlyBonus: valuesProp?.monthlyBonus ?? 0,
    allowanceBonus: valuesProp?.allowanceBonus ?? 0,
    monthlyBonuses: valuesProp?.monthlyBonuses ?? {},
    includeBonusesInTarget: valuesProp?.includeBonusesInTarget ?? false,
  };

  const showChildCount =
    isChildCountEffective(parseInt(formValues.year)) &&
    (formValues.taxRateType === "married" ||
      formValues.taxRateType === "parent");

  const updateValue = <K extends keyof NetToGrossFormValues>(
    key: K,
    value: NetToGrossFormValues[K],
  ) => {
    onValuesChangeProp?.({ ...valuesProp, [key]: value });
  };

  return (
    <div className="space-y-8">
      {/* Hero Section - Target Net Salary */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/15 via-green-500/10 to-emerald-500/10 rounded-3xl" />

        <div className="relative p-6 rounded-3xl border border-green-500/10 space-y-4">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold text-sm uppercase tracking-wide">
              Your Target Net
            </span>
          </div>

          <PremiumInput
            label="Annual Net Salary You Want"
            value={formValues.targetNet || ""}
            onChange={(v) =>
              updateValue("targetNet", v === "" ? 0 : parseFloat(v) || 0)
            }
            suffix="€/yr"
            description={
              formValues.includeBonusesInTarget
                ? "Total net (including bonuses & allowance) you want to take home"
                : "Net from base salary alone — bonuses & allowance are added on top"
            }
            large
            onFocusChange={onFocusChange}
          />

          {/* Include bonuses toggle */}
          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-background/50 border border-border/50 hover:border-green-500/30 transition-colors">
            <input
              type="checkbox"
              checked={formValues.includeBonusesInTarget}
              onChange={(e) =>
                updateValue("includeBonusesInTarget", e.target.checked)
              }
              className="mt-0.5 h-4 w-4 rounded border-border accent-green-600"
            />
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground block">
                Include bonuses &amp; allowance in net target
              </span>
              <span className="text-xs text-muted-foreground block mt-0.5">
                If ON, the target net covers everything. If OFF, bonuses are
                extra on top of your salary.
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Primary Settings */}
      <div className="space-y-6">
        <GlassSection icon={Calendar} title="Tax Year">
          <PremiumToggleGroup
            options={availableYears}
            value={formValues.year}
            onChange={(v) => updateValue("year", v)}
            size="lg"
          />
        </GlassSection>

        <GlassSection icon={Users} title="Tax Rate Type">
          <PremiumToggleGroup
            options={["single", "married", "parent"] as const}
            value={formValues.taxRateType}
            onChange={(v) => {
              if (v === "single") {
                onValuesChangeProp?.({
                  ...valuesProp,
                  taxRateType: v,
                  childCount: 0,
                });
              } else {
                updateValue("taxRateType", v);
              }
            }}
            labels={{
              single: "👤 Single",
              married: "💑 Married",
              parent: "👨‍👩‍👧 Parent",
            }}
            size="lg"
          />
        </GlassSection>

        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-150 ease-out",
            showChildCount
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            <GlassSection icon={Baby} title="Number of Children">
              <PremiumToggleGroup
                options={["0", "1", "2"] as const}
                value={formValues.childCount.toString() as "0" | "1" | "2"}
                onChange={(v) =>
                  updateValue("childCount", parseInt(v) as 0 | 1 | 2)
                }
                labels={{
                  "0": "No children",
                  "1": "1 child",
                  "2": "2+ children",
                }}
                size="default"
              />
              <p className="text-xs text-muted-foreground mt-2">
                From 2026, tax rates vary based on the number of children. This
                affects your tax deductions.
              </p>
            </GlassSection>
          </div>
        </div>

        <GlassSection icon={Shield} title="SSC Category">
          <PremiumToggleGroup
            options={["A", "B", "C"] as const}
            value={formValues.sscCategory}
            onChange={(v) => updateValue("sscCategory", v)}
            labels={{
              A: "Under 18",
              B: "Part-time",
              C: "Full-time",
            }}
            size="default"
          />
          <p className="text-xs text-muted-foreground">
            Category C is the standard for full-time employees. SSC rates vary
            based on birth year (before/after 1962).
          </p>
        </GlassSection>
      </div>

      <AdvancedSettings
        isOpen={showAdvanced}
        onToggle={() => setShowAdvanced(!showAdvanced)}
      >
        <PremiumInput
          icon={Calendar}
          label="Birth Year"
          value={formValues.birthYear}
          onChange={(v) => updateValue("birthYear", parseInt(v) || 1990)}
          description="Used to determine SSC rates (born before/after 1962)"
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">
              Start Month
            </label>
            <select
              value={formValues.startOfMonth}
              onChange={(e) =>
                updateValue("startOfMonth", e.target.value as Month)
              }
              className="w-full h-12 px-4 rounded-xl bg-background/80 backdrop-blur-sm border-2 border-border/50
                         focus:border-primary focus:ring-0 focus:outline-none
                         text-foreground font-medium transition-all duration-300 appearance-none
                         cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.75rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
            >
              {monthValues.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">
              End Month
            </label>
            <select
              value={formValues.endOfMonth}
              onChange={(e) =>
                updateValue("endOfMonth", e.target.value as Month)
              }
              className="w-full h-12 px-4 rounded-xl bg-background/80 backdrop-blur-sm border-2 border-border/50
                         focus:border-primary focus:ring-0 focus:outline-none
                         text-foreground font-medium transition-all duration-300 appearance-none
                         cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.75rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
            >
              {monthValues.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>

        <GlassSection icon={Gift} title="Benefits">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PremiumInput
              label="Yearly Non-Tax Benefit"
              value={formValues.yearlyNonTaxBenefit}
              onChange={(v) =>
                updateValue("yearlyNonTaxBenefit", parseFloat(v) || 0)
              }
              suffix="€"
            />
            <PremiumInput
              label="Yearly Taxable Benefit"
              value={formValues.yearlyTaxableBenefit}
              onChange={(v) =>
                updateValue("yearlyTaxableBenefit", parseFloat(v) || 0)
              }
              suffix="€"
            />
          </div>
        </GlassSection>

        <GlassSection icon={Wallet} title="Bonuses">
          <p className="text-xs text-muted-foreground mb-3">
            Add bonuses for specific months (e.g., 13th month salary in
            December, performance bonus in March)
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {monthValues.map((month) => {
              const hasBonus = (formValues.monthlyBonuses[month] ?? 0) > 0;
              return (
                <button
                  key={month}
                  type="button"
                  onClick={() => {
                    const newBonuses = { ...formValues.monthlyBonuses };
                    if (hasBonus) {
                      delete newBonuses[month];
                    } else {
                      newBonuses[month] = 0;
                    }
                    updateValue("monthlyBonuses", newBonuses);
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                    "border",
                    hasBonus
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-background hover:bg-muted text-muted-foreground border-border hover:border-primary/30",
                  )}
                >
                  {month.substring(0, 3)}
                  {hasBonus && <span className="ml-1 opacity-70">✓</span>}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="popLayout">
            {Object.entries(formValues.monthlyBonuses).length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 overflow-hidden"
              >
                {monthValues
                  .filter((m) => m in formValues.monthlyBonuses)
                  .map((month) => (
                    <motion.div
                      key={month}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-3 bg-muted/30 p-3 rounded-xl border border-border/50"
                    >
                      <span className="text-sm font-medium text-foreground min-w-[80px]">
                        {month}
                      </span>
                      <div className="flex-1 relative">
                        <input
                          type="number"
                          inputMode="decimal"
                          value={formValues.monthlyBonuses[month] || ""}
                          onChange={(e) => {
                            const newBonuses = {
                              ...formValues.monthlyBonuses,
                            };
                            const val = parseFloat(e.target.value) || 0;
                            if (val > 0) {
                              newBonuses[month] = val;
                            } else {
                              newBonuses[month] = 0;
                            }
                            updateValue("monthlyBonuses", newBonuses);
                          }}
                          onFocus={(e) => e.target.select()}
                          placeholder="Enter bonus amount"
                          className={cn(
                            "w-full h-10 px-3 pr-8 rounded-lg bg-background border border-border",
                            "focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none",
                            "text-sm font-medium",
                            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                          )}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          €
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newBonuses = {
                            ...formValues.monthlyBonuses,
                          };
                          delete newBonuses[month];
                          updateValue("monthlyBonuses", newBonuses);
                        }}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>

          {Object.values(formValues.monthlyBonuses).some((v) => v && v > 0) && (
            <div className="mt-3 pt-3 border-t border-border/30 flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                Total Monthly Bonuses:
              </span>
              <span className="font-bold text-primary">
                €
                {Object.values(formValues.monthlyBonuses)
                  .reduce((sum, v) => sum + (v || 0), 0)
                  .toLocaleString()}
              </span>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-border/30">
            <PremiumInput
              label="Monthly Allowance"
              value={formValues.allowanceBonus}
              onChange={(v) =>
                updateValue("allowanceBonus", parseFloat(v) || 0)
              }
              suffix="€"
              description="Fixed monthly allowance paid every month"
            />
          </div>
        </GlassSection>
      </AdvancedSettings>
    </div>
  );
}
