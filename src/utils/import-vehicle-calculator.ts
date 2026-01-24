/**
 * Malta Import Vehicle Valuation Calculator
 * Based on Transport Malta and Customs import regulations
 */

export interface ImportVehicleInput {
    /** Purchase price in original currency */
    purchasePrice: number;
    /** Currency of purchase */
    currency: 'EUR' | 'GBP' | 'USD' | 'JPY';
    /** Vehicle age in years */
    vehicleAge: number;
    /** CO2 emissions in g/km */
    co2Emissions: number;
    /** Engine capacity in cc */
    engineCapacity: number;
    /** Fuel type */
    fuelType: 'petrol' | 'diesel' | 'hybrid' | 'plugin_hybrid' | 'electric';
    /** Import from EU */
    isEU: boolean;
    /** Shipping cost */
    shippingCost: number;
    /** Is it a new vehicle */
    isNew: boolean;
}

export interface ImportVehicleOutput {
    /** Vehicle value in EUR */
    vehicleValueEUR: number;
    /** Registration tax */
    registrationTax: number;
    /** Import duty (non-EU only) */
    importDuty: number;
    /** VAT */
    vat: number;
    /** Shipping cost in EUR */
    shippingCostEUR: number;
    /** VRT fee */
    vrtFee: number;
    /** Number plates fee */
    numberPlatesFee: number;
    /** Total cost to get on road */
    totalCost: number;
    /** Total taxes and fees */
    totalTaxesFees: number;
    /** Description */
    description: string;
    /** Breakdown */
    breakdown: { label: string; amount: number; category: 'cost' | 'tax' | 'fee' }[];
}

/**
 * Currency exchange rates (approximate - should be updated)
 */
const EXCHANGE_RATES: { [key: string]: number } = {
    EUR: 1,
    GBP: 1.17,
    USD: 0.92,
    JPY: 0.0062,
};

/**
 * CO2 registration tax bands
 */
const CO2_TAX_BANDS = [
    { maxCO2: 0, rate: 0 },
    { maxCO2: 50, rate: 0 },
    { maxCO2: 100, rate: 8 },
    { maxCO2: 130, rate: 15 },
    { maxCO2: 150, rate: 25 },
    { maxCO2: 170, rate: 40 },
    { maxCO2: 200, rate: 60 },
    { maxCO2: 250, rate: 100 },
    { maxCO2: Infinity, rate: 150 },
];

/**
 * Age depreciation for tax calculation
 */
const AGE_DEPRECIATION: { [key: number]: number } = {
    0: 0,
    1: 0.10,
    2: 0.18,
    3: 0.25,
    4: 0.31,
    5: 0.36,
    6: 0.40,
    7: 0.44,
    8: 0.47,
    9: 0.50,
    10: 0.52,
};

/**
 * Fuel type discounts
 */
const FUEL_DISCOUNTS: { [key: string]: number } = {
    electric: 1.0,
    plugin_hybrid: 0.75,
    hybrid: 0.25,
    petrol: 0,
    diesel: 0,
};

const VAT_RATE = 0.18;
const IMPORT_DUTY_RATE = 0.10;
const VRT_FEE = 36;
const NUMBER_PLATES_FEE = 35;
const REGISTRATION_FEE = 50;

/**
 * Calculate import vehicle costs
 */
