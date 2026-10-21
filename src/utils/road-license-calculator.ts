/**
 * Malta Road License (Annual Circulation Licence) Calculator
 *
 * Kaynak: Transport Malta SOPV 33 - List of Annual Circulation Fees
 * (Version 15, 1 Ocak 2026)
 * https://www.transport.gov.mt/Land/Downloads-eForms/Vehicles/POL-33-LIST-OF-ANNUAL-CIRCULATION-FEES-6087
 *
 * "Yaş" = üretim yılından itibaren geçen takvim yılı (licence yılı - üretim yılı).
 */

export type RoadLicenseVehicleType = "car" | "motorcycle";

export type RoadLicenseFuelType =
  | "petrol"
  | "diesel"
  | "hybrid"
  | "lpg"
  | "electric";

export type Co2Standard = "nedc" | "wltp";

export interface RoadLicenseInput {
  vehicleType: RoadLicenseVehicleType;
  fuelType: RoadLicenseFuelType;
  /** Üretim yılı */
  manufactureYear: number;
  /** Malta'da 1 Ocak 2009'dan önce tescil edilmiş mi */
  registeredBefore2009: boolean;
  /** Motor hacmi (cc) - 2009 öncesi araçlar ve motosikletler için */
  engineCapacity: number;
  /** CO2 emisyonu (g/km) - 2009 ve sonrası tescilli araçlar için */
  co2Emissions: number;
  /** CO2 ölçüm standardı - 2009 ve sonrası tescilli araçlar için */
  co2Standard: Co2Standard;
  /** Licence yılı (varsayılan: içinde bulunulan yıl) */
  licenceYear?: number;
}

export interface RoadLicenseOutput {
  /** Yıllık licence ücreti */
  annualFee: number;
  /** Aylık karşılık */
  monthlyEquivalent: number;
  /** İndirim öncesi tablo ücreti */
  tableFee: number;
  /** LPG indirimi (2009 öncesi araçlarda ücretten %10) */
  lpgDiscount: number;
  /** Araç yaşı (takvim yılı) */
  vehicleAge: number;
  /** Ücretin belirlendiği bant */
  band: string;
  /** Açıklama */
  description: string;
}

interface FeeRow {
  /** Bant üst sınırı (dahil) */
  max: number;
  label: string;
  /** Yaş 0..N ücretleri; son eleman "N+" yaşları için geçerli */
  fees: number[];
}

/** Yaş 0-6 aynı olan 2009 öncesi tablolar için yardımcı */
const flat = (value: number, count: number): number[] =>
  Array(count).fill(value);

// ==================== 2009 ÖNCESİ OTOMOBİLLER (cc'ye göre) ====================

/** SOPV 33 §2.1 - Benzinli M1, 1 Ocak 2009 öncesi tescilli (yaş 0..19+) */
const PRE_2009_PETROL: FeeRow[] = [
  {
    max: 1300,
    label: "Up to 1300cc",
    fees: [
      ...flat(90, 7),
      101,
      102,
      103,
      104,
      106,
      107,
      108,
      110,
      111,
      113,
      114,
      116,
      117,
    ],
  },
  {
    max: 1449,
    label: "1301-1449cc",
    fees: [
      ...flat(120, 7),
      134,
      136,
      137,
      139,
      141,
      143,
      145,
      147,
      148,
      150,
      152,
      154,
      156,
    ],
  },
  {
    max: 1500,
    label: "1450-1500cc",
    fees: [
      ...flat(135, 7),
      151,
      154,
      158,
      161,
      165,
      168,
      172,
      176,
      180,
      184,
      188,
      192,
      196,
    ],
  },
  {
    max: 1800,
    label: "1501-1800cc",
    fees: [
      ...flat(145, 7),
      162,
      167,
      172,
      177,
      182,
      187,
      193,
      199,
      205,
      211,
      218,
      225,
      232,
    ],
  },
  {
    max: 2000,
    label: "1801-2000cc",
    fees: [
      ...flat(225, 7),
      253,
      256,
      260,
      263,
      267,
      271,
      274,
      278,
      282,
      286,
      290,
      294,
      298,
    ],
  },
  {
    max: Infinity,
    label: "Over 2000cc",
    fees: [
      ...flat(395, 7),
      447,
      453,
      460,
      466,
      473,
      479,
      486,
      493,
      500,
      507,
      515,
      522,
      529,
    ],
  },
];

