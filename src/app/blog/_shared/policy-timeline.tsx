/**
 * Policy Timeline — Visual phased rollout of Malta's 2025 Labour Migration Policy
 *
 * Server component (no "use client", no useState) — fully SSG.
 * Status badges are hardcoded at content-level rather than derived from
 * Date.now() so the build output is deterministic and there is no
 * hydration mismatch risk.
 *
 * Sources:
 * - Identità — Malta Labour Migration Policy Fact Sheet (July 2025)
 * - S.L. 217.17 (Single Permit Regulations)
 * - https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/employment-related-permits/
 *
 * Used by: /blog/malta-single-permit-guide-2026
 * Reusable from: /blog/malta-single-permit-employer-compliance-2026 (planned)
 */

import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Clock4,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

type RuleStatus = "in-force" | "expected" | "ongoing";
type BadgeVariant = "danger" | "warning" | "info" | "success";

interface PolicyRule {
  title: string;
  body: string;
  badge: string;
  badgeVariant: BadgeVariant;
}

interface TimelinePhase {
  date: string;
  heading: string;
  subhead: string;
  status: RuleStatus;
  rules: PolicyRule[];
}

const PHASES: TimelinePhase[] = [
  {
    date: "1 August 2025",
    heading: "The Big Changes",
    subhead: "Core rules now in effect",
    status: "in-force",
    rules: [
      {
        title: "Minimum termination rate thresholds",
        badge: "Critical for employers",
        badgeVariant: "danger",
        body: "Jobsplus checks employer termination rates before processing Single Permit applications. Rejection thresholds: Small (10–49) above 50%, Medium (50–249) above 45%, Large (250+) above 40%. Initial limits start 15 percentage points higher and tighten to target by 1 July 2026. Companies under 10 employees, KEI, sports, students and healthcare are exempt.",
      },
      {
        title: "Stricter job advertisement requirements",
        badge: "New requirement",
        badgeVariant: "warning",
        body: "Standard applications need one advert on Jobsplus and one on EURES, each for at least 3 weeks within the 2 months before submission. KEI, SEI, EU Blue Card and Skilled Occupation List applications need only one advert on a local media platform for 2 weeks.",
      },
      {
        title: "Redundancy block (12-month rule)",
        badge: "Watch carefully",
        badgeVariant: "warning",
        body: "If you made an employee redundant in the previous 12 months for the same role you are now trying to fill with a foreign national, the application is rejected. No exceptions.",
      },
      {
        title: "4-day Jobsplus engagement / termination form deadline",
        badge: "Non-negotiable deadline",
        badgeVariant: "danger",
        body: "Engagement and termination forms must be filed within 4 working days of the employee's start or end date. Miss this and all your pending Single Permit applications (except renewals) are suspended. Repeat offenders can be fully disqualified.",
      },
      {
        title: "Revised application fees",
        badge: "Fee change",
        badgeVariant: "info",
        body: "First-time applications €300 → €600. Change of employer €300 → €600. Renewals €300 → €150. Health, elderly and disability care roles are €150 across the board.",
      },
      {
        title: "Disability employment quota (2%)",
        badge: "Compliance required",
        badgeVariant: "warning",
        body: "The Persons with Disability (Employment) Act requires at least 2% of your workforce to be persons with disabilities, or you must pay an annual contribution. Non-compliance suspends all pending Single Permit applications (except renewals).",
      },
      {
        title: "New KEI €45,000 and SEI €30,000 salary thresholds",
        badge: "Salary thresholds up",
        badgeVariant: "info",
        body: "Key Employee Initiative (KEI) annual gross salary minimum increases from €35,000 to €45,000. Specialist Employee Initiative (SEI) increases from €25,000 to €30,000.",
      },
      {
        title: "Workforce application limits by company size",
        badge: "Applies by company size",
        badgeVariant: "info",
        body: "New foreign worker applications are capped as a percentage of your headcount 12 months earlier: Micro (1–9) up to 200%, Small (10–49) up to 100%, Medium (50–249) up to 50%, Large (250+) up to 25%. KEI, sports, students and healthcare are exempt.",
      },
      {
        title: "Grace period extended: 10 days → 30 days",
        badge: "Better for workers",
        badgeVariant: "success",
        body: "When a Single Permit holder loses their job they now have 30 days (up from 10) to find new employment and submit a new application. Extendable by a further 30 days with proof of sufficient financial means — a 60-day maximum window in total.",
      },
      {
        title: "No financial compensation from employees",
        badge: "Worker protection",
        badgeVariant: "success",
        body: "Employers cannot request any financial compensation from foreign workers in return for hiring or termination. This addresses reported exploitation in some sectors.",
      },
      {
        title: "Partners and families of Maltese citizens",
        badge: "New residency rights",
        badgeVariant: "success",
        body: "Partners of Maltese citizens and parents of Maltese citizens under 23 are granted a residence permit. They do not need a Single Permit to reside in Malta but must still obtain an employment licence from Jobsplus to work.",
      },
    ],
  },
  {
    date: "1 October 2025",
    heading: "October 2025 Changes",
    subhead: "Now in effect",
    status: "in-force",
    rules: [
      {
        title: "No more in-country applications from tourist visas",
        badge: "Loophole closed",
        badgeVariant: "danger",
        body: "Foreign nationals in Malta on a visa that does not permit employment (e.g. tourist visa) cannot apply for a Single Permit from within Malta. Any such application is rejected. Applicants must leave Malta and apply from abroad.",
      },
      {
        title: "Salary must be paid via licensed financial institution",
        badge: "No cash salaries",
        badgeVariant: "warning",
        body: "Foreign workers whose employment is registered on or after 1 August 2025 must receive their salaries through a licensed financial institution. Cash payments are not permitted.",
      },
      {
        title: "Interim permits for visa-waiver countries (60-day rule)",
        badge: "60-day window",
        badgeVariant: "info",
        body: "Nationals of visa-waiver countries who apply for a Single Permit within 60 days of entering the Schengen Area receive an interim permit covering them while the application is processed. From day 61 onwards, no interim permit — they must wait outside Schengen.",
      },
      {
        title: "Fixed renewal periods (Identità discretion removed)",
        badge: "Fixed terms",
        badgeVariant: "info",
        body: "Standard renewals: up to 2 years. KEI, SEI and EU Blue Card renewals: up to 3 years. Identità's discretion to grant different periods is removed. Low-skilled workers enrolled in Identità training programmes get 2-year renewals.",
      },
    ],
  },
  {
    date: "1 January 2026",
    heading: "January 2026 Changes",
    subhead: "Expected — formal issuance pending",
    status: "expected",
    rules: [
      {
        title: "Desk investigations of employment compliance",
        badge: "Up to 12-month ban",
        badgeVariant: "danger",
        body: "Employers who breach employment law face up to 12 months' disqualification from submitting new Single Permit applications. Outstanding tax or social security debt triggers disqualification until cleared.",
      },
      {
        title: "First Employment Rule",
        badge: "Expected Jan 2026",
        badgeVariant: "warning",
        body: "Before applying to hire foreign workers, employers must already employ a minimum number of Maltese, EU/EEA, Swiss or long-term-resident workers: Micro (1–9) at least 2; Small (10–49) at least 4; Medium (50–249) at least 20; Large (250+) at least 40.",
      },
      {
        title: "Minimum Maltese / EU national employees required",
        badge: "Expected Jan 2026",
        badgeVariant: "warning",
        body: "Same Micro/Small/Medium/Large thresholds as the First Employment Rule. Companies whose workforce is over 80% foreign will additionally face enhanced labour market needs testing.",
      },
      {
        title: "Suitability check: CV, qualifications, references, language",
        badge: "Expected Jan 2026",
        badgeVariant: "warning",
        body: "Each applicant faces an independent check: a signed CV relevant to the role, qualification certificates (with MQRIC recognition for lesser-known institutions), regulatory body approval for regulated occupations, at least 2 reference letters, and proof of English or Maltese at minimum IELTS Band 6 equivalent.",
      },
      {
        title: "Newly registered businesses lose Labour Market exemption",
        badge: "Expected Jan 2026",
        badgeVariant: "warning",
        body: "New businesses currently exempt from the Labour Market Needs Test lose that exemption. Additionally, new businesses without any Maltese, EU national or long-term resident among their owners can no longer apply for foreign workers — except FDI cases backed by Malta Enterprise.",
      },
      {
        title: "Mandatory Pre-Departure Course (Skills Pass)",
        badge: "Expected Jan 2026",
        badgeVariant: "warning",
        body: "Every first-time third-country applicant must complete a Pre-Departure Course on skillspass.org.mt before Identità issues Approval in Principle. €250 fee, two online modules plus a 20-minute live interview, completed within 42 days. Identità began verifying certificates on 1 March 2026.",
      },
    ],
  },
  {
    date: "October 2026 & ongoing",
    heading: "Longer-Term Changes",
    subhead: "Building the infrastructure",
    status: "ongoing",
    rules: [
      {
        title: "Register of Exemplary Employers",
        badge: "Reward for good employers",
        badgeVariant: "success",
        body: "Compliant employers who invest in official training schemes will be eligible for a fast-track register. Benefits: streamlined labour market testing and 2–4 year renewal periods for their staff.",
      },
      {
        title: "Occupation-specific salary study",
        badge: "Ongoing",
        badgeVariant: "info",
        body: "A study will determine salary levels across skilled occupations, forming the basis for occupation-specific salary thresholds for foreign workers. Employers will be expected to pay foreign workers in line with this study.",
      },
      {
        title: "List of high-risk countries",
        badge: "Ongoing",
        badgeVariant: "info",
        body: "A list of high-risk third countries will be created based on security, public policy or health concerns. Low-skilled job applications from nationals of these countries will be automatically rejected. Other categories reviewed individually.",
      },
      {
        title: "Quotas and hiring moratoria by occupation",
        badge: "Watch for announcements",
        badgeVariant: "info",
        body: "Jobsplus will continuously analyse labour market shortages and surpluses. Based on findings, it may implement temporary or permanent quotas or hiring bans on specific occupations. Announcements will be made when this happens.",
      },
    ],
  },
];

