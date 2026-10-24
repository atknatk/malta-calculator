"use client";

import { useEffect, useId, useState } from "react";
import { ChevronDown, RotateCcw, Settings2, X } from "lucide-react";
import { Month } from "@/types/salary-calculator-type";
import { cn } from "@/lib/utils";
import { isMidWeekStart, parseDateOnly } from "@/utils/salary-calculator";
import { MoneyField } from "@/components/salary/money-field";
import type { SalarySearchParams } from "../search-params";
import { MONTHS, formatEuro } from "../_lib/salary-view";
import type { MonthlyBonuses } from "./salary-form";

const BIRTH_MIN = 1930;
const BIRTH_MAX = 2012;
const DEFAULT_BIRTH = 1990;

const fieldClass =
  "h-12 w-full rounded-xl border border-field bg-card px-3.5 text-base font-medium tabular-nums text-foreground transition-[border-color,box-shadow] focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20 aria-[invalid=true]:border-destructive";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">
      {children}
    </span>
  );
}

interface Props {
  params: SalarySearchParams;
  bonuses: MonthlyBonuses;
  onParamsChange: (patch: Partial<SalarySearchParams>) => void;
  onBonusesChange: (bonuses: MonthlyBonuses) => void;
  onReset: () => void;
}

export function SalaryMoreOptions({
  params,
  bonuses,
  onParamsChange,
  onBonusesChange,
  onReset,
}: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const year = parseInt(params.year);

  // Doğum yılı yazılırken geçersiz ara değerler hesaplamaya 1990 olarak gider
  const [birthText, setBirthText] = useState(String(params.birthYear));
  useEffect(() => {
    setBirthText((text) =>
      parseInt(text, 10) === params.birthYear ? text : String(params.birthYear),
    );
  }, [params.birthYear]);
  const birthNumber = parseInt(birthText, 10);
  const birthValid = birthNumber >= BIRTH_MIN && birthNumber <= BIRTH_MAX;

  // Bonus ayı seçili ama tutarı henüz girilmemiş olabilir
  const [pickedMonths, setPickedMonths] = useState<Set<Month>>(
    () => new Set(Object.keys(bonuses) as Month[]),
  );
  const bonusMonths = MONTHS.filter(
    (month) => pickedMonths.has(month) || (bonuses[month] ?? 0) > 0,
  );
  const bonusTotal = Object.values(bonuses).reduce(
    (total, amount) => total + (amount || 0),
    0,
  );

  // Eski paylaşım linkleri: startDate yoksa startOfMonth'un 1'i gösterilir
  const legacyStartIndex = MONTHS.indexOf(params.startOfMonth as Month);
  const startDateValue =
    params.startDate ||
    (legacyStartIndex > 0
      ? `${params.year}-${String(legacyStartIndex + 1).padStart(2, "0")}-01`
      : "");
  const startDate = parseDateOnly(startDateValue);
  const startMonthIndex =
    startDate && startDate.getFullYear() === year ? startDate.getMonth() : 0;
  const endMonthIndex = MONTHS.indexOf(params.endOfMonth as Month);
  const midWeek = isMidWeekStart(startDate);

  // Kapalı başlıkta seçili seçeneklerin kısa özeti
  const summary: string[] = [`Born ${params.birthYear}`];
  if (startDate || endMonthIndex < 11) {
    const from = startDate
      ? `${startDate.getDate()} ${MONTHS[startMonthIndex].slice(0, 3)}`
      : "Jan";
    summary.push(`${from}–${MONTHS[endMonthIndex].slice(0, 3)}`);
  }
  if (params.prevIncome + params.prevTax > 0) summary.push("Previous employer");
  const bonusCount = Object.values(bonuses).filter((b) => (b ?? 0) > 0).length;
  if (bonusCount > 0)
    summary.push(`${bonusCount} ${bonusCount === 1 ? "bonus" : "bonuses"}`);
  if (params.yearlyNonTaxBenefit + params.yearlyTaxableBenefit > 0)
    summary.push("Benefits");
  if (params.allowanceBonus > 0) summary.push("Allowance");

  const hasExtras =
    params.birthYear !== DEFAULT_BIRTH ||
    startDateValue !== "" ||
    endMonthIndex < 11 ||
    params.prevIncome + params.prevTax > 0 ||
    bonusMonths.length > 0 ||
    params.yearlyNonTaxBenefit +
      params.yearlyTaxableBenefit +
      params.allowanceBonus >
      0;

  const toggleBonusMonth = (month: Month) => {
    const next = new Set(pickedMonths);
    if (bonusMonths.includes(month)) {
      next.delete(month);
      const amounts = { ...bonuses };
      delete amounts[month];
      onBonusesChange(amounts);
    } else {
      next.add(month);
    }
    setPickedMonths(next);
  };

  const setBonusAmount = (month: Month, amount: number) => {
    const amounts = { ...bonuses };
    if (amount > 0) amounts[month] = amount;
    else delete amounts[month];
    onBonusesChange(amounts);
  };

  return (
    <div className="flex flex-col gap-[22px] border-t pt-3.5">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 w-full items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Settings2
          className="h-[18px] w-[18px] shrink-0 text-primary/70"
          aria-hidden="true"
        />
        <span className="shrink-0 text-[15px] font-semibold">More options</span>
        <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
          {summary.join(" · ")}
        </span>
        <ChevronDown
          className={cn(
            "h-[18px] w-[18px] shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div id={panelId} className="flex flex-col gap-[22px]">
          {/* Doğum yılı */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 sm:w-[calc((100%-32px)/3)]">
              <label htmlFor="birth-year" className="text-sm font-semibold">
                Birth year
              </label>
              <input
                id="birth-year"
                inputMode="numeric"
                autoComplete="off"
                value={birthText}
                aria-invalid={!birthValid}
                aria-describedby="birth-year-help"
                onChange={(event) => {
                  const text = event.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 4);
                  const value = parseInt(text, 10);
                  setBirthText(text);
                  onParamsChange({
                    birthYear:
                      value >= BIRTH_MIN && value <= BIRTH_MAX
                        ? value
                        : DEFAULT_BIRTH,
                  });
                }}
                className={fieldClass}
              />
            </div>
            <p
              id="birth-year-help"
              className={cn(
                "text-[13px]",
                birthValid ? "text-muted-foreground" : "text-destructive",
              )}
            >
              {birthValid
                ? "Born before 1962? Your weekly SSC cap is lower."
                : `Enter a birth year between ${BIRTH_MIN} and ${BIRTH_MAX}. We use ${DEFAULT_BIRTH} until then.`}
            </p>
          </div>

          {/* Çalışma dönemi */}
          <div className="flex flex-col gap-3">
            <SectionTitle>Employment period</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <span className="flex h-5 items-center justify-between">
                  <label htmlFor="start-date" className="text-sm font-semibold">
                    Start date
                  </label>
                  {startDateValue ? (
                    <button
                      type="button"
                      aria-label="Clear start date"
                      onClick={() =>
                        onParamsChange({
                          startDate: "",
                          startOfMonth: "January",
                        })
                      }
                      className="rounded text-[13px] font-semibold text-primary-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Clear
                    </button>
                  ) : null}
                </span>
                <input
                  id="start-date"
                  type="date"
                  min={`${params.year}-01-01`}
                  max={`${params.year}-12-31`}
                  value={startDateValue}
                  aria-describedby="employment-period-help"
                  onChange={(event) => {
                    const value = event.target.value;
                    const date = parseDateOnly(value);
                    const month =
                      date && date.getFullYear() === year ? date.getMonth() : 0;
                    // Eski "Start Month" parametresi sıfırlanır; tarih öncelikli
                    onParamsChange({
                      startDate: value,
                      startOfMonth: "January",
                      endOfMonth: MONTHS[
                        Math.max(month, endMonthIndex)
                      ] as SalarySearchParams["endOfMonth"],
                    });
                  }}
                  className={cn(fieldClass, "dark:[color-scheme:dark]")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="end-month"
                  className="flex h-5 items-center text-sm font-semibold"
                >
                  Last month worked
                </label>
                <select
                  id="end-month"
                  value={params.endOfMonth}
                  onChange={(event) =>
                    onParamsChange({
                      endOfMonth: event.target
                        .value as SalarySearchParams["endOfMonth"],
                    })
                  }
                  className={cn(fieldClass, "px-2.5")}
                >
                  {MONTHS.map((month, index) => (
                    <option
                      key={month}
                      value={month}
                      disabled={index < startMonthIndex}
                    >
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p
              id="employment-period-help"
              className="text-[13px] text-muted-foreground"
            >
              Leave the start date empty if you worked from 1 January. A
              mid-year start is paid pro-rata (salary by days, SSC by weeks
              worked, statutory bonuses by their 6-month period) and is not
              taxed as if you worked the full year.
            </p>
            {midWeek ? (
              <label className="mt-1 flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3">
                <input
                  type="checkbox"
                  checked={params.startWeekSSC}
                  onChange={(event) =>
                    onParamsChange({ startWeekSSC: event.target.checked })
                  }
                  className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-primary"
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold">
                    Pay SSC for the start week
                  </span>
                  <span className="text-[13px] text-muted-foreground">
                    You start mid-week. Untick if a previous employer already
                    paid SSC for this week.
                  </span>
                </span>
              </label>
            ) : null}
          </div>

          {/* Önceki işveren (FS3) */}
          <div className="flex flex-col gap-3">
            <SectionTitle>Previous employer this year</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="prev-income" className="text-sm font-semibold">
                  Taxable income earlier this year
                </label>
                <MoneyField
                  id="prev-income"
                  value={params.prevIncome}
                  onValueChange={(value) =>
                    onParamsChange({ prevIncome: Math.round(value) })
                  }
                  placeholder="0"
                  emptyWhenZero
                  aria-describedby="fs3-help"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="prev-tax" className="text-sm font-semibold">
                  Tax already paid this year
                </label>
                <MoneyField
                  id="prev-tax"
                  value={params.prevTax}
                  onValueChange={(value) =>
                    onParamsChange({ prevTax: Math.round(value) })
                  }
                  placeholder="0"
                  emptyWhenZero
                  aria-describedby="fs3-help"
                />
              </div>
            </div>
            <p id="fs3-help" className="text-[13px] text-muted-foreground">
              Optional. Copy both from the FS3 your previous employer gave you.
              They are added to the cumulative FSS calculation so the right tax
              band is used.
            </p>
          </div>

          {/* Yan haklar */}
          <div className="flex flex-col gap-3">
            <SectionTitle>Benefits</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="taxable-benefit"
                  className="text-sm font-semibold"
                >
                  Taxable benefits
                </label>
                <MoneyField
                  id="taxable-benefit"
                  value={params.yearlyTaxableBenefit}
                  onValueChange={(value) =>
                    onParamsChange({ yearlyTaxableBenefit: Math.round(value) })
                  }
                  placeholder="0"
                  suffix="/ year"
                  emptyWhenZero
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="non-tax-benefit"
                  className="text-sm font-semibold"
                >
                  Non-taxable benefits
                </label>
                <MoneyField
                  id="non-tax-benefit"
                  value={params.yearlyNonTaxBenefit}
                  onValueChange={(value) =>
                    onParamsChange({ yearlyNonTaxBenefit: Math.round(value) })
                  }
                  placeholder="0"
                  suffix="/ year"
                  emptyWhenZero
                />
              </div>
            </div>
            <p className="text-[13px] text-muted-foreground">
              Paid as one twelfth for each month you work, pro-rata in a part
              month. Taxable benefits count towards your income tax; non-taxable
              ones do not.
            </p>
          </div>

          {/* Bonuslar */}
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-2">
              <SectionTitle>Bonuses</SectionTitle>
              <span className="text-[13px] text-muted-foreground">
                Total{" "}
                <strong className="font-semibold tabular-nums text-foreground">
                  {formatEuro(bonusTotal)}
                </strong>
              </span>
            </div>
            <p className="text-[13px] text-muted-foreground">
              Pick the months you get a bonus, such as a performance bonus in
              March or an extra payment in December.
            </p>
            <div
              role="group"
              aria-label="Bonus months"
              className="grid grid-cols-6 gap-1.5 lg:grid-cols-12"
            >
              {MONTHS.map((month) => {
                const isOn = bonusMonths.includes(month);
                return (
                  <button
                    key={month}
                    type="button"
                    aria-pressed={isOn}
                    aria-label={`${month} bonus`}
                    onClick={() => toggleBonusMonth(month)}
                    className={cn(
                      "h-11 rounded-full border text-[13px] font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:h-9",
                      isOn
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-field bg-card text-foreground hover:bg-accent",
                    )}
                  >
                    {month.slice(0, 3)}
                  </button>
                );
              })}
            </div>
            {bonusMonths.map((month) => (
              <div key={month} className="flex items-center gap-3">
                <label
                  htmlFor={`bonus-${month}`}
                  className="w-24 shrink-0 text-sm font-semibold sm:w-[110px]"
                >
                  {month}
                </label>
                <MoneyField
                  id={`bonus-${month}`}
                  value={bonuses[month] ?? 0}
                  onValueChange={(value) => setBonusAmount(month, value)}
                  placeholder="Bonus amount"
                  emptyWhenZero
                  className="h-11 flex-1"
                />
                <button
                  type="button"
                  aria-label={`Remove ${month} bonus`}
                  onClick={() => toggleBonusMonth(month)}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="h-[18px] w-[18px]" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>

          {/* Aylık ödenek */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex w-full flex-col gap-2 sm:w-1/2">
                <label htmlFor="allowance" className="text-sm font-semibold">
                  Monthly allowance
                </label>
                <MoneyField
                  id="allowance"
                  value={params.allowanceBonus}
                  onValueChange={(value) =>
                    onParamsChange({ allowanceBonus: Math.round(value) })
                  }
                  placeholder="0"
                  suffix="/ month"
                  emptyWhenZero
                />
              </div>
              {hasExtras ? (
                <button
                  type="button"
                  onClick={() => {
                    setPickedMonths(new Set());
                    setBirthText(String(DEFAULT_BIRTH));
                    onReset();
                  }}
                  className="inline-flex h-11 items-center gap-2 rounded-[10px] px-3 text-sm font-semibold text-primary-ink transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Reset options
                </button>
              ) : null}
            </div>
            <p className="text-[13px] text-muted-foreground">
              A fixed allowance paid every month. Half of it is taxed and half
              is paid on top.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
