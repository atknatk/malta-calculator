"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Car,
  Calendar,
  Info,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  calculateVRT,
  formatCurrency,
  type VRTOutput,
} from "@/utils/vrt-calculator";

type VehicleType =
  | "car"
  | "motorcycle"
  | "commercial_light"
  | "commercial_heavy"
  | "bus"
  | "trailer";

export function VRTCalculator() {
  const [vehicleType, setVehicleType] = useState<VehicleType>("car");
  const [vehicleAge, setVehicleAge] = useState(5);
  const [isRetest, setIsRetest] = useState(false);

  const result = useMemo<VRTOutput>(() => {
    return calculateVRT({ vehicleType, vehicleAge, isRetest });
  }, [vehicleType, vehicleAge, isRetest]);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <ClipboardCheck className="h-4 w-4" />
          Transport Malta
        </div>
        <h1 className="font-cal text-3xl md:text-4xl font-bold">
          VRT Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Calculate your Vehicle Roadworthiness Test (MOT) fees in Malta.
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

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Vehicle Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { value: "car", label: "🚗 Car" },
                    { value: "motorcycle", label: "🏍️ Motorcycle" },
                    { value: "commercial_light", label: "🚐 Light Van" },
                    { value: "commercial_heavy", label: "🚚 Heavy Lorry" },
                    { value: "bus", label: "🚌 Bus" },
                    { value: "trailer", label: "🚛 Trailer" },
                  ] as const
                ).map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setVehicleType(type.value as VehicleType)}
                    className={cn(
                      "p-3 rounded-lg text-sm font-medium transition-all border",
                      vehicleType === type.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:bg-muted",
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">
                Vehicle Age: {vehicleAge} years
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={vehicleAge}
                onChange={(e) => setVehicleAge(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>New</span>
                <span>20 years</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Test Type
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsRetest(false)}
                  className={cn(
                    "flex-1 p-3 rounded-lg text-sm font-medium transition-all border",
                    !isRetest
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:bg-muted",
                  )}
                >
                  Initial Test
                </button>
                <button
                  onClick={() => setIsRetest(true)}
                  className={cn(
                    "flex-1 p-3 rounded-lg text-sm font-medium transition-all border",
                    isRetest
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:bg-muted",
                  )}
                >
                  Re-test
                </button>
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
          <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/20">
                <ClipboardCheck className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">
                {isRetest ? "Re-test" : "VRT"} Fee
              </span>
            </div>
            <div className="text-center py-6">
              <motion.div
                key={result.testFee}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl md:text-6xl font-bold text-primary"
              >
                {formatCurrency(result.testFee)}
              </motion.div>
              {!isRetest && (
                <p className="text-muted-foreground mt-2">
                  Re-test fee: {formatCurrency(result.retestFee)}
                </p>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                <span className="text-sm text-muted-foreground">
                  Test Frequency
                </span>
                <span className="font-semibold">{result.frequency}</span>
              </div>
              {result.nextTestDue > 0 && (
                <div className="flex justify-between items-center p-3 rounded-xl bg-background/50">
                  <span className="text-sm text-muted-foreground">
                    Next Test Due
                  </span>
                  <span className="font-semibold">
                    {result.nextTestDue} months
                  </span>
                </div>
              )}
            </div>
            <div className="p-4 rounded-xl bg-background/50">
              <p className="text-sm text-muted-foreground">
                {result.description}
              </p>
            </div>
          </div>

          {vehicleAge < 4 &&
            (vehicleType === "car" || vehicleType === "motorcycle") && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="flex gap-3">
                  <Calendar className="h-5 w-5 text-green-500" />
                  <div className="text-sm">
                    <p className="font-medium">No VRT Required Yet</p>
                    <p className="text-xs text-muted-foreground">
                      Cars and motorcycles don&apos;t need VRT until 4 years
                      old.
                    </p>
                  </div>
                </div>
              </div>
            )}

          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-500" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Notes</p>
                <ul className="list-disc list-inside text-xs space-y-1">
                  {result.notes.slice(0, 4).map((note, i) => (
                    <li key={i}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
