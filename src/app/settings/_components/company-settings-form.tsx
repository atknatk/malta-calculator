'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { updateCompany } from '@/app/actions/payslip-actions'

interface Company {
    id: string
    name: string
    logo_url: string | null
    address: string | null
    tax_number: string | null
    plan: 'free' | 'basic' | 'pro'
}

interface Props {
    company: Company
}

export default function CompanySettingsForm({ company }: Props) {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [loading, setLoading] = useState(false)
    const [logoLoading, setLogoLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [logoUrl, setLogoUrl] = useState<string | null>(company.logo_url)

    const [formData, setFormData] = useState({
        name: company.name,
        address: company.address || '',
        taxNumber: company.tax_number || '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        const form = new FormData()
        form.append('name', formData.name)
        form.append('address', formData.address)
        form.append('taxNumber', formData.taxNumber)

        const result = await updateCompany(form)

        if (result.success) {
            setSuccess('Company information updated successfully')
            router.refresh()
        } else {
            setError(result.error || 'An error occurred')
        }
        setLoading(false)
    }

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file')
            return
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setError('Image size must be less than 2MB')
            return
        }

        setLogoLoading(true)
        setError(null)
        setSuccess(null)

        const formData = new FormData()
        formData.append('logo', file)

        try {
            const response = await fetch('/api/company/logo', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (data.success) {
                setLogoUrl(data.logoUrl)
                setSuccess('Logo uploaded successfully')
                router.refresh()
            } else {
                setError(data.error || 'Failed to upload logo')
            }
        } catch {
            setError('Failed to upload logo')
        }

        setLogoLoading(false)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleLogoDelete = async () => {
        if (!logoUrl) return

        setLogoLoading(true)
        setError(null)
        setSuccess(null)

        try {
            const response = await fetch('/api/company/logo', {
                method: 'DELETE',
            })

            const data = await response.json()

            if (data.success) {
                setLogoUrl(null)
                setSuccess('Logo removed successfully')
                router.refresh()
            } else {
                setError(data.error || 'Failed to remove logo')
            }
        } catch {
            setError('Failed to remove logo')
        }

        setLogoLoading(false)
    }

    const isPaidPlan = company.plan !== 'free'

    return (
        <div className="space-y-8">
            {/* Logo Section */}
            <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-800 dark:border-slate-700">
                <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                    Company Logo
                </h2>

                <div className="flex items-start gap-6">
                    {/* Logo Preview */}
                    <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-700">
                        {logoUrl ? (
                            <Image
                                src={logoUrl}
                                alt="Company logo"
                                width={96}
                                height={96}
                                className="h-full w-full rounded-lg object-contain"
                            />
                        ) : (
                            <span className="text-3xl text-slate-400">🏢</span>
                        )}
                    </div>

                    {/* Logo Actions */}
                    <div className="flex-1">
                        {isPaidPlan ? (
                            <>
                                <p className="mb-3 text-sm text-slate-500">
                                    Upload your company logo to display on payslips. Max size: 2MB.
                                </p>
                                <div className="flex gap-3">
                                    <label className="cursor-pointer rounded-lg border border-amber-600 px-4 py-2 text-sm font-medium text-amber-600 transition hover:bg-amber-50 dark:hover:bg-amber-900/20">
                                        {logoLoading ? 'Uploading...' : (logoUrl ? 'Change Logo' : 'Upload Logo')}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            disabled={logoLoading}
                                            className="hidden"
                                        />
                                    </label>
                                    {logoUrl && (
                                        <button
                                            type="button"
                                            onClick={handleLogoDelete}
                                            disabled={logoLoading}
                                            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:hover:bg-red-900/20"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
                                <p className="text-sm text-amber-800 dark:text-amber-200">
                                    Logo upload is available on paid plans.
                                </p>
                                <a
                                    href="/pricing"
                                    className="mt-2 inline-block text-sm font-medium text-amber-600 hover:text-amber-700"
                                >
                                    Upgrade your plan →
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Company Info Form */}
            <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-800 dark:border-slate-700">
                <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                    Company Information
                </h2>

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
                            placeholder="Company address"
                            rows={3}
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
                            placeholder="e.g. MT12345678"
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        />
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/30 dark:text-green-400">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !formData.name.trim()}
                        className="rounded-lg bg-amber-600 px-6 py-3 font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Saving...
                            </span>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </form>
            </div>

            {/* Plan Info */}
            <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-800 dark:border-slate-700">
                <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                    Subscription Plan
                </h2>
                <div className="flex items-center justify-between">
                    <div>
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                            {company.plan === 'free' ? 'Free Plan' : company.plan === 'basic' ? 'Basic Plan' : 'Pro Plan'}
                        </span>
                    </div>
                    {company.plan === 'free' && (
                        <a
                            href="/pricing"
                            className="text-sm font-medium text-amber-600 hover:text-amber-700"
                        >
                            Upgrade →
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}
