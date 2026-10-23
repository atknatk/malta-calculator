"use client";

import { useState } from "react";
import { Download, Printer } from "lucide-react";
import {
  buildPayslipFilename,
  downloadPayslipPdf,
  downloadStoredPayslipPdf,
} from "@/lib/payslip/download-pdf";

interface PublicPayslipActionsProps {
  payslipNumber: string;
  employeeName: string;
  /** Yayınlanmış bordronun R2'deki PDF'i; yoksa PDF tarayıcıda çizilir */
  pdfUrl?: string;
}

/** Herkese açık sayfalarda (çalışan / QR doğrulama) yazdır ve PDF indir */
export default function PublicPayslipActions({
  payslipNumber,
  employeeName,
  pdfUrl,
}: PublicPayslipActionsProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    const filename = buildPayslipFilename(payslipNumber, employeeName);
    await (pdfUrl
      ? downloadStoredPayslipPdf(pdfUrl, filename)
      : downloadPayslipPdf(filename));
    setDownloading(false);
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={() => window.print()}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        <Printer className="h-4 w-4" />
        Print
      </button>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-hover disabled:cursor-wait disabled:opacity-70"
      >
        <Download className="h-4 w-4" />
        {downloading ? "Generating..." : "Download PDF"}
      </button>
    </div>
  );
}
