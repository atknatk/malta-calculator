/**
 * Payslip Generate API
 * Creates a new payslip and saves it to database
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { randomBytes } from "crypto";

// Generate a short random token (6-8 chars, alphanumeric, URL-safe)
function generateShortToken(length: number = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"; // No O/0/I/l/1 for clarity
  const bytes = randomBytes(length);
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars[bytes[i] % chars.length];
  }
  return token;
}

interface PayslipGenerateRequest {
  employeeId: string;
  periodMonth: number;
  periodYear: number;
  grossSalary: number;
  netSalary: number;
  deductions: {
    incomeTax: number;
    sscEmployee: number;
    sscEmployer?: number;
    cola?: number;
    bonus?: number;
    allowance?: number;
  };
  salaryConfig?: {
    annualGross: number;
    taxType: string;
    childCount: number;
    sscCategory: string;
    birthYear: number;
  };
}

interface PayslipGenerateResponse {
  success: boolean;
  payslipId?: string;
  error?: string;
}

// Plan limits
const PLAN_LIMITS = {
  free: { payslipsPerMonth: 2 },
  basic: { payslipsPerMonth: 10 },
  pro: { payslipsPerMonth: 100 },
};

export async function POST(
  request: NextRequest,
): Promise<NextResponse<PayslipGenerateResponse>> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 },
      );
    }

    const body: PayslipGenerateRequest = await request.json();

    // Validate required fields
    if (!body.employeeId || !body.periodMonth || !body.periodYear) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    // Get company
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("id, plan")
      .eq("clerk_user_id", userId)
      .single();

    if (companyError || !company) {
      return NextResponse.json(
        { success: false, error: "Company not found" },
        { status: 404 },
      );
    }

    const companyData = company as {
      id: string;
      plan: "free" | "basic" | "pro";
    };
    const limits = PLAN_LIMITS[companyData.plan] || PLAN_LIMITS.free;

    // Check monthly payslip limit
    const now = new Date();
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    ).toISOString();
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    ).toISOString();

    const { count: payslipCount } = await supabase
      .from("payslips")
      .select("*", { count: "exact", head: true })
      .eq("company_id", companyData.id)
      .gte("created_at", startOfMonth)
      .lte("created_at", endOfMonth);

    if ((payslipCount ?? 0) >= limits.payslipsPerMonth) {
      return NextResponse.json(
        {
          success: false,
          error: `You have reached your limit of ${limits.payslipsPerMonth} payslips this month.`,
        },
        { status: 429 },
      );
    }

    // Verify employee belongs to company
    const { data: employee, error: employeeError } = await supabase
      .from("employees")
      .select("id, company_id")
      .eq("id", body.employeeId)
      .eq("company_id", companyData.id)
      .single();

    if (employeeError || !employee) {
      return NextResponse.json(
        { success: false, error: "Employee not found" },
        { status: 404 },
      );
    }

    // Check if payslip already exists for this period
    const { data: existingPayslip } = await supabase
      .from("payslips")
      .select("id")
      .eq("employee_id", body.employeeId)
      .eq("period_month", body.periodMonth)
      .eq("period_year", body.periodYear)
      .single();

    if (existingPayslip) {
      return NextResponse.json(
        { success: false, error: "A payslip already exists for this period" },
        { status: 409 },
      );
    }

    // Generate short access token for payslip verification (8 chars)
    const accessToken = generateShortToken(8);

    // Create payslip
    const { data: payslip, error: createError } = await supabase
      .from("payslips")
      .insert({
        company_id: companyData.id,
        employee_id: body.employeeId,
        period_month: body.periodMonth,
        period_year: body.periodYear,
        gross_salary: body.grossSalary,
        net_salary: body.netSalary,
        deductions: body.deductions,
        access_token: accessToken,
      })
      .select("id")
      .single();

    if (createError || !payslip) {
      console.error("Error creating payslip:", createError);
      return NextResponse.json(
        { success: false, error: "Failed to create payslip" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      payslipId: (payslip as { id: string }).id,
    });
  } catch (error) {
    console.error("Payslip generate API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
