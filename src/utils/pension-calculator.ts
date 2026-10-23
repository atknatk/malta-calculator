/**
 * Malta State Pension Calculator (2026)
 *
 * Malta Social Security Act (Cap. 318) çerçevesinde Two-Thirds Pension
 * hesaplaması, özel emeklilik katkısı vergi kredisi ve 2026 emekli maaşı
 * vergi muafiyeti (LN 53/2026) dahil.
 *
 * Kaynaklar:
 * - Social Security Act Cap. 318
 * - LN 53 of 2026 (pension income exemption - 100% up to €37,104)
 * - S.L. 123.204 (targeted rebate 2026)
 * - Department of Social Security — Two-Thirds Pension formula
 */
export type PensionTaxStatus = "single" | "married" | "parent";

export type DeferralYears = 0 | 1 | 2 | 3 | 4;

export interface PensionInput {
  /** Doğum yılı */
  birthYear: number;
  /** Medeni / vergi statüsü */
  taxStatus: PensionTaxStatus;
  /** Çocuk sayısı (child credit için, 3 ile sınırlı) */
  children: number;
  /** Ödenmiş SSC yılı sayısı */
  paidYears: number;
  /** En iyi yılların ortalama brüt yıllık maaşı (€) */
  averageSalary: number;
  /** Kaç yıl ertelediği (0-4) */
  deferralYears: DeferralYears;
  /** Yıllık özel emeklilik katkısı (€) */
  privatePensionContribution: number;
}

export interface PensionOutput {
  // Eligibility
  isEligible: boolean;
  retirementAge: number;
  requiredYears: number;

  // Contribution progression
  paidYears: number;
  childCredits: number;
  effectiveYears: number;
  proportion: number; // 0-1, oransal hesap

  // Pensionable income
  pensionableIncome: number; // MPI cap uygulandıktan sonra
  isMPICapped: boolean;
  mpi: number;

  // Core pension numbers
  baseAnnualPension: number; // 2/3 × pensionable × proportion (COLA hariç)
  deferralBonusRate: number;
  deferralBonusAmount: number;
  /** Uygulanan erteleme yılı (emeklilik yaşı ve erken emeklilik şartına göre sınırlı) */
  appliedDeferralYears: DeferralYears;
  annualPension: number; // Final annual (deferral dahil)
  monthlyPension: number;
  weeklyPension: number;

  // Private pension
  privateContribution: number; // kapanmış
  privateTaxCredit: number;

  // Tax on pension (2026)
  isPensionFullyExempt: boolean;
  pensionExemptionLimit: number;
  taxablePensionAfterExemption: number;

  // Totals
  totalAnnualIncome: number; // state pension + private tax credit

  // Metadata
  ruleDescription: string;
  warnings: string[];
}

// ============= 2026 Constants =============

/**
 * Maximum Pensionable Income (MPI) 2026 — 1 Ocak 1962 ve sonrası doğumlular
 * Kaynak: DSS Pensions Information (2026: €29,083.36)
 */
export const MPI_2026 = 29083;

/** MPI 2026 — 31 Aralık 1961 ve öncesi doğumlular (DSS: €25,500) */
export const MPI_2026_PRE_1962 = 25500;

/** Doğum yılına göre MPI */
export function getMPI(birthYear: number): number {
  return birthYear < 1962 ? MPI_2026_PRE_1962 : MPI_2026;
}

/**
 * Budget 2026: ödenmekte olan emekli maaşlarına haftalık €10 artış
 * (€4,66 COLA + €5,34). Yeni bağlanan maaşa eklenmez: 2026 MPI'nin 2/3'ü
 * zaten 2026 tavan maaşıdır. Bu sabit yalnızca bilgi amaçlı gösterilir.
 */
export const PENSION_INCREASE_2026_WEEKLY = 10;

/** Minimum SSC contribution years to qualify for any pension */
export const MIN_CONTRIBUTION_YEARS = 10;

/** Private pension tax credit — 2026 */
export const PRIVATE_PENSION_MAX_CONTRIBUTION = 3000;
export const PRIVATE_PENSION_TAX_CREDIT_RATE = 0.25;
export const PRIVATE_PENSION_MAX_CREDIT = 750;

