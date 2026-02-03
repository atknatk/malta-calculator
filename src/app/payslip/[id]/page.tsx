import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { getPayslipById, getYearToDateTotals } from "@/app/actions/payslip-actions";
import PayslipDocument from "./_components/payslip-document";
import PayslipActions from "./_components/payslip-actions";

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default async function PayslipViewPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const { id } = await params;
    const payslip = await getPayslipById(id);

    if (!payslip) {
        notFound();
    }

    // Extract deductions and salary config from payslip
    const deductions = payslip.deductions as {
        incomeTax: number;
        sscEmployee: number;
        cola?: number;
        bonus?: number;
        allowance?: number;
    };

    // Get salary config if stored
    const salaryConfig = (payslip as {
        salary_config?: {
            annualGross?: number;
            taxType?: 'single' | 'married' | 'parent';
            childCount?: number;
            sscCategory?: string;
            birthYear?: number;
        }
    }).salary_config;

    // Get Year-to-Date totals
    const ytdTotals = await getYearToDateTotals(
        payslip.employee_id,
        payslip.period_year,
        payslip.period_month
    );

    // Generate unique payslip number with company prefix
    const companyPrefix = payslip.company.name.substring(0, 3).toUpperCase();
    const payslipNumber = `${companyPrefix}-${payslip.period_year}-${String(payslip.period_month).padStart(2, '0')}-${payslip.id.substring(0, 4).toUpperCase()}`;

    // Calculate basic salary (gross minus extras)
    const basicSalary = payslip.gross_salary - (deductions.cola || 0) - (deductions.bonus || 0) - (deductions.allowance || 0);

    // Build earnings object
    const earnings = {
        basicSalary,
        cola: deductions.cola || 0,
        bonus: deductions.bonus || 0,
        allowance: deductions.allowance || 0,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 print:hidden">
                <div className="container mx-auto flex items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-xl font-bold text-amber-600">
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
                            payslipNumber={payslipNumber}
                            employeeName={payslip.employee.name}
                        />
                    </div>

                    {/* Payslip Info Header */}
                    <div className="mb-4 print:hidden">
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            Payslip - {months[payslip.period_month - 1]} {payslip.period_year}
                        </h1>
                        <p className="text-slate-500">
                            {payslip.employee.name} • {payslip.company.name}
                        </p>
                    </div>

                    {/* Payslip Document */}
                    <div className="rounded-xl shadow-xl print:rounded-none print:shadow-none" style={{
                        fontFamily: 'Arial, Helvetica, sans-serif',
                        width: '210mm',
                        minHeight: '297mm',
                        boxSizing: 'border-box',
                        fontSize: '10px',
                        lineHeight: '1.4'
                    }}>
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
                                address: (payslip.employee as { address?: string | null }).address,
                                id_number: (payslip.employee as { id_number?: string | null }).id_number,
                                ss_number: (payslip.employee as { ss_number?: string | null }).ss_number,
                                department: (payslip.employee as { department?: string | null }).department,
                                section: (payslip.employee as { section?: string | null }).section,
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
                            payslipNumber={payslipNumber}
                            ytdTotals={ytdTotals}
                            salaryConfig={salaryConfig}
                            earnings={earnings}
                            accessToken={payslip.access_token}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
