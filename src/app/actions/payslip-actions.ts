"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import {
  ISSUED_STATUSES,
  PAYSLIP_STATUS,
  type PayslipStatus,
} from "@/utils/payslip-details";
import { issuePayslip, voidIssuedPayslip } from "@/lib/payslip/issue";
import {
  EMPTY_YTD,
  fetchYearToDateTotals,
  type YearToDateTotals,
} from "@/lib/payslip/document-props";
import {
  carryOverSalaryConfig,
  normalizeSalaryConfig,
  type PayslipSalaryConfig,
} from "@/lib/payslip/compute";

// Use admin client since we verify auth with Clerk
// This bypasses RLS but is safe because we check userId

// ============ TYPES ============

interface Company {
  id: string;
  clerk_user_id: string;
  name: string;
  logo_url: string | null;
  address: string | null;
  tax_number: string | null;
  plan: "free" | "basic" | "pro";
  created_at: string;
  updated_at: string;
}

interface Employee {
  id: string;
  company_id: string;
  name: string;
  email: string | null;
  employee_code: string | null;
  position: string | null;
  phone: string | null;
  date_of_birth: string | null;
  pin_hash: string | null;
  salary_details: Record<string, unknown> | null;
  // New fields for professional payslip
  address: string | null;
  id_number: string | null;
  ss_number: string | null;
  department: string | null;
  section: string | null;
  unit: string | null;
  grade: string | null;
  created_at: string;
  updated_at: string;
}

interface Payslip {
  id: string;
  company_id: string;
  employee_id: string;
  period_month: number;
  period_year: number;
  gross_salary: number;
  net_salary: number;
  deductions: Record<string, unknown>;
  pdf_url: string | null;
  access_token: string;
  status: PayslipStatus;
  created_at: string;
  updated_at: string;
  finalized_at: string | null;
  snapshot: unknown;
  content_hash: string | null;
  voided_at: string | null;
  void_reason: string | null;
  replaces_payslip_id: string | null;
}

// ============ COMPANY ACTIONS ============

export async function getCompany(): Promise<Company | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("clerk_user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching company:", error);
    return null;
  }

  return data as Company;
}

