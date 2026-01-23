/**
 * Malta Tax Configuration
 * Bu dosya Malta vergi dilimleri ve SSC oranlarını yıl bazında içerir.
 * Kaynak: Malta CFR (Commissioner for Revenue) ve Social Security Department
 */

// ==================== TİPLER ====================

export type TaxBracket = {
    min: number;
    max: number;
    rate: number;
    deduction: number;
};

export type TaxRateType = 'single' | 'married' | 'parent';

export type YearlyTaxConfig = {
    year: number;
    brackets: Record<TaxRateType, TaxBracket[]>;
};

export type SSCCategory = 'A' | 'B' | 'C' | 'D';

export type SSCRates = {
    categoryA: number;           // Haftalık sabit oran (18 yaş altı)
    categoryB: number;           // Haftalık max oran
    categoryCOld: number;        // 1962 öncesi doğumlular için max
    categoryCNew: number;        // 1962 sonrası doğumlular için max
    categoryDOld: number;        // 1962 öncesi doğumlular için sabit
    categoryDNew: number;        // 1962 sonrası doğumlular için sabit
    weeklyCapOld: number;        // Haftalık SSC base tavanı (1962 öncesi)
    weeklyCapNew: number;        // Haftalık SSC base tavanı (1962 sonrası)
    minimumWage: number;         // Haftalık minimum ücret
};

export type YearlySSCConfig = {
    year: number;
    rates: SSCRates;
};

/**
 * COLA (Cost of Living Adjustment) - Government Bonus
 * Paid quarterly: March, June, September, December
 * Amounts vary by quarter (5-week months get higher amount)
 */
export type COLAConfig = {
    march: number;      // Q1 (5 weeks)
    june: number;       // Q2 (5 weeks)
    september: number;  // Q3 (4 weeks)
    december: number;   // Q4 (4 weeks)
};

export type YearlyCOLAConfig = {
    year: number;
    cola: COLAConfig;
};

// ==================== VERGİ DİLİMLERİ ====================

/**
 * Malta Gelir Vergisi Dilimleri (2020-2026)
 * 
 * Hesaplama formülü:
 * tax = (income * rate) - deduction
 * 
 * Not: Malta'da gelir vergisi dilimleri son yıllarda sabit kalmıştır.
 * 2020'den bu yana "Single" kategorisi için dilimler aynıdır.
 */
