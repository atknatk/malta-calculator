'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { isChildCountEffective } from '@/config/malta-tax-config'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface Company {
    id: string
    name: string
    plan: 'free' | 'basic' | 'pro'
}

interface Employee {
    id: string
    name: string
    position: string | null
    employee_code: string | null
}

interface PayslipWizardProps {
    company: Company
    employees: Employee[]
    selectedEmployeeId?: string
}

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]

export default function PayslipWizard({ company, employees, selectedEmployeeId }: PayslipWizardProps) {
    const router = useRouter()
    const currentDate = new Date()

    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Step 1: Employee selection
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
        selectedEmployeeId ? employees.find(e => e.id === selectedEmployeeId) || null : null
    )

    // Step 2: Salary details - enhanced with all parameters
    const [salaryDetails, setSalaryDetails] = useState({
        month: currentDate.getMonth() + 1, // 1-12
        year: currentDate.getFullYear(),
        annualGrossSalary: 24000, // Annual salary for API
        taxType: 'single' as 'single' | 'married' | 'parent',
        childCount: 0 as 0 | 1 | 2, // Number of children (2026+)
        sscCategory: 'C' as 'A' | 'B' | 'C' | 'D',
        birthYear: 1990,
        bonus: 0, // One-time bonus for this month
        allowance: 0, // Monthly allowance
    })

    // Show child count for married/parent in 2026+
    const showChildCount = useMemo(() =>
        isChildCountEffective(salaryDetails.year) &&
        (salaryDetails.taxType === 'married' || salaryDetails.taxType === 'parent'),
        [salaryDetails.year, salaryDetails.taxType]
    )

    // Step 3: Calculation results - enhanced
    const [calculationResult, setCalculationResult] = useState<{
        grossSalary: number
        netSalary: number
        incomeTax: number
        sscEmployee: number
        monthlyGross: number
        cola: number
        bonus: number
        allowance: number
    } | null>(null)

    const handleCalculate = async () => {
        setLoading(true)
        setError(null)

        try {
            // Call the existing salary API with all parameters
            const response = await fetch('/api/salary/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SALARY_API_TOKEN || 'malta-calc-secret-token-2025'}`
                },
                body: JSON.stringify({
                    salary: salaryDetails.annualGrossSalary,
                    year: salaryDetails.year,
                    taxType: salaryDetails.taxType,
                    childCount: salaryDetails.childCount,
                    sscCategory: salaryDetails.sscCategory,
                    birthYear: salaryDetails.birthYear,
                }),
            })

            const data = await response.json()

            if (data.success && data.data) {
                const monthIndex = salaryDetails.month - 1
                const monthlyData = data.data.monthlyBreakdown[monthIndex]

                // Calculate total with bonus and allowance
                const baseGross = monthlyData?.grossTotal || data.data.summary.monthly.gross
                const totalGross = baseGross + salaryDetails.bonus + salaryDetails.allowance

                setCalculationResult({
                    grossSalary: totalGross,
                    netSalary: (monthlyData?.net || data.data.summary.monthly.net) + salaryDetails.bonus + salaryDetails.allowance,
                    incomeTax: monthlyData?.incomeTax || data.data.summary.monthly.tax,
                    sscEmployee: monthlyData?.sscTax || data.data.summary.monthly.ssc,
                    monthlyGross: data.data.summary.monthly.gross,
                    cola: monthlyData?.cola || 0,
                    bonus: salaryDetails.bonus,
                    allowance: salaryDetails.allowance,
                })
                setStep(3)
            } else {
                setError(data.error || 'Calculation failed')
            }
        } catch {
            setError('API error occurred')
        }
        setLoading(false)
    }

    const handleGenerate = async () => {
        if (!selectedEmployee || !calculationResult) return

        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/payslip/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    employeeId: selectedEmployee.id,
                    periodMonth: salaryDetails.month,
                    periodYear: salaryDetails.year,
                    grossSalary: calculationResult.grossSalary,
                    netSalary: calculationResult.netSalary,
                    deductions: {
                        incomeTax: calculationResult.incomeTax,
                        sscEmployee: calculationResult.sscEmployee,
                        cola: calculationResult.cola,
                        bonus: calculationResult.bonus,
                        allowance: calculationResult.allowance,
                    },
                    salaryConfig: {
                        annualGross: salaryDetails.annualGrossSalary,
                        taxType: salaryDetails.taxType,
                        childCount: salaryDetails.childCount,
                        sscCategory: salaryDetails.sscCategory,
                        birthYear: salaryDetails.birthYear,
                    },
                }),
            })

            const data = await response.json()

            if (data.success) {
                router.push(`/payslip/${data.payslipId}`)
            } else {
                setError(data.error || 'Failed to create payslip')
            }
        } catch {
            setError('An error occurred')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
                <div className="container mx-auto flex items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard" className="text-xl font-bold text-amber-600">
                            Malta Calculator
                        </Link>
                        <span className="rounded-md bg-gradient-to-r from-violet-500 to-purple-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            Beta
                        </span>
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-600 dark:text-slate-400">New Payslip</span>
                    </div>
                    <UserButton afterSignOutUrl="/" />
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="mx-auto max-w-2xl">
                    {/* Progress */}
                    <div className="mb-8">
                        <div className="mb-2 flex justify-between text-sm text-slate-500">
                            <span>Step {step} of 3</span>
                            <span>
                                {step === 1 && 'Select Employee'}
                                {step === 2 && 'Salary Details'}
                                {step === 3 && 'Preview & Generate'}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`h-2 flex-1 rounded-full transition ${s <= step ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Step 1: Employee Selection */}
                    {step === 1 && (
                        <div className="rounded-2xl border bg-white p-8 shadow-xl dark:bg-slate-800 dark:border-slate-700">
                            <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                                Select Employee
                            </h2>
                            <div className="space-y-3">
                                {employees.map((employee) => (
                                    <button
                                        key={employee.id}
                                        onClick={() => setSelectedEmployee(employee)}
                                        className={`w-full rounded-lg border p-4 text-left transition ${selectedEmployee?.id === employee.id
                                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                                            : 'border-slate-200 hover:border-amber-300 dark:border-slate-700'
                                            }`}
                                    >
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {employee.name}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {employee.position || 'No position specified'}
                                            {employee.employee_code && ` • ${employee.employee_code}`}
                                        </p>
                                    </button>
                                ))}
                            </div>
                            <div className="mt-6 flex justify-between">
                                <Link
                                    href="/dashboard"
                                    className="text-sm text-slate-500 hover:text-amber-600"
                                >
                                    ← Cancel
                                </Link>
                                <Button
                                    onClick={() => setStep(2)}
                                    disabled={!selectedEmployee}
                                    className="bg-amber-600 hover:bg-amber-700"
                                >
                                    Continue →
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Salary Details - Enhanced with Shadcn */}
                    {step === 2 && (
                        <div className="rounded-2xl border bg-white p-8 shadow-xl dark:bg-slate-800 dark:border-slate-700">
                            <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                                Salary Details
                            </h2>
                            <p className="mb-6 text-slate-500">
                                Creating payslip for {selectedEmployee?.name}
                            </p>

                            <div className="space-y-6">
                                {/* Period & Salary Row */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Period</Label>
                                        <div className="flex gap-2">
                                            <Select
                                                value={salaryDetails.month.toString()}
                                                onValueChange={(v) => setSalaryDetails({ ...salaryDetails, month: parseInt(v) })}
                                            >
                                                <SelectTrigger className="flex-1">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {months.map((m, i) => (
                                                        <SelectItem key={i} value={(i + 1).toString()}>{m}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Select
                                                value={salaryDetails.year.toString()}
                                                onValueChange={(v) => setSalaryDetails({ ...salaryDetails, year: parseInt(v) })}
                                            >
                                                <SelectTrigger className="w-24">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {[2024, 2025, 2026].map((y) => (
                                                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Annual Gross Salary (€)</Label>
                                        <Input
                                            type="number"
                                            value={salaryDetails.annualGrossSalary}
                                            onChange={(e) => setSalaryDetails({ ...salaryDetails, annualGrossSalary: parseInt(e.target.value) || 0 })}
                                        />
                                        <p className="text-xs text-slate-500">
                                            Monthly: €{(salaryDetails.annualGrossSalary / 12).toFixed(0)}
                                        </p>
                                    </div>
                                </div>

                                {/* Tax Settings Row */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Tax Status</Label>
                                        <Select
                                            value={salaryDetails.taxType}
                                            onValueChange={(v: 'single' | 'married' | 'parent') => setSalaryDetails({
                                                ...salaryDetails,
                                                taxType: v,
                                                childCount: v === 'single' ? 0 : salaryDetails.childCount
                                            })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="single">👤 Single</SelectItem>
                                                <SelectItem value="married">💑 Married</SelectItem>
                                                <SelectItem value="parent">👨‍👩‍👧 Parent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>SSC Category</Label>
                                        <Select
                                            value={salaryDetails.sscCategory}
                                            onValueChange={(v: 'A' | 'B' | 'C' | 'D') => setSalaryDetails({ ...salaryDetails, sscCategory: v })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="A">Category A (Under 18)</SelectItem>
                                                <SelectItem value="B">Category B (Part-time)</SelectItem>
                                                <SelectItem value="C">Category C (Full-time)</SelectItem>
                                                <SelectItem value="D">Category D</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Child Count (2026+) */}
                                {showChildCount && (
                                    <div className="space-y-2">
                                        <Label>Number of Children</Label>
                                        <div className="flex gap-2">
                                            {[0, 1, 2].map((count) => (
                                                <Button
                                                    key={count}
                                                    type="button"
                                                    variant={salaryDetails.childCount === count ? "default" : "outline"}
                                                    onClick={() => setSalaryDetails({ ...salaryDetails, childCount: count as 0 | 1 | 2 })}
                                                    className={salaryDetails.childCount === count ? "bg-amber-600 hover:bg-amber-700" : ""}
                                                >
                                                    {count === 0 ? 'None' : count === 1 ? '1 Child' : '2+ Children'}
                                                </Button>
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            From 2026, tax rates vary based on the number of children
                                        </p>
                                    </div>
                                )}

                                {/* Birth Year & Extras */}
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label>Birth Year</Label>
                                        <Input
                                            type="number"
                                            value={salaryDetails.birthYear}
                                            onChange={(e) => setSalaryDetails({ ...salaryDetails, birthYear: parseInt(e.target.value) || 1990 })}
                                            placeholder="1990"
                                        />
                                        <p className="text-xs text-slate-500">
                                            SSC rates differ for born before/after 1962
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Bonus (€)</Label>
                                        <Input
                                            type="number"
                                            value={salaryDetails.bonus || ''}
                                            onChange={(e) => setSalaryDetails({ ...salaryDetails, bonus: parseFloat(e.target.value) || 0 })}
                                            placeholder="0"
                                        />
                                        <p className="text-xs text-slate-500">
                                            One-time bonus this month
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Allowance (€)</Label>
                                        <Input
                                            type="number"
                                            value={salaryDetails.allowance || ''}
                                            onChange={(e) => setSalaryDetails({ ...salaryDetails, allowance: parseFloat(e.target.value) || 0 })}
                                            placeholder="0"
                                        />
                                        <p className="text-xs text-slate-500">
                                            Monthly allowance
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-between">
                                <Button
                                    variant="ghost"
                                    onClick={() => setStep(1)}
                                >
                                    ← Back
                                </Button>
                                <Button
                                    onClick={handleCalculate}
                                    disabled={loading}
                                    className="bg-amber-600 hover:bg-amber-700"
                                >
                                    {loading ? 'Calculating...' : 'Calculate & Preview →'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Preview & Generate - Enhanced */}
                    {step === 3 && calculationResult && (
                        <div className="rounded-2xl border bg-white p-8 shadow-xl dark:bg-slate-800 dark:border-slate-700">
                            <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                                Payslip Preview
                            </h2>
                            <p className="mb-6 text-slate-500">
                                {selectedEmployee?.name} • {months[salaryDetails.month - 1]} {salaryDetails.year}
                            </p>

                            {/* Payslip Preview */}
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">
                                <div className="mb-4 border-b border-slate-200 pb-4 dark:border-slate-700">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        {company.name}
                                    </h3>
                                    <p className="text-sm text-slate-500">Payslip</p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-slate-500">Employee</p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {selectedEmployee?.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Period</p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {months[salaryDetails.month - 1]} {salaryDetails.year}
                                        </p>
                                    </div>
                                </div>

                                {/* Earnings */}
                                <div className="mt-6 space-y-2 border-t border-slate-200 pt-4 dark:border-slate-700">
                                    <p className="text-xs font-semibold uppercase text-slate-500">Earnings</p>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Basic Salary</span>
                                        <span className="font-medium text-slate-900 dark:text-white">
                                            €{calculationResult.monthlyGross.toFixed(2)}
                                        </span>
                                    </div>
                                    {calculationResult.cola > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-600 dark:text-slate-400">COLA</span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                €{calculationResult.cola.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    {calculationResult.bonus > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-600 dark:text-slate-400">Bonus</span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                €{calculationResult.bonus.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    {calculationResult.allowance > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-600 dark:text-slate-400">Allowance</span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                €{calculationResult.allowance.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between border-t border-slate-200 pt-2 dark:border-slate-700">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">Total Gross</span>
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            €{calculationResult.grossSalary.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Deductions */}
                                <div className="mt-4 space-y-2">
                                    <p className="text-xs font-semibold uppercase text-slate-500">Deductions</p>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Income Tax</span>
                                        <span className="font-medium text-red-600">
                                            -€{calculationResult.incomeTax.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Social Security (SSC)</span>
                                        <span className="font-medium text-red-600">
                                            -€{calculationResult.sscEmployee.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-t border-slate-200 pt-2 dark:border-slate-700">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">Total Deductions</span>
                                        <span className="font-bold text-red-600">
                                            -€{(calculationResult.incomeTax + calculationResult.sscEmployee).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Net Salary */}
                                <div className="mt-4 border-t-2 border-amber-500 pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-bold text-slate-900 dark:text-white">Net Salary</span>
                                        <span className="text-2xl font-bold text-amber-600">
                                            €{calculationResult.netSalary.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {company.plan === 'free' && (
                                    <div className="mt-4 rounded bg-slate-200/50 p-2 text-center text-xs text-slate-500">
                                        Powered by Malta Calculator
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                    {error}
                                </div>
                            )}

                            <div className="mt-6 flex justify-between">
                                <Button
                                    variant="ghost"
                                    onClick={() => setStep(2)}
                                >
                                    ← Edit
                                </Button>
                                <Button
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    className="bg-amber-600 hover:bg-amber-700"
                                >
                                    {loading ? 'Creating...' : '✓ Create Payslip'}
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <Link
                            href="/dashboard"
                            className="text-sm text-slate-500 hover:text-amber-600"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}
