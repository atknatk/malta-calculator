"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { MoneyField } from "@/components/salary/money-field";
import { SegmentedControl } from "@/components/salary/segmented-control";
import {
  calculateOvertime,
  type OvertimeType,
} from "@/utils/overtime-calculator";

const typeOptions = [
  { value: "weekday", label: "Weekday" },
  { value: "sunday", label: "Rest day" },
  { value: "holiday", label: "Holiday" },
] as const;

const euro = new Intl.NumberFormat("en-GB", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

interface Props {
  /** sidebar: masaüstü yan kart; inline: tablet/mobilde makale içinde */
  layout: "sidebar" | "inline";
  className?: string;
}

// Makaledeki hızlı hesap; motor: src/utils/overtime-calculator.ts
export function OvertimeQuickCheck({ layout, className }: Props) {
  const [rate, setRate] = useState(15);
  const [hours, setHours] = useState(10);
  const [type, setType] = useState<OvertimeType>("weekday");
  const id = useId();
  const result = calculateOvertime({
    hourlyRate: rate,
    overtimeHours: hours,
    overtimeType: type,
  });
  const hoursLabel = (Math.round(result.hours * 100) / 100).toLocaleString(
    "en-GB",
    { maximumFractionDigits: 2 },
  );
  const inline = layout === "inline";

  return (
    <div
      className={cn(
        "flex flex-col gap-3.5 rounded-2xl border bg-card p-5",
        inline ? "md:p-[22px]" : "shadow-[var(--shadow-elevation)]",
        className,
      )}
    >
      <span className="text-[15px] font-semibold">Quick overtime check</span>
      <div
        className={cn(
          "grid grid-cols-2 gap-2.5",
          inline && "md:grid-cols-[1fr_1fr_1.4fr] md:items-end",
        )}
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-rate`} className="text-[13px] font-semibold">
            Hourly rate
          </label>
          <MoneyField
            id={`${id}-rate`}
            value={rate}
            onValueChange={setRate}
            className="h-11 px-2.5"
            inputClassName="font-semibold"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-hours`} className="text-[13px] font-semibold">
            Hours
          </label>
          <MoneyField
            id={`${id}-hours`}
            prefix={null}
            value={hours}
            onValueChange={setHours}
            className="h-11 px-2.5"
            inputClassName="font-semibold"
          />
        </div>
        <SegmentedControl
          ariaLabel="When the overtime is worked"
          options={typeOptions}
          value={type}
          onChange={setType}
          stretch
          className={cn("col-span-2", inline && "md:col-span-1")}
          itemClassName="h-10 px-1 text-xs sm:h-[34px]"
        />
      </div>
      <div
        aria-live="polite"
        className="flex items-baseline justify-between gap-2 border-t pt-3"
      >
        <span className="text-[13px] text-muted-foreground">
          {hoursLabel} h × {result.multiplier.toFixed(1)}×
        </span>
        <span className="text-2xl font-bold tabular-nums">
          €{euro.format(result.totalOvertimePay)}
        </span>
      </div>
      <Link
        href="/calculators/overtime"
        className="text-sm font-semibold text-primary-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Open the full calculator →
      </Link>
    </div>
  );
}