/** LN 53/2026 — 100% pension exemption up to €37,104 */
export const PENSION_EXEMPTION_LIMIT_2026 = 37104;

/** Yeni targeted rebate (S.L. 123.204 — 2026) */
export const TARGETED_REBATE_THRESHOLD = 15000;
export const TARGETED_REBATE_RATE = 0.15;
export const TARGETED_REBATE_CAP = 540;

// ============= Helpers =============

/**
 * Doğum yılına göre full pension için gereken SSC yılı.
 * Kaynak: Social Security Act güncellemeleri.
 */
export function getRequiredYears(birthYear: number): number {
  if (birthYear < 1952) return 30;
  if (birthYear < 1962) return 35;
  if (birthYear <= 1968) return 40;
  if (birthYear <= 1975) return 41;
  return 42;
}

/**
 * Doğum yılına göre statutory emeklilik yaşı.
 * (Kadın/erkek ayrımı yalnız 1951 öncesi — burada nötr 61 kullanılır.)
 */
export function getRetirementAge(birthYear: number): number {
  if (birthYear <= 1951) return 61;
  if (birthYear <= 1955) return 62;
  if (birthYear <= 1958) return 63;
  if (birthYear <= 1961) return 64;
  return 65;
}

/**
 * Çocuk başına credit (DSS child-rearing credits).
 * - 1962 ve sonrası: ilk 3 çocuk 4'er yıl, 4. çocuktan itibaren 2'şer yıl
 * - 1962 öncesi: ilk 3 çocuk 2'şer yıl, 4. çocuktan itibaren 1'er yıl
 * Engelli çocuk için ek kredi burada hesaplanmaz.
 */
export function getChildCredits(birthYear: number, children: number): number {
  const total = Math.max(0, Math.floor(children));
  const firstThree = Math.min(total, 3);
  const additional = Math.max(0, total - 3);
  if (birthYear >= 1962) return firstThree * 4 + additional * 2;
  return firstThree * 2 + additional * 1;
}

/**
 * Deferral bonus — 61'de erken emekli olabilecek kişi maaşı 62-65'e
 * ertelerse kümülatif artış. 65'ten sonra erteleme artışı yoktur.
 * Kaynak: DSS Pensions Information (61→62 %6.5, →63 %13.5, →64 %21, →65 %29)
 */
export function getDeferralBonusRate(years: DeferralYears): number {
  switch (years) {
    case 0:
      return 0;
    case 1:
      return 0.065;
    case 2:
      return 0.135;
    case 3:
      return 0.21;
    case 4:
      return 0.29;
  }
}

// ============= Main Calculation =============

