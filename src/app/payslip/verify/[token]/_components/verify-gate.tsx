"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import TurnstileWidget, {
  TURNSTILE_SITE_KEY,
} from "@/components/turnstile-widget";

interface VerifyGateProps {
  token: string;
  companyName: string;
  period: string;
}

/** QR doğrulama: captcha geçilince tam bordro gösterilir */
export default function VerifyGate({
  token,
  companyName,
  period,
}: VerifyGateProps) {
  const router = useRouter();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const captchaReady = !TURNSTILE_SITE_KEY || Boolean(captchaToken);

  const handleContinue = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/payslip/verify-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, captchaToken }),
      });
      const data = await response.json();
      if (data.success) {
        router.refresh();
        return;
      }
      setError(data.error || "Verification failed");
      setCaptchaResetKey((k) => k + 1);
    } catch {
      setError("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <ShieldCheck className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Verify Payslip</h1>
        <p className="mt-2 text-sm text-slate-600">
          A payslip issued by <strong>{companyName}</strong> for{" "}
          <strong>{period}</strong> was found. Complete the security check to
          view the full original document.
        </p>

        <div className="mt-6 space-y-4">
          <TurnstileWidget
            action="payslip-verify"
            onToken={setCaptchaToken}
            resetKey={captchaResetKey}
          />

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            onClick={handleContinue}
            disabled={loading || !captchaReady}
            className="w-full rounded-lg bg-amber-600 px-4 py-3 font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Verifying..." : "View Payslip"}
          </button>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Payslip details are confidential. Only view this payslip if you
          were given it by the employee or employer for verification.
        </p>
      </div>
    </div>
  );
}
