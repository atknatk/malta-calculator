import { ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFingerprint } from "@/lib/payslip/snapshot";
import type { PayslipIntegrity } from "@/lib/payslip/document-props";

interface PayslipIntegrityNoticeProps {
  integrity: PayslipIntegrity;
  contentHash?: string | null;
  className?: string;
}

/** Yayınlanmış bordronun kilit / parmak izi durumu */
export default function PayslipIntegrityNotice({
  integrity,
  contentHash,
  className,
}: PayslipIntegrityNoticeProps) {
  if (integrity === "draft") return null;

  const config = {
    verified: {
      icon: ShieldCheck,
      tone: "border-emerald-200 bg-emerald-50 text-emerald-900",
      iconTone: "text-emerald-600",
      title: "Locked & unaltered",
      body: "This payslip was frozen when it was issued. Its content matches the original fingerprint.",
    },
    mismatch: {
      icon: ShieldAlert,
      tone: "border-red-200 bg-red-50 text-red-900",
      iconTone: "text-red-600",
      title: "Integrity check failed",
      body: "The stored content no longer matches the fingerprint taken at issue. Do not rely on this copy and contact the employer.",
    },
    legacy: {
      icon: ShieldQuestion,
      tone: "border-slate-200 bg-slate-50 text-slate-800",
      iconTone: "text-slate-500",
      title: "Issued before locking was introduced",
      body: "This payslip has no fingerprint yet and is shown from current records.",
    },
  }[integrity];

  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-3 text-sm",
        config.tone,
        className,
      )}
    >
      <Icon className={cn("mt-0.5 h-5 w-5 flex-shrink-0", config.iconTone)} />
      <div>
        <p className="font-semibold">{config.title}</p>
        <p className="opacity-90">{config.body}</p>
        {contentHash && integrity !== "legacy" && (
          <p className="mt-1 font-mono text-xs opacity-80">
            Fingerprint (SHA-256): {formatFingerprint(contentHash)}…
          </p>
        )}
      </div>
    </div>
  );
}