export async function createCompany(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };

  const name = formData.get("name") as string;
  const address = formData.get("address") as string | null;
  const taxNumber = formData.get("taxNumber") as string | null;

  if (!name || name.trim().length < 2) {
    return { success: false, error: "Company name is required" };
  }

  const supabase = createAdminClient();

  const { error } = await supabase.from("companies").insert({
    clerk_user_id: userId,
    name: name.trim(),
    address: address?.trim() || null,
    tax_number: taxNumber?.trim() || null,
    plan: "free",
  });

  if (error) {
    console.error("Error creating company:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateCompany(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };

  const name = formData.get("name") as string;
  const address = formData.get("address") as string | null;
  const taxNumber = formData.get("taxNumber") as string | null;

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("companies")
    .update({
      name: name.trim(),
      address: address?.trim() || null,
      tax_number: taxNumber?.trim() || null,
    })
    .eq("clerk_user_id", userId);

  if (error) {
    console.error("Error updating company:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

// ============ EMPLOYEE ACTIONS ============

export async function getEmployees(): Promise<Employee[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const supabase = createAdminClient();

  // First get the company
  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!company) return [];

  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("company_id", (company as { id: string }).id)
    .order("name");

  if (error) {
    console.error("Error fetching employees:", error);
    return [];
  }

  return (data as Employee[]) || [];
}

export async function createEmployee(
  formData: FormData,
): Promise<{ success: boolean; error?: string; employee?: Employee }> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };

  const supabase = createAdminClient();

  // Get company
  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!company) return { success: false, error: "Company not found" };

  const name = formData.get("name") as string;
  const email = formData.get("email") as string | null;
  const employeeCode = formData.get("employeeCode") as string | null;
  const position = formData.get("position") as string | null;
  const phone = formData.get("phone") as string | null;
  const dateOfBirth = formData.get("dateOfBirth") as string | null;
  // New professional payslip fields
  const address = formData.get("address") as string | null;
  const idNumber = formData.get("idNumber") as string | null;
  const ssNumber = formData.get("ssNumber") as string | null;
  const department = formData.get("department") as string | null;
  const section = formData.get("section") as string | null;
  const unit = formData.get("unit") as string | null;
  const grade = formData.get("grade") as string | null;

  if (!name || name.trim().length < 2) {
    return { success: false, error: "Employee name is required" };
  }

  const { data, error } = await supabase
    .from("employees")
    .insert({
      company_id: (company as { id: string }).id,
      name: name.trim(),
      email: email?.trim() || null,
      employee_code: employeeCode?.trim() || null,
      position: position?.trim() || null,
      phone: phone?.trim() || null,
      date_of_birth: dateOfBirth || null,
      // New fields
      address: address?.trim() || null,
      id_number: idNumber?.trim() || null,
      ss_number: ssNumber?.trim() || null,
      department: department?.trim() || null,
      section: section?.trim() || null,
      unit: unit?.trim() || null,
      grade: grade?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating employee:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/employees");
  return { success: true, employee: data as Employee };
}

// ============ USAGE & LIMITS ============

// Plan limits:
// Free: 2 employees, 2 payslips per month
// Basic: 10 employees, 10 payslips per month
// Pro: Unlimited

const PLAN_LIMITS = {
  free: { employees: 2, payslipsPerMonth: 2 },
  basic: { employees: 10, payslipsPerMonth: 10 },
  pro: { employees: 100, payslipsPerMonth: 100 },
};

export async function getUsageLimits(): Promise<{
  employees: { used: number; limit: number };
  payslips: { used: number; limit: number };
  plan: string;
}> {
  const { userId } = await auth();
  if (!userId)
    return {
      employees: { used: 0, limit: 2 },
      payslips: { used: 0, limit: 2 },
      plan: "free",
    };

  const supabase = createAdminClient();

  // Get company with plan
  const { data: company } = await supabase
    .from("companies")
    .select("id, plan")
    .eq("clerk_user_id", userId)
    .single();

  if (!company)
    return {
      employees: { used: 0, limit: 2 },
      payslips: { used: 0, limit: 2 },
      plan: "free",
    };

  const companyData = company as { id: string; plan: "free" | "basic" | "pro" };
  const limits = PLAN_LIMITS[companyData.plan] || PLAN_LIMITS.free;

  // Count employees
  const { count: employeeCount } = await supabase
    .from("employees")
    .select("*", { count: "exact", head: true })
    .eq("company_id", companyData.id);

  // Count payslips this month
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

  // Limit yalnızca bu ay yayınlanan bordroları sayar (sonradan void
  // edilenler dahil); taslaklar ücretsiz
  const { count: payslipCount } = await supabase
    .from("payslips")
    .select("*", { count: "exact", head: true })
    .eq("company_id", companyData.id)
    .in("status", ISSUED_STATUSES)
    .gte("finalized_at", startOfMonth)
    .lte("finalized_at", endOfMonth);

  return {
    employees: { used: employeeCount ?? 0, limit: limits.employees },
    payslips: { used: payslipCount ?? 0, limit: limits.payslipsPerMonth },
    plan: companyData.plan,
  };
}

export async function canAddEmployee(): Promise<{
  allowed: boolean;
  message?: string;
}> {
  const usage = await getUsageLimits();
  if (usage.employees.used >= usage.employees.limit) {
    return {
      allowed: false,
      message: `With the ${usage.plan === "free" ? "Free" : "Basic"} plan, you can add up to ${usage.employees.limit} employees. Upgrade your plan for more.`,
    };
  }
  return { allowed: true };
}

export async function canGeneratePayslip(): Promise<{
  allowed: boolean;
  message?: string;
}> {
  const usage = await getUsageLimits();
  if (usage.payslips.used >= usage.payslips.limit) {
    return {
      allowed: false,
      message: `You have reached your limit of ${usage.payslips.limit} payslips this month. Upgrade your plan or try again next month.`,
    };
  }
  return { allowed: true };
}

// ============ PAYSLIP ACTIONS ============

export async function getRecentPayslips(
  limit = 5,
): Promise<(Payslip & { employee: Employee })[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const supabase = createAdminClient();

  // Get company
  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!company) return [];

  const { data, error } = await supabase
    .from("payslips")
    .select(
      `
      *,
      employee:employees(*)
    `,
    )
    .eq("company_id", (company as { id: string }).id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching payslips:", error);
    return [];
  }

  return (data as (Payslip & { employee: Employee })[]) || [];
}

/**
 * Yıl başından bu döneme kadar toplamlar. Yalnızca yayınlanmış bordrolar
 * sayılır; görüntülenen bordro taslaksa kendi tutarları da eklenir.
 */
export async function getYearToDateTotals(
  employeeId: string,
  year: number,
  upToMonth: number,
  currentDraft?: Pick<Payslip, "gross_salary" | "net_salary" | "deductions">,
): Promise<YearToDateTotals> {
  const { userId } = await auth();
  if (!userId) return { ...EMPTY_YTD };

  const supabase = createAdminClient();

  // Get company first to verify ownership
  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!company) return { ...EMPTY_YTD };

  return fetchYearToDateTotals(supabase, {
    companyId: (company as { id: string }).id,
    employeeId,
    year,
    upToMonth,
    currentDraft,
  });
}

