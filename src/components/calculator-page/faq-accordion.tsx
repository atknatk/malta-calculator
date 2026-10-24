"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: string;
}

// Görünür SSS; aynı liste CustomFAQJsonLd'ye de verilir. Cevaplar kapalıyken de DOM'da (SEO)
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = React.useState(-1);
  const baseId = React.useId();

  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${baseId}-${index}`;
        return (
          <div key={item.question} className={cn(index > 0 && "border-t")}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : index)}
                className="flex min-h-[60px] w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-[15px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring md:px-5 md:text-base"
              >
                {item.question}
                <ChevronDown
                  className={cn(
                    "h-[18px] w-[18px] shrink-0 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <p
              id={panelId}
              hidden={!isOpen}
              className="px-4 pb-[18px] text-[15px] leading-relaxed text-muted-foreground md:px-5"
            >
              {item.answer}
            </p>
          </div>
        );
      })}
    </div>
  );
}
