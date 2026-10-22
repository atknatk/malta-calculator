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

export default async function NewPayslipPage({
  searchParams,
}: {
  searchParams: Promise<{ employeeId?: string; draft?: string }>;
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

  // Taslak düzenleme: yalnızca bu şirkete ait taslaklar
  let draft: PayslipDraft | undefined;
  if (params.draft) {
    const payslip = await getPayslipById(params.draft);
    if (!payslip) notFound();
    if (payslip.status !== PAYSLIP_STATUS.DRAFT) {
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
      payslipId: payslip.id,
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="mx-auto max-w-md rounded-xl border bg-white p-8 text-center shadow-lg dark:bg-slate-800 dark:border-slate-700">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
            <span className="text-3xl">👥</span>
          </div>
          <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
            Add Employees First
          </h2>
          <p className="mb-6 text-slate-500">
            You need to add at least one employee to create a payslip.
          </p>
          <Link
            href="/employees"
            className="inline-block rounded-lg bg-amber-600 px-6 py-3 font-medium text-white transition hover:bg-amber-700"
          >
            Add Employee
          </Link>
        </div>
      </div>
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
