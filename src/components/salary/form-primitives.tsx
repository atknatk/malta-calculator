"use client";

/**
 * Shared form primitives used by both /salary and /net-to-gross input forms.
 * Extracting these here avoids the previous duplicated copies of
 * PremiumInput / PremiumToggleGroup / GlassSection / AdvancedSettings.
 */

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Settings2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// PremiumInput — numeric input with optional suffix, label, icon, description.
// `large` flag bumps height/typography for hero salary fields and triggers a
// mobile auto-scroll so the field stays above the virtual keyboard.
// ---------------------------------------------------------------------------

export function PremiumInput({
  icon: Icon,
  label,
  value,
  onChange,
  suffix,
  description,
  large,
  onFocusChange,
}: {
  icon?: LucideIcon;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  suffix?: string;
  description?: string;
  large?: boolean;
  onFocusChange?: (focused: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
    onFocusChange?.(true);

    if (
      large &&
      typeof window !== "undefined" &&
      window.innerWidth < 768 &&
      inputRef.current
    ) {
      setTimeout(() => {
        if (inputRef.current) {
          window.scrollTo({ top: 180, behavior: "smooth" });
        }
      }, 150);
    }
  };

  const handleBlur = () => {
    onFocusChange?.(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-primary/70" />}
        {label}
      </label>
      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="number"
            step="100"
            inputMode="decimal"
            pattern="[0-9]*"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onWheel={(e) => e.currentTarget.blur()}
            className={cn(
              "w-full bg-background border border-border",
              "focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none",
              "text-foreground font-semibold placeholder:text-muted-foreground/70",
              "transition-all duration-200 rounded-xl",
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
              large ? "h-16 text-2xl px-5 pr-16" : "h-14 text-lg px-4 pr-12",
            )}
          />
          {suffix && (
            <div
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 font-medium text-muted-foreground",
                large ? "text-lg" : "text-base",
              )}
            >
              {suffix}
            </div>
          )}
        </div>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground pl-1">{description}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PremiumToggleGroup — segmented control (used for tax year, tax rate type,
// SSC category, child count). Visually a shadcn outline button group.
// ---------------------------------------------------------------------------

export function PremiumToggleGroup<T extends string>({
  options,
  value,
  onChange,
  labels,
  size = "default",
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  labels?: Partial<Record<T, string>>;
  size?: "sm" | "default" | "lg";
}) {
  const sizeClasses = {
    sm: "h-10 text-xs px-4",
    default: "h-12 text-sm px-5",
    lg: "h-14 text-base px-6",
  };

  return (
    <div className="w-full inline-flex items-center rounded-lg border border-input bg-background shadow-sm">
      {options.map((option, index) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "flex-1 relative font-medium transition-all duration-200",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:z-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
            index === 0 && "rounded-l-lg",
            index === options.length - 1 && "rounded-r-lg",
            index !== 0 && index !== options.length - 1 && "rounded-none",
            index !== 0 && "border-l border-input",
            value === option
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : "bg-background text-foreground",
            sizeClasses[size],
          )}
        >
          {labels?.[option] || option}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// GlassSection — labeled group with a glassmorphic icon badge header.
// ---------------------------------------------------------------------------

export function GlassSection({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/25 via-primary/15 to-secondary/10 border border-primary/20 shadow-lg shadow-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <span className="font-semibold text-foreground tracking-tight">
          {title}
        </span>
      </div>
      <div className="space-y-4 pl-1">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AdvancedSettings — collapsible "Advanced Settings" panel.
// ---------------------------------------------------------------------------

export function AdvancedSettings({
  isOpen,
  onToggle,
  children,
}: {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300",
          "bg-gradient-to-r from-muted via-primary/5 to-secondary/5 hover:from-primary/10 hover:via-primary/5 hover:to-secondary/10",
          "border border-border/30 hover:border-primary/30",
          "group",
        )}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Settings2 className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground">
            Advanced Settings
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="p-1"
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-6 space-y-6 px-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
