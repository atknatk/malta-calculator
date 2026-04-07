"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Palmtree,
  User,
  Euro,
  Calendar,
  PiggyBank,
  Info,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  calculatePension,
  formatEUR,
  formatEUR2,
  getPensionReferenceTable,
  MPI_2026,
  MIN_CONTRIBUTION_YEARS,
  PENSION_EXEMPTION_LIMIT_2026,
  PRIVATE_PENSION_MAX_CONTRIBUTION,
  PRIVATE_PENSION_MAX_CREDIT,
  type DeferralYears,
  type PensionInput,
  type PensionOutput,
  type PensionTaxStatus,
} from "@/utils/pension-calculator";

// Premium Toggle Group — pattern from retirement-age-calculator
function ToggleGroup<T extends string | number>({
  options,
  value,
  onChange,
  labels,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  labels?: Partial<Record<T & (string | number), string>>;
}) {
  return (
    <div className="w-full inline-flex items-center rounded-lg border border-input bg-background shadow-sm overflow-hidden">
      {options.map((option, index) => (
        <button
          key={String(option)}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "flex-1 relative font-medium transition-all duration-200 h-11 text-sm px-2",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:z-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
            index !== 0 && "border-l border-input",
            value === option
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : "bg-background text-foreground",
          )}
        >
          {labels?.[option as T & (string | number)] ?? String(option)}
        </button>
      ))}
    </div>
  );
}

