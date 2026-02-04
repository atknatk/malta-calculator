/**
 * Malta Vehicle Registration Fee Calculator
 * Based on Transport Malta vehicle registration regulations (2026)
 * Source: https://www.transport.gov.mt
 */

import {
  calculateRoadLicense,
  type RoadLicenseInput,
} from "./road-license-calculator";

export interface VehicleRegistrationFeeInput {
  /** Vehicle type */
  vehicleType: "car" | "motorcycle" | "van" | "commercial";
  /** Number plate type */
  plateType: "random" | "personalised" | "customised";
  /** Whether vehicle is imported (requires VRT inspection) */
  isImported: boolean;
  /** Engine capacity in cc (for circulation fee) */
  engineCapacity?: number;
  /** CO2 emissions in g/km (for circulation fee) */
  co2Emissions?: number;
  /** Vehicle age in years (for circulation fee) */
  vehicleAge?: number;
  /** Fuel type (for circulation fee) */
  fuelType?:
    | "petrol"
    | "diesel"
    | "electric"
    | "hybrid"
    | "plugin_hybrid"
    | "lpg";
}

export interface VehicleRegistrationFeeOutput {
  /** Total registration fee */
  totalFee: number;
  /** Fixed administration fee */
  administrationFee: number;
  /** Number plates fee */
  platesFee: number;
  /** VRT inspection fee */
  vrtInspectionFee: number;
  /** First year circulation fee (annual road tax) */
  firstYearCirculationFee: number;
  /** Detailed breakdown */
  breakdown: { label: string; amount: number; description?: string }[];
  /** Description of fees */
  description: string;
}

/**
 * Fixed administration fee for vehicle registration
 * Source: Transport Malta (2026)
 */
const ADMINISTRATION_FEE = 15;

/**
 * VRT (Vehicle Registration Tax) inspection fee for imported vehicles
 * Source: Transport Malta (2026)
 */
const VRT_INSPECTION_FEE = 55;

/**
 * Number plate fees by vehicle type and plate type (EUR)
 * Source: Transport Malta (2026)
 */
const PLATE_FEES = {
  car: {
    random: 70,
    personalised: 200,
    customised: 1500,
  },
  van: {
    random: 70,
    personalised: 200,
    customised: 1500,
  },
  motorcycle: {
    random: 35,
    personalised: 200,
    customised: 1500,
  },
  commercial: {
    random: 70,
    personalised: 200,
    customised: 1500,
  },
} as const;

/**
 * Plate type descriptions
 */
const PLATE_TYPE_DESCRIPTIONS = {
  random: "Random number plates assigned by Transport Malta",
  personalised:
    "Personalised plates with your choice of letters/numbers (subject to availability)",
  customised: "Fully customised plates with premium options",
} as const;

/**
 * Vehicle type descriptions
 */
const VEHICLE_TYPE_DESCRIPTIONS = {
  car: "Private Car",
  motorcycle: "Motorcycle",
  van: "Van",
  commercial: "Commercial Vehicle",
} as const;

/**
 * Calculate vehicle registration fees
 */
export function calculateVehicleRegistrationFee(
  input: VehicleRegistrationFeeInput,
): VehicleRegistrationFeeOutput {
  const {
    vehicleType,
    plateType,
    isImported,
    engineCapacity = 1600,
    co2Emissions = 0,
    vehicleAge = 0,
    fuelType = "petrol",
  } = input;

  const breakdown: { label: string; amount: number; description?: string }[] =
    [];

  // 1. Administration Fee (Fixed)
  const administrationFee = ADMINISTRATION_FEE;
  breakdown.push({
    label: "Administration Fee",
    amount: administrationFee,
    description: "Fixed fee for processing registration",
  });

  // 2. Number Plates Fee
  const platesFee = PLATE_FEES[vehicleType][plateType];
  breakdown.push({
    label: `Number Plates (${plateType})`,
    amount: platesFee,
    description: PLATE_TYPE_DESCRIPTIONS[plateType],
  });

  // 3. VRT Inspection Fee (if imported)
  const vrtInspectionFee = isImported ? VRT_INSPECTION_FEE : 0;
  if (isImported) {
    breakdown.push({
      label: "VRT Inspection Fee",
      amount: vrtInspectionFee,
      description: "Required for all imported vehicles",
    });
  }

  // 4. First Year Circulation Fee (Annual Road Tax)
  // Use the road license calculator to determine first year road tax
  let firstYearCirculationFee = 0;
  let vehicleCategory: "private_car" | "motorcycle" | "commercial" | "vintage" =
    "private_car";

  if (vehicleType === "motorcycle") {
    vehicleCategory = "motorcycle";
  } else if (vehicleType === "commercial") {
    vehicleCategory = "commercial";
  } else {
    vehicleCategory = "private_car";
  }

  // Calculate annual road tax
  if (engineCapacity > 0) {
    const roadLicenseInput: RoadLicenseInput = {
      engineCapacity,
      co2Emissions,
      vehicleAge,
      fuelType,
      vehicleCategory,
      licensePeriod: 12, // First year
    };

    try {
      const roadLicenseResult = calculateRoadLicense(roadLicenseInput);
      firstYearCirculationFee = roadLicenseResult.annualFee;

      if (firstYearCirculationFee > 0) {
        breakdown.push({
          label: "First Year Circulation Fee",
          amount: firstYearCirculationFee,
          description: "Annual road tax for the first year",
        });
      } else if (fuelType === "electric") {
        breakdown.push({
          label: "First Year Circulation Fee",
          amount: 0,
          description: "Electric vehicles are exempt from road tax!",
        });
      }
    } catch (error) {
      // If calculation fails, set to 0
      firstYearCirculationFee = 0;
    }
  }

  // Calculate total
  const totalFee =
    administrationFee + platesFee + vrtInspectionFee + firstYearCirculationFee;

  // Generate description
  const vehicleDesc = VEHICLE_TYPE_DESCRIPTIONS[vehicleType];
  let description = `Total registration cost for a ${vehicleDesc.toLowerCase()} with ${plateType} plates`;

  if (isImported) {
    description += " (imported vehicle)";
  }

  description += ". Includes administration fee, number plates, ";

  if (isImported) {
    description += "VRT inspection, ";
  }

  if (firstYearCirculationFee > 0) {
    description += "and first year road tax.";
  } else if (fuelType === "electric") {
    description += "but electric vehicles are exempt from road tax!";
  } else {
    description += "and road tax.";
  }

  if (plateType === "customised") {
    description += " Customised plates offer premium customisation options.";
  } else if (plateType === "personalised") {
    description +=
      " Personalised plates are subject to availability and approval.";
  }

  return {
    totalFee: Math.round(totalFee),
    administrationFee: Math.round(administrationFee),
    platesFee: Math.round(platesFee),
    vrtInspectionFee: Math.round(vrtInspectionFee),
    firstYearCirculationFee: Math.round(firstYearCirculationFee),
    breakdown,
    description,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-MT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get vehicle registration fee info
 */
export function getVehicleRegistrationInfo() {
  return {
    administrationFee: ADMINISTRATION_FEE,
    vrtInspectionFee: VRT_INSPECTION_FEE,
    plateFees: PLATE_FEES,
    plateTypeDescriptions: PLATE_TYPE_DESCRIPTIONS,
    vehicleTypeDescriptions: VEHICLE_TYPE_DESCRIPTIONS,
  };
}
