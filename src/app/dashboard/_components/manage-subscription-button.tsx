"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { mdButton } from "@/components/admin/admin-ui";

export default function ManageSubscriptionButton({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No portal URL returned");
        toast.error("Couldn't open the billing portal. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Portal error:", error);
      toast.error("Couldn't open the billing portal. Please try again.");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleManageSubscription}
      disabled={loading}
      className={cn(
        compact
          ? "inline-flex items-center gap-1.5 text-sm font-semibold hover:underline disabled:opacity-50"
          : mdButton({ variant: "tonal" }),
      )}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <CreditCard className="size-4" />
      )}
      {loading ? "Opening portal…" : "Manage subscription"}
    </button>
  );
}
