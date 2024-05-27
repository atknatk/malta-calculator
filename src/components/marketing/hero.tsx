import Link from "next/link";


import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <div className="my-10 flex w-full flex-col justify-center gap-1 px-3 py-4 text-center md:my-20 md:p-6">
      <div className="flex flex-col gap-6">
        <h1
          className={cn(
            "font-cal text-4xl text-foreground md:text-6xl",
            "bg-gradient-to-tl from-0% from-[hsl(var(--muted))] to-40% to-[hsl(var(--foreground))] bg-clip-text text-transparent",
          )}
        >
          A better way to calculate your services.
        </h1>
        <p className="mx-auto max-w-md text-lg text-muted-foreground md:max-w-xl md:text-xl">
        A comprehensive calculation app that supports you at every stage of your professional life,
         ensuring accurate calculations and simplifying your work processes for greater efficiency 
         and peace of mind!
        </p>
      </div>
     
    </div>
  );
}




