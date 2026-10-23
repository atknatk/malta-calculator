/**
 * Malta M1 (binek otomobil) Registration Tax — ortak tablo ve formül.
 *
 * Kaynak: Transport Malta SOPV 02 "Registering & Licensing of New & Used
 * Motor Vehicles", Version 38 (Ocak 2026), §12–13.
 * https://www.transport.gov.mt/Land/Downloads-eForms/Vehicles/SOPV-02-REGISTERING-LICENSING-OF-NEW-USED-MOTOR-VEHICLES-3944
 *
 * Formül:
 *   RegTax = (CO2 g/km × RV × CO2 oranı%) + (Uzunluk mm × RV × uzunluk oranı%)
 *
 * - WLTP tablosu: CoC'de WLTP değeri olan araçlar (benzin ve dizel aynı).
 * - NEDC tablosu: aracın Euro standardının en güncel standarda göre kaç
 *   seviye geride olduğuna göre (latest / -1 / -2 / -3 ve öncesi).
 *   PM > 0.005 g/km olan dizeller (Euro 4 ve öncesi) daha yüksek sütunu öder.
 * - Hibrit (plug-in olmayan): CoC CO2 değeri %30 düşürülür (§13.6).
 * - LPG (autogas): CO2 %10 düşürülür (§13.7).
 * - BEV ve ≥50 km elektrik menzilli PHEV: muaf.
 * - M1 için yasal bir yaş amortisman tablosu yoktur; kullanılmış araçta RV,
 *   Transport Malta'nın Malta piyasa değeri değerlemesidir.
 */

export type Co2TestCycle = "wltp" | "nedc";

/** Aracın Euro standardı, en güncel standarda (Euro 6) göre kaç seviye geride */
export type EuroGap = 0 | 1 | 2 | 3;

export type RegTaxFuel =
  | "petrol"
  | "diesel"
  | "hybrid"
  | "plugin_hybrid"
  | "electric"
  | "lpg";

interface RateBand {
  maxCo2: number;
  rate: number;
}

/** SOPV 02 §12.1 — WLTP CO2 oranları (%) */
export const WLTP_CO2_RATES: RateBand[] = [
  { maxCo2: 120, rate: 0.04 },
  { maxCo2: 140, rate: 0.045 },
  { maxCo2: 150, rate: 0.05 },
  { maxCo2: 160, rate: 0.06 },
  { maxCo2: 190, rate: 0.07 },
  { maxCo2: 230, rate: 0.1 },
  { maxCo2: 260, rate: 0.11 },
  { maxCo2: Infinity, rate: 0.143 },
];

/** NEDC CO2 bant üst sınırları (g/km) */
const NEDC_BANDS = [100, 130, 140, 150, 180, 220, 250, Infinity];

/**
 * SOPV 02 §12.1 — NEDC benzin (ve PM ≤ 0.005 g/km dizel) oranları (%).
 * Sütunlar: [latest, latest-1, latest-2, latest-3 ve öncesi]
 */
export const NEDC_PETROL_RATES: number[][] = [
  [0.07, 0.15, 0.2, 0.23],
  [0.09, 0.17, 0.23, 0.26],
  [0.1, 0.19, 0.26, 0.3],
  [0.11, 0.22, 0.29, 0.33],
  [0.16, 0.24, 0.32, 0.37],
  [0.18, 0.26, 0.35, 0.4],
  [0.21, 0.29, 0.38, 0.44],
  [0.23, 0.31, 0.41, 0.47],
];

/**
 * SOPV 02 §12.1 — NEDC dizel, PM > 0.005 g/km oranları (%).
 * "Latest" sütunu yok; sütunlar: [latest-1, latest-2, latest-3 ve öncesi]
 */
export const NEDC_DIESEL_HIGH_PM_RATES: number[][] = [
  [0.21, 0.32, 0.37],
  [0.24, 0.36, 0.42],
  [0.27, 0.41, 0.47],
  [0.31, 0.45, 0.53],
  [0.33, 0.51, 0.6],
  [0.36, 0.56, 0.65],
  [0.4, 0.6, 0.7],
  [0.43, 0.65, 0.75],
];

/** SOPV 02 §12.2 — Uzunluk oranları (%) */
export const LENGTH_RATES: { maxMm: number; rate: number }[] = [
  { maxMm: 3450, rate: 0.002 },
  { maxMm: 3640, rate: 0.0022 },
  { maxMm: 3770, rate: 0.0024 },
  { maxMm: 4030, rate: 0.0026 },
  { maxMm: 4370, rate: 0.0028 },
  { maxMm: 4570, rate: 0.003 },
  { maxMm: 4770, rate: 0.0032 },
  { maxMm: Infinity, rate: 0.0034 },
];

/**
 * SOPV 02 §12.4 — AB dışından (UK dahil) ithal edilen, 5 yaşından büyük
 * kullanılmış M1 için minimum vergi (€). Yaş üretim yılından sayılır.
 * Sütunlar: yaş 6, 7, 8, 9, 10, 11, 12, 13, 14+
 */
