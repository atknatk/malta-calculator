import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchPublishedPayslipDocument } from "@/lib/payslip/document-props";
import {
  ACCESS_SCOPE,
  accessCookieName,
  isValidAccessCookie,
} from "@/lib/payslip/access-cookie";
import PublicPayslipPage from "@/components/payslip/public-payslip-page";
import PinAuth from "./_components/pin-auth";

export default async function EmployeeViewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = createAdminClient();

  // Taslaklar çalışana gösterilmez (yalnızca yayınlanmış bordrolar)
  const result = await fetchPublishedPayslipDocument(supabase, {
    column: "access_token",
    value: token,
  });

  if (!result) {
    notFound();
  }

  const { payslip, employee, props } = result;

  // İmzalı çerez: PIN (doğum tarihi) doğrulandıysa
  const cookieStore = await cookies();
  const isAuthenticated = isValidAccessCookie(
    ACCESS_SCOPE.EMPLOYEE,
    payslip.id,
    cookieStore.get(accessCookieName(ACCESS_SCOPE.EMPLOYEE, payslip.id))
      ?.value,
  );

  // If employee has date_of_birth and user is not authenticated, show PIN auth
  if (employee.date_of_birth && !isAuthenticated) {
    return (
      <PinAuth
        payslipId={payslip.id}
        employeeName={employee.name}
        token={token}
      />
    );
  }

  return <PublicPayslipPage document={props} />;
}

export const metadata = {
  title: "View Payslip",
  description: "View your payslip securely",
  robots: { index: false, follow: false },
};
