/**
 * Malta Vehicle Registration Tax Calculator (M1 binek otomobil)
 *
 * Transport Malta SOPV 02 v38 (Ocak 2026) formülü:
 *   RegTax = (CO2 × RV × CO2 oranı%) + (Uzunluk × RV × uzunluk oranı%)
 * Tablolar ve kurallar: ./malta-registration-tax.ts
 */

import {
  calculateM1RegistrationTax,
  euroGapFromStandard,
  getNonEuMinimumTax,
  type Co2TestCycle,
} from "./malta-registration-tax";

export interface VehicleRegistrationTaxInput {
  /** CO2 emissions (g/km) from the Certificate of Conformity */
  co2Emissions: number;
  /** CO2 test cycle shown on the CoC */
  co2TestCycle: Co2TestCycle;
  /** Euro emission standard (1–6) — only affects NEDC rates */
  euroStandard: number;
  /** Vehicle length in mm */
  lengthMm: number;
  /** Vehicle age in years from year of manufacture */
  vehicleAge: number;
  fuelType: "petrol" | "diesel" | "hybrid" | "plugin_hybrid" | "electric";
  /** Registration Value in EUR (new: invoice/CIF; used: TM valuation) */
  vehicleValue: number;
  /** Imported from an EU country */
  isEU: boolean;
}

export interface VehicleRegistrationTaxOutput {
  /** Registration tax + customs duty + VAT */
  totalTax: number;
  /** Registration tax only */
  registrationTax: number;
  co2Tax: number;
  lengthTax: number;
  co2RatePercent: number;
  lengthRatePercent: number;
  /** Non-EU minimum tax applied instead of the formula */
  minimumTaxApplied: boolean;
  importDuty: number;
  vat: number;
  description: string;
  breakdown: { label: string; amount: number; isDiscount?: boolean }[];
}

const VAT_RATE = 0.18;
const NON_EU_IMPORT_DUTY_RATE = 0.1;

export function calculateVehicleRegistrationTax(
  input: VehicleRegistrationTaxInput,
): VehicleRegistrationTaxOutput {
  const {
    co2Emissions,
    co2TestCycle,
    euroStandard,
    lengthMm,
    vehicleAge,
    fuelType,
    vehicleValue,
    isEU,
  } = input;

  const breakdown: { label: string; amount: number; isDiscount?: boolean }[] =
    [];

  const formula = calculateM1RegistrationTax({
    co2: co2Emissions,
    lengthMm,
    registrationValue: vehicleValue,
    fuelType,
    testCycle: co2TestCycle,
    euroGap: euroGapFromStandard(euroStandard),
    // DPF'siz dizeller (Euro 4 ve öncesi) PM > 0.005 g/km
    dieselHighPm: fuelType === "diesel" && euroStandard <= 4,
  });

  let registrationTax = formula.total;
  let minimumTaxApplied = false;

  if (formula.exempt) {
    breakdown.push({ label: "Registration Tax (exempt)", amount: 0 });
  } else {
    breakdown.push({
      label: `CO2 component (${formula.adjustedCo2} g/km × ${formula.co2RatePercent}%)`,
      amount: formula.co2Tax,
    });
    breakdown.push({
      label: `Length component (${lengthMm} mm × ${formula.lengthRatePercent}%)`,
      amount: formula.lengthTax,
    });

    // AB dışı (UK dahil), 5 yaşından büyük kullanılmış araç: minimum vergi
    if (!isEU && vehicleAge > 5) {
      const minTax = getNonEuMinimumTax(formula.adjustedCo2, vehicleAge);
      if (minTax > registrationTax) {
        breakdown.push({
          label: "Top-up to non-EU minimum tax",
          amount: minTax - registrationTax,
        });
        registrationTax = minTax;
        minimumTaxApplied = true;
      }
    }
  }

  let importDuty = 0;
  if (!isEU) {
    importDuty = vehicleValue * NON_EU_IMPORT_DUTY_RATE;
    breakdown.push({ label: "Non-EU Customs Duty (10%)", amount: importDuty });
  }

  // KDV: AB dışı her zaman; AB içi yalnızca yeni araç ("new means of transport")
  let vat = 0;
  if (vehicleAge === 0 || !isEU) {
    vat = (vehicleValue + importDuty) * VAT_RATE;
    breakdown.push({ label: "VAT (18%)", amount: vat });
  }

  const totalTax = registrationTax + importDuty + vat;

  let description = "";
  if (fuelType === "electric") {
    description =
      "Battery electric vehicles are exempt from registration tax in Malta.";
  } else if (fuelType === "plugin_hybrid") {
    description =
      "Plug-in hybrids with an electric-only range of at least 50 km are exempt from registration tax.";
  } else {
    description = `Registration tax = (${formula.adjustedCo2} g/km × €${vehicleValue.toLocaleString("en-MT")} × ${formula.co2RatePercent}%) + (${lengthMm} mm × €${vehicleValue.toLocaleString("en-MT")} × ${formula.lengthRatePercent}%), using the ${co2TestCycle.toUpperCase()} table.`;
    if (fuelType === "hybrid") {
      description += " Hybrid CO2 reduced by 30% first.";
    }
    if (minimumTaxApplied) {
      description +=
        " The non-EU minimum tax for used cars over 5 years old is higher, so it applies.";
    }
  }
  if (vat > 0) {
    description +=
      " VAT is charged on the vehicle value (plus duty), not on the registration tax.";
  }

  return {
    totalTax: Math.round(totalTax),
    registrationTax: Math.round(registrationTax),
    co2Tax: formula.co2Tax,
    lengthTax: formula.lengthTax,
    co2RatePercent: formula.co2RatePercent,
    lengthRatePercent: formula.lengthRatePercent,
    minimumTaxApplied,
    importDuty: Math.round(importDuty),
    vat: Math.round(vat),
    description,
    breakdown,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-MT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getVehicleRegistrationTaxInfo() {
  return {
    vatRate: VAT_RATE * 100,
    importDutyRate: NON_EU_IMPORT_DUTY_RATE * 100,
  };
}
