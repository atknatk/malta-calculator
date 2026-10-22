import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  getPayslipById,
  getYearToDateTotals,
} from "@/app/actions/payslip-actions";
import PayslipDocument from "./_components/payslip-document";
import PayslipActions from "./_components/payslip-actions";
import {
  PAYSLIP_STATUS,
  buildPayslipNumber,
  calculateEmployerContributions,
  calculateLeaveEntitlement,
} from "@/utils/payslip-details";

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

  // Extract deductions and salary config from payslip
  const deductions = payslip.deductions as {
    incomeTax: number;
    sscEmployee: number;
    sscEmployer?: number;
    maternityFund?: number;
    sscBase?: number;
    cola?: number;
    bonus?: number;
    allowance?: number;
    sscWeeks?: number;
    periodStartDate?: string; // Kıst ay: işe başlama tarihi (YYYY-MM-DD)
    employmentRatio?: number;
    payDate?: string;
    leaveHoursTaken?: number;
    notes?: string;
    salaryConfig?: {
      annualGross?: number;
      taxType?: "single" | "married" | "parent";
      childCount?: number;
      sscCategory?: string;
      birthYear?: number;
      startDate?: string;
    };
  };

  const salaryConfig = deductions.salaryConfig;

  // Get Year-to-Date totals (taslaksa kendi tutarları da eklenir)
  const ytdTotals = await getYearToDateTotals(
    payslip.employee_id,
    payslip.period_year,
    payslip.period_month,
    isDraft ? payslip : undefined,
  );

  const payslipNumber = buildPayslipNumber(
    payslip.company.name,
    payslip.period_year,
    payslip.period_month,
    payslip.id,
  );

  // Calculate basic salary (gross minus extras)
  const basicSalary =
    payslip.gross_salary -
    (deductions.cola || 0) -
    (deductions.bonus || 0) -
    (deductions.allowance || 0);

  // Build earnings object
  const earnings = {
    basicSalary,
    cola: deductions.cola || 0,
    bonus: deductions.bonus || 0,
    allowance: deductions.allowance || 0,
  };

  // İşveren katkıları: eski bordrolarda kayıtlı değilse çalışan SSC'sinden türet
  const sscWeeks = deductions.sscWeeks ?? 4;
  const employerContributions =
    deductions.sscEmployer !== undefined
      ? {
          sscEmployer: deductions.sscEmployer,
          maternityFund: deductions.maternityFund ?? 0,
        }
      : deductions.sscBase !== undefined
        ? calculateEmployerContributions({
            sscEmployee: deductions.sscEmployee,
            sscBase: deductions.sscBase,
            sscWeeks,
          })
        : undefined;

  // Yıllık izin: kayıtlı izin saatleri olan bordrolarda gösterilir
  const leave =
    deductions.leaveHoursTaken !== undefined
      ? {
          entitledHours: calculateLeaveEntitlement(
            payslip.period_year,
            salaryConfig?.startDate,
          ),
          takenThisPeriod: deductions.leaveHoursTaken,
          takenToDate: ytdTotals.leaveHoursTaken,
        }
      : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 print:hidden">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-xl font-bold text-amber-600"
            >
              Malta Calculator
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-600 dark:text-slate-400">Payslip</span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 print:p-0">
        <div className="mx-auto max-w-3xl">
          {/* Actions */}
          <div className="mb-6 flex items-center justify-between print:hidden">
            <Link
              href="/dashboard"
              className="text-sm text-slate-500 hover:text-amber-600"
            >
              ← Back to Dashboard
            </Link>
            <PayslipActions
              payslipId={payslip.id}
              status={payslip.status}
              payslipNumber={payslipNumber}
              employeeName={payslip.employee.name}
            />
          </div>

          {/* Payslip Info Header */}
          <div className="mb-4 print:hidden">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Payslip - {months[payslip.period_month - 1]}{" "}
                {payslip.period_year}
              </h1>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  isDraft
                    ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                }`}
              >
                {isDraft ? "Draft" : "Issued"}
              </span>
            </div>
            <p className="text-slate-500">
              {payslip.employee.name} • {payslip.company.name}
            </p>
            {isDraft && (
              <p className="mt-3 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-200">
                This is a draft. The employee cannot see it and its QR code is
                not active. Edit it as often as you need, then issue it when
                the figures are final. Drafts don&apos;t count towards your
                monthly limit.
              </p>
            )}
          </div>

          {/* Payslip Document */}
          <div
            className="rounded-xl shadow-xl print:rounded-none print:shadow-none"
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              width: "210mm",
              minHeight: "297mm",
              boxSizing: "border-box",
              fontSize: "10px",
              lineHeight: "1.4",
            }}
          >
            <PayslipDocument
              company={{
                name: payslip.company.name,
                address: payslip.company.address,
                tax_number: payslip.company.tax_number,
                logo_url: payslip.company.logo_url,
                plan: payslip.company.plan,
              }}
              employee={{
                name: payslip.employee.name,
                position: payslip.employee.position,
                employee_code: payslip.employee.employee_code,
                email: payslip.employee.email,
                address: (payslip.employee as { address?: string | null })
                  .address,
                id_number: (payslip.employee as { id_number?: string | null })
                  .id_number,
                ss_number: (payslip.employee as { ss_number?: string | null })
                  .ss_number,
                department: (payslip.employee as { department?: string | null })
                  .department,
                section: (payslip.employee as { section?: string | null })
                  .section,
                unit: (payslip.employee as { unit?: string | null }).unit,
                grade: (payslip.employee as { grade?: string | null }).grade,
              }}
              periodMonth={payslip.period_month}
              periodYear={payslip.period_year}
              grossSalary={payslip.gross_salary}
              netSalary={payslip.net_salary}
              incomeTax={deductions.incomeTax}
              sscEmployee={deductions.sscEmployee}
              createdAt={payslip.created_at}
              updatedAt={payslip.updated_at}
              payslipNumber={payslipNumber}
              ytdTotals={ytdTotals}
              salaryConfig={salaryConfig}
              earnings={earnings}
              sscWeeks={sscWeeks}
              periodStartDate={deductions.periodStartDate}
              employmentRatio={deductions.employmentRatio}
              payDate={deductions.payDate}
              employerContributions={employerContributions}
              leave={leave}
              notes={deductions.notes}
              status={payslip.status}
              accessToken={payslip.access_token}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
