'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createEmployee, canAddEmployee } from '@/app/actions/payslip-actions'

export default function AddEmployeeForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        employeeCode: '',
        position: '',
        phone: '',
        dateOfBirth: '',
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
            })
            router.refresh()
            setTimeout(() => setSuccess(false), 3000)
        } else {
            setError(result.error || 'An error occurred')
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Employee Code
                </label>
                <input
                    type="text"
                    value={formData.employeeCode}
                    onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                    placeholder="e.g. EMP001"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
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
                    placeholder="e.g. Software Developer"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                />
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
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
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
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                />
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 p-2 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-lg bg-amber-50 p-2 text-sm text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                    ✓ Employee added successfully!
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
