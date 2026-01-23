/**
 * Salary Calculator API
 * Token-protected API endpoint for salary calculations
 * 
 * Usage:
 * POST /api/salary/calculate
 * Headers: { "Authorization": "Bearer YOUR_API_TOKEN" }
 * Body: { salary, year, taxType, sscCategory, ... }
 */
import { NextRequest, NextResponse } from "next/server";
import { Month, MonthlySalaryInput, MonthlySalaryOutput, SalaryCalculatorConfig } from "@/types/salary-calculator-type";
import { calculateMonthlyDeductions } from "@/utils/salary-calculator";
import { SSCCategory, TaxRateType } from "@/config/malta-tax-config";

// Request body type
interface SalaryCalculationRequest {
    salary: number;
    year?: number;
    taxType?: "single" | "married" | "parent";
    sscCategory?: "A" | "B" | "C" | "D";
    birthYear?: number;
    yearlyNonTaxBenefit?: number;
    yearlyTaxableBenefit?: number;
    monthlyBonus?: number;
    allowanceBonus?: number;
}

// Response type
interface SalaryCalculationResponse {
    success: boolean;
    data?: {
        input: {
            grossSalary: number;
            year: number;
            taxType: string;
            sscCategory: string;
        };
        summary: {
            annual: {
                gross: number;
                ssc: number;
                tax: number;
                net: number;
            };
            monthly: {
                gross: number;
                ssc: number;
                tax: number;
                net: number;
            };
        };
        monthlyBreakdown: MonthlySalaryOutput[];
    };
    error?: string;
}

/**
 * Validate API token from Authorization header
 */
function validateToken(request: NextRequest): boolean {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return false;
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    const validToken = process.env.SALARY_API_TOKEN;

    if (!validToken) {
        console.error("SALARY_API_TOKEN environment variable is not set");
        return false;
    }

    return token === validToken;
}

/**
 * Build calculator config from request
 */
function buildConfig(params: SalaryCalculationRequest): SalaryCalculatorConfig {
    const currentYear = new Date().getFullYear();

    return {
        year: params.year ?? currentYear,
        taxRateType: (params.taxType ?? "single") as TaxRateType,
        sscCategory: (params.sscCategory ?? "C") as SSCCategory,
        birthDate: new Date(params.birthYear ?? 1990, 0, 1),
        yearlyNonTaxBenefit: params.yearlyNonTaxBenefit ?? 0,
        yearlyTaxableBenefit: params.yearlyTaxableBenefit ?? 0,
        monthlyBonus: params.monthlyBonus ?? 0,
        enableCOLA: true,
    };
}

/**
 * Build monthly salary inputs
 */
function buildMonthlySalaries(params: SalaryCalculationRequest): MonthlySalaryInput[] {
    const monthlySalaries: MonthlySalaryInput[] = [];
    const monthlyGross = params.salary > 0 ? Number((params.salary / 12).toFixed(2)) : 0;

    for (const month of Object.values(Month)) {
        monthlySalaries.push({
            month,
            allowanceBonus: params.allowanceBonus ?? 0,
            grossWage: monthlyGross,
        });
    }

    return monthlySalaries;
}

/**
 * Calculate summary from monthly data
 */
function calculateSummary(data: MonthlySalaryOutput[]) {
    const totalGross = data.reduce((sum, d) => sum + d.grossTotal, 0);
    const totalSSC = data.reduce((sum, d) => sum + d.sscTax, 0);
    const totalTax = data.reduce((sum, d) => sum + d.incomeTax, 0);
    const totalNet = data.reduce((sum, d) => sum + d.net, 0);

    return {
        annual: {
            gross: Math.round(totalGross * 100) / 100,
            ssc: Math.round(totalSSC * 100) / 100,
            tax: Math.round(totalTax * 100) / 100,
            net: Math.round(totalNet * 100) / 100,
        },
        monthly: {
            gross: Math.round((totalGross / 12) * 100) / 100,
            ssc: Math.round((totalSSC / 12) * 100) / 100,
            tax: Math.round((totalTax / 12) * 100) / 100,
            net: Math.round((totalNet / 12) * 100) / 100,
        },
    };
}

/**
 * POST /api/salary/calculate
 * Calculate salary with token authentication
 */
export async function POST(request: NextRequest): Promise<NextResponse<SalaryCalculationResponse>> {
    // Validate token
    if (!validateToken(request)) {
        return NextResponse.json(
            { success: false, error: "Unauthorized: Invalid or missing API token" },
            { status: 401 }
        );
    }

    try {
        // Parse request body
        const body: SalaryCalculationRequest = await request.json();

        // Validate required fields
        if (!body.salary || typeof body.salary !== "number" || body.salary <= 0) {
            return NextResponse.json(
                { success: false, error: "Invalid request: salary is required and must be a positive number" },
                { status: 400 }
            );
        }

        // Build config and calculate
        const config = buildConfig(body);
        const monthlySalaries = buildMonthlySalaries(body);
        const monthlyBreakdown = calculateMonthlyDeductions(monthlySalaries, config);
        const summary = calculateSummary(monthlyBreakdown);

        return NextResponse.json({
            success: true,
            data: {
                input: {
                    grossSalary: body.salary,
                    year: config.year,
                    taxType: config.taxRateType,
                    sscCategory: config.sscCategory,
                },
                summary,
                monthlyBreakdown,
            },
        });
    } catch (error) {
        console.error("Salary calculation API error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * GET /api/salary/calculate
 * Returns API documentation
 */
export async function GET(): Promise<NextResponse> {
    return NextResponse.json({
        name: "Malta Salary Calculator API",
        version: "1.0.0",
        description: "Calculate net salary with Malta tax rules",
        authentication: "Bearer token required in Authorization header",
        endpoint: "POST /api/salary/calculate",
        request: {
            salary: { type: "number", required: true, description: "Annual gross salary in EUR" },
            year: { type: "number", required: false, default: "current year", description: "Tax year" },
            taxType: { type: "string", required: false, default: "single", enum: ["single", "married", "parent"] },
            sscCategory: { type: "string", required: false, default: "C", enum: ["A", "B", "C", "D"] },
            birthYear: { type: "number", required: false, default: 1990, description: "Birth year for SSC calculation" },
            yearlyNonTaxBenefit: { type: "number", required: false, default: 0 },
            yearlyTaxableBenefit: { type: "number", required: false, default: 0 },
            monthlyBonus: { type: "number", required: false, default: 0 },
            allowanceBonus: { type: "number", required: false, default: 0 },
        },
        example: {
            curl: 'curl -X POST http://localhost:3000/api/salary/calculate -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" -d \'{"salary": 50000, "year": 2025, "taxType": "single"}\'',
        },
    });
}
