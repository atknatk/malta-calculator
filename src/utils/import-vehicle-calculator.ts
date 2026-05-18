/**
 * Malta Import Vehicle Calculator
 *
 * Implements the SOPV-02 (Transport Malta) M1 passenger-car registration-tax
 * formula plus the customs / VAT chain that applies on imports.
 *
 * Sources (verified May 2026):
 *   - Transport Malta SOPV-02 (Registering & Licensing of New & Used M1)
 *   - FMVA "Concessions for Classic Vehicles in Malta"
 *   - Transport Malta VEH 15 v4 (29 Sept 2025) — vintage certification
 *   - Customs Malta — 10 % duty + 18 % VAT chain for third-country imports
 *
 * Formula (post-2009 M1):
 *   RegTax = (CO2_g/km × RV × CO2_rate) + (Length_mm × RV × Length_rate)
 *   where RV = Registration Value determined by Transport Malta
 *         CO2_rate depends on Euro standard
 *         Length_rate depends on vehicle length band
 *
 * Important: the script approximates RV with the customs (CIF) value because
 * the official RV is only available through valuation.vehicleregistration.gov.mt.
 * Estimate is flagged when this approximation is unreliable (vintage, pre-Euro 5,
 * outliers).
 */

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
  /** CO2 emissions in g/km (NEDC/WLTP) */
  co2Emissions: number;
  /** Vehicle length in mm (typical: 4200–4700 for saloons) */
  lengthMm: number;
  fuelType: FuelType;
  /** True if imported from EU country */
  isEU: boolean;
  /** Shipping cost in same currency as purchasePrice */
  shippingCost: number;
  /** Insurance during transit (same currency); optional */
  insuranceCost?: number;
  /** Brand-new vehicle (< 6 months / < 6 000 km) */
  isNew: boolean;
  /**
   * Optional manual Registration Value (RV) override in EUR. RV is the value
   * Transport Malta uses to calculate registration tax — it comes from
   * valuation.vehicleregistration.gov.mt (CAP Motor Research trade values).
   * If not supplied, we derive a sensible default from purchase price.
   */
  registrationValue?: number;
  /**
   * Apply the Transport Malta sustainable-mobility grant for new electric /
   * plug-in-hybrid vehicles (€11k, or €13k with scrappage of a ≥10 y ICE
   * vehicle at an Authorised Treatment Facility). Or, for a used EV
   * registered in Malta after 1 Jan 2025, the smaller used-EV grant
   * (€1k, +€1k with scrappage). Only applied when fuelType is electric
   * or plugin_hybrid.
   */
  applyEvGrant?: boolean;
  evGrantWithScrappage?: boolean;
  /**
   * Transfer of Residence exemption (TORE). Applies when the importer is
   * moving residence to Malta and meets both conditions:
   *  - vehicle has been registered in their name for ≥ 24 months
   *  - they have lived outside Malta for ≥ 24 months
   * On approval (Form VEH 007), RegTax + VAT on RegTax are fully waived.
   * Vehicle cannot be sold/transferred within 1 year of import.
   */
  transferOfResidence?: boolean;
  /** True if the vehicle is left-hand drive (uncommon in Malta which is RHD). */
  isLeftHandDrive?: boolean;
  /** Odometer reading at import in km — drives VRT requirement logic. */
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
  /** Registration Value used in the SOPV-02 formula (manual or derived) */
  registrationValueUsed: number;
  /** True if RV was supplied by user; false if defaulted from purchase price */
  registrationValueWasManual: boolean;
  registrationTax: number;
  vatOnRegTax: number;
  vrtFee: number;
  numberPlatesFee: number;
  registrationFee: number;
  vintageCertificationFee: number;
  /** Government EV grant deducted from total (0 unless applyEvGrant + eligible) */
  evGrant: number;
  /** True if BEV / PHEV (≥50 km range) — exempt from RegTax + 5 y road tax */
  isFullEvExempt: boolean;
  /** Estimated 5-year annual road-tax savings vs ICE equivalent (BEV / PHEV) */
  fiveYearRoadTaxSavings: number;
  /** True if TORE exemption was applied (RegTax + VAT-on-RegTax = 0) */
  toreApplied: boolean;
  /** True if a VRT inspection is mandatory (>4 y or >160 000 km) */
  vrtRequired: boolean;
  /**
   * Indicative FMVA flat RegTax range for vintage cars when the standard
   * SOPV-02 formula does not apply (i.e. ≥30 years). Empty when not vintage.
   */
  vintageFmvaEstimate?: { min: number; max: number };
  totalCost: number;
  totalTaxesFees: number;
  /** Detected Euro emission standard from model year */
  euroStandard: string;
  /** Whether the vehicle qualifies for vintage classification (≥30 y) */
  vintageEligible: boolean;
  /** Whether 50 % vintage RegTax discount applies (35–50 y) */
  vintage50Discount: boolean;
  /** Whether full vintage RegTax exemption applies (50 y+) */
  vintageFullExemption: boolean;
  /**
   * True when the vehicle CANNOT be registered as a normal road vehicle in
   * Malta (i.e. Euro < 5b for vehicles ≥ 2 years). Only vintage path exists.
   */
  registrationBlocked: boolean;
  description: string;
  warnings: string[];
  breakdown: BreakdownItem[];
}

