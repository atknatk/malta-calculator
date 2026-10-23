"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Car,
  Fuel,
  Calendar,
  Euro,
  Leaf,
  Info,
  Globe,
  Ruler,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  calculateVehicleRegistrationTax,
  formatCurrency,
  type VehicleRegistrationTaxOutput,
} from "@/utils/vehicle-registration-tax-calculator";
import type { Co2TestCycle } from "@/utils/malta-registration-tax";

type FuelType = "petrol" | "diesel" | "hybrid" | "plugin_hybrid" | "electric";

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
    <div className="w-full inline-flex flex-wrap items-center rounded-lg border border-input bg-background shadow-sm">
      {options.map((option, index) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "flex-1 relative font-medium transition-all duration-200 h-12 text-sm px-3 min-w-[80px]",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:z-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
            index === 0 && "rounded-l-lg",
            index === options.length - 1 && "rounded-r-lg",
            index !== 0 && "border-l border-input",
            value === option
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : "bg-background text-foreground",
          )}
        >
          {labels?.[option] || option}
        </button>
      ))}
    </div>
  );
}

export function VehicleRegistrationTaxCalculator() {
  const [co2Emissions, setCo2Emissions] = useState(120);
  const [co2TestCycle, setCo2TestCycle] = useState<Co2TestCycle>("wltp");
  const [euroStandard, setEuroStandard] = useState<"6" | "5" | "4" | "3">("6");
  const [lengthMm, setLengthMm] = useState(4300);
  const [vehicleAge, setVehicleAge] = useState(0);
  const [fuelType, setFuelType] = useState<FuelType>("petrol");
  const [vehicleValue, setVehicleValue] = useState(25000);
  const [isEU, setIsEU] = useState<"yes" | "no">("yes");

  const result = useMemo<VehicleRegistrationTaxOutput>(() => {
    return calculateVehicleRegistrationTax({
      co2Emissions: fuelType === "electric" ? 0 : co2Emissions,
      co2TestCycle,
      euroStandard: Number(euroStandard),
      lengthMm,
      vehicleAge,
      fuelType,
      vehicleValue,
      isEU: isEU === "yes",
    });
  }, [
    co2Emissions,
    co2TestCycle,
    euroStandard,
    lengthMm,
    vehicleAge,
    fuelType,
    vehicleValue,
    isEU,
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
          <Car className="h-4 w-4" />
          Transport Malta SOPV 02 (2026)
        </div>
        <h1 className="font-cal text-3xl md:text-4xl font-bold">
          Vehicle Registration Tax Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Calculate Malta&apos;s one-off registration tax for a passenger car
          using the Transport Malta SOPV 02 (2026) CO2 + length formula.
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

            {/* Fuel Type */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Fuel className="h-4 w-4 text-primary/70" />
                Fuel Type
              </label>
              <ToggleGroup
                options={
                  [
                    "petrol",
                    "diesel",
                    "hybrid",
                    "plugin_hybrid",
                    "electric",
                  ] as const
                }
                value={fuelType}
                onChange={(v) => setFuelType(v as FuelType)}
                labels={{
                  petrol: "⛽ Petrol",
                  diesel: "🛢️ Diesel",
                  hybrid: "🔋 Hybrid",
                  plugin_hybrid: "🔌 Plug-in",
                  electric: "⚡ Electric",
                }}
              />
            </div>

            {/* CO2 Emissions */}
            {fuelType !== "electric" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-primary/70" />
                  CO2 Emissions (g/km)
                </label>
                <NumericInput
                  value={co2Emissions}
                  onChange={(v) => setCo2Emissions(v === "" ? 0 : v)}
                  min={0}
                  max={400}
                  allowDecimals={false}
                  suffix="g/km"
                  className="h-14 text-xl px-5"
                />
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={co2Emissions}
                  onChange={(e) => setCo2Emissions(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            )}

            {fuelType !== "electric" && fuelType !== "plugin_hybrid" && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground/70">
                  CO2 test cycle on the Certificate of Conformity
                </label>
                <ToggleGroup
                  options={["wltp", "nedc"] as const}
                  value={co2TestCycle}
                  onChange={setCo2TestCycle}
                  labels={{ wltp: "WLTP", nedc: "NEDC" }}
                />
                {co2TestCycle === "nedc" && (
                  <>
                    <label className="text-sm font-medium text-foreground/70">
                      Euro emission standard
                    </label>
                    <ToggleGroup
                      options={["6", "5", "4", "3"] as const}
                      value={euroStandard}
                      onChange={setEuroStandard}
                      labels={{
                        "6": "Euro 6",
                        "5": "Euro 5",
                        "4": "Euro 4",
                        "3": "Euro 3 or older",
                      }}
                    />
                  </>
                )}
                <p className="text-xs text-muted-foreground">
                  WLTP rates need an original CoC showing WLTP values (most cars
                  from 2021). NEDC rates rise for older Euro standards.
                </p>
              </div>
            )}

            {/* Length */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Ruler className="h-4 w-4 text-primary/70" />
                Vehicle Length (mm)
              </label>
              <NumericInput
                value={lengthMm}
                onChange={(v) => setLengthMm(v === "" ? 0 : v)}
                min={2500}
                max={6000}
                allowDecimals={false}
                suffix="mm"
                className="h-14 text-xl px-5"
              />
            </div>

            {/* Vehicle Age */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary/70" />
                Vehicle Age (years)
              </label>
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(
                  (age) => (
                    <button
                      key={age}
                      onClick={() => setVehicleAge(age)}
                      className={cn(
                        "w-12 h-12 rounded-xl text-sm font-medium transition-all",
                        vehicleAge === age
                          ? "bg-primary text-primary-foreground"
                          : "bg-background border border-border hover:bg-muted",
                      )}
                    >
                      {age === 0 ? "New" : age === 14 ? "14+" : age}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Vehicle Value */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Euro className="h-4 w-4 text-primary/70" />
                Registration Value
              </label>
              <NumericInput
                value={vehicleValue}
                onChange={(v) => setVehicleValue(v === "" ? 0 : v)}
                min={0}
                allowDecimals={false}
                suffix="€"
                className="h-14 text-xl px-5"
                suffixClassName="text-lg"
              />
              <p className="text-xs text-muted-foreground">
                New car: invoice / CIF value. Used car: Transport Malta&apos;s
                valuation (valuation.vehicleregistration.gov.mt).
              </p>
            </div>

            {/* EU Origin */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary/70" />
                Imported from EU?
              </label>
              <ToggleGroup
                options={["yes", "no"] as const}
                value={isEU}
                onChange={setIsEU}
                labels={{ yes: "🇪🇺 EU Country", no: "🌍 Non-EU" }}
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
                {result.totalTax > result.registrationTax
                  ? "Total Taxes (Registration Tax + Duty + VAT)"
                  : "Registration Tax"}
              </span>
            </div>

            <div className="text-center py-6">
              <motion.div
                key={result.totalTax}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl md:text-6xl font-bold text-primary"
              >
                {formatCurrency(result.totalTax)}
              </motion.div>
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
              {result.breakdown.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex justify-between items-center p-3 rounded-xl",
                    item.isDiscount
                      ? "bg-green-500/10 border border-green-500/20"
                      : "bg-background/50",
                  )}
                >
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      "font-semibold",
                      item.isDiscount && "text-green-600",
                    )}
                  >
                    {item.isDiscount ? "-" : ""}
                    {formatCurrency(Math.abs(item.amount))}
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

          {/* Electric Vehicle Info */}
          {fuelType === "electric" && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex gap-3">
                <Leaf className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">
                    Electric Vehicle Benefits! ⚡
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Battery EVs are exempt from registration tax and pay €0 road
                    licence for years 0–5. In 2026 Transport Malta grants €8,000
                    (≤ €40,000) or €6,000 (€40,000–€100,000) for a new EV.
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
                    Tax = (CO2 × RV × CO2 rate) + (length × RV × length rate)
                  </li>
                  <li>
                    No separate age discount: for used cars the Registration
                    Value (Transport Malta valuation) already reflects age
                  </li>
                  <li>
                    BEVs and PHEVs (≥ 50 km electric range) are exempt; hybrids
                    get a 30% CO2 reduction
                  </li>
                  <li>
                    Non-EU used cars over 5 years old pay at least the SOPV 02
                    minimum tax
                  </li>
                  <li>
                    Non-EU: 10% duty + 18% VAT; EU: VAT only on new cars. No VAT
                    on the registration tax itself
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
