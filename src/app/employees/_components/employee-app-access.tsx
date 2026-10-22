"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  inviteEmployeeToApp,
  revokeEmployeeAppAccess,
  type EmployeeAppStatus,
} from "@/app/actions/employee-app-actions";
import { mdButton } from "@/components/admin/admin-ui";

const dialogClass =
  "max-h-[90vh] max-w-md overflow-y-auto rounded-[28px] border-0 bg-md-surface-container-high p-6 text-md-on-surface sm:rounded-[28px]";

const STATUS_LABEL: Record<EmployeeAppStatus, string> = {
  linked: "Using the app",
  invited: "Invite sent",
  none: "Not invited",
};

interface EmployeeAppAccessProps {
  employeeId: string;
  employeeName: string;
  email: string | null;
  status: EmployeeAppStatus;
  /** Çalışan uygulaması Pro planda */
  planAllows: boolean;
}

export default function EmployeeAppAccess({
  employeeId,
  employeeName,
  email,
  status,
  planAllows,
}: EmployeeAppAccessProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<"invite" | "revoke" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInvite = async () => {
    setPending("invite");
    setError(null);
    const result = await inviteEmployeeToApp(employeeId);
    setPending(null);
    if (!result.success) {
      setError(result.error || "Could not send the invite");
      return;
    }
    toast.success(
      result.emailSent
        ? `Invite sent to ${email}`
        : `Invite created. Ask ${employeeName} to sign in to the app with ${email}.`,
    );
    setOpen(false);
    router.refresh();
  };

  const handleRevoke = async () => {
    setPending("revoke");
    setError(null);
    const result = await revokeEmployeeAppAccess(employeeId);
    setPending(null);
    if (!result.success) {
      setError(result.error || "Could not remove access");
      return;
    }
    toast.success(`App access removed for ${employeeName}`);
    setOpen(false);
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        aria-label={`Employee app: ${STATUS_LABEL[status]}`}
        title={`Employee app: ${STATUS_LABEL[status]}`}
        className={cn(
          "relative flex size-10 items-center justify-center rounded-full text-md-on-surface-variant transition hover:bg-md-on-surface/[0.08]",
          status === "linked" && "text-md-primary",
        )}
      >
        <Smartphone className="size-[18px]" />
        {status !== "none" && (
          <span
            className={cn(
              "absolute right-2 top-2 size-2 rounded-full",
              status === "linked" ? "bg-md-primary" : "bg-amber-500",
            )}
          />
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={dialogClass}>
          <DialogHeader>
            <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-md-primary-container text-md-on-primary-container">
              <Smartphone className="size-6" />
            </div>
            <DialogTitle className="text-2xl font-normal">
              Employee app
            </DialogTitle>
            <DialogDescription className="text-md-on-surface-variant">
              {employeeName} can see issued payslips on their phone and get a
              notification when a new one is issued.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl bg-md-surface-container px-4 py-3 text-sm">
            <p className="font-medium">{STATUS_LABEL[status]}</p>
            <p className="mt-0.5 text-md-on-surface-variant">
              {status === "linked" &&
                "Their account is linked. New payslips reach them automatically."}
              {status === "invited" &&
                `They can sign in to the app with ${email}. You can send the invite again.`}
              {status === "none" &&
                (email
                  ? `The invite goes to ${email}. They sign in to the app with that address.`
                  : "Add an email address to this employee to invite them.")}
            </p>
          </div>

          {!planAllows && status !== "linked" && (
            <p className="text-sm text-md-on-surface-variant">
              The employee app is part of the Pro plan.{" "}
              <Link href="/settings" className="text-md-primary underline">
                Upgrade in settings
              </Link>
            </p>
          )}

          {error && (
            <div
              role="alert"
              className="rounded-xl bg-md-error-container px-4 py-3 text-sm text-md-on-error-container"
            >
              {error}
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-2">
            {status !== "none" && (
              <button
                type="button"
                onClick={handleRevoke}
                disabled={pending !== null}
                className={`${mdButton({ variant: "text" })} !text-md-error`}
              >
                {pending === "revoke" && <Loader2 className="animate-spin" />}
                Remove access
              </button>
            )}
            {status !== "linked" && (
              <button
                type="button"
                onClick={handleInvite}
                disabled={pending !== null || !planAllows || !email}
                className={mdButton()}
              >
                {pending === "invite" && <Loader2 className="animate-spin" />}
                {status === "invited" ? "Resend invite" : "Send invite"}
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
