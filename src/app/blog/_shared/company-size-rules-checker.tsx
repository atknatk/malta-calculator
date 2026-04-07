"use client";

/**
 * Company Size Rules Checker — Mini interactive lookup tool
 *
 * Embedded inside Malta Single Permit blog posts (worker guide + employer
 * compliance guide). Lets the reader enter their company headcount and
 * instantly see which Single Permit / Labour Migration Policy rules apply.
 *
 * Source: Malta Labour Migration Policy 2025 (Identità) + S.L. 217.17.
 * All thresholds are static at build time — no API call.
 */

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Users,
  Briefcase,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";

type CompanySize = "micro" | "small" | "medium" | "large";

interface CompanyRules {
  size: CompanySize;
  label: string;
  range: string;
  /** Termination rate threshold for Single Permit rejection (target by 1 Jul 2026) */
  terminationRateThreshold: number | null; // null = exempt
  /** Initial threshold (15% higher), in effect until 1 Jul 2026 */
  initialTerminationThreshold: number | null;
  /** Maximum new foreign worker applications as % of existing workforce */
  workforceLimitPct: number | null; // null = exempt
  /** Min Maltese/EU/long-term-resident employees needed (Jan 2026 First Employment Rule) */
  minMalteseEUEmployees: number;
  /** Disability quota (universal 2%) */
  disabilityQuotaPct: number;
  /** Notable exemptions for this size band */
  notes: string[];
}

const RULES: Record<CompanySize, CompanyRules> = {
  micro: {
    size: "micro",
    label: "Micro",
    range: "1–9 employees",
    terminationRateThreshold: null,
    initialTerminationThreshold: null,
    workforceLimitPct: 200,
    minMalteseEUEmployees: 2,
    disabilityQuotaPct: 2,
    notes: [
      "Termination rate threshold does NOT apply (exempt).",
      "Highest growth headroom: up to 200% of current headcount in new foreign worker applications.",
      "From January 2026: must already employ at least 2 Maltese/EU nationals or long-term residents.",
    ],
  },
  small: {
    size: "small",
    label: "Small",
    range: "10–49 employees",
    terminationRateThreshold: 50,
    initialTerminationThreshold: 65,
    workforceLimitPct: 100,
    minMalteseEUEmployees: 4,
    disabilityQuotaPct: 2,
    notes: [
      "Termination rate threshold: applications rejected if rate exceeds 50%.",
      "Initial 65% threshold applies until 1 July 2026, then drops to 50%.",
      "From January 2026: must already employ at least 4 Maltese/EU/long-term-resident employees.",
    ],
  },
  medium: {
    size: "medium",
    label: "Medium",
    range: "50–249 employees",
    terminationRateThreshold: 45,
    initialTerminationThreshold: 60,
    workforceLimitPct: 50,
    minMalteseEUEmployees: 20,
    disabilityQuotaPct: 2,
    notes: [
      "Termination rate threshold: applications rejected above 45%.",
      "Initial 60% threshold applies until 1 July 2026, then drops to 45%.",
      "From January 2026: must already employ at least 20 Maltese/EU/long-term-resident employees.",
    ],
  },
  large: {
    size: "large",
    label: "Large",
    range: "250+ employees",
    terminationRateThreshold: 40,
    initialTerminationThreshold: 55,
    workforceLimitPct: 25,
    minMalteseEUEmployees: 40,
    disabilityQuotaPct: 2,
    notes: [
      "Termination rate threshold: applications rejected above 40%.",
      "Initial 55% threshold applies until 1 July 2026, then drops to 40%.",
      "From January 2026: must already employ at least 40 Maltese/EU/long-term-resident employees.",
      "Companies with over 80% foreign workforce face enhanced labour market needs testing.",
    ],
  },
};

function classify(employees: number): CompanySize {
  if (employees < 10) return "micro";
  if (employees < 50) return "small";
  if (employees < 250) return "medium";
  return "large";
}

