"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Ship,
  Car,
  Euro,
  Info,
  Leaf,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  calculateImportVehicle,
  formatCurrency,
  type ImportVehicleOutput,
  type FuelType,
  type Currency,
} from "@/utils/import-vehicle-calculator";

const CURRENT_YEAR = new Date().getFullYear();

export function ImportVehicleCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(20000);
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [modelYear, setModelYear] = useState(CURRENT_YEAR - 3);
  const [co2Emissions, setCo2Emissions] = useState(130);
  const [lengthMm, setLengthMm] = useState(4400);
  const [fuelType, setFuelType] = useState<FuelType>("petrol");
  const [isEU, setIsEU] = useState(true);
  const [shippingCost, setShippingCost] = useState(500);
  const [insuranceCost, setInsuranceCost] = useState(0);
  const [isNew, setIsNew] = useState(false);

  const result = useMemo<ImportVehicleOutput>(() => {
    return calculateImportVehicle({
      purchasePrice,
      currency,
      modelYear,
      co2Emissions: fuelType === "electric" ? 0 : co2Emissions,
      lengthMm,
      fuelType,
      isEU,
      shippingCost,
      insuranceCost,
      isNew,
    });
  }, [
    purchasePrice,
    currency,
    modelYear,
    co2Emissions,
    lengthMm,
    fuelType,
    isEU,
    shippingCost,
    insuranceCost,
    isNew,
  ]);

  const ageYears = CURRENT_YEAR - modelYear;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Ship className="h-4 w-4" />
          Transport Malta — SOPV-02 (2026)
        </div>
        <h1 className="font-cal text-3xl md:text-4xl font-bold">
          Import Vehicle Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Estimate the total cost of importing a vehicle to Malta, including
          customs duty, VAT, the SOPV-02 CO2 + length registration tax, and
          vintage concessions for cars ≥ 30 years old.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">
                Purchase Price
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <NumericInput
                    value={purchasePrice}
                    onChange={(v) => setPurchasePrice(v === "" ? 0 : v)}
                    min={0}
                    allowDecimals={false}
                    className="h-14 text-xl px-5"
                  />
                </div>
                <div className="flex rounded-xl border border-border overflow-hidden">
                  {(["EUR", "GBP", "USD", "JPY"] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={cn(
                        "px-3 h-14 text-sm font-medium transition-all",
                        currency === c
                          ? "bg-primary text-primary-foreground"
                          : "bg-background hover:bg-muted",
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Origin
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEU(true)}
                  className={cn(
                    "flex-1 p-3 rounded-lg text-sm font-medium transition-all border",
                    isEU
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:bg-muted",
                  )}
                >
                  🇪🇺 EU Country
                </button>
                <button
                  onClick={() => setIsEU(false)}
                  className={cn(
                    "flex-1 p-3 rounded-lg text-sm font-medium transition-all border",
                    !isEU
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:bg-muted",
                  )}
                >
                  🌍 Non-EU (Japan, UK, US, CH…)
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Condition
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsNew(true);
                    setModelYear(CURRENT_YEAR);
                  }}
                  className={cn(
                    "flex-1 p-3 rounded-lg text-sm font-medium transition-all border",
                    isNew
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:bg-muted",
                  )}
                >
                  🆕 New (&lt; 6 mo / 6 000 km)
                </button>
                <button
                  onClick={() => setIsNew(false)}
                  className={cn(
                    "flex-1 p-3 rounded-lg text-sm font-medium transition-all border",
                    !isNew
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:bg-muted",
                  )}
                >
                  📦 Used
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">
                Model Year: {modelYear}{" "}
                <span className="text-muted-foreground">
                  ({ageYears} year{ageYears === 1 ? "" : "s"} old —{" "}
                  {result.euroStandard})
                </span>
              </label>
              <input
                type="range"
                min={CURRENT_YEAR - 60}
                max={CURRENT_YEAR}
                value={modelYear}
                onChange={(e) => setModelYear(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{CURRENT_YEAR - 60}</span>
                <span>{CURRENT_YEAR - 30} (vintage threshold)</span>
                <span>{CURRENT_YEAR}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Fuel Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    "petrol",
                    "diesel",
                    "hybrid",
                    "plugin_hybrid",
                    "electric",
                  ] as const
                ).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFuelType(f)}
                    className={cn(
                      "p-2 rounded-lg text-xs font-medium transition-all border",
                      fuelType === f
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:bg-muted",
                    )}
                  >
                    {f === "petrol"
                      ? "⛽"
                      : f === "diesel"
                        ? "🛢️"
                        : f === "hybrid"
                          ? "🔋"
                          : f === "plugin_hybrid"
                            ? "🔌"
                            : "⚡"}{" "}
                    {f.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {fuelType !== "electric" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/70">
                  CO2: {co2Emissions} g/km
                </label>
                <input
                  type="range"
                  min={50}
                  max={400}
                  value={co2Emissions}
                  onChange={(e) => setCo2Emissions(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">
                Vehicle Length: {lengthMm} mm
              </label>
              <input
                type="range"
                min={3000}
                max={5500}
                step={10}
                value={lengthMm}
                onChange={(e) => setLengthMm(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>City car</span>
                <span>Saloon (~4400)</span>
                <span>SUV / 7-seat</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/70">
                  Shipping ({currency})
                </label>
                <NumericInput
                  value={shippingCost}
                  onChange={(v) => setShippingCost(v === "" ? 0 : v)}
                  min={0}
                  allowDecimals={false}
                  className="h-12 px-4"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/70">
                  Transit Insurance ({currency})
                </label>
                <NumericInput
                  value={insuranceCost}
                  onChange={(v) => setInsuranceCost(v === "" ? 0 : v)}
                  min={0}
                  allowDecimals={false}
                  className="h-12 px-4"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {result.registrationBlocked && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-red-600 dark:text-red-400">
                    Normal registration not permitted
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Under SOPV-02 / Directive 2007/46/EC, Malta only registers
                    vehicles meeting Euro 5b/6b or higher emission standards.
                    Detected: <strong>{result.euroStandard}</strong>. The
                    vintage / classic path (FMVA + Form VEH 15) is the only
                    available route for this vehicle.
                  </p>
                </div>
              </div>
            </div>
          )}

          {(result.vintageEligible ||
            result.vintage50Discount ||
            result.vintageFullExemption) && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex gap-3">
                <Sparkles className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-amber-700 dark:text-amber-400">
                    {result.vintageFullExemption
                      ? "Full vintage exemption (50+ years)"
                      : result.vintage50Discount
                        ? "50 % vintage concession (35–50 years)"
                        : "Vintage-eligible (30+ years)"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Black plates · €0 annual road licence · €8 admin/year · max
                    3 000 km/year · must remain in original condition ·
                    re-certified every 5 years.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/20">
                <Euro className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">
                Estimated Total On-Road Cost
              </span>
            </div>
            <div className="text-center py-6">
              <motion.div
                key={result.totalCost}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl md:text-6xl font-bold text-primary"
              >
                {formatCurrency(result.totalCost)}
              </motion.div>
              <p className="text-muted-foreground mt-2">
                Taxes & Fees: {formatCurrency(result.totalTaxesFees)}
              </p>
            </div>
            <div className="space-y-2">
              {result.breakdown
                .filter((item) => item.category !== "info")
                .map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex justify-between items-start p-3 rounded-xl",
                      item.category === "tax"
                        ? "bg-amber-500/10"
                        : item.category === "fee"
                          ? "bg-blue-500/10"
                          : "bg-background/50",
                    )}
                  >
                    <div className="flex-1 pr-2">
                      <span className="text-sm text-muted-foreground">
                        {item.label}
                      </span>
                      {item.note && (
                        <p className="text-xs text-muted-foreground/70 mt-0.5">
                          {item.note}
                        </p>
                      )}
                    </div>
                    <span className="font-semibold whitespace-nowrap">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
            </div>
            <div className="p-4 rounded-xl bg-background/50">
              <p className="text-sm text-muted-foreground">
                {result.description}
              </p>
            </div>
          </div>

          {result.warnings.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm space-y-2">
                  <p className="font-medium text-foreground">
                    Things to verify
                  </p>
                  <ul className="list-disc list-outside ml-4 text-xs text-muted-foreground space-y-1">
                    {result.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {fuelType === "electric" && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex gap-3">
                <Leaf className="h-5 w-5 text-green-500" />
                <div className="text-sm">
                  <p className="font-medium">Electric Vehicle Benefits</p>
                  <p className="text-xs text-muted-foreground">
                    No CO2 component on registration tax. Additional grants may
                    be available from Transport Malta.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-500" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  Methodology &amp; Sources
                </p>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li>
                    Registration tax: SOPV-02 formula —{" "}
                    <code>
                      (CO2 × RV × CO2-rate) + (Length × RV × Length-rate)
                    </code>
                  </li>
                  <li>
                    Registration Value (RV) is approximated with CIF + duty +
                    VAT; the official RV comes from{" "}
                    <a
                      href="https://www.valuation.vehicleregistration.gov.mt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      valuation.vehicleregistration.gov.mt
                    </a>
                    .
                  </li>
                  <li>
                    Non-EU: 10 % customs duty on CIF + 18 % VAT on (CIF + duty)
                    + 18 % VAT on registration tax.
                  </li>
                  <li>
                    Vintage rules: ≥30 y eligible (FMVA / VEH 15), 35–50 y → 50
                    % RegTax discount, ≥50 y → zero RegTax.
                  </li>
                  <li>
                    All vehicles must pass VRT and meet Malta minimum emission
                    standard (Euro 5b/6b for normal registration).
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
