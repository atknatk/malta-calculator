"use client";

import { useState, useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Euro,
  Calculator,
  Info,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  calculateTcnBudget2027,
  formatCurrency,
  type PermitAction,
  type ResidenceStatus,
  type TcnBudget2027Result,
} from "@/utils/tcn-budget-2027-calculator";

function OptionGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground/70">{label}</label>
      <div
        className={cn(
          "grid gap-2",
          options.length === 3 ? "grid-cols-3" : "grid-cols-2",
        )}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "min-h-12 px-2 rounded-xl border text-sm font-medium transition-all",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
              value === option.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border hover:bg-muted",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function YesNo({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <OptionGroup
      label={label}
      value={value ? "yes" : "no"}
      options={[
        { value: "no", label: "No" },
        { value: "yes", label: "Yes" },
      ]}
      onChange={(v) => onChange(v === "yes")}
    />
  );
}

function NumberField({
  label,
  value,
  onChange,
  max,
  suffix,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max: number;
  suffix?: string;
  hint?: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <NumericInput
        value={value}
        onChange={(v) => onChange(v === "" ? 0 : v)}
        min={0}
        max={max}
        allowDecimals={false}
        suffix={suffix}
        className="h-12 text-base px-4"
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function TcnBudget2027Calculator() {
  const [status, setStatus] = useState<ResidenceStatus>("tcn");
  const [permitAction, setPermitAction] = useState<PermitAction>("renewal");
  const [permitHolders, setPermitHolders] = useState(1);
  const [usesTransport, setUsesTransport] = useState(true);
  const [transportCost, setTransportCost] = useState(33);
  const [drives, setDrives] = useState(false);
  const [drivingExempt, setDrivingExempt] = useState(false);
  const [drivingMonths, setDrivingMonths] = useState(12);
  const [atypical, setAtypical] = useState(false);
  const [children, setChildren] = useState(0);
  const [childcareCost, setChildcareCost] = useState(400);
  const [childcareMonths, setChildcareMonths] = useState(12);

  const result = useMemo<TcnBudget2027Result>(
    () =>
      calculateTcnBudget2027({
        status,
        permitAction,
        permitHolders,
        usesPublicTransport: usesTransport,
        monthlyTransportCost: transportCost,
        drives,
        drivingExempt,
        drivingMonths,
        receivedAtypicalCheque: atypical,
        newChildcareChildren: children,
        monthlyChildcareCost: childcareCost,
        childcareMonths,
      }),
    [
      status,
      permitAction,
      permitHolders,
      usesTransport,
      transportCost,
      drives,
      drivingExempt,
      drivingMonths,
      atypical,
      children,
      childcareCost,
      childcareMonths,
    ],
  );

  const isTcn = status === "tcn";

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 sm:space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Globe className="h-4 w-4" />
          Immigration · Budget 2027
        </div>
        <h1 className="font-cal text-3xl md:text-4xl font-bold">
          TCN Budget 2027 Cost Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto px-2">
          Estimate what you will pay in 2027, and how much more than 2026, as a
          non-EU worker in Malta: new permit fees, the €400 infrastructure
          contribution, the €83/month driving licence fee and the loss of free
          transport and childcare.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border/50 space-y-5 sm:space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">Your Situation in 2027</span>
            </div>

            <OptionGroup
              label="Residence status"
              value={status}
              onChange={setStatus}
              options={[
                { value: "tcn", label: "Non-EU (TCN)" },
                { value: "longTermResident", label: "Long-term resident" },
                { value: "euCitizen", label: "EU / EEA citizen" },
              ]}
            />

            {isTcn && (
              <>
                <OptionGroup
                  label="Work permit in 2027"
                  value={permitAction}
                  onChange={setPermitAction}
                  options={[
                    { value: "new", label: "New application" },
                    { value: "renewal", label: "Renewal" },
                    { value: "none", label: "None due" },
                  ]}
                />
                {permitAction !== "none" && (
                  <NumberField
                    label="Adults (18+) in your household with this permit"
                    value={permitHolders}
                    onChange={setPermitHolders}
                    max={10}
                  />
                )}

                <YesNo
                  label="Do you use public transport?"
                  value={usesTransport}
                  onChange={setUsesTransport}
                />
                {usesTransport && (
                  <NumberField
                    label="Expected monthly bus/ferry spend"
                    value={transportCost}
                    onChange={setTransportCost}
                    max={500}
                    suffix="€"
                    hint="Around €33/month has been reported for regular commuters."
                  />
                )}

                <YesNo
                  label="Do you drive on a Category B/B1 licence?"
                  value={drives}
                  onChange={setDrives}
                />
                {drives && (
                  <>
                    <YesNo
                      label="Exempt? (driving job, or UK / Australian / UAE citizen)"
                      value={drivingExempt}
                      onChange={setDrivingExempt}
                    />
                    {!drivingExempt && (
                      <NumberField
                        label="Months you will hold the licence in 2027"
                        value={drivingMonths}
                        onChange={setDrivingMonths}
                        max={12}
                      />
                    )}
                  </>
                )}

                <YesNo
                  label="Did you receive the atypical working hours cheque?"
                  value={atypical}
                  onChange={setAtypical}
                />

                <NumberField
                  label="Children you will newly register in childcare in 2027"
                  value={children}
                  onChange={setChildren}
                  max={6}
                  hint="Children already enrolled keep free childcare."
                />
                {children > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    <NumberField
                      label="Monthly fee per child"
                      value={childcareCost}
                      onChange={setChildcareCost}
                      max={3000}
                      suffix="€"
                    />
                    <NumberField
                      label="Months in 2027"
                      value={childcareMonths}
                      onChange={setChildcareMonths}
                      max={12}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>

        {/* Result Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 sm:space-y-6"
        >
          <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/20">
                {result.affected ? (
                  <Euro className="h-5 w-5 text-primary" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </div>
              <span className="font-semibold">
                {result.affected ? "Your 2027 Costs" : "Not Affected"}
              </span>
            </div>

            {result.affected ? (
              <>
                <div className="text-center py-4 sm:py-6">
                  <motion.div
                    key={result.totalYearly}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary"
                  >
                    {formatCurrency(result.totalYearly)}
                  </motion.div>
                  <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                    in 2027 (≈ {formatCurrency(result.totalMonthly)}/month)
                  </p>
                  {result.totalExtraYearly > 0 && (
                    <p className="mt-2 text-sm font-medium text-amber-600">
                      {formatCurrency(result.totalExtraYearly)} more than in
                      2026
                    </p>
                  )}
                </div>

                {result.items.length > 0 ? (
                  <div className="space-y-2">
                    {result.items.map((item) => (
                      <div
                        key={item.key}
                        className="p-3 rounded-xl bg-background/50"
                      >
                        <div className="flex justify-between items-center gap-3">
                          <span className="text-sm text-muted-foreground">
                            {item.label}
                          </span>
                          <span className="font-semibold whitespace-nowrap">
                            {formatCurrency(item.cost)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground/80 mt-1">
                          {item.note}
                          {item.extraCost > 0 &&
                            item.extraCost !== item.cost &&
                            ` · +${formatCurrency(item.extraCost)} vs 2026`}
                          {item.paidBy === "employer" &&
                            " · usually paid by the employer"}
                        </p>
                      </div>
                    ))}
                    {result.employerShare > 0 && (
                      <div className="flex justify-between items-center p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                        <span className="text-sm text-muted-foreground">
                          Your share (excluding employer-paid fees)
                        </span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(result.householdShare)}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center">
                    None of the new charges apply to the options you selected.
                  </p>
                )}
              </>
            ) : (
              <div className="py-6 text-center space-y-3">
                <p className="text-lg font-semibold">€0 extra in 2027</p>
                <p className="text-sm text-muted-foreground px-2">
                  {result.reason}
                </p>
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Based on the Budget 2027 speech of 26 October 2026. The legal
                notices that implement these measures had not been published
                yet, so amounts, exemptions and how the €83 licence fee is
                collected may still change.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  Important Notes
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>
                    Measures apply from 1 January 2027 to third-country
                    nationals without long-term residence
                  </li>
                  <li>
                    The single permit renewal fee stays at €150; the €400
                    contribution comes on top, every year
                  </li>
                  <li>
                    Foreign licences can be used for 12 months from arrival; the
                    period no longer restarts when you leave and return
                  </li>
                  <li>
                    Under-18s are exempt from the infrastructure contribution
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
