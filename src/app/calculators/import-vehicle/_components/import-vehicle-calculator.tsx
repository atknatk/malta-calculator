"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Ship, Car, Fuel, Calendar, Euro, Globe, Info, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import { calculateImportVehicle, formatCurrency, type ImportVehicleOutput } from "@/utils/import-vehicle-calculator";

type FuelType = 'petrol' | 'diesel' | 'hybrid' | 'plugin_hybrid' | 'electric';
type Currency = 'EUR' | 'GBP' | 'USD' | 'JPY';

export function ImportVehicleCalculator() {
    const [purchasePrice, setPurchasePrice] = useState(20000);
    const [currency, setCurrency] = useState<Currency>("EUR");
    const [vehicleAge, setVehicleAge] = useState(3);
    const [co2Emissions, setCo2Emissions] = useState(130);
    const [fuelType, setFuelType] = useState<FuelType>("petrol");
    const [isEU, setIsEU] = useState(true);
    const [shippingCost, setShippingCost] = useState(500);
    const [isNew, setIsNew] = useState(false);

    const result = useMemo<ImportVehicleOutput>(() => {
        return calculateImportVehicle({
            purchasePrice, currency, vehicleAge,
            co2Emissions: fuelType === 'electric' ? 0 : co2Emissions,
            engineCapacity: 1600, fuelType, isEU, shippingCost, isNew
        });
    }, [purchasePrice, currency, vehicleAge, co2Emissions, fuelType, isEU, shippingCost, isNew]);

    return (
        <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <Ship className="h-4 w-4" />Transport Malta
                </div>
                <h1 className="font-cal text-3xl md:text-4xl font-bold">Import Vehicle Calculator</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">Calculate the total cost of importing a vehicle to Malta.</p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border/50 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-primary/10"><Car className="h-5 w-5 text-primary" /></div>
                            <span className="font-semibold">Vehicle Details</span>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/70">Purchase Price</label>
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
                                    {(['EUR', 'GBP', 'USD'] as const).map((c) => (
                                        <button key={c} onClick={() => setCurrency(c)} className={cn("px-3 h-14 text-sm font-medium transition-all", currency === c ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted")}>{c}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground/70">Origin</label>
                            <div className="flex gap-2">
                                <button onClick={() => setIsEU(true)} className={cn("flex-1 p-3 rounded-lg text-sm font-medium transition-all border", isEU ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-muted")}>🇪🇺 EU Country</button>
                                <button onClick={() => setIsEU(false)} className={cn("flex-1 p-3 rounded-lg text-sm font-medium transition-all border", !isEU ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-muted")}>🌍 Non-EU</button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground/70">Condition</label>
                            <div className="flex gap-2">
                                <button onClick={() => { setIsNew(true); setVehicleAge(0); }} className={cn("flex-1 p-3 rounded-lg text-sm font-medium transition-all border", isNew ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-muted")}>🆕 New</button>
                                <button onClick={() => setIsNew(false)} className={cn("flex-1 p-3 rounded-lg text-sm font-medium transition-all border", !isNew ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-muted")}>📦 Used</button>
                            </div>
                        </div>

                        {!isNew && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground/70">Vehicle Age: {vehicleAge} years</label>
                                <input type="range" min="1" max="15" value={vehicleAge} onChange={(e) => setVehicleAge(parseInt(e.target.value))} className="w-full accent-primary" />
                            </div>
                        )}

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground/70">Fuel Type</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['petrol', 'diesel', 'hybrid', 'plugin_hybrid', 'electric'] as const).map((f) => (
                                    <button key={f} onClick={() => setFuelType(f)} className={cn("p-2 rounded-lg text-xs font-medium transition-all border", fuelType === f ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-muted")}>
                                        {f === 'petrol' ? '⛽' : f === 'diesel' ? '🛢️' : f === 'hybrid' ? '🔋' : f === 'plugin_hybrid' ? '🔌' : '⚡'} {f.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {fuelType !== 'electric' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground/70">CO2: {co2Emissions} g/km</label>
                                <input type="range" min="50" max="300" value={co2Emissions} onChange={(e) => setCo2Emissions(parseInt(e.target.value))} className="w-full accent-primary" />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/70">Shipping Cost ({currency})</label>
                            <NumericInput
                                value={shippingCost}
                                onChange={(v) => setShippingCost(v === "" ? 0 : v)}
                                min={0}
                                allowDecimals={false}
                                className="h-12 px-4"
                            />
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-primary/20"><Euro className="h-5 w-5 text-primary" /></div>
                            <span className="font-semibold">Total On-Road Cost</span>
                        </div>
                        <div className="text-center py-6">
                            <motion.div key={result.totalCost} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-5xl md:text-6xl font-bold text-primary">{formatCurrency(result.totalCost)}</motion.div>
                            <p className="text-muted-foreground mt-2">Taxes & Fees: {formatCurrency(result.totalTaxesFees)}</p>
                        </div>
                        <div className="space-y-2">
                            {result.breakdown.map((item, index) => (
                                <div key={index} className={cn("flex justify-between items-center p-3 rounded-xl", item.category === 'tax' ? 'bg-amber-500/10' : item.category === 'fee' ? 'bg-blue-500/10' : 'bg-background/50')}>
                                    <span className="text-sm text-muted-foreground">{item.label}</span>
                                    <span className="font-semibold">{formatCurrency(item.amount)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 rounded-xl bg-background/50"><p className="text-sm text-muted-foreground">{result.description}</p></div>
                    </div>

                    {fuelType === 'electric' && (
                        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                            <div className="flex gap-3"><Leaf className="h-5 w-5 text-green-500" />
                                <div className="text-sm"><p className="font-medium">Electric Vehicle Benefits</p><p className="text-xs text-muted-foreground">No CO2 registration tax! Additional grants may be available.</p></div>
                            </div>
                        </div>
                    )}

                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <div className="flex gap-3"><Info className="h-5 w-5 text-blue-500" />
                            <div className="text-sm text-muted-foreground"><p className="font-medium text-foreground mb-1">Notes</p>
                                <ul className="list-disc list-inside text-xs space-y-1">
                                    <li>EU used vehicles: No VAT, No import duty</li>
                                    <li>Non-EU: 10% import duty + 18% VAT</li>
                                    <li>VRT inspection required for all imports</li>
                                    <li>Exchange rates are approximate</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
