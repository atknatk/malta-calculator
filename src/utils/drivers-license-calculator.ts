/**
 * Malta Driver's License Fees Calculator
 * Based on Transport Malta licensing regulations
 */

export interface DriversLicenseInput {
    /** License type */
    licenseType: 'new' | 'renewal' | 'international' | 'replacement' | 'category_upgrade';
    /** Age of applicant */
    age: number;
    /** License category */
    category: 'A' | 'A1' | 'A2' | 'AM' | 'B' | 'BE' | 'C' | 'C1' | 'CE' | 'D' | 'D1' | 'DE';
    /** License validity period in years */
    validityPeriod: 1 | 5 | 10;
    /** Include theory test */
    includeTheoryTest: boolean;
    /** Include practical test */
    includePracticalTest: boolean;
    /** Is it first license */
    isFirstLicense: boolean;
}

export interface DriversLicenseOutput {
    /** Total cost */
    totalCost: number;
    /** License fee */
    licenseFee: number;
    /** Theory test fee */
    theoryTestFee: number;
    /** Practical test fee */
    practicalTestFee: number;
    /** Medical certificate fee (estimated) */
    medicalFee: number;
    /** Photo fee (estimated) */
    photoFee: number;
    /** Description */
    description: string;
    /** Validity period */
    validity: string;
    /** Breakdown */
    breakdown: { label: string; amount: number }[];
}

/**
 * License fees by type (EUR)
 */
const LICENSE_FEES = {
    new: {
        '1': 15,
        '5': 30,
        '10': 45,
    },
    renewal: {
        '1': 15,
        '5': 30,
        '10': 45,
    },
    international: 23,
    replacement: 25,
    category_upgrade: 35,
};

/**
 * Test fees (EUR)
 */
const TEST_FEES = {
    theory: 30,
    practical: {
        AM: 45,  // Moped
        A1: 55,  // Motorcycle up to 125cc
        A2: 55,  // Motorcycle up to 35kW
        A: 55,   // Motorcycle unrestricted
        B: 60,   // Car
        BE: 70,  // Car with trailer
        C1: 80,  // Light lorry
        C: 90,   // Lorry
        CE: 100, // Lorry with trailer
        D1: 90,  // Minibus
        D: 100,  // Bus
        DE: 110, // Bus with trailer
    },
};

/**
 * Additional fees (estimated)
 */
const ADDITIONAL_FEES = {
    medical: 40,  // Medical certificate (doctor visit)
    photo: 8,     // Passport photos
};

/**
 * Category descriptions
 */
const CATEGORY_DESCRIPTIONS: { [key: string]: string } = {
    AM: 'Moped (up to 50cc)',
    A1: 'Motorcycle up to 125cc',
    A2: 'Motorcycle up to 35kW',
    A: 'Full Motorcycle License',
    B: 'Car License',
    BE: 'Car with Trailer',
    C1: 'Light Lorry (3.5-7.5t)',
    C: 'Heavy Lorry (7.5t+)',
    CE: 'Lorry with Trailer',
    D1: 'Minibus (up to 16 passengers)',
    D: 'Bus (17+ passengers)',
    DE: 'Bus with Trailer',
};

/**
 * Validity based on age
 */
function getMaxValidity(age: number): number {
    if (age >= 70) return 1;  // Over 70: max 1 year
    if (age >= 65) return 5;  // 65-70: max 5 years
    return 10;                 // Under 65: max 10 years
}

/**
 * Calculate driver's license fees
 */
