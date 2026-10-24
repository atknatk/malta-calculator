"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Calculator,
  Check,
  CreditCard,
  Minus,
  Plus,
  RotateCcw,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PricingCard from "./pricing-card";

export interface PlanInfo {
  id: "free" | "basic" | "pro";
  name: string;
  price: number;
  employees: number;
  payslipsPerMonth: number;
  features: string[];
}

const money = (value: number) =>
  `€${value.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Karşılaştırma satırları: PLANS özelliklerinin tablo hali (free, basic, pro)
const COMPARE_ROWS: [string, (string | boolean)[]][] = [
  ["Custom company logo", [false, true, true]],
  ["Malta Calculator branding", ["Shown", "None", "None"]],
  ["Support", [false, "Email", "Priority"]],
  ["Bulk payslip generation", [false, false, true]],
  ["Employee portal access", [false, false, true]],
];

interface Props {
  plans: PlanInfo[];
  isLoggedIn: boolean;
}

// Her çalışana ayda bir bordro: ekip büyüklüğü iki limiti de belirler
export function PricingPlans({ plans, isLoggedIn }: Props) {
  const [team, setTeam] = useState("5");
  const count = parseInt(team, 10) || 0;
  const fitPlan =
    count < 1 ? undefined : plans.find((plan) => count <= plan.employees);
  const isOver = count > 0 && !fitPlan;
  const people = count === 1 ? "1 employee" : `${count} employees`;

  let fitTitle = "Enter your team size.";
  let fitText = "We will point you to the plan that fits.";
  if (fitPlan && fitPlan.price === 0) {
    fitTitle = `${fitPlan.name} fits ${people}.`;
    fitText = `Up to ${fitPlan.employees} employees and ${fitPlan.payslipsPerMonth} payslips a month, at no cost.`;
  } else if (fitPlan) {
    fitTitle = `${fitPlan.name} fits ${people}.`;
    fitText = `Up to ${fitPlan.employees} employees and ${fitPlan.payslipsPerMonth} payslips a month for ${money(fitPlan.price)} a month, about ${money(fitPlan.price / count)} per employee.`;
  } else if (isOver) {
    const largest = plans[plans.length - 1];
    fitTitle = `More than ${largest.employees} employees?`;
    fitText = `${largest.name} covers up to ${largest.employees} employees.`;
  }

  const step = (delta: number) =>
    setTeam(String(Math.min(999, Math.max(1, count + delta))));

  const compareRows: [string, (string | boolean)[]][] = [
    ["Employees", plans.map((p) => String(p.employees))],
    ["Payslips per month", plans.map((p) => String(p.payslipsPerMonth))],
    ...COMPARE_ROWS,
  ];

  return (
    <>
      <section
        aria-label="Find your plan"
        className="mx-auto mt-6 flex w-full max-w-[840px] flex-col gap-3 rounded-[20px] border bg-card p-4 md:mt-8 md:flex-row md:items-center md:gap-4 md:py-3.5 md:pl-3.5 md:pr-5"
      >
        <label
          htmlFor="team-size"
          className="flex shrink-0 items-center gap-3 text-[15px] font-semibold"
        >
          <span
            aria-hidden="true"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-ink"
          >
            <Users className="h-5 w-5" />
          </span>
          How many employees do you pay?
        </label>
        <div className="flex shrink-0 items-center gap-0.5 rounded-xl border border-field p-[3px]">
          <button
            type="button"
            aria-label="Fewer employees"
            onClick={() => step(-1)}
            disabled={count <= 1}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40 md:h-10 md:w-10"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <input
            id="team-size"
            inputMode="numeric"
            autoComplete="off"
            aria-describedby="team-fit"
            value={team}
            onChange={(event) =>
              setTeam(event.target.value.replace(/[^0-9]/g, "").slice(0, 3))
            }
            className="h-11 min-w-0 flex-1 bg-transparent text-center text-lg font-semibold tabular-nums focus:outline-none md:h-10 md:w-[52px] md:flex-none"
          />
          <button
            type="button"
            aria-label="More employees"
            onClick={() => step(1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-10 md:w-10"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <p
          id="team-fit"
          aria-live="polite"
          className="min-w-0 flex-1 text-sm leading-normal text-muted-foreground"
        >
          <strong className="font-semibold text-foreground">{fitTitle}</strong>{" "}
          {fitText}
          {isOver ? (
            <>
              {" "}
              <Link
                href="/contact"
                className="font-semibold text-primary-ink hover:underline"
              >
                Contact us
              </Link>
            </>
          ) : null}
        </p>
      </section>

      <section
        aria-label="Plans"
        className="mt-9 grid w-full gap-6 md:mt-10 md:grid-cols-3 md:gap-4 lg:mt-12 lg:gap-6"
      >
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan.id}
            name={plan.name}
            price={plan.price}
            features={plan.features}
            limit={`Up to ${plan.employees} employees · ${plan.payslipsPerMonth} payslips a month`}
            isLoggedIn={isLoggedIn}
            isCurrent={false}
            isPopular={plan.id === "basic"}
            fits={plan.id === fitPlan?.id}
          />
        ))}
      </section>

      <ul className="mt-7 flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:flex-wrap md:justify-center md:gap-x-8">
        {[
          [Calculator, "Tax, SSC and COLA worked out for you"],
          [CreditCard, "Secure card payments by Stripe"],
          [RotateCcw, "Cancel anytime"],
        ].map(([Icon, text]) => {
          const ItemIcon = Icon as typeof Calculator;
          return (
            <li key={text as string} className="inline-flex items-center gap-2">
              <ItemIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {text as string}
            </li>
          );
        })}
      </ul>

      <section
        aria-labelledby="compare-heading"
        className="mt-12 flex w-full flex-col gap-3.5 md:mt-16 md:gap-5 lg:mt-20"
      >
        <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between md:gap-6">
          <h2
            id="compare-heading"
            className="font-cal text-2xl leading-[1.25] md:text-[28px] lg:text-[32px]"
          >
            Compare plans
          </h2>
          <span className="text-sm text-muted-foreground">
            Prices are per month. One payslip per employee each month.
          </span>
        </div>
        <div className="overflow-hidden rounded-[20px] border bg-card">
          <table className="w-full table-fixed border-collapse text-sm md:text-[15px]">
            <caption className="sr-only">
              Plan comparison: employees, payslips and features
            </caption>
            <colgroup>
              <col className="w-[37%] md:w-[38%]" />
              {plans.map((plan) => (
                <col key={plan.id} />
              ))}
            </colgroup>
            <thead>
              <tr className="bg-muted">
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-[13px] font-semibold text-muted-foreground md:px-6"
                >
                  Plan
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.id}
                    scope="col"
                    className={cn(
                      "px-1 py-3 text-center md:px-4",
                      plan.id === fitPlan?.id && "bg-primary/[0.08]",
                    )}
                  >
                    <span className="block text-sm font-semibold md:text-[15px]">
                      {plan.name}
                    </span>
                    <span className="block text-xs font-normal tabular-nums text-muted-foreground">
                      {plan.price ? money(plan.price) : "€0"}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareRows.map(([label, values]) => (
                <tr key={label} className="border-t">
                  <th
                    scope="row"
                    className="px-3 py-[13px] text-left font-medium leading-[1.35] md:px-6"
                  >
                    {label}
                  </th>
                  {values.map((value, index) => {
                    const isFit = plans[index]?.id === fitPlan?.id;
                    return (
                      <td
                        key={plans[index]?.id ?? index}
                        className={cn(
                          "px-1 py-[13px] text-center tabular-nums md:px-4",
                          isFit && "bg-primary/[0.08] font-semibold",
                          !isFit && "font-medium",
                        )}
                      >
                        {value === true ? (
                          <Check
                            className="mx-auto h-[18px] w-[18px] text-success"
                            aria-label="Included"
                          />
                        ) : value === false ? (
                          <span
                            role="img"
                            aria-label="Not included"
                            className="text-muted-foreground"
                          >
                            —
                          </span>
                        ) : (
                          value
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
