/**
 * Malta VRT (Vehicle Roadworthiness Test) Calculator
 *
 * Kaynak: S.L. 65.15 Motor Vehicle Roadworthiness Test Regulations
 * (konsolide 1 Ağustos 2025) — Second ve Eighth Schedule.
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
  /** Gross vehicle weight in kg (buses/trailers: > 3,500 kg = heavy) */
  grossWeight?: number;
  /** Is it a re-test */
  isRetest: boolean;
  /** Odometer reading in km (cars/vans: annual test above 160,000 km) */
  mileageKm?: number;
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
 * S.L. 65.15 Eighth Schedule — maksimum "full fee" (KDV ve idari ücret dahil,
 * 1 Ocak 2023'ten beri). Re-test en fazla tam ücretin %50'si.
 * Otobüs ve römorklar: ≤ 3.5 t €41.32, > 3.5 t €46.10.
 */
const VRT_FEES = {
  car: 30.27,
  motorcycle: 24.33,
  commercial_light: 41.32,
  commercial_heavy: 46.1,
  bus: { light: 41.32, heavy: 46.1 },
  trailer: { light: 41.32, heavy: 46.1 },
};

const RETEST_RATIO = 0.5;
const HEAVY_WEIGHT_KG = 3500;
const HIGH_MILEAGE_KM = 160000;

interface TestSchedule {
  /** İlk test: ilk tescilden kaç yıl sonra */
  firstTestYears: number;
  /** Sonraki test aralığı (ay) */
  intervalMonths: number;
  /** 160,000 km sonrası yıllık mı */
  annualOverHighMileage: boolean;
}

/**
 * S.L. 65.15 Second/Eighth Schedule test sıklık kodları:
 *   B: 1 yıl, sonra yıllık · C: 2 yıl, sonra 2 yılda bir
 *   D: 4 yıl, sonra 2 yılda bir · E: 160,000 km sonrası yıllık
 * Motosiklet (Category VII, >125cc): kod A — bakanlık bildirimiyle belirlenir.
 */
function getSchedule(
  vehicleType: VRTInput["vehicleType"],
  heavy: boolean,
): TestSchedule | null {
  switch (vehicleType) {
    case "car":
      return {
        firstTestYears: 4,
        intervalMonths: 24,
        annualOverHighMileage: true,
      };
    case "commercial_light":
      return {
        firstTestYears: 2,
        intervalMonths: 24,
        annualOverHighMileage: true,
      };
    case "commercial_heavy":
    case "bus":
      return {
        firstTestYears: 1,
        intervalMonths: 12,
        annualOverHighMileage: false,
      };
    case "trailer":
      return heavy
        ? {
            firstTestYears: 1,
            intervalMonths: 12,
            annualOverHighMileage: false,
          }
        : {
            firstTestYears: 2,
            intervalMonths: 24,
            annualOverHighMileage: false,
          };
    case "motorcycle":
      return null;
  }
}

/**
 * Calculate VRT fees
 */
export function calculateVRT(input: VRTInput): VRTOutput {
  const { vehicleType, vehicleAge, isRetest } = input;
  const heavy = (input.grossWeight ?? 0) > HEAVY_WEIGHT_KG;
  const highMileage = (input.mileageKm ?? 0) > HIGH_MILEAGE_KM;

  const feeEntry = VRT_FEES[vehicleType] ?? VRT_FEES.car;
  const fullFee =
    typeof feeEntry === "number"
      ? feeEntry
      : heavy
        ? feeEntry.heavy
        : feeEntry.light;
  const retestFee = Math.round(fullFee * RETEST_RATIO * 100) / 100;
  const testFee = isRetest ? retestFee : fullFee;

  const schedule = getSchedule(vehicleType, heavy);

  let nextTestDue = 0;
  let frequency = "";
  if (!schedule) {
    frequency =
      "Interval set by ministerial notice — confirm with Transport Malta";
  } else {
    const annual = schedule.annualOverHighMileage && highMileage;
    const interval = annual ? 12 : schedule.intervalMonths;
    if (vehicleAge < schedule.firstTestYears && !annual) {
      nextTestDue = (schedule.firstTestYears - vehicleAge) * 12;
      frequency = `First test ${schedule.firstTestYears} year${schedule.firstTestYears === 1 ? "" : "s"} after first registration, then ${schedule.intervalMonths === 12 ? "every year" : "every 2 years"}`;
    } else {
      nextTestDue = interval;
      frequency =
        interval === 12
          ? annual
            ? "Annual (over 160,000 km)"
            : "Annual test required"
          : "Every 2 years";
    }
  }

  const vehicleNames: { [key: string]: string } = {
    car: "private car",
    motorcycle: "motorcycle",
    commercial_light: "light commercial vehicle (N1)",
    commercial_heavy: "heavy goods vehicle (N2/N3)",
    bus: "bus/minibus",
    trailer: "trailer",
  };

  const description = isRetest
    ? `Maximum re-test fee for a ${vehicleNames[vehicleType]} (50% of the full fee).`
    : `Maximum official VRT fee for a ${vehicleNames[vehicleType]} under S.L. 65.15, including VAT. Test stations may charge less.`;

  const notes: string[] = [
    "VRT = Vehicle Roadworthiness Test, done at licensed private test stations",
    "A pass must be dated within 90 days before your road licence renewal",
    "Bring the vehicle logbook and a valid insurance cover",
    "A re-test costs at most 50% of the full fee",
  ];

  if (vehicleType === "car" || vehicleType === "commercial_light") {
    notes.push("Once the odometer passes 160,000 km, the test becomes annual");
  }
  if (vehicleType === "motorcycle") {
    notes.push(
      "Motorcycles over 125cc are in the test scheme, but the interval is set by ministerial notice",
    );
  }
  notes.push(
    "Taxis, chauffeur-driven cars and ambulances need an annual test from year 1",
  );

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
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get VRT info
 */
export function getVRTInfo() {
  return {
    fees: VRT_FEES,
    retestRatio: RETEST_RATIO,
  };
}
