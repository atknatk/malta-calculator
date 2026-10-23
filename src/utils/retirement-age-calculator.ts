/**
 * Malta Retirement Age Calculator
 * Based on Malta Social Security Act
 */

export interface RetirementAgeInput {
  /** Birth year */
  birthYear: number;
  /** Gender (only matters for those born 1951 or earlier) */
  gender?: "male" | "female";
}

export interface RetirementAgeOutput {
  /** Retirement age in years */
  retirementAge: number;
  /** Year of retirement */
  retirementYear: number;
  /** Description of the applicable rule */
  ruleDescription: string;
  /** Years remaining until retirement (negative if already past) */
  yearsUntilRetirement: number;
  /** Months remaining until retirement */
  monthsUntilRetirement: number;
  /** Whether an early pension at 61 is possible (pension age above 61) */
  eligibleForEarlyRetirement: boolean;
  /** Paid contribution years needed for early retirement / a full pension */
  requiredContributionYears: number;
}

/**
 * Retirement age brackets as per Malta Social Security Act
 */
const RETIREMENT_AGE_BRACKETS = [
  {
    maxBirthYear: 1951,
    maleAge: 61,
    femaleAge: 60,
    description: "Born 1951 or earlier",
  },
  { maxBirthYear: 1955, age: 62, description: "Born 1952-1955" },
  { maxBirthYear: 1958, age: 63, description: "Born 1956-1958" },
  { maxBirthYear: 1961, age: 64, description: "Born 1959-1961" },
  { maxBirthYear: Infinity, age: 65, description: "Born 1962 or later" },
] as const;

/**
 * Calculate retirement age based on birth year
 */
export function calculateRetirementAge(
  input: RetirementAgeInput,
): RetirementAgeOutput {
  const { birthYear, gender = "male" } = input;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  let retirementAge: number;
  let ruleDescription: string;

  // Find the applicable bracket
  const bracket = RETIREMENT_AGE_BRACKETS.find(
    (b) => birthYear <= b.maxBirthYear,
  );

  if (!bracket) {
    // Default to 65 for future births
    retirementAge = 65;
    ruleDescription = "Born 1962 or later";
  } else if ("maleAge" in bracket && "femaleAge" in bracket) {
    // Born 1951 or earlier - gender-based retirement age
    retirementAge = gender === "male" ? bracket.maleAge : bracket.femaleAge;
    ruleDescription = bracket.description;
  } else {
    retirementAge = bracket.age;
    ruleDescription = bracket.description;
  }

  const retirementYear = birthYear + retirementAge;

  // Calculate years and months until retirement
  const yearsUntilRetirement = retirementYear - currentYear;
  const monthsUntilRetirement = yearsUntilRetirement * 12 - currentMonth;

  // 61'de erken emeklilik: doğum yılına göre tam katkı yılı (35/40/41/42)
  // ve emeklilik yaşına kadar çalışmamak şartıyla
  const eligibleForEarlyRetirement = retirementAge > 61;
  const requiredContributionYears =
    birthYear < 1952
      ? 30
      : birthYear < 1962
        ? 35
        : birthYear <= 1968
          ? 40
          : birthYear <= 1975
            ? 41
            : 42;

  return {
    retirementAge,
    retirementYear,
    ruleDescription,
    yearsUntilRetirement,
    monthsUntilRetirement: Math.max(0, monthsUntilRetirement),
    eligibleForEarlyRetirement,
    requiredContributionYears,
  };
}

/**
 * Get all retirement age brackets for display
 */
export function getRetirementAgeBrackets() {
  return [
    { birthYears: "1951 or earlier", age: "61 (M) / 60 (F)" },
    { birthYears: "1952 - 1955", age: "62" },
    { birthYears: "1956 - 1958", age: "63" },
    { birthYears: "1959 - 1961", age: "64" },
    { birthYears: "1962 or later", age: "65" },
  ];
}
