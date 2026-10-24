"use client";

import { useCallback, useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  url: string;
  title: string;
  className?: string;
}

// BlogShareButtons ile aynı paylaşım adresleri; tasarımdaki hap düğmeler
export function GuideShare({ url, title, className }: Props) {
  const [copied, setCopied] = useState(false);
  const shareText = `${title} - Malta Calculator`;

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  }, [url]);

  const open = (href: string, popup = true) =>
    window.open(
      href,
      "_blank",
      popup
        ? "noopener,noreferrer,width=600,height=400"
        : "noopener,noreferrer",
    );

  const targets = [
    {
      label: "WhatsApp",
      onClick: () =>
        open(
          `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`,
          false,
        ),
    },
    {
      label: "Facebook",
      onClick: () =>
        open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        ),
    },
    {
      label: "X",
      onClick: () =>
        open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
        ),
    },
    {
      label: "LinkedIn",
      onClick: () =>
        open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        ),
    },
  ];

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-11 items-center gap-1.5 rounded-full border border-field bg-card px-3.5 text-sm font-semibold transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:h-9 lg:px-3 lg:text-[13px]"
      >
        {copied ? (
          <Check className="h-4 w-4 text-success" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" aria-hidden="true" />
        )}
        <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
      </button>
      {targets.map((target) => (
        <button
          key={target.label}
          type="button"
          onClick={target.onClick}
          aria-label={`Share on ${target.label}`}
          className="inline-flex h-11 items-center rounded-full bg-muted px-3.5 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:h-9 lg:px-3 lg:text-[13px]"
        >
          {target.label}
        </button>
      ))}
    </div>
  );
}
