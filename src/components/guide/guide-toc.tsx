"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TocSection {
  id: string;
  label: string;
}

// Ekranın üst üçte birine giren son bölümü aktif sayar
function useActiveSection(ids: string[]): string {
  const [active, setActive] = React.useState(ids[0] ?? "");

  React.useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (elements.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "0px 0px -66% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

function TocLinks({
  sections,
  active,
  onPick,
}: {
  sections: TocSection[];
  active: string;
  onPick?: () => void;
}) {
  return (
    <>
      {sections.map((section) => {
        const isActive = section.id === active;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={isActive ? "location" : undefined}
            onClick={onPick}
            className={cn(
              "flex min-h-11 items-center rounded-lg border-l-2 px-2.5 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:min-h-9",
              isActive
                ? "border-primary bg-primary/[0.08] font-semibold text-primary-ink"
                : "border-transparent font-medium text-muted-foreground hover:text-foreground",
            )}
          >
            {section.label}
          </a>
        );
      })}
    </>
  );
}

/** Masaüstü yan menü */
export function GuideTocSidebar({ sections }: { sections: TocSection[] }) {
  const ids = React.useMemo(() => sections.map((s) => s.id), [sections]);
  const active = useActiveSection(ids);
  return (
    <nav
      aria-label="On this page"
      className="flex flex-col gap-0.5 rounded-2xl border bg-card p-5"
    >
      <span className="px-2.5 pb-2 text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">
        On this page
      </span>
      <TocLinks sections={sections} active={active} />
    </nav>
  );
}

/** Tablet ve mobil: açılır "On this page" */
export function GuideTocCollapsible({ sections }: { sections: TocSection[] }) {
  const ids = React.useMemo(() => sections.map((s) => s.id), [sections]);
  const active = useActiveSection(ids);
  const [open, setOpen] = React.useState(false);
  const panelId = React.useId();

  return (
    <nav
      aria-label="On this page"
      className="overflow-hidden rounded-2xl border bg-card"
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex h-[52px] w-full items-center justify-between px-4 text-left text-[15px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring md:px-[18px]"
      >
        On this page
        <ChevronDown
          className={cn(
            "h-[18px] w-[18px] text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="flex flex-col gap-0.5 border-t px-2 py-2"
      >
        <TocLinks
          sections={sections}
          active={active}
          onPick={() => setOpen(false)}
        />
      </div>
    </nav>
  );
}
