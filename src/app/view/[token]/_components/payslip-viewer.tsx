'use client';

import Link from 'next/link';

interface PayslipViewerProps {
    payslip: {
        id: string;
        period_month: number;
        period_year: number;
        gross_salary: number;
        net_salary: number;
        deductions: {
            incomeTax: number;
            sscEmployee: number;
        };
        created_at: string;
        employee: {
            name: string;
            position: string | null;
            employee_code: string | null;
        };
        company: {
            name: string;
            address: string | null;
            tax_number: string | null;
            logo_url: string | null;
            plan: 'free' | 'basic' | 'pro';
        };
    };
}

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function PayslipViewer({ payslip }: PayslipViewerProps) {
    const period = `${months[payslip.period_month - 1]} ${payslip.period_year}`;
    const totalDeductions = payslip.deductions.incomeTax + payslip.deductions.sscEmployee;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 print:hidden">
                <div className="container mx-auto flex items-center justify-between px-4 py-4">
                    <Link href="/" className="text-xl font-bold text-amber-600">
                        Malta Calculator
                    </Link>
                    <button
                        onClick={handlePrint}
                        className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
                    >
                        🖨️ Print / Save PDF
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-4 py-8 print:p-0">
                <div className="mx-auto max-w-2xl">
                    {/* Title */}
                    <div className="mb-6 text-center print:hidden">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Your Payslip
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">{period}</p>
                    </div>

                    {/* Payslip Document */}
                    <div className="rounded-2xl border bg-white shadow-xl print:rounded-none print:border-0 print:shadow-none dark:bg-slate-800 dark:border-slate-700">
                        {/* Header */}
                        <div className="border-b border-slate-200 p-6 dark:border-slate-700">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {payslip.company.name}
                                    </h2>
                                    {payslip.company.address && (
                                        <p className="mt-1 text-sm text-slate-500">{payslip.company.address}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-semibold text-amber-600">PAYSLIP</span>
                                    <p className="text-sm text-slate-500">{period}</p>
                                </div>
                            </div>
                        </div>

                        {/* Employee Info */}
                        <div className="border-b border-slate-200 p-6 dark:border-slate-700">
                            <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-slate-500">
                                Employee Details
                            </h3>
                            <div className="grid gap-2 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm text-slate-500">Name</p>
                                    <p className="font-medium text-slate-900 dark:text-white">{payslip.employee.name}</p>
                                </div>
                                {payslip.employee.position && (
                                    <div>
                                        <p className="text-sm text-slate-500">Position</p>
                                        <p className="font-medium text-slate-900 dark:text-white">{payslip.employee.position}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Earnings */}
                        <div className="border-b border-slate-200 p-6 dark:border-slate-700">
                            <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-slate-500">
                                Earnings
                            </h3>
                            <div className="flex justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700">
                                <span className="text-slate-700 dark:text-slate-300">Gross Salary</span>
                                <span className="font-bold text-slate-900 dark:text-white">
                                    €{payslip.gross_salary.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Deductions */}
                        <div className="border-b border-slate-200 p-6 dark:border-slate-700">
                            <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-slate-500">
                                Deductions
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between p-2">
                                    <span className="text-slate-700 dark:text-slate-300">Income Tax</span>
                                    <span className="font-medium text-red-600">-€{payslip.deductions.incomeTax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between p-2">
                                    <span className="text-slate-700 dark:text-slate-300">Social Security</span>
                                    <span className="font-medium text-red-600">-€{payslip.deductions.sscEmployee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Total Deductions</span>
                                    <span className="font-bold text-red-600">-€{totalDeductions.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Net Pay */}
                        <div className="p-6">
                            <div className="flex justify-between rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
                                <span className="text-lg font-bold text-slate-900 dark:text-white">Net Salary</span>
                                <span className="text-2xl font-bold text-amber-600">€{payslip.net_salary.toFixed(2)}</span>
                            </div>

                            <p className="mt-4 text-center text-xs text-slate-400">
                                Generated on {new Date(payslip.created_at).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>

                            {payslip.company.plan === 'free' && (
                                <p className="mt-2 text-center text-xs text-slate-500">
                                    Powered by Malta Calculator
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
