/**
 * Malta Tax Configuration
 * Bu dosya Malta vergi dilimleri ve SSC oranlarını yıl bazında içerir.
 * Kaynak: Malta CFR (Commissioner for Revenue) ve Social Security Department
 *
 * Güncelleme: 2026-01-23
 * - 2024, 2025, 2026 vergi dilimleri resmi kaynaklardan güncellendi
 * - 2026 için çocuk sayısına göre vergi kategorileri eklendi
 */

// ==================== TİPLER ====================

export type TaxBracket = {
  min: number;
  max: number;
  rate: number;
  deduction: number;
};

/**
 * Vergi Oranı Kategorileri
 *
 * 2024 ve öncesi: single, married, parent (3 kategori)
 * 2025: single, married, parent (3 kategori, farklı sınırlar)
 * 2026+: 7 kategori (çocuk sayısına göre)
 */
export type TaxRateType =
  | "single"
  | "married"
  | "married_1child"
  | "married_2plus"
  | "parent"
  | "parent_1child"
  | "parent_2plus";

/**
 * Basit vergi tipi (UI için)
 */
export type SimpleTaxType = "single" | "married" | "parent";

/**
 * Çocuk sayısı tipi
 */
export type ChildCount = 0 | 1 | 2;

export type YearlyTaxConfig = {
  year: number;
  brackets: Partial<Record<TaxRateType, TaxBracket[]>>;
};

export type SSCCategory = "A" | "B" | "C";

export type SSCRates = {
  categoryA: number; // Haftalık sabit oran (18 yaş altı)
  categoryB: number; // Haftalık max oran
  categoryCOld: number; // 1962 öncesi doğumlular için max
  categoryCNew: number; // 1962 sonrası doğumlular için max
  categoryDOld: number; // 1962 öncesi doğumlular için sabit
  categoryDNew: number; // 1962 sonrası doğumlular için sabit
  weeklyCapOld: number; // Haftalık SSC base tavanı (1962 öncesi)
  weeklyCapNew: number; // Haftalık SSC base tavanı (1962 sonrası)
  minimumWage: number; // Haftalık minimum ücret
};

export type YearlySSCConfig = {
  year: number;
  rates: SSCRates;
};

/**
 * COLA (Cost of Living Adjustment) - Government Bonus
 * Paid quarterly: March, June, September, December
 */
export type COLAConfig = {
  march: number;
  june: number;
  september: number;
  december: number;
};

export type YearlyCOLAConfig = {
  year: number;
  cola: COLAConfig;
};

// ==================== VERGİ DİLİMLERİ ====================

/**
 * Malta Gelir Vergisi Dilimleri (2020-2026)
 * Kaynak: https://mtca.gov.mt/personal-tax/tax-rates/tax-ratesindividuals
 *
 * Hesaplama formülü: tax = (income * rate) - deduction
 */