export function calculateDriversLicenseFees(input: DriversLicenseInput): DriversLicenseOutput {
    const { licenseType, age, category, validityPeriod, includeTheoryTest, includePracticalTest, isFirstLicense } = input;

    const breakdown: { label: string; amount: number }[] = [];
    const maxValidity = getMaxValidity(age);
    const effectiveValidity = Math.min(validityPeriod, maxValidity);

    // Calculate license fee
    let licenseFee = 0;
    if (licenseType === 'international') {
        licenseFee = LICENSE_FEES.international;
        breakdown.push({ label: 'International License Fee', amount: licenseFee });
    } else if (licenseType === 'replacement') {
        licenseFee = LICENSE_FEES.replacement;
        breakdown.push({ label: 'Replacement License Fee', amount: licenseFee });
    } else if (licenseType === 'category_upgrade') {
        licenseFee = LICENSE_FEES.category_upgrade;
        breakdown.push({ label: 'Category Upgrade Fee', amount: licenseFee });
    } else {
        const fees = LICENSE_FEES[licenseType as 'new' | 'renewal'];
        licenseFee = fees[effectiveValidity.toString() as '1' | '5' | '10'];
        breakdown.push({ label: `License Fee (${effectiveValidity} year${effectiveValidity > 1 ? 's' : ''})`, amount: licenseFee });
    }

    // Theory test fee
    let theoryTestFee = 0;
    if (includeTheoryTest && (isFirstLicense || licenseType === 'category_upgrade')) {
        theoryTestFee = TEST_FEES.theory;
        breakdown.push({ label: 'Theory Test Fee', amount: theoryTestFee });
    }

    // Practical test fee
    let practicalTestFee = 0;
    if (includePracticalTest && (isFirstLicense || licenseType === 'category_upgrade')) {
        practicalTestFee = TEST_FEES.practical[category] || TEST_FEES.practical.B;
        breakdown.push({ label: `Practical Test Fee (${category})`, amount: practicalTestFee });
    }

    // Medical fee (required for first license and renewals over 65)
    let medicalFee = 0;
    if (isFirstLicense || (licenseType === 'renewal' && age >= 65) || ['C', 'C1', 'CE', 'D', 'D1', 'DE'].includes(category)) {
        medicalFee = ADDITIONAL_FEES.medical;
        breakdown.push({ label: 'Medical Certificate (estimated)', amount: medicalFee });
    }

    // Photo fee
    const photoFee = isFirstLicense || licenseType === 'renewal' ? ADDITIONAL_FEES.photo : 0;
    if (photoFee > 0) {
        breakdown.push({ label: 'Passport Photos (estimated)', amount: photoFee });
    }

    // Total cost
    const totalCost = licenseFee + theoryTestFee + practicalTestFee + medicalFee + photoFee;

    // Generate description
    const categoryDesc = CATEGORY_DESCRIPTIONS[category] || category;
    let description = '';
    if (licenseType === 'new' && isFirstLicense) {
        description = `First ${categoryDesc} license application. Valid for ${effectiveValidity} year${effectiveValidity > 1 ? 's' : ''}.`;
    } else if (licenseType === 'renewal') {
        description = `License renewal for ${categoryDesc}. Valid for ${effectiveValidity} year${effectiveValidity > 1 ? 's' : ''}.`;
    } else if (licenseType === 'international') {
        description = 'International Driving Permit valid for 12 months.';
    } else if (licenseType === 'replacement') {
        description = 'Replacement license for lost, stolen, or damaged card.';
    } else {
        description = `Category upgrade to ${categoryDesc}.`;
    }

    if (age >= 65) {
        description += ' Medical certificate required.';
    }

    return {
        totalCost: Math.round(totalCost),
        licenseFee: Math.round(licenseFee),
        theoryTestFee: Math.round(theoryTestFee),
        practicalTestFee: Math.round(practicalTestFee),
        medicalFee: Math.round(medicalFee),
        photoFee: Math.round(photoFee),
        description,
        validity: `${effectiveValidity} year${effectiveValidity > 1 ? 's' : ''}`,
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
 * Get driver's license info
 */
export function getDriversLicenseInfo() {
    return {
        licenseFees: LICENSE_FEES,
        testFees: TEST_FEES,
        additionalFees: ADDITIONAL_FEES,
        categories: CATEGORY_DESCRIPTIONS,
    };
}
