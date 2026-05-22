"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModeToggleProps {
  /** Current active mode */
  active: "gross-to-net" | "net-to-gross";
  /** Pre-built href to the other mode, including carried-over params */
  otherHref: string;
}

/**
 * Switches between the two salary calculator directions while preserving
 * shared URL params (year, taxType, sscCategory, childCount, birthYear,
 * benefits, bonuses, allowance). The active side is highlighted; the inactive
 * side is a Link that navigates to the other mode with current state.
 */
export function CalculatorModeToggle({ active, otherHref }: ModeToggleProps) {
  const grossActive = active === "gross-to-net";

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/30 p-1.5 shadow-sm">
      <ModeButton
        active={grossActive}
        label="Gross → Net"
        sublabel="From gross salary"
        href={grossActive ? null : otherHref}
        variant="primary"
      />
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/60 text-muted-foreground">
        <ArrowLeftRight className="h-4 w-4" />
      </div>
      <ModeButton
        active={!grossActive}
        label="Net → Gross"
        sublabel="From take-home pay"
        href={grossActive ? otherHref : null}
        variant="success"
      />
    </div>
  );
}

function ModeButton({
  active,
  label,
  sublabel,
  href,
  variant,
}: {
  active: boolean;
  label: string;
  sublabel: string;
  href: string | null;
  variant: "primary" | "success";
}) {
  const styles = active
    ? variant === "primary"
      ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/20"
      : "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md shadow-green-500/20"
    : "bg-transparent text-muted-foreground hover:bg-background hover:text-foreground";

  const content = (
    <span className="flex flex-1 items-center justify-center gap-2 px-3 py-2 sm:px-4">
      <span className="flex flex-col items-start leading-tight">
        <span className="text-xs font-semibold sm:text-sm">{label}</span>
        <span
          className={cn(
            "hidden text-[10px] sm:block",
            active ? "opacity-90" : "opacity-60",
          )}
        >
          {sublabel}
        </span>
      </span>
      {!active && <ArrowRight className="h-3.5 w-3.5 opacity-70" />}
    </span>
  );

  const className = cn(
    "flex-1 inline-flex items-center justify-center rounded-xl transition-all duration-200",
    styles,
  );

  if (active || !href) {
    return (
      <div className={className} aria-current="page">
        {content}
      </div>
    );
  }

  return (
    <Link href={href} className={className} prefetch={false}>
      {content}
    </Link>
  );
}
