/**
 * Çalışan mobil uygulaması: kimlik ve hesap eşleme (sunucu)
 * Uygulama her istekte Clerk session token'ını `Authorization: Bearer`
 * başlığıyla gönderir; clerkMiddleware bunu doğrular ve auth() userId döner.
 * Erişim tamamen employee_accounts eşlemesine dayanır: kullanıcı yalnızca
 * kendisine bağlı çalışan kayıtlarının yayınlanmış bordrolarını görür.
 */
import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { firstRelation } from "@/lib/payslip/document-props";

export interface Employment {
  employeeId: string;
  companyId: string;
  companyName: string;
  companyLogoUrl: string | null;
  employeeName: string;
  position: string | null;
  employeeCode: string | null;
  linkedAt: string;
}

export function mobileError(
  status: number,
  code: string,
  message: string,
): NextResponse {
  return NextResponse.json({ error: { code, message } }, { status });
}

/** Oturum açmış Clerk kullanıcısı; yoksa 401 yanıtı */
export async function requireMobileUser(): Promise<
  { userId: string } | { response: NextResponse }
> {
  const { userId } = await auth();
  if (!userId) {
    return {
      response: mobileError(401, "unauthorized", "Sign in to continue"),
    };
  }
  return { userId };
}

/** Kullanıcının doğrulanmış e-posta adresleri (küçük harf) */
export async function getVerifiedEmails(userId: string): Promise<string[]> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return user.emailAddresses
    .filter((address) => address.verification?.status === "verified")
    .map((address) => normalizeEmail(address.emailAddress));
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Doğrulanmış e-postaya gönderilmiş bekleyen davetleri hesaba bağlar.
 * E-posta sahipliğini Clerk doğruladığı için ayrıca kod gerekmez.
 * Başka bir hesaba bağlı çalışan kaydı devralınmaz.
 */
export async function claimPendingInvites(
  supabase: SupabaseClient,
  userId: string,
  emails: string[],
): Promise<number> {
  if (emails.length === 0) return 0;

  const { data: invites } = await supabase
    .from("employee_invites")
    .select("id, employee_id, company_id")
    .eq("status", "pending")
    .in("email", emails)
    .gt("expires_at", new Date().toISOString());

  let claimed = 0;
  for (const invite of (invites ?? []) as {
    id: string;
    employee_id: string;
    company_id: string;
  }[]) {
    const { data: existing } = await supabase
      .from("employee_accounts")
      .select("clerk_user_id")
      .eq("employee_id", invite.employee_id)
      .maybeSingle();

    if (
      existing &&
      (existing as { clerk_user_id: string }).clerk_user_id !== userId
    ) {
      continue;
    }

    if (!existing) {
      const { error } = await supabase.from("employee_accounts").insert({
        clerk_user_id: userId,
        employee_id: invite.employee_id,
        company_id: invite.company_id,
      });
      if (error) {
        console.error("Error linking employee account:", error);
        continue;
      }
    }

    await supabase
      .from("employee_invites")
      .update({ status: "accepted", accepted_at: new Date().toISOString() })
      .eq("id", invite.id);
    claimed += 1;
  }
  return claimed;
}

interface EmploymentRow {
  employee_id: string;
  company_id: string;
  linked_at: string;
  employee:
    | { name: string; position: string | null; employee_code: string | null }
    | { name: string; position: string | null; employee_code: string | null }[]
    | null;
  company:
    | { name: string; logo_url: string | null }
    | { name: string; logo_url: string | null }[]
    | null;
}

export async function getEmployments(
  supabase: SupabaseClient,
  userId: string,
): Promise<Employment[]> {
  const { data } = await supabase
    .from("employee_accounts")
    .select(
      "employee_id, company_id, linked_at, employee:employees(name, position, employee_code), company:companies(name, logo_url)",
    )
    .eq("clerk_user_id", userId)
    .order("linked_at", { ascending: true });

  return ((data ?? []) as unknown as EmploymentRow[]).flatMap((row) => {
    const employee = firstRelation(row.employee);
    const company = firstRelation(row.company);
    if (!employee || !company) return [];
    return [
      {
        employeeId: row.employee_id,
        companyId: row.company_id,
        companyName: company.name,
        companyLogoUrl: company.logo_url,
        employeeName: employee.name,
        position: employee.position,
        employeeCode: employee.employee_code,
        linkedAt: row.linked_at,
      },
    ];
  });
}

/** Sorgu parametresindeki yıl; geçersizse null */
export function parseYear(value: string | null): number | null {
  if (!value) return null;
  const year = Number(value);
  return Number.isInteger(year) && year >= 2020 && year <= 2100 ? year : null;
}
