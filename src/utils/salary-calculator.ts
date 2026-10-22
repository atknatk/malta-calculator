/**
 * Malta Salary Calculator
 * Excel formüllerine uygun hesaplama mantığı
 * Kaynak: Payroll Working.xlsx ve .agent/rules/malta-payroll-rules.md
 */

import {
  getTaxBracketsForYear,
  getSSCRatesForYear,
  getCOLAForMonth,
  isBornBefore1962,
  getWeeksForMonth,
  resolveTaxRateType,
  type TaxBracket,
  type SSCRates,
  type SSCCategory,
  type TaxRateType,
} from "@/config/malta-tax-config";

import {
  Month,
  type MonthlySalaryInput,
  type MonthlySalaryOutput,
  type SalaryCalculatorConfig,
} from "@/types/salary-calculator-type";

const round2 = (value: number): number => Math.round(value * 100) / 100;

// ==================== SSC HESAPLAMA ====================

/**
 * Haftalık SSC Base hesaplar (cap uygulanır)
 * Excel formülü: IF((B*12)/52 < CAP, (B*12)/52 * weeks, CAP * weeks)
 */
function calculateSSCBase(
  basicSalary: number,
  weeksInMonth: number,
  weeklyCap: number,
): number {
  const weeklyEquivalent = (basicSalary * 12) / 52;

  if (weeklyEquivalent < weeklyCap) {
    return weeklyEquivalent * weeksInMonth;
  }
  return weeklyCap * weeksInMonth;
}

/**
 * SSC Tax hesaplar (kategori bazlı)
 * Excel formülleri: Kategori A, B, C, D için farklı hesaplamalar
 */
function calculateSSCTax(
  sscBase: number,
  weeksInMonth: number,
  sscCategory: SSCCategory,
  sscRates: SSCRates,
  isBornBefore1962Flag: boolean,
): number {
  switch (sscCategory) {
    case "A":
      // 18 yaş altı - sabit haftalık oran
      return sscRates.categoryA * weeksInMonth;

    case "B":
      // Part-time veya minimum ücret altı
      // MIN(categoryB * weeks, sscBase * 0.10)
      return Math.min(
        sscRates.categoryB * weeksInMonth,
        Math.round(sscBase * 0.1 * 100) / 100,
      );

    case "C":
      // Tam zamanlı çalışan
      if (isBornBefore1962Flag) {
        return Math.min(
          sscRates.categoryCOld * weeksInMonth,
          Math.round(sscBase * 0.1 * 100) / 100,
        );
      }
      return Math.min(
        sscRates.categoryCNew * weeksInMonth,
        Math.round(sscBase * 0.1 * 100) / 100,
      );

    default:
      return 0;
  }
}

// ==================== VERGİ HESAPLAMA ====================

/**
 * Yıllık gelir için uygulanacak vergi dilimini bulur
 */
function findTaxBracket(
  annualIncome: number,
  brackets: TaxBracket[],
): TaxBracket | null {
  for (const bracket of brackets) {
    if (annualIncome >= bracket.min && annualIncome <= bracket.max) {
      return bracket;
    }
  }
  // Gelir son dilimin üstündeyse son dilimi kullan
  return brackets[brackets.length - 1];
}

/**
 * Aylık gelir vergisi hesaplar — FSS Main Method (kümülatif sistem)
 *
 * Kaynak: FSS Rules (S.L. 372.14) Main Method, 4 adım:
 *  A = (yıl başından bu döneme kadar toplam main emoluments / dönem no) × 12
 *  P = A'ya vergi tablosu uygulanır (A × oran − indirim)
 *  D = P × dönem no / 12
 *  L = D − bu döneme kadar kesilmiş toplam vergi
 *
 * Dönem no takvim ayıdır (Ocak = 1). Yıl ortasında işe başlayan biri için
 * kümülatif gelir çalışmadığı ayları içermediğinden yıllık projeksiyon
 * düşük kalır ve tam yıl çalışıyormuş gibi vergi kesilmez. Aynı yıl önceki
 * işverenden gelen matrah ve vergi (FS3) kümülatife dahil edilir.
 */
function calculateMonthlyIncomeTax(
  cumulativeIncomeBase: number,
  previousCumulativeTax: number,
  monthNumber: number,
  annualIncome: number,
  taxBrackets: TaxBracket[],
): number {
  const bracket = findTaxBracket(annualIncome, taxBrackets);

  if (!bracket || bracket.rate === 0) {
    return 0;
  }

  const projectedAnnualIncome = (cumulativeIncomeBase / monthNumber) * 12;
  const yearlyProjectedTax =
    projectedAnnualIncome * bracket.rate - bracket.deduction;
  const monthlyTax =
    (yearlyProjectedTax / 12) * monthNumber - previousCumulativeTax;
  return Math.max(0, monthlyTax);
}

