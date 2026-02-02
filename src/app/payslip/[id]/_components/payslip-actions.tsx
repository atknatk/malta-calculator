'use client'

export default function PayslipActions() {
    const handlePrint = () => {
        window.print()
    }

    const handleDownloadPDF = () => {
        // For now, just trigger print which can be saved as PDF
        // In the future, can implement actual PDF generation with libraries like jsPDF or html2pdf
        window.print()
    }

    return (
        <div className="flex gap-3">
            <button
                onClick={handlePrint}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
                🖨️ Print
            </button>
            <button
                onClick={handleDownloadPDF}
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
            >
                📄 Download PDF
            </button>
        </div>
    )
}
