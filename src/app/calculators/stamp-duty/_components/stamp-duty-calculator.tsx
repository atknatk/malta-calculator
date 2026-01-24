"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Home, Euro, Calculator, Info, Percent, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import {
    calculateStampDuty,
    formatCurrency,
    getStampDutyInfo,
    type StampDutyOutput,
} from "@/utils/stamp-duty-calculator";

// Premium Toggle Group
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
        <div className="w-full inline-flex items-center rounded-lg border border-input bg-background shadow-sm">
            {options.map((option, index) => (
                <button
                    key={option}
                    type="button"
                    onClick={() => onChange(option)}
                    className={cn(
                        "flex-1 relative font-medium transition-all duration-200 h-12 text-sm px-4",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:z-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                        index === 0 && "rounded-l-lg",
                        index === options.length - 1 && "rounded-r-lg",
                        index !== 0 && "border-l border-input",
                        value === option
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                            : "bg-background text-foreground"
                    )}
                >
                    {labels?.[option] || option}
                </button>
            ))}
        </div>
    );
}

export function StampDutyCalculator() {
    const [propertyPrice, setPropertyPrice] = useState(350000);
    const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState<"yes" | "no">("no");

    const result = useMemo<StampDutyOutput>(() => {
        return calculateStampDuty({
            propertyPrice,
            isFirstTimeBuyer: isFirstTimeBuyer === "yes",
        });
    }, [propertyPrice, isFirstTimeBuyer]);

    const info = getStampDutyInfo();

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
                    Stamp Duty Calculator
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Calculate the stamp duty on your property purchase in Malta.
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
                            <span className="font-semibold">Property Details</span>
                        </div>

                        {/* Property Price Input */}
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
                                className="h-16 text-2xl px-5"
                                suffixClassName="text-lg"
                            />
                        </div>

                        {/* First-Time Buyer Toggle */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground/70">
                                Are you a first-time property buyer?
                            </label>
                            <ToggleGroup
                                options={["no", "yes"] as const}
                                value={isFirstTimeBuyer}
                                onChange={setIsFirstTimeBuyer}
                                labels={{ yes: "🏠 Yes, first property", no: "No" }}
                            />
                            <p className="text-xs text-muted-foreground">
                                First-time buyers get a stamp duty exemption on the first €200,000
                            </p>
                        </div>
                    </div>

                    {/* Quick presets */}
                    <div className="p-4 rounded-xl bg-muted/30 space-y-3">
                        <p className="text-sm font-medium text-foreground/70">Quick Presets</p>
                        <div className="flex flex-wrap gap-2">
                            {[150000, 250000, 350000, 500000, 750000].map((price) => (
                                <button
                                    key={price}
                                    onClick={() => setPropertyPrice(price)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                        propertyPrice === price
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-background border border-border hover:bg-muted"
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
                            <span className="font-semibold">Stamp Duty Payable</span>
                        </div>

                        <div className="text-center py-6">
                            <motion.div
                                key={result.stampDuty}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-5xl md:text-6xl font-bold text-primary"
                            >
                                {formatCurrency(result.stampDuty)}
                            </motion.div>
                            <p className="text-muted-foreground mt-2">
                                Effective rate: <strong>{result.effectiveRate.toFixed(2)}%</strong>
                            </p>
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                                <span className="text-sm text-muted-foreground">Property Value</span>
                                <span className="font-semibold">{formatCurrency(propertyPrice)}</span>
                            </div>
                            {isFirstTimeBuyer === "yes" && (
                                <div className="flex justify-between items-center p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                                    <span className="text-sm text-muted-foreground">Exemption Applied</span>
                                    <span className="font-semibold text-green-600">-{formatCurrency(result.exemptedAmount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                                <span className="text-sm text-muted-foreground">Taxable Amount</span>
                                <span className="font-semibold">{formatCurrency(result.taxableAmount)}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                                <span className="text-sm text-muted-foreground">Rate Applied</span>
                                <span className="font-semibold">{info.standardRate}%</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm">
                            <p className="text-sm text-muted-foreground">{result.description}</p>
                        </div>
                    </div>

                    {/* Savings Card */}
                    {isFirstTimeBuyer === "yes" && result.savings > 0 && (
                        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                            <div className="flex gap-3">
                                <Gift className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium text-foreground mb-1">
                                        You&apos;re saving {formatCurrency(result.savings)}!
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        As a first-time buyer, you save up to €10,000 on stamp duty.
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
                                <p className="font-medium text-foreground mb-1">Important Notes</p>
                                <ul className="list-disc list-inside space-y-1 text-xs">
                                    <li>Standard stamp duty rate is 5% of property value</li>
                                    <li>First-time buyers: €200,000 exemption (save up to €10,000)</li>
                                    <li>Property must be your sole ordinary residence</li>
                                    <li>Additional fees may apply (notary, legal, etc.)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
