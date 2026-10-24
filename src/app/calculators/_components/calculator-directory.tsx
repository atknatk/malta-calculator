"use client";

import Link from "next/link";
import * as React from "react";
import {
  Baby,
  Briefcase,
  Calculator,
  Calendar,
  Car,
  ChevronRight,
  Home,
  Landmark,
  Palmtree,
  Search,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface DirectoryItem {
  href: string;
  title: string;
  tagline: string;
}

export interface DirectoryGroup {
  title: string;
  items: DirectoryItem[];
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Employment & Salary": Briefcase,
  "Family & Children": Baby,
  "Property & Housing": Home,
  "Banking & Loans": Landmark,
  "Retirement & Savings": Palmtree,
  "Self-Employment": Calculator,
  "Leave & Time Off": Calendar,
  "Transport & Vehicles": Car,
  "Immigration & Visa": Users,
};

const ALL = "all";

const plural = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`;

function MissingCalculator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-2xl border bg-card p-[18px] lg:rounded-[14px] lg:p-4",
        className,
      )}
    >
      <span className="text-[15px] font-semibold lg:text-sm">
        Missing a calculator?
      </span>
      <span className="text-sm text-muted-foreground lg:text-[13px]">
        Tell us what you need and we will look at adding it.
      </span>
      <Link
        href="/contact"
        className="mt-1 text-sm font-semibold text-primary-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Contact us →
      </Link>
    </div>
  );
}

// Arama ve kategori filtresi istemcide; ilk HTML'de tüm hesaplayıcılar listelenir (SEO)
export function CalculatorDirectory({ groups }: { groups: DirectoryGroup[] }) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState(ALL);

  const total = groups.reduce((sum, g) => sum + g.items.length, 0);
  const q = query.trim().toLowerCase();

  const visible = groups
    .filter((g) => category === ALL || g.title === category)
    .map((g) => ({
      ...g,
      items: g.items.filter(
        (item) =>
          !q ||
          `${item.title} ${item.tagline} ${g.title}`.toLowerCase().includes(q),
      ),
    }))
    .filter((g) => g.items.length > 0);
  const shown = visible.reduce((sum, g) => sum + g.items.length, 0);

  let resultLine = `${total} calculators in ${groups.length} categories`;
  if (category !== ALL)
    resultLine = `${plural(shown, "calculator", "calculators")} in ${category}`;
  if (q)
    resultLine = `${plural(shown, "result", "results")} for “${query.trim()}”${category !== ALL ? ` in ${category}` : ""}`;

  const options = [
    { id: ALL, label: "All calculators", count: total },
    ...groups.map((g) => ({
      id: g.title,
      label: g.title,
      count: g.items.length,
    })),
  ];

  return (
    <section className="mt-5 grid w-full items-start gap-5 md:mt-6 lg:mt-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
      {/* Masaüstü: sticky kategori menüsü */}
      <nav
        aria-label="Categories"
        className="sticky top-6 hidden flex-col gap-0.5 lg:flex"
      >
        <span className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">
          Categories
        </span>
        {options.map((option) => {
          const isActive = option.id === category;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setCategory(option.id)}
              className={cn(
                "flex h-10 items-center justify-between gap-3 rounded-[10px] px-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-primary/10 font-semibold text-primary-ink"
                  : "font-medium text-foreground hover:bg-accent",
              )}
            >
              <span>{option.label}</span>
              <span className="text-[13px] font-medium tabular-nums text-muted-foreground">
                {option.count}
              </span>
            </button>
          );
        })}
        <MissingCalculator className="mt-5" />
      </nav>

      <div className="flex min-w-0 flex-col gap-5 md:gap-6 lg:gap-7">
        <div className="flex flex-col gap-3 md:gap-3.5 lg:gap-3">
          <div className="flex h-[52px] items-center gap-2.5 rounded-[14px] border border-field bg-card px-3.5 shadow-sm transition-[border-color,box-shadow] focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/20 md:h-14 md:gap-3 md:px-4">
            <Search
              className="h-5 w-5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              aria-label="Search calculators"
              placeholder="Search calculators, e.g. stamp duty"
              autoComplete="off"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-full min-w-0 flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground/80 focus:outline-none md:text-[17px] [&::-webkit-search-cancel-button]:hidden"
            />
            {query ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="-mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:mr-0 md:h-10 md:w-10 md:bg-muted lg:h-9 lg:w-9"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>

          {/* Tablet ve mobil: yatay kaydırılan kategori çipleri */}
          <div
            role="group"
            aria-label="Categories"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:-mx-8 md:px-8 lg:hidden"
          >
            {options.map((option) => {
              const isActive = option.id === category;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setCategory(option.id)}
                  className={cn(
                    "inline-flex h-11 flex-none items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:gap-2 md:px-4",
                    isActive
                      ? "border-primary bg-primary font-semibold text-primary-foreground"
                      : "border-field bg-card font-medium text-foreground hover:bg-accent",
                  )}
                >
                  {option.label}
                  <span className="text-[13px] tabular-nums">
                    {option.count}
                  </span>
                </button>
              );
            })}
          </div>

          <p aria-live="polite" className="text-sm text-muted-foreground">
            {resultLine}
          </p>
        </div>

        {shown === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-field px-5 py-8 text-center md:gap-2.5 md:px-6 md:py-10 lg:py-12">
            <span className="font-cal text-xl md:text-[22px]">
              No calculators match your search
            </span>
            <span className="text-[15px] text-muted-foreground">
              Try a shorter word, or browse every category.
            </span>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory(ALL);
              }}
              className="mt-1.5 h-12 rounded-[10px] border border-field bg-card px-[18px] text-[15px] font-semibold transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-11 md:text-sm"
            >
              Show all calculators
            </button>
          </div>
        ) : null}

        <div className="flex flex-col gap-7 md:gap-8 lg:gap-7">
          {visible.map((group) => {
            const Icon = CATEGORY_ICONS[group.title] ?? Calculator;
            return (
              <section
                key={group.title}
                className="flex flex-col gap-3 md:gap-3.5"
              >
                <div className="flex items-center gap-2.5 md:gap-3">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary/10 text-primary-ink md:h-10 md:w-10 md:rounded-xl"
                  >
                    <Icon className="h-[18px] w-[18px] md:h-5 md:w-5" />
                  </span>
                  <h2 className="min-w-0 flex-1 font-cal text-xl leading-[1.3] md:flex-none md:text-[22px]">
                    {group.title}
                  </h2>
                  <span className="shrink-0 text-[13px] tabular-nums text-muted-foreground md:text-sm">
                    <span className="md:hidden">{group.items.length}</span>
                    <span className="hidden md:inline">
                      {plural(group.items.length, "calculator", "calculators")}
                    </span>
                  </span>
                </div>

                {/* Mobil: tek kart içinde satırlar; tablet 2, masaüstü 3 sütun kart */}
                <div className="overflow-hidden rounded-2xl border bg-card md:grid md:grid-cols-2 md:gap-3 md:overflow-visible md:rounded-none md:border-0 md:bg-transparent lg:grid-cols-3 lg:gap-3.5">
                  {group.items.map((item, index) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex min-h-16 items-center justify-between gap-3 px-4 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                        "md:items-start md:rounded-2xl md:border md:bg-card md:p-4 md:transition-[border-color,transform] md:duration-200 md:hover:-translate-y-0.5 md:hover:border-primary lg:px-[18px]",
                        index > 0 && "border-t md:border-t",
                      )}
                    >
                      <span className="flex min-w-0 flex-col gap-0.5 md:gap-1">
                        <span className="text-base font-semibold leading-[1.35]">
                          {item.title}
                        </span>
                        <span className="text-sm leading-[1.4] text-muted-foreground md:leading-[1.45]">
                          {item.tagline}
                        </span>
                      </span>
                      <ChevronRight
                        className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 md:mt-1"
                        aria-hidden="true"
                      />
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <MissingCalculator className="lg:hidden" />
      </div>
    </section>
  );
}
