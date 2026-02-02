'use client'

interface PayslipDocumentProps {
    company: {
        name: string;
        address: string | null;
        tax_number: string | null;
        logo_url: string | null;
        plan: 'free' | 'basic' | 'pro';
    };
    employee: {
        name: string;
        position: string | null;
        employee_code: string | null;
        email: string | null;
    };
    periodMonth: number;
    periodYear: number;
    grossSalary: number;
    netSalary: number;
    incomeTax: number;
    sscEmployee: number;
    createdAt: string;
    payslipNumber: string;
}

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function PayslipDocument({
    company,
    employee,
    periodMonth,
    periodYear,
    grossSalary,
    netSalary,
    incomeTax,
    sscEmployee,
    createdAt,
    payslipNumber,
}: PayslipDocumentProps) {
    const totalDeductions = incomeTax + sscEmployee;
    const monthlyBasic = grossSalary;
    const period = `${months[periodMonth - 1]} ${periodYear}`;

    // Calculate roll period dates
    const startDate = new Date(periodYear, periodMonth - 1, 1);
    const endDate = new Date(periodYear, periodMonth, 0);
    const rollPeriod = `${startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} - ${endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;

    return (
        <div className="bg-white text-slate-900 print:text-black" style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px' }}>
            {/* Main Container */}
            <div className="border border-slate-300 print:border-black">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-200 p-4 print:border-black">
                    {/* Left - Logo (Whitelabel) */}
                    <div className="flex-1">
                        {company.logo_url && company.plan !== 'free' ? (
                            <img
                                src={company.logo_url}
                                alt={company.name}
                                className="h-12 object-contain"
                            />
                        ) : company.plan !== 'free' ? (
                            <div className="text-lg font-bold text-slate-700">{company.name}</div>
                        ) : null}
                    </div>

                    {/* Right - Employer Details */}
                    <div className="text-right">
                        <div className="font-bold">{company.name}</div>
                        {company.address && <div className="text-slate-600">{company.address}</div>}
                        {company.tax_number && <div className="text-slate-600">PE No.: {company.tax_number}</div>}
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="flex">
                    {/* Left Column - Employee Info & Totals */}
                    <div className="w-1/2 border-r border-slate-200 p-4 print:border-black">
                        {/* Employee Details */}
                        <div className="mb-4">
                            <div className="mb-2 border-b border-slate-300 pb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                                Employee Details
                            </div>
                            <table className="w-full text-xs">
                                <tbody>
                                    <tr>
                                        <td className="py-0.5 text-slate-500">Name:</td>
                                        <td className="py-0.5 font-medium">{employee.name}</td>
                                    </tr>
                                    {employee.employee_code && (
                                        <tr>
                                            <td className="py-0.5 text-slate-500">Employee No.:</td>
                                            <td className="py-0.5 font-medium">{employee.employee_code}</td>
                                        </tr>
                                    )}
                                    {employee.position && (
                                        <tr>
                                            <td className="py-0.5 text-slate-500">Occupation:</td>
                                            <td className="py-0.5">{employee.position}</td>
                                        </tr>
                                    )}
                                    {employee.email && (
                                        <tr>
                                            <td className="py-0.5 text-slate-500">Email:</td>
                                            <td className="py-0.5">{employee.email}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pay Period Info */}
                        <div className="mb-4">
                            <div className="mb-2 border-b border-slate-300 pb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                                Pay Period
                            </div>
                            <table className="w-full text-xs">
                                <tbody>
                                    <tr>
                                        <td className="py-0.5 text-slate-500">Pay Date:</td>
                                        <td className="py-0.5 font-medium">{endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-0.5 text-slate-500">Roll Period:</td>
                                        <td className="py-0.5">{rollPeriod}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-0.5 text-slate-500">Payslip No.:</td>
                                        <td className="py-0.5 font-medium">{payslipNumber}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Totals to Date */}
                        <div>
                            <div className="mb-2 border-b border-slate-300 pb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                                Totals to Date ({periodYear})
                            </div>
                            <table className="w-full text-xs">
                                <tbody>
                                    <tr>
                                        <td className="py-0.5 text-slate-500">Gross:</td>
                                        <td className="py-0.5 text-right font-medium">€{(grossSalary * periodMonth).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-0.5 text-slate-500">Tax (FSS):</td>
                                        <td className="py-0.5 text-right text-red-600">€{(incomeTax * periodMonth).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-0.5 text-slate-500">Social Security:</td>
                                        <td className="py-0.5 text-right text-red-600">€{(sscEmployee * periodMonth).toFixed(2)}</td>
                                    </tr>
                                    <tr className="border-t border-slate-200">
                                        <td className="py-1 font-medium">Net to Date:</td>
                                        <td className="py-1 text-right font-bold text-amber-600">€{(netSalary * periodMonth).toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Column - Current Month Breakdown */}
                    <div className="w-1/2 p-4">
                        {/* Basic Salary */}
                        <div className="mb-4">
                            <div className="mb-2 border-b border-slate-300 pb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                                Basic ({period})
                            </div>
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="text-slate-500">
                                        <th className="py-0.5 text-left font-normal">Description</th>
                                        <th className="py-0.5 text-right font-normal">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-0.5">Monthly Salary</td>
                                        <td className="py-0.5 text-right font-medium">€{monthlyBasic.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Gross Total */}
                        <div className="mb-4 rounded bg-slate-100 p-2 print:bg-gray-100">
                            <div className="flex justify-between text-xs font-bold">
                                <span>Gross Total</span>
                                <span>€{grossSalary.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Deductions */}
                        <div className="mb-4">
                            <div className="mb-2 border-b border-slate-300 pb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                                Deductions
                            </div>
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="text-slate-500">
                                        <th className="py-0.5 text-left font-normal">Description</th>
                                        <th className="py-0.5 text-right font-normal">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-0.5">Tax (FSS Main Method)</td>
                                        <td className="py-0.5 text-right text-red-600">€{incomeTax.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-0.5">Social Security</td>
                                        <td className="py-0.5 text-right text-red-600">€{sscEmployee.toFixed(2)}</td>
                                    </tr>
                                    <tr className="border-t border-slate-200">
                                        <td className="py-1 font-medium">Total Deductions</td>
                                        <td className="py-1 text-right font-bold text-red-600">€{totalDeductions.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Net Pay */}
                        <div className="rounded bg-amber-50 p-3 print:bg-green-50">
                            <div className="flex justify-between">
                                <span className="text-sm font-bold text-slate-900">Net Pay</span>
                                <span className="text-xl font-bold text-amber-600">€{netSalary.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 px-4 py-2 text-center text-xs text-slate-400 print:border-black">
                    <div className="flex items-center justify-between">
                        <span>Generated: {new Date(createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        {company.plan === 'free' && (
                            <span className="text-slate-500">Powered by Malta Calculator</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