export async function getPayslips(
  status?: PayslipStatus,
): Promise<(Payslip & { employee: Employee })[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const supabase = createAdminClient();

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!company) return [];

  let query = supabase
    .from("payslips")
    .select(
      `
      *,
      employee:employees(*)
    `,
    )
    .eq("company_id", (company as { id: string }).id)
    .order("period_year", { ascending: false })
    .order("period_month", { ascending: false })
    .order("updated_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching payslips:", error);
    return [];
  }

  return (data as (Payslip & { employee: Employee })[]) || [];
}

/**
 * Taslağı yayınla: çalışana görünür olur, doğrulama QR'ı aktifleşir ve
 * aylık plan limitine sayılır. Yayınlanan bordro artık düzenlenemez.
 */
export async function finalizePayslip(
  payslipId: string,
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };

  const supabase = createAdminClient();

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!company) return { success: false, error: "Company not found" };

  const limit = await canGeneratePayslip();
  if (!limit.allowed) {
    return { success: false, error: limit.message };
  }

  const result = await issuePayslip(
    supabase,
    payslipId,
    (company as { id: string }).id,
  );
  if (!result.success) return result;

  revalidatePath("/dashboard");
  revalidatePath("/payslips");
  revalidatePath(`/payslip/${payslipId}`);
  return { success: true };
}

/**
 * Yayınlanmış bordroyu geçersiz kıl (yanlış yayınlandıysa). Bordro silinmez,
 * "VOID" olarak kalır ve QR doğrulamada geçersiz görünür; aynı dönem için
 * yeni bordro çıkarılabilir.
 */
export async function voidPayslip(
  payslipId: string,
  reason: string,
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };

  const supabase = createAdminClient();

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!company) return { success: false, error: "Company not found" };

  const result = await voidIssuedPayslip(
    supabase,
    payslipId,
    (company as { id: string }).id,
    reason,
  );
  if (!result.success) return result;

  revalidatePath("/dashboard");
  revalidatePath("/payslips");
  revalidatePath(`/payslip/${payslipId}`);
  return { success: true };
}

/** Yalnızca taslaklar silinebilir; yayınlanmış bordro kayıt olarak kalır */
export async function deleteDraftPayslip(
  payslipId: string,
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };

  const supabase = createAdminClient();

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!company) return { success: false, error: "Company not found" };

  const { data, error } = await supabase
    .from("payslips")
    .delete()
    .eq("id", payslipId)
    .eq("company_id", (company as { id: string }).id)
    .eq("status", PAYSLIP_STATUS.DRAFT)
    .select("id");

  if (error) {
    console.error("Error deleting draft:", error);
    return { success: false, error: "Failed to delete draft" };
  }

  if (!data || data.length === 0) {
    return { success: false, error: "Draft not found" };
  }

  revalidatePath("/dashboard");
  revalidatePath("/payslips");
  return { success: true };
}

