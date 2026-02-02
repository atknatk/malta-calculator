import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { getPayslipById } from "@/app/actions/payslip-actions";
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

    const deductions = payslip.deductions as {
        incomeTax: number;
        sscEmployee: number;
    };

    // Generate payslip number from period
    const payslipNumber = `${payslip.period_year}-${String(payslip.period_month).padStart(3, '0')}`;

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
                        <PayslipActions />
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
                    <div className="rounded-xl shadow-xl print:rounded-none print:shadow-none">
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
                            }}
                            periodMonth={payslip.period_month}
                            periodYear={payslip.period_year}
                            grossSalary={payslip.gross_salary}
                            netSalary={payslip.net_salary}
                            incomeTax={deductions.incomeTax}
                            sscEmployee={deductions.sscEmployee}
                            createdAt={payslip.created_at}
                            payslipNumber={payslipNumber}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