const STATUS_STYLES: Record<
  RuleStatus,
  { label: string; classes: string; icon: React.ReactNode }
> = {
  "in-force": {
    label: "In force",
    classes:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  expected: {
    label: "Expected",
    classes:
      "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30",
    icon: <Clock4 className="h-3.5 w-3.5" />,
  },
  ongoing: {
    label: "Ongoing",
    classes:
      "bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30",
    icon: <Sparkles className="h-3.5 w-3.5" />,
  },
};

const BADGE_STYLES: Record<BadgeVariant, string> = {
  danger:
    "bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20",
  warning:
    "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
  info: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20",
  success:
    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
};

export function PolicyTimeline() {
  return (
    <div className="not-prose my-8 space-y-6">
      {PHASES.map((phase) => (
        <PhaseCard key={phase.date} phase={phase} />
      ))}
    </div>
  );
}

function PhaseCard({ phase }: { phase: TimelinePhase }) {
  const status = STATUS_STYLES[phase.status];

  return (
    <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6 md:p-8">
      {/* Phase header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5">
            <CalendarClock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {phase.date}
            </p>
            <h3 className="mt-0.5 text-xl font-bold text-foreground">
              {phase.heading}
            </h3>
            <p className="text-sm text-muted-foreground">{phase.subhead}</p>
          </div>
        </div>

        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
            status.classes,
          )}
        >
          {status.icon}
          {status.label}
        </span>
      </div>

      {/* Rules grid */}
      <div className="grid gap-3 md:grid-cols-2">
        {phase.rules.map((rule) => (
          <RuleCard key={rule.title} rule={rule} />
        ))}
      </div>
    </div>
  );
}

function RuleCard({ rule }: { rule: PolicyRule }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/60 p-4 backdrop-blur-sm">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="text-sm font-bold leading-snug text-foreground">
          {rule.title}
        </h4>
        <AlertCircle className="h-4 w-4 flex-shrink-0 text-muted-foreground/50" />
      </div>
      <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
        {rule.body}
      </p>
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
          BADGE_STYLES[rule.badgeVariant],
        )}
      >
        {rule.badge}
      </span>
    </div>
  );
}