export const taxBracketsByYear: YearlyTaxConfig[] = [
  // ==================== 2020-2023: Eski Sistem (3 kategori) ====================
  {
    year: 2020,
    brackets: {
      single: [
        { min: 0, max: 9100, rate: 0, deduction: 0 },
        { min: 9101, max: 14500, rate: 0.15, deduction: 1365 },
        { min: 14501, max: 19500, rate: 0.25, deduction: 2815 },
        { min: 19501, max: 60000, rate: 0.25, deduction: 2725 },
        { min: 60001, max: Infinity, rate: 0.35, deduction: 8725 },
      ],
      married: [
        { min: 0, max: 12700, rate: 0, deduction: 0 },
        { min: 12701, max: 21200, rate: 0.15, deduction: 1905 },
        { min: 21201, max: 28700, rate: 0.25, deduction: 4025 },
        { min: 28701, max: 60000, rate: 0.25, deduction: 3905 },
        { min: 60001, max: Infinity, rate: 0.35, deduction: 9905 },
      ],
      parent: [
        { min: 0, max: 10500, rate: 0, deduction: 0 },
        { min: 10501, max: 15800, rate: 0.15, deduction: 1575 },
        { min: 15801, max: 21200, rate: 0.25, deduction: 3155 },
        { min: 21201, max: 60000, rate: 0.25, deduction: 3050 },
        { min: 60001, max: Infinity, rate: 0.35, deduction: 9050 },
      ],
    },
  },
  {
    year: 2021,
    brackets: {
      single: [
        { min: 0, max: 9100, rate: 0, deduction: 0 },
        { min: 9101, max: 14500, rate: 0.15, deduction: 1365 },
        { min: 14501, max: 19500, rate: 0.25, deduction: 2815 },
        { min: 19501, max: 60000, rate: 0.25, deduction: 2725 },
        { min: 60001, max: Infinity, rate: 0.35, deduction: 8725 },
      ],
      married: [
        { min: 0, max: 12700, rate: 0, deduction: 0 },
        { min: 12701, max: 21200, rate: 0.15, deduction: 1905 },
        { min: 21201, max: 28700, rate: 0.25, deduction: 4025 },
        { min: 28701, max: 60000, rate: 0.25, deduction: 3905 },
        { min: 60001, max: Infinity, rate: 0.35, deduction: 9905 },
      ],
      parent: [
        { min: 0, max: 10500, rate: 0, deduction: 0 },
        { min: 10501, max: 15800, rate: 0.15, deduction: 1575 },
        { min: 15801, max: 21200, rate: 0.25, deduction: 3155 },
        { min: 21201, max: 60000, rate: 0.25, deduction: 3050 },
        { min: 60001, max: Infinity, rate: 0.35, deduction: 9050 },
      ],
    },
  },
  {
    year: 2022,
    brackets: {
      single: [
        { min: 0, max: 9100, rate: 0, deduction: 0 },
        { min: 9101, max: 14500, rate: 0.15, deduction: 1365 },
        { min: 14501, max: 19500, rate: 0.25, deduction: 2815 },
        { min: 19501, max: 60000, rate: 0.25, deduction: 2725 },
        { min: 60001, max: Infinity, rate: 0.35, deduction: 8725 },
      ],
      married: [
        { min: 0, max: 12700, rate: 0, deduction: 0 },
        { min: 12701, max: 21200, rate: 0.15, deduction: 1905 },
        { min: 21201, max: 28700, rate: 0.25, deduction: 4025 },
        { min: 28701, max: 60000, rate: 0.25, deduction: 3905 },
        { min: 60001, max: Infinity, rate: 0.35, deduction: 9905 },
      ],
      parent: [
        { min: 0, max: 10500, rate: 0, deduction: 0 },
        { min: 10501, max: 15800, rate: 0.15, deduction: 1575 },
        { min: 15801, max: 21200, rate: 0.25, deduction: 3155 },
        { min: 21201, max: 60000, rate: 0.25, deduction: 3050 },
        { min: 60001, max: Infinity, rate: 0.35, deduction: 9050 },
      ],
    },
  },
  {
    year: 2023,
    brackets: {
      single: [
        { min: 0, max: 9100, rate: 0, deduction: 0 },
        { min: 9101, max: 14500, rate: 0.15, deduction: 1365 },
        { min: 14501, max: 19500, rate: 0.25, deduction: 2815 },
        { min: 19501, max: 60000, rate: 0.25, deduction: 2725 },
        { min: 60001, max: Infinity, rate: 0.35, deduction: 8725 },
      ],
      married: [
        { min: 0, max: 12700, rate: 0, deduction: 0 },
        { min: 12701, max: 21200, rate: 0.15, deduction: 1905 },
        { min: 21201, max: 28700, rate: 0.25, deduction: 4025 },
        { min: 28701, max: 60000, rate: 0.25, deduction: 3905 },
        { min: 60001, max: Infinity, rate: 0.35, deduction: 9905 },
      ],
      parent: [
        { min: 0, max: 10500, rate: 0, deduction: 0 },
        { min: 10501, max: 15800, rate: 0.15, deduction: 1575 },
        { min: 15801, max: 21200, rate: 0.25, deduction: 3155 },
        { min: 21201, max: 60000, rate: 0.25, deduction: 3050 },
        { min: 60001, max: Infinity, rate: 0.35, deduction: 9050 },
      ],
    },
  },

  // ==================== 2024: Resmi Değerler (3 kategori) ====================
  // Kaynak: https://mtca.gov.mt/personal-tax/tax-rates/tax-ratesindividuals/2024
  {
    year: 2024,
    brackets: {
      single: [
        { min: 0, max: 9100, rate: 0, deduction: 0 },
        { min: 9101, max: 14500, rate: 0.15, deduction: 1365 },
        { min: 14501, max: 19500, rate: 0.25, deduction: 2815 },
        { min: 19501, max: 60000, rate: 0.25, deduction: 2725 },
        { min: 60001, max: Infinity, rate: 0.35, deduction: 8725 },
      ],
      married: [
        { min: 0, max: 12700, rate: 0, deduction: 0 },
        { min: 12701, max: 21200, rate: 0.15, deduction: 1905 },
        { min: 21201, max: 28700, rate: 0.25, deduction: 4025 },
        { min: 28701, max: 60000, rate: 0.25, deduction: 3905 },
        { min: 60001, max: Infinity, rate: 0.35, deduction: 9905 },
      ],
      parent: [
        { min: 0, max: 10500, rate: 0, deduction: 0 },
        { min: 10501, max: 15800, rate: 0.15, deduction: 1575 },
        { min: 15801, max: 21200, rate: 0.25, deduction: 3155 },
        { min: 21201, max: 60000, rate: 0.25, deduction: 3050 },
        { min: 60001, max: Infinity, rate: 0.35, deduction: 9050 },
      ],
    },
  },

  // ==================== 2025: Yeni Sınırlar (3 kategori) ====================
  // Kaynak: https://mtca.gov.mt/personal-tax/tax-rates/tax-ratesindividuals/2025
  {
    year: 2025,
    brackets: {
      single: [
        { min: 0, max: 12000, rate: 0, deduction: 0 },
        { min: 12001, max: 16000, rate: 0.15, deduction: 1800 },
        { min: 16001, max: 60000, rate: 0.25, deduction: 3400 },
        { min: 60001, max: Infinity, rate: 0.35, deduction: 9400 },
      ],
      married: [
        { min: 0, max: 15000, rate: 0, deduction: 0 },
        { min: 15001, max: 23000, rate: 0.15, deduction: 2250 },
        { min: 23001, max: 60000, rate: 0.25, deduction: 4550 },
        { min: 60001, max: Infinity, rate: 0.35, deduction: 10550 },
      ],
      parent: [
        { min: 0, max: 13000, rate: 0, deduction: 0 },
        { min: 13001, max: 17500, rate: 0.15, deduction: 1950 },
        { min: 17501, max: 60000, rate: 0.25, deduction: 3700 },
        { min: 60001, max: Infinity, rate: 0.35, deduction: 9700 },
      ],
    },
  },

  // ==================== 2026: 7 Kategori (çocuk sayısına göre) ====================
  // Kaynak: https://mtca.gov.mt/personal-tax/tax-rates/tax-ratesindividuals/2026
  {
    year: 2026,
    brackets: {
      // Single Rates
      single: [
        { min: 0, max: 12000, rate: 0, deduction: 0 },
        { min: 12001, max: 16000, rate: 0.15, deduction: 1800 },
        { min: 16001, max: 60000, rate: 0.25, deduction: 3400 },
        { min: 60001, max: Infinity, rate: 0.35, deduction: 9400 },
      ],
      // Married Rates (çocuksuz)
      married: [
        { min: 0, max: 15000, rate: 0, deduction: 0 },
        { min: 15001, max: 23000, rate: 0.15, deduction: 2250 },
        { min: 23001, max: 60000, rate: 0.25, deduction: 4550 },
        { min: 60001, max: Infinity, rate: 0.35, deduction: 10550 },
      ],
      // Married Rates with 1 child
      married_1child: [
        { min: 0, max: 17500, rate: 0, deduction: 0 },
        { min: 17501, max: 26500, rate: 0.15, deduction: 2625 },
        { min: 26501, max: 60000, rate: 0.25, deduction: 5275 },
        { min: 60001, max: Infinity, rate: 0.35, deduction: 11275 },
      ],
      // Married Rates with 2 children or more
      married_2plus: [
        { min: 0, max: 22500, rate: 0, deduction: 0 },
        { min: 22501, max: 32000, rate: 0.15, deduction: 3375 },
        { min: 32001, max: 60000, rate: 0.25, deduction: 6575 },
        { min: 60001, max: Infinity, rate: 0.35, deduction: 12575 },
      ],
      // Parent Rates (çocuksuz - boşanmış/dul ebeveyn)
      parent: [
        { min: 0, max: 13000, rate: 0, deduction: 0 },
        { min: 13001, max: 17500, rate: 0.15, deduction: 1950 },
        { min: 17501, max: 60000, rate: 0.25, deduction: 3700 },
        { min: 60001, max: Infinity, rate: 0.35, deduction: 9700 },
      ],
      // Parent Rates with 1 child
      parent_1child: [
        { min: 0, max: 14500, rate: 0, deduction: 0 },
        { min: 14501, max: 21000, rate: 0.15, deduction: 2175 },
        { min: 21001, max: 60000, rate: 0.25, deduction: 4275 },
        { min: 60001, max: Infinity, rate: 0.35, deduction: 10275 },
      ],
      // Parent Rates with 2 children or more
      parent_2plus: [
        { min: 0, max: 18500, rate: 0, deduction: 0 },
        { min: 18501, max: 25500, rate: 0.15, deduction: 2775 },
        { min: 25501, max: 60000, rate: 0.25, deduction: 5325 },
        { min: 60001, max: Infinity, rate: 0.35, deduction: 11325 },
      ],
    },
  },
];

