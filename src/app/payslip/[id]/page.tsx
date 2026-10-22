import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import {
  getPayslipById,
  getYearToDateTotals,
} from "@/app/actions/payslip-actions";
import PayslipDocument from "./_components/payslip-document";
import PayslipActions from "./_components/payslip-actions";
import PayslipStatusChip from "@/components/admin/payslip-status-chip";
import { PAYSLIP_STATUS } from "@/utils/payslip-details";
import { buildPayslipDocumentProps } from "@/lib/payslip/document-props";

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

  // Get Year-to-Date totals (taslaksa kendi tutarları da eklenir)
  const ytdTotals = await getYearToDateTotals(
    payslip.employee_id,
    payslip.period_year,
    payslip.period_month,
    isDraft ? payslip : undefined,
  );

  const documentProps = buildPayslipDocumentProps(
    payslip,
    payslip.company,
    payslip.employee,
    ytdTotals,
  );
  const { payslipNumber } = documentProps;

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
