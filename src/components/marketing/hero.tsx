"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowDown, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Delay slightly to ensure hydration is complete
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-[85vh] flex w-full flex-col items-center justify-center gap-8 px-4 py-16 text-center overflow-hidden">
      {/* Animated Floating Orbs - Always visible */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-gold w-[400px] h-[400px] -top-20 -left-20 animate-orb" />
        <div className="orb orb-blue w-[350px] h-[350px] top-1/4 -right-20 animate-orb-delayed" />
        <div className="orb orb-coral w-[300px] h-[300px] bottom-20 left-1/4 animate-orb-slow" />
        <div className="orb orb-gold w-[250px] h-[250px] bottom-0 right-1/3 animate-orb" />
      </div>

      {/* Content */}
      <div className={cn(
        "relative z-10 flex flex-col items-center gap-8 max-w-4xl transition-all duration-700",
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          <span>Malta&apos;s #1 Salary Calculator</span>
        </div>

        {/* Main Title */}
        <h1
          className={cn(
            "font-cal text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight",
            "text-gradient leading-tight"
          )}
        >
          Calculate Your
          <br />
          <span className="text-foreground">Malta Salary</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
          A comprehensive calculation app that supports you at every stage of your
          professional life. Get accurate <span className="text-primary font-semibold">tax deductions</span>,
          <span className="text-secondary font-semibold"> SSC contributions</span>, and
          <span className="text-primary font-semibold"> net salary</span> calculations instantly.
        </p>

        {/* CTA Buttons */}
        <div className={cn(
          "flex flex-col sm:flex-row gap-4 mt-4 transition-all duration-700 delay-200",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <Link
            href="/salary"
            className="btn-glow inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-lg transition-all"
          >
            Calculate Now
            <ArrowDown className="h-5 w-5 animate-bounce" />
          </Link>

          <Link
            href="#calculators"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl glass hover:bg-white/50 dark:hover:bg-white/10 font-semibold text-lg transition-all border border-border/50"
          >
            Explore Tools
          </Link>
        </div>

        {/* Stats */}
        <div className={cn(
          "grid grid-cols-3 gap-8 mt-8 pt-8 border-t border-border/30 transition-all duration-700 delay-300",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gradient">2024-26</div>
            <div className="text-sm text-muted-foreground mt-1">Tax Years</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gradient-secondary">100%</div>
            <div className="text-sm text-muted-foreground mt-1">Accurate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gradient">Free</div>
            <div className="text-sm text-muted-foreground mt-1">Forever</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={cn(
        "absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator text-muted-foreground text-sm transition-all duration-700 delay-500",
        isLoaded ? "opacity-100" : "opacity-0"
      )}>
        <span>Scroll to explore</span>
      </div>
    </div>
  );
}
