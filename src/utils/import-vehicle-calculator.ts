/**
 * Malta Import Vehicle Calculator
 *
 * SOPV 02 (Transport Malta) M1 registration-tax formülü + ithalattaki
 * gümrük / KDV zinciri.
 *
 * Kaynaklar (Ekim 2026'da doğrulandı):
 *   - Transport Malta SOPV 02 v38 (Ocak 2026) — RegTax tabloları, minimum
 *     vergi, ücretler (bkz. ./malta-registration-tax.ts)
 *   - S.L. 65.15 Motor Vehicle Roadworthiness Test Regulations — VRT ücreti
 *   - Transport Malta "Registering a Vehicle — Documents required" — ithalatta
 *     VRT gereklilikleri, 30 gün kuralı
 *   - Transport Malta Grant Schemes 2026 (new EV / used EV)
 *   - finance.gov.mt — Transfer of Residence (TORE)
 *   - Transport Malta VEH 15 — vintage sertifikasyonu (1 Eylül 2025'ten beri
 *     Vintage Vehicle Classification Committee)
 *
 * Not: Resmi Registration Value (RV) yalnızca
 * valuation.vehicleregistration.gov.mt üzerinden alınabilir. Kullanıcı RV
 * girmezse satın alma fiyatı kullanılır (kullanılmış araçta TM değerlemesi
 * Malta piyasa değeridir, yaşı zaten yansıtır — ayrıca amortisman uygulanmaz).
 */

import {
  calculateM1RegistrationTax,
  euroGapFromStandard,
  euroStandardFromYear,
  getNonEuMinimumTax,
  type Co2TestCycle,
} from "./malta-registration-tax";

export type FuelType =
  | "petrol"
  | "diesel"
  | "hybrid"
  | "plugin_hybrid"
  | "electric";
export type Currency = "EUR" | "GBP" | "USD" | "JPY";

export interface ImportVehicleInput {
  /** Purchase price in original currency */
  purchasePrice: number;
  currency: Currency;
  /** Model year (e.g. 1994) */
  modelYear: number;
  /** CO2 emissions in g/km as shown on the Certificate of Conformity */
  co2Emissions: number;
  /**
   * CO2 test cycle on the CoC. WLTP rates need an original CoC showing WLTP
   * values. Default: WLTP for model year 2021+, NEDC before.
   */
  co2TestCycle?: Co2TestCycle;
  /** Vehicle length in mm (typical: 4200–4700 for saloons) */
  lengthMm: number;
  fuelType: FuelType;
  /** True if imported from an EU country */
  isEU: boolean;
  /** Shipping cost in same currency as purchasePrice */
  shippingCost: number;
  /** Insurance during transit (same currency); optional */
  insuranceCost?: number;
  /** New means of transport (≤ 6 months since first use or ≤ 6,000 km) */
  isNew: boolean;
  /**
   * Optional manual Registration Value (RV) override in EUR, from
   * valuation.vehicleregistration.gov.mt. Defaults to the purchase price.
   */
  registrationValue?: number;
  /** Apply the Transport Malta 2026 EV grant (BEV only) */
  applyEvGrant?: boolean;
  /** New-EV scrappage top-up (car ≥ 10 years old scrapped at an ATF) */
  evGrantWithScrappage?: boolean;
  /**
   * Transfer of Residence exemption (TORE, Form VEH 007): owned ≥ 24 months
   * and lived outside Malta ≥ 24 months, both immediately before the move.
   */
  transferOfResidence?: boolean;
  /** True if the vehicle is left-hand drive */
  isLeftHandDrive?: boolean;
  /** Odometer reading at import in km — drives the roadworthiness test rule */
  mileageKm?: number;
}

export interface BreakdownItem {
  label: string;
  amount: number;
  category: "cost" | "tax" | "fee" | "info";
  note?: string;
}