/** SOPV 33 §2.2 - Dizel M1, 1 Ocak 2009 öncesi tescilli (yaş 0..19+) */
const PRE_2009_DIESEL: FeeRow[] = [
  {
    max: 1300,
    label: "Up to 1300cc",
    fees: [
      ...flat(98, 7),
      109,
      110,
      112,
      113,
      115,
      116,
      118,
      119,
      121,
      123,
      124,
      126,
      127,
    ],
  },
  {
    max: 1449,
    label: "1301-1449cc",
    fees: [
      ...flat(130, 7),
      145,
      147,
      149,
      151,
      153,
      155,
      157,
      159,
      161,
      163,
      166,
      168,
      170,
    ],
  },
  {
    max: 1500,
    label: "1450-1500cc",
    fees: [
      ...flat(147, 7),
      164,
      168,
      172,
      175,
      179,
      183,
      187,
      191,
      196,
      200,
      205,
      209,
      214,
    ],
  },
  {
    max: 1800,
    label: "1501-1800cc",
    fees: [
      ...flat(157, 7),
      175,
      181,
      186,
      192,
      198,
      204,
      210,
      216,
      223,
      230,
      237,
      245,
      252,
    ],
  },
  {
    max: 2000,
    label: "1801-2000cc",
    fees: [
      ...flat(245, 7),
      276,
      280,
      283,
      287,
      291,
      295,
      299,
      303,
      308,
      312,
      316,
      320,
      325,
    ],
  },
  {
    max: Infinity,
    label: "Over 2000cc",
    fees: [
      ...flat(432, 7),
      489,
      496,
      503,
      510,
      517,
      525,
      532,
      540,
      548,
      556,
      563,
      572,
      580,
    ],
  },
];

// ==================== 2009 VE SONRASI OTOMOBİLLER (CO2'ye göre) ====================

/** CO2 bantlarının ortak ücret satırları (yaş 0..14+) */
const CO2_FEE_ROWS: number[][] = [
  [...flat(100, 5), 125, 138, 151, 166, 183, 201, 221, 244, 268, 295],
  [...flat(125, 5), 153, 166, 181, 198, 216, 236, 259, 283, 310, 339],
  [...flat(140, 5), 170, 185, 202, 220, 240, 262, 286, 312, 342, 374],
  [...flat(160, 5), 195, 213, 232, 253, 276, 302, 330, 361, 395, 433],
  [...flat(205, 5), 250, 273, 297, 324, 354, 387, 424, 463, 507, 556],
  [...flat(275, 5), 338, 369, 403, 441, 483, 528, 579, 634, 695, 762],
  [...flat(375, 5), 463, 506, 554, 607, 666, 730, 800, 878, 963, 1057],
  [...flat(525, 5), 650, 713, 781, 857, 940, 1032, 1125, 1125, 1125, 1125],
];

/** SOPV 33 §3.1 / §3.2 - NEDC CO2 bantları (benzin ve PM ≤ 0.005 g/km dizel) */
const NEDC_BANDS: { max: number; label: string }[] = [
  { max: 100, label: "0-100 g/km (NEDC)" },
  { max: 130, label: "101-130 g/km (NEDC)" },
  { max: 140, label: "131-140 g/km (NEDC)" },
  { max: 150, label: "141-150 g/km (NEDC)" },
  { max: 180, label: "151-180 g/km (NEDC)" },
  { max: 220, label: "181-220 g/km (NEDC)" },
  { max: 250, label: "221-250 g/km (NEDC)" },
  { max: Infinity, label: "Over 250 g/km (NEDC)" },
];

/** SOPV 33 §9 - WLTP CO2 bantları */
const WLTP_BANDS: { max: number; label: string }[] = [
  { max: 125, label: "0-125 g/km (WLTP)" },
  { max: 175, label: "126-175 g/km (WLTP)" },
  { max: 200, label: "176-200 g/km (WLTP)" },
  { max: 225, label: "201-225 g/km (WLTP)" },
  { max: 250, label: "226-250 g/km (WLTP)" },
  { max: 275, label: "251-275 g/km (WLTP)" },
  { max: 300, label: "276-300 g/km (WLTP)" },
  { max: Infinity, label: "Over 300 g/km (WLTP)" },
];

// ==================== MOTOSİKLETLER (cc'ye göre) ====================

/** SOPV 33 §2.3 - Motosiklet, 1 Ocak 2009 öncesi tescilli (yaş 0..19+) */
const PRE_2009_MOTORCYCLE: FeeRow[] = [
  { max: 125, label: "Up to 125cc", fees: [10] },
  { max: 350, label: "126-350cc", fees: [25] },
  {
    max: 500,
    label: "351-500cc",
    fees: [...flat(58, 7), 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76],
  },
  {
    max: 800,
    label: "501-800cc",
    fees: [...flat(60, 7), 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 77, 78, 79],
  },
  {
    max: Infinity,
    label: "Over 800cc",
    fees: [...flat(62, 7), 68, 69, 70, 71, 72, 73, 75, 76, 77, 78, 79, 80, 82],
  },
];

