"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Calendar,
  BookOpen,
  Car,
  Info,
  Stethoscope,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  calculateDriversLicenseFees,
  formatCurrency,
  type DriversLicenseOutput,
} from "@/utils/drivers-license-calculator";

type LicenseType =
  | "new"
  | "renewal"
  | "international"
  | "replacement"
  | "category_upgrade";
type Category =
  | "A"
  | "A1"
  | "A2"
  | "AM"
  | "B"
  | "BE"
  | "C"
  | "C1"
  | "CE"
  | "D"
  | "D1"
  | "DE";
type ValidityPeriod = 1 | 5 | 10;

export function DriversLicenseCalculator() {
  const [licenseType, setLicenseType] = useState<LicenseType>("new");
  const [age, setAge] = useState(25);
  const [category, setCategory] = useState<Category>("B");
  const [validityPeriod, setValidityPeriod] = useState<ValidityPeriod>(10);
  const [includeTheoryTest, setIncludeTheoryTest] = useState(true);
  const [includePracticalTest, setIncludePracticalTest] = useState(true);

  const result = useMemo<DriversLicenseOutput>(() => {
    return calculateDriversLicenseFees({
      licenseType,
      age,
      category,
      validityPeriod,
      includeTheoryTest,
      includePracticalTest,
      isFirstLicense: licenseType === "new",
    });
  }, [
    licenseType,
    age,
    category,
    validityPeriod,
    includeTheoryTest,
    includePracticalTest,
  ]);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <CreditCard className="h-4 w-4" />
          Transport Malta
        </div>
        <h1 className="font-cal text-3xl md:text-4xl font-bold">
          Driver&apos;s License Fees
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Calculate the total cost of obtaining or renewing your driving license
          in Malta.
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
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">License Details</span>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                Application Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  ["new", "renewal", "international", "replacement"] as const
                ).map((type) => (
                  <button
                    key={type}
                    onClick={() => setLicenseType(type)}
                    className={cn(
                      "p-3 rounded-lg text-sm font-medium transition-all border",
                      licenseType === type
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:bg-muted",
                    )}
                  >
                    {type === "new"
                      ? "🆕 New"
                      : type === "renewal"
                        ? "🔄 Renew"
                        : type === "international"
                          ? "🌍 IDP"
                          : "📋 Replace"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70">
                License Category
              </label>
              <div className="grid grid-cols-5 gap-2">
                {(
                  [
                    "AM",
                    "A1",
                    "A2",
                    "A",
                    "B",
                    "BE",
                    "C1",
                    "C",
                    "D1",
                    "D",
                  ] as Category[]
                ).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "p-2 rounded-lg text-sm font-medium transition-all border",
                      category === cat
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:bg-muted",
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">
                Your Age: {age}
              </label>
              <input
                type="range"
                min="16"
                max="80"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            {(licenseType === "new" || licenseType === "renewal") && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground/70">
                  Validity
                </label>
                <div className="flex gap-2">
                  {([1, 5, 10] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setValidityPeriod(v)}
                      className={cn(
                        "flex-1 p-3 rounded-lg text-sm font-medium transition-all border",
                        validityPeriod === v
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border hover:bg-muted",
                      )}
                    >
                      {v} Year{v > 1 ? "s" : ""}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {licenseType === "new" && (
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-background border cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeTheoryTest}
                    onChange={(e) => setIncludeTheoryTest(e.target.checked)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm">Theory Test (€30)</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl bg-background border cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includePracticalTest}
                    onChange={(e) => setIncludePracticalTest(e.target.checked)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm">Practical Test</span>
                </label>
              </div>
            )}
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
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">Total Cost</span>
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
                Valid for: <strong>{result.validity}</strong>
              </p>
            </div>
            <div className="space-y-3">
              {result.breakdown.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 rounded-xl bg-background/50"
                >
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="font-semibold">
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
          {age >= 65 && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex gap-3">
                <Stethoscope className="h-5 w-5 text-amber-500" />
                <div className="text-sm">
                  <p className="font-medium">Medical Certificate Required</p>
                  <p className="text-xs text-muted-foreground">
                    Applicants 65+ need medical certificate. Max validity:{" "}
                    {age >= 70 ? "1 year" : "5 years"}.
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
                  <li>Book tests online at Transport Malta</li>
                  <li>IDP valid for 12 months</li>
                  <li>Medical required for C, D categories</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
