/**
 * Malta VRT (Vehicle Roadworthiness Test) Calculator
 * Based on Transport Malta vehicle inspection regulations
 */

export interface VRTInput {
  /** Vehicle type */
  vehicleType:
    | "car"
    | "motorcycle"
    | "commercial_light"
    | "commercial_heavy"
    | "bus"
    | "trailer";
  /** Vehicle age in years */
  vehicleAge: number;
  /** Gross vehicle weight in kg (for commercial) */
  grossWeight?: number;
  /** Is it a re-test */
  isRetest: boolean;
  /** Number of axles (for heavy vehicles) */
  axles?: number;
}

export interface VRTOutput {
  /** Test fee */
  testFee: number;
  /** Re-test fee (if applicable) */
  retestFee: number;
  /** Next test due (months from now) */
  nextTestDue: number;
  /** Test frequency description */
  frequency: string;
  /** Description */
  description: string;
  /** Important notes */
  notes: string[];
}

/**
 * VRT fees by vehicle type (EUR)
 */
const VRT_FEES = {
  car: {
    standard: 36,
    retest: 18,
  },
  motorcycle: {
    standard: 25,
    retest: 12,
  },
  commercial_light: {
    standard: 42, // Up to 3.5 tonnes
    retest: 21,
  },
  commercial_heavy: {
    standard: 58, // Over 3.5 tonnes
    retest: 29,
  },
  bus: {
    standard: 65,
    retest: 32,
  },
  trailer: {
    standard: 30,
    retest: 15,
  },
};

/**
 * Test frequency rules based on vehicle age
 */
const TEST_FREQUENCY = {
  car: [
    { maxAge: 4, months: 0 }, // New cars: first test at 4 years
    { maxAge: 10, months: 24 }, // 4-10 years: every 2 years
    { maxAge: Infinity, months: 12 }, // 10+ years: annual
  ],
  motorcycle: [
    { maxAge: 4, months: 0 },
    { maxAge: 10, months: 24 },
    { maxAge: Infinity, months: 12 },
  ],
  commercial_light: [
    { maxAge: 1, months: 0 }, // First test at 1 year
    { maxAge: Infinity, months: 12 }, // Then annual
  ],
  commercial_heavy: [
    { maxAge: 1, months: 0 },
    { maxAge: Infinity, months: 12 },
  ],
  bus: [
    { maxAge: 1, months: 0 },
    { maxAge: Infinity, months: 6 }, // Every 6 months
  ],
  trailer: [
    { maxAge: 1, months: 0 },
    { maxAge: Infinity, months: 12 },
  ],
};

/**
 * Get test frequency for vehicle type and age
 */
function getTestFrequency(vehicleType: string, age: number): number {
  const rules =
    TEST_FREQUENCY[vehicleType as keyof typeof TEST_FREQUENCY] ||
    TEST_FREQUENCY.car;
  for (const rule of rules) {
    if (age <= rule.maxAge) {
      return rule.months;
    }
  }
  return 12;
}

/**
 * Calculate VRT fees
 */
export function calculateVRT(input: VRTInput): VRTOutput {
  const { vehicleType, vehicleAge, isRetest } = input;

  const fees = VRT_FEES[vehicleType] || VRT_FEES.car;
  const testFee = isRetest ? fees.retest : fees.standard;
  const retestFee = fees.retest;

  const frequencyMonths = getTestFrequency(vehicleType, vehicleAge);

  // Calculate next test due
  let nextTestDue = frequencyMonths;
  if (frequencyMonths === 0) {
    // Vehicle doesn't need test yet
    if (vehicleType === "car" || vehicleType === "motorcycle") {
      nextTestDue = (4 - vehicleAge) * 12; // Months until 4 years old
    } else {
      nextTestDue = (1 - vehicleAge) * 12; // Months until 1 year old
    }
  }

  // Generate frequency description
  let frequency = "";
  if (frequencyMonths === 0) {
    if (vehicleType === "car" || vehicleType === "motorcycle") {
      frequency = "First test required at 4 years old";
    } else {
      frequency = "First test required at 1 year old";
    }
  } else if (frequencyMonths === 6) {
    frequency = "Every 6 months";
  } else if (frequencyMonths === 12) {
    frequency = "Annual test required";
  } else if (frequencyMonths === 24) {
    frequency = "Every 2 years";
  }

  // Generate description
  let description = "";
  const vehicleNames: { [key: string]: string } = {
    car: "private car",
    motorcycle: "motorcycle",
    commercial_light: "light commercial vehicle",
    commercial_heavy: "heavy commercial vehicle",
    bus: "bus/minibus",
    trailer: "trailer",
  };

  if (isRetest) {
    description = `Re-test fee for ${vehicleNames[vehicleType]} after failed initial inspection.`;
  } else {
    description = `VRT inspection fee for ${vehicleNames[vehicleType]}, ${vehicleAge} years old.`;
  }

  // Important notes
  const notes: string[] = [
    "Book your appointment online at Transport Malta website",
    "Bring vehicle registration document (log book)",
    "Vehicle must have valid insurance",
    "No major visible defects allowed (lights, tyres, etc.)",
  ];

  if (
    vehicleAge >= 10 &&
    (vehicleType === "car" || vehicleType === "motorcycle")
  ) {
    notes.push("Annual testing required for vehicles 10+ years old");
  }

  if (vehicleType === "bus") {
    notes.push("Buses require inspection every 6 months");
  }

  return {
    testFee,
    retestFee,
    nextTestDue: Math.max(0, nextTestDue),
    frequency,
    description,
    notes,
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
 * Get VRT info
 */
export function getVRTInfo() {
  return {
    fees: VRT_FEES,
    frequency: TEST_FREQUENCY,
  };
}
