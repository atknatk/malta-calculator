import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  archivePendingPayslips,
  isPdfArchiveEnabled,
} from "@/lib/payslip/pdf-archive";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Arşivlenmemiş yayınlanmış bordroları R2'ye yükler (Vercel Cron).
 * Vercel, CRON_SECRET'ı "Authorization: Bearer <secret>" olarak gönderir.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isPdfArchiveEnabled()) {
    return NextResponse.json({ skipped: "PDF archive is not configured" });
  }

  try {
    const result = await archivePendingPayslips(createAdminClient());
    return NextResponse.json(result);
  } catch (error) {
    console.error("Payslip archive cron failed:", error);
    return NextResponse.json({ error: "Archive run failed" }, { status: 500 });
  }
}
