/**
 * Malta Vehicle Registration Tax Calculator
 * Based on Transport Malta CO2-based registration tax system
 * https://www.transport.gov.mt
 */

export interface VehicleRegistrationTaxInput {
    /** CO2 emissions in g/km */
    co2Emissions: number;
    /** Vehicle age in years (0 for new) */
    vehicleAge: number;
    /** Engine capacity in cc */
    engineCapacity: number;
    /** Fuel type */
    fuelType: 'petrol' | 'diesel' | 'hybrid' | 'plugin_hybrid' | 'electric';
    /** Vehicle value in EUR for valuation */
    vehicleValue: number;
    /** Whether imported from EU */
    isEU: boolean;
}

export interface VehicleRegistrationTaxOutput {
    /** Total registration tax */
    totalTax: number;
    /** CO2 component of tax */
    co2Tax: number;
    /** Age depreciation discount */
    ageDiscount: number;
    /** Electric/Hybrid discount */
    ecoDiscount: number;
    /** Import duty (non-EU) */
    importDuty: number;
    /** VAT amount */
    vat: number;
    /** Description */
    description: string;
    /** Tax breakdown */
    breakdown: { label: string; amount: number; isDiscount?: boolean }[];
}

/**
 * CO2 tax bands (EUR per g/km) - 2026 rates
 * Progressive system based on emissions
 */
const CO2_TAX_BANDS = [
    { maxCO2: 0, rate: 0 },        // Electric - 0 tax
    { maxCO2: 50, rate: 0 },       // Very low emissions
    { maxCO2: 100, rate: 8 },      // Low emissions
    { maxCO2: 130, rate: 15 },     // Medium-low
    { maxCO2: 150, rate: 25 },     // Medium
    { maxCO2: 170, rate: 40 },     // Medium-high
    { maxCO2: 200, rate: 60 },     // High
    { maxCO2: 250, rate: 100 },    // Very high
    { maxCO2: Infinity, rate: 150 }, // Extremely high
];

/**
 * Age depreciation rates for used vehicles
 */
const AGE_DEPRECIATION: { [key: number]: number } = {
    0: 0,      // New - no discount
    1: 0.10,   // 1 year - 10%
    2: 0.18,   // 2 years - 18%
    3: 0.25,   // 3 years - 25%
    4: 0.31,   // 4 years - 31%
    5: 0.36,   // 5 years - 36%
    6: 0.40,   // 6 years - 40%
    7: 0.44,   // 7 years - 44%
    8: 0.47,   // 8 years - 47%
    9: 0.50,   // 9 years - 50%
    10: 0.52,  // 10+ years - 52%
};

/**
 * Fuel type eco discounts
 */
const FUEL_TYPE_DISCOUNTS: { [key: string]: number } = {
    electric: 1.0,      // 100% discount on CO2 tax
    plugin_hybrid: 0.75, // 75% discount
    hybrid: 0.25,        // 25% discount
    petrol: 0,
    diesel: 0,
};

const VAT_RATE = 0.18; // 18% VAT in Malta
const NON_EU_IMPORT_DUTY_RATE = 0.10; // 10% for non-EU imports

/**
 * Calculate vehicle registration tax
 */
export function calculateVehicleRegistrationTax(input: VehicleRegistrationTaxInput): VehicleRegistrationTaxOutput {
    const { co2Emissions, vehicleAge, fuelType, vehicleValue, isEU } = input;

    const breakdown: { label: string; amount: number; isDiscount?: boolean }[] = [];

    // 1. Calculate CO2-based tax
    let co2Tax = 0;
    for (const band of CO2_TAX_BANDS) {
        if (co2Emissions <= band.maxCO2) {
            co2Tax = co2Emissions * band.rate;
            break;
        }
    }

    // 2. Apply eco discount for electric/hybrid
    const ecoDiscountRate = FUEL_TYPE_DISCOUNTS[fuelType] || 0;
    const ecoDiscount = co2Tax * ecoDiscountRate;
    co2Tax = co2Tax - ecoDiscount;

    breakdown.push({ label: 'CO2 Emissions Tax', amount: co2Tax + ecoDiscount });

    if (ecoDiscount > 0) {
        breakdown.push({
            label: `${fuelType.replace('_', ' ').toUpperCase()} Eco Discount`,
            amount: -ecoDiscount,
            isDiscount: true
        });
    }

    // 3. Apply age depreciation
    const ageRate = AGE_DEPRECIATION[Math.min(vehicleAge, 10)] || AGE_DEPRECIATION[10];
    const ageDiscount = co2Tax * ageRate;
    const taxAfterAge = co2Tax - ageDiscount;

    if (ageDiscount > 0) {
        breakdown.push({
            label: `Age Depreciation (${vehicleAge}+ years)`,
            amount: -ageDiscount,
            isDiscount: true
        });
    }

    // 4. Calculate import duty for non-EU vehicles
    let importDuty = 0;
    if (!isEU) {
        importDuty = vehicleValue * NON_EU_IMPORT_DUTY_RATE;
        breakdown.push({ label: 'Non-EU Import Duty (10%)', amount: importDuty });
    }

    // 5. Calculate VAT on vehicle value (if applicable for new imports)
    let vat = 0;
    if (vehicleAge === 0 || !isEU) {
        vat = vehicleValue * VAT_RATE;
        breakdown.push({ label: 'VAT (18%)', amount: vat });
    }

    // Total tax
    const totalTax = taxAfterAge + importDuty + vat;

    // Generate description
    let description = '';
    if (fuelType === 'electric') {
        description = 'Electric vehicles are exempt from CO2-based registration tax in Malta.';
    } else if (fuelType === 'plugin_hybrid' || fuelType === 'hybrid') {
        description = `${fuelType === 'plugin_hybrid' ? 'Plug-in hybrid' : 'Hybrid'} vehicles receive significant tax discounts.`;
    } else {
        description = `Registration tax calculated based on ${co2Emissions}g/km CO2 emissions.`;
    }

    if (vehicleAge > 0) {
        description += ` Age depreciation of ${(ageRate * 100).toFixed(0)}% applied.`;
    }

    return {
        totalTax: Math.round(totalTax),
        co2Tax: Math.round(taxAfterAge),
        ageDiscount: Math.round(ageDiscount),
        ecoDiscount: Math.round(ecoDiscount),
        importDuty: Math.round(importDuty),
        vat: Math.round(vat),
        description,
        breakdown,
    };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-MT', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Get vehicle registration tax info
 */
export function getVehicleRegistrationTaxInfo() {
    return {
        vatRate: VAT_RATE * 100,
        importDutyRate: NON_EU_IMPORT_DUTY_RATE * 100,
        co2Bands: CO2_TAX_BANDS,
        ageDepreciation: AGE_DEPRECIATION,
        fuelDiscounts: FUEL_TYPE_DISCOUNTS,
    };
}
