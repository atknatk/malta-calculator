"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Calculator, Sparkles } from "lucide-react";

export function CompactHero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full py-6 md:py-10">
      {/* Animated Floating Orbs - Smaller for compact hero */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="orb orb-gold w-[300px] h-[300px] -top-20 -left-20 animate-orb" />
        <div className="orb orb-blue w-[250px] h-[250px] top-1/4 -right-20 animate-orb-delayed" />
        <div className="orb orb-coral w-[200px] h-[200px] bottom-20 left-1/4 animate-orb-slow" />
      </div>

      {/* Content */}
      <div
        className={cn(
          "relative z-10 flex flex-col items-center gap-4 md:gap-6 text-center transition-all duration-500",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        )}
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-primary/20 text-xs md:text-sm font-medium text-primary">
          <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
          <span>Malta&apos;s #1 Salary Calculator</span>
        </div>

        {/* Main Title - Compact for mobile */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
            <Calculator className="h-6 w-6 md:h-8 md:w-8 text-white" />
          </div>
          <div className="text-left">
            <h1
              className={cn(
                "font-cal text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight",
                "text-gradient leading-tight",
              )}
            >
              Salary Calculator
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-0.5">
              Calculate your Malta net salary instantly
            </p>
          </div>
        </div>

        {/* Stats - Horizontal compact */}
        <div
          className={cn(
            "flex items-center justify-center gap-4 md:gap-8 mt-2 transition-all duration-500 delay-200",
            isLoaded ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="flex items-center gap-2">
            <div className="text-lg md:text-xl font-bold text-gradient">
              2024-26
            </div>
            <div className="text-xs text-muted-foreground">Tax Years</div>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <div className="text-lg md:text-xl font-bold text-gradient-secondary">
              100%
            </div>
            <div className="text-xs text-muted-foreground">Accurate</div>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <div className="text-lg md:text-xl font-bold text-gradient">
              Free
            </div>
            <div className="text-xs text-muted-foreground">Forever</div>
          </div>
        </div>
      </div>
    </div>
  );
}
