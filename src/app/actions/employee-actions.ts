"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

// Çalışan düzenleme / silme. Admin client kullanılır; sahiplik Clerk
// userId -> company_id üzerinden doğrulanır.

const EDITABLE_FIELDS = {
  name: "name",
  email: "email",
  employeeCode: "employee_code",
  position: "position",
  phone: "phone",
  dateOfBirth: "date_of_birth",
  address: "address",
  idNumber: "id_number",
  ssNumber: "ss_number",
  department: "department",
  section: "section",
  unit: "unit",
  grade: "grade",
} as const;

async function getOwnedEmployee(
  employeeId: string,
): Promise<{ companyId: string } | { error: string }> {
  const { userId } = await auth();
  if (!userId) return { error: "Not authenticated" };

  const supabase = createAdminClient();
  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();
  if (!company) return { error: "Company not found" };

  const companyId = (company as { id: string }).id;
  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("id", employeeId)
    .eq("company_id", companyId)
    .single();
  if (!employee) return { error: "Employee not found" };

  return { companyId };
}

export async function updateEmployee(
  employeeId: string,
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const owned = await getOwnedEmployee(employeeId);
  if ("error" in owned) return { success: false, error: owned.error };

  const name = (formData.get("name") as string | null)?.trim() ?? "";
  if (name.length < 2) {
    return { success: false, error: "Employee name is required" };
  }

  const update: Record<string, string | null> = {};
  for (const [field, column] of Object.entries(EDITABLE_FIELDS)) {
    const value = (formData.get(field) as string | null)?.trim();
    update[column] = value ? value : null;
  }
  update.name = name;

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("employees")
    .update({ ...update, updated_at: new Date().toISOString() } as never)
    .eq("id", employeeId)
    .eq("company_id", owned.companyId);

  if (error) {
    console.error("Error updating employee:", error);
    return { success: false, error: "Could not save changes" };
  }

  revalidatePath("/employees");
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Çalışanı siler. Bordrosu olan çalışan silinemez: yayınlanmış bordrolar
 * yasal kayıttır ve QR doğrulaması çalışan kaydına bağlıdır.
 */
export async function deleteEmployee(
  employeeId: string,
): Promise<{ success: boolean; error?: string }> {
  const owned = await getOwnedEmployee(employeeId);
  if ("error" in owned) return { success: false, error: owned.error };

  const supabase = createAdminClient();
  const { count } = await supabase
    .from("payslips")
    .select("id", { count: "exact", head: true })
    .eq("employee_id", employeeId);

  if ((count ?? 0) > 0) {
    return {
      success: false,
      error: `This employee has ${count} payslip${count === 1 ? "" : "s"} on record and can't be deleted. Payslips are legal payroll records.`,
    };
  }

  const { error } = await supabase
    .from("employees")
    .delete()
    .eq("id", employeeId)
    .eq("company_id", owned.companyId);

  if (error) {
    console.error("Error deleting employee:", error);
    return { success: false, error: "Could not delete employee" };
  }

  revalidatePath("/employees");
  revalidatePath("/dashboard");
  return { success: true };
}
