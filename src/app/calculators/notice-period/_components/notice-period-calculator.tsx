"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Briefcase, Calendar, Info, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import {
    calculateNoticePeriod,
    toMonths,
    formatNoticePeriod,
    type NoticePeriodOutput,
} from "@/utils/notice-period-calculator";

// Premium Toggle Group similar to salary calculator
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

// Notice Period Brackets Table
const BRACKETS = [
    { service: "Less than 1 month", notice: "No notice", probation: true },
    { service: "1 to 6 months", notice: "1 week", probation: false },
    { service: "6 months to 2 years", notice: "2 weeks", probation: false },
    { service: "2 to 4 years", notice: "4 weeks", probation: false },
    { service: "4 to 7 years", notice: "8 weeks", probation: false },
    { service: "7 to 8 years", notice: "9 weeks", probation: false },
    { service: "8 to 9 years", notice: "10 weeks", probation: false },
    { service: "9 to 10 years", notice: "11 weeks", probation: false },
    { service: "More than 10 years", notice: "12 weeks", probation: false },
];

export function NoticePeriodCalculator() {
    const [years, setYears] = useState(2);
    const [months, setMonths] = useState(0);
    const [isProbation, setIsProbation] = useState<"yes" | "no">("no");

    const result = useMemo<NoticePeriodOutput>(() => {
        const totalMonths = toMonths(years, months);
        return calculateNoticePeriod({
            monthsOfService: totalMonths,
            isInProbation: isProbation === "yes",
        });
    }, [years, months, isProbation]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <Clock className="h-4 w-4" />
                    Employment Tool
                </div>
                <h1 className="font-cal text-3xl md:text-4xl font-bold">
                    Notice Period Calculator
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Calculate your required notice period based on Malta&apos;s Employment and Industrial Relations Act.
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
                                <Briefcase className="h-5 w-5 text-primary" />
                            </div>
                            <span className="font-semibold">Length of Service</span>
                        </div>

                        {/* Years Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary/70" />
                                Years
                            </label>
                            <NumericInput
                                value={years}
                                onChange={(v) => setYears(v === "" ? 0 : v)}
                                min={0}
                                max={50}
                                allowDecimals={false}
                                className="h-14 px-4 text-lg"
                            />
                        </div>

                        {/* Months Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/70">Months</label>
                            <NumericInput
                                value={months}
                                onChange={(v) => setMonths(v === "" ? 0 : v)}
                                min={0}
                                max={11}
                                allowDecimals={false}
                                className="h-14 px-4 text-lg"
                            />
                        </div>

                        {/* Probation Toggle */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground/70">
                                Currently in Probation Period?
                            </label>
                            <ToggleGroup
                                options={["no", "yes"] as const}
                                value={isProbation}
                                onChange={setIsProbation}
                                labels={{ yes: "Yes", no: "No" }}
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
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-primary/20">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                            </div>
                            <span className="font-semibold">Your Notice Period</span>
                        </div>

                        <div className="text-center py-6">
                            <motion.div
                                key={result.weeks}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-5xl md:text-6xl font-bold text-primary"
                            >
                                {formatNoticePeriod(result.weeks)}
                            </motion.div>
                            {result.weeks > 0 && (
                                <p className="text-muted-foreground mt-2">
                                    ({result.days} calendar days)
                                </p>
                            )}
                        </div>

                        <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm">
                            <p className="text-sm text-muted-foreground">
                                <strong>Service Bracket:</strong> {result.serviceBracket}
                            </p>
                            {result.isInProbation && (
                                <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                                    ⚠️ During probation period rules apply
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <div className="flex gap-3">
                            <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-muted-foreground">
                                <p className="font-medium text-foreground mb-1">Important Notes</p>
                                <ul className="list-disc list-inside space-y-1 text-xs">
                                    <li>Notice must be given by the terminating party</li>
                                    <li>Notice period starts the day after it is given</li>
                                    <li>Longer periods may apply for managerial positions</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Reference Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-12"
            >
                <h2 className="text-xl font-semibold mb-4">Notice Period Reference Table</h2>
                <p className="text-muted-foreground text-sm mb-6">
                    Based on Malta Employment and Industrial Relations Act, Article 36(5)
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left p-4 font-semibold">Length of Service</th>
                                <th className="text-left p-4 font-semibold">Minimum Notice</th>
                            </tr>
                        </thead>
                        <tbody>
                            {BRACKETS.map((bracket, i) => (
                                <tr
                                    key={i}
                                    className={cn(
                                        "border-b border-border/50 transition-colors",
                                        result.serviceBracket.includes(bracket.service.split(" ")[0])
                                            ? "bg-primary/5"
                                            : "hover:bg-muted/30"
                                    )}
                                >
                                    <td className="p-4">{bracket.service}</td>
                                    <td className="p-4 font-medium">{bracket.notice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
