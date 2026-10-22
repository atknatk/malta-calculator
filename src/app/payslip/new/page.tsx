import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import {
  getCompany,
  getEmployees,
  canGeneratePayslip,
  getPayslipById,
} from "@/app/actions/payslip-actions";
import PayslipWizard, { type PayslipDraft } from "./_components/payslip-wizard";
import { PAYSLIP_STATUS } from "@/utils/payslip-details";
import Link from "next/link";
import { UserPlus, Users } from "lucide-react";
import { EmptyState, MdCard, mdButton } from "@/components/admin/admin-ui";

export default async function NewPayslipPage({
  searchParams,
}: {
  searchParams: Promise<{
    employeeId?: string;
    draft?: string;
    replaces?: string;
  }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const company = await getCompany();

  if (!company) {
    redirect("/onboarding");
  }

  const employees = await getEmployees();
  const canGenerate = await canGeneratePayslip();
  const params = await searchParams;
  const selectedEmployeeId = params.employeeId;

  // Taslak düzenleme ya da void edilen bordronun düzeltmesi: yalnızca bu
  // şirkete ait bordrolar (getPayslipById sahipliği doğrular)
  let draft: PayslipDraft | undefined;
  const sourceId = params.draft ?? params.replaces;
  if (sourceId) {
    const payslip = await getPayslipById(sourceId);
    if (!payslip) notFound();
    const expected = params.draft ? PAYSLIP_STATUS.DRAFT : PAYSLIP_STATUS.VOID;
    if (payslip.status !== expected) {
      redirect(`/payslip/${payslip.id}`);
    }
    const d = payslip.deductions as {
      bonus?: number;
      allowance?: number;
      payDate?: string;
      leaveHoursTaken?: number;
      notes?: string;
      salaryConfig?: PayslipDraft["salaryConfig"];
    };
    draft = {
      ...(params.draft
        ? { payslipId: payslip.id }
        : { replacesPayslipId: payslip.id }),
      employeeId: payslip.employee_id,
      periodMonth: payslip.period_month,
      periodYear: payslip.period_year,
      salaryConfig: d.salaryConfig,
      bonus: d.bonus,
      allowance: d.allowance,
      payDate: d.payDate,
      leaveHoursTaken: d.leaveHoursTaken,
      notes: d.notes,
    };
  }

  if (employees.length === 0) {
    return (
      <MdCard className="mx-auto mt-8 max-w-lg">
        <EmptyState
          icon={<Users />}
          title="Add employees first"
          description="You need at least one employee before you can create a payslip."
          action={
            <Link href="/employees" className={mdButton()}>
              <UserPlus />
              Add employee
            </Link>
          }
        />
      </MdCard>
    );
  }

  // Limit dolu olsa bile sihirbaz açılır: taslak kaydedilebilir, yayınlama
  // butonu kapalıdır
  return (
    <PayslipWizard
      company={company}
      employees={employees}
      selectedEmployeeId={selectedEmployeeId}
      draft={draft}
      canIssue={canGenerate.allowed}
      issueBlockedMessage={canGenerate.message}
    />
  );
}