/**
 * Yıllık gerçek gelir üzerinden vergi borcu (yıl sonu mahsup için)
 */
function calculateAnnualTaxLiability(
  annualIncome: number,
  taxBrackets: TaxBracket[],
): number {
  if (annualIncome <= 0) return 0;
  const bracket = findTaxBracket(annualIncome, taxBrackets);
  if (!bracket) return 0;
  return Math.max(0, annualIncome * bracket.rate - bracket.deduction);
}

// ==================== KIST (PRO-RATA) YARDIMCILARI ====================

const MONTH_ORDER = Object.values(Month);
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Tarihi gün başına (yerel saat) indirger
 */
function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * [from, to] aralığının (dahil) çalışma dönemiyle kesişen gün sayısı
 */
function employedDaysBetween(
  from: Date,
  to: Date,
  employmentStart: Date,
  employmentEnd: Date,
): number {
  const start = Math.max(from.getTime(), employmentStart.getTime());
  const end = Math.min(to.getTime(), employmentEnd.getTime());
  if (end < start) return 0;
  return Math.round((end - start) / DAY_MS) + 1;
}

/**
 * Çalışma dönemini çözer. Tarih verilmezse dönem yılın dışına taşar (tüm yıl
 * ve önceki yıldan devam eden çalışma kabul edilir).
 */
export function resolveEmploymentPeriod(config: SalaryCalculatorConfig): {
  start: Date;
  end: Date;
} {
  return {
    start: config.employmentStartDate
      ? startOfDay(config.employmentStartDate)
      : new Date(config.year - 1, 0, 1),
    end: config.employmentEndDate
      ? startOfDay(config.employmentEndDate)
      : new Date(config.year + 1, 11, 31),
  };
}

/**
 * Statutory bonus / weekly allowance referans dönemi: ödeme ayıyla biten
 * 6 aylık dönem (Mart: Eki–Mar, Haziran: Oca–Haz, Eylül: Nis–Eyl,
 * Aralık: Tem–Ara). Kıst ödeme, bu dönemde çalışılan gün oranıdır.
 */
function getStatutoryBonusRatio(
  year: number,
  monthIndex: number,
  employmentStart: Date,
  employmentEnd: Date,
): number {
  const periodStart = new Date(year, monthIndex - 5, 1);
  const periodEnd = new Date(year, monthIndex + 1, 0);
  const totalDays =
    Math.round((periodEnd.getTime() - periodStart.getTime()) / DAY_MS) + 1;
  // Önceki yıla taşan aylar (Mart ödemesi için Eki–Ara) bu işverende
  // hesaplanan dönemin dışında kalır
  const employed = employedDaysBetween(
    periodStart,
    periodEnd,
    employmentStart,
    employmentEnd,
  );
  return Math.min(1, employed / totalDays);
}

/**
 * Çalışma dönemi içindeki haftalık SSC sayısı (Pazartesi sayısı)
 */
function getEmployedWeeks(
  year: number,
  monthIndex: number,
  employmentStart: Date,
  employmentEnd: Date,
): number {
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  let count = 0;
  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, monthIndex, day);
    if (
      date.getDay() === 1 &&
      date >= employmentStart &&
      date <= employmentEnd
    ) {
      count++;
    }
  }
  return count;
}

// ==================== ANA HESAPLAMA FONKSİYONU ====================

/**
 * Varsayılan konfigurasyon
 */
export const defaultConfig: SalaryCalculatorConfig = {
  year: 2026,
  taxRateType: "single",
  simpleTaxType: "single",
  childCount: 0,
  sscCategory: "C",
  birthDate: new Date(1990, 0, 1),
  yearlyNonTaxBenefit: 0,
  yearlyTaxableBenefit: 0,
  enableCOLA: true,
};

/**
 * Aylık maaş kesintilerini hesaplar
 */
