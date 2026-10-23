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
  ExternalLink,
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
import type { Co2TestCycle } from "@/utils/malta-registration-tax";

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Inline slider+number-input that keeps the two in sync. Numeric input is
 * authoritative — slider just provides quick visual adjustment.
 */
function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  hint?: React.ReactNode;
}) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end gap-3">
        <label className="text-sm font-medium text-foreground/70">
          {label}
        </label>
        <div className="flex items-center gap-1">
          <NumericInput
            value={value}
            onChange={(v) => onChange(v === "" ? min : clamp(v))}
            min={min}
            max={max}
            allowDecimals={false}
            className="h-11 w-28 text-right text-base sm:text-sm px-2"
          />
          {suffix && (
            <span className="text-xs text-muted-foreground">{suffix}</span>
          )}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-primary"
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function ImportVehicleCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(20000);
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [modelYear, setModelYear] = useState(CURRENT_YEAR - 3);
  const [co2Emissions, setCo2Emissions] = useState(130);
  const [co2TestCycle, setCo2TestCycle] = useState<Co2TestCycle | null>(null);
  const [lengthMm, setLengthMm] = useState(4400);
  const [fuelType, setFuelType] = useState<FuelType>("petrol");
  const [isEU, setIsEU] = useState(true);
  const [shippingCost, setShippingCost] = useState(500);
  const [insuranceCost, setInsuranceCost] = useState(0);
  const [isNew, setIsNew] = useState(false);
  const [rvOverride, setRvOverride] = useState<number | null>(null);
  const [applyEvGrant, setApplyEvGrant] = useState(false);
  const [evGrantWithScrappage, setEvGrantWithScrappage] = useState(false);
  const [transferOfResidence, setTransferOfResidence] = useState(false);
  const [isLeftHandDrive, setIsLeftHandDrive] = useState(false);
  const [mileageKm, setMileageKm] = useState<number | null>(null);

  const result = useMemo<ImportVehicleOutput>(() => {
    return calculateImportVehicle({
      purchasePrice,
      currency,
      modelYear,
      co2Emissions: fuelType === "electric" ? 0 : co2Emissions,
      co2TestCycle: co2TestCycle ?? undefined,
      lengthMm,
      fuelType,
      isEU,
      shippingCost,
      insuranceCost,
      isNew,
      registrationValue: rvOverride ?? undefined,
      applyEvGrant,
      evGrantWithScrappage,
      transferOfResidence,
      isLeftHandDrive,
      mileageKm: mileageKm ?? undefined,
    });
  }, [
    purchasePrice,
    currency,
    modelYear,
    co2Emissions,
    co2TestCycle,
    lengthMm,
    fuelType,
    isEU,
    shippingCost,
    insuranceCost,
    isNew,
    rvOverride,
    applyEvGrant,
    evGrantWithScrappage,
    transferOfResidence,
    isLeftHandDrive,
    mileageKm,
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
          Transport Malta — SOPV 02 v38 (2026)
        </div>
        <h1 className="font-cal text-3xl md:text-4xl font-bold">
          Import Vehicle Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Estimate the total cost of importing a vehicle to Malta, including
          customs duty, VAT, the SOPV 02 CO2 + length registration tax, the
          non-EU minimum tax and vintage rules for cars ≥ 30 years old.
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
              {/* Mobilde alt alta: fiyat alanı tam genişlik, kurlar 4'lü grid */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <NumericInput
                    value={purchasePrice}
                    onChange={(v) => setPurchasePrice(v === "" ? 0 : v)}
                    min={0}
                    allowDecimals={false}
                    className="h-14 text-xl px-5"
                  />
                </div>
                <div className="grid grid-cols-4 sm:flex rounded-xl border border-border overflow-hidden">
                  {(["EUR", "GBP", "USD", "JPY"] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={cn(
                        "px-3 h-12 sm:h-14 text-sm font-medium transition-all",
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

            <SliderInput
              label="Model Year"
              value={modelYear}
              onChange={setModelYear}
              min={CURRENT_YEAR - 60}
              max={CURRENT_YEAR}
              hint={
                <>
                  {ageYears} year{ageYears === 1 ? "" : "s"} old · auto-detected
                  emission standard: <strong>{result.euroStandard}</strong>
                  {ageYears >= 30 && " · vintage-eligible"}
                </>
              }
            />

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
                      "min-h-11 p-2 rounded-lg text-xs font-medium transition-all border",
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
              <SliderInput
                label="CO2 Emissions"
                value={co2Emissions}
                onChange={setCo2Emissions}
                min={20}
                max={400}
                suffix="g/km"
                hint="From the vehicle's Certificate of Conformity (NEDC or WLTP)."
              />
            )}

            {fuelType !== "electric" && fuelType !== "plugin_hybrid" && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground/70">
                  CO2 Test Cycle on the CoC
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["wltp", "nedc"] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCo2TestCycle(c)}
                      className={cn(
                        "p-2.5 rounded-xl border text-sm font-medium transition-all",
                        result.co2TestCycle === c
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/50 bg-background/50 hover:border-primary/50",
                      )}
                    >
                      {c.toUpperCase()}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Rate applied: {result.co2RatePercent}% per g/km × RV
                  {result.co2TestCycle === "nedc" &&
                    ` (NEDC, ${result.euroStandard})`}
                  . WLTP rates need an original CoC with WLTP values (most cars
                  from 2021).
                </p>
              </div>
            )}

            <SliderInput
              label="Vehicle Length"
              value={lengthMm}
              onChange={setLengthMm}
              min={3000}
              max={5500}
              step={10}
              suffix="mm"
              hint="City car ≈ 3 700 · Saloon ≈ 4 400 · SUV ≈ 4 700+"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="space-y-2 p-4 rounded-xl bg-background/60 border border-border/50">
              <div className="flex justify-between items-end gap-3">
                <label className="text-sm font-medium text-foreground/70">
                  Registration Value (RV){" "}
                  <span className="text-muted-foreground font-normal">
                    — optional
                  </span>
                </label>
                <NumericInput
                  value={rvOverride ?? ""}
                  onChange={(v) => setRvOverride(v === "" || v <= 0 ? null : v)}
                  min={0}
                  allowDecimals={false}
                  placeholder={result.registrationValueUsed.toString()}
                  className="h-11 w-32 text-right text-base sm:text-sm px-2"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Leave blank to auto-derive ({" "}
                {formatCurrency(result.registrationValueUsed)} used). For exact
                RegTax, look up your vehicle on{" "}
                <a
                  href="https://www.valuation.vehicleregistration.gov.mt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary inline-flex items-center gap-0.5 underline"
                >
                  valuation.vehicleregistration.gov.mt
                  <ExternalLink className="h-3 w-3" />
                </a>{" "}
                and paste the RV here.
              </p>
            </div>

            <div className="space-y-3 p-4 rounded-xl bg-background/60 border border-border/50">
              <p className="text-sm font-medium text-foreground/70">
                Special cases
              </p>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={transferOfResidence}
                  onChange={(e) => setTransferOfResidence(e.target.checked)}
                  className="mt-0.5 accent-primary"
                />
                <div className="text-xs">
                  <div className="font-medium text-foreground">
                    Transfer of Residence (TORE) — full RegTax exemption
                  </div>
                  <div className="text-muted-foreground">
                    Eligible when you're moving residence to Malta, you owned
                    the vehicle ≥ 24 months and lived outside Malta ≥ 24 months.
                    Form VEH 007, €100 fee. Registration tax becomes due if you
                    later sell the vehicle in Malta.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLeftHandDrive}
                  onChange={(e) => setIsLeftHandDrive(e.target.checked)}
                  className="mt-0.5 accent-primary"
                />
                <div className="text-xs">
                  <div className="font-medium text-foreground">
                    Left-hand drive (LHD)
                  </div>
                  <div className="text-muted-foreground">
                    Legal in Malta but Malta is RHD. Affects parking,
                    overtaking, and may need headlight adjustment for the
                    roadworthiness test.
                  </div>
                </div>
              </label>

              <div className="flex items-end gap-3 pt-1">
                <div className="flex-1">
                  <label className="text-xs font-medium text-foreground/70 block mb-1">
                    Odometer (km) — optional, drives roadworthiness test rule
                  </label>
                  <NumericInput
                    value={mileageKm ?? ""}
                    onChange={(v) =>
                      setMileageKm(v === "" || v <= 0 ? null : v)
                    }
                    min={0}
                    allowDecimals={false}
                    placeholder="e.g. 80000"
                    className="h-11 px-3 text-base sm:text-sm"
                  />
                </div>
                <p className="text-xs text-muted-foreground pb-1">
                  Test needed: &gt; 4 y or &gt; 160 000 km
                </p>
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
          {result.toreApplied && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex gap-3">
                <Sparkles className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                    Transfer of Residence — Registration Tax waived
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Form VEH 007 waives registration tax for one car or
                    motorcycle when moving residence to Malta. Apply within 30
                    days of arrival (€100 fee on approval). If you later sell
                    the vehicle in Malta,{" "}
                    <strong>registration tax becomes due</strong> on its market
                    value.
                  </p>
                </div>
              </div>
            </div>
          )}

          {result.vintageEligible && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex gap-3">
                <Sparkles className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-amber-700 dark:text-amber-400">
                    {result.vintageFullExemption
                      ? "Vintage: 0 % registration tax (50+ years)"
                      : "Vintage-eligible (30–49 years)"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Silver-on-black plates · annual road licence waived (€8
                    admin) · max 3 000 km/year under 50 years · certified by
                    Transport Malta&apos;s Vintage Vehicle Classification
                    Committee after inspection.
                  </p>
                  {result.vintageTaxRange && (
                    <p className="text-xs mt-2 p-2 rounded bg-amber-500/10 border border-amber-500/20">
                      <strong>Vintage registration tax:</strong> 25.5 %–37.5 %
                      of the estimated value depending on engine size —{" "}
                      <strong>
                        {formatCurrency(result.vintageTaxRange.min)} –{" "}
                        {formatCurrency(result.vintageTaxRange.max)}
                      </strong>
                      . The total uses the mid-point.
                    </p>
                  )}
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
              <p className="text-xs text-muted-foreground/80 mt-1">
                RV used in formula:{" "}
                <strong>{formatCurrency(result.registrationValueUsed)}</strong>{" "}
                {result.registrationValueWasManual ? "(manual)" : "(estimated)"}
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

          {result.isFullEvExempt && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 space-y-3">
              <div className="flex gap-3">
                <Leaf className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm space-y-2">
                  <p className="font-medium">
                    {fuelType === "electric"
                      ? "Battery EV — full Malta incentive package"
                      : "Plug-in Hybrid — full incentive (if electric range ≥ 50 km)"}
                  </p>
                  <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                    <li>
                      <strong>RegTax: €0</strong> — exempt from registration tax
                    </li>
                    <li>
                      <strong>Annual road tax: €0 for years 0–5</strong>, then
                      €10/year (~{formatCurrency(result.fiveYearRoadTaxSavings)}{" "}
                      of circulation-tax savings over 5 y vs an ICE equivalent)
                    </li>
                    {fuelType === "electric" && (
                      <li>
                        <strong>
                          Government grant: up to{" "}
                          {formatCurrency(isNew ? 9000 : 4000)}
                        </strong>{" "}
                        (Transport Malta 2026 scheme, see toggle below)
                      </li>
                    )}
                  </ul>
                  {fuelType === "plugin_hybrid" && (
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      ⚠ PHEV exemption applies only if electric-only range is ≥
                      50 km. Below that the standard CO2 + length RegTax kicks
                      in.
                    </p>
                  )}
                </div>
              </div>

              {fuelType === "electric" && (
                <div className="space-y-2 pt-3 border-t border-green-500/20">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyEvGrant}
                      onChange={(e) => setApplyEvGrant(e.target.checked)}
                      className="mt-0.5 accent-primary"
                    />
                    <div className="text-xs">
                      <div className="font-medium text-foreground">
                        Apply Transport Malta EV grant
                      </div>
                      <div className="text-muted-foreground">
                        {isNew
                          ? "€8,000 for a new BEV up to €40,000, €6,000 for €40,000–€100,000."
                          : "€4,000 for a used EV first registered abroad (EU/UK) up to 3 months before; €3,000 for 3–6 months. Keep 36 months."}
                      </div>
                    </div>
                  </label>

                  {applyEvGrant && isNew && (
                    <label className="flex items-start gap-2 cursor-pointer ml-6">
                      <input
                        type="checkbox"
                        checked={evGrantWithScrappage}
                        onChange={(e) =>
                          setEvGrantWithScrappage(e.target.checked)
                        }
                        className="mt-0.5 accent-primary"
                      />
                      <div className="text-xs">
                        <div className="font-medium text-foreground">
                          + Scrappage bonus ({formatCurrency(1000)})
                        </div>
                        <div className="text-muted-foreground">
                          Requires scrapping a car at least 10 years old at an
                          Authorised Treatment Facility (€500 if its licence
                          expired more than 3 months earlier). Gozo residents
                          get a further €1,000.
                        </div>
                      </div>
                    </label>
                  )}
                </div>
              )}
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
                    Registration tax: SOPV 02 v38 formula —{" "}
                    <code>
                      (CO2 × RV × CO2-rate) + (Length × RV × Length-rate)
                    </code>
                  </li>
                  <li>
                    CO2 rate from the WLTP or NEDC table (NEDC by Euro
                    standard); hybrids get a 30 % CO2 reduction. Default RV is
                    the purchase price; for the official figure use{" "}
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
                    Non-EU: 10 % customs duty on CIF + 18 % VAT on (CIF + duty).
                    Used non-EU cars over 5 years old pay at least the SOPV 02
                    minimum tax. No VAT on registration tax.
                  </li>
                  <li>
                    Vintage (VEH 15): ≥30 y eligible, 30–49 y pay 25.5 %–37.5 %
                    of the estimated value, ≥50 y pay 0 %.
                  </li>
                  <li>
                    Fees: €15 registration, €70 plates, €55 inspection for used
                    non-EU imports, roadworthiness test max €30.27 (S.L. 65.15)
                    when required.
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