/**
 * Currency exchange rates (May 2026 approximate — refresh quarterly).
 * Used only as on-screen conversion; users should confirm rate at customs
 * clearance date.
 */
export const EXCHANGE_RATES: Record<Currency, number> = {
  EUR: 1,
  GBP: 1.17,
  USD: 0.92,
  JPY: 0.0061,
};

/**
 * CO2 rate by Euro emission standard. The third-party CliveMlt Python
 * reference cites these as 0.41–0.47 (as a percent), but applying that
 * directly gives RegTax figures 3–4× higher than the actual published
 * Transport Malta examples (typical new-car RegTax in Malta sits in the
 * €1.5k–€5k range, not €8k–€15k). The rates here are calibrated against
 * published real-world Malta registration figures and are the closest
 * defensible per-permille interpretation of SOPV-02 Schedule 1 until
 * the full schedule is openly published. Users can override the
 * Registration Value to fine-tune the estimate for their exact vehicle.
 */
const CO2_RATE_BY_EURO: Record<string, number> = {
  "Pre-Euro": 0.05, // approximation; pre-Euro 3 cannot register normally anyway
  "Euro 1": 0.05,
  "Euro 2": 0.049,
  "Euro 3": 0.047,
  "Euro 4": 0.044,
  "Euro 5": 0.041,
  "Euro 6": 0.041,
};

/**
 * Length rate bands (SOPV-02). Percentages applied as decimal — divide by 100
 * inside the formula.
 */
const LENGTH_BANDS: { maxMm: number; rate: number }[] = [
  { maxMm: 3450, rate: 0.002 },
  { maxMm: 3640, rate: 0.0022 },
  { maxMm: 3770, rate: 0.0024 },
  { maxMm: 4030, rate: 0.0026 },
  { maxMm: 4370, rate: 0.0028 },
  { maxMm: 4570, rate: 0.003 },
  { maxMm: 4770, rate: 0.0032 },
  { maxMm: Number.POSITIVE_INFINITY, rate: 0.0034 },
];

/**
 * Age depreciation table (Schedule 3 indicative bands). For ages > 10 the
 * official method becomes manual chassis-by-chassis valuation, so we cap
 * the depreciation rather than extrapolate aggressively.
 */
const AGE_DEPRECIATION: Record<number, number> = {
  0: 0,
  1: 0.1,
  2: 0.18,
  3: 0.25,
  4: 0.31,
  5: 0.36,
  6: 0.4,
  7: 0.44,
  8: 0.47,
  9: 0.5,
  10: 0.52,
  11: 0.55,
  12: 0.58,
  13: 0.6,
  14: 0.62,
  15: 0.64,
};
const MAX_DEPRECIATION = 0.7;

/**
 * Diesel particulate-matter surcharge applied on top of CO2 tax for diesel
 * vehicles (SOPV-02). The official table varies by year; 15 % is a
 * defensible blended figure used by industry calculators.
 */
const DIESEL_PM_SURCHARGE = 0.15;

/**
 * Fuel-type discount on the CO2 component. Note that BEV and PHEV (with
 * electric range ≥ 50 km) are FULLY RegTax-exempt in Malta — both CO2 and
 * length components are waived — so we handle them by short-circuiting
 * the formula entirely rather than via a discount.
 */
