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
 * Public holidays falling on weekends by year
 * These add extra vacation hours
 */
const PUBLIC_HOLIDAYS_ON_WEEKENDS: Record<number, number> = {
  2024: 3, // 3 public holidays on weekends → +24 hours
  2025: 2, // 2 public holidays on weekends → +16 hours
  2026: 3, // 3 public holidays on weekends → +24 hours
  2027: 3, // Estimated
  2028: 2, // Estimated
  2029: 2, // Estimated
  2030: 3, // Estimated
};

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
  const publicHolidaysOnWeekends = PUBLIC_HOLIDAYS_ON_WEEKENDS[year] ?? 3;
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
  const count = PUBLIC_HOLIDAYS_ON_WEEKENDS[year] ?? 3;
  const extraHours = count * HOURS_PER_DAY;
  const note =
    year > 2026
      ? "Estimated - actual dates may vary"
      : "Based on official Malta calendar";

  return { count, extraHours, note };
}

/**
 * Get available years for selection
 */
export function getAvailableVacationYears(): number[] {
  const currentYear = new Date().getFullYear();
  return [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
}