export const taxBracketsByYear: YearlyTaxConfig[] = [
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
    {
        year: 2025,
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
        year: 2026,
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
];

// ==================== SSC ORANLARI ====================

/**
 * Malta Sosyal Güvenlik Katkı Oranları (2020-2026)
 * Kaynak: socialsecurity.gov.mt
 * 
 * Kategoriler:
 * A - 18 yaş altı
 * B - Part-time veya minimum ücret altı
 * C - Tam zamanlı çalışan (standart)
 * D - Tavan üstü gelir
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
            weeklyCapNew: 510.20,
            minimumWage: 181.25,
        },
    },
    {
        year: 2022,
        rates: {
            categoryA: 6.62,
            categoryB: 20.89,
            categoryCOld: 46.50,
            categoryCNew: 52.97,
            categoryDOld: 46.50,
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
        year: 2025,
        rates: {
            categoryA: 6.62,
            categoryB: 22.18,
            categoryCOld: 45.19,
            categoryCNew: 54.43,
            categoryDOld: 45.19,
            categoryDNew: 54.43,
            weeklyCapOld: 451.92,
            weeklyCapNew: 544.29,
            minimumWage: 221.78,
        },
    },
    {
        year: 2026,
        rates: {
            categoryA: 6.62,
            categoryB: 22.50,
            categoryCOld: 46.00,
            categoryCNew: 55.50,
            categoryDOld: 46.00,
            categoryDNew: 55.50,
            weeklyCapOld: 460.00,
            weeklyCapNew: 555.00,
            minimumWage: 225.00,
        },
    },
];

// ==================== COLA (Government Bonus) ====================

/**
 * Malta COLA (Cost of Living Adjustment) Values
 * Kaynak: Payroll Working.xlsx
 * 
 * COLA is paid quarterly in specific months:
 * - March: First quarter payment (5-week month bonus)
 * - June: Second quarter payment (5-week month bonus)
 * - September: Third quarter payment (4-week month)
 * - December: Fourth quarter payment (4-week month)
 * 
 * Total annual COLA for 2025: 512.52€
 */
export const colaByYear: YearlyCOLAConfig[] = [
    {
        year: 2024,
        cola: {
            march: 121.16,
            june: 135.10,
            september: 121.16,
            december: 135.10,
        },
    },
    {
        year: 2025,
        cola: {
            march: 121.16,
            june: 135.10,
            september: 121.16,
            december: 135.10,
        },
    },
    {
        year: 2026,
        cola: {
            march: 121.16,
            june: 135.10,
            september: 121.16,
            december: 135.10,
        },
    },
];

// ==================== YARDIMCI FONKSİYONLAR ====================

/**
 * Belirtilen yıl için vergi dilimlerini döndürür
 */
export function getTaxBracketsForYear(year: number, type: TaxRateType = 'single'): TaxBracket[] {
    const config = taxBracketsByYear.find(c => c.year === year);
    if (!config) {
        // Yıl bulunamazsa en güncel yılı kullan
        const latestConfig = taxBracketsByYear[taxBracketsByYear.length - 1];
        console.warn(`Tax brackets for ${year} not found, using ${latestConfig.year}`);
        return latestConfig.brackets[type];
    }
    return config.brackets[type];
}

/**
 * Belirtilen yıl için SSC oranlarını döndürür
 */
export function getSSCRatesForYear(year: number): SSCRates {
    const config = sscRatesByYear.find(c => c.year === year);
    if (!config) {
        // Yıl bulunamazsa en güncel yılı kullan
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
    return taxBracketsByYear.map(c => c.year);
}

/**
 * SSC kategorisini belirler
 */
export function determineSSCCategory(
    age: number,
    weeklyWage: number,
    minimumWage: number,
    weeklyCap: number
): SSCCategory {
    if (age < 18) return 'A';
    if (weeklyWage <= minimumWage) return 'B';
    if (weeklyWage < weeklyCap) return 'C';
    return 'D';
}

/**
 * 1962 öncesi doğumlu mu kontrol eder
 */
export function isBornBefore1962(birthDate: Date): boolean {
    return birthDate < new Date(1962, 0, 1);
}

/**
 * Belirtilen ay için COLA (Government Bonus) döndürür
 * COLA sadece Mart, Haziran, Eylül ve Aralık aylarında ödenir
 */
export function getCOLAForMonth(year: number, month: string): number {
    const config = colaByYear.find(c => c.year === year);
    if (!config) {
        // Yıl bulunamazsa en güncel yılı kullan
        const latestConfig = colaByYear[colaByYear.length - 1];
        if (!latestConfig) return 0;
        return getCOLAForMonthFromConfig(latestConfig.cola, month);
    }
    return getCOLAForMonthFromConfig(config.cola, month);
}

function getCOLAForMonthFromConfig(cola: COLAConfig, month: string): number {
    const monthLower = month.toLowerCase();
    switch (monthLower) {
        case 'mar':
        case 'march':
            return cola.march;
        case 'jun':
        case 'june':
            return cola.june;
        case 'sep':
        case 'september':
            return cola.september;
        case 'dec':
        case 'december':
            return cola.december;
        default:
            return 0;
    }
}

// ==================== HAFTA HESAPLAMA ====================

/**
 * Belirtilen ay için Pazartesi sayısını hesaplar
 * Malta SSC hafta sayısı = aydaki Pazartesi sayısı
 */
export function getMondaysInMonth(year: number, monthIndex: number): number {
    let count = 0;
    const lastDay = new Date(year, monthIndex + 1, 0).getDate();

    for (let day = 1; day <= lastDay; day++) {
        const date = new Date(year, monthIndex, day);
        if (date.getDay() === 1) { // 1 = Monday
            count++;
        }
    }
    return count;
}

/**
 * Belirtilen yıl için tüm ayların hafta sayılarını döndürür
 * Hafta sayısı = aydaki Pazartesi sayısı (Malta SSC hesabı)
 */
export function getWeeksPerMonthForYear(year: number): Record<string, number> {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
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
        'january': 0, 'february': 1, 'march': 2, 'april': 3,
        'may': 4, 'june': 5, 'july': 6, 'august': 7,
        'september': 8, 'october': 9, 'november': 10, 'december': 11
    };

    const monthIndex = monthMap[month.toLowerCase()];
    if (monthIndex === undefined) return 4; // fallback

    return getMondaysInMonth(year, monthIndex);
}