const FUEL_DISCOUNT: Record<FuelType, number> = {
  electric: 1, // handled by exemption short-circuit
  plugin_hybrid: 1, // handled by exemption short-circuit (≥50 km electric range)
  hybrid: 0.25, // 25 % CO2-tax discount
  petrol: 0,
  diesel: 0, // diesel surcharge handled separately
};

/**
 * Sustainable-mobility incentives (Transport Malta 2026 schemes).
 * NEW BEV / PHEV grant: €11,000 base, with optional scrappage bonus when
 * deregistering an old ICE vehicle (≥10 y) at an Authorised Treatment Facility.
 * Used BEV (registered in Malta after 1 Jan 2025): separate, smaller grant.
 */
const EV_GRANT_NEW_BASE = 11000;
const EV_GRANT_NEW_WITH_SCRAPPAGE = 13000;
const EV_GRANT_USED_BASE = 1000;
const EV_GRANT_USED_WITH_SCRAPPAGE = 2000;
/** Years of zero annual circulation tax for BEV / PHEV (≥50 km). */
const EV_ROAD_TAX_FREE_YEARS = 5;
/** Indicative typical annual road tax for a similar-class ICE car, used to
 *  show the 5-year savings figure. */
const TYPICAL_ICE_ANNUAL_ROAD_TAX = 200;

const VAT_RATE = 0.18;
const IMPORT_DUTY_RATE = 0.1;
const VRT_FEE = 36;
const NUMBER_PLATES_FEE = 35;
const NUMBER_PLATES_FEE_VINTAGE = 70;
const REGISTRATION_FEE = 50;
const VINTAGE_CERTIFICATION_NET_COST = 50; // VEH 15: €250 - €200 refund
const VINTAGE_TM_ADMIN_FEE = 50;
const VINTAGE_TM_INSPECTION_FEE = 55;

/** Vehicle ages at which vintage rules change. */
const VINTAGE_ELIGIBLE_AGE = 30;
const VINTAGE_50_DISCOUNT_AGE = 35;
const VINTAGE_FULL_EXEMPTION_AGE = 50;
/** Minimum vehicle age for normal registration when Euro 5b/6b applies. */
const MIN_EURO_FOR_REGISTRATION = "Euro 5";

/**
 * Map model year to nominal Euro emission standard (passenger cars).
 * Euro 1: 1992 — Euro 2: 1996 — Euro 3: 2000 — Euro 4: 2005 — Euro 5: 2009 —
 * Euro 6: 2014. Some markets phase in a year later; we treat the EU
 * Type-Approval mandate dates as the reference.
 */
function euroStandardFromYear(modelYear: number): string {
  if (modelYear >= 2014) return "Euro 6";
  if (modelYear >= 2009) return "Euro 5";
  if (modelYear >= 2005) return "Euro 4";
  if (modelYear >= 2000) return "Euro 3";
  if (modelYear >= 1996) return "Euro 2";
  if (modelYear >= 1992) return "Euro 1";
  return "Pre-Euro";
}

function getLengthRate(lengthMm: number): number {
  for (const band of LENGTH_BANDS) {
    if (lengthMm <= band.maxMm) return band.rate;
  }
  return LENGTH_BANDS[LENGTH_BANDS.length - 1].rate;
}

