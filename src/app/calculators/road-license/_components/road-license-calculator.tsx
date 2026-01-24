"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Car, Fuel, Calendar, Gauge, Info, Bike, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import {
    calculateRoadLicense,
    formatCurrency,
    type RoadLicenseOutput,
} from "@/utils/road-license-calculator";

type FuelType = 'petrol' | 'diesel' | 'hybrid' | 'plugin_hybrid' | 'electric' | 'lpg';
type VehicleCategory = 'private_car' | 'motorcycle' | 'commercial' | 'vintage';
type LicensePeriod = 3 | 6 | 12;

function ToggleGroup<T extends string | number>({
    options,
    value,
    onChange,
    labels,
}: {
    options: readonly T[];
    value: T;
    onChange: (value: T) => void;
    labels?: Partial<Record<T & (string | number), string>>;
}) {
    return (
        <div className="w-full inline-flex flex-wrap items-center rounded-lg border border-input bg-background shadow-sm">
            {options.map((option, index) => (
                <button
                    key={String(option)}
                    type="button"
                    onClick={() => onChange(option)}
                    className={cn(
                        "flex-1 relative font-medium transition-all duration-200 h-12 text-sm px-3 min-w-[70px]",
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
                    {labels?.[option as T & (string | number)] || String(option)}
                </button>
            ))}
        </div>
    );
}

export function RoadLicenseCalculator() {
    const [engineCapacity, setEngineCapacity] = useState(1600);
    const [co2Emissions, setCo2Emissions] = useState(130);
    const [vehicleAge, setVehicleAge] = useState(5);
    const [fuelType, setFuelType] = useState<FuelType>("petrol");
    const [vehicleCategory, setVehicleCategory] = useState<VehicleCategory>("private_car");
    const [licensePeriod, setLicensePeriod] = useState<LicensePeriod>(12);

    const result = useMemo<RoadLicenseOutput>(() => {
        return calculateRoadLicense({
            engineCapacity,
            co2Emissions: fuelType === 'electric' ? 0 : co2Emissions,
            vehicleAge,
            fuelType,
            vehicleCategory,
            licensePeriod,
        });
    }, [engineCapacity, co2Emissions, vehicleAge, fuelType, vehicleCategory, licensePeriod]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <Car className="h-4 w-4" />
                    Transport Malta
                </div>
                <h1 className="font-cal text-3xl md:text-4xl font-bold">
                    Road License Calculator
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Calculate your annual road license (circulation tax) fee in Malta.
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
                                <Car className="h-5 w-5 text-primary" />
                            </div>
                            <span className="font-semibold">Vehicle Details</span>
                        </div>

                        {/* Vehicle Category */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground/70">
                                Vehicle Type
                            </label>
                            <ToggleGroup
                                options={["private_car", "motorcycle", "commercial", "vintage"] as const}
                                value={vehicleCategory}
                                onChange={(v) => setVehicleCategory(v as VehicleCategory)}
                                labels={{
                                    private_car: "🚗 Car",
                                    motorcycle: "🏍️ Bike",
                                    commercial: "🚚 Commercial",
                                    vintage: "🏛️ Vintage",
                                }}
                            />
                        </div>

                        {/* Fuel Type */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                                <Fuel className="h-4 w-4 text-primary/70" />
                                Fuel Type
                            </label>
                            <ToggleGroup
                                options={["petrol", "diesel", "hybrid", "electric", "lpg"] as const}
                                value={fuelType}
                                onChange={(v) => setFuelType(v as FuelType)}
                                labels={{
                                    petrol: "⛽ Petrol",
                                    diesel: "🛢️ Diesel",
                                    hybrid: "🔋 Hybrid",
                                    electric: "⚡ Electric",
                                    lpg: "🌿 LPG",
                                }}
                            />
                        </div>

                        {/* Engine Capacity */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                                <Gauge className="h-4 w-4 text-primary/70" />
                                Engine Capacity (cc)
                            </label>
                            <NumericInput
                                value={engineCapacity}
                                onChange={(v) => setEngineCapacity(v === "" ? 50 : v)}
                                min={50}
                                max={8000}
                                allowDecimals={false}
                                suffix="cc"
                                className="h-14 text-xl px-5"
                            />
                            {/* Quick presets */}
                            <div className="flex flex-wrap gap-2">
                                {vehicleCategory === 'motorcycle'
                                    ? [125, 250, 500, 750, 1000].map((cc) => (
                                        <button
                                            key={cc}
                                            onClick={() => setEngineCapacity(cc)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                                                engineCapacity === cc
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-background border border-border hover:bg-muted"
                                            )}
                                        >
                                            {cc}cc
                                        </button>
                                    ))
                                    : [1000, 1400, 1600, 2000, 2500, 3000].map((cc) => (
                                        <button
                                            key={cc}
                                            onClick={() => setEngineCapacity(cc)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                                                engineCapacity === cc
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-background border border-border hover:bg-muted"
                                            )}
                                        >
                                            {cc}cc
                                        </button>
                                    ))
                                }
                            </div>
                        </div>

                        {/* Vehicle Age */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary/70" />
                                Vehicle Age: {vehicleAge} years
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="30"
                                value={vehicleAge}
                                onChange={(e) => setVehicleAge(parseInt(e.target.value))}
                                className="w-full accent-primary"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>New</span>
                                <span>30+ years</span>
                            </div>
                        </div>

                        {/* License Period */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground/70">
                                License Period
                            </label>
                            <ToggleGroup
                                options={[3, 6, 12] as const}
                                value={licensePeriod}
                                onChange={(v) => setLicensePeriod(v as LicensePeriod)}
                                labels={{
                                    3: "3 Months",
                                    6: "6 Months",
                                    12: "12 Months",
                                }}
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
                                <Car className="h-5 w-5 text-primary" />
                            </div>
                            <span className="font-semibold">
                                {licensePeriod === 12 ? "Annual" : `${licensePeriod}-Month`} License Fee
                            </span>
                        </div>

                        <div className="text-center py-6">
                            <motion.div
                                key={result.periodFee}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-5xl md:text-6xl font-bold text-primary"
                            >
                                {formatCurrency(result.periodFee)}
                            </motion.div>
                            {licensePeriod !== 12 && (
                                <p className="text-muted-foreground mt-2">
                                    Annual: {formatCurrency(result.annualFee)} | Monthly: {formatCurrency(Math.round(result.monthlyEquivalent))}
                                </p>
                            )}
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                                <span className="text-sm text-muted-foreground">Base Fee ({engineCapacity}cc)</span>
                                <span className="font-semibold">{formatCurrency(result.baseFee)}</span>
                            </div>
                            {result.co2Surcharge > 0 && (
                                <div className="flex justify-between items-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                    <span className="text-sm text-muted-foreground">CO2 Surcharge</span>
                                    <span className="font-semibold text-amber-600">+{formatCurrency(result.co2Surcharge)}</span>
                                </div>
                            )}
                            {result.ecoDiscount > 0 && (
                                <div className="flex justify-between items-center p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                                    <span className="text-sm text-muted-foreground">Eco Discount</span>
                                    <span className="font-semibold text-green-600">-{formatCurrency(result.ecoDiscount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                                <span className="text-sm text-muted-foreground">Annual Total</span>
                                <span className="font-semibold">{formatCurrency(result.annualFee)}</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm">
                            <p className="text-sm text-muted-foreground">{result.description}</p>
                        </div>
                    </div>

                    {/* Electric Vehicle Info */}
                    {fuelType === 'electric' && (
                        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                            <div className="flex gap-3">
                                <Car className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium text-foreground mb-1">
                                        Electric Vehicle - FREE Road License! ⚡
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        Electric vehicles are exempt from road license fees in Malta.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Vintage Info */}
                    {(vehicleCategory === 'vintage' || vehicleAge >= 25) && (
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <div className="flex gap-3">
                                <Calendar className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium text-foreground mb-1">
                                        Vintage Vehicle Rate
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        Vehicles 25+ years old qualify for the reduced vintage rate of €30/year.
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
                                    <li>Road license must be renewed before expiry</li>
                                    <li>Electric vehicles are exempt from fees</li>
                                    <li>Vintage vehicles (25+ years) get reduced rates</li>
                                    <li>Late renewal may incur penalties</li>
                                    <li>Pay at Transport Malta offices or online</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
