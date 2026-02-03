import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { getCompany } from "@/app/actions/payslip-actions";
import CompanySettingsForm from "./_components/company-settings-form";

export default async function SettingsPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const company = await getCompany();

    if (!company) {
        redirect('/onboarding');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
                <div className="container mx-auto flex items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="text-xl font-bold text-amber-600">
                            Malta Calculator
                        </Link>
                        <span className="rounded-md bg-gradient-to-r from-violet-500 to-purple-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            Beta
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="text-sm text-slate-600 hover:text-amber-600 dark:text-slate-400"
                        >
                            Dashboard
                        </Link>
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="mx-auto max-w-2xl">
                    <div className="mb-8">
                        <Link
                            href="/dashboard"
                            className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-amber-600"
                        >
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Company Settings
                        </h1>
                        <p className="mt-2 text-slate-500">
                            Manage your company information and logo
                        </p>
                    </div>

                    <CompanySettingsForm company={company} />
                </div>
            </main>
        </div>
    );
}
