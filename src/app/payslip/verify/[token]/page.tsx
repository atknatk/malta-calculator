import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchPublishedPayslipDocument } from "@/lib/payslip/document-props";
import {
  ACCESS_SCOPE,
  accessCookieName,
  isValidAccessCookie,
} from "@/lib/payslip/access-cookie";
import PublicPayslipPage from "@/components/payslip/public-payslip-page";
import { isPdfArchiveEnabled } from "@/lib/payslip/pdf-archive";
import {
  currentVersion,
  loadPayslipVersions,
} from "@/lib/payslip/revisions";
import { PAYSLIP_STATUS } from "@/utils/payslip-details";
import VerifyGate from "./_components/verify-gate";

export const metadata: Metadata = {
  title: "Verify Payslip",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

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

interface PayslipVerifyPageProps {
  params: Promise<{ token: string }>;
}

export default async function PayslipVerifyPage({
  params,
}: PayslipVerifyPageProps) {
  const { token } = await params;
  const supabase = createAdminClient();

  // QR'daki 8 karakterlik access_token; eski QR'lar için UUID ile de dene
  const isUuid = /^[0-9a-f-]{36}$/i.test(token);
  const result =
    (await fetchPublishedPayslipDocument(supabase, {
      column: "access_token",
      value: token,
    })) ??
    (isUuid
      ? await fetchPublishedPayslipDocument(supabase, {
          column: "id",
          value: token,
        })
      : null);

  if (!result) {
    notFound();
  }

  const { payslip, company, props, integrity } = result;

  const cookieStore = await cookies();
  const hasAccess = isValidAccessCookie(
    ACCESS_SCOPE.VERIFY,
    payslip.id,
    cookieStore.get(accessCookieName(ACCESS_SCOPE.VERIFY, payslip.id))?.value,
  );

  if (!hasAccess) {
    return (
      <VerifyGate
        token={payslip.access_token}
        companyName={company.name}
        period={`${months[payslip.period_month - 1]} ${payslip.period_year}`}
      />
    );
  }

  // Revize edilmiş bordro: QR, geçerli sürümü gösterir
  const versions = await loadPayslipVersions(supabase, payslip);
  const current = currentVersion(versions);
  const supersededBy =
    payslip.status === PAYSLIP_STATUS.VOID && current
      ? { version: current, href: `/payslip/verify/${current.accessToken}` }
      : undefined;

  return (
    <PublicPayslipPage
      document={props}
      verified
      integrity={integrity}
      contentHash={payslip.content_hash}
      shareToken={payslip.access_token}
      pdfEnabled={integrity === "verified" && isPdfArchiveEnabled()}
      versions={versions}
      supersededBy={supersededBy}
    />
  );
}