export const NON_EU_MINIMUM_TAX: number[][] = [
  [900, 1000, 2107, 2360, 2644, 2961, 3316, 3714, 4160],
  [1100, 1200, 2529, 2832, 3172, 3553, 3979, 4457, 4992],
  [1300, 1400, 2810, 3147, 3525, 3948, 4421, 4952, 5546],
  [3920, 4390, 4917, 5507, 6168, 6908, 7737, 8666, 9706],
  [4480, 5018, 5620, 6294, 7049, 7895, 8843, 9904, 11092],
  [7840, 8781, 9834, 11015, 12336, 13817, 15475, 17332, 19412],
  [13440, 15053, 16859, 18882, 21148, 23686, 26528, 29712, 33277],
  [15120, 16934, 18967, 21243, 23792, 26647, 29844, 33426, 37437],
];

/** Plug-in olmayan hibritlerde CoC CO2 indirimi (§13.6) */
export const HYBRID_CO2_REDUCTION = 0.3;
/** LPG araçlarda CO2 indirimi (§13.7) */
export const LPG_CO2_REDUCTION = 0.1;

export interface M1RegistrationTaxInput {
  /** CoC'deki CO2 (g/km) */
  co2: number;
  lengthMm: number;
  /** Registration Value (€) */
  registrationValue: number;
  fuelType: RegTaxFuel;
  testCycle: Co2TestCycle;
  /** Sadece NEDC için: en güncel Euro standardına göre fark */
  euroGap: EuroGap;
  /** Dizelde PM > 0.005 g/km mi (DPF'siz, genelde Euro 4 ve öncesi) */
  dieselHighPm?: boolean;
}

export interface M1RegistrationTaxResult {
  exempt: boolean;
  /** İndirimler sonrası tabloya giren CO2 değeri */
  adjustedCo2: number;
  co2RatePercent: number;
  lengthRatePercent: number;
  co2Tax: number;
  lengthTax: number;
  total: number;
}

export function adjustedCo2(co2: number, fuelType: RegTaxFuel): number {
  if (fuelType === "hybrid") return co2 * (1 - HYBRID_CO2_REDUCTION);
  if (fuelType === "lpg") return co2 * (1 - LPG_CO2_REDUCTION);
  return co2;
}

function nedcBandIndex(co2: number): number {
  // Bantlar tam sayı g/km olarak tanımlı (örn. 101–130)
  const rounded = Math.round(co2);
  return NEDC_BANDS.findIndex((max) => rounded <= max);
}

export function getCo2RatePercent(
  co2: number,
  testCycle: Co2TestCycle,
  euroGap: EuroGap,
  dieselHighPm = false,
): number {
  const rounded = Math.round(co2);
  if (testCycle === "wltp") {
    return WLTP_CO2_RATES.find((b) => rounded <= b.maxCo2)!.rate;
  }
  const row = nedcBandIndex(co2);
  if (dieselHighPm) {
    // "Latest" sütunu yok — en yakın sütun latest-1
    const col = Math.max(0, euroGap - 1);
    return NEDC_DIESEL_HIGH_PM_RATES[row][col];
  }
  return NEDC_PETROL_RATES[row][euroGap];
}

export function getLengthRatePercent(lengthMm: number): number {
  return LENGTH_RATES.find((b) => lengthMm <= b.maxMm)!.rate;
}

export function calculateM1RegistrationTax(
  input: M1RegistrationTaxInput,
): M1RegistrationTaxResult {
  const { lengthMm, registrationValue: rv, fuelType } = input;

  if (fuelType === "electric" || fuelType === "plugin_hybrid") {
    return {
      exempt: true,
      adjustedCo2: 0,
      co2RatePercent: 0,
      lengthRatePercent: 0,
      co2Tax: 0,
      lengthTax: 0,
      total: 0,
    };
  }

  const co2 = adjustedCo2(input.co2, fuelType);
  const co2RatePercent = getCo2RatePercent(
    co2,
    input.testCycle,
    input.euroGap,
    fuelType === "diesel" && input.dieselHighPm,
  );
  const lengthRatePercent = getLengthRatePercent(lengthMm);

  const co2Tax = (co2 * rv * co2RatePercent) / 100;
  const lengthTax = (lengthMm * rv * lengthRatePercent) / 100;

  return {
    exempt: false,
    adjustedCo2: Math.round(co2),
    co2RatePercent,
    lengthRatePercent,
    co2Tax: Math.round(co2Tax),
    lengthTax: Math.round(lengthTax),
    total: Math.round(co2Tax + lengthTax),
  };
}

/**
 * AB dışı (UK dahil), 5 yaşından büyük kullanılmış M1 için minimum vergi.
 * 5 yaş ve altı için 0 döner. Bantlar NEDC CO2 bantlarıdır.
 */
export function getNonEuMinimumTax(co2: number, ageYears: number): number {
  if (ageYears <= 5) return 0;
  const row = nedcBandIndex(co2);
  const col = Math.min(ageYears, 14) - 6;
  return NON_EU_MINIMUM_TAX[row][col];
}

/** Model yılından nominal Euro standardı (M1, AB tip onay tarihleri) */
export function euroStandardFromYear(modelYear: number): number {
  if (modelYear >= 2015) return 6;
  if (modelYear >= 2011) return 5;
  if (modelYear >= 2006) return 4;
  if (modelYear >= 2001) return 3;
  if (modelYear >= 1997) return 2;
  if (modelYear >= 1993) return 1;
  return 0;
}

/** Euro standardını en güncel (Euro 6) standarda göre farka çevirir */
export function euroGapFromStandard(euro: number): EuroGap {
  return Math.min(3, Math.max(0, 6 - euro)) as EuroGap;
}
