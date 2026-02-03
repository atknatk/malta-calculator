'use client'

import { useState } from 'react'

interface PayslipActionsProps {
    payslipNumber?: string
    employeeName?: string
}

export default function PayslipActions({ payslipNumber, employeeName }: PayslipActionsProps) {
    const [downloading, setDownloading] = useState(false)

    const handlePrint = () => {
        window.print()
    }

    const handleDownloadPDF = async () => {
        setDownloading(true)

        try {
            // Dynamic import for html2pdf (client-side only)
            const html2pdf = (await import('html2pdf.js')).default

            // Find the payslip document element
            const element = document.querySelector('[data-payslip-document]') as HTMLElement | null
            if (!element) {
                // Fallback to printing if element not found
                window.print()
                return
            }

            // Generate filename
            const filename = payslipNumber
                ? `Payslip-${payslipNumber}${employeeName ? `-${employeeName.replace(/\s+/g, '_')}` : ''}.pdf`
                : 'Payslip.pdf'

            // Configure PDF options - no margins since document has internal padding
            const opt = {
                margin: 0,
                filename,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    // A4 width at 96 DPI = 794px, ensures consistent rendering
                    windowWidth: 794,
                    windowHeight: 1123,
                },
                jsPDF: {
                    unit: 'mm' as const,
                    format: 'a4' as const,
                    orientation: 'portrait' as const,
                },
                pagebreak: { mode: 'avoid-all' as const },
            }

            // Generate and download PDF
            await html2pdf().set(opt).from(element).save()
        } catch (error) {
            console.error('PDF generation failed:', error)
            // Fallback to print
            window.print()
        } finally {
            setDownloading(false)
        }
    }

    return (
        <div className="flex gap-3">
            <button
                onClick={handlePrint}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
            </button>
            <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:cursor-wait disabled:opacity-70"
            >
                {downloading ? (
                    <>
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Generating...
                    </>
                ) : (
                    <>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download PDF
                    </>
                )}
            </button>
        </div>
    )
}
