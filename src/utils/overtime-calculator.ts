/**
 * Malta Overtime Calculator
 * Based on Malta Employment and Industrial Relations Act
 */

export type OvertimeType = "weekday" | "sunday" | "holiday";

export interface OvertimeInput {
  /** Base hourly rate in EUR */
  hourlyRate: number;
  /** Number of overtime hours */
  overtimeHours: number;
  /** Type of overtime */
  overtimeType: OvertimeType;
  /** Annual gross salary (optional - for calculating hourly rate) */
  annualSalary?: number;
}

export interface OvertimeOutput {
  /** Base hourly rate used */
  baseHourlyRate: number;
  /** Overtime multiplier applied */
  multiplier: number;
  /** Overtime hourly rate */
  overtimeRate: number;
  /** Total overtime pay */
  totalOvertimePay: number;
  /** Description of the overtime type */
  description: string;
  /** Hours worked */
  hours: number;
}

/**
 * Overtime multipliers as per Malta law
 */
const OVERTIME_MULTIPLIERS: Record<
  OvertimeType,
  { rate: number; description: string }
> = {
  weekday: {
    rate: 1.5,
    description: "Weekday overtime (150%)",
  },
  sunday: {
    rate: 2.0,
    description: "Sunday/Rest day overtime (200%)",
  },
  holiday: {
    rate: 2.0,
    description: "Public holiday overtime (200%)",
  },
};

/**
 * Standard values for overtime calculation
 */
const STANDARD_WEEKLY_HOURS = 40;
const WEEKS_PER_YEAR = 52;

/**
 * Calculate overtime pay
 */
export function calculateOvertime(input: OvertimeInput): OvertimeOutput {
  const { hourlyRate, overtimeHours, overtimeType, annualSalary } = input;

  // Calculate hourly rate from annual salary if provided and hourlyRate is 0
  let baseHourlyRate = hourlyRate;
  if (annualSalary && annualSalary > 0 && (!hourlyRate || hourlyRate === 0)) {
    baseHourlyRate = annualSalary / (STANDARD_WEEKLY_HOURS * WEEKS_PER_YEAR);
  }

  const overtime = OVERTIME_MULTIPLIERS[overtimeType];
  const overtimeRate = baseHourlyRate * overtime.rate;
  const totalOvertimePay = overtimeRate * overtimeHours;

  return {
    baseHourlyRate,
    multiplier: overtime.rate,
    overtimeRate,
    totalOvertimePay,
    description: overtime.description,
    hours: overtimeHours,
  };
}

/**
 * Calculate hourly rate from annual salary
 */
export function calculateHourlyRate(annualSalary: number): number {
  return annualSalary / (STANDARD_WEEKLY_HOURS * WEEKS_PER_YEAR);
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
 * Get overtime rate info for display
 */
export function getOvertimeRates() {
  return [
    {
      type: "weekday" as OvertimeType,
      label: "Weekday",
      rate: "1.5×",
      percent: "150%",
    },
    {
      type: "sunday" as OvertimeType,
      label: "Sunday/Rest Day",
      rate: "2.0×",
      percent: "200%",
    },
    {
      type: "holiday" as OvertimeType,
      label: "Public Holiday",
      rate: "2.0×",
      percent: "200%",
    },
  ];
}
