/**
 * Malta Road License (Annual Circulation Tax) Calculator
 * Based on Transport Malta motor vehicle licensing regulations
 */

export interface RoadLicenseInput {
    /** Engine capacity in cc */
    engineCapacity: number;
    /** CO2 emissions in g/km (for newer vehicles) */
    co2Emissions: number;
    /** Vehicle age in years */
    vehicleAge: number;
    /** Fuel type */
    fuelType: 'petrol' | 'diesel' | 'hybrid' | 'plugin_hybrid' | 'electric' | 'lpg';
    /** Vehicle category */
    vehicleCategory: 'private_car' | 'motorcycle' | 'commercial' | 'vintage';
    /** License period in months */
    licensePeriod: 3 | 6 | 12;
}

export interface RoadLicenseOutput {
    /** Annual license fee */
    annualFee: number;
    /** Fee for selected period */
    periodFee: number;
    /** Monthly equivalent */
    monthlyEquivalent: number;
    /** Base fee */
    baseFee: number;
    /** CO2 surcharge */
    co2Surcharge: number;
    /** Eco discount */
    ecoDiscount: number;
    /** Description */
    description: string;
}

/**
 * Base license fees by engine capacity (EUR per year) - Private cars
 */
const ENGINE_CAPACITY_FEES: { maxCC: number; fee: number }[] = [
    { maxCC: 1000, fee: 60 },
    { maxCC: 1200, fee: 80 },
    { maxCC: 1400, fee: 100 },
    { maxCC: 1600, fee: 130 },
    { maxCC: 1800, fee: 160 },
    { maxCC: 2000, fee: 200 },
    { maxCC: 2500, fee: 280 },
    { maxCC: 3000, fee: 380 },
    { maxCC: Infinity, fee: 500 },
];

/**
 * CO2 surcharge bands (EUR per year)
 */
const CO2_SURCHARGE_BANDS: { maxCO2: number; surcharge: number }[] = [
    { maxCO2: 100, surcharge: 0 },
    { maxCO2: 130, surcharge: 20 },
    { maxCO2: 150, surcharge: 40 },
    { maxCO2: 170, surcharge: 70 },
    { maxCO2: 200, surcharge: 120 },
    { maxCO2: 250, surcharge: 200 },
    { maxCO2: Infinity, surcharge: 350 },
];

/**
 * Motorcycle fees by engine capacity
 */
const MOTORCYCLE_FEES: { maxCC: number; fee: number }[] = [
    { maxCC: 125, fee: 25 },
    { maxCC: 250, fee: 35 },
    { maxCC: 500, fee: 50 },
    { maxCC: 750, fee: 70 },
    { maxCC: Infinity, fee: 100 },
];

/**
 * Fuel type discounts
 */
const FUEL_ECO_DISCOUNTS: { [key: string]: number } = {
    electric: 1.0,      // 100% discount (free)
    plugin_hybrid: 0.50, // 50% discount
    hybrid: 0.25,        // 25% discount
    lpg: 0.15,           // 15% discount
    petrol: 0,
    diesel: 0,
};

const VINTAGE_VEHICLE_FEE = 30; // Flat fee for vintage vehicles (25+ years)

/**
 * Calculate road license fee
 */
export function calculateRoadLicense(input: RoadLicenseInput): RoadLicenseOutput {
    const { engineCapacity, co2Emissions, vehicleAge, fuelType, vehicleCategory, licensePeriod } = input;

    let baseFee = 0;
    let co2Surcharge = 0;
    let ecoDiscount = 0;

    // Handle vintage vehicles
    if (vehicleCategory === 'vintage' || vehicleAge >= 25) {
        baseFee = VINTAGE_VEHICLE_FEE;
        co2Surcharge = 0;
        ecoDiscount = 0;
    } else if (vehicleCategory === 'motorcycle') {
        // Motorcycle fees
        for (const band of MOTORCYCLE_FEES) {
            if (engineCapacity <= band.maxCC) {
                baseFee = band.fee;
                break;
            }
        }
    } else {
        // Private car or commercial
        for (const band of ENGINE_CAPACITY_FEES) {
            if (engineCapacity <= band.maxCC) {
                baseFee = band.fee;
                break;
            }
        }

        // CO2 surcharge for vehicles with known emissions
        if (co2Emissions > 0) {
            for (const band of CO2_SURCHARGE_BANDS) {
                if (co2Emissions <= band.maxCO2) {
                    co2Surcharge = band.surcharge;
                    break;
                }
            }
        }
    }

    // Apply eco discount
    const discountRate = FUEL_ECO_DISCOUNTS[fuelType] || 0;
    ecoDiscount = (baseFee + co2Surcharge) * discountRate;

    // Calculate annual fee
    const annualFee = Math.max(0, baseFee + co2Surcharge - ecoDiscount);

    // Calculate period fee (with small discount for longer periods)
    let periodMultiplier = licensePeriod / 12;
    if (licensePeriod === 12) periodMultiplier = 1;
    else if (licensePeriod === 6) periodMultiplier = 0.55; // 5% savings
    else if (licensePeriod === 3) periodMultiplier = 0.28; // 3% savings

    const periodFee = Math.round(annualFee * periodMultiplier);
    const monthlyEquivalent = annualFee / 12;

    // Generate description
    let description = '';
    if (fuelType === 'electric') {
        description = 'Electric vehicles are exempt from road license fees in Malta!';
    } else if (vehicleCategory === 'vintage') {
        description = 'Vintage vehicles (25+ years) enjoy a reduced flat rate of €30 per year.';
    } else {
        description = `Annual road license for ${engineCapacity}cc ${fuelType} vehicle.`;
        if (co2Surcharge > 0) {
            description += ` CO2 surcharge of €${co2Surcharge} applied.`;
        }
    }

    return {
        annualFee: Math.round(annualFee),
        periodFee,
        monthlyEquivalent: Math.round(monthlyEquivalent * 100) / 100,
        baseFee: Math.round(baseFee),
        co2Surcharge: Math.round(co2Surcharge),
        ecoDiscount: Math.round(ecoDiscount),
        description,
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
 * Get road license info
 */
export function getRoadLicenseInfo() {
    return {
        engineCapacityFees: ENGINE_CAPACITY_FEES,
        co2SurchargeBands: CO2_SURCHARGE_BANDS,
        motorcycleFees: MOTORCYCLE_FEES,
        fuelDiscounts: FUEL_ECO_DISCOUNTS,
        vintageVehicleFee: VINTAGE_VEHICLE_FEE,
    };
}