export function calculateMonthlyDeductions(
  salaryInput: MonthlySalaryInput[],
  config: SalaryCalculatorConfig = defaultConfig,
): MonthlySalaryOutput[] {
  // Vergi tipini çöz: simpleTaxType + childCount varsa bunları kullan, yoksa taxRateType
  let effectiveTaxType = config.taxRateType;
  if (config.simpleTaxType) {
    effectiveTaxType = resolveTaxRateType(
      config.year,
      config.simpleTaxType,
      config.childCount ?? 0,
    );
  }

  // Config'den değerleri al
  const taxBrackets = getTaxBracketsForYear(config.year, effectiveTaxType);
  const sscRates = getSSCRatesForYear(config.year);
  const isBornBefore1962Flag = isBornBefore1962(config.birthDate);

  // Haftalık SSC cap (doğum tarihine göre)
  const weeklyCap = isBornBefore1962Flag
    ? sscRates.weeklyCapOld
    : sscRates.weeklyCapNew;

  // Aylık sabit değerler
  const monthlyNonTaxBenefit = config.yearlyNonTaxBenefit / 12;
  const monthlyTaxBenefit = config.yearlyTaxableBenefit / 12;

  // Çalışma dönemi (yıl ortası giriş / çıkış için kıst hesap)
  const employment = resolveEmploymentPeriod(config);

  // Aynı yıl önceki işveren (FS3): kümülatif matrah ve vergiye eklenir
  const previousIncome = Math.max(
    0,
    Number(config.previousEmployment?.taxableIncome) || 0,
  );
  const previousTax = Math.max(
    0,
    Number(config.previousEmployment?.taxPaid) || 0,
  );

  // Her ayın çalışılan gün oranı
  const monthRatios = salaryInput.map((input) => {
    const monthIndex = MONTH_ORDER.indexOf(input.month);
    const monthStart = new Date(config.year, monthIndex, 1);
    const monthEnd = new Date(config.year, monthIndex + 1, 0);
    const employedDays = employedDaysBetween(
      monthStart,
      monthEnd,
      employment.start,
      employment.end,
    );
    return employedDays / monthEnd.getDate();
  });

  // Yıllık brüt (vergi dilimi belirlemek için): yalnızca bu yıl fiilen
  // kazanılan temel ücret + önceki işverendeki matrah
  const totalAnnualGross =
    salaryInput.reduce(
      (sum, s, i) => sum + (Number(s.grossWage) || 0) * monthRatios[i],
      0,
    ) + previousIncome;

  // Kümülatif değerler (önceki işveren dahil)
  let cumulativeIncomeBase = previousIncome;
  let cumulativeTax = previousTax;

  return salaryInput.map((input, index) => {
    const { month } = input;
    const monthIndex = MONTH_ORDER.indexOf(month);
    const employmentRatio = monthRatios[index];
    // NaN koruması: grossWage, bonus, governmentBonus ve allowanceBonus için
    const grossWage = isNaN(Number(input.grossWage))
      ? 0
      : Number(input.grossWage);

    // Çalışılmayan ay (işe başlamadan önce / ayrıldıktan sonra)
    if (employmentRatio === 0) {
      return {
        month,
        grossWage: 0,
        basicSalary: 0,
        nonTaxBenefit: 0,
        taxBenefit: 0,
        bonus: 0,
        governmentBonus: 0,
        grossTotal: 0,
        sscBase: 0,
        sscTax: 0,
        incomeBase: 0,
        cumulativeIncomeBase: round2(cumulativeIncomeBase),
        cumulativeTax: round2(cumulativeTax),
        incomeTax: 0,
        net: 0,
        paid: 0,
        discr: 0,
        employmentRatio: 0,
        sscWeeks: 0,
      };
    }

    const isPartialMonth = employmentRatio < 1;
    const inputBonus = isNaN(Number(input.bonus)) ? 0 : Number(input.bonus);
    const inputGovBonus = isNaN(Number(input.governmentBonus))
      ? 0
      : Number(input.governmentBonus);
    const safeAllowanceBonus = isNaN(Number(input.allowanceBonus))
      ? 0
      : Number(input.allowanceBonus);

    // Hafta sayısı: kıst ayda çalışılan haftalar (Pazartesi sayısı);
    // aksi halde override → input → yıl bazlı dinamik hesaplama
    const weeksInMonth = isPartialMonth
      ? getEmployedWeeks(
          config.year,
          monthIndex,
          employment.start,
          employment.end,
        )
      : (config.weeksPerMonthOverride ??
        input.weeksInMonth ??
        getWeeksForMonth(config.year, month));

    // Temel hesaplamalar (kıst ayda çalışılan gün oranında)
    const basicSalary = grossWage * employmentRatio;
    const nonTaxBenefit = monthlyNonTaxBenefit * employmentRatio;
    const taxBenefit = monthlyTaxBenefit * employmentRatio;

    // Bonus ve Government Bonus (COLA)
    const bonus = inputBonus || (config.monthlyBonus ?? 0);
    // COLA: enableCOLA true ise ay bazlı statutory bonus, referans dönemde
    // çalışılan gün oranında (kıst) eklenir
    const autoCOLA = config.enableCOLA
      ? getCOLAForMonth(config.year, month) *
        getStatutoryBonusRatio(
          config.year,
          monthIndex,
          employment.start,
          employment.end,
        )
      : 0;
    const governmentBonus = round2(inputGovBonus || autoCOLA);
    const halfAdditional = (safeAllowanceBonus * employmentRatio) / 2;

    // Brüt toplam
    const grossTotal =
      basicSalary +
      nonTaxBenefit +
      taxBenefit +
      bonus +
      governmentBonus +
      halfAdditional;

    // SSC hesaplama: haftalık eşdeğer sözleşme ücretinden, çalışılan haftalar için
    const sscBase = calculateSSCBase(grossWage, weeksInMonth, weeklyCap);
    const sscTax = calculateSSCTax(
      sscBase,
      weeksInMonth,
      config.sscCategory,
      sscRates,
      isBornBefore1962Flag,
    );

    // Income Base (vergiye tabi gelir)
    // Excel: Income Base = Gross Total - Non-Tax Benefit
    const incomeBase = grossTotal - nonTaxBenefit;

    // Kümülatif gelir tabanı
    cumulativeIncomeBase += incomeBase;

    // Gelir vergisi hesaplama (FSS kümülatif sistem, dönem no = takvim ayı)
    const incomeTax = calculateMonthlyIncomeTax(
      cumulativeIncomeBase,
      cumulativeTax,
      monthIndex + 1,
      totalAnnualGross,
      taxBrackets,
    );

    // Kümülatif vergi güncelle
    cumulativeTax += incomeTax;

    // Net maaş
    // Excel: Net = Gross Total - SSC Tax - Income Tax
    const net = grossTotal - sscTax - incomeTax;
    const paid = net + halfAdditional; // Allowance bonus'un diğer yarısı
    const discr = grossTotal - paid;

    return {
      month,
      grossWage,
      basicSalary: round2(basicSalary),
      nonTaxBenefit: round2(nonTaxBenefit),
      taxBenefit: round2(taxBenefit),
      bonus,
      governmentBonus,
      grossTotal: round2(grossTotal),
      sscBase: round2(sscBase),
      sscTax: round2(sscTax),
      incomeBase: round2(incomeBase),
      cumulativeIncomeBase: round2(cumulativeIncomeBase),
      cumulativeTax: round2(cumulativeTax),
      incomeTax: round2(incomeTax),
      net: round2(net),
      paid: round2(paid),
      discr: round2(discr),
      employmentRatio: Math.round(employmentRatio * 10000) / 10000,
      sscWeeks: weeksInMonth,
    };
  });
}

