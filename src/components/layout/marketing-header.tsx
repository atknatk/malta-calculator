"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { marketingPagesConfig, type Page } from "@/config/pages";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ThemeIconToggle } from "../theme-toggle";
import { BrandName } from "./brand-name";
import {
  MarketingMenu,
  MarketingTabletMenu,
  externalLinkProps,
  isMarketingPageActive,
} from "./marketing-menu";

interface Props {
  className?: string;
}

// Mobil < md: marka + tam ekran menü; tablet md–lg: tema, Start Free, açılır menü; masaüstü lg+: pill nav
export function MarketingHeader({ className }: Props) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "flex h-[60px] w-full items-center justify-between gap-4 md:h-[72px] lg:h-20",
        className,
      )}
    >
      <BrandName />
      <nav
        aria-label="Main"
        className="hidden items-center gap-1 rounded-full border border-primary/15 bg-[var(--glass-bg)] p-1 shadow-sm backdrop-blur-[20px] lg:flex"
      >
        {marketingPagesConfig.map(({ href, title, shortTitle }: Page) => {
          const isActive = isMarketingPageActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "rounded-full px-[18px] py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isActive
                  ? "bg-primary/10 font-semibold text-primary-ink"
                  : "font-medium text-muted-foreground hover:text-primary",
              )}
              {...externalLinkProps(href)}
            >
              {shortTitle ?? title}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-2">
        {/* Masaüstü */}
        <div className="hidden items-center gap-2 lg:flex">
          <ThemeIconToggle />
          <SignedOut>
            <Button
              variant="ghost"
              className="rounded-[10px] px-3.5 hover:text-primary"
              asChild
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button className="rounded-[10px] px-[18px] font-semibold" asChild>
              <Link href="/sign-up">Start Free</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button
              variant="ghost"
              className="rounded-[10px] px-3.5 hover:text-primary"
              asChild
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
        {/* Tablet */}
        <div className="hidden items-center gap-2 md:flex lg:hidden">
          <ThemeIconToggle className="h-11 w-11" />
          <SignedOut>
            <Button
              className="h-11 rounded-[10px] px-[18px] font-semibold"
              asChild
            >
              <Link href="/sign-up">Start Free</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <MarketingTabletMenu />
        </div>
        {/* Mobil */}
        <div className="md:hidden">
          <MarketingMenu />
        </div>
      </div>
    </header>
  );
}
