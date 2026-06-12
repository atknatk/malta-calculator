"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Car,
  CreditCard,
  FileText,
  Euro,
  Info,
  Leaf,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  calculateVehicleRegistrationFee,
  formatCurrency,
  type VehicleRegistrationFeeOutput,
} from "@/utils/vehicle-registration-fee-calculator";

type VehicleType = "car" | "motorcycle" | "van" | "commercial";
type PlateType = "random" | "personalised" | "customised";
type FuelType =
  | "petrol"
  | "diesel"
  | "electric"
  | "hybrid"
  | "plugin_hybrid"
  | "lpg";

export function VehicleRegistrationFeeCalculator() {
  const [vehicleType, setVehicleType] = useState<VehicleType>("car");
  const [plateType, setPlateType] = useState<PlateType>("random");
  const [isImported, setIsImported] = useState(false);
  const [engineCapacity, setEngineCapacity] = useState(1600);
  const [co2Emissions, setCo2Emissions] = useState(130);
  const [vehicleAge, setVehicleAge] = useState(0);
  const [fuelType, setFuelType] = useState<FuelType>("petrol");

  const result = useMemo<VehicleRegistrationFeeOutput>(() => {
    return calculateVehicleRegistrationFee({
      vehicleType,
      plateType,
      isImported,
      engineCapacity,
      co2Emissions: fuelType === "electric" ? 0 : co2Emissions,
      vehicleAge,
      fuelType,
    });
  }, [
    vehicleType,
    plateType,
    isImported,
    engineCapacity,
    co2Emissions,
    vehicleAge,
    fuelType,
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <FileText className="h-4 w-4" />
          Transport Malta
        </div>
        <h1 className="font-cal text-3xl md:text-4xl font-bold">
          Vehicle Registration Fee Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Calculate the total cost to register your vehicle in Malta, including
          plates, VRT inspection, and first year road tax.
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

            {/* Vehicle Type Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Vehicle Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { value: "car", label: "🚗 Car" },
                    { value: "motorcycle", label: "🏍️ Motorcycle" },
                    { value: "van", label: "🚐 Van" },
                    { value: "commercial", label: "🚛 Commercial" },
                  ] as const
                ).map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setVehicleType(value)}
                    className={cn(
                      "p-3 rounded-lg text-sm font-medium transition-all border",
                      vehicleType === value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:bg-muted",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Plate Type Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Number Plates
              </label>
              <div className="grid grid-cols-1 gap-2">
                {(
                  [
                    {
                      value: "random",
                      label: "Random",
                      desc: "€70 (Standard)",
                    },
                    {
                      value: "personalised",
                      label: "Personalised",
                      desc: "€200 (Custom choice)",
                    },
                    {
                      value: "customised",
                      label: "Customised",
                      desc: "€1,500 (Premium)",
                    },
                  ] as const
                ).map(({ value, label, desc }) => (
                  <button
                    key={value}
                    onClick={() => setPlateType(value)}
                    className={cn(
                      "p-3 rounded-lg text-left transition-all border",
                      plateType === value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:bg-muted",
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{label}</span>
                      <span className="text-xs opacity-80">{desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Is Imported Toggle */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Vehicle Origin
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsImported(false)}
                  className={cn(
                    "flex-1 p-3 rounded-lg text-sm font-medium transition-all border",
                    !isImported
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:bg-muted",
                  )}
                >
                  🇪🇺 EU/Malta Vehicle
                </button>
                <button
                  onClick={() => setIsImported(true)}
                  className={cn(
                    "flex-1 p-3 rounded-lg text-sm font-medium transition-all border",
                    isImported
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:bg-muted",
                  )}
                >
                  🌍 Imported Vehicle
                </button>
              </div>
              {isImported && (
                <p className="text-xs text-muted-foreground">
                  Imported vehicles require a VRT inspection (€55)
                </p>
              )}
            </div>

            {/* Fuel Type Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Fuel Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { value: "petrol", emoji: "⛽" },
                    { value: "diesel", emoji: "🛢️" },
                    { value: "electric", emoji: "⚡" },
                    { value: "hybrid", emoji: "🔋" },
                    { value: "plugin_hybrid", emoji: "🔌" },
                    { value: "lpg", emoji: "💨" },
                  ] as const
                ).map(({ value, emoji }) => (
                  <button
                    key={value}
                    onClick={() => setFuelType(value)}
                    className={cn(
                      "min-h-11 p-2 rounded-lg text-xs font-medium transition-all border",
                      fuelType === value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:bg-muted",
                    )}
                  >
                    {emoji}{" "}
                    {value
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

            {/* Engine Capacity Slider - Hide for Electric */}
            {fuelType !== "electric" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/70">
                  Engine Capacity: {engineCapacity} cc
                </label>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={engineCapacity}
                  onChange={(e) => setEngineCapacity(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>500cc</span>
                  <span>5000cc</span>
                </div>
              </div>
            )}

            {/* CO2 Emissions Slider - Hide for Electric */}
            {fuelType !== "electric" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/70">
                  CO2 Emissions: {co2Emissions} g/km
                </label>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="5"
                  value={co2Emissions}
                  onChange={(e) => setCo2Emissions(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>50 g/km</span>
                  <span>300 g/km</span>
                </div>
              </div>
            )}

            {/* Vehicle Age Slider */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">
                Vehicle Age: {vehicleAge} {vehicleAge === 1 ? "year" : "years"}
              </label>
              <input
                type="range"
                min="0"
                max="15"
                value={vehicleAge}
                onChange={(e) => setVehicleAge(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>New</span>
                <span>15+ years</span>
              </div>
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
                <Euro className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">Total Registration Cost</span>
            </div>

            <div className="text-center py-6">
              <motion.div
                key={result.totalFee}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl md:text-6xl font-bold text-primary"
              >
                {formatCurrency(result.totalFee)}
              </motion.div>
              <p className="text-muted-foreground mt-2 text-sm">
                One-time registration fee
              </p>
            </div>

            {/* Fee Breakdown */}
            <div className="space-y-2">
              {result.breakdown.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex justify-between items-center p-3 rounded-xl",
                    item.label.includes("Administration")
                      ? "bg-blue-500/10"
                      : item.label.includes("Plates")
                        ? "bg-purple-500/10"
                        : item.label.includes("VRT")
                          ? "bg-amber-500/10"
                          : item.label.includes("Circulation")
                            ? "bg-green-500/10"
                            : "bg-background/50",
                  )}
                >
                  <div className="flex-1">
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <span className="font-semibold ml-2">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm">
              <p className="text-sm text-muted-foreground">
                {result.description}
              </p>
            </div>
          </div>

          {/* Electric Vehicle Benefits */}
          {fuelType === "electric" && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex gap-3">
                <Leaf className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">
                    Electric Vehicle Benefits
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Electric vehicles are exempt from annual road tax! You only
                    pay the registration fees once.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tax vs Fee disclaimer */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  This is the fixed fees, not the registration tax
                </p>
                <p className="text-xs leading-relaxed">
                  Malta&apos;s one-time vehicle registration tax is a percentage
                  of your vehicle&apos;s official{" "}
                  <strong>Registration Value (CIF)</strong> based on CO2, length
                  and Euro standard, with a €2,000 minimum for M1 cars. This
                  calculator estimates only the <strong>fixed fees</strong>{" "}
                  (admin, plates, VRT, first year road licence). For an exact
                  registration tax figure, look up your make/model on the
                  official{" "}
                  <a
                    href="https://www.valuation.vehicleregistration.gov.mt/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground"
                  >
                    eReg valuation tool
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  Fee Reference (Transport Malta)
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>
                    <strong>Administration:</strong> €15 flat
                  </li>
                  <li>
                    <strong>Random plates:</strong> €70 (car / van /
                    commercial), €35 (motorcycle)
                  </li>
                  <li>
                    <strong>Personalised plates:</strong> €200 (your choice of
                    letters/numbers, subject to availability)
                  </li>
                  <li>
                    <strong>Customised plates:</strong> €1,500 (premium format)
                  </li>
                  <li>
                    <strong>VRT inspection:</strong> €55, required for all
                    imported vehicles
                  </li>
                  <li>
                    <strong>First year road licence:</strong> estimate based on
                    engine size, CO2 and age (€100–€650 petrol / €100–€749
                    diesel range; EVs and qualifying PHEVs €0 for 5 years)
                  </li>
                  <li>Only Euro 6 or newer vehicles can be registered</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
