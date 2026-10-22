import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  ACCESS_SCOPE,
  isValidAccessCookie,
} from "@/lib/payslip/access-cookie";
import { verifySnapshot, type PayslipSnapshot } from "@/lib/payslip/snapshot";
import { ISSUED_STATUSES, type PayslipStatus } from "@/utils/payslip-details";
import PayslipDocument from "@/app/payslip/[id]/_components/payslip-document";

export const metadata: Metadata = {
  title: "Payslip",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface ArchiveRenderPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string }>;
}

/**
 * Sunucu PDF arşivi için çizim sayfası (bkz. lib/payslip/pdf-renderer).
 * Yalnızca kısa ömürlü imzalı bağlantıyla açılır ve bordroyu yayınlandığı
 * haliyle (snapshot) gösterir; sonradan void edilmiş olsa bile.
 */
export default async function ArchiveRenderPage({
  params,
  searchParams,
}: ArchiveRenderPageProps) {
  const { id } = await params;
  const { t } = await searchParams;

  if (!isValidAccessCookie(ACCESS_SCOPE.RENDER, id, t)) {
    notFound();
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("payslips")
    .select("status, snapshot, content_hash")
    .eq("id", id)
    .maybeSingle();

  const payslip = data as {
    status: PayslipStatus;
    snapshot: PayslipSnapshot | null;
    content_hash: string | null;
  } | null;

  if (
    !payslip ||
    !ISSUED_STATUSES.includes(payslip.status) ||
    !payslip.snapshot ||
    !verifySnapshot(payslip.snapshot, payslip.content_hash)
  ) {
    notFound();
  }

  return (
    <main className="bg-white">
      <div className="mx-auto w-[210mm]">
        <PayslipDocument {...payslip.snapshot.document} />
      </div>
    </main>
  );
}
