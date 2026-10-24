"use client";

import { ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

interface Props {
  title: string;
  children: React.ReactNode;
}

// Mobilde akordeon, md+ her zaman açık sütun. Linkler kapalıyken de DOM'da kalır (SEO)
export function FooterLinkGroup({ title, children }: Props) {
  const [open, setOpen] = React.useState(false);
  const listId = React.useId();

  return (
    <div className="border-t md:border-t-0">
      <h3 className="text-[15px] font-semibold md:mb-1 md:text-sm lg:mb-0.5">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((value) => !value)}
          className="flex h-[52px] w-full items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
        >
          {title}
          <ChevronDown
            className={cn(
              "h-[18px] w-[18px] text-muted-foreground transition-transform duration-200",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>
        <span className="hidden md:inline">{title}</span>
      </h3>
      <nav
        id={listId}
        aria-label={title}
        className={cn(
          "grid-cols-2 gap-x-3 pb-2 md:flex md:flex-col md:pb-0 lg:gap-2.5",
          open ? "grid" : "hidden",
        )}
      >
        {children}
      </nav>
    </div>
  );
}
