"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Car, Fuel, Calendar, Gauge, Info, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  calculateRoadLicense,
  formatCurrency,
  type Co2Standard,
  type RoadLicenseFuelType,
  type RoadLicenseOutput,
  type RoadLicenseVehicleType,
} from "@/utils/road-license-calculator";

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
              : "bg-background text-foreground",
          )}
        >
          {labels?.[option as T & (string | number)] || String(option)}
        </button>
      ))}
    </div>
  );
}

export function RoadLicenseCalculator() {
  const currentYear = new Date().getFullYear();
  const [vehicleType, setVehicleType] = useState<RoadLicenseVehicleType>("car");
  const [fuelType, setFuelType] = useState<RoadLicenseFuelType>("petrol");
  const [manufactureYear, setManufactureYear] = useState(currentYear - 5);
  const [registeredBefore2009, setRegisteredBefore2009] = useState<
    "yes" | "no"
  >("no");
  const [engineCapacity, setEngineCapacity] = useState(1400);
  const [co2Emissions, setCo2Emissions] = useState(130);
  const [co2Standard, setCo2Standard] = useState<Co2Standard>("wltp");

  const usesCo2 =
    vehicleType === "car" &&
    registeredBefore2009 === "no" &&
    fuelType !== "electric";
  const usesEngineCapacity =
    fuelType !== "electric" &&
    (vehicleType === "motorcycle" || registeredBefore2009 === "yes");

  const result = useMemo<RoadLicenseOutput>(() => {
    return calculateRoadLicense({
      vehicleType,
      fuelType,
      manufactureYear,
      registeredBefore2009: registeredBefore2009 === "yes",
      engineCapacity,
      co2Emissions,
      co2Standard,
    });
  }, [
    vehicleType,
    fuelType,
    manufactureYear,
    registeredBefore2009,
    engineCapacity,
    co2Emissions,
    co2Standard,
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

            {/* Vehicle Type */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Vehicle Type
              </label>
              <ToggleGroup
                options={["car", "motorcycle"] as const}
                value={vehicleType}
                onChange={setVehicleType}
                labels={{ car: "🚗 Car", motorcycle: "🏍️ Motorcycle" }}
              />
            </div>

            {/* Fuel Type */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Fuel className="h-4 w-4 text-primary/70" />
                Fuel Type
              </label>
              <ToggleGroup
                options={
                  ["petrol", "diesel", "hybrid", "lpg", "electric"] as const
                }
                value={fuelType}
                onChange={setFuelType}
                labels={{
                  petrol: "⛽ Petrol",
                  diesel: "🛢️ Diesel",
                  hybrid: "🔋 Hybrid",
                  lpg: "🌿 LPG",
                  electric: "⚡ EV / PHEV",
                }}
              />
              <p className="text-xs text-muted-foreground">
                EV / PHEV covers electric and plug-in hybrid vehicles with at
                least 50 km electric range. Other hybrids are charged on CO2
                like petrol cars.
              </p>
            </div>

            {/* Year of manufacture */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary/70" />
                Year of Manufacture
              </label>
              <NumericInput
                value={manufactureYear}
                onChange={(v) => setManufactureYear(v === "" ? currentYear : v)}
                min={1950}
                max={currentYear}
                allowDecimals={false}
                className="h-14 text-xl px-5"
              />
              <p className="text-xs text-muted-foreground">
                Fees rise with age, counted in calendar years from the year of
                manufacture ({result.vehicleAge} years in {currentYear}).
              </p>
            </div>

            {/* Registered before 2009 */}
            {fuelType !== "electric" && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground/70">
                  First registered in Malta before 1 January 2009?
                </label>
                <ToggleGroup
                  options={["no", "yes"] as const}
                  value={registeredBefore2009}
                  onChange={setRegisteredBefore2009}
                  labels={{ no: "No (2009 or later)", yes: "Yes" }}
                />
              </div>
            )}

            {/* CO2 */}
            {usesCo2 && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-primary/70" />
                  CO2 Emissions (g/km)
                </label>
                <NumericInput
                  value={co2Emissions}
                  onChange={(v) => setCo2Emissions(v === "" ? 0 : v)}
                  min={0}
                  max={600}
                  allowDecimals={false}
                  suffix="g/km"
                  className="h-14 text-xl px-5"
                />
                <ToggleGroup
                  options={["wltp", "nedc"] as const}
                  value={co2Standard}
                  onChange={setCo2Standard}
                  labels={{ wltp: "WLTP figure", nedc: "NEDC figure" }}
                />
                <p className="text-xs text-muted-foreground">
                  Use the CO2 standard shown on your registration document. WLTP
                  bands are wider because WLTP figures are higher.
                </p>
              </div>
            )}

            {/* Engine Capacity */}
            {usesEngineCapacity && (
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
                <div className="flex flex-wrap gap-2">
                  {(vehicleType === "motorcycle"
                    ? [125, 350, 500, 800, 1000]
                    : [1300, 1449, 1500, 1800, 2000, 2500]
                  ).map((cc) => (
                    <button
                      key={cc}
                      onClick={() => setEngineCapacity(cc)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                        engineCapacity === cc
                          ? "bg-primary text-primary-foreground"
                          : "bg-background border border-border hover:bg-muted",
                      )}
                    >
                      {cc}cc
                    </button>
                  ))}
                </div>
              </div>
            )}
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
              <span className="font-semibold">Annual License Fee</span>
            </div>

            <div className="text-center py-6">
              <motion.div
                key={result.annualFee}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl md:text-6xl font-bold text-primary"
              >
                {formatCurrency(result.annualFee)}
              </motion.div>
              <p className="text-muted-foreground mt-2">
                About {formatCurrency(Math.round(result.monthlyEquivalent))} per
                month
              </p>
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">Band</span>
                <span className="font-semibold text-right">{result.band}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Table Fee (age {result.vehicleAge})
                </span>
                <span className="font-semibold">
                  {formatCurrency(result.tableFee)}
                </span>
              </div>
              {result.lpgDiscount > 0 && (
                <div className="flex justify-between items-center p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <span className="text-sm text-muted-foreground">
                    LPG Reduction (10%)
                  </span>
                  <span className="font-semibold text-green-600">
                    -{formatCurrency(result.lpgDiscount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Annual Total
                </span>
                <span className="font-semibold">
                  {formatCurrency(result.annualFee)}
                </span>
              </div>
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
                <Car className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">
                    Electric & Plug-in Hybrid Rate ⚡
                  </p>
                  <p className="text-muted-foreground text-xs">
                    No road licence fee for the first 6 years (years 0-5), then
                    €10 per year.
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
                  <li>Rates from Transport Malta SOPV 33 (1 January 2026)</li>
                  <li>
                    Diesel cars from 2009 assume particulate emissions up to
                    0.005 g/km; older diesels pay more
                  </li>
                  <li>Late renewal: €10 fine per month, up to €100</li>
                  <li>
                    Vintage, commercial and goods vehicles have separate rates
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
