"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Home, Euro, Calculator, Info, Percent, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  calculatePropertyTransferTax,
  formatCurrency,
  getScenarioOptions,
  type PropertyTransferScenario,
  type PropertyTransferTaxOutput,
} from "@/utils/property-transfer-tax-calculator";

export function PropertyTransferTaxCalculator() {
  const [transferValue, setTransferValue] = useState(300000);
  const [scenario, setScenario] =
    useState<PropertyTransferScenario>("standard");
  const [acquisitionValue, setAcquisitionValue] = useState(150000);
  const [brokerageFee, setBrokerageFee] = useState(0);

  const result = useMemo<PropertyTransferTaxOutput>(() => {
    return calculatePropertyTransferTax({
      transferValue,
      scenario,
      acquisitionValue,
      brokerageFee,
    });
  }, [transferValue, scenario, acquisitionValue, brokerageFee]);

  const scenarioOptions = getScenarioOptions();

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Home className="h-4 w-4" />
          Property Tax
        </div>
        <h1 className="font-cal text-3xl md:text-4xl font-bold">
          Property Transfer Tax Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Calculate the final withholding tax you pay as a seller when
          transferring property in Malta.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border/50 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">Sale Details</span>
            </div>

            {/* Transfer Value Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Euro className="h-4 w-4 text-primary/70" />
                Selling Price (Transfer Value)
              </label>
              <NumericInput
                value={transferValue}
                onChange={(v) => setTransferValue(v === "" ? 0 : v)}
                min={0}
                allowDecimals={false}
                suffix="€"
                className="h-16 text-2xl px-5"
                suffixClassName="text-lg"
              />
            </div>

            {/* Scenario Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Which situation applies to your sale?
              </label>
              <div className="space-y-2">
                {scenarioOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setScenario(option.value)}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 p-3 rounded-xl border text-left transition-all",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                      scenario === option.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:bg-muted",
                    )}
                  >
                    <span>
                      <span className="block text-sm font-medium">
                        {option.label}
                      </span>
                      <span
                        className={cn(
                          "block text-xs",
                          scenario === option.value
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground",
                        )}
                      >
                        {option.detail}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold",
                        scenario === option.value
                          ? "bg-primary-foreground/20"
                          : "bg-primary/10 text-primary",
                      )}
                    >
                      {option.rateLabel}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Acquisition Value (inherited post-1992 only) */}
            {scenario === "inheritedPost1992" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                  <Euro className="h-4 w-4 text-primary/70" />
                  Declared Value at Inheritance (Causa Mortis)
                </label>
                <NumericInput
                  value={acquisitionValue}
                  onChange={(v) => setAcquisitionValue(v === "" ? 0 : v)}
                  min={0}
                  allowDecimals={false}
                  suffix="€"
                  className="h-12 text-lg px-4"
                />
                <p className="text-xs text-muted-foreground">
                  The 12% rate applies only to the gain above this declared
                  value.
                </p>
              </div>
            )}

            {/* Brokerage Fee */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Euro className="h-4 w-4 text-primary/70" />
                Estate Agency Fee (optional)
              </label>
              <NumericInput
                value={brokerageFee}
                onChange={(v) => setBrokerageFee(v === "" ? 0 : v)}
                min={0}
                allowDecimals={false}
                suffix="€"
                className="h-12 text-lg px-4"
              />
              <p className="text-xs text-muted-foreground">
                Licensed agency fees are deducted from the taxable value.
              </p>
            </div>
          </div>

          {/* Quick presets */}
          <div className="p-4 rounded-xl bg-muted/30 space-y-3">
            <p className="text-sm font-medium text-foreground/70">
              Quick Presets
            </p>
            <div className="flex flex-wrap gap-2">
              {[200000, 300000, 400000, 500000, 750000].map((price) => (
                <button
                  key={price}
                  onClick={() => setTransferValue(price)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    transferValue === price
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border border-border hover:bg-muted",
                  )}
                >
                  {formatCurrency(price)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Result Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Main Result Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/20">
                <Percent className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">Property Transfer Tax Due</span>
            </div>

            <div className="text-center py-6">
              <motion.div
                key={result.tax}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl md:text-6xl font-bold text-primary"
              >
                {result.isExempt ? "€0" : formatCurrency(result.tax)}
              </motion.div>
              <p className="text-muted-foreground mt-2">
                {result.isExempt ? (
                  <strong className="text-green-600">Fully exempt</strong>
                ) : (
                  <>
                    Effective rate:{" "}
                    <strong>{result.effectiveRate.toFixed(2)}%</strong>
                  </>
                )}
              </p>
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Selling Price
                </span>
                <span className="font-semibold">
                  {formatCurrency(transferValue)}
                </span>
              </div>
              {brokerageFee > 0 && (
                <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                  <span className="text-sm text-muted-foreground">
                    Agency Fee Deducted
                  </span>
                  <span className="font-semibold">
                    -{formatCurrency(brokerageFee)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Taxable Base
                </span>
                <span className="font-semibold">
                  {formatCurrency(result.taxableBase)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Rate Applied
                </span>
                <span className="font-semibold">{result.rateApplied}%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-primary/10 border border-primary/20">
                <span className="text-sm font-medium">
                  Net Proceeds After Tax
                </span>
                <span className="font-bold text-primary">
                  {formatCurrency(result.netProceeds)}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm">
              <p className="text-sm text-muted-foreground">
                {result.description}
              </p>
            </div>
          </div>

          {/* Savings Card */}
          {result.savingsVsStandard > 0 && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex gap-3">
                <Gift className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">
                    You&apos;re saving{" "}
                    {formatCurrency(result.savingsVsStandard)} vs the standard
                    8% rate!
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Your situation qualifies for a reduced rate or exemption
                    under Article 5A of the Income Tax Act.
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
                    This is a <strong>final</strong> withholding tax — it is
                    charged on the transfer value, not on profit
                  </li>
                  <li>The notary deducts the tax on the deed of sale</li>
                  <li>The seller pays this tax; the buyer pays stamp duty</li>
                  <li>
                    Rates per the Income Tax Act, Art. 5A — confirm your case
                    with a notary
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