// ==================== SSC ORANLARI ====================

/**
 * Malta Sosyal Güvenlik Katkı Oranları (2020-2026)
 * Kaynak: socialsecurity.gov.mt
 */
export const sscRatesByYear: YearlySSCConfig[] = [
  {
    year: 2020,
    rates: {
      categoryA: 6.62,
      categoryB: 19.77,
      categoryCOld: 44.41,
      categoryCNew: 50.63,
      categoryDOld: 44.41,
      categoryDNew: 50.63,
      weeklyCapOld: 444.14,
      weeklyCapNew: 506.31,
      minimumWage: 175.84,
    },
  },
  {
    year: 2021,
    rates: {
      categoryA: 6.62,
      categoryB: 20.04,
      categoryCOld: 45.19,
      categoryCNew: 51.02,
      categoryDOld: 45.19,
      categoryDNew: 51.02,
      weeklyCapOld: 451.92,
      weeklyCapNew: 510.2,
      minimumWage: 181.25,
    },
  },
  {
    year: 2022,
    rates: {
      categoryA: 6.62,
      categoryB: 20.89,
      categoryCOld: 46.5,
      categoryCNew: 52.97,
      categoryDOld: 46.5,
      categoryDNew: 52.97,
      weeklyCapOld: 464.96,
      weeklyCapNew: 529.73,
      minimumWage: 187.01,
    },
  },
  {
    year: 2023,
    rates: {
      categoryA: 6.62,
      categoryB: 21.14,
      categoryCOld: 47.73,
      categoryCNew: 54.43,
      categoryDOld: 47.73,
      categoryDNew: 54.43,
      weeklyCapOld: 477.31,
      weeklyCapNew: 544.29,
      minimumWage: 192.73,
    },
  },
  {
    year: 2024,
    rates: {
      categoryA: 6.62,
      categoryB: 22.94,
      categoryCOld: 49.04,
      categoryCNew: 55.93,
      categoryDOld: 49.04,
      categoryDNew: 55.93,
      weeklyCapOld: 490.38,
      weeklyCapNew: 559.31,
      minimumWage: 213.54,
    },
  },
  {
    // 2025 SSC Rates
    year: 2025,
    rates: {
      categoryA: 6.62,
      categoryB: 22.94,
      categoryCOld: 49.04,
      categoryCNew: 55.93,
      categoryDOld: 49.04,
      categoryDNew: 55.93,
      weeklyCapOld: 490.38,
      weeklyCapNew: 559.31,
      minimumWage: 221.78,
    },
  },
  {
    // 2026 SSC Rates - Excel Payroll Working.xlsx ile uyumlu
    year: 2026,
    rates: {
      categoryA: 6.62,
      categoryB: 22.94,
      categoryCOld: 49.04,
      categoryCNew: 55.93,
      categoryDOld: 49.04,
      categoryDNew: 55.93,
      weeklyCapOld: 490.38,
      weeklyCapNew: 559.31,
      minimumWage: 225.0,
    },
  },
];