export interface ImportVehicleOutput {
  vehicleValueEUR: number;
  shippingCostEUR: number;
  insuranceCostEUR: number;
  /** CIF customs value (vehicle + freight + insurance), EUR */
  customsValue: number;
  importDuty: number;
  vatOnCustoms: number;
  /** Registration Value used in the formula (manual or derived) */
  registrationValueUsed: number;
  registrationValueWasManual: boolean;
  /** CO2 test cycle used for the rate table */
  co2TestCycle: Co2TestCycle;
  /** CO2 rate (%) applied */
  co2RatePercent: number;
  /** Length rate (%) applied */
  lengthRatePercent: number;
  registrationTax: number;
  /** True when the non-EU minimum tax was higher than the formula result */
  minimumTaxApplied: boolean;
  /** Roadworthiness test fee (0 if not needed at import) */
  vrtFee: number;
  /** Transport Malta inspection fee for used UK / non-EU imports */
  inspectionFee: number;
  numberPlatesFee: number;
  registrationFee: number;
  vintageCertificationFee: number;
  toreFee: number;
  /** Government EV grant deducted from total */
  evGrant: number;
  /** True if BEV / PHEV (≥ 50 km range) — exempt from RegTax + 5 y road tax */
  isFullEvExempt: boolean;
  /** Indicative 5-year road-tax savings vs an ICE equivalent (BEV / PHEV) */
  fiveYearRoadTaxSavings: number;
  toreApplied: boolean;
  /** True if a roadworthiness test is needed at import */
  vrtRequired: boolean;
  /**
   * Vintage (30–49 y) RegTax range: 25.5 %–37.5 % of the estimated value
   * depending on engine size. Undefined when not applicable.
   */
  vintageTaxRange?: { min: number; max: number };
  totalCost: number;
  totalTaxesFees: number;
  /** Detected Euro emission standard from model year */
  euroStandard: string;
  /** Vehicle ≥ 30 years: vintage classification possible */
  vintageEligible: boolean;
  /** Vehicle ≥ 50 years: 0 % registration tax as vintage */
  vintageFullExemption: boolean;
  description: string;
  warnings: string[];
  breakdown: BreakdownItem[];
}

/**
 * Currency exchange rates (approximate — refresh quarterly). Used only as
 * on-screen conversion; users should confirm rate at customs clearance date.
 */
export const EXCHANGE_RATES: Record<Currency, number> = {
  EUR: 1,
  GBP: 1.17,
  USD: 0.92,
  JPY: 0.0061,
};

const VAT_RATE = 0.18;
const IMPORT_DUTY_RATE = 0.1;

/** S.L. 65.15 Eighth Schedule — M1 maksimum VRT ücreti (KDV dahil) */
const VRT_FEE = 30.27;
/** SOPV 02 — UK / AB dışı kullanılmış ithal araç muayene ücreti */
const IMPORT_INSPECTION_FEE = 55;
/** Transport Malta — rastgele plaka çifti (otomobil) */
const NUMBER_PLATES_FEE = 70;
/** Transport Malta — tescil idari ücreti */
const REGISTRATION_FEE = 15;
/** TORE onay ücreti */
const TORE_FEE = 100;
/** VEH 15 — ithal araç: €50 başvuru + €55 muayene */
const VINTAGE_APPLICATION_FEE = 50;
const VINTAGE_INSPECTION_FEE = 55;
/** Vintage RegTax: tahmini değerin %25.5–%37.5'i (motor hacmine göre) */
const VINTAGE_TAX_MIN = 0.255;
const VINTAGE_TAX_MAX = 0.375;

/** Grant Schemes on New Electric Vehicles 2026 */
const EV_GRANT_NEW_UP_TO_40K = 8000;
const EV_GRANT_NEW_40K_TO_100K = 6000;
const EV_GRANT_SCRAPPAGE = 1000;
/** Used EV 2026: €4,000 (≤ 3 ay önce yurtdışında ilk tescil), €3,000 (3–6 ay) */
const EV_GRANT_USED = 4000;

/** BEV / PHEV (≥ 50 km) yıllık lisans muafiyeti (yıl 0–5) */
const EV_ROAD_TAX_FREE_YEARS = 5;
/** Benzer bir ICE araç için tipik yıllık lisans (yalnızca gösterim) */
const TYPICAL_ICE_ANNUAL_ROAD_TAX = 150;

const VINTAGE_ELIGIBLE_AGE = 30;
const VINTAGE_FULL_EXEMPTION_AGE = 50;
const NON_EU_MINIMUM_TAX_AGE = 5;

const REFERENCE_YEAR = new Date().getFullYear();