function getAgeDepreciation(ageYears: number): number {
  if (ageYears <= 0) return 0;
  if (ageYears in AGE_DEPRECIATION) return AGE_DEPRECIATION[ageYears];
  if (ageYears > 15) return MAX_DEPRECIATION;
  return AGE_DEPRECIATION[15];
}

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
  const euroStandard = euroStandardFromYear(modelYear);

  const vintageEligible = ageYears >= VINTAGE_ELIGIBLE_AGE;
  const vintage50Discount =
    ageYears >= VINTAGE_50_DISCOUNT_AGE &&
    ageYears < VINTAGE_FULL_EXEMPTION_AGE;
  const vintageFullExemption = ageYears >= VINTAGE_FULL_EXEMPTION_AGE;

  const euroRank: Record<string, number> = {
    "Pre-Euro": 0,
    "Euro 1": 1,
    "Euro 2": 2,
    "Euro 3": 3,
    "Euro 4": 4,
    "Euro 5": 5,
    "Euro 6": 6,
  };
  const meetsMinEuro =
    (euroRank[euroStandard] ?? 0) >= (euroRank[MIN_EURO_FOR_REGISTRATION] ?? 5);
  const registrationBlocked = !isNew && !meetsMinEuro && !vintageEligible;

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

  // CIF customs value
  const customsValue = vehicleValueEUR + shippingCostEUR + insuranceCostEUR;

  // Import duty — non-EU only
  let importDuty = 0;
  if (!isEU) {
    importDuty = Math.round(customsValue * IMPORT_DUTY_RATE);
    breakdown.push({
      label: "Customs Duty (10 % of CIF)",
      amount: importDuty,
      category: "tax",
    });
  }

  // VAT on customs value — non-EU always, EU only if new vehicle
  let vatOnCustoms = 0;
  if (!isEU || isNew) {
    vatOnCustoms = Math.round((customsValue + importDuty) * VAT_RATE);
    breakdown.push({
      label: "VAT 18 % (CIF + Duty)",
      amount: vatOnCustoms,
      category: "tax",
    });
  }

  // Registration Tax — uses Registration Value (RV). The official RV comes
  // from valuation.vehicleregistration.gov.mt and is based on CAP Motor
  // Research trade values, which usually track the actual market price of
  // the vehicle. For used imports, purchase price is the best free proxy;
  // for new imports, RV ≈ 85 % of retail (trade-vs-retail spread).
  const registrationValueWasManual =
    input.registrationValue !== undefined && input.registrationValue > 0;
  const defaultRV = isNew
    ? Math.round(vehicleValueEUR * 0.85)
    : vehicleValueEUR;
  const registrationValueUsed = registrationValueWasManual
    ? Math.round(input.registrationValue!)
    : defaultRV;

  const co2Rate = (CO2_RATE_BY_EURO[euroStandard] ?? 0.41) / 100;
  const lengthRate = getLengthRate(lengthMm);
  const fuelAdj = 1 - (FUEL_DISCOUNT[fuelType] ?? 0);

  // SOPV-02: rates are expressed as percentages, so divide by 100 once at
  // the call site. CO2 rate is already pre-divided (see co2Rate above);
  // length rate is the raw SOPV-02 percentage (0.0020 – 0.0034) and must
  // be divided here. BEV and PHEV (≥50 km electric range) are 100 %
  // RegTax-exempt in Malta — both CO2 and length components are waived.
  const isFullEvExempt =
    fuelType === "electric" || fuelType === "plugin_hybrid";
  let co2TaxGross = 0;
  let lengthTaxGross = 0;
  if (!isFullEvExempt) {
    co2TaxGross = co2Emissions * registrationValueUsed * co2Rate * fuelAdj;
    if (fuelType === "diesel") {
      co2TaxGross *= 1 + DIESEL_PM_SURCHARGE;
    }
    lengthTaxGross = (lengthMm * registrationValueUsed * lengthRate) / 100;
  }
  const regTaxBeforeDepreciation = co2TaxGross + lengthTaxGross;
  const depreciation = getAgeDepreciation(ageYears);
  let registrationTax = Math.max(
    0,
    Math.round(regTaxBeforeDepreciation * (1 - depreciation)),
  );

  // Vintage concessions on RegTax
  if (vintageFullExemption) {
    registrationTax = 0;
  } else if (vintage50Discount) {
    registrationTax = Math.round(registrationTax * 0.5);
  }

  // Transfer of Residence Exemption (Form VEH 007) — overrides all other
  // RegTax computations. Vehicle must have been owned ≥24 months and the
  // applicant must have lived outside Malta ≥24 months. 1-year resale
  // restriction applies post-import.
  const toreApplied = input.transferOfResidence === true;
  if (toreApplied) {
    registrationTax = 0;
  }

  if (registrationTax > 0) {
    breakdown.push({
      label: vintage50Discount
        ? "Registration Tax (50 % vintage concession)"
        : "Registration Tax (CO2 + length)",
      amount: registrationTax,
      category: "tax",
      note: registrationValueWasManual
        ? `Computed with manual RV = €${registrationValueUsed.toLocaleString("en-MT")}.`
        : `Computed with RV ≈ €${registrationValueUsed.toLocaleString("en-MT")} (estimated from purchase price; official RV from valuation.vehicleregistration.gov.mt may differ).`,
    });
  } else if (toreApplied) {
    breakdown.push({
      label: "Registration Tax — TORE Exemption",
      amount: 0,
      category: "tax",
      note: "Transfer of Residence exemption applied (Form VEH 007). Vehicle cannot be sold or transferred within 12 months of import.",
    });
  }

  // Indicative FMVA flat estimate for vintage cars (≥30 years). The SOPV-02
  // formula does not strictly apply once a vehicle is classified as classic
  // — FMVA assigns a flat valuation and the resulting RegTax is typically
  // a small fraction of the formula output.
  let vintageFmvaEstimate: { min: number; max: number } | undefined;
  if (vintageEligible && !vintageFullExemption) {
    vintageFmvaEstimate = {
      min: vintage50Discount ? 50 : 100,
      max: vintage50Discount ? 250 : 600,
    };
  }

  // VAT on RegTax (Customs Malta applies VAT on reg-tax for non-EU imports
  // when the importer is a private individual). We add it conservatively
  // only for non-EU imports — and it auto-zeros when TORE waives the
  // underlying RegTax, since the `registrationTax > 0` gate below handles it.
  let vatOnRegTax = 0;
  if (!isEU && registrationTax > 0) {
    vatOnRegTax = Math.round(registrationTax * VAT_RATE);
    breakdown.push({
      label: "VAT 18 % on Registration Tax",
      amount: vatOnRegTax,
      category: "tax",
    });
  }

  // Vintage certification (FMVA / Transport Malta)
  let vintageCertificationFee = 0;
  if (vintageEligible) {
    vintageCertificationFee =
      VINTAGE_CERTIFICATION_NET_COST +
      VINTAGE_TM_ADMIN_FEE +
      VINTAGE_TM_INSPECTION_FEE;
    breakdown.push({
      label: "Vintage Certification (VEH 15 + TM admin + inspection)",
      amount: vintageCertificationFee,
      category: "fee",
      note: "€250 application minus €200 refund on successful certification, + €50 admin + €55 inspection",
    });
  }

  // Standard fees. VRT is only mandatory if the vehicle is older than 4
  // years from its model year, or if its odometer exceeds 160 000 km.
  const VRT_AGE_TRIGGER = 4;
  const VRT_MILEAGE_TRIGGER = 160000;
  const vrtRequired =
    !isNew &&
    (ageYears >= VRT_AGE_TRIGGER ||
      (input.mileageKm ?? 0) >= VRT_MILEAGE_TRIGGER);
  const vrtFeeActual = vrtRequired ? VRT_FEE : 0;
  if (vrtRequired) {
    breakdown.push({
      label: "VRT Inspection",
      amount: VRT_FEE,
      category: "fee",
      note:
        ageYears >= VRT_AGE_TRIGGER
          ? `Required because the vehicle is ${ageYears} years old (≥ 4 y trigger).`
          : `Required because the odometer (${input.mileageKm?.toLocaleString("en-MT")} km) exceeds the 160 000 km trigger.`,
    });
  }
  const platesFee = vintageEligible
    ? NUMBER_PLATES_FEE_VINTAGE
    : NUMBER_PLATES_FEE;
  breakdown.push({
    label: vintageEligible ? "Number Plates (vintage black)" : "Number Plates",
    amount: platesFee,
    category: "fee",
  });
  breakdown.push({
    label: "Registration Fee",
    amount: REGISTRATION_FEE,
    category: "fee",
  });

  // Transport Malta EV / PHEV grant — only applied when the user explicitly
  // opts in via applyEvGrant (eligibility depends on documentation, ATF
  // scrappage certificate, and 36-month retention which we can't verify).
  let evGrant = 0;
  if (input.applyEvGrant && isFullEvExempt) {
    if (isNew) {
      evGrant = input.evGrantWithScrappage
        ? EV_GRANT_NEW_WITH_SCRAPPAGE
        : EV_GRANT_NEW_BASE;
    } else {
      // Used-EV grant only applies to vehicles registered in Malta after
      // 1 Jan 2025. We accept the user's opt-in as their confirmation.
      evGrant = input.evGrantWithScrappage
        ? EV_GRANT_USED_WITH_SCRAPPAGE
        : EV_GRANT_USED_BASE;
    }
    breakdown.push({
      label: input.evGrantWithScrappage
        ? "Malta EV Grant (with scrappage)"
        : "Malta EV Grant",
      amount: -evGrant,
      category: "fee",
      note: isNew
        ? "Transport Malta 2026 New EV/Pedelec Scheme. Requires 36-month retention; refundable if vehicle is transferred sooner."
        : "Transport Malta 2026 Used EV Scheme. Requires vehicle registered in Malta after 1 Jan 2025.",
    });
  }

  // Five-year annual road-tax exemption: indicative savings vs an ICE car
  // of similar class (BEV/PHEV ≥50 km only). Not part of import cost, but
  // surfaced to help users compare total cost of ownership.
  const fiveYearRoadTaxSavings = isFullEvExempt
    ? TYPICAL_ICE_ANNUAL_ROAD_TAX * EV_ROAD_TAX_FREE_YEARS
    : 0;

  const totalTaxesFees =
    importDuty +
    vatOnCustoms +
    registrationTax +
    vatOnRegTax +
    vrtFeeActual +
    platesFee +
    REGISTRATION_FEE +
    vintageCertificationFee -
    evGrant;
  const totalCost =
    vehicleValueEUR + shippingCostEUR + insuranceCostEUR + totalTaxesFees;

  // Warnings
  if (registrationBlocked) {
    warnings.push(
      `${modelYear}-model ${euroStandard} vehicle: under SOPV-02 / Directive 2007/46/EC, Malta only accepts Euro 5b/6b or higher for normal first-time registration. This vehicle can ONLY be registered through the vintage/classic path (FMVA + VEH 15).`,
    );
  } else if (!isNew && (euroRank[euroStandard] ?? 0) < 5 && !vintageEligible) {
    warnings.push(
      `${euroStandard}: may not meet Malta's minimum emission standard for first registration — confirm with Transport Malta before shipping.`,
    );
  }
  if (vintageEligible && !vintage50Discount && !vintageFullExemption) {
    warnings.push(
      `Vehicle is ${ageYears} years old: eligible for vintage classification (€0 road licence, black plates, max 3,000 km/year) but the 50 % RegTax concession only starts at 35 years.`,
    );
  }
  if (vintage50Discount) {
    warnings.push(
      `Vehicle qualifies for 50 % vintage RegTax concession (35–50 years).`,
    );
  }
  if (vintageFullExemption) {
    warnings.push(
      `Vehicle ≥ 50 years: full RegTax exemption — only customs duty, VAT, and standard fees apply.`,
    );
  }
  if (ageYears > 15 && !vintageEligible) {
    warnings.push(
      `Vehicles older than 15 years: official Registration Value usually requires Form VEH 14 (manual valuation by Transport Malta).`,
    );
  }
  if (!isEU) {
    warnings.push(
      `Non-EU import (Japan, UK, Switzerland, etc.): customs duty 10 % + VAT 18 % apply on top of any registration tax. VAT is also charged on the registration tax.`,
    );
  }
  if (fuelType === "diesel" && ageYears > 6) {
    warnings.push(
      `Older diesel vehicles incur a particulate-matter (PM) surcharge of ~15 % on the CO2 component, and may face stricter VRT inspection.`,
    );
  }

  // 30-day registration deadline — applies to every import (EU and non-EU).
  // Article 21(4) of the Motor Vehicle Registration and Licensing Act
  // (Cap 368) imposes an administrative fine of €30 per day past day 30.
  warnings.push(
    `30-day deadline: the entire process (customs, valuation, VRT, registration) must be completed within 30 days of the vehicle's arrival in Malta. Unjustified delays trigger a €30/day administrative fine under Art. 21(4) of Cap 368.`,
  );

  // Transfer of Residence (TORE) — show the value if not yet applied
  if (!toreApplied && !isNew && ageYears <= 10 && registrationTax > 500) {
    warnings.push(
      `If you're moving residence to Malta, you may qualify for the Transfer of Residence exemption (Form VEH 007) — full waiver of registration tax. Conditions: vehicle owned ≥ 24 months and you lived outside Malta ≥ 24 months. Worth checking before paying €${registrationTax.toLocaleString("en-MT")} in RegTax.`,
    );
  }
  if (toreApplied) {
    warnings.push(
      `TORE exemption applied. Remember: the vehicle CANNOT be sold or transferred for 12 months from import — this restriction is recorded in the logbook.`,
    );
  }

  // Left-hand-drive imports
  if (input.isLeftHandDrive) {
    warnings.push(
      `Left-hand-drive vehicle: legally importable but Malta drives on the left, so visibility for overtaking and parking-booth access is awkward. Some right-hand-drive specific equipment (headlight aim, fog-light position) may need adjustment to pass VRT.`,
    );
  }

  // UK / post-Brexit Rules of Origin (informational note for non-EU imports)
  if (!isEU) {
    warnings.push(
      `If importing from the UK: the EU-UK Trade and Cooperation Agreement can give zero customs duty for vehicles that meet UK rules of origin — but most used cars don't qualify because the manufacturing happened outside the UK. Worth confirming with a customs broker.`,
    );
  }

  // Minimum tax floor for non-EU used vehicles > 5 years
  if (!isEU && !isNew && ageYears > 5 && !isFullEvExempt) {
    warnings.push(
      `Non-EU used import older than 5 years: a "minimum tax" may apply per the Motor Vehicle Registration & Licensing Act tables (the exact floor is not openly published). Verify with Transport Malta licensing before shipping.`,
    );
  }

  // VRT skipped
  if (!isNew && !vrtRequired) {
    warnings.push(
      `VRT not mandatory at import for this vehicle (under 4 years old and below 160 000 km). It will become mandatory at the 4-year mark from first registration.`,
    );
  }

  // Description
  let description = "";
  if (registrationBlocked) {
    description =
      "Normal first-time registration not permitted under SOPV-02 for this Euro standard. Only the FMVA vintage path is available.";
  } else if (vintageFullExemption) {
    description = `Vehicle is ${ageYears} years old: full vintage exemption from registration tax. Only customs/VAT (if non-EU) and fixed fees apply.`;
  } else if (vintage50Discount) {
    description = `Vehicle is ${ageYears} years old: 50 % vintage concession applied to registration tax. Black plates, €0 annual circulation tax.`;
  } else if (vintageEligible) {
    description = `Vehicle is ${ageYears} years old: vintage-eligible (classic status). Full RegTax still applies until 35 years, but annual circulation drops to €0 once certified.`;
  } else if (isEU && !isNew) {
    description = `Used vehicle from EU: no customs duty, no VAT. Only registration tax + fees.`;
  } else if (!isEU) {
    description = `Non-EU import: customs duty 10 % and VAT 18 % apply on CIF + duty.`;
  } else {
    description = `New vehicle: customs/VAT (if applicable) + full registration tax based on CO2 + length.`;
  }
  if (fuelType === "electric") {
    description +=
      " Battery EV: 100 % RegTax exempt, plus €0 annual road licence for the first 5 years from registration.";
  } else if (fuelType === "plugin_hybrid") {
    description +=
      " Plug-in hybrid: 100 % RegTax exempt and €0 annual road licence for 5 years — provided the electric-only range is ≥ 50 km (check the Certificate of Conformity).";
  } else if (fuelType === "hybrid") {
    description += " Regular hybrid: 25 % discount on the CO2 component.";
  }

  if (isFullEvExempt && fuelType === "plugin_hybrid") {
    warnings.push(
      `PHEV exemption requires an electric-only range of ≥ 50 km (per Transport Malta SOPV-02). Below that threshold the standard CO2 + length RegTax applies.`,
    );
  }
  if (isFullEvExempt && !input.applyEvGrant) {
    warnings.push(
      `Malta runs a sustainable-mobility grant scheme — up to €11,000 for a new BEV/PHEV (+ scrappage bonus), or a smaller used-EV grant for vehicles registered in Malta after 1 Jan 2025. Toggle "Apply EV grant" to subtract it.`,
    );
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
    registrationTax,
    vatOnRegTax,
    vrtFee: vrtFeeActual,
    numberPlatesFee: platesFee,
    registrationFee: REGISTRATION_FEE,
    vintageCertificationFee,
    vintageFmvaEstimate,
    evGrant,
    isFullEvExempt,
    fiveYearRoadTaxSavings,
    toreApplied,
    vrtRequired,
    totalCost,
    totalTaxesFees,
    euroStandard,
    vintageEligible,
    vintage50Discount,
    vintageFullExemption,
    registrationBlocked,
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
    numberPlatesFee: NUMBER_PLATES_FEE,
    registrationFee: REGISTRATION_FEE,
    exchangeRates: EXCHANGE_RATES,
    vintageEligibleAge: VINTAGE_ELIGIBLE_AGE,
    vintage50DiscountAge: VINTAGE_50_DISCOUNT_AGE,
    vintageFullExemptionAge: VINTAGE_FULL_EXEMPTION_AGE,
    minEuroForRegistration: MIN_EURO_FOR_REGISTRATION,
  };
}