// ==================== COLA (Government Bonus) ====================

/**
 * Malta COLA (Cost of Living Adjustment) Values
 * Kaynak: Payroll Working.xlsx
 */
export const colaByYear: YearlyCOLAConfig[] = [
  {
    year: 2024,
    cola: {
      march: 121.16,
      june: 135.1,
      september: 121.16,
      december: 135.1,
    },
  },
  {
    year: 2025,
    cola: {
      march: 121.16,
      june: 135.1,
      september: 121.16,
      december: 135.1,
    },
  },
  {
    year: 2026,
    cola: {
      march: 121.16,
      june: 135.1,
      september: 121.16,
      december: 135.1,
    },
  },
];

// ==================== YARDIMCI FONKSİYONLAR ====================

/**
 * Basit vergi tipi ve çocuk sayısından tam TaxRateType belirler
 * 2025 ve öncesi için çocuk sayısı dikkate alınmaz
 */
export function resolveTaxRateType(
  year: number,
  simpleType: SimpleTaxType,
  childCount: ChildCount = 0,
): TaxRateType {
  // 2025 ve öncesi: çocuk sayısı yok
  if (year <= 2025) {
    return simpleType;
  }

  // 2026+: çocuk sayısına göre
  if (simpleType === "single") {
    return "single";
  }

  if (simpleType === "married") {
    if (childCount === 0) return "married";
    if (childCount === 1) return "married_1child";
    return "married_2plus";
  }

  if (simpleType === "parent") {
    if (childCount === 0) return "parent";
    if (childCount === 1) return "parent_1child";
    return "parent_2plus";
  }

  return simpleType;
}

