"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Home, Euro, Calculator, Info, Gift, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  calculateFirstTimeBuyer,
  formatCurrency,
  getFTBRules,
  type FirstTimeBuyerOutput,
} from "@/utils/first-time-buyer-calculator";

// Mobile-first toggle: dar ekranda eşit bölünür, dokunma hedefi ≥44px
function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
  labels,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  labels?: Partial<Record<T, string>>;
}) {
  return (
    <div className="w-full grid auto-cols-fr grid-flow-col rounded-lg border border-input bg-background shadow-sm">
      {options.map((option, index) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "relative font-medium transition-all duration-200 min-h-12 text-sm px-2",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:z-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
            index === 0 && "rounded-l-lg",
            index === options.length - 1 && "rounded-r-lg",
            index !== 0 && "border-l border-input",
            value === option
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : "bg-background text-foreground",
          )}
        >
          {labels?.[option] || option}
        </button>
      ))}
    </div>
  );
}

export function FirstTimeBuyerCalculator() {
  const [propertyPrice, setPropertyPrice] = useState(300000);
  const [isUCAOrVacant, setIsUCAOrVacant] = useState<"no" | "yes">("no");
  const [isGozo, setIsGozo] = useState<"no" | "yes">("no");
  const [withBankLoan, setWithBankLoan] = useState<"yes" | "no">("yes");

  const rules = getFTBRules();

  const result = useMemo<FirstTimeBuyerOutput>(() => {
    return calculateFirstTimeBuyer({
      propertyPrice,
      isUCAOrVacant: isUCAOrVacant === "yes",
      isGozo: isGozo === "yes",
      withBankLoan: withBankLoan === "yes",
    });
  }, [propertyPrice, isUCAOrVacant, isGozo, withBankLoan]);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 sm:space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Home className="h-4 w-4" />
          Property & Housing
        </div>
        <h1 className="font-cal text-3xl md:text-4xl font-bold">
          First-Time Buyer Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto px-2">
          Add up every government benefit for first-time buyers in Malta — stamp
          duty exemption, the €10,000 grant and UCA incentives.
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
              <span className="font-semibold">Purchase Details</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Euro className="h-4 w-4 text-primary/70" />
                Property Purchase Price
              </label>
              <NumericInput
                value={propertyPrice}
                onChange={(v) => setPropertyPrice(v === "" ? 0 : v)}
                min={0}
                allowDecimals={false}
                suffix="€"
                className="h-14 sm:h-16 text-xl sm:text-2xl px-4 sm:px-5"
                suffixClassName="text-lg"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Buying with a bank loan?
              </label>
              <ToggleGroup
                options={["yes", "no"] as const}
                value={withBankLoan}
                onChange={setWithBankLoan}
                labels={{ yes: "Yes — bank loan", no: "No — cash" }}
              />
              <p className="text-xs text-muted-foreground">
                The €10,000 grant (10 × €1,000/year) requires a bank loan.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                UCA, vacant 20+ years, or traditional Maltese property?
              </label>
              <ToggleGroup
                options={["no", "yes"] as const}
                value={isUCAOrVacant}
                onChange={setIsUCAOrVacant}
                labels={{ no: "No", yes: "Yes — qualifying" }}
              />
              <p className="text-xs text-muted-foreground">
                Qualifying properties get a duty exemption on the first €750,000
                plus a cash grant.
              </p>
            </div>

            {isUCAOrVacant === "yes" && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground/70">
                  Is the property in Gozo?
                </label>
                <ToggleGroup
                  options={["no", "yes"] as const}
                  value={isGozo}
                  onChange={setIsGozo}
                  labels={{ no: "Malta", yes: "Gozo (€30k grant)" }}
                />
              </div>
            )}

            {/* Quick presets */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground/70">
                Quick Presets
              </p>
              <div className="flex flex-wrap gap-2">
                {[200000, 250000, 300000, 400000, 500000].map((price) => (
                  <button
                    key={price}
                    onClick={() => setPropertyPrice(price)}
                    className={cn(
                      "px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                      propertyPrice === price
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border border-border hover:bg-muted",
                    )}
                  >
                    {formatCurrency(price)}
                  </button>
                ))}
              </div>
            </div>
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
                <Gift className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">Total Government Benefits</span>
            </div>

            <div className="text-center py-4 sm:py-6">
              <motion.div
                key={result.totalBenefits}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary break-words"
              >
                {formatCurrency(result.totalBenefits)}
              </motion.div>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                combined value of your first-time buyer package
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <span className="text-sm text-muted-foreground">
                  Stamp Duty Saved (exemption on first{" "}
                  {formatCurrency(result.exemptAmount)})
                </span>
                <span className="font-semibold text-green-600">
                  +{formatCurrency(result.stampDutySaved)}
                </span>
              </div>
              {result.ftbGrant > 0 && (
                <div className="flex justify-between items-center p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <span className="text-sm text-muted-foreground">
                    FTB Grant (€1,000 × 10 years)
                  </span>
                  <span className="font-semibold text-green-600">
                    +{formatCurrency(result.ftbGrant)}
                  </span>
                </div>
              )}
              {result.ucaGrant > 0 && (
                <div className="flex justify-between items-center p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <span className="text-sm text-muted-foreground">
                    UCA / Vacant Property Cash Grant
                  </span>
                  <span className="font-semibold text-green-600">
                    +{formatCurrency(result.ucaGrant)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Stamp Duty Still Due
                </span>
                <span className="font-semibold">
                  {formatCurrency(result.stampDutyDue)}
                </span>
              </div>
            </div>
          </div>

          {/* Deposit scheme */}
          {result.depositSchemeEligible && (
            <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20">
              <div className="flex gap-3">
                <Landmark className="h-5 w-5 text-sky-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">
                    Deposit Assistance Scheme
                  </p>
                  <p className="text-muted-foreground text-xs">
                    This property is within the{" "}
                    {formatCurrency(rules.DEPOSIT_SCHEME_CAP)} cap — under-40s
                    can have the 10% deposit financed through the
                    government-backed scheme (housingauthority.gov.mt).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  Important Notes
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>
                    The €200,000 stamp duty exemption was made{" "}
                    <strong>permanent</strong> in Budget 2026
                  </li>
                  <li>
                    The €10,000 grant covers first primary residences bought
                    with a bank loan (2024–2026 purchases)
                  </li>
                  <li>
                    UCA/vacant properties also qualify for a VAT refund of up to
                    €54,000 on restoration works
                  </li>
                  <li>
                    You must not have owned property in Malta or Gozo before
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
