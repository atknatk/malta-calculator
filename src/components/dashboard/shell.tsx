import { cn } from "@/lib/utils";

type ShellProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "glass" | "solid";
};

function Shell({ children, className, variant = "glass" }: ShellProps) {
  return (
    <div
      className={cn(
        "w-full rounded-2xl px-4 py-5 md:p-6",
        variant === "glass" && "glass border-border/50",
        variant === "solid" && "bg-card border border-border",
        variant === "default" && "border border-border backdrop-blur-[2px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export { Shell };