/**
 * Belirtilen yıl için vergi dilimlerini döndürür
 */
export function getTaxBracketsForYear(
  year: number,
  type: TaxRateType = "single",
): TaxBracket[] {
  const config = taxBracketsByYear.find((c) => c.year === year);
  if (!config) {
    const latestConfig = taxBracketsByYear[taxBracketsByYear.length - 1];
    console.warn(
      `Tax brackets for ${year} not found, using ${latestConfig.year}`,
    );
    return latestConfig.brackets[type] || latestConfig.brackets["single"] || [];
  }

  // Eğer istenen kategori yoksa (ör: 2024'te married_1child), base kategoriye fallback
  if (!config.brackets[type]) {
    // Fallback: married_1child -> married, parent_1child -> parent
    const baseType = type.replace(/_1child|_2plus/g, "") as TaxRateType;
    return config.brackets[baseType] || config.brackets["single"] || [];
  }

  return config.brackets[type] || [];
}

/**
 * Belirtilen yıl için SSC oranlarını döndürür
 */
export function getSSCRatesForYear(year: number): SSCRates {
  const config = sscRatesByYear.find((c) => c.year === year);
  if (!config) {
    const latestConfig = sscRatesByYear[sscRatesByYear.length - 1];
    console.warn(`SSC rates for ${year} not found, using ${latestConfig.year}`);
    return latestConfig.rates;
  }
  return config.rates;
}

/**
 * Mevcut yıl listesini döndürür
 */
export function getAvailableYears(): number[] {
  return taxBracketsByYear.map((c) => c.year);
}

/**
 * SSC kategorisini belirler
 */
export function determineSSCCategory(
  age: number,
  weeklyWage: number,
  minimumWage: number,
): SSCCategory {
  if (age < 18) return "A";
  if (weeklyWage <= minimumWage) return "B";
  return "C";
}

/**
 * 1962 öncesi doğumlu mu kontrol eder
 */
export function isBornBefore1962(birthDate: Date): boolean {
  return birthDate < new Date(1962, 0, 1);
}

/**
 * Belirtilen ay için COLA (Government Bonus) döndürür
 */
export function getCOLAForMonth(year: number, month: string): number {
  const config = colaByYear.find((c) => c.year === year);
  if (!config) {
    const latestConfig = colaByYear[colaByYear.length - 1];
    if (!latestConfig) return 0;
    return getCOLAForMonthFromConfig(latestConfig.cola, month);
  }
  return getCOLAForMonthFromConfig(config.cola, month);
}

function getCOLAForMonthFromConfig(cola: COLAConfig, month: string): number {
  const monthLower = month.toLowerCase();
  switch (monthLower) {
    case "mar":
    case "march":
      return cola.march;
    case "jun":
    case "june":
      return cola.june;
    case "sep":
    case "september":
      return cola.september;
    case "dec":
    case "december":
      return cola.december;
    default:
      return 0;
  }
}

// ==================== HAFTA HESAPLAMA ====================

/**
 * Belirtilen ay için Pazartesi sayısını hesaplar
 */
export function getMondaysInMonth(year: number, monthIndex: number): number {
  let count = 0;
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();

  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, monthIndex, day);
    if (date.getDay() === 1) {
      count++;
    }
  }
  return count;
}

/**
 * Belirtilen yıl için tüm ayların hafta sayılarını döndürür
 */
export function getWeeksPerMonthForYear(year: number): Record<string, number> {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const result: Record<string, number> = {};
  months.forEach((month, idx) => {
    result[month] = getMondaysInMonth(year, idx);
  });

  return result;
}

/**
 * Belirtilen yıl ve ay için hafta sayısını döndürür
 */
export function getWeeksForMonth(year: number, month: string): number {
  const monthMap: Record<string, number> = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };

  const monthIndex = monthMap[month.toLowerCase()];
  if (monthIndex === undefined) return 4;

  return getMondaysInMonth(year, monthIndex);
}

/**
 * Belirtilen yıl için çocuk sayısının vergi hesaplamasında etkili olup olmadığını döndürür
 */
export function isChildCountEffective(year: number): boolean {
  return year >= 2026;
}
