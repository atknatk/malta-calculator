/**
 * Malta Vacation Leave Calculator
 * Based on Malta Employment Law
 */

export interface VacationLeaveInput {
  /** Weekly working hours */
  weeklyHours: number;
  /** Year to calculate for */
  year: number;
  /** Months worked in the year (for pro-rata) */
  monthsWorked?: number;
}

export interface VacationLeaveOutput {
  /** Base entitlement in hours */
  baseHours: number;
  /** Additional hours for public holidays on weekends */
  publicHolidayHours: number;
  /** Total entitlement in hours */
  totalHours: number;
  /** Total entitlement in days (based on 8-hour day) */
  totalDays: number;
  /** Pro-rata adjusted hours (if applicable) */
  proRataHours: number | null;
  /** Whether pro-rata applies */
  isProRata: boolean;
  /** Description of the calculation */
  description: string;
}

/**
 * Standard values for Malta vacation calculation
 */
const STANDARD_WEEKLY_HOURS = 40;
const BASE_VACATION_HOURS = 192; // 24 days × 8 hours
const HOURS_PER_DAY = 8;

/**
 * Malta'nın sabit tarihli resmi tatilleri (ay 0-index, gün)
 * Good Friday her zaman Cuma olduğu için hafta sonuna denk gelmez, listede yok.
 */
const FIXED_PUBLIC_HOLIDAYS: [number, number][] = [
  [0, 1], // New Year's Day
  [1, 10], // St Paul's Shipwreck
  [2, 19], // St Joseph
  [2, 31], // Freedom Day
  [4, 1], // Workers' Day
  [5, 7], // Sette Giugno
  [5, 29], // St Peter & St Paul
  [7, 15], // Assumption
  [8, 8], // Victory Day
  [8, 21], // Independence Day
  [11, 8], // Immaculate Conception
  [11, 13], // Republic Day
  [11, 25], // Christmas Day
];

/**
 * Hafta sonuna denk gelen resmi tatil sayısı
 * Her biri yıllık izne +1 gün (8 saat) ekler.
 * Örn: 2024 → 6 (240 saat), 2025 → 4 (224 saat), 2026 → 3 (216 saat)
 */
function countPublicHolidaysOnWeekends(year: number): number {
  return FIXED_PUBLIC_HOLIDAYS.filter(([month, day]) => {
    const weekday = new Date(year, month, day).getDay();
    return weekday === 0 || weekday === 6;
  }).length;
}

/**
 * Calculate vacation leave entitlement
 */
export function calculateVacationLeave(
  input: VacationLeaveInput,
): VacationLeaveOutput {
  const { weeklyHours, year, monthsWorked = 12 } = input;

  // Calculate base hours proportional to weekly hours
  const hoursRatio = weeklyHours / STANDARD_WEEKLY_HOURS;
  const baseHours = Math.round(BASE_VACATION_HOURS * hoursRatio);

  // Get public holiday additions for the year
  const publicHolidaysOnWeekends = countPublicHolidaysOnWeekends(year);
  const publicHolidayHours = Math.round(
    publicHolidaysOnWeekends * HOURS_PER_DAY * hoursRatio,
  );

  // Total entitlement
  const totalHours = baseHours + publicHolidayHours;
  const totalDays = totalHours / HOURS_PER_DAY;

  // Pro-rata calculation if not working full year
  const isProRata = monthsWorked < 12;
  const proRataHours = isProRata
    ? Math.round((totalHours * monthsWorked) / 12)
    : null;

  // Build description
  let description = `${weeklyHours}h/week employee`;
  if (weeklyHours < STANDARD_WEEKLY_HOURS) {
    description = `Part-time (${weeklyHours}h/week)`;
  } else if (weeklyHours === STANDARD_WEEKLY_HOURS) {
    description = "Full-time (40h/week)";
  }

  return {
    baseHours,
    publicHolidayHours,
    totalHours,
    totalDays,
    proRataHours,
    isProRata,
    description,
  };
}

/**
 * Get public holiday info for a year
 */
export function getPublicHolidayInfo(year: number): {
  count: number;
  extraHours: number;
  note: string;
} {
  const count = countPublicHolidaysOnWeekends(year);
  const extraHours = count * HOURS_PER_DAY;
  const note = "Based on Malta's fixed-date public holidays";

  return { count, extraHours, note };
}

/**
 * Get available years for selection
 */
export function getAvailableVacationYears(): number[] {
  const currentYear = new Date().getFullYear();
  return [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
}
