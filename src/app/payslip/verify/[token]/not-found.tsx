import Link from 'next/link'

export default function PayslipNotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-md text-center">
                    {/* Error Icon */}
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                        <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        Payslip Not Found
                    </h1>
                    <p className="text-slate-500 mb-6">
                        The payslip you are looking for could not be verified.
                        This may be because the link is invalid or the payslip has been removed.
                    </p>

                    {/* Possible Reasons */}
                    <div className="rounded-lg border border-slate-200 bg-white p-4 text-left mb-6">
                        <p className="text-sm font-medium text-slate-700 mb-2">Possible reasons:</p>
                        <ul className="text-sm text-slate-500 space-y-1">
                            <li>- The verification link may be incomplete or corrupted</li>
                            <li>- The payslip may have been deleted</li>
                            <li>- The link may have expired</li>
                        </ul>
                    </div>

                    {/* Help Text */}
                    <p className="text-sm text-slate-500 mb-6">
                        If you believe this is an error, please contact the employer who issued the payslip.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-6 py-3 text-sm font-medium text-white hover:bg-amber-700 transition"
                        >
                            Go to Malta Calculator
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
