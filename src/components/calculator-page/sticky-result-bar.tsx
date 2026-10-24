"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface Props {
  /** Görünürken çubuğu gizleyen sonuç paneli */
  targetRef: React.RefObject<HTMLElement | null>;
  targetId: string;
  label: string;
  value: string;
  linkLabel?: string;
}

// Mobil: sonuç paneli ve footer ekranda değilken altta sabit sonuç
export function StickyResultBar({
  targetRef,
  targetId,
  label,
  value,
  linkLabel = "Details",
}: Props) {
  const [hidden, setHidden] = React.useState(true);

  React.useEffect(() => {
    const targets = [
      targetRef.current,
      document.querySelector("footer"),
    ].filter((el): el is HTMLElement => el instanceof HTMLElement);
    if (targets.length === 0) return;
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setHidden(visible.size > 0);
    });
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [targetRef]);

  return (
    <div
      aria-hidden={hidden}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t bg-card/90 px-4 pb-5 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-transform duration-200 md:hidden",
        hidden && "pointer-events-none translate-y-full",
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xl font-bold leading-[1.3] tabular-nums">
          {value}
        </span>
      </div>
      <a
        href={`#${targetId}`}
        tabIndex={hidden ? -1 : undefined}
        className="inline-flex h-11 shrink-0 items-center rounded-[10px] border border-field bg-card px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {linkLabel}
      </a>
    </div>
  );
}
