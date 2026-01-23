import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  href: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  variant?: "default" | "primary";
}

export function Card({
  title,
  description,
  href,
  variant = "default",
  icon,
  className,
  ...props
}: CardProps) {
  const isExternal = href.startsWith("http");
  const externalProps = isExternal
    ? { target: "_blank", rel: "noreferrer" }
    : {};

  const Icon = icon;

  return (
    <Link href={href} {...externalProps}>
      <div
        className={cn(
          "group relative overflow-hidden rounded-2xl transition-all duration-500",
          "premium-card hover:scale-[1.02]",
          variant === "primary" && "border-2 border-primary/20",
          className
        )}
        {...props}
      >
        {/* Gradient Background on Hover */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            variant === "primary"
              ? "from-primary/20 via-primary/10 to-transparent"
              : "from-secondary/20 via-secondary/10 to-transparent"
          )}
        />

        {/* Shimmer Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 animate-shimmer" />
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <h2 className="font-cal text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                {title}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
            </div>

            {Icon && (
              <div className="flex-shrink-0 ml-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                    "group-hover:scale-110 group-hover:rotate-[-8deg]",
                    variant === "primary"
                      ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-lg shadow-secondary/20"
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
            <span>Calculate</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        {/* Border Glow on Hover */}
        {variant === "primary" && (
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none animate-glow" />
        )}
      </div>
    </Link>
  );
}
