'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCompany } from '@/app/actions/payslip-actions'

export default function OnboardingWizard() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        taxNumber: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const form = new FormData()
        form.append('name', formData.name)
        form.append('address', formData.address)
        form.append('taxNumber', formData.taxNumber)

        const result = await createCompany(form)

        if (result.success) {
            router.push('/dashboard')
            router.refresh()
        } else {
            setError(result.error || 'An error occurred')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
                <div className="w-full max-w-lg">
                    {/* Progress */}
                    <div className="mb-8">
                        <div className="mb-2 flex justify-between text-sm text-slate-500">
                            <span>Step {step} of 1</span>
                            <span>Company Information</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                            <div
                                className="h-full bg-amber-500 transition-all"
                                style={{ width: `${(step / 1) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border bg-white p-8 shadow-xl dark:bg-slate-800 dark:border-slate-700">
                        <div className="mb-6 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
                                <span className="text-3xl">🏢</span>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Welcome!
                            </h1>
                            <p className="mt-2 text-slate-500">
                                Enter your company details to start creating payslips
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. ABC Limited"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Address
                                </label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Company address (optional)"
                                    rows={2}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Tax Number
                                </label>
                                <input
                                    type="text"
                                    value={formData.taxNumber}
                                    onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                                    placeholder="e.g. MT12345678 (optional)"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                            </div>

                            {error && (
                                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !formData.name.trim()}
                                className="w-full rounded-lg bg-amber-600 px-4 py-3 font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Saving...
                                    </span>
                                ) : (
                                    'Get Started →'
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="mt-4 text-center text-sm text-slate-500">
                        You can change this information later
                    </p>
                </div>
            </div>
        </div>
    )
}