export async function getPayslipById(
  payslipId: string,
): Promise<(Payslip & { employee: Employee; company: Company }) | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createAdminClient();

  // Get company first to verify ownership
  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("clerk_user_id", userId)
    .single();

  if (!company) return null;

  const { data, error } = await supabase
    .from("payslips")
    .select(
      `
      *,
      employee:employees(*)
    `,
    )
    .eq("id", payslipId)
    .eq("company_id", (company as Company).id)
    .single();

  if (error || !data) {
    console.error("Error fetching payslip:", error);
    return null;
  }

  return {
    ...(data as Payslip & { employee: Employee }),
    company: company as Company,
  };
}

// ============ BULK PAYSLIPS ============

export interface BulkPayslipRow {
  employee: Pick<Employee, "id" | "name" | "employee_code" | "position">;
  /** Son bordrodaki maaş ayarları (yeni yıla taşınmış); hiç bordro yoksa null */
  defaults: PayslipSalaryConfig | null;
  /** Bu dönemin aktif (void olmayan) bordrosu */
  current: {
    id: string;
    status: PayslipStatus;
    gross: number;
    net: number;
    incomeTax: number;
    sscEmployee: number;
    bonus: number;
    allowance: number;
  } | null;
  /** Bu dönemde void edilmiş bordro var (yeni taslak düzeltme olur) */
  hasVoided: boolean;
}

/** Toplu bordro sayfası: çalışanlar + varsayılan ayarlar + dönem durumu */
export async function getBulkPayslipRows(
  month: number,
  year: number,
): Promise<BulkPayslipRow[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const supabase = createAdminClient();

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!company) return [];
  const companyId = (company as { id: string }).id;

  const [{ data: employees }, { data: history }] = await Promise.all([
    supabase
      .from("employees")
      .select("id, name, employee_code, position, date_of_birth")
      .eq("company_id", companyId)
      .order("name"),
    supabase
      .from("payslips")
      .select(
        "id, employee_id, status, period_month, period_year, gross_salary, net_salary, deductions",
      )
      .eq("company_id", companyId)
      .order("period_year", { ascending: false })
      .order("period_month", { ascending: false })
      .order("updated_at", { ascending: false }),
  ]);

  const rows = (history ?? []) as Pick<
    Payslip,
    | "id"
    | "employee_id"
    | "status"
    | "period_month"
    | "period_year"
    | "gross_salary"
    | "net_salary"
    | "deductions"
  >[];

  return (
    (employees ?? []) as (Pick<
      Employee,
      "id" | "name" | "employee_code" | "position" | "date_of_birth"
    >)[]
  ).map((employee) => {
    const own = rows.filter((r) => r.employee_id === employee.id);
    const inPeriod = own.filter(
      (r) => r.period_month === month && r.period_year === year,
    );
    const active = inPeriod.find((r) => r.status !== PAYSLIP_STATUS.VOID);

    // Varsayılan: bu dönemin taslağı, yoksa en yeni bordronun ayarları
    const source = [active, ...own].find(
      (r) => r && (r.deductions as { salaryConfig?: unknown }).salaryConfig,
    );
    const sourceConfig = (
      source?.deductions as { salaryConfig?: Partial<PayslipSalaryConfig> }
    )?.salaryConfig;
    const normalized = normalizeSalaryConfig(sourceConfig).config;
    const birthYear = employee.date_of_birth
      ? Number(employee.date_of_birth.slice(0, 4))
      : undefined;

    const d = (active?.deductions ?? {}) as {
      incomeTax?: number;
      sscEmployee?: number;
      bonus?: number;
      allowance?: number;
    };

    return {
      employee: {
        id: employee.id,
        name: employee.name,
        employee_code: employee.employee_code,
        position: employee.position,
      },
      defaults: normalized
        ? carryOverSalaryConfig(normalized, source!.period_year, year)
        : birthYear
          ? {
              annualGross: 0,
              taxType: "single",
              childCount: 0,
              sscCategory: "C",
              birthYear,
            }
          : null,
      current: active
        ? {
            id: active.id,
            status: active.status,
            gross: active.gross_salary,
            net: active.net_salary,
            incomeTax: d.incomeTax ?? 0,
            sscEmployee: d.sscEmployee ?? 0,
            bonus: d.bonus ?? 0,
            allowance: d.allowance ?? 0,
          }
        : null,
      hasVoided: inPeriod.some((r) => r.status === PAYSLIP_STATUS.VOID),
    };
  });
}
