"use client";

import { cn } from "@/lib/utils";

export interface SegmentOption<T extends string | number> {
  value: T;
  label: string;
}

interface Props<T extends string | number> {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Görünür etiketin id'si; yoksa ariaLabel kullanılır */
  labelledBy?: string;
  ariaLabel?: string;
  /**
   * muted: gri zeminde seçili kart (yıl, dönem, görünüm)
   * outlined: kenarlıklı kutuda dolu seçim (vergi durumu, çocuk, SSC)
   */
  variant?: "muted" | "outlined";
  /** Seçenekleri eşit genişlikte yayar */
  stretch?: boolean;
  className?: string;
  itemClassName?: string;
}

// Basılı butonlar (aria-pressed): seçim hemen hesaplamaya yansır
export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  labelledBy,
  ariaLabel,
  variant = "muted",
  stretch = false,
  className,
  itemClassName,
}: Props<T>) {
  const isMuted = variant === "muted";

  return (
    <div
      role="group"
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : ariaLabel}
      className={cn(
        stretch ? "grid auto-cols-fr grid-flow-col" : "inline-flex",
        isMuted
          ? "gap-0.5 rounded-[10px] bg-muted p-[3px]"
          : "gap-1 rounded-xl border border-field p-1",
        className,
      )}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={String(option.value)}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isMuted
                ? cn(
                    "h-10 px-3 text-sm sm:h-[34px]",
                    isActive
                      ? "bg-card font-semibold text-foreground shadow-sm"
                      : "font-medium text-muted-foreground hover:text-foreground",
                  )
                : cn(
                    "h-11 px-3 text-[15px]",
                    isActive
                      ? "bg-primary font-semibold text-primary-foreground"
                      : "font-medium text-foreground hover:bg-accent",
                  ),
              itemClassName,
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
