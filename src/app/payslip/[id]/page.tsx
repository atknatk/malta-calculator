import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Ban, Info } from "lucide-react";
import { getPayslipById } from "@/app/actions/payslip-actions";
import PayslipDocument from "./_components/payslip-document";
import PayslipActions from "./_components/payslip-actions";
import PayslipStatusChip from "@/components/admin/payslip-status-chip";
import { PAYSLIP_STATUS } from "@/utils/payslip-details";
import { resolvePayslipDocument } from "@/lib/payslip/document-props";
import { freezeLegacyPayslip } from "@/lib/payslip/issue";
import { createAdminClient } from "@/lib/supabase/admin";
import PayslipIntegrityNotice from "@/components/payslip/payslip-integrity";

const months = [
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

export default async function PayslipViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { id } = await params;
  const payslip = await getPayslipById(id);

  if (!payslip) {
    notFound();
  }

  const isDraft = payslip.status === PAYSLIP_STATUS.DRAFT;
  const isVoid = payslip.status === PAYSLIP_STATUS.VOID;
  const supabase = createAdminClient();

  // getPayslipById şirket sahipliğini doğruladı; yayınlanmış bordro
  // snapshot'tan, taslak canlı veriden gösterilir
  const { props: documentProps, integrity } = await resolvePayslipDocument(
    supabase,
    payslip,
    payslip.company,
    payslip.employee,
  );
  const { payslipNumber } = documentProps;

  // Kilitleme öncesi yayınlanmış bordroyu ilk görüntülemede dondur
  if (integrity === "legacy") {
    await freezeLegacyPayslip(
      supabase,
      payslip,
      payslip.company,
      payslip.employee,
    );
  }

  return (
    <div className="mx-auto max-w-[210mm]">
      {/* Actions */}
      <div className="mb-6 print:hidden">
        <Link
          href="/payslips"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-md-on-surface-variant transition hover:text-md-primary"
        >
          <ArrowLeft className="size-4" />
          Payslips
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[28px] font-normal leading-9 tracking-tight text-md-on-surface">
                {months[payslip.period_month - 1]} {payslip.period_year}
              </h1>
              <PayslipStatusChip status={payslip.status} />
            </div>
            <p className="mt-1 text-sm text-md-on-surface-variant">
              {payslip.employee.name} · {payslipNumber}
            </p>
          </div>
          <PayslipActions
            payslipId={payslip.id}
            status={payslip.status}
            payslipNumber={payslipNumber}
            employeeName={payslip.employee.name}
          />
        </div>
        {isDraft && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl bg-md-warning-container p-4 text-sm text-md-on-warning-container">
            <Info className="mt-0.5 size-4 shrink-0" />
            <p>
              This is a draft. The employee cannot see it and its QR code is not
              active. Edit it as often as you need, then issue it when the
              figures are final. Drafts don&apos;t count towards your monthly
              limit.
            </p>
          </div>
        )}
        {isVoid && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl bg-md-error-container p-4 text-sm text-md-on-error-container">
            <Ban className="mt-0.5 size-4 shrink-0" />
            <p>
              Voided
              {payslip.voided_at
                ? ` on ${new Date(payslip.voided_at).toLocaleDateString("en-GB")}`
                : ""}
              : {payslip.void_reason}. It stays on record and shows as void
              when its QR code is scanned.
            </p>
          </div>
        )}
        {!isDraft && (
          <PayslipIntegrityNotice
            integrity={integrity}
            contentHash={payslip.content_hash}
            className="mt-4"
          />
        )}
      </div>

      <div className="overflow-x-auto pb-2 print:overflow-visible print:pb-0">
        {/* Payslip Document */}
        <div
          className="overflow-hidden rounded-2xl bg-white shadow-md-3 print:rounded-none print:shadow-none"
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            width: "210mm",
            minHeight: "297mm",
            boxSizing: "border-box",
            fontSize: "10px",
            lineHeight: "1.4",
          }}
        >
          <PayslipDocument {...documentProps} />
        </div>
      </div>
    </div>
  );
}
