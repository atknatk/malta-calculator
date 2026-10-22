"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  deleteDraftPayslip,
  finalizePayslip,
} from "@/app/actions/payslip-actions";
import { PAYSLIP_STATUS, type PayslipStatus } from "@/utils/payslip-details";
import {
  buildPayslipFilename,
  downloadPayslipPdf,
} from "@/lib/payslip/download-pdf";

interface PayslipActionsProps {
  payslipId: string;
  status: PayslipStatus;
  payslipNumber?: string;
  employeeName?: string;
}

export default function PayslipActions({
  payslipId,
  status,
  payslipNumber,
  employeeName,
}: PayslipActionsProps) {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);
  const [pending, startTransition] = useTransition();
  // İki adımlı onay: geri alınamayan işlemler için ikinci tıklama gerekir
  const [confirming, setConfirming] = useState<"issue" | "delete" | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const isDraft = status === PAYSLIP_STATUS.DRAFT;

  const handleIssue = () => {
    if (confirming !== "issue") {
      setConfirming("issue");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await finalizePayslip(payslipId);
      setConfirming(null);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || "Failed to issue payslip");
      }
    });
  };

  const handleDelete = () => {
    if (confirming !== "delete") {
      setConfirming("delete");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deleteDraftPayslip(payslipId);
      if (result.success) {
        router.push("/payslips?status=draft");
      } else {
        setConfirming(null);
        setError(result.error || "Failed to delete draft");
      }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    await downloadPayslipPdf(
      buildPayslipFilename(payslipNumber, employeeName, isDraft),
    );
    setDownloading(false);
  };

  return (
    <div className="flex flex-col items-end gap-2">
    <div className="flex flex-wrap justify-end gap-3">
      {isDraft && (
        <>
          <button
            onClick={handleDelete}
            disabled={pending}
            onBlur={() => !pending && setConfirming(null)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:hover:bg-red-950/40"
          >
            {confirming === "delete" ? "Click again to delete" : "Delete draft"}
          </button>
          <Link
            href={`/payslip/new?draft=${payslipId}`}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Edit draft
          </Link>
        </>
      )}
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
          />
        </svg>
        Print
      </button>
      <button
        onClick={handleDownloadPDF}
        disabled={downloading}
        className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:cursor-wait disabled:opacity-70"
      >
        {downloading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {isDraft ? "Draft PDF" : "Download PDF"}
          </>
        )}
      </button>
      {isDraft && (
        <button
          onClick={handleIssue}
          disabled={pending}
          onBlur={() => !pending && setConfirming(null)}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-70"
        >
          {pending && confirming === "issue"
            ? "Issuing..."
            : confirming === "issue"
              ? "Confirm: issue to employee"
              : "✓ Issue payslip"}
        </button>
      )}
    </div>
    {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
