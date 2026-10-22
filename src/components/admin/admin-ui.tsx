import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Material 3 buton varyantları (filled / tonal / outlined / text)
export const mdButton = cva(
  "inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 text-sm font-medium tracking-[0.01em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary focus-visible:ring-offset-2 focus-visible:ring-offset-md-surface disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-[18px]",
  {
    variants: {
      variant: {
        filled:
          "bg-md-primary text-md-on-primary hover:shadow-md-1 hover:brightness-110",
        tonal:
          "bg-md-secondary-container text-md-on-secondary-container hover:shadow-md-1 hover:brightness-[0.97] dark:hover:brightness-110",
        outlined:
          "border border-md-outline text-md-primary hover:bg-md-primary/[0.08]",
        text: "px-3 text-md-primary hover:bg-md-primary/[0.08]",
        danger:
          "border border-md-error/50 text-md-error hover:bg-md-error/[0.08]",
      },
      size: {
        default: "",
        sm: "h-8 px-4 text-[13px] [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "filled", size: "default" },
  },
);

export type MdButtonProps = VariantProps<typeof mdButton>;

export const mdInput =
  "h-12 w-full rounded-xl border border-md-outline-variant bg-md-surface-container-lowest px-4 text-sm text-md-on-surface placeholder:text-md-on-surface-variant/60 transition focus:border-md-primary focus:outline-none focus:ring-2 focus:ring-md-primary/25 disabled:opacity-50";

export const mdLabel =
  "mb-1.5 block text-[13px] font-medium text-md-on-surface-variant";

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
}: PageHeaderProps): JSX.Element {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-2 text-[13px] font-medium text-md-on-surface-variant">
            {eyebrow}
          </div>
        )}
        <h1 className="text-[28px] font-normal leading-9 tracking-tight text-md-on-surface sm:text-[32px] sm:leading-10">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-md-on-surface-variant">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
}

interface MdCardProps {
  children: ReactNode;
  className?: string;
  variant?: "filled" | "elevated" | "outlined";
}

export function MdCard({
  children,
  className,
  variant = "elevated",
}: MdCardProps): JSX.Element {
  return (
    <div
      className={cn(
        "rounded-3xl",
        variant === "elevated" &&
          "bg-md-surface-container-lowest shadow-md-1 dark:bg-md-surface-container-low",
        variant === "filled" && "bg-md-surface-container-high",
        variant === "outlined" &&
          "border border-md-outline-variant bg-md-surface",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
}

export function CardHeader({
  title,
  subtitle,
  action,
  icon,
}: CardHeaderProps): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3 px-6 pb-2 pt-5">
      <div className="flex min-w-0 items-center gap-3">
        {icon && (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-md-primary-container text-md-on-primary-container [&_svg]:size-5">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-base font-medium text-md-on-surface">{title}</h2>
          {subtitle && (
            <p className="text-[13px] text-md-on-surface-variant">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

const chipTones = {
  neutral: "bg-md-surface-container-highest text-md-on-surface-variant",
  primary: "bg-md-primary-container text-md-on-primary-container",
  success: "bg-md-success-container text-md-on-success-container",
  warning: "bg-md-warning-container text-md-on-warning-container",
  error: "bg-md-error-container text-md-on-error-container",
  info: "bg-md-tertiary-container text-md-on-tertiary-container",
} as const;

export type ChipTone = keyof typeof chipTones;

export function StatusChip({
  tone = "neutral",
  children,
  className,
}: {
  tone?: ChipTone;
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-lg px-2 text-[11px] font-semibold uppercase tracking-wide [&_svg]:size-3",
        chipTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

// İsimden deterministik ton seçen baş harf avatarı
const avatarTones = [
  "bg-md-primary-container text-md-on-primary-container",
  "bg-md-tertiary-container text-md-on-tertiary-container",
  "bg-md-success-container text-md-on-success-container",
  "bg-md-secondary-container text-md-on-secondary-container",
];

export function Avatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}): JSX.Element {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  const hash = [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return (
    <div
      aria-hidden
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
        avatarTones[hash % avatarTones.length],
        className,
      )}
    >
      {initials || "?"}
    </div>
  );
}

export function LinearProgress({
  value,
  max,
  className,
}: {
  value: number;
  max: number;
  className?: string;
}): JSX.Element {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const tone =
    pct >= 100 ? "bg-md-error" : pct >= 80 ? "bg-amber-500" : "bg-md-primary";
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-md-surface-container-highest",
        className,
      )}
    >
      <div
        className={cn("h-full rounded-full transition-all", tone)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps): JSX.Element {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-[20px] bg-md-surface-container-high text-md-on-surface-variant [&_svg]:size-7">
        {icon}
      </div>
      <p className="text-base font-medium text-md-on-surface">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-md-on-surface-variant">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export const formatEuro = (amount: number): string =>
  `€${amount.toLocaleString("en-MT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  basic: "Basic",
  pro: "Pro",
};
