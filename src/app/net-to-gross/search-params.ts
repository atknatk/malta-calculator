/**
 * Net-to-Gross Calculator Search Params - nuqs ile type-safe URL state
 * SSR için createSearchParamsCache, client için useQueryStates kullanılır.
 *
 * Anahtar isimleri /salary search-params ile uyumlu (toggle sırasında URL
 * parametreleri kayıpsız taşınsın). `salary` yerine `net` kullanır.
 */
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  parseAsBoolean,
  createSearchParamsCache,
  createSerializer,
} from "nuqs/server";

const taxRateTypes = ["single", "married", "parent"] as const;
type TaxRateType = (typeof taxRateTypes)[number];

const sscCategories = ["A", "B", "C"] as const;
type SSCCategory = (typeof sscCategories)[number];

const monthValues = [
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
] as const;
type MonthValue = (typeof monthValues)[number];

const currentYear = new Date().getFullYear().toString();

export const netToGrossSearchParams = {
  // Primary - hedef net (default ≈ /salary'nin default 25000€ gross karşılığı)
  net: parseAsInteger.withDefault(20000),
  year: parseAsString.withDefault(currentYear),
  taxType: parseAsStringLiteral(taxRateTypes).withDefault("single"),
  childCount: parseAsInteger.withDefault(0),
  sscCategory: parseAsStringLiteral(sscCategories).withDefault("C"),

  // Period
  startOfMonth: parseAsStringLiteral(monthValues).withDefault("January"),
  endOfMonth: parseAsStringLiteral(monthValues).withDefault("December"),

  // Advanced
  birthYear: parseAsInteger.withDefault(1990),
  yearlyNonTaxBenefit: parseAsInteger.withDefault(0),
  yearlyTaxableBenefit: parseAsInteger.withDefault(0),
  monthlyBonus: parseAsInteger.withDefault(0),
  allowanceBonus: parseAsInteger.withDefault(0),
  monthlyBonuses: parseAsString.withDefault(""),
  // Net-to-gross specific
  includeBonusesInTarget: parseAsBoolean.withDefault(false),
};

export const netToGrossParamsCache = createSearchParamsCache(
  netToGrossSearchParams,
);

export const serializeNetToGrossParams = createSerializer(
  netToGrossSearchParams,
);

export type NetToGrossSearchParams = {
  net: number;
  year: string;
  taxType: TaxRateType;
  childCount: number;
  sscCategory: SSCCategory;
  startOfMonth: MonthValue;
  endOfMonth: MonthValue;
  birthYear: number;
  yearlyNonTaxBenefit: number;
  yearlyTaxableBenefit: number;
  monthlyBonus: number;
  allowanceBonus: number;
  monthlyBonuses: string;
  includeBonusesInTarget: boolean;
};

export const defaultNetToGrossParams: NetToGrossSearchParams = {
  net: 20000,
  year: currentYear,
  taxType: "single",
  childCount: 0,
  sscCategory: "C",
  startOfMonth: "January",
  endOfMonth: "December",
  birthYear: 1990,
  yearlyNonTaxBenefit: 0,
  yearlyTaxableBenefit: 0,
  monthlyBonus: 0,
  allowanceBonus: 0,
  monthlyBonuses: "",
  includeBonusesInTarget: false,
};
