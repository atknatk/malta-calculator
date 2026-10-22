"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeEmail } from "@/lib/mobile/employee-session";
import { sendEmployeeInviteEmail } from "@/lib/notify/employee-notify";

// Çalışan mobil uygulaması: davet ve erişim yönetimi (Pro plan).
// Davet çalışanın e-posta adresine gider; çalışan uygulamaya aynı e-postayla
// giriş yapınca hesabı otomatik bağlanır (bkz. /api/mobile/v1/me).

export type EmployeeAppStatus = "linked" | "invited" | "none";

interface OwnedEmployee {
  companyId: string;
  companyName: string;
  plan: "free" | "basic" | "pro";
  employee: { id: string; name: string; email: string | null };
}

async function getOwnedEmployee(
  employeeId: string,
): Promise<OwnedEmployee | { error: string }> {
  const { userId } = await auth();
  if (!userId) return { error: "Not authenticated" };

  const supabase = createAdminClient();
  const { data: company } = await supabase
    .from("companies")
    .select("id, name, plan")
    .eq("clerk_user_id", userId)
    .single();
  if (!company) return { error: "Company not found" };

  const {
    id: companyId,
    name: companyName,
    plan,
  } = company as {
    id: string;
    name: string;
    plan: OwnedEmployee["plan"];
  };
  const { data: employee } = await supabase
    .from("employees")
    .select("id, name, email")
    .eq("id", employeeId)
    .eq("company_id", companyId)
    .single();
  if (!employee) return { error: "Employee not found" };

  return {
    companyId,
    companyName,
    plan,
    employee: employee as OwnedEmployee["employee"],
  };
}

/** Şirketin çalışanları için uygulama durumu (bağlı / davetli) */
export async function getEmployeeAppStatuses(): Promise<
  Record<string, EmployeeAppStatus>
> {
  const { userId } = await auth();
  if (!userId) return {};

  const supabase = createAdminClient();
  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();
  if (!company) return {};

  const companyId = (company as { id: string }).id;
  const [{ data: accounts }, { data: invites }] = await Promise.all([
    supabase
      .from("employee_accounts")
      .select("employee_id")
      .eq("company_id", companyId),
    supabase
      .from("employee_invites")
      .select("employee_id")
      .eq("company_id", companyId)
      .eq("status", "pending")
      .gt("expires_at", new Date().toISOString()),
  ]);

  const statuses: Record<string, EmployeeAppStatus> = {};
  for (const row of (invites ?? []) as { employee_id: string }[]) {
    statuses[row.employee_id] = "invited";
  }
  for (const row of (accounts ?? []) as { employee_id: string }[]) {
    statuses[row.employee_id] = "linked";
  }
  return statuses;
}

/**
 * Çalışanı uygulamaya davet eder (ya da daveti yeniden gönderir).
 * Önceki bekleyen davet iptal edilir; yeni davet 30 gün geçerlidir.
 */
export async function inviteEmployeeToApp(
  employeeId: string,
): Promise<{ success: boolean; emailSent?: boolean; error?: string }> {
  const owned = await getOwnedEmployee(employeeId);
  if ("error" in owned) return { success: false, error: owned.error };

  if (owned.plan !== "pro") {
    return {
      success: false,
      error: "The employee app is included in the Pro plan.",
    };
  }
  if (!owned.employee.email) {
    return {
      success: false,
      error: "Add the employee's email address first.",
    };
  }

  const supabase = createAdminClient();
  const { data: account } = await supabase
    .from("employee_accounts")
    .select("id")
    .eq("employee_id", employeeId)
    .maybeSingle();
  if (account) {
    return { success: false, error: "This employee already uses the app." };
  }

  await supabase
    .from("employee_invites")
    .update({ status: "revoked" })
    .eq("employee_id", employeeId)
    .eq("status", "pending");

  const email = normalizeEmail(owned.employee.email);
  const { error } = await supabase.from("employee_invites").insert({
    company_id: owned.companyId,
    employee_id: employeeId,
    email,
  });
  if (error) {
    console.error("Error creating employee invite:", error);
    return { success: false, error: "Could not create the invite" };
  }

  const emailSent = await sendEmployeeInviteEmail({
    email,
    employeeName: owned.employee.name,
    companyName: owned.companyName,
  });

  revalidatePath("/employees");
  return { success: true, emailSent };
}

/**
 * Uygulama erişimini kaldırır (ör. çalışan ayrıldığında). Bekleyen davet
 * iptal edilir; bordrolar kayıt olarak kalır.
 */
export async function revokeEmployeeAppAccess(
  employeeId: string,
): Promise<{ success: boolean; error?: string }> {
  const owned = await getOwnedEmployee(employeeId);
  if ("error" in owned) return { success: false, error: owned.error };

  const supabase = createAdminClient();
  const [{ error: accountError }, { error: inviteError }] = await Promise.all([
    supabase
      .from("employee_accounts")
      .delete()
      .eq("employee_id", employeeId)
      .eq("company_id", owned.companyId),
    supabase
      .from("employee_invites")
      .update({ status: "revoked" })
      .eq("employee_id", employeeId)
      .eq("status", "pending"),
  ]);
  if (accountError || inviteError) {
    console.error("Error revoking app access:", accountError ?? inviteError);
    return { success: false, error: "Could not remove app access" };
  }

  revalidatePath("/employees");
  return { success: true };
}
