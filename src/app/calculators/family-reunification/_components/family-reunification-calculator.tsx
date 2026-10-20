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
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  calculateFamilyReunification,
  calculateKeiThreshold,
  compareBothSchemes,
  formatCurrency,
  getEligibility,
  getMonthlyBreakdown,
  WAGE_DATA,
  type SchemeType,
  type MedianBasis,
  type SponsorPermitType,
  type FamilyReunificationOutput,
  type RouteEligibility,
} from "@/utils/family-reunification-calculator";
import type { SimpleTaxType, ChildCount } from "@/config/malta-tax-config";

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

// Eligibility row for a single route
function RouteRow({ route }: { route: RouteEligibility }) {
  const canApplyNow = route.monthsRemaining === 0;
  const qualifies = canApplyNow && route.meetsIncome !== false;

  return (
    <div
      className={cn(
        "p-4 rounded-xl border space-y-2",
        qualifies
          ? "bg-emerald-500/5 border-emerald-500/30"
          : "bg-background border-border",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-medium text-sm">{route.label}</span>
        <span
          className={cn(
            "shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold",
            !canApplyNow
              ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
              : qualifies
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                : "bg-red-500/15 text-red-700 dark:text-red-400",
          )}
        >
          {!canApplyNow
            ? `Wait ${route.monthsRemaining} more month${route.monthsRemaining > 1 ? "s" : ""}`
            : qualifies
              ? "Can apply now"
              : "Income too low"}
        </span>
      </div>

      {route.requiredIncome > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>
            Required:{" "}
            <strong className="text-foreground">
              {formatCurrency(route.requiredIncome)} {route.incomeType}
            </strong>
          </span>
          {route.comparedIncome !== undefined && (
            <span className="inline-flex items-center gap-1">
              {route.meetsIncome ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-red-500" />
              )}
              Yours: {route.incomeType === "net" ? "~" : ""}
              {formatCurrency(route.comparedIncome)} {route.incomeType}
              {!route.meetsIncome &&
                ` (short by ${formatCurrency(route.requiredIncome - route.comparedIncome)})`}
            </span>
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground">{route.note}</p>
    </div>
  );
}

export function FamilyReunificationCalculator() {
  const [familyMemberCount, setFamilyMemberCount] = useState(1);
  const [scheme, setScheme] = useState<SchemeType>("family-reunification");
  const [medianBasis, setMedianBasis] = useState<MedianBasis>("identita");
  const [showComparison, setShowComparison] = useState(false);

  // Eligibility check inputs
  const [permitType, setPermitType] =
    useState<SponsorPermitType>("single-permit");
  const [monthsResident, setMonthsResident] = useState<number | "">(0);
  const [grossSalary, setGrossSalary] = useState<number | "">("");
  const [taxType, setTaxType] = useState<SimpleTaxType>("married");
  const [childCount, setChildCount] = useState<ChildCount>(0);

  const result = useMemo<FamilyReunificationOutput>(() => {
    return calculateFamilyReunification({
      familyMemberCount,
      scheme,
      medianBasis,
    });
  }, [familyMemberCount, scheme, medianBasis]);

  const comparison = useMemo(() => {
    return compareBothSchemes(familyMemberCount, medianBasis);
  }, [familyMemberCount, medianBasis]);

  const eligibility = useMemo(
    () =>
      getEligibility({
        permitType,
        monthsResident: monthsResident === "" ? 0 : monthsResident,
        familyMemberCount,
        grossAnnualSalary: grossSalary === "" ? undefined : grossSalary,
        simpleTaxType: taxType,
        childCount: taxType === "single" ? 0 : childCount,
      }),
    [
      permitType,
      monthsResident,
      familyMemberCount,
      grossSalary,
      taxType,
      childCount,
    ],
  );

  const monthlyBreakdown = getMonthlyBreakdown(result.minimumRequired);

  const keiThreshold = useMemo(
    () => calculateKeiThreshold(familyMemberCount),
    [familyMemberCount],
  );

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
                  ? "S.L. 217.06 — covers spouse (21+) and unmarried minor children only"
                  : "Identità ex-gratia policy — also covers dependent unmarried adult relatives"}
              </p>
            </div>

            {/* Median basis (Family Member Policy only) */}
            {scheme === "family-member-policy" && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground/70">
                  Median Wage Basis
                </label>
                <ToggleGroup
                  options={["identita", "nso-latest"] as const}
                  value={medianBasis}
                  onChange={setMedianBasis}
                  labels={{
                    identita: `Identità €${WAGE_DATA.medianWageNet.toLocaleString("en-MT")}`,
                    "nso-latest": `NSO ${WAGE_DATA.nsoLatestMedianYear} €${WAGE_DATA.nsoLatestMedian.toLocaleString("en-MT")}`,
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  {medianBasis === "identita"
                    ? `The figure Identità currently publishes (NSO release of ${WAGE_DATA.medianWageNetReference}).`
                    : `Projection: NSO has published a ${WAGE_DATA.nsoLatestMedianYear} median of €${WAGE_DATA.nsoLatestMedian.toLocaleString("en-MT")}. Identità has not adopted it yet, but says the figure is reviewed when NSO publishes a new median.`}
                </p>
              </div>
            )}

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
                {scheme === "family-reunification"
                  ? "Spouse (21+) and unmarried minor children"
                  : "Spouse (21+), unmarried minor children, and dependent adult relatives"}
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
                    <>
                      Base: average gross basic wage (
                      {WAGE_DATA.averageWageGrossReference}: €
                      {WAGE_DATA.averageWageGross.toLocaleString("en-MT")}) +
                      20% per family member. Sponsor needs 2 years of lawful
                      residence.
                    </>
                  ) : (
                    <>
                      Base: €{result.baseWage.toLocaleString("en-MT")} median
                      wage + 20% of the median per family member, tested against
                      your net income (gross minus income tax and SSC). Sponsor
                      needs 12 months of residence.
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

          {/* KEI / Specialist exception (Family Member Policy only) */}
          {scheme === "family-member-policy" && (
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">
                    KEI / Specialist Employee Initiative exception
                  </p>
                  <p className="text-muted-foreground text-xs mb-2">
                    Sponsors with an approval-in-principle letter may apply
                    without the 12-month tenure if their gross income meets the
                    enhanced threshold: €50,000 (sponsor + 1 dependent) plus
                    €6,000 per additional dependent.
                  </p>
                  <p className="text-xs">
                    For {familyMemberCount} family member
                    {familyMemberCount > 1 ? "s" : ""}, the KEI threshold is{" "}
                    <strong className="text-foreground">
                      {formatCurrency(keiThreshold)} gross/year
                    </strong>
                    .
                  </p>
                </div>
              </div>
            </div>
          )}

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
                    Average gross wage: NSO Labour Force Survey {WAGE_DATA.year}{" "}
                    (€
                    {WAGE_DATA.averageWageGross.toLocaleString("en-MT")}) — the
                    definition used by S.L. 217.06
                  </li>
                  <li>
                    Median wage: Identità reference{" "}
                    {WAGE_DATA.medianWageNetReference} (€
                    {WAGE_DATA.medianWageNet.toLocaleString("en-MT")}); NSO{" "}
                    {WAGE_DATA.nsoLatestMedianYear} median is €
                    {WAGE_DATA.nsoLatestMedian.toLocaleString("en-MT")}
                  </li>
                  <li>
                    Eligible income (Family Member Policy): employment, social
                    benefits, rental, unemployment/housing, regular cash
                    transfers — declared with the Commissioner of Revenue
                  </li>
                  <li>
                    Family Member Policy permits do not grant work rights — a
                    Single Permit is required for employment
                  </li>
                  <li>
                    Excludes EU citizens, refugees, SRA holders, and certain
                    other residence-document holders
                  </li>
                  <li>
                    Figures last reviewed {WAGE_DATA.lastReviewed} — always
                    confirm current figures with Identità Malta
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Eligibility & waiting period check */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border/50 space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="font-semibold">When Can I Apply?</span>
            <p className="text-xs text-muted-foreground">
              Waiting period and salary check for your permit type
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Your Residence Permit
              </label>
              <ToggleGroup
                options={["single-permit", "kei", "sei", "blue-card"] as const}
                value={permitType}
                onChange={setPermitType}
                labels={{
                  "single-permit": "Single Permit",
                  kei: "KEI",
                  sei: "SEI",
                  "blue-card": "Blue Card",
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/70">
                  Months in Malta
                </label>
                <NumericInput
                  value={monthsResident}
                  onChange={setMonthsResident}
                  min={0}
                  max={240}
                  allowDecimals={false}
                  suffix="months"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/70">
                  Gross Basic Salary
                </label>
                <NumericInput
                  value={grossSalary}
                  onChange={setGrossSalary}
                  min={0}
                  allowDecimals={false}
                  placeholder="Optional"
                  suffix="€/yr"
                />
              </div>
            </div>

            {grossSalary !== "" && grossSalary > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground/70">
                  Your Tax Status (for the net income estimate)
                </label>
                <ToggleGroup
                  options={["single", "married", "parent"] as const}
                  value={taxType}
                  onChange={setTaxType}
                  labels={{
                    single: "Single",
                    married: "Married",
                    parent: "Parent",
                  }}
                />
                {taxType !== "single" && (
                  <ToggleGroup
                    options={["0", "1", "2"] as const}
                    value={String(childCount) as "0" | "1" | "2"}
                    onChange={(v) => setChildCount(Number(v) as ChildCount)}
                    labels={{
                      "0": "No children",
                      "1": "1 child",
                      "2": "2+ children",
                    }}
                  />
                )}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Months count from the date your first residence permit was issued.
              KEI, SEI and Blue Card fast-tracks require an Approval in
              Principle letter. Net income is estimated with 2026 tax rates and
              SSC, excluding statutory bonuses.
            </p>
          </div>

          <div className="space-y-3">
            {eligibility.map((route) => (
              <RouteRow key={route.route} route={route} />
            ))}
            {medianBasis === "nso-latest" && (
              <p className="text-xs text-muted-foreground flex gap-2">
                <TrendingUp className="h-4 w-4 shrink-0" />
                The eligibility check uses Identità&apos;s current published
                median (€{WAGE_DATA.medianWageNet.toLocaleString("en-MT")}).
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