export function PensionCalculator() {
  const [birthYear, setBirthYear] = useState<number>(1970);
  const [taxStatus, setTaxStatus] = useState<PensionTaxStatus>("single");
  const [children, setChildren] = useState<number>(0);
  const [paidYears, setPaidYears] = useState<number>(25);
  const [averageSalary, setAverageSalary] = useState<number>(25000);
  const [deferralYears, setDeferralYears] = useState<DeferralYears>(0);
  const [privatePensionContribution, setPrivatePensionContribution] =
    useState<number>(0);

  const result = useMemo<PensionOutput>(() => {
    const input: PensionInput = {
      birthYear,
      taxStatus,
      children,
      paidYears,
      averageSalary,
      deferralYears,
      privatePensionContribution,
    };
    return calculatePension(input);
  }, [
    birthYear,
    taxStatus,
    children,
    paidYears,
    averageSalary,
    deferralYears,
    privatePensionContribution,
  ]);

  const reference = getPensionReferenceTable();

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
          Retirement Planning · 2026
        </div>
        <h1 className="font-cal text-3xl md:text-4xl font-bold">
          Malta Pension Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Estimate your Malta state pension under the Two-Thirds formula — with
          child credits, deferral bonus, private pension tax credit and 2026
          income-tax exemption rules.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* ============ INPUT SECTION ============ */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* About you */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border/50 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">About You</span>
            </div>

            {/* Birth year */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary/70" />
                Birth Year
              </label>
              <NumericInput
                value={birthYear}
                onChange={(v) => setBirthYear(v === "" ? 1970 : v)}
                min={1920}
                max={2010}
                allowDecimals={false}
                className="h-14 px-4 text-lg"
              />
            </div>

            {/* Tax status */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Tax Status
              </label>
              <ToggleGroup<PensionTaxStatus>
                options={["single", "married", "parent"] as const}
                value={taxStatus}
                onChange={setTaxStatus}
                labels={{
                  single: "Single",
                  married: "Married",
                  parent: "Parent",
                }}
              />
            </div>

            {/* Children */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Number of Children{" "}
                <span className="text-xs text-muted-foreground">
                  (for contribution credits)
                </span>
              </label>
              <ToggleGroup<number>
                options={[0, 1, 2, 3] as const}
                value={Math.min(children, 3)}
                onChange={(v) => setChildren(v)}
                labels={{ 0: "0", 1: "1", 2: "2", 3: "3+" }}
              />
              <p className="text-xs text-muted-foreground">
                {birthYear >= 1962
                  ? "4 credit years per child (max 3 children)"
                  : "2 credit years per child (max 3 children)"}
              </p>
            </div>
          </div>

          {/* Work history */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border/50 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">Work History</span>
            </div>

            {/* Paid years */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">
                Years of SSC Contributions Paid
              </label>
              <NumericInput
                value={paidYears}
                onChange={(v) => setPaidYears(v === "" ? 0 : v)}
                min={0}
                max={50}
                allowDecimals={false}
                className="h-14 px-4 text-lg"
              />
              <p className="text-xs text-muted-foreground">
                Minimum {MIN_CONTRIBUTION_YEARS} years required to qualify.
              </p>
            </div>

            {/* Avg salary */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Euro className="h-4 w-4 text-primary/70" />
                Average Annual Salary (best years)
              </label>
              <NumericInput
                value={averageSalary}
                onChange={(v) => setAverageSalary(v === "" ? 0 : v)}
                min={0}
                allowDecimals={false}
                suffix="€"
                className="h-14 px-4 text-lg"
                suffixClassName="text-base"
              />
              <p className="text-xs text-muted-foreground">
                Pension is capped at Maximum Pensionable Income of{" "}
                <strong>{formatEUR(MPI_2026)}</strong> for 2026.
              </p>
            </div>

            {/* Deferral */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Deferral Plan{" "}
                <span className="text-xs text-muted-foreground">
                  (claim later for a bonus)
                </span>
              </label>
              <ToggleGroup<DeferralYears>
                options={[0, 1, 2, 3, 4] as const}
                value={deferralYears}
                onChange={setDeferralYears}
                labels={{
                  0: "Now",
                  1: "+1y",
                  2: "+2y",
                  3: "+3y",
                  4: "+4y",
                }}
              />
              <p className="text-xs text-muted-foreground">
                Bonus: +1y (5%) · +2y (10%) · +3y (18%) · +4y (29%)
              </p>
            </div>
          </div>

          {/* Private pension */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border/50 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <PiggyBank className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">Private Pension (optional)</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">
                Annual Private Pension Contribution
              </label>
              <NumericInput
                value={privatePensionContribution}
                onChange={(v) =>
                  setPrivatePensionContribution(v === "" ? 0 : v)
                }
                min={0}
                max={10000}
                allowDecimals={false}
                suffix="€"
                className="h-14 px-4 text-lg"
                suffixClassName="text-base"
              />
              <p className="text-xs text-muted-foreground">
                25% tax credit on contributions up to{" "}
                {formatEUR(PRIVATE_PENSION_MAX_CONTRIBUTION)}/year · max credit{" "}
                {formatEUR(PRIVATE_PENSION_MAX_CREDIT)}.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ============ RESULT SECTION ============ */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Main card */}
          <div
            className={cn(
              "p-6 rounded-3xl border space-y-6",
              result.isEligible
                ? "bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border-primary/20"
                : "bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-orange-500/10 border-amber-500/20",
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-2.5 rounded-xl",
                  result.isEligible ? "bg-primary/20" : "bg-amber-500/20",
                )}
              >
                {result.isEligible ? (
                  <Palmtree className="h-5 w-5 text-primary" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                )}
              </div>
              <span className="font-semibold">
                {result.isEligible ? "Your State Pension" : "Not Yet Eligible"}
              </span>
            </div>

            {result.isEligible ? (
              <>
                <div className="text-center py-6">
                  <motion.div
                    key={result.annualPension}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl md:text-6xl font-bold text-primary"
                  >
                    {formatEUR(result.annualPension)}
                  </motion.div>
                  <p className="text-muted-foreground mt-2">per year</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm text-center">
                    <p className="text-xl font-bold text-foreground">
                      {formatEUR2(result.weeklyPension)}
                    </p>
                    <p className="text-xs text-muted-foreground">per week</p>
                  </div>
                  <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm text-center">
                    <p className="text-xl font-bold text-foreground">
                      {formatEUR(result.monthlyPension)}
                    </p>
                    <p className="text-xs text-muted-foreground">per month</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm">
                  <p className="text-sm text-muted-foreground">
                    <strong>Rule:</strong> {result.ruleDescription}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-6 space-y-2">
                <p className="text-muted-foreground">
                  You need at least{" "}
                  <strong className="text-foreground">
                    {MIN_CONTRIBUTION_YEARS} years
                  </strong>{" "}
                  of paid SSC contributions.
                </p>
                <p className="text-sm text-muted-foreground">
                  Currently: <strong>{result.paidYears} years</strong> paid.
                  Consider paying back up to 5 years to close the gap.
                </p>
              </div>
            )}
          </div>

          {/* Breakdown */}
          <div className="p-6 rounded-3xl bg-card border border-border/50 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">Annual Breakdown</span>
            </div>
            <div className="space-y-2 text-sm">
              <BreakdownRow
                label="Pensionable income"
                value={formatEUR(result.pensionableIncome)}
                hint={result.isMPICapped ? `Capped at MPI` : undefined}
              />
              <BreakdownRow
                label={`Contribution proportion (${result.effectiveYears}/${result.requiredYears})`}
                value={`${(result.proportion * 100).toFixed(1)}%`}
              />
              {result.childCredits > 0 && (
                <BreakdownRow
                  label="Child credits"
                  value={`+${result.childCredits} yr`}
                />
              )}
              <BreakdownRow
                label="Base pension (2/3 × pensionable × proportion)"
                value={formatEUR(result.baseAnnualPension)}
              />
              {result.deferralBonusRate > 0 && (
                <BreakdownRow
                  label={`Deferral bonus (+${(
                    result.deferralBonusRate * 100
                  ).toFixed(0)}%)`}
                  value={`+${formatEUR(result.deferralBonusAmount)}`}
                />
              )}
              <BreakdownRow
                label="COLA increase (€10/week)"
                value={`+${formatEUR(result.annualCola)}`}
              />
              <div className="h-px bg-border my-2" />
              <BreakdownRow
                label="State pension (annual)"
                value={formatEUR(result.annualPension)}
                strong
              />
              <BreakdownRow
                label="Private pension tax credit"
                value={`+${formatEUR(result.privateTaxCredit)}`}
              />
              <div className="h-px bg-border my-2" />
              <BreakdownRow
                label="Total annual income (incl. credit)"
                value={formatEUR(result.totalAnnualIncome)}
                strong
              />
            </div>
          </div>

          {/* Tax status card */}
          <div
            className={cn(
              "p-4 rounded-xl border",
              result.isPensionFullyExempt
                ? "bg-green-500/10 border-green-500/20"
                : "bg-amber-500/10 border-amber-500/20",
            )}
          >
            <div className="flex gap-3">
              <ShieldCheck
                className={cn(
                  "h-5 w-5 flex-shrink-0 mt-0.5",
                  result.isPensionFullyExempt
                    ? "text-green-500"
                    : "text-amber-500",
                )}
              />
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">
                  {result.isPensionFullyExempt
                    ? "Pension fully tax-exempt in 2026"
                    : "Partial tax liability"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Under LN 53/2026, pension income is 100% exempt up to{" "}
                  {formatEUR(PENSION_EXEMPTION_LIMIT_2026)}.{" "}
                  {result.isPensionFullyExempt
                    ? "Your estimated pension is below this threshold — no income tax due."
                    : `Approximately ${formatEUR(
                        result.taxablePensionAfterExemption,
                      )} is above the exemption and remains taxable at normal rates.`}
                </p>
              </div>
            </div>
          </div>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium text-foreground">
                  Notes
                </span>
              </div>
              <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                {result.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Source info */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  Official Sources
                </p>
                <p className="text-xs">
                  Based on Malta Social Security Act (Cap. 318), LN 53/2026
                  (pension income exemption) and Department of Social Security
                  pension formula. Guidance only — contact the{" "}
                  <strong>Department of Social Security</strong> for an official
                  pension assessment.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ============ REFERENCE TABLE ============ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12"
      >
        <h2 className="text-xl font-semibold mb-4">
          Required Contribution Years by Birth Year
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Based on Malta Social Security Act (Cap. 318)
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-semibold">Birth Year</th>
                <th className="text-left p-4 font-semibold">Required Years</th>
                <th className="text-left p-4 font-semibold">Retirement Age</th>
              </tr>
            </thead>
            <tbody>
              {reference.map((row) => (
                <tr
                  key={row.birthYears}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">{row.birthYears}</td>
                  <td className="p-4 font-medium">{row.requiredYears} years</td>
                  <td className="p-4">{row.retirementAge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  hint,
  strong,
}: {
  label: string;
  value: string;
  hint?: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span
        className={cn(
          "text-muted-foreground",
          strong && "text-foreground font-semibold",
        )}
      >
        {label}
        {hint && (
          <span className="block text-xs text-muted-foreground/70">{hint}</span>
        )}
      </span>
      <span className={cn("tabular-nums", strong && "font-bold")}>{value}</span>
    </div>
  );
}
