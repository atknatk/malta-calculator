"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Copy, Check, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { SalarySearchParams } from "../search-params";

interface SalaryShareButtonsProps {
  monthlyNet: number;
  annualNet: number;
  calculatorParams: SalarySearchParams;
}

export function SalaryShareButtons({
  monthlyNet,
  annualNet,
  calculatorParams,
}: SalaryShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  // Cache: ayni params icin tekrar API cagirmamak
  const cachedUrlRef = useRef<{ params: string; url: string } | null>(null);

  const getShareText = () =>
    `My Malta net salary: €${Math.round(monthlyNet).toLocaleString()}/month (€${Math.round(annualNet).toLocaleString()}/year) - Calculate yours free:`;

  const generateShareUrl = useCallback(async (): Promise<string> => {
    const paramsKey = JSON.stringify(calculatorParams);

    // Cache hit - ayni parametreler icin tekrar istek atma
    if (cachedUrlRef.current?.params === paramsKey) {
      return cachedUrlRef.current.url;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/calculator/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ params: calculatorParams }),
      });

      if (!response.ok) throw new Error("Failed to generate share link");

      const data = await response.json();
      const fullUrl = `${window.location.origin}${data.shortUrl}`;
      cachedUrlRef.current = { params: paramsKey, url: fullUrl };
      return fullUrl;
    } catch {
      // Fallback: site URL (paramlar olmadan)
      toast.error("Failed to generate share link");
      return window.location.origin;
    } finally {
      setIsGenerating(false);
    }
  }, [calculatorParams]);

  const handleCopy = useCallback(async () => {
    try {
      const url = await generateShareUrl();
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  }, [generateShareUrl]);

  const handleFacebookShare = useCallback(async () => {
    const url = await generateShareUrl();
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer,width=600,height=400",
    );
  }, [generateShareUrl]);

  const handleTwitterShare = useCallback(async () => {
    const url = await generateShareUrl();
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer,width=600,height=400",
    );
  }, [generateShareUrl, monthlyNet, annualNet]);

  const handleLinkedInShare = useCallback(async () => {
    const url = await generateShareUrl();
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer,width=600,height=400",
    );
  }, [generateShareUrl]);

  const handleWhatsAppShare = useCallback(async () => {
    const url = await generateShareUrl();
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${getShareText()} ${url}`)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }, [generateShareUrl, monthlyNet, annualNet]);

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        const url = await generateShareUrl();
        await navigator.share({
          title: "Malta Salary Calculator",
          text: getShareText(),
          url,
        });
      } catch {
        // User cancelled
      }
    }
  }, [generateShareUrl, monthlyNet, annualNet]);

  // navigator.share yalnızca istemcide bilinir; hidrasyon farkı olmasın diye mount sonrası
  const [hasNativeShare, setHasNativeShare] = useState(false);
  useEffect(() => setHasNativeShare(!!navigator.share), []);
  const [targetsOpen, setTargetsOpen] = useState(false);

  const targets = [
    { label: "WhatsApp", onClick: handleWhatsAppShare },
    { label: "Facebook", onClick: handleFacebookShare },
    { label: "X", onClick: handleTwitterShare },
    { label: "LinkedIn", onClick: handleLinkedInShare },
    ...(hasNativeShare ? [{ label: "More…", onClick: handleNativeShare }] : []),
  ];

  const buttonClass =
    "inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-[10px] border border-field bg-card text-[15px] font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 md:h-11 md:text-sm";

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCopy}
          disabled={isGenerating}
          className={buttonClass}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : copied ? (
            <Check className="h-4 w-4 text-success" aria-hidden="true" />
          ) : (
            <Copy className="h-4 w-4" aria-hidden="true" />
          )}
          <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
        </button>
        <button
          type="button"
          aria-expanded={targetsOpen}
          onClick={() => setTargetsOpen((open) => !open)}
          className={buttonClass}
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
          Share
        </button>
      </div>
      {targetsOpen ? (
        <div
          role="group"
          aria-label="Share on"
          className={cn("grid grid-cols-2 gap-1.5 md:grid-cols-3")}
        >
          {targets.map((target) => (
            <button
              key={target.label}
              type="button"
              onClick={target.onClick}
              className="h-11 rounded-[10px] bg-muted text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-10 md:text-[13px]"
            >
              {target.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
