import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface Summary {
  annual: {
    gross: number;
    ssc: number;
    tax: number;
    net: number;
  };
  monthly: {
    gross: number;
    ssc: number;
    tax: number;
    net: number;
  };
}

export function SummaryCard({
  icon: Icon,
  label,
  value,
  variant = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  variant?: "default" | "success" | "warning" | "danger";
}) {
  const variantStyles = {
    default: "bg-muted",
    success: "bg-green-500/10 text-green-700 dark:text-green-400",
    warning: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
    danger: "bg-red-500/10 text-red-700 dark:text-red-400",
  };

  return (
    <div
      className={cn(
        "p-3 rounded-xl transition-all duration-300 hover:scale-[1.02]",
        variantStyles[variant],
      )}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3.5 w-3.5 opacity-70 flex-shrink-0" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div
        className={cn(
          "text-sm sm:text-base font-bold",
          variant !== "default" &&
            variantStyles[variant].split(" ").slice(1).join(" "),
        )}
      >
        {value}
      </div>
    </div>
  );
}
