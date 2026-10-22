"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { MdCard, mdButton } from "./admin-ui";

// Yönetim sayfalarındaki beklenmeyen hatalar için error boundary
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): JSX.Element {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <MdCard className="mx-auto mt-8 max-w-lg p-8 text-center">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-md-error-container text-md-on-error-container">
        <AlertTriangle className="size-7" />
      </div>
      <h1 className="text-xl font-medium text-md-on-surface">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-md-on-surface-variant">
        We couldn&apos;t load this page. Your data is safe. Please try again in
        a moment.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-md-on-surface-variant/70">
          Reference: {error.digest}
        </p>
      )}
      <div className="mt-6 flex justify-center gap-2">
        <button onClick={reset} className={mdButton()}>
          <RotateCcw />
          Try again
        </button>
        <Link href="/dashboard" className={mdButton({ variant: "outlined" })}>
          Back to overview
        </Link>
      </div>
    </MdCard>
  );
}
