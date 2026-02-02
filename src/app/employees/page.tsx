import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { getCompany, getEmployees } from "@/app/actions/payslip-actions";
import AddEmployeeForm from "./_components/add-employee-form";

export default async function EmployeesPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const company = await getCompany();

    if (!company) {
        redirect('/onboarding');
    }

    const employees = await getEmployees();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
                <div className="container mx-auto flex items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-xl font-bold text-amber-600">
                            Malta Calculator
                        </Link>
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-600 dark:text-slate-400">Employees</span>
                    </div>
                    <UserButton afterSignOutUrl="/" />
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                Employees
                            </h1>
                            <p className="mt-1 text-slate-500">
                                {employees.length} employee{employees.length !== 1 ? 's' : ''} registered
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Add Employee Card */}
                        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-800 dark:border-slate-700">
                            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                                Add New Employee
                            </h2>
                            <AddEmployeeForm />
                        </div>

                        {/* Employee List */}
                        <div className="rounded-xl border bg-white p-6 shadow-sm lg:col-span-2 dark:bg-slate-800 dark:border-slate-700">
                            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                                Registered Employees
                            </h2>

                            {employees.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-slate-600">
                                    <p className="text-slate-500">No employees added yet</p>
                                    <p className="mt-2 text-sm text-slate-400">
                                        Use the form on the left to add your first employee
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {employees.map((employee) => (
                                        <div
                                            key={employee.id}
                                            className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3 dark:border-slate-700"
                                        >
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {employee.name}
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    {employee.position || 'No position specified'}
                                                    {employee.employee_code && ` • ${employee.employee_code}`}
                                                </p>
                                            </div>
                                            <Link
                                                href={`/payslip/new?employeeId=${employee.id}`}
                                                className="rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-700 transition hover:bg-emerald-200 dark:bg-amber-900 dark:text-amber-300"
                                            >
                                                Generate Payslip
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <Link
                            href="/dashboard"
                            className="text-sm text-slate-500 hover:text-amber-600"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