export function calculatePension(input: PensionInput): PensionOutput {
  const {
    birthYear,
    taxStatus,
    children,
    paidYears,
    averageSalary,
    deferralYears,
    privatePensionContribution,
  } = input;

  const warnings: string[] = [];

  const retirementAge = getRetirementAge(birthYear);
  const requiredYears = getRequiredYears(birthYear);
  const childCredits = getChildCredits(birthYear, children);
  const effectiveYears = Math.max(0, paidYears) + childCredits;

  const isEligible = paidYears >= MIN_CONTRIBUTION_YEARS;
  if (!isEligible) {
    warnings.push(
      `Minimum ${MIN_CONTRIBUTION_YEARS} years of contributions required. You currently have ${paidYears}.`,
    );
  }

  const mpi = getMPI(birthYear);
  const isMPICapped = averageSalary > mpi;
  const pensionableIncome = Math.min(Math.max(0, averageSalary), mpi);
  if (isMPICapped) {
    warnings.push(
      `Your salary exceeds the Maximum Pensionable Income cap of €${mpi.toLocaleString("en-MT")}.`,
    );
  }

  const proportion = Math.min(effectiveYears / requiredYears, 1);
  if (effectiveYears < requiredYears && isEligible) {
    warnings.push(
      `You have ${effectiveYears} effective years out of ${requiredYears} required — pension pro-rated to ${(
        proportion * 100
      ).toFixed(1)}%.`,
    );
  }

  // Base annual pension = 2/3 × pensionable × proportion
  const baseAnnualPension = isEligible
    ? pensionableIncome * (2 / 3) * proportion
    : 0;

  // Erteleme yalnız 61 yaşında erken emeklilik hakkı olanlar için ve
  // statutory emeklilik yaşına kadar geçerli (61 + n ≤ emeklilik yaşı).
  const qualifiesForEarly = isEligible && effectiveYears >= requiredYears;
  const maxDeferral = Math.max(0, Math.min(4, retirementAge - 61));
  const appliedDeferralYears = (
    qualifiesForEarly ? Math.min(deferralYears, maxDeferral) : 0
  ) as DeferralYears;
  if (deferralYears > 0 && !qualifiesForEarly) {
    warnings.push(
      `The deferral bonus only applies if you could retire early at 61 with the full ${requiredYears} years of contributions.`,
    );
  } else if (deferralYears > appliedDeferralYears) {
    warnings.push(
      `Deferral increases stop at your pension age of ${retirementAge}; there is no extra increase for claiming later.`,
    );
  }

  const deferralBonusRate = getDeferralBonusRate(appliedDeferralYears);
  const deferralBonusAmount = baseAnnualPension * deferralBonusRate;
  const pensionAfterDeferral = baseAnnualPension + deferralBonusAmount;

  const annualPension = pensionAfterDeferral;
  const weeklyPension = annualPension / 52;
  const monthlyPension = annualPension / 12;

  // Private pension tax credit
  const privateContribution = Math.min(
    Math.max(0, privatePensionContribution),
    PRIVATE_PENSION_MAX_CONTRIBUTION,
  );
  const privateTaxCredit = Math.min(
    privateContribution * PRIVATE_PENSION_TAX_CREDIT_RATE,
    PRIVATE_PENSION_MAX_CREDIT,
  );

  // 2026 pension tax exemption (LN 53/2026)
  const isPensionFullyExempt = annualPension <= PENSION_EXEMPTION_LIMIT_2026;
  const taxablePensionAfterExemption = Math.max(
    0,
    annualPension - PENSION_EXEMPTION_LIMIT_2026,
  );

  const totalAnnualIncome = annualPension + privateTaxCredit;

  const statusLabel =
    taxStatus === "married"
      ? "Married"
      : taxStatus === "parent"
        ? "Parent (separated/widowed)"
        : "Single";

  const ruleDescription = `${statusLabel} · Born ${birthYear} · Retirement age ${retirementAge} · Requires ${requiredYears} years`;

  return {
    isEligible,
    retirementAge,
    requiredYears,
    paidYears,
    childCredits,
    effectiveYears,
    proportion,
    pensionableIncome,
    isMPICapped,
    mpi,
    baseAnnualPension,
    deferralBonusRate,
    deferralBonusAmount,
    appliedDeferralYears,
    annualPension,
    monthlyPension,
    weeklyPension,
    privateContribution,
    privateTaxCredit,
    isPensionFullyExempt,
    pensionExemptionLimit: PENSION_EXEMPTION_LIMIT_2026,
    taxablePensionAfterExemption,
    totalAnnualIncome,
    ruleDescription,
    warnings,
  };
}

/**
 * UI'da kullanılacak özet referans tablosu
 */
export function getPensionReferenceTable() {
  return [
    { birthYears: "Before 1952", requiredYears: 30, retirementAge: "61" },
    { birthYears: "1952 – 1961", requiredYears: 35, retirementAge: "62-64" },
    { birthYears: "1962 – 1968", requiredYears: 40, retirementAge: "65" },
    { birthYears: "1969 – 1975", requiredYears: 41, retirementAge: "65" },
    { birthYears: "1976 or later", requiredYears: 42, retirementAge: "65" },
  ];
}

/**
 * €X,XXX formatında para birimi
 */
export function formatEUR(value: number): string {
  return new Intl.NumberFormat("en-MT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatEUR2(value: number): string {
  return new Intl.NumberFormat("en-MT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
