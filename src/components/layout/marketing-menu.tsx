"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { marketingPagesConfig } from "@/config/pages";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { BrandName } from "./brand-name";
import { DarkThemeSwitch } from "../theme-toggle";

/** Ana sayfa maaş hesaplayıcısı olduğu için "/" de Salary'yi aktif sayar */
export function isMarketingPageActive(pathname: string, href: string): boolean {
  if (href === "/salary" && pathname === "/") return true;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function externalLinkProps(href: string) {
  return href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {};
}

const menuButtonClass = "h-11 w-11 rounded-[10px] bg-card";

/** Tablet (md–lg): sağ üstte açılan açılır menü */
export function MarketingTabletMenu() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className={menuButtonClass}
          aria-label="Menu"
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[300px] rounded-2xl bg-card p-2 shadow-[var(--shadow-elevation)]"
      >
        <nav aria-label="Main" className="flex flex-col">
          {marketingPagesConfig.map(({ href, title }) => {
            const isActive = isMarketingPageActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex h-12 items-center rounded-[10px] px-3.5 text-[15px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "bg-primary/10 font-semibold text-primary-ink"
                    : "font-medium text-foreground hover:bg-accent",
                )}
                {...externalLinkProps(href)}
              >
                {title}
              </Link>
            );
          })}
          <div className="mx-1.5 my-2 h-px bg-border" />
          <SignedOut>
            <Link
              href="/sign-in"
              onClick={() => setOpen(false)}
              className="flex h-12 items-center rounded-[10px] px-3.5 text-[15px] font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Sign In
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex h-12 items-center rounded-[10px] px-3.5 text-[15px] font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Dashboard
            </Link>
          </SignedIn>
        </nav>
      </PopoverContent>
    </Popover>
  );
}

/** Mobil (< md): tam ekran menü */
export function MarketingMenu() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className={menuButtonClass}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="top"
        hideClose
        aria-describedby={undefined}
        className="flex h-dvh flex-col gap-0 overflow-y-auto border-0 px-4 pb-6 pt-0"
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <div className="flex h-[60px] shrink-0 items-center justify-between">
          <BrandName />
          <SheetClose asChild>
            <Button
              size="icon"
              variant="outline"
              className={menuButtonClass}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Button>
          </SheetClose>
        </div>
        <nav aria-label="Main" className="mt-4 flex flex-col">
          {marketingPagesConfig.map(({ href, title }) => {
            const isActive = isMarketingPageActive(pathname, href);
            return (
              <SheetClose asChild key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex h-14 items-center border-b font-cal text-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive ? "text-primary" : "text-foreground",
                  )}
                  {...externalLinkProps(href)}
                >
                  {title}
                </Link>
              </SheetClose>
            );
          })}
        </nav>
        <DarkThemeSwitch className="mt-4" />
        <div className="mt-auto flex flex-col gap-2.5 pt-6">
          <SignedOut>
            <Button
              variant="outline"
              className="h-[52px] rounded-[10px] bg-card text-base font-semibold"
              asChild
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button
              className="h-[52px] rounded-[10px] text-base font-semibold"
              asChild
            >
              <Link href="/sign-up">Start Free</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="h-[52px] flex-1 rounded-[10px] bg-card text-base font-semibold"
                asChild
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </SheetContent>
    </Sheet>
  );
}
