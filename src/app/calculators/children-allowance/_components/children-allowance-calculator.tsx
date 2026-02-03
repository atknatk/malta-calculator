"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Baby, Euro, Calculator, Info, Wallet, Gift, Calendar, TrendingDown, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import {
    calculateChildrensAllowance,
    calculateBirthBonus,
    formatCurrency,
    getRateTypeDescription,
    CA_CONSTANTS,
    type ChildrensAllowanceResult,
} from "@/utils/childrens-allowance-calculator";

export function ChildrenAllowanceCalculator() {
    // Income inputs
    const [grossIncome, setGrossIncome] = useState<number | "">(25000);
    const [sscPaid, setSscPaid] = useState<number | "">(2500);
    const [rentIncome, setRentIncome] = useState<number | "">(0);
    const [interestIncome, setInterestIncome] = useState<number | "">(0);
    const [pensionIncome, setPensionIncome] = useState<number | "">(0);
    const [maintenanceIncome, setMaintenanceIncome] = useState<number | "">(0);
    const [otherIncome, setOtherIncome] = useState<number | "">(0);
    const [taxPaid, setTaxPaid] = useState<number | "">(2000);

    // Family details
    const [numberOfChildren, setNumberOfChildren] = useState<number | "">(2);

    // Birth bonus calculator
    const [childOrder, setChildOrder] = useState<number | "">(1);

    // Show/hide advanced income fields
    const [showAdvancedIncome, setShowAdvancedIncome] = useState(false);

    const result = useMemo<ChildrensAllowanceResult>(() => {
        return calculateChildrensAllowance({
            grossIncome: grossIncome === "" ? 0 : grossIncome,
            sscPaid: sscPaid === "" ? 0 : sscPaid,
            rentIncome: rentIncome === "" ? 0 : rentIncome,
            interestIncome: interestIncome === "" ? 0 : interestIncome,
            pensionIncome: pensionIncome === "" ? 0 : pensionIncome,
            maintenanceIncome: maintenanceIncome === "" ? 0 : maintenanceIncome,
            otherIncome: otherIncome === "" ? 0 : otherIncome,
            taxPaid: taxPaid === "" ? 0 : taxPaid,
            numberOfChildren: numberOfChildren === "" ? 1 : Math.max(1, numberOfChildren),
        });
    }, [grossIncome, sscPaid, rentIncome, interestIncome, pensionIncome, maintenanceIncome, otherIncome, taxPaid, numberOfChildren]);

    const birthBonus = useMemo(() => {
        return calculateBirthBonus(childOrder === "" ? 1 : childOrder);
    }, [childOrder]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-sm font-medium">
                    <Baby className="h-4 w-4" />
                    Family Benefits
                </div>
                <h1 className="font-cal text-3xl md:text-4xl font-bold">
                    Children&apos;s Allowance Calculator
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Calculate your potential Children&apos;s Allowance based on household income for children under 16.
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
                    {/* Main Income Card */}
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-pink-500/5 via-background to-rose-500/5 border border-border/50 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-pink-500/10">
                                <Wallet className="h-5 w-5 text-pink-500" />
                            </div>
                            <span className="font-semibold">Income Details (Year 2024)</span>
                        </div>

                        {/* Gross Income */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                                <Euro className="h-4 w-4 text-pink-500/70" />
                                Gross Income from Employment / Benefits
                            </label>
                            <NumericInput
                                value={grossIncome}
                                onChange={setGrossIncome}
                                min={0}
                                max={999999}
                                allowDecimals={false}
                                suffix="€"
                                className="h-14 text-xl px-5"
                                suffixClassName="text-base"
                            />
                        </div>

                        {/* SSC Paid */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                                <TrendingDown className="h-4 w-4 text-pink-500/70" />
                                Social Security Contributions Paid
                            </label>
                            <NumericInput
                                value={sscPaid}
                                onChange={setSscPaid}
                                min={0}
                                max={99999}
                                allowDecimals={false}
                                suffix="€"
                                className="h-12 text-lg px-4"
                                suffixClassName="text-sm"
                            />
                        </div>

                        {/* Tax Paid */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                                <TrendingDown className="h-4 w-4 text-pink-500/70" />
                                Income Tax Paid
                            </label>
                            <NumericInput
                                value={taxPaid}
                                onChange={setTaxPaid}
                                min={0}
                                max={99999}
                                allowDecimals={false}
                                suffix="€"
                                className="h-12 text-lg px-4"
                                suffixClassName="text-sm"
                            />
                            <p className="text-xs text-muted-foreground">
                                From 2025, both SSC and Tax are deducted from total income
                            </p>
                        </div>

                        {/* Toggle Advanced Income */}
                        <button
                            onClick={() => setShowAdvancedIncome(!showAdvancedIncome)}
                            className="w-full py-2 text-sm text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors flex items-center justify-center gap-2"
                        >
                            {showAdvancedIncome ? "Hide" : "Show"} Additional Income Sources
                            <span className={cn("transition-transform", showAdvancedIncome && "rotate-180")}>▼</span>
                        </button>

                        {/* Advanced Income Fields */}
                        {showAdvancedIncome && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="space-y-4 pt-4 border-t border-border/50"
                            >
                                {/* Rental Income */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground/70">
                                        Property Rental / Ground Rents Income
                                    </label>
                                    <NumericInput
                                        value={rentIncome}
                                        onChange={setRentIncome}
                                        min={0}
                                        max={99999}
                                        allowDecimals={false}
                                        suffix="€"
                                        className="h-10 text-base px-4"
                                        suffixClassName="text-sm"
                                    />
                                </div>

                                {/* Bank Interest */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground/70">
                                        Bank Deposit Interest
                                    </label>
                                    <NumericInput
                                        value={interestIncome}
                                        onChange={setInterestIncome}
                                        min={0}
                                        max={99999}
                                        allowDecimals={false}
                                        suffix="€"
                                        className="h-10 text-base px-4"
                                        suffixClassName="text-sm"
                                    />
                                </div>

                                {/* Pension Income */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground/70">
                                        Treasury/Service/Foreign Pensions
                                    </label>
                                    <NumericInput
                                        value={pensionIncome}
                                        onChange={setPensionIncome}
                                        min={0}
                                        max={99999}
                                        allowDecimals={false}
                                        suffix="€"
                                        className="h-10 text-base px-4"
                                        suffixClassName="text-sm"
                                    />
                                </div>

                                {/* Maintenance Income */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground/70">
                                        Spouse/Partner Maintenance
                                    </label>
                                    <NumericInput
                                        value={maintenanceIncome}
                                        onChange={setMaintenanceIncome}
                                        min={0}
                                        max={99999}
                                        allowDecimals={false}
                                        suffix="€"
                                        className="h-10 text-base px-4"
                                        suffixClassName="text-sm"
                                    />
                                </div>

                                {/* Other Income */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground/70">
                                        Any Other Income
                                    </label>
                                    <NumericInput
                                        value={otherIncome}
                                        onChange={setOtherIncome}
                                        min={0}
                                        max={99999}
                                        allowDecimals={false}
                                        suffix="€"
                                        className="h-10 text-base px-4"
                                        suffixClassName="text-sm"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Number of Children */}
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-pink-500/5 via-background to-rose-500/5 border border-border/50 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-pink-500/10">
                                <Users className="h-5 w-5 text-pink-500" />
                            </div>
                            <span className="font-semibold">Number of Children</span>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/70">
                                Children under 16 years of age
                            </label>
                            <NumericInput
                                value={numberOfChildren}
                                onChange={setNumberOfChildren}
                                min={1}
                                max={20}
                                allowDecimals={false}
                                className="h-14 text-xl px-5 text-center"
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
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-rose-500/10 border border-pink-500/20 space-y-6">
                        {/* Weekly Rate */}
                        <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-2">
                                Weekly Allowance
                            </div>
                            <div className="text-4xl md:text-5xl font-bold text-pink-600 dark:text-pink-400">
                                {formatCurrency(result.weeklyForAll)}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                                {formatCurrency(result.weeklyPerChild)} per child × {numberOfChildren === "" ? 1 : numberOfChildren} {(numberOfChildren === "" ? 1 : numberOfChildren) === 1 ? "child" : "children"}
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-3 pt-4 border-t border-pink-500/20">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Yearly per Child</span>
                                <span className="font-semibold">{formatCurrency(result.yearlyPerChild)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Yearly Total</span>
                                <span className="font-bold text-lg text-pink-600 dark:text-pink-400">{formatCurrency(result.yearlyForAll)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Quarterly Payment</span>
                                <span className="font-semibold">{formatCurrency(result.quarterlyPayment)}</span>
                            </div>
                        </div>

                        {/* Income Summary */}
                        <div className="space-y-3 pt-4 border-t border-pink-500/20">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Total Income</span>
                                <span>{formatCurrency(result.totalIncome)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Net Income (after SSC & Tax)</span>
                                <span className="font-medium">{formatCurrency(result.netIncome)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Rate Type</span>
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-medium",
                                    result.rateType === "maximum" && "bg-green-500/10 text-green-600 dark:text-green-400",
                                    result.rateType === "variable" && "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                                    result.rateType === "minimum" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                                    result.rateType === "fixed" && "bg-gray-500/10 text-gray-600 dark:text-gray-400",
                                )}>
                                    {result.rateType.charAt(0).toUpperCase() + result.rateType.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Birth Bonus Card */}
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/5 via-background to-orange-500/5 border border-border/50 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-amber-500/10">
                                <Gift className="h-5 w-5 text-amber-500" />
                            </div>
                            <span className="font-semibold">Child Birth / Adoption Bonus</span>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/70">
                                Which child in the family?
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => setChildOrder(num)}
                                        className={cn(
                                            "flex-1 py-3 rounded-xl font-medium transition-all",
                                            childOrder === num
                                                ? "bg-amber-500 text-white"
                                                : "bg-muted hover:bg-muted/80"
                                        )}
                                    >
                                        {num === 3 ? "3rd+" : num === 2 ? "2nd" : "1st"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-amber-500/10 text-center">
                            <div className="text-sm text-muted-foreground mb-1">One-time Bonus</div>
                            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                {formatCurrency(birthBonus.bonusAmount)}
                            </div>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                        <div className="flex gap-3">
                            <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-muted-foreground space-y-2">
                                <p>
                                    <strong className="text-foreground">How it&apos;s calculated:</strong>{" "}
                                    The weekly rate is based on the difference between €{CA_CONSTANTS.MAX_INCOME_THRESHOLD.toLocaleString()} and your net income.
                                    A {CA_CONSTANTS.PERCENTAGE}% rate is applied, divided by 52 weeks.
                                </p>
                                <p>
                                    <strong className="text-foreground">Rate limits:</strong>{" "}
                                    Minimum €{CA_CONSTANTS.MIN_WEEKLY_RATE}/week, Maximum €{CA_CONSTANTS.MAX_WEEKLY_RATE}/week per child.
                                </p>
                                <p>
                                    <strong className="text-foreground">Payment:</strong>{" "}
                                    Paid every 13 weeks (quarterly) in advance.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                        <div className="flex gap-3">
                            <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground">
                                <strong className="text-foreground">Disclaimer:</strong>{" "}
                                This is an estimate only. The actual benefit is calculated by the Department of Social Security
                                following a formal application. Income from 2 years prior is used (e.g., 2024 income for 2026 allowance).
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