/** SOPV 33 §3.6 - Motosiklet, 1 Ocak 2009 ve sonrası tescilli (yaş 0..14+) */
const POST_2009_MOTORCYCLE: FeeRow[] = [
  { max: 125, label: "Up to 125cc", fees: [10] },
  { max: 350, label: "126-350cc", fees: [25] },
  {
    max: 500,
    label: "351-500cc",
    fees: [...flat(70, 5), 77, 85, 93, 102, 113, 124, 136, 150, 165, 182],
  },
  {
    max: 800,
    label: "501-800cc",
    fees: [...flat(70, 5), 83, 91, 100, 110, 121, 133, 146, 161, 177, 195],
  },
  {
    max: Infinity,
    label: "Over 800cc",
    fees: [...flat(80, 5), 88, 97, 106, 117, 129, 142, 156, 171, 189, 207],
  },
];

/** SOPV 33 §8 - Elektrikli / plug-in hibrit (≥50 km elektrikli menzil) */
const ELECTRIC_FEE_FIRST_YEARS = 0; // yaş 0-5
const ELECTRIC_FEE_LATER = 10; // yaş 6+
const ELECTRIC_FREE_UNTIL_AGE = 5;

/** SOPV 33 §10 - LPG dönüşümü %10 indirim */
const LPG_REDUCTION = 0.1;

const feeForAge = (fees: number[], age: number): number =>
  fees[Math.min(Math.max(0, age), fees.length - 1)];

const findRow = <T extends { max: number }>(rows: T[], value: number): T =>
  rows.find((row) => value <= row.max) ?? rows[rows.length - 1];

/**
 * Calculate annual road licence fee
 */
export function calculateRoadLicense(
  input: RoadLicenseInput,
): RoadLicenseOutput {
  const {
    vehicleType,
    fuelType,
    manufactureYear,
    registeredBefore2009,
    engineCapacity,
    co2Emissions,
    co2Standard,
    licenceYear = new Date().getFullYear(),
  } = input;

  const vehicleAge = Math.max(0, licenceYear - manufactureYear);

  let tableFee: number;
  let lpgDiscount = 0;
  let band: string;
  let description: string;

  if (fuelType === "electric") {
    tableFee =
      vehicleAge <= ELECTRIC_FREE_UNTIL_AGE
        ? ELECTRIC_FEE_FIRST_YEARS
        : ELECTRIC_FEE_LATER;
    band = "Electric / plug-in hybrid (≥50 km electric range)";
    description =
      vehicleAge <= ELECTRIC_FREE_UNTIL_AGE
        ? "Electric and plug-in hybrid vehicles pay no road licence for the first 6 years (years 0-5)."
        : "Electric and plug-in hybrid vehicles pay €10 a year from year 6 onwards.";
  } else if (vehicleType === "motorcycle") {
    const row = findRow(
      registeredBefore2009 ? PRE_2009_MOTORCYCLE : POST_2009_MOTORCYCLE,
      engineCapacity,
    );
    tableFee = feeForAge(row.fees, vehicleAge);
    band = row.label;
    description = `Motorcycle ${row.label}, ${vehicleAge} years from manufacture.`;
  } else if (registeredBefore2009) {
    const row = findRow(
      fuelType === "diesel" ? PRE_2009_DIESEL : PRE_2009_PETROL,
      engineCapacity,
    );
    tableFee = feeForAge(row.fees, vehicleAge);
    band = row.label;
    description = `Car registered before 2009: fee based on engine capacity (${row.label}) and age.`;
    if (fuelType === "lpg") {
      lpgDiscount = Math.round(tableFee * LPG_REDUCTION);
      description += " LPG conversion: 10% reduction applied.";
    }
  } else {
    // LPG: CO2 değeri %10 düşürülerek bant belirlenir
    const effectiveCo2 =
      fuelType === "lpg" ? co2Emissions * (1 - LPG_REDUCTION) : co2Emissions;
    const bands = co2Standard === "wltp" ? WLTP_BANDS : NEDC_BANDS;
    const bandIndex = bands.findIndex((b) => effectiveCo2 <= b.max);
    const index = bandIndex === -1 ? bands.length - 1 : bandIndex;
    tableFee = feeForAge(CO2_FEE_ROWS[index], vehicleAge);
    band = bands[index].label;
    description = `Car registered from 2009: fee based on CO2 band ${band} and age.`;
    if (fuelType === "lpg") {
      description += " LPG conversion: CO2 figure reduced by 10%.";
    }
    if (fuelType === "diesel") {
      description +=
        " Diesel rates assume particulate emissions up to 0.005 g/km (Euro 5 and later); older diesels pay more.";
    }
  }

  const annualFee = Math.max(0, tableFee - lpgDiscount);

  return {
    annualFee,
    monthlyEquivalent: Math.round((annualFee / 12) * 100) / 100,
    tableFee,
    lpgDiscount,
    vehicleAge,
    band,
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
