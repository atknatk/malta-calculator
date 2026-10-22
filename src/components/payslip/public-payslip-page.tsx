import Link from "next/link";
import { ShieldCheck, ShieldX } from "lucide-react";
import PayslipDocument, {
  type PayslipDocumentProps,
} from "@/app/payslip/[id]/_components/payslip-document";
import PublicPayslipActions from "@/components/payslip/public-payslip-actions";
import PayslipIntegrityNotice from "@/components/payslip/payslip-integrity";
import type { PayslipIntegrity } from "@/lib/payslip/document-props";
import { PAYSLIP_STATUS } from "@/utils/payslip-details";

interface PublicPayslipPageProps {
  document: PayslipDocumentProps;
  /** Doğrulama sayfasında "Verified" bandı gösterilir */
  verified?: boolean;
  integrity: PayslipIntegrity;
  contentHash?: string | null;
}

/**
 * Çalışan görüntüleme ve QR doğrulama sayfalarının ortak görünümü:
 * şirket panelindeki bordronun birebir aynısı + yazdır / PDF indir.
 */
export default function PublicPayslipPage({
  document,
  verified = false,
  integrity,
  contentHash,
}: PublicPayslipPageProps) {
  const isVoid = document.status === PAYSLIP_STATUS.VOID;
  const issuedOn = new Date(
    document.updatedAt || document.createdAt,
  ).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 print:bg-white">
      <header className="border-b bg-white/80 backdrop-blur-sm print:hidden">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link href="/" className="text-xl font-bold text-amber-600">
            Malta Calculator
          </Link>
          <PublicPayslipActions
            payslipNumber={document.payslipNumber}
            employeeName={document.employee.name}
          />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 print:p-0">
        {isVoid && (
          <div className="mx-auto mb-4 flex max-w-[210mm] items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 print:hidden">
            <ShieldX className="mt-0.5 h-6 w-6 flex-shrink-0 text-red-600" />
            <div className="text-sm">
              <p className="font-semibold text-red-900">
                This payslip has been voided
              </p>
              <p className="text-red-800">
                {document.company.name} cancelled this payslip
                {document.voided
                  ? ` on ${new Date(document.voided.at).toLocaleDateString("en-GB")}`
                  : ""}
                {document.voided?.reason ? `: ${document.voided.reason}` : ""}.
                It is not valid; ask for the corrected payslip.
              </p>
            </div>
          </div>
        )}

        {verified && !isVoid && (
          <div className="mx-auto mb-6 flex max-w-[210mm] items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 print:hidden">
            <ShieldCheck className="mt-0.5 h-6 w-6 flex-shrink-0 text-emerald-600" />
            <div className="text-sm">
              <p className="font-semibold text-emerald-900">
                Payslip verified
              </p>
              <p className="text-emerald-800">
                Issued by {document.company.name} on {issuedOn} through Malta
                Calculator. The document below is the original issued payslip
                (No. {document.payslipNumber}). Compare it with the copy you
                were given.
              </p>
            </div>
          </div>
        )}

        <PayslipIntegrityNotice
          integrity={integrity}
          contentHash={contentHash}
          className="mx-auto mb-6 max-w-[210mm] print:hidden"
        />

        {/* A4 belge: dar ekranlarda yatay kaydırılır */}
        <div className="overflow-x-auto pb-4 print:overflow-visible print:pb-0">
          <div className="mx-auto w-[210mm] shadow-xl print:shadow-none">
            <PayslipDocument {...document} />
          </div>
        </div>
      </main>
    </div>
  );
}
