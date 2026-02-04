"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Euro,
  Calculator,
  Info,
  Percent,
  ArrowRight,
  Scale,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  calculateFamilyReunification,
  compareBothSchemes,
  formatCurrency,
  getMonthlyBreakdown,
  WAGE_DATA,
  type SchemeType,
  type FamilyReunificationOutput,
} from "@/utils/family-reunification-calculator";

// Toggle Group Component
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
            "flex-1 relative font-medium transition-all duration-200 h-12 text-sm px-4",
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

// Family Member Counter Component
function FamilyMemberCounter({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold transition-all",
          value <= 1
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "bg-primary/10 text-primary hover:bg-primary/20",
        )}
      >
        −
      </button>
      <div className="flex-1 text-center">
        <div className="text-4xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">
          {value === 1 ? "family member" : "family members"}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(Math.min(10, value + 1))}
        disabled={value >= 10}
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold transition-all",
          value >= 10
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "bg-primary/10 text-primary hover:bg-primary/20",
        )}
      >
        +
      </button>
    </div>
  );
}

export function FamilyReunificationCalculator() {
  const [familyMemberCount, setFamilyMemberCount] = useState(1);
  const [scheme, setScheme] = useState<SchemeType>("family-reunification");
  const [showComparison, setShowComparison] = useState(false);

  const result = useMemo<FamilyReunificationOutput>(() => {
    return calculateFamilyReunification({
      familyMemberCount,
      scheme,
    });
  }, [familyMemberCount, scheme]);

  const comparison = useMemo(() => {
    return compareBothSchemes(familyMemberCount);
  }, [familyMemberCount]);

  const monthlyBreakdown = getMonthlyBreakdown(result.minimumRequired);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Users className="h-4 w-4" />
          Immigration & Visa
        </div>
        <h1 className="font-cal text-3xl md:text-4xl font-bold">
          Family Reunification Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Calculate the minimum salary required to sponsor family members in
          Malta.
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
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">Application Details</span>
            </div>

            {/* Scheme Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Select Scheme
              </label>
              <ToggleGroup
                options={
                  ["family-reunification", "family-member-policy"] as const
                }
                value={scheme}
                onChange={setScheme}
                labels={{
                  "family-reunification": "Family Reunification",
                  "family-member-policy": "Family Member Policy",
                }}
              />
              <p className="text-xs text-muted-foreground">
                {scheme === "family-reunification"
                  ? "For Non-EU nationals bringing family through immigration"
                  : "For family members joining residents under specific policy"}
              </p>
            </div>

            {/* Family Member Count */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary/70" />
                Number of Family Members to Sponsor
              </label>
              <FamilyMemberCounter
                value={familyMemberCount}
                onChange={setFamilyMemberCount}
              />
              <p className="text-xs text-muted-foreground text-center">
                Includes spouse, children, and dependent relatives
              </p>
            </div>
          </div>

          {/* Scheme Info */}
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground mb-2">
                  {result.schemeName}
                </p>
                <p className="text-muted-foreground text-xs mb-2">
                  {scheme === "family-reunification" ? (
                    <>Base: Average Wage (Gross) + 20% for each family member</>
                  ) : (
                    <>
                      Base: €18,940 Net + 20% of median wage for each family
                      member
                    </>
                  )}
                </p>
                <a
                  href={result.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline"
                >
                  View Official Source <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Compare Button */}
          <button
            type="button"
            onClick={() => setShowComparison(!showComparison)}
            className="w-full p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors flex items-center justify-center gap-2"
          >
            <Scale className="h-4 w-4" />
            <span className="text-sm font-medium">
              {showComparison ? "Hide Comparison" : "Compare Both Schemes"}
            </span>
          </button>
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
              <span className="font-semibold">Minimum Required Income</span>
              <span className="ml-auto px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                {result.incomeType === "gross" ? "GROSS" : "NET"}
              </span>
            </div>

            <div className="text-center py-6">
              <motion.div
                key={result.minimumRequired}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl md:text-6xl font-bold text-primary"
              >
                {formatCurrency(result.minimumRequired)}
              </motion.div>
              <p className="text-muted-foreground mt-2">
                per year ({result.incomeType})
              </p>
            </div>

            {/* Monthly Breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-background/50 text-center">
                <div className="text-2xl font-bold">
                  {formatCurrency(monthlyBreakdown.monthly)}
                </div>
                <div className="text-xs text-muted-foreground">per month</div>
              </div>
              <div className="p-3 rounded-xl bg-background/50 text-center">
                <div className="text-2xl font-bold">
                  {formatCurrency(monthlyBreakdown.weekly)}
                </div>
                <div className="text-xs text-muted-foreground">per week</div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Base Salary
                </span>
                <span className="font-semibold">
                  {formatCurrency(result.breakdown.base)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Per Member (+{result.percentagePerMember}%)
                </span>
                <span className="font-semibold">
                  {formatCurrency(result.breakdown.perMemberAddition)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-primary/10 border border-primary/20">
                <span className="text-sm text-muted-foreground">
                  Additional for {familyMemberCount} member
                  {familyMemberCount > 1 ? "s" : ""}
                </span>
                <span className="font-semibold text-primary">
                  +{formatCurrency(result.breakdown.totalAddition)}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm">
              <p className="text-sm text-muted-foreground">
                {result.description}
              </p>
            </div>
          </div>

          {/* Comparison Card */}
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-6 rounded-3xl bg-muted/30 border border-border space-y-4"
            >
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Scheme Comparison</span>
              </div>
              <div className="grid gap-3">
                <div
                  className={cn(
                    "p-4 rounded-xl border",
                    scheme === "family-reunification"
                      ? "bg-primary/5 border-primary/30"
                      : "bg-background border-border",
                  )}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm">
                      Family Reunification
                    </span>
                    <span className="text-xs text-muted-foreground">Gross</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      comparison.familyReunification.minimumRequired,
                    )}
                  </div>
                </div>
                <div
                  className={cn(
                    "p-4 rounded-xl border",
                    scheme === "family-member-policy"
                      ? "bg-primary/5 border-primary/30"
                      : "bg-background border-border",
                  )}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm">
                      Family Member Policy
                    </span>
                    <span className="text-xs text-muted-foreground">Net</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      comparison.familyMemberPolicy.minimumRequired,
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Important Notes */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  Important Notes
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>
                    Average wage figures are from {WAGE_DATA.year} (NSO Malta)
                  </li>
                  <li>Wage requirements may be updated periodically by NSO</li>
                  <li>Additional documents and conditions may apply</li>
                  <li>Consult Identità Malta for official guidance</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
