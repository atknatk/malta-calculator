"use client";

import type { LucideIcon } from "lucide-react";
import { Shell } from "@/components/dashboard/shell";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  icon?: LucideIcon;
  variant?: "default" | "primary";
}

export function SalaryFormCard({
  title,
  icon: Icon,
  variant = "default",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <Shell
      variant="glass"
      className={cn(
        "group flex flex-col gap-4 transition-all duration-300",
        "hover:shadow-xl hover:shadow-primary/5",
        variant === "primary" && "border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        {Icon && (
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
              "group-hover:scale-105",
              variant === "primary"
                ? "bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/20"
                : "bg-gradient-to-br from-secondary to-secondary/80 text-white shadow-lg shadow-secondary/20"
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
        <h2
          className={cn(
            "font-cal text-xl font-bold",
            variant === "primary" ? "text-gradient" : "text-foreground"
          )}
        >
          {title}
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1">{children}</div>
    </Shell>
  );
}