export function CompanySizeRulesChecker() {
  const [employees, setEmployees] = useState<number>(8);

  const result = useMemo(() => {
    const size = classify(Math.max(0, employees));
    const rules = RULES[size];
    const maxNewWorkers =
      rules.workforceLimitPct !== null
        ? Math.floor((employees * rules.workforceLimitPct) / 100)
        : null;
    return { size, rules, maxNewWorkers };
  }, [employees]);

  return (
    <div className="not-prose my-8 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6 md:p-8">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-2.5">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Company Size Rules Checker</h3>
          <p className="text-sm text-muted-foreground">
            Enter your headcount to see which 2025–2026 Single Permit rules
            apply to you.
          </p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="employee-count"
            className="text-sm font-medium text-foreground/70"
          >
            Number of employees
          </label>
          <NumericInput
            value={employees}
            onChange={(v) => setEmployees(v === "" ? 0 : v)}
            min={0}
            max={9999}
            allowDecimals={false}
            className="h-14 px-4 text-lg"
            id="employee-count"
          />
        </div>

        <div className="flex flex-col justify-end">
          <div className="rounded-xl bg-background/60 p-4 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Your category
            </p>
            <motion.p
              key={result.size}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-2xl font-bold text-primary"
            >
              {result.rules.label}
            </motion.p>
            <p className="text-xs text-muted-foreground">
              {result.rules.range}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {/* Termination rate */}
        <RuleCard
          icon={<AlertCircle className="h-4 w-4" />}
          label="Termination rate threshold"
          value={
            result.rules.terminationRateThreshold === null
              ? "Exempt"
              : `${result.rules.terminationRateThreshold}%`
          }
          variant={
            result.rules.terminationRateThreshold === null ? "exempt" : "danger"
          }
          hint={
            result.rules.terminationRateThreshold === null
              ? "Companies under 10 employees are exempt from termination rate checks."
              : `Initial threshold ${result.rules.initialTerminationThreshold}% until 1 Jul 2026, then drops to target.`
          }
        />

        {/* Workforce limit */}
        <RuleCard
          icon={<Users className="h-4 w-4" />}
          label="Max new foreign worker applications"
          value={
            result.rules.workforceLimitPct === null
              ? "—"
              : `${result.rules.workforceLimitPct}% of headcount`
          }
          variant="info"
          hint={
            result.maxNewWorkers !== null && employees > 0
              ? `≈ ${result.maxNewWorkers} new applications based on your current ${employees} employees.`
              : "Calculated against headcount 12 months before the application date."
          }
        />

        {/* First Employment Rule */}
        <RuleCard
          icon={<Briefcase className="h-4 w-4" />}
          label="Min Maltese/EU employees (Jan 2026)"
          value={`${result.rules.minMalteseEUEmployees} required`}
          variant="warning"
          hint="From January 2026: First Employment Rule. You must already employ this many Maltese, EU/EEA, Swiss or long-term-resident workers before applying for foreign hires."
        />

        {/* Disability quota */}
        <RuleCard
          icon={<ShieldCheck className="h-4 w-4" />}
          label="Disability employment quota"
          value={`${result.rules.disabilityQuotaPct}% of workforce`}
          variant="info"
          hint="Persons with Disability (Employment) Act — at least 2% of your workforce or pay an annual contribution. Non-compliance suspends pending applications."
        />
      </div>

      {/* Notes */}
      <div className="mt-5 rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
          Notes for {result.rules.label} companies
        </p>
        <ul className="space-y-1.5 text-xs text-muted-foreground">
          {result.rules.notes.map((note, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-3 w-3 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Universal exemptions */}
      <div className="mt-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          Universal exemptions (any size)
        </p>
        <p className="text-xs text-muted-foreground">
          The termination rate threshold and workforce limit do{" "}
          <strong>not</strong> apply to KEI (Key Employee Initiative)
          applications, sports professionals, students, or healthcare / elderly
          / disability care roles. These categories follow their own fast-track
          rules.
        </p>
      </div>

      <p className="mt-4 text-[11px] text-muted-foreground">
        Source: Malta Labour Migration Policy (Identità, 2025) and S.L. 217.17 —
        Single Permit Regulations. Educational tool only; verify with Identità
        before submitting an application.
      </p>
    </div>
  );
}

function RuleCard({
  icon,
  label,
  value,
  hint,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  variant: "info" | "warning" | "danger" | "exempt";
}) {
  const styles = {
    info: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
    warning:
      "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400",
    danger:
      "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400",
    exempt:
      "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400",
  }[variant];

  return (
    <div className={cn("rounded-xl border p-4", styles)}>
      <div className="mb-1 flex items-center gap-2">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
        {hint}
      </p>
    </div>
  );
}
