/**
 * Çalışan bildirimleri (sunucu)
 * Bordro yayınlanınca / geçersiz kılınınca uygulamaya bağlı çalışana
 * uygulama içi bildirim yazılır ve kayıtlı cihazlarına push gönderilir.
 * Cihazı yoksa kısa bir e-posta gider. Bildirimlerde tutar yer almaz.
 * Her adım best-effort: bordro akışı bildirim yüzünden asla başarısız olmaz.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { sendPush } from "@/lib/notify/fcm";
import { escapeHtml, sendEmail } from "@/lib/notify/email";
import { firstRelation } from "@/lib/payslip/document-props";

export const EMPLOYEE_NOTIFICATION_TYPE = {
  PAYSLIP_ISSUED: "payslip_issued",
  PAYSLIP_VOIDED: "payslip_voided",
  FS3_ISSUED: "fs3_issued",
} as const;

export type EmployeeNotificationType =
  (typeof EMPLOYEE_NOTIFICATION_TYPE)[keyof typeof EMPLOYEE_NOTIFICATION_TYPE];

export const EMPLOYEE_APP_NAME = "Malta Payslips";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatPeriod(month: number, year: number): string {
  return `${MONTHS[month - 1] ?? month} ${year}`;
}

export function buildPayslipNotification(
  type: "payslip_issued" | "payslip_voided",
  companyName: string,
  month: number,
  year: number,
): { title: string; body: string } {
  const period = formatPeriod(month, year);
  if (type === EMPLOYEE_NOTIFICATION_TYPE.PAYSLIP_VOIDED) {
    return {
      title: "Payslip withdrawn",
      body: `${companyName} withdrew your ${period} payslip. A corrected one may follow.`,
    };
  }
  return {
    title: "New payslip",
    body: `Your ${period} payslip from ${companyName} is ready.`,
  };
}

interface PayslipNotifyRow {
  id: string;
  employee_id: string;
  period_month: number;
  period_year: number;
  employee: { email: string | null } | { email: string | null }[] | null;
  company: { name: string } | { name: string }[] | null;
}

export async function notifyPayslipEvent(
  supabase: SupabaseClient,
  payslipId: string,
  type: "payslip_issued" | "payslip_voided",
): Promise<void> {
  try {
    const { data } = await supabase
      .from("payslips")
      .select(
        "id, employee_id, period_month, period_year, employee:employees(email), company:companies(name)",
      )
      .eq("id", payslipId)
      .maybeSingle();
    if (!data) return;

    const row = data as unknown as PayslipNotifyRow;
    const { data: account } = await supabase
      .from("employee_accounts")
      .select("clerk_user_id")
      .eq("employee_id", row.employee_id)
      .maybeSingle();
    // Uygulamaya bağlı değilse bildirim yok (token + PIN linki devam eder)
    if (!account) return;

    const clerkUserId = (account as { clerk_user_id: string }).clerk_user_id;
    const companyName = firstRelation(row.company)?.name ?? "Your employer";
    const message = buildPayslipNotification(
      type,
      companyName,
      row.period_month,
      row.period_year,
    );
    const pushData = { type, payslipId: row.id };

    await supabase.from("employee_notifications").insert({
      clerk_user_id: clerkUserId,
      employee_id: row.employee_id,
      type,
      title: message.title,
      body: message.body,
      data: pushData,
    });

    const { data: devices } = await supabase
      .from("employee_devices")
      .select("id, fcm_token")
      .eq("clerk_user_id", clerkUserId);

    let delivered = false;
    for (const device of (devices ?? []) as {
      id: string;
      fcm_token: string;
    }[]) {
      const result = await sendPush(device.fcm_token, {
        ...message,
        data: pushData,
      });
      if (result === "sent") delivered = true;
      if (result === "unregistered") {
        await supabase.from("employee_devices").delete().eq("id", device.id);
      }
    }

    const email = firstRelation(row.employee)?.email;
    if (!delivered && email) {
      await sendEmail({
        to: email,
        subject: message.title,
        text: `${message.body}\n\nOpen the ${EMPLOYEE_APP_NAME} app to view it.`,
        html: `<p>${escapeHtml(message.body)}</p><p>Open the <strong>${EMPLOYEE_APP_NAME}</strong> app to view it.</p>`,
      });
    }
  } catch (error) {
    console.error("notifyPayslipEvent error:", error);
  }
}

export async function sendEmployeeInviteEmail(params: {
  email: string;
  employeeName: string;
  companyName: string;
}): Promise<boolean> {
  const appUrl = process.env.EMPLOYEE_APP_URL;
  const intro = `${params.companyName} invited you to view your payslips in the ${EMPLOYEE_APP_NAME} app.`;
  const steps = `Install the app and sign in with this email address (${params.email}). Your payslips will appear automatically.`;

  return sendEmail({
    to: params.email,
    subject: `${params.companyName} invited you to ${EMPLOYEE_APP_NAME}`,
    text: `Hi ${params.employeeName},\n\n${intro}\n\n${steps}${appUrl ? `\n\nDownload: ${appUrl}` : ""}`,
    html: `<p>Hi ${escapeHtml(params.employeeName)},</p><p>${escapeHtml(intro)}</p><p>${escapeHtml(steps)}</p>${
      appUrl
        ? `<p><a href="${escapeHtml(appUrl)}">Download ${EMPLOYEE_APP_NAME}</a></p>`
        : ""
    }`,
  });
}
