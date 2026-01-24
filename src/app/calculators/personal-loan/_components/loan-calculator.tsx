"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Banknote, Euro, Calculator, Info, Percent, Calendar, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    calculateLoan,
    formatCurrency,
    formatCurrencyDecimal,
    formatLoanTerm,
    getLoanInfo,
    LOAN_CONSTRAINTS,
    type LoanOutput,
} from "@/utils/loan-calculator";

export function LoanCalculator() {
    const [loanAmount, setLoanAmount] = useState(15000);
    const [interestRate, setInterestRate] = useState<number>(LOAN_CONSTRAINTS.DEFAULT_INTEREST_RATE);
    const [loanTermMonths, setLoanTermMonths] = useState(36);
    const [showSchedule, setShowSchedule] = useState(false);

    const result = useMemo<LoanOutput>(() => {
        return calculateLoan({
            loanAmount,
            interestRate,
            loanTermMonths,
        });
    }, [loanAmount, interestRate, loanTermMonths]);

    const info = getLoanInfo();

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-medium">
                    <Banknote className="h-4 w-4" />
                    Personal Loan
                </div>
                <h1 className="font-cal text-3xl md:text-4xl font-bold">
                    Personal Loan Calculator
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Calculate your monthly loan payments and total repayment cost.
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
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-500/5 via-background to-secondary/5 border border-border/50 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-violet-500/10">
                                <Calculator className="h-5 w-5 text-violet-600" />
                            </div>
                            <span className="font-semibold">Loan Details</span>
                        </div>

                        {/* Loan Amount */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                                <Euro className="h-4 w-4 text-violet-500/70" />
                                Loan Amount
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="1000"
                                    min={info.minAmount}
                                    max={info.maxAmount}
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(Math.max(info.minAmount, Math.min(info.maxAmount, parseInt(e.target.value) || 0)))}
                                    className="w-full h-14 text-xl px-5 pr-12 rounded-xl bg-background border border-border focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 focus:outline-none font-semibold transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 font-medium text-muted-foreground/70">€</div>
                            </div>
                            <input
                                type="range"
                                min={info.minAmount}
                                max={info.maxAmount}
                                step="1000"
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-500"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{formatCurrency(info.minAmount)}</span>
                                <span>{formatCurrency(info.maxAmount)}</span>
                            </div>
                        </div>

                        {/* Interest Rate */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground/70 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Percent className="h-4 w-4 text-violet-500/70" />
                                    Interest Rate
                                </span>
                                <span className="text-violet-600 font-semibold">{interestRate.toFixed(2)}%</span>
                            </label>
                            <input
                                type="range"
                                min="3"
                                max="15"
                                step="0.1"
                                value={interestRate}
                                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-500"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>3%</span>
                                <span>15%</span>
                            </div>
                        </div>

                        {/* Loan Term */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground/70 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-violet-500/70" />
                                    Loan Term
                                </span>
                                <span className="text-violet-600 font-semibold">{formatLoanTerm(loanTermMonths)}</span>
                            </label>
                            <input
                                type="range"
                                min={info.minTermMonths}
                                max={info.maxTermMonths}
                                step="6"
                                value={loanTermMonths}
                                onChange={(e) => setLoanTermMonths(parseInt(e.target.value))}
                                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-500"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{formatLoanTerm(info.minTermMonths)}</span>
                                <span>{formatLoanTerm(info.maxTermMonths)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick presets */}
                    <div className="p-4 rounded-xl bg-muted/30 space-y-3">
                        <p className="text-sm font-medium text-foreground/70">Loan Amount Presets</p>
                        <div className="flex flex-wrap gap-2">
                            {[5000, 10000, 20000, 30000, 50000].map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => setLoanAmount(amount)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                        loanAmount === amount
                                            ? "bg-violet-500 text-white"
                                            : "bg-background border border-border hover:bg-muted"
                                    )}
                                >
                                    {formatCurrency(amount)}
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
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-secondary/10 border border-violet-500/20 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-violet-500/20">
                                <TrendingUp className="h-5 w-5 text-violet-600" />
                            </div>
                            <span className="font-semibold">Monthly Payment</span>
                        </div>

                        <div className="text-center py-6">
                            <motion.div
                                key={result.monthlyPayment}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-5xl md:text-6xl font-bold text-violet-600"
                            >
                                {formatCurrencyDecimal(result.monthlyPayment)}
                            </motion.div>
                            <p className="text-muted-foreground mt-2">
                                per month for <strong>{formatLoanTerm(loanTermMonths)}</strong>
                            </p>
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                                <span className="text-sm text-muted-foreground">Loan Amount</span>
                                <span className="font-semibold">{formatCurrency(loanAmount)}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                                <span className="text-sm text-muted-foreground">Total Interest</span>
                                <span className="font-semibold text-amber-600">+{formatCurrency(result.totalInterest)}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                                <span className="text-sm text-muted-foreground">Total Repayment</span>
                                <span className="font-semibold text-violet-600">{formatCurrency(result.totalRepayment)}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                                <span className="text-sm text-muted-foreground">Number of Payments</span>
                                <span className="font-semibold">{result.numberOfPayments}</span>
                            </div>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <div className="flex gap-3">
                            <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-muted-foreground">
                                <p className="font-medium text-foreground mb-1">Personal Loan Info</p>
                                <ul className="list-disc list-inside space-y-1 text-xs">
                                    <li>Interest rates vary between 6-12% typically</li>
                                    <li>Maximum term usually 7 years (84 months)</li>
                                    <li>May require proof of income</li>
                                    <li>Additional fees may apply (arrangement, early repayment)</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Toggle Schedule */}
                    <button
                        onClick={() => setShowSchedule(!showSchedule)}
                        className="w-full py-3 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium"
                    >
                        {showSchedule ? "Hide" : "Show"} First 12 Month Schedule
                    </button>
                </motion.div>
            </div>

            {/* Monthly Schedule */}
            {showSchedule && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="overflow-x-auto"
                >
                    <div className="p-6 rounded-3xl bg-muted/30 border border-border/50">
                        <h3 className="font-semibold mb-4">First 12 Months Schedule</h3>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left p-2 font-medium">Month</th>
                                    <th className="text-right p-2 font-medium">Payment</th>
                                    <th className="text-right p-2 font-medium">Principal</th>
                                    <th className="text-right p-2 font-medium">Interest</th>
                                    <th className="text-right p-2 font-medium">Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.monthlySchedule.slice(0, 12).map((row) => (
                                    <tr key={row.month} className="border-b border-border/50">
                                        <td className="p-2">{row.month}</td>
                                        <td className="text-right p-2">{formatCurrencyDecimal(row.payment)}</td>
                                        <td className="text-right p-2">{formatCurrencyDecimal(row.principal)}</td>
                                        <td className="text-right p-2 text-amber-600">{formatCurrencyDecimal(row.interest)}</td>
                                        <td className="text-right p-2 font-medium">{formatCurrency(row.remainingBalance)}</td>
                                    </tr>
                                ))}
                                {result.monthlySchedule.length > 12 && (
                                    <tr className="text-muted-foreground">
                                        <td colSpan={5} className="p-2 text-center">
                                            ... and {result.monthlySchedule.length - 12} more months
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
