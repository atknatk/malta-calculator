"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, User, Clock, Info, PartyPopper, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import {
    calculateRetirementAge,
    getRetirementAgeBrackets,
    type RetirementAgeOutput,
} from "@/utils/retirement-age-calculator";

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

export function RetirementAgeCalculator() {
    const currentYear = new Date().getFullYear();
    const [birthYear, setBirthYear] = useState(1980);
    const [gender, setGender] = useState<"male" | "female">("male");

    const result = useMemo<RetirementAgeOutput>(() => {
        return calculateRetirementAge({ birthYear, gender });
    }, [birthYear, gender]);

    const brackets = getRetirementAgeBrackets();
    const alreadyRetired = result.yearsUntilRetirement < 0;

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <Calendar className="h-4 w-4" />
                    Retirement Planning
                </div>
                <h1 className="font-cal text-3xl md:text-4xl font-bold">
                    Retirement Age Calculator
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Calculate your statutory retirement age based on Malta&apos;s Social Security Act.
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
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <span className="font-semibold">Your Details</span>
                        </div>

                        {/* Birth Year Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary/70" />
                                Birth Year
                            </label>
                            <NumericInput
                                value={birthYear}
                                onChange={(v) => setBirthYear(v === "" ? 1980 : v)}
                                min={1920}
                                max={currentYear}
                                allowDecimals={false}
                                className="h-14 px-4 text-lg"
                            />
                        </div>

                        {/* Gender Toggle (only relevant for born 1951 or earlier) */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground/70">
                                Gender
                                {birthYear > 1951 && (
                                    <span className="text-muted-foreground ml-2">(not applicable for your birth year)</span>
                                )}
                            </label>
                            <ToggleGroup
                                options={["male", "female"] as const}
                                value={gender}
                                onChange={setGender}
                                labels={{ male: "👨 Male", female: "👩 Female" }}
                            />
                            {birthYear <= 1951 && (
                                <p className="text-xs text-muted-foreground">
                                    For those born 1951 or earlier, retirement age differs by gender.
                                </p>
                            )}
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
                    <div className={cn(
                        "p-6 rounded-3xl border space-y-6",
                        alreadyRetired
                            ? "bg-gradient-to-br from-green-500/10 via-green-500/5 to-emerald-500/10 border-green-500/20"
                            : "bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border-primary/20"
                    )}>
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "p-2.5 rounded-xl",
                                alreadyRetired ? "bg-green-500/20" : "bg-primary/20"
                            )}>
                                {alreadyRetired ? (
                                    <PartyPopper className="h-5 w-5 text-green-500" />
                                ) : (
                                    <Clock className="h-5 w-5 text-primary" />
                                )}
                            </div>
                            <span className="font-semibold">
                                {alreadyRetired ? "Already Eligible!" : "Your Retirement Age"}
                            </span>
                        </div>

                        <div className="text-center py-6">
                            <motion.div
                                key={result.retirementAge}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={cn(
                                    "text-5xl md:text-6xl font-bold",
                                    alreadyRetired ? "text-green-500" : "text-primary"
                                )}
                            >
                                {result.retirementAge} years
                            </motion.div>
                            <p className="text-muted-foreground mt-2">
                                Retirement Year: <strong>{result.retirementYear}</strong>
                            </p>
                        </div>

                        {!alreadyRetired && (
                            <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm text-center">
                                <p className="text-2xl font-bold text-foreground">
                                    {result.yearsUntilRetirement} years
                                </p>
                                <p className="text-sm text-muted-foreground">until retirement</p>
                            </div>
                        )}

                        <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm">
                            <p className="text-sm text-muted-foreground">
                                <strong>Rule Applied:</strong> {result.ruleDescription}
                            </p>
                        </div>
                    </div>

                    {/* Early Retirement Info */}
                    {result.eligibleForEarlyRetirement && !alreadyRetired && (
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <div className="flex gap-3">
                                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium text-foreground mb-1">Early Retirement Option</p>
                                    <p className="text-muted-foreground text-xs">
                                        You may retire at 61 if you have at least 35 years of contributions
                                        and are not in gainful employment until your statutory retirement age.
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
                                <p className="font-medium text-foreground mb-1">Official Sources</p>
                                <p className="text-xs">
                                    Based on the Social Security Act (Cap. 318) of Malta.
                                    Retirement age has been gradually increasing since 2007.
                                </p>
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
                <h2 className="text-xl font-semibold mb-4">Retirement Age Reference Table</h2>
                <p className="text-muted-foreground text-sm mb-6">
                    Based on Malta Social Security Act (Cap. 318)
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left p-4 font-semibold">Birth Year</th>
                                <th className="text-left p-4 font-semibold">Retirement Age</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brackets.map((bracket, i) => (
                                <tr
                                    key={i}
                                    className={cn(
                                        "border-b border-border/50 transition-colors",
                                        result.ruleDescription.includes(bracket.birthYears.split(" ")[0])
                                            ? "bg-primary/5"
                                            : "hover:bg-muted/30"
                                    )}
                                >
                                    <td className="p-4">{bracket.birthYears}</td>
                                    <td className="p-4 font-medium">{bracket.age}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
