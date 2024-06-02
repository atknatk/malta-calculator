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
  variant = "default",
  className,
  children,
  ...props
}: CardProps) {
  const shellClassName =
    variant === "default" ? "" : "bg-accent text-accent-foreground";
  return (
    <Shell
      className={cn(
        "group flex flex-col gap-3 hover:dark:border-card-foreground/30 hover:shadow",
        shellClassName,
        className,
      )}
      {...props}
    >
      <div className="flex-1 space-y-2">
        <h2 className={cn("font-cal text-xl")}>{title}</h2>
        <p className="text-muted-foreground">{children}</p>
      </div>
    </Shell>
  );
}
