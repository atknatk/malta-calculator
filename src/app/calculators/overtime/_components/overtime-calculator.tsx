"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ArrowRight, Check, Copy, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { MoneyField } from "@/components/salary/money-field";
import { SegmentedControl } from "@/components/salary/segmented-control";
import { StickyResultBar } from "@/components/calculator-page/sticky-result-bar";
import {
  calculateHourlyRate,
  calculateOvertime,
  getOvertimeRates,
  type OvertimeType,
} from "@/utils/overtime-calculator";

const euro = new Intl.NumberFormat("en-GB", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const formatEuro = (value: number) => `€${euro.format(value)}`;
const formatHours = (value: number) =>
  (Math.round(value * 100) / 100).toLocaleString("en-GB", {
    maximumFractionDigits: 2,
  });

const basisOptions = [
  { value: "hourly", label: "Hourly rate" },
  { value: "annual", label: "Annual salary" },
] as const;

// Mobilde kısa etiketler (short / shortSub)
const typeOptions: {
  value: OvertimeType;
  label: string;
  sub: string;
  short: string;
  shortSub: string;
}[] = [
  {
    value: "weekday",
    label: "Weekday",
    sub: "1.5× rate",
    short: "Weekday",
    shortSub: "1.5×",
  },
  {
    value: "sunday",
    label: "Sunday or rest day",
    sub: "2× rate",
    short: "Rest day",
    shortSub: "Sunday · 2×",
  },
  {
    value: "holiday",
    label: "Public holiday",
    sub: "2× rate",
    short: "Holiday",
    shortSub: "Public · 2×",
  },
];

export function OvertimeCalculator() {
  const [basis, setBasis] = useState<"hourly" | "annual">("hourly");
  const [hourlyRate, setHourlyRate] = useState(15);
  const [annualSalary, setAnnualSalary] = useState(25000);
  const [overtimeHours, setOvertimeHours] = useState(10);
  const [overtimeType, setOvertimeType] = useState<OvertimeType>("weekday");
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLElement>(null);

  const effectiveHourlyRate =
    basis === "hourly" ? hourlyRate : calculateHourlyRate(annualSalary);

  const result = useMemo(
    () =>
      calculateOvertime({
        hourlyRate: effectiveHourlyRate,
        overtimeHours,
        overtimeType,
      }),
    [effectiveHourlyRate, overtimeHours, overtimeType],
  );
  const rates = getOvertimeRates();
  const multiplier = `${result.multiplier.toFixed(1)}×`;

  const stepHours = (delta: number) =>
    setOvertimeHours((hours) =>
      Math.max(0, Math.round((hours + delta) * 100) / 100),
    );

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${window.location.pathname}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const steps = [
    {
      title: "Your hourly rate",
      rule:
        basis === "hourly"
          ? "Your normal hourly rate, as entered."
          : "Annual salary ÷ (40 hours × 52 weeks).",
      live: `${formatEuro(result.baseHourlyRate)} an hour`,
    },
    {
      title: "Your overtime rate",
      rule: "Hourly rate × 1.5 on weekdays, or × 2 on Sundays, rest days and public holidays.",
      live: `${formatEuro(result.baseHourlyRate)} × ${multiplier.slice(0, -1)} = ${formatEuro(result.overtimeRate)}`,
    },
    {
      title: "Your overtime pay",
      rule: "Overtime rate × the overtime hours you worked.",
      live: `${formatEuro(result.overtimeRate)} × ${formatHours(result.hours)} h = ${formatEuro(result.totalOvertimePay)}`,
    },
  ];

  return (
    <div className="flex w-full flex-col">
      <section
        aria-label="Calculator"
        className="mt-5 grid items-start gap-4 md:mt-7 md:grid-cols-[minmax(0,1fr)_320px] md:gap-5 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-6"
      >
        <div className="flex flex-col gap-[22px] rounded-[20px] border bg-card p-[18px] shadow-sm md:gap-6 md:rounded-3xl md:p-6 lg:gap-[26px] lg:px-8 lg:py-7">
          {/* Mobil: ödeme türü ayrı satırda */}
          <div className="flex flex-col gap-2 sm:hidden">
            <span id="ot-basis-mobile" className="text-sm font-semibold">
              Your pay
            </span>
            <SegmentedControl
              labelledBy="ot-basis-mobile"
              options={basisOptions}
              value={basis}
              onChange={setBasis}
              stretch
              itemClassName="h-[42px]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="ot-amount" className="text-sm font-semibold">
                {basis === "hourly"
                  ? "Normal hourly rate"
                  : "Annual gross salary"}
              </label>
              <SegmentedControl
                ariaLabel="Pay basis"
                options={basisOptions}
                value={basis}
                onChange={setBasis}
                className="hidden sm:inline-flex"
                itemClassName="h-[30px] px-3 text-[13px]"
              />
            </div>
            <MoneyField
              id="ot-amount"
              size="lg"
              value={basis === "hourly" ? hourlyRate : annualSalary}
              onValueChange={
                basis === "hourly" ? setHourlyRate : setAnnualSalary
              }
              suffix={basis === "hourly" ? "/ hour" : "/ year"}
              aria-describedby="ot-amount-help"
            />
            <p
              id="ot-amount-help"
              className="text-[13px] text-muted-foreground"
            >
              {basis === "hourly"
                ? "Your normal hourly rate before overtime."
                : `Hourly rate: ${formatEuro(effectiveHourlyRate)} (based on 40 hours × 52 weeks).`}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="ot-hours" className="text-sm font-semibold">
              Overtime hours
            </label>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                aria-label="One hour less"
                onClick={() => stepHours(-1)}
                className="inline-flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl border border-field bg-card transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Minus className="h-5 w-5" aria-hidden="true" />
              </button>
              <MoneyField
                id="ot-hours"
                prefix={null}
                value={overtimeHours}
                onValueChange={setOvertimeHours}
                suffix="hours"
                aria-describedby="ot-hours-help"
                className="h-[52px] flex-1 px-4"
                inputClassName="text-center text-xl font-semibold"
              />
              <button
                type="button"
                aria-label="One hour more"
                onClick={() => stepHours(1)}
                className="inline-flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl border border-field bg-card transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Plus className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <p id="ot-hours-help" className="text-[13px] text-muted-foreground">
              The overtime hours you want to price, for example one week or one
              month.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span id="ot-type" className="text-sm font-semibold">
              When you work the overtime
            </span>
            <div
              role="group"
              aria-labelledby="ot-type"
              className="grid grid-cols-3 gap-1 rounded-xl border border-field p-1"
            >
              {typeOptions.map((option) => {
                const isActive = option.value === overtimeType;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setOvertimeType(option.value)}
                    className={cn(
                      "flex min-h-14 flex-col items-center justify-center gap-px rounded-lg px-2 text-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-accent",
                    )}
                  >
                    <span
                      className={cn(
                        "text-[15px]",
                        isActive ? "font-semibold" : "font-medium",
                      )}
                    >
                      <span className="sm:hidden">{option.short}</span>
                      <span className="hidden sm:inline">{option.label}</span>
                    </span>
                    <span className="text-xs">
                      <span className="sm:hidden">{option.shortSub}</span>
                      <span className="hidden sm:inline">{option.sub}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <aside
          ref={resultRef}
          id="overtime-result"
          aria-label="Your result"
          className="flex scroll-mt-4 flex-col gap-4 rounded-[20px] border bg-card p-[18px] shadow-[var(--shadow-elevation)] md:sticky md:top-4 md:rounded-3xl md:p-[22px] lg:top-6 lg:gap-5 lg:p-7"
        >
          <h2 className="text-sm font-semibold text-muted-foreground">
            Overtime pay
          </h2>
          <div aria-live="polite" className="flex flex-col gap-1 lg:gap-1.5">
            <span className="text-[42px] font-bold leading-[1.1] tracking-[-0.03em] tabular-nums md:text-[38px] lg:text-[52px] lg:leading-[1.05]">
              {formatEuro(Math.max(0, result.totalOvertimePay))}
            </span>
            <p className="text-sm text-muted-foreground">
              {result.description} · gross
              <span className="hidden lg:inline">, before tax and SSC</span>
            </p>
          </div>

          <dl className="flex flex-col text-[15px] tabular-nums">
            {[
              [
                "Normal hourly rate",
                `${formatEuro(result.baseHourlyRate)} / hr`,
              ],
              ["Multiplier", multiplier],
              ["Overtime rate", `${formatEuro(result.overtimeRate)} / hr`],
              ["Hours", `${formatHours(result.hours)} h`],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex h-11 items-center justify-between border-b"
              >
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
            <div className="flex h-12 items-center justify-between">
              <dt className="font-semibold">Overtime pay</dt>
              <dd className="text-base font-bold">
                {formatEuro(result.totalOvertimePay)}
              </dd>
            </div>
          </dl>

          <div className="flex flex-col gap-1.5 rounded-[14px] bg-muted px-3.5 py-3 lg:px-4 lg:py-3.5">
            <span className="text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              Malta overtime rates
            </span>
            {rates.map((rate) => {
              const isActive = rate.type === overtimeType;
              return (
                <div
                  key={rate.type}
                  className={cn(
                    "-mx-2 flex h-[34px] items-center justify-between rounded-lg px-2 text-sm lg:h-8",
                    isActive && "bg-primary/15 font-semibold",
                  )}
                >
                  <span>{rate.label}</span>
                  <span className="tabular-nums">
                    {rate.rate}{" "}
                    <span className="font-normal text-muted-foreground">
                      ({rate.percent})
                    </span>
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 lg:flex-row">
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex h-12 shrink-0 items-center justify-center lg:px-4 gap-2 rounded-[10px] border border-field bg-card text-[15px] font-semibold transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-11 md:text-sm"
            >
              {copied ? (
                <Check className="h-4 w-4 text-success" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
              <span aria-live="polite">
                {copied ? "Link copied" : "Copy link"}
              </span>
            </button>
            <Link
              href="/"
              className="hidden h-11 flex-1 items-center justify-center whitespace-nowrap rounded-[10px] border border-field bg-card px-3 text-sm font-semibold transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:inline-flex"
            >
              Net pay in Salary Calculator
            </Link>
          </div>
          <Link
            href="/"
            className="flex min-h-11 items-center justify-between gap-2.5 border-t pt-3 text-sm font-semibold text-primary-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          >
            <span>See your net pay in the Salary Calculator</span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
        </aside>
      </section>

      <section
        aria-labelledby="ot-how"
        className="mt-10 flex flex-col gap-4 md:mt-14 md:gap-5 lg:mt-16"
      >
        <h2
          id="ot-how"
          className="font-cal text-2xl leading-[1.25] lg:text-[28px]"
        >
          How it’s calculated
        </h2>
        <ol className="grid gap-3 md:grid-cols-3 md:gap-3.5 lg:gap-5">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col gap-2.5 rounded-2xl border bg-card p-[18px] lg:p-[22px]"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
              >
                {index + 1}
              </span>
              <span className="text-base font-semibold">{step.title}</span>
              <span className="text-sm text-muted-foreground">{step.rule}</span>
              <span className="mt-auto border-t pt-2.5 text-[15px] font-semibold tabular-nums">
                {step.live}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <StickyResultBar
        targetRef={resultRef}
        targetId="overtime-result"
        label="Overtime pay"
        value={formatEuro(Math.max(0, result.totalOvertimePay))}
      />
    </div>
  );
}