export function calculateImportVehicle(
  input: ImportVehicleInput,
): ImportVehicleOutput {
  const {
    purchasePrice,
    currency,
    modelYear,
    co2Emissions,
    lengthMm,
    fuelType,
    isEU,
    shippingCost,
    insuranceCost = 0,
    isNew,
  } = input;

  const breakdown: BreakdownItem[] = [];
  const warnings: string[] = [];

  const rate = EXCHANGE_RATES[currency] ?? 1;
  const vehicleValueEUR = Math.round(purchasePrice * rate);
  const shippingCostEUR = Math.round(shippingCost * rate);
  const insuranceCostEUR = Math.round(insuranceCost * rate);

  const ageYears = Math.max(0, REFERENCE_YEAR - modelYear);
  const euroNumber = euroStandardFromYear(modelYear);
  const euroStandard = euroNumber === 0 ? "Pre-Euro" : `Euro ${euroNumber}`;
  const co2TestCycle: Co2TestCycle =
    input.co2TestCycle ?? (modelYear >= 2021 ? "wltp" : "nedc");

  const vintageEligible = !isNew && ageYears >= VINTAGE_ELIGIBLE_AGE;
  const vintageFullExemption =
    vintageEligible && ageYears >= VINTAGE_FULL_EXEMPTION_AGE;

  breakdown.push({
    label: "Vehicle Value (EUR equivalent)",
    amount: vehicleValueEUR,
    category: "cost",
  });
  if (shippingCostEUR > 0) {
    breakdown.push({
      label: "Shipping",
      amount: shippingCostEUR,
      category: "cost",
    });
  }
  if (insuranceCostEUR > 0) {
    breakdown.push({
      label: "Transit Insurance",
      amount: insuranceCostEUR,
      category: "cost",
    });
  }

  // CIF gümrük değeri
  const customsValue = vehicleValueEUR + shippingCostEUR + insuranceCostEUR;

  // Gümrük vergisi — yalnızca AB dışı
  let importDuty = 0;
  if (!isEU) {
    importDuty = Math.round(customsValue * IMPORT_DUTY_RATE);
    breakdown.push({
      label: "Customs Duty (10 % of CIF)",
      amount: importDuty,
      category: "tax",
    });
  }

  // KDV — AB dışı her zaman (CIF + gümrük); AB içi yalnızca "new means of
  // transport" (≤ 6 ay veya ≤ 6,000 km)
  let vatOnCustoms = 0;
  if (!isEU || isNew) {
    vatOnCustoms = Math.round((customsValue + importDuty) * VAT_RATE);
    breakdown.push({
      label: isEU
        ? "VAT 18 % (new means of transport)"
        : "VAT 18 % (CIF + Duty)",
      amount: vatOnCustoms,
      category: "tax",
    });
  }

  // Registration Value
  const registrationValueWasManual =
    input.registrationValue !== undefined && input.registrationValue > 0;
  const registrationValueUsed = registrationValueWasManual
    ? Math.round(input.registrationValue!)
    : vehicleValueEUR;

  const isFullEvExempt =
    fuelType === "electric" || fuelType === "plugin_hybrid";

  // SOPV 02 formülü
  const formula = calculateM1RegistrationTax({
    co2: co2Emissions,
    lengthMm,
    registrationValue: registrationValueUsed,
    fuelType,
    testCycle: co2TestCycle,
    euroGap: euroGapFromStandard(euroNumber),
    // DPF'siz dizeller (Euro 4 ve öncesi) PM > 0.005 g/km
    dieselHighPm: fuelType === "diesel" && euroNumber <= 4,
  });

  let registrationTax = formula.total;
  let regTaxLabel = "Registration Tax (CO2 + length)";
  let regTaxNote = `CO2 ${formula.adjustedCo2} g/km × ${formula.co2RatePercent}% (${co2TestCycle.toUpperCase()}) + ${lengthMm} mm × ${formula.lengthRatePercent}%, on RV €${registrationValueUsed.toLocaleString("en-MT")}${registrationValueWasManual ? " (manual)" : " (purchase price — official RV may differ)"}.`;

  // AB dışı (UK dahil), 5 yaşından büyük kullanılmış M1 için minimum vergi
  let minimumTaxApplied = false;
  if (
    !isEU &&
    !isNew &&
    !isFullEvExempt &&
    !vintageEligible &&
    ageYears > NON_EU_MINIMUM_TAX_AGE
  ) {
    const minTax = getNonEuMinimumTax(formula.adjustedCo2, ageYears);
    if (minTax > registrationTax) {
      registrationTax = minTax;
      minimumTaxApplied = true;
      regTaxLabel = "Registration Tax (non-EU minimum tax)";
      regTaxNote = `Formula gives €${formula.total.toLocaleString("en-MT")}, but the SOPV 02 minimum for a ${ageYears}-year-old non-EU used car at ${formula.adjustedCo2} g/km is €${minTax.toLocaleString("en-MT")}.`;
    }
  }

  // Vintage: 30–49 yaş tahmini değerin %25.5–37.5'i, 50+ yaş %0
  let vintageTaxRange: { min: number; max: number } | undefined;
  if (vintageFullExemption) {
    registrationTax = 0;
  } else if (vintageEligible) {
    vintageTaxRange = {
      min: Math.round(registrationValueUsed * VINTAGE_TAX_MIN),
      max: Math.round(registrationValueUsed * VINTAGE_TAX_MAX),
    };
    registrationTax = Math.round(
      (vintageTaxRange.min + vintageTaxRange.max) / 2,
    );
    regTaxLabel = "Registration Tax (vintage, estimate)";
    regTaxNote = `Vintage vehicles aged 30–49 pay 25.5 %–37.5 % of the estimated value depending on engine size: €${vintageTaxRange.min.toLocaleString("en-MT")}–€${vintageTaxRange.max.toLocaleString("en-MT")}. Mid-point shown.`;
  }

  // TORE — tüm RegTax hesaplarını geçersiz kılar
  const toreApplied = input.transferOfResidence === true;
  if (toreApplied) {
    registrationTax = 0;
  }

  if (registrationTax > 0) {
    breakdown.push({
      label: regTaxLabel,
      amount: registrationTax,
      category: "tax",
      note: regTaxNote,
    });
  } else if (toreApplied) {
    breakdown.push({
      label: "Registration Tax — TORE Exemption",
      amount: 0,
      category: "tax",
      note: "Transfer of Residence exemption (Form VEH 007). If the vehicle is later sold in Malta, registration tax becomes due on its market value.",
    });
  }

  // Vintage sertifikasyonu (ithal araç)
  let vintageCertificationFee = 0;
  if (vintageEligible) {
    vintageCertificationFee = VINTAGE_APPLICATION_FEE + VINTAGE_INSPECTION_FEE;
    breakdown.push({
      label: "Vintage Certification (VEH 15)",
      amount: vintageCertificationFee,
      category: "fee",
      note: "Imported vehicle: €50 application + €55 inspection by Transport Malta's Vintage Vehicle Classification Committee.",
    });
  }

  // VRT (Roadworthiness Test) — ithalatta gereklilik
  //   AB dışı: > 4 yaş, veya > 1 yaş ve > 160,000 km
  //   UK / AB: > 4 yaş veya > 160,000 km (geçerli AB VRT belgesi kabul edilir)
  const mileage = input.mileageKm ?? 0;
  const vrtRequired =
    !isNew &&
    (ageYears > 4 ||
      (isEU ? mileage > 160000 : ageYears > 1 && mileage > 160000));
  const vrtFeeActual = vrtRequired ? VRT_FEE : 0;
  if (vrtRequired) {
    breakdown.push({
      label: "Roadworthiness Test (VRT)",
      amount: VRT_FEE,
      category: "fee",
      note:
        ageYears > 4
          ? `Required because the vehicle is over 4 years old. Max official fee €30.27.`
          : `Required because the odometer exceeds 160,000 km. Max official fee €30.27.`,
    });
  }

  // UK / AB dışı kullanılmış araç muayene ücreti
  const inspectionFee = !isEU && !isNew ? IMPORT_INSPECTION_FEE : 0;
  if (inspectionFee > 0) {
    breakdown.push({
      label: "Transport Malta Inspection (used non-EU import)",
      amount: inspectionFee,
      category: "fee",
    });
  }

  breakdown.push({
    label: vintageEligible
      ? "Number Plates (vintage, 2 × €35)"
      : "Number Plates",
    amount: NUMBER_PLATES_FEE,
    category: "fee",
  });
  breakdown.push({
    label: "Registration Fee",
    amount: REGISTRATION_FEE,
    category: "fee",
  });

  const toreFee = toreApplied ? TORE_FEE : 0;
  if (toreFee > 0) {
    breakdown.push({
      label: "TORE Application Fee",
      amount: toreFee,
      category: "fee",
    });
  }

  // Transport Malta EV grant (yalnızca BEV; PHEV uygunluğu belirtilmemiş)
  let evGrant = 0;
  if (input.applyEvGrant && fuelType === "electric") {
    if (isNew) {
      const base =
        vehicleValueEUR <= 40000
          ? EV_GRANT_NEW_UP_TO_40K
          : vehicleValueEUR <= 100000
            ? EV_GRANT_NEW_40K_TO_100K
            : 0;
      evGrant =
        base > 0 && input.evGrantWithScrappage
          ? base + EV_GRANT_SCRAPPAGE
          : base;
    } else if (isEU && ageYears === 0) {
      evGrant = EV_GRANT_USED;
    }
    if (evGrant > 0) {
      breakdown.push({
        label: isNew
          ? input.evGrantWithScrappage
            ? "Malta New EV Grant 2026 (with scrappage)"
            : "Malta New EV Grant 2026"
          : "Malta Used EV Grant 2026",
        amount: -evGrant,
        category: "fee",
        note: isNew
          ? "€8,000 up to €40,000 / €6,000 for €40,000–€100,000; +€1,000 scrappage (+€1,000 for Gozo residents, not included)."
          : "€4,000 if first registered abroad up to 3 months before (€3,000 for 3–6 months). Keep 36 months. Form VEH 077.",
      });
    } else {
      warnings.push(
        isNew
          ? "No new-EV grant: the 2026 scheme only covers cars priced up to €100,000."
          : "The 2026 used-EV grant only covers EVs first registered abroad (EU/UK) within the last 6 months.",
      );
    }
  }

  const fiveYearRoadTaxSavings = isFullEvExempt
    ? TYPICAL_ICE_ANNUAL_ROAD_TAX * EV_ROAD_TAX_FREE_YEARS
    : 0;

  const totalTaxesFees = Math.round(
    importDuty +
      vatOnCustoms +
      registrationTax +
      vrtFeeActual +
      inspectionFee +
      NUMBER_PLATES_FEE +
      REGISTRATION_FEE +
      vintageCertificationFee +
      toreFee -
      evGrant,
  );
  const totalCost =
    vehicleValueEUR + shippingCostEUR + insuranceCostEUR + totalTaxesFees;

  // Uyarılar
  if (!isNew && euroNumber < 6 && !vintageEligible && !isFullEvExempt) {
    warnings.push(
      `${euroStandard} (estimated from model year): older emission standards can be registered, but pay higher NEDC CO2 rates. Check the Euro standard on the Certificate of Conformity.`,
    );
  }
  if (co2TestCycle === "wltp" && modelYear < 2021) {
    warnings.push(
      "WLTP rates only apply when the original Certificate of Conformity shows WLTP CO2 values.",
    );
  }
  if (fuelType === "hybrid") {
    warnings.push(
      "Hybrid (non plug-in): the CO2 value on the Certificate of Conformity is reduced by 30 % before the rate table is applied (SOPV 02 §13.6).",
    );
  }
  if (minimumTaxApplied) {
    warnings.push(
      "Non-EU used cars older than 5 years (including from the UK) pay at least the SOPV 02 minimum tax for their CO2 band and age.",
    );
  }
  if (vintageEligible && !vintageFullExemption) {
    warnings.push(
      `Vehicle is ${ageYears} years old: eligible for vintage classification (silver-on-black plates, max 3,000 km/year). Registration tax is 25.5 %–37.5 % of the estimated value depending on engine size; it drops to 0 % at 50 years.`,
    );
  }
  if (vintageFullExemption) {
    warnings.push(
      "Vehicle is 50+ years old: 0 % registration tax as a certified vintage vehicle — only customs/VAT (if non-EU) and fixed fees apply.",
    );
  }
  if (!isEU) {
    warnings.push(
      "Non-EU import (UK, Japan, USA, etc.): 10 % customs duty on CIF and 18 % VAT on (CIF + duty). VAT is not charged on the registration tax.",
    );
    warnings.push(
      "Importing from the UK: the EU-UK Trade and Cooperation Agreement gives 0 % duty only for vehicles meeting UK rules of origin — confirm with a customs broker.",
    );
  }

  warnings.push(
    "30-day deadline: the vehicle must be inspected and registered within 30 days of arrival in Malta, or a €30/day administrative penalty applies (Cap 368, art. 21(4)).",
  );

  if (!toreApplied && !isNew && registrationTax > 500) {
    warnings.push(
      `Moving your residence to Malta? The Transfer of Residence exemption (Form VEH 007) waives registration tax if you owned the vehicle ≥ 24 months and lived abroad ≥ 24 months. Worth checking before paying €${registrationTax.toLocaleString("en-MT")}.`,
    );
  }
  if (toreApplied) {
    warnings.push(
      "TORE: €100 fee on approval; the Ministry for Finance decides within 90 days. If you later sell the vehicle in Malta, registration tax becomes due on its market value.",
    );
  }

  if (input.isLeftHandDrive) {
    warnings.push(
      "Left-hand-drive vehicle: legally importable, but headlight aim may need adjusting to pass the roadworthiness test.",
    );
  }

  if (!isNew && !vrtRequired) {
    warnings.push(
      "Roadworthiness test not needed at import for this vehicle. For private cars it becomes due 4 years after first registration, then every 2 years.",
    );
  }

  if (isFullEvExempt && fuelType === "plugin_hybrid") {
    warnings.push(
      "PHEV exemption requires an electric-only range of at least 50 km (check the Certificate of Conformity). Below that the standard CO2 + length tax applies.",
    );
  }
  if (fuelType === "electric" && !input.applyEvGrant) {
    warnings.push(
      'Transport Malta 2026 grants: €8,000 (≤ €40,000) or €6,000 (€40,000–€100,000) for a new BEV, +€1,000 scrappage; used EVs first registered abroad in the last 6 months get €3,000–€4,000. Toggle "Apply EV grant" to subtract it.',
    );
  }

  // Açıklama
  let description = "";
  if (vintageFullExemption) {
    description = `Vehicle is ${ageYears} years old: 0 % registration tax as a certified vintage vehicle. Only customs/VAT (if non-EU) and fixed fees apply.`;
  } else if (vintageEligible) {
    description = `Vehicle is ${ageYears} years old: vintage path — registration tax is 25.5 %–37.5 % of the estimated value.`;
  } else if (isEU && !isNew) {
    description =
      "Used vehicle from the EU: no customs duty, no VAT. Only registration tax + fees.";
  } else if (!isEU) {
    description =
      "Non-EU import: customs duty 10 % and VAT 18 % on CIF + duty, plus registration tax and fees.";
  } else {
    description =
      "New vehicle: 18 % VAT is due in Malta, plus registration tax based on CO2 + length.";
  }
  if (fuelType === "electric") {
    description +=
      " Battery EV: exempt from registration tax, and €0 annual road licence for years 0–5.";
  } else if (fuelType === "plugin_hybrid") {
    description +=
      " Plug-in hybrid: exempt from registration tax and €0 road licence for years 0–5 if electric range ≥ 50 km.";
  } else if (fuelType === "hybrid") {
    description += " Hybrid: CO2 value reduced by 30 % before the rate table.";
  }

  breakdown.push({
    label: `Detected: ${euroStandard} (model year ${modelYear})`,
    amount: 0,
    category: "info",
  });

  return {
    vehicleValueEUR,
    shippingCostEUR,
    insuranceCostEUR,
    customsValue,
    importDuty,
    vatOnCustoms,
    registrationValueUsed,
    registrationValueWasManual,
    co2TestCycle,
    co2RatePercent: formula.co2RatePercent,
    lengthRatePercent: formula.lengthRatePercent,
    registrationTax,
    minimumTaxApplied,
    vrtFee: vrtFeeActual,
    inspectionFee,
    numberPlatesFee: NUMBER_PLATES_FEE,
    registrationFee: REGISTRATION_FEE,
    vintageCertificationFee,
    toreFee,
    evGrant,
    isFullEvExempt,
    fiveYearRoadTaxSavings,
    toreApplied,
    vrtRequired,
    vintageTaxRange,
    totalCost,
    totalTaxesFees,
    euroStandard,
    vintageEligible,
    vintageFullExemption,
    description,
    warnings,
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

export function getImportVehicleInfo() {
  return {
    vatRate: VAT_RATE * 100,
    importDutyRate: IMPORT_DUTY_RATE * 100,
    vrtFee: VRT_FEE,
    inspectionFee: IMPORT_INSPECTION_FEE,
    numberPlatesFee: NUMBER_PLATES_FEE,
    registrationFee: REGISTRATION_FEE,
    exchangeRates: EXCHANGE_RATES,
    vintageEligibleAge: VINTAGE_ELIGIBLE_AGE,
    vintageFullExemptionAge: VINTAGE_FULL_EXEMPTION_AGE,
  };
}
