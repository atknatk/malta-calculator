"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

import { marketingPagesConfig } from "@/config/pages";
import { socialsConfig } from "@/config/socials";
import { Button } from "../ui/button";
import { AppLink } from "./app-link";
import { SocialIconButton } from "./social-icon-button";

export function MarketingMenu() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setOpen(false);
  }, []); // remove searchParams if not needed

  return (
    <Sheet open={open} onOpenChange={(value) => setOpen(value)}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full"
          aria-label="menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="ml-2 text-left">Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col justify-between gap-4">
          <ul className="grid gap-1">
            {/* biome-ignore lint/correctness/noUnusedVariables: <explanation> */}
            {marketingPagesConfig.map(({ href, title, segment }) => {
              const isExternal = href.startsWith("http");
              const externalProps = isExternal ? { target: "_blank" } : {};
              const isActive = pathname.startsWith(href);
              return (
                <li key={href} className="w-full">
                  <AppLink
                    href={href}
                    label={title}
                    active={isActive}
                    {...externalProps}
                  />
                </li>
              );
            })}
          </ul>
          <div className="flex flex-col gap-3">
            <SignedOut>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700"
                  asChild
                >
                  <Link href="/sign-up">Start Free</Link>
                </Button>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center justify-between">
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            <div className="flex justify-between gap-2">
              <ul className="flex flex-wrap gap-2">
                {socialsConfig.map((props, _i) => (
                  <li key={props.title}>
                    <SocialIconButton {...props} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