// ==================== ÖZET VE YIL SONU MAHSUP ====================

export interface SalarySummary {
  annual: { gross: number; ssc: number; tax: number; net: number };
  monthly: { gross: number; ssc: number; tax: number; net: number };
  /** Çalışılan (tam veya kıst) ay sayısı — aylık ortalama bunun üzerinden */
  monthsWorked: number;
}

/**
 * Aylık döküm özetini çıkarır. Aylık ortalama yalnızca çalışılan aylar
 * üzerinden alınır (yıl ortası girişte 12'ye bölünmez).
 */
export function summarizeMonthlyDeductions(
  data: MonthlySalaryOutput[],
): SalarySummary | null {
  if (data.length === 0) return null;

  const totalGross = data.reduce((sum, d) => sum + d.grossTotal, 0);
  const totalSSC = data.reduce((sum, d) => sum + d.sscTax, 0);
  const totalTax = data.reduce((sum, d) => sum + d.incomeTax, 0);
  const totalNet = data.reduce((sum, d) => sum + d.net, 0);
  const monthsWorked = data.filter((d) => (d.employmentRatio ?? 1) > 0).length;
  const divisor = monthsWorked || 1;

  return {
    annual: { gross: totalGross, ssc: totalSSC, tax: totalTax, net: totalNet },
    monthly: {
      gross: totalGross / divisor,
      ssc: totalSSC / divisor,
      tax: totalTax / divisor,
      net: totalNet / divisor,
    },
    monthsWorked,
  };
}

