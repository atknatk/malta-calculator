/**
 * Bulk Payslip API (Pro)
 * action "draft": seçilen çalışanlar için dönem taslaklarını hesaplar/kaydeder
 * action "issue": seçilen taslakları aylık limit dahilinde yayınlar
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { PLANS, type PlanType } from "@/lib/stripe";
import {
  BULK_MAX_ITEMS,
  countIssuedThisMonth,
  issueBulkPayslips,
  saveBulkDrafts,
  type BulkDraftItem,
  type BulkItemResult,
} from "@/lib/payslip/bulk";

// 100 bordro yayınlamak birkaç saniye sürebilir
export const maxDuration = 60;

type BulkPayslipRequest =
  | {
      action: "draft";
      periodMonth: number;
      periodYear: number;
      items: BulkDraftItem[];
    }
  | { action: "issue"; payslipIds: string[] };

interface BulkPayslipResponse {
  success: boolean;
  results?: BulkItemResult[];
  error?: string;
}

const fail = (
  error: string,
  status: number,
): NextResponse<BulkPayslipResponse> =>
  NextResponse.json({ success: false, error }, { status });

export async function POST(
  request: NextRequest,
): Promise<NextResponse<BulkPayslipResponse>> {
  try {
    const { userId } = await auth();
    if (!userId) return fail("Not authenticated", 401);

    const body: BulkPayslipRequest = await request.json();
    const supabase = createAdminClient();

    const { data: company } = await supabase
      .from("companies")
      .select("id, plan")
      .eq("clerk_user_id", userId)
      .single();
    if (!company) return fail("Company not found", 404);

    const companyData = company as { id: string; plan: PlanType };
    if (companyData.plan !== "pro") {
      return fail("Bulk payslips are available on the Pro plan", 403);
    }

    if (body.action === "draft") {
      const now = new Date();
      const { periodMonth, periodYear, items } = body;
      if (
        !Number.isInteger(periodMonth) ||
        !Number.isInteger(periodYear) ||
        periodMonth < 1 ||
        periodMonth > 12
      ) {
        return fail("Invalid period", 400);
      }
      if (new Date(periodYear, periodMonth - 1) > now) {
        return fail("Cannot create payslips for future periods", 400);
      }
      if (!Array.isArray(items) || items.length === 0) {
        return fail("Select at least one employee", 400);
      }
      if (items.length > BULK_MAX_ITEMS) {
        return fail(`At most ${BULK_MAX_ITEMS} employees at a time`, 400);
      }
      if (items.some((i) => typeof i?.employeeId !== "string")) {
        return fail("Missing required fields", 400);
      }

      const results = await saveBulkDrafts(
        supabase,
        companyData.id,
        { month: periodMonth, year: periodYear },
        items,
      );
      revalidatePath("/payslips");
      return NextResponse.json({ success: true, results });
    }

    if (body.action === "issue") {
      const { payslipIds } = body;
      if (
        !Array.isArray(payslipIds) ||
        payslipIds.length === 0 ||
        payslipIds.some((id) => typeof id !== "string")
      ) {
        return fail("Select at least one draft", 400);
      }
      if (payslipIds.length > BULK_MAX_ITEMS) {
        return fail(`At most ${BULK_MAX_ITEMS} payslips at a time`, 400);
      }

      const used = await countIssuedThisMonth(supabase, companyData.id);
      const remaining = PLANS[companyData.plan].payslipsPerMonth - used;
      if (remaining <= 0) {
        return fail(
          `You have reached your limit of ${PLANS[companyData.plan].payslipsPerMonth} issued payslips this month.`,
          429,
        );
      }

      const results = await issueBulkPayslips(
        supabase,
        companyData.id,
        payslipIds,
        remaining,
      );
      revalidatePath("/payslips");
      revalidatePath("/dashboard");
      return NextResponse.json({ success: true, results });
    }

    return fail("Unknown action", 400);
  } catch (error) {
    console.error("Bulk payslip API error:", error);
    return fail("Internal server error", 500);
  }
}