export function calculateImportVehicle(input: ImportVehicleInput): ImportVehicleOutput {
    const {
        purchasePrice,
        currency,
        vehicleAge,
        co2Emissions,
        fuelType,
        isEU,
        shippingCost,
        isNew,
    } = input;

    const breakdown: { label: string; amount: number; category: 'cost' | 'tax' | 'fee' }[] = [];

    // Convert to EUR
    const exchangeRate = EXCHANGE_RATES[currency] || 1;
    const vehicleValueEUR = Math.round(purchasePrice * exchangeRate);
    const shippingCostEUR = Math.round(shippingCost * exchangeRate);

    breakdown.push({ label: 'Vehicle Value (EUR)', amount: vehicleValueEUR, category: 'cost' });

    if (shippingCostEUR > 0) {
        breakdown.push({ label: 'Shipping Cost', amount: shippingCostEUR, category: 'cost' });
    }

    // Calculate customs value (CIF - Cost Insurance Freight)
    const customsValue = vehicleValueEUR + shippingCostEUR;

    // Import duty (non-EU only)
    let importDuty = 0;
    if (!isEU) {
        importDuty = Math.round(customsValue * IMPORT_DUTY_RATE);
        breakdown.push({ label: 'Import Duty (10%)', amount: importDuty, category: 'tax' });
    }

    // VAT calculation
    let vat = 0;
    const vatBase = customsValue + importDuty;

    // EU new vehicles and all non-EU vehicles pay VAT
    if (isNew || !isEU) {
        vat = Math.round(vatBase * VAT_RATE);
        breakdown.push({ label: 'VAT (18%)', amount: vat, category: 'tax' });
    }

    // Registration tax (CO2 based)
    let co2Tax = 0;
    for (const band of CO2_TAX_BANDS) {
        if (co2Emissions <= band.maxCO2) {
            co2Tax = co2Emissions * band.rate;
            break;
        }
    }

    // Apply fuel type discount
    const fuelDiscount = FUEL_DISCOUNTS[fuelType] || 0;
    co2Tax = co2Tax * (1 - fuelDiscount);

    // Apply age depreciation
    const ageRate = AGE_DEPRECIATION[Math.min(vehicleAge, 10)] || AGE_DEPRECIATION[10];
    const registrationTax = Math.round(co2Tax * (1 - ageRate));

    if (registrationTax > 0) {
        breakdown.push({ label: 'Registration Tax (CO2)', amount: registrationTax, category: 'tax' });
    }

    // Fixed fees
    breakdown.push({ label: 'VRT Inspection', amount: VRT_FEE, category: 'fee' });
    breakdown.push({ label: 'Number Plates', amount: NUMBER_PLATES_FEE, category: 'fee' });
    breakdown.push({ label: 'Registration Fee', amount: REGISTRATION_FEE, category: 'fee' });

    // Calculate totals
    const totalTaxesFees = importDuty + vat + registrationTax + VRT_FEE + NUMBER_PLATES_FEE + REGISTRATION_FEE;
    const totalCost = vehicleValueEUR + shippingCostEUR + totalTaxesFees;

    // Generate description
    let description = '';
    if (isEU) {
        description = `Importing ${vehicleAge > 0 ? 'used' : 'new'} vehicle from EU. `;
        if (!isNew && vehicleAge > 0) {
            description += 'No VAT on used vehicles from EU. ';
        }
    } else {
        description = `Importing vehicle from outside EU. 10% import duty and 18% VAT apply. `;
    }

    if (fuelType === 'electric') {
        description += 'Electric vehicle - exempt from CO2 registration tax!';
    } else if (fuelType === 'plugin_hybrid' || fuelType === 'hybrid') {
        description += `${fuelType === 'plugin_hybrid' ? 'Plug-in hybrid' : 'Hybrid'} receives registration tax discount.`;
    }

    return {
        vehicleValueEUR,
        registrationTax,
        importDuty,
        vat,
        shippingCostEUR,
        vrtFee: VRT_FEE,
        numberPlatesFee: NUMBER_PLATES_FEE,
        totalCost,
        totalTaxesFees,
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
 * Get import vehicle info
 */
export function getImportVehicleInfo() {
    return {
        vatRate: VAT_RATE * 100,
        importDutyRate: IMPORT_DUTY_RATE * 100,
        vrtFee: VRT_FEE,
        numberPlatesFee: NUMBER_PLATES_FEE,
        registrationFee: REGISTRATION_FEE,
        exchangeRates: EXCHANGE_RATES,
    };
}
