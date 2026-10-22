/**
 * Payslip Generate API
 * Creates a payslip (draft or final) or updates an existing draft
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { randomBytes } from "crypto";
import {
  ISSUED_STATUSES,
  PAYSLIP_STATUS,
  type PayslipStatus,
} from "@/utils/payslip-details";
import { issuePayslip } from "@/lib/payslip/issue";

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
  /** Var olan bir taslağı güncellemek için */
  payslipId?: string;
  /** Varsayılan "final" (geriye dönük uyumluluk) */
  status?: PayslipStatus;
  /** Void edilen bordronun yerine çıkarılan düzeltme bordrosu */
  replacesPayslipId?: string;
  employeeId: string;
  periodMonth: number;
  periodYear: number;
  grossSalary: number;
  netSalary: number;
  deductions: {
    incomeTax: number;
    sscEmployee: number;
    sscEmployer?: number;
    maternityFund?: number;
    sscBase?: number;
    cola?: number;
    bonus?: number;
    allowance?: number;
    sscWeeks?: number;
    periodStartDate?: string;
    payDate?: string;
    leaveHoursTaken?: number;
    notes?: string;
  };
  salaryConfig?: {
    annualGross: number;
    taxType: string;
    childCount: number;
    sscCategory: string;
    birthYear: number;
    startDate?: string;
    previousTaxableIncome?: number;
    previousTaxPaid?: number;
    includeStartWeekSSC?: boolean;
  };
}

interface PayslipGenerateResponse {
  success: boolean;
  payslipId?: string;
  status?: PayslipStatus;
  error?: string;
}

// Plan limits (yalnızca yayınlanan bordrolar sayılır)
const PLAN_LIMITS = {
  free: { payslipsPerMonth: 2 },
  basic: { payslipsPerMonth: 10 },
  pro: { payslipsPerMonth: 100 },
};

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

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
    const status: PayslipStatus =
      body.status === PAYSLIP_STATUS.DRAFT
        ? PAYSLIP_STATUS.DRAFT
        : PAYSLIP_STATUS.FINAL;

    // Validate required fields
    if (
      !body.employeeId ||
      !body.periodMonth ||
      !body.periodYear ||
      !isFiniteNumber(body.grossSalary) ||
      !isFiniteNumber(body.netSalary) ||
      !body.deductions ||
      !isFiniteNumber(body.deductions.incomeTax) ||
      !isFiniteNumber(body.deductions.sscEmployee)
    ) {
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

    // Check monthly limit only when issuing — drafts are free
    if (status === PAYSLIP_STATUS.FINAL) {
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
        .in("status", ISSUED_STATUSES)
        .gte("finalized_at", startOfMonth)
        .lte("finalized_at", endOfMonth);

      if ((payslipCount ?? 0) >= limits.payslipsPerMonth) {
        return NextResponse.json(
          {
            success: false,
            error: `You have reached your limit of ${limits.payslipsPerMonth} issued payslips this month. You can still save it as a draft.`,
          },
          { status: 429 },
        );
      }
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

    // Aynı çalışan + dönem için var olan bordro
    const { data: existingPayslip } = await supabase
      .from("payslips")
      .select("id, status")
      .eq("employee_id", body.employeeId)
      .eq("period_month", body.periodMonth)
      .eq("period_year", body.periodYear)
      .neq("status", PAYSLIP_STATUS.VOID)
      .maybeSingle();

    const existing = existingPayslip as {
      id: string;
      status: PayslipStatus;
    } | null;

    if (existing?.status === PAYSLIP_STATUS.FINAL) {
      return NextResponse.json(
        {
          success: false,
          error:
            "An issued payslip already exists for this period. Void it first to issue a correction.",
        },
        { status: 409 },
      );
    }

    // Güncellenecek taslak: açıkça verilen ya da aynı döneme ait olan
    let draftId: string | null = null;
    if (body.payslipId) {
      const { data: draft } = await supabase
        .from("payslips")
        .select("id, status")
        .eq("id", body.payslipId)
        .eq("company_id", companyData.id)
        .maybeSingle();

      const draftRow = draft as { id: string; status: PayslipStatus } | null;
      if (!draftRow || draftRow.status !== PAYSLIP_STATUS.DRAFT) {
        return NextResponse.json(
          { success: false, error: "Draft not found or already issued" },
          { status: 404 },
        );
      }
      if (existing && existing.id !== draftRow.id) {
        return NextResponse.json(
          {
            success: false,
            error: "Another draft already exists for this employee and period",
          },
          { status: 409 },
        );
      }
      draftId = draftRow.id;
    } else if (existing) {
      draftId = existing.id;
    }

    // Düzeltme bordrosu: aynı çalışan + dönemin void edilmiş bordrosu olmalı
    let replacesPayslipId: string | null = null;
    if (body.replacesPayslipId) {
      const { data: replaced } = await supabase
        .from("payslips")
        .select("id")
        .eq("id", body.replacesPayslipId)
        .eq("company_id", companyData.id)
        .eq("employee_id", body.employeeId)
        .eq("period_month", body.periodMonth)
        .eq("period_year", body.periodYear)
        .eq("status", PAYSLIP_STATUS.VOID)
        .maybeSingle();
      if (!replaced) {
        return NextResponse.json(
          {
            success: false,
            error: "The payslip being replaced must be a voided payslip for the same employee and period",
          },
          { status: 400 },
        );
      }
      replacesPayslipId = (replaced as { id: string }).id;
    }

    // Her bordro önce taslak olarak kaydedilir; yayınlama ayrı adımdır
    // (snapshot + parmak izi, bkz. issuePayslip)
    const now = new Date().toISOString();
    const values = {
      employee_id: body.employeeId,
      period_month: body.periodMonth,
      period_year: body.periodYear,
      gross_salary: body.grossSalary,
      net_salary: body.netSalary,
      // salaryConfig deductions jsonb içinde saklanır (ayrı kolon yok)
      deductions: {
        ...body.deductions,
        ...(body.salaryConfig ? { salaryConfig: body.salaryConfig } : {}),
      },
      status: PAYSLIP_STATUS.DRAFT,
      updated_at: now,
      ...(replacesPayslipId ? { replaces_payslip_id: replacesPayslipId } : {}),
    };

    const { data: payslip, error: saveError } = draftId
      ? await supabase
          .from("payslips")
          .update(values)
          .eq("id", draftId)
          .eq("company_id", companyData.id)
          .select("id")
          .single()
      : await supabase
          .from("payslips")
          .insert({
            ...values,
            company_id: companyData.id,
            // Short access token for payslip verification (8 chars)
            access_token: generateShortToken(8),
          })
          .select("id")
          .single();

    if (saveError || !payslip) {
      console.error("Error saving payslip:", saveError);
      return NextResponse.json(
        { success: false, error: "Failed to save payslip" },
        { status: 500 },
      );
    }

    const payslipId = (payslip as { id: string }).id;

    if (status === PAYSLIP_STATUS.FINAL) {
      const issued = await issuePayslip(supabase, payslipId, companyData.id);
      if (!issued.success) {
        return NextResponse.json(
          {
            success: false,
            payslipId,
            error: `Saved as draft, but it could not be issued: ${issued.error}`,
          },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ success: true, payslipId, status });
  } catch (error) {
    console.error("Payslip generate API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
