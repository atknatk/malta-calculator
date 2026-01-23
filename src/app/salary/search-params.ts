/**
 * Salary Calculator Search Params - nuqs ile type-safe URL state yönetimi
 * SSR için createSearchParamsCache, client için useQueryStates kullanılır
 */
import {
    parseAsInteger,
    parseAsString,
    parseAsStringLiteral,
    createSearchParamsCache,
    createSerializer,
} from "nuqs/server";

// Tax Rate Types
const taxRateTypes = ["single", "married", "parent"] as const;
type TaxRateType = (typeof taxRateTypes)[number];

// SSC Categories
const sscCategories = ["A", "B", "C", "D"] as const;
type SSCCategory = (typeof sscCategories)[number];


// Current year for defaults
const currentYear = new Date().getFullYear().toString();

/**
 * Search params parsers - server ve client componenlerde ortak kullanılır
 */
export const salarySearchParams = {
    // Primary params
    salary: parseAsInteger.withDefault(36000),
    year: parseAsString.withDefault(currentYear),
    taxType: parseAsStringLiteral(taxRateTypes).withDefault("single"),
    sscCategory: parseAsStringLiteral(sscCategories).withDefault("C"),


    // Advanced params
    birthYear: parseAsInteger.withDefault(1990),
    yearlyNonTaxBenefit: parseAsInteger.withDefault(0),
    yearlyTaxableBenefit: parseAsInteger.withDefault(0),
    monthlyBonus: parseAsInteger.withDefault(0),
    allowanceBonus: parseAsInteger.withDefault(0),
};

/**
 * Server-side cache for SSR - page.tsx'de kullanılır
 */
export const salaryParamsCache = createSearchParamsCache(salarySearchParams);

/**
 * Serializer for generating URLs
 */
export const serializeSalaryParams = createSerializer(salarySearchParams);

/**
 * Type for parsed search params
 */
export type SalarySearchParams = {
    salary: number;
    year: string;
    taxType: TaxRateType;
    sscCategory: SSCCategory;
    birthYear: number;
    yearlyNonTaxBenefit: number;
    yearlyTaxableBenefit: number;
    monthlyBonus: number;
    allowanceBonus: number;
};
