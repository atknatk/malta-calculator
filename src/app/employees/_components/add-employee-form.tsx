'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createEmployee, canAddEmployee } from '@/app/actions/payslip-actions'

export default function AddEmployeeForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [showAdvanced, setShowAdvanced] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        employeeCode: '',
        position: '',
        phone: '',
        dateOfBirth: '',
        // New professional fields
        address: '',
        idNumber: '',
        ssNumber: '',
        department: '',
        section: '',
        unit: '',
        grade: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        // Check if can add more employees
        const canAdd = await canAddEmployee()
        if (!canAdd.allowed) {
            setError(canAdd.message || 'Employee limit reached')
            setLoading(false)
            return
        }

        const form = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            if (value) form.append(key, value)
        })

        const result = await createEmployee(form)

        if (result.success) {
            setSuccess(true)
            setFormData({
                name: '',
                email: '',
                employeeCode: '',
                position: '',
                phone: '',
                dateOfBirth: '',
                address: '',
                idNumber: '',
                ssNumber: '',
                department: '',
                section: '',
                unit: '',
                grade: '',
            })
            router.refresh()
            setTimeout(() => setSuccess(false), 3000)
        } else {
            setError(result.error || 'An error occurred')
        }
        setLoading(false)
    }

    const inputClassName = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Full Name *
                </label>
                <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Smith"
                    className={inputClassName}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Employee Code
                    </label>
                    <input
                        type="text"
                        value={formData.employeeCode}
                        onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                        placeholder="e.g. EMP001"
                        className={inputClassName}
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Position
                    </label>
                    <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        placeholder="e.g. Developer"
                        className={inputClassName}
                    />
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email
                </label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="employee@company.com"
                    className={inputClassName}
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Date of Birth (for PIN)
                </label>
                <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className={inputClassName}
                />
            </div>

            {/* Advanced Fields Toggle */}
            <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
            >
                <span>{showAdvanced ? '▼' : '▶'}</span>
                <span>{showAdvanced ? 'Hide' : 'Show'} Professional Payslip Fields</span>
            </button>

            {/* Advanced Fields */}
            {showAdvanced && (
                <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        These fields appear on professional payslips (matching INDIGO format)
                    </p>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Address
                        </label>
                        <textarea
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Full address (multi-line)"
                            rows={2}
                            className={inputClassName}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                ID Number
                            </label>
                            <input
                                type="text"
                                value={formData.idNumber}
                                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                                placeholder="e.g. 123456A"
                                className={inputClassName}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                SS Number
                            </label>
                            <input
                                type="text"
                                value={formData.ssNumber}
                                onChange={(e) => setFormData({ ...formData, ssNumber: e.target.value })}
                                placeholder="Social Security No."
                                className={inputClassName}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Department
                            </label>
                            <input
                                type="text"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                placeholder="e.g. Engineering"
                                className={inputClassName}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Section
                            </label>
                            <input
                                type="text"
                                value={formData.section}
                                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                placeholder="e.g. Backend"
                                className={inputClassName}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Unit
                            </label>
                            <input
                                type="text"
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                placeholder="e.g. Platform"
                                className={inputClassName}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Grade
                            </label>
                            <input
                                type="text"
                                value={formData.grade}
                                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                placeholder="e.g. Senior"
                                className={inputClassName}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Phone
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+356 1234 5678"
                            className={inputClassName}
                        />
                    </div>
                </div>
            )}

            {error && (
                <div className="rounded-lg bg-red-50 p-2 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-lg bg-amber-50 p-2 text-sm text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                    Employee added successfully!
                </div>
            )}

            <button
                type="submit"
                disabled={loading || formData.name.length < 2}
                className="w-full rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loading ? 'Adding...' : 'Add Employee'}
            </button>
        </form>
    )
}
