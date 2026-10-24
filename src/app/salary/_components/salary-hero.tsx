import { CalendarDays } from "lucide-react";

// Ana sayfa ve /salary başlığı
export function SalaryHero() {
  return (
    <section className="flex w-full flex-col gap-2.5 pt-3 md:gap-3 md:pt-7 lg:pt-10">
      <span className="inline-flex h-7 items-center gap-1.5 self-start rounded-full border border-primary/25 bg-[var(--glass-bg)] px-2.5 text-xs font-medium text-primary-ink md:h-[30px] md:gap-2 md:px-3 md:text-[13px]">
        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
        Tax years 2024–2026
      </span>
      <h1 className="font-cal text-[34px] leading-[1.1] tracking-[-0.02em] md:text-[40px] lg:text-5xl">
        Malta Salary Calculator
      </h1>
      <p className="max-w-[640px] text-base leading-normal text-muted-foreground md:text-[17px] md:leading-[1.55] lg:text-lg">
        <span className="md:hidden">
          Your take-home pay after income tax and social security.
        </span>
        <span className="hidden md:inline">
          See your take-home pay after income tax and social security, or work
          out the gross salary you need.
        </span>
        <span className="hidden lg:inline"> Results update as you type.</span>
      </p>
    </section>
  );
}
