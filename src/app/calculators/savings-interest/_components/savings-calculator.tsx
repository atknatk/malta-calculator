"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { PiggyBank, Euro, Calculator, Info, Percent, Calendar, TrendingUp, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import {
    calculateSavings,
    formatCurrency,
    formatCurrencyDecimal,
    getSavingsInfo,
    SAVINGS_CONSTANTS,
    type SavingsOutput,
} from "@/utils/savings-calculator";

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

export function SavingsCalculator() {
    const [initialDeposit, setInitialDeposit] = useState(10000);
    const [monthlyContribution, setMonthlyContribution] = useState(200);
    const [interestRate, setInterestRate] = useState<number>(SAVINGS_CONSTANTS.DEFAULT_INTEREST_RATE);
    const [years, setYears] = useState(5);
    const [compoundingFrequency, setCompoundingFrequency] = useState<"monthly" | "yearly">("monthly");
    const [showBreakdown, setShowBreakdown] = useState(false);

    const result = useMemo<SavingsOutput>(() => {
        return calculateSavings({
            initialDeposit,
            monthlyContribution,
            interestRate,
            years,
            compoundingFrequency,
        });
    }, [initialDeposit, monthlyContribution, interestRate, years, compoundingFrequency]);

    const info = getSavingsInfo();

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                    <PiggyBank className="h-4 w-4" />
                    Savings
                </div>
                <h1 className="font-cal text-3xl md:text-4xl font-bold">
                    Savings Interest Calculator
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Calculate compound interest on your savings with Malta&apos;s 15% withholding tax.
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
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/5 via-background to-secondary/5 border border-border/50 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-emerald-500/10">
                                <Calculator className="h-5 w-5 text-emerald-600" />
                            </div>
                            <span className="font-semibold">Savings Details</span>
                        </div>

                        {/* Initial Deposit */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                                <Euro className="h-4 w-4 text-emerald-500/70" />
                                Initial Deposit
                            </label>
                            <NumericInput
                                value={initialDeposit}
                                onChange={(v) => setInitialDeposit(v === "" ? 0 : v)}
                                min={0}
                                allowDecimals={false}
                                suffix="€"
                                className="h-14 text-xl px-5 focus:border-emerald-500 focus:ring-emerald-500/20"
                            />
                        </div>

                        {/* Monthly Contribution */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-emerald-500/70" />
                                Monthly Contribution
                            </label>
                            <NumericInput
                                value={monthlyContribution}
                                onChange={(v) => setMonthlyContribution(v === "" ? 0 : v)}
                                min={0}
                                allowDecimals={false}
                                suffix="€/mo"
                                className="h-14 text-xl px-5 focus:border-emerald-500 focus:ring-emerald-500/20"
                            />
                        </div>

                        {/* Interest Rate */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground/70 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Percent className="h-4 w-4 text-emerald-500/70" />
                                    Annual Interest Rate
                                </span>
                                <span className="text-emerald-600 font-semibold">{interestRate.toFixed(2)}%</span>
                            </label>
                            <input
                                type="range"
                                min="0.5"
                                max="8"
                                step="0.1"
                                value={interestRate}
                                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>0.5%</span>
                                <span>8%</span>
                            </div>
                        </div>

                        {/* Years */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground/70 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-emerald-500/70" />
                                    Investment Period
                                </span>
                                <span className="text-emerald-600 font-semibold">{years} years</span>
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="30"
                                value={years}
                                onChange={(e) => setYears(parseInt(e.target.value))}
                                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>1 year</span>
                                <span>30 years</span>
                            </div>
                        </div>

                        {/* Compounding Frequency */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground/70">
                                Compounding Frequency
                            </label>
                            <ToggleGroup
                                options={["monthly", "yearly"] as const}
                                value={compoundingFrequency}
                                onChange={setCompoundingFrequency}
                                labels={{ monthly: "📅 Monthly", yearly: "📆 Yearly" }}
                            />
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
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-secondary/10 border border-emerald-500/20 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-emerald-500/20">
                                <TrendingUp className="h-5 w-5 text-emerald-600" />
                            </div>
                            <span className="font-semibold">Final Balance (After Tax)</span>
                        </div>

                        <div className="text-center py-6">
                            <motion.div
                                key={result.finalBalanceNet}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-5xl md:text-6xl font-bold text-emerald-600"
                            >
                                {formatCurrency(result.finalBalanceNet)}
                            </motion.div>
                            <p className="text-muted-foreground mt-2">
                                after <strong>{years} years</strong>
                            </p>
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                                <span className="text-sm text-muted-foreground">Total Contributions</span>
                                <span className="font-semibold">{formatCurrency(result.totalContributions)}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-500/5">
                                <span className="text-sm text-muted-foreground">Interest Earned (Gross)</span>
                                <span className="font-semibold text-emerald-600">+{formatCurrency(result.totalInterestGross)}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Receipt className="h-4 w-4" />
                                    Withholding Tax (15%)
                                </span>
                                <span className="font-semibold text-red-500">-{formatCurrency(result.withholdingTax)}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <span className="text-sm text-muted-foreground">Net Interest Earned</span>
                                <span className="font-semibold text-emerald-600">{formatCurrency(result.totalInterestNet)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <div className="flex gap-3">
                            <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-muted-foreground">
                                <p className="font-medium text-foreground mb-1">Malta Savings Tax</p>
                                <ul className="list-disc list-inside space-y-1 text-xs">
                                    <li><strong>15%</strong> final withholding tax on interest income</li>
                                    <li>Tax is deducted at source by the bank</li>
                                    <li>No need to declare in annual tax return</li>
                                    <li>Applies to Malta residents</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Toggle Breakdown */}
                    <button
                        onClick={() => setShowBreakdown(!showBreakdown)}
                        className="w-full py-3 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium"
                    >
                        {showBreakdown ? "Hide" : "Show"} Yearly Breakdown
                    </button>
                </motion.div>
            </div>

            {/* Yearly Breakdown */}
            {showBreakdown && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="overflow-x-auto"
                >
                    <div className="p-6 rounded-3xl bg-muted/30 border border-border/50">
                        <h3 className="font-semibold mb-4">Yearly Breakdown</h3>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left p-2 font-medium">Year</th>
                                    <th className="text-right p-2 font-medium">Contributions</th>
                                    <th className="text-right p-2 font-medium">Interest</th>
                                    <th className="text-right p-2 font-medium">Tax</th>
                                    <th className="text-right p-2 font-medium">Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.yearlyBreakdown.slice(0, 10).map((row) => (
                                    <tr key={row.year} className="border-b border-border/50">
                                        <td className="p-2">{row.year}</td>
                                        <td className="text-right p-2">{formatCurrency(row.contributions)}</td>
                                        <td className="text-right p-2 text-emerald-600">+{formatCurrency(row.interestGross)}</td>
                                        <td className="text-right p-2 text-red-500">-{formatCurrency(row.withholdingTax)}</td>
                                        <td className="text-right p-2 font-medium">{formatCurrency(row.balanceEnd)}</td>
                                    </tr>
                                ))}
                                {result.yearlyBreakdown.length > 10 && (
                                    <tr className="text-muted-foreground">
                                        <td colSpan={5} className="p-2 text-center">
                                            ... and {result.yearlyBreakdown.length - 10} more years
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