export interface YearEndTaxPosition {
  /** Yılın toplam vergiye tabi geliri (önceki işveren dahil) */
  annualTaxableIncome: number;
  /** Gerçek yıllık gelir üzerinden vergi borcu */
  annualTaxLiability: number;
  /** Yıl içinde kesilen toplam vergi (önceki işveren dahil) */
  totalTaxWithheld: number;
  /** Pozitif: yıl sonunda ödenecek, negatif: iade */
  balance: number;
}

/**
 * Yıl sonu mahsup tahmini: FSS kesintileri ile gerçek yıllık vergi arasındaki
 * fark beyanname (tax return) ile kapatılır (ör. yıl ortasında ayrılanlar).
 */
export function calculateYearEndTaxPosition(
  data: MonthlySalaryOutput[],
  config: SalaryCalculatorConfig = defaultConfig,
): YearEndTaxPosition {
  const effectiveTaxType = config.simpleTaxType
    ? resolveTaxRateType(
        config.year,
        config.simpleTaxType,
        config.childCount ?? 0,
      )
    : config.taxRateType;
  const taxBrackets = getTaxBracketsForYear(config.year, effectiveTaxType);

  const previousIncome = Number(config.previousEmployment?.taxableIncome) || 0;
  const previousTax = Number(config.previousEmployment?.taxPaid) || 0;

  const annualTaxableIncome =
    previousIncome + data.reduce((sum, d) => sum + d.incomeBase, 0);
  const annualTaxLiability = calculateAnnualTaxLiability(
    annualTaxableIncome,
    taxBrackets,
  );
  const totalTaxWithheld =
    previousTax + data.reduce((sum, d) => sum + d.incomeTax, 0);

  return {
    annualTaxableIncome: round2(annualTaxableIncome),
    annualTaxLiability: round2(annualTaxLiability),
    totalTaxWithheld: round2(totalTaxWithheld),
    balance: round2(annualTaxLiability - totalTaxWithheld),
  };
}

/**
 * "YYYY-MM-DD" metnini yerel tarihe çevirir (geçersizse undefined)
 */
export function parseDateOnly(value?: string | null): Date | undefined {
  if (!value) return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;
  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
  );
  return isNaN(date.getTime()) ? undefined : date;
}

export interface EmploymentPeriodParams {
  year: number;
  startDate?: string; // "YYYY-MM-DD" — öncelikli
  startOfMonth?: string; // Ay adı (geriye uyumluluk: ayın 1'i)
  endOfMonth?: string; // Ay adı (ayın son günü)
  previousTaxableIncome?: number;
  previousTaxPaid?: number;
}

/**
 * URL/form parametrelerinden çalışma dönemi ve önceki işveren config alanlarını üretir
 */
export function buildEmploymentConfig(
  params: EmploymentPeriodParams,
): Pick<
  SalaryCalculatorConfig,
  "employmentStartDate" | "employmentEndDate" | "previousEmployment"
> {
  const startMonthIndex = params.startOfMonth
    ? MONTH_ORDER.indexOf(params.startOfMonth as Month)
    : -1;
  const endMonthIndex = params.endOfMonth
    ? MONTH_ORDER.indexOf(params.endOfMonth as Month)
    : -1;

  const parsedStart = parseDateOnly(params.startDate);
  const employmentStartDate =
    parsedStart && parsedStart.getFullYear() === params.year
      ? parsedStart
      : startMonthIndex > 0
        ? new Date(params.year, startMonthIndex, 1)
        : undefined;
  const employmentEndDate =
    endMonthIndex >= 0 && endMonthIndex < 11
      ? new Date(params.year, endMonthIndex + 1, 0)
      : undefined;

  const taxableIncome = Math.max(0, Number(params.previousTaxableIncome) || 0);
  const taxPaid = Math.max(0, Number(params.previousTaxPaid) || 0);

  return {
    employmentStartDate,
    employmentEndDate,
    previousEmployment:
      taxableIncome > 0 || taxPaid > 0 ? { taxableIncome, taxPaid } : undefined,
  };
}

// ==================== ESKİ FONKSİYON (GERİYE UYUMLULUK) ====================

/**
 * @deprecated Yeni calculateMonthlyDeductions fonksiyonunu config ile kullanın
 */
export function calculateMonthlyDeductionsLegacy(
  salaryInput: MonthlySalaryInput[],
): MonthlySalaryOutput[] {
  return calculateMonthlyDeductions(salaryInput, defaultConfig);
}
