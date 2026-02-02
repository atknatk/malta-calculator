"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Edit3, Check } from "lucide-react";
import { MonthlySalaryOutput } from "@/types/salary-calculator-type";
import { formatMoney } from "@/utils/money-format";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MobileMonthlyCardsProps {
    data: MonthlySalaryOutput[];
    setData: React.Dispatch<React.SetStateAction<MonthlySalaryOutput[]>>;
    onBonusChange?: (month: string, value: number) => void;
}

function MonthCard({
    item,
    index,
    onGrossWageChange,
    onBonusChange,
}: {
    item: MonthlySalaryOutput;
    index: number;
    onGrossWageChange: (index: number, value: number) => void;
    onBonusChange?: (month: string, value: number) => void;
}) {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [isEditingBonus, setIsEditingBonus] = React.useState(false);
    const [editValue, setEditValue] = React.useState(item.grossWage.toString());
    const [bonusEditValue, setBonusEditValue] = React.useState(item.bonus.toString());
    const inputRef = React.useRef<HTMLInputElement>(null);
    const bonusInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        setEditValue(item.grossWage.toString());
    }, [item.grossWage]);

    const handleSave = () => {
        const numValue = parseFloat(editValue) || 0;
        onGrossWageChange(index, numValue);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSave();
        } else if (e.key === "Escape") {
            setEditValue(item.grossWage.toString());
            setIsEditing(false);
        }
    };

    const handleBonusSave = () => {
        const numValue = parseFloat(bonusEditValue) || 0;
        onBonusChange?.(item.month, numValue);
        setIsEditingBonus(false);
    };

    const handleBonusKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleBonusSave();
        } else if (e.key === "Escape") {
            setBonusEditValue(item.bonus.toString());
            setIsEditingBonus(false);
        }
    };

    React.useEffect(() => {
        setBonusEditValue(item.bonus.toString());
    }, [item.bonus]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.3 }}
            className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        >
            {/* Card Header - Always Visible */}
            <div
                className={cn(
                    "p-4 cursor-pointer transition-colors duration-200",
                    isExpanded ? "bg-muted/30" : "hover:bg-muted/20"
                )}
                onClick={() => !isEditing && setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs sm:text-sm font-bold text-primary">
                                {item.month.substring(0, 3).toUpperCase()}
                            </span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{item.month}</h3>
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                                <span className="flex-shrink-0">Gross:</span>
                                {isEditing ? (
                                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                        <Input
                                            ref={inputRef}
                                            type="number"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            onBlur={handleSave}
                                            onFocus={(e) => e.target.select()}
                                            className="w-20 sm:w-24 h-6 sm:h-7 text-xs sm:text-sm px-2"
                                            autoFocus
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSave();
                                            }}
                                            className="p-1 rounded bg-primary text-primary-foreground flex-shrink-0"
                                        >
                                            <Check className="w-3 h-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsEditing(true);
                                        }}
                                        className="flex items-center gap-1 hover:text-primary transition-colors"
                                    >
                                        <span className="font-medium whitespace-nowrap">{formatMoney(item.grossWage)}</span>
                                        <Edit3 className="w-3 h-3 flex-shrink-0" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                        <div className="text-right">
                            <span className="text-[11px] sm:text-xs text-muted-foreground">Net</span>
                            <p className="text-base sm:text-lg font-bold text-green-700 dark:text-green-400 whitespace-nowrap">
                                {formatMoney(item.net)}
                            </p>
                        </div>
                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 pt-2 border-t border-border/30">
                            <div className="grid grid-cols-2 gap-3">
                                <DetailItem label="Gross Total" value={formatMoney(item.grossTotal)} />
                                <DetailItem label="SSC Tax" value={formatMoney(item.sscTax)} variant="warning" />
                                <DetailItem label="Income Tax" value={formatMoney(item.incomeTax)} variant="danger" />
                                <DetailItem label="Paid" value={formatMoney(item.paid)} variant="success" />

                                {/* Secondary Details */}
                                <DetailItem label="Non-Tax Benefit" value={formatMoney(item.nonTaxBenefit)} small />
                                <DetailItem label="Tax Benefit" value={formatMoney(item.taxBenefit)} small />

                                {/* Editable Bonus */}
                                <div className={cn("flex flex-col", "text-xs")}>
                                    <span className="text-muted-foreground text-xs">Bonus</span>
                                    {isEditingBonus ? (
                                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                            <Input
                                                ref={bonusInputRef}
                                                type="number"
                                                value={bonusEditValue}
                                                onChange={(e) => setBonusEditValue(e.target.value)}
                                                onKeyDown={handleBonusKeyDown}
                                                onBlur={handleBonusSave}
                                                onFocus={(e) => e.target.select()}
                                                className="w-20 h-6 text-xs px-2"
                                                autoFocus
                                            />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleBonusSave();
                                                }}
                                                className="p-1 rounded bg-primary text-primary-foreground flex-shrink-0"
                                            >
                                                <Check className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsEditingBonus(true);
                                            }}
                                            className="flex items-center gap-1 hover:text-primary transition-colors text-left"
                                        >
                                            <span className={cn(
                                                "font-semibold text-sm",
                                                item.bonus > 0 && "text-green-700 dark:text-green-400"
                                            )}>
                                                {formatMoney(item.bonus)}
                                            </span>
                                            <Edit3 className="w-3 h-3 flex-shrink-0" />
                                        </button>
                                    )}
                                </div>

                                <DetailItem label="Gov. Bonus" value={formatMoney(item.governmentBonus)} small />
                            </div>

                            {/* Cumulative Info */}
                            <div className="mt-3 pt-3 border-t border-border/30">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Cumulative Income</span>
                                    <span className="font-medium">{formatMoney(item.cumulativeIncomeBase)}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function DetailItem({
    label,
    value,
    variant,
    small,
}: {
    label: string;
    value: string;
    variant?: "success" | "warning" | "danger";
    small?: boolean;
}) {
    const variantClasses = {
        success: "text-green-700 dark:text-green-400",
        warning: "text-orange-700 dark:text-orange-400",
        danger: "text-red-700 dark:text-red-400",
    };

    return (
        <div className={cn("flex flex-col", small && "text-xs")}>
            <span className="text-muted-foreground text-xs">{label}</span>
            <span
                className={cn(
                    "font-semibold",
                    small ? "text-sm" : "text-base",
                    variant && variantClasses[variant]
                )}
            >
                {value}
            </span>
        </div>
    );
}

export function MobileMonthlyCards({ data, setData, onBonusChange }: MobileMonthlyCardsProps) {
    const handleGrossWageChange = (index: number, value: number) => {
        setData((prevData) => {
            const newData = [...prevData];
            // Update current and all subsequent months
            for (let i = index; i < newData.length; i++) {
                newData[i] = { ...newData[i], grossWage: value };
            }
            return newData;
        });
    };

    return (
        <div className="space-y-3">
            {data.map((item, index) => (
                <MonthCard
                    key={item.month}
                    item={item}
                    index={index}
                    onGrossWageChange={handleGrossWageChange}
                    onBonusChange={onBonusChange}
                />
            ))}
        </div>
    );
}
