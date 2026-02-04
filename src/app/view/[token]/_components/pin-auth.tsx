"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PinAuthProps {
  payslipId: string;
  employeeName: string;
  token: string;
}

export default function PinAuth({
  payslipId,
  employeeName,
  token,
}: PinAuthProps) {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/employee/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payslipId, pin }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the page to show the payslip
        router.refresh();
      } else {
        setError(data.error || "Invalid PIN");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-800">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
            <svg
              className="h-8 w-8 text-amber-600 dark:text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Verify Your Identity
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Hi {employeeName}, please enter your PIN to view your payslip.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              PIN (Date of Birth: DDMMYYYY)
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={8}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              placeholder="e.g. 15031990"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-center text-lg tracking-widest text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
            <p className="mt-1 text-xs text-slate-500">
              Enter your date of birth as DDMMYYYY (e.g., 15th March 1990 =
              15031990)
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || pin.length < 8}
            className="w-full rounded-lg bg-amber-600 px-4 py-3 font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Verifying..." : "View Payslip"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          This link was sent to you by your employer. If you didn&apos;t request
          this, please contact them.
        </p>
      </div>
    </div>
  );
}
