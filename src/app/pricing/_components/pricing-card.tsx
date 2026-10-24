"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  plan: "free" | "basic" | "pro";
  name: string;
  price: number;
  features: string[];
  isLoggedIn: boolean;
  isCurrent: boolean;
  isPopular?: boolean;
  /** "Up to 10 employees · 10 payslips a month" */
  limit: string;
  /** Ekip sayısı yardımcısına göre önerilen plan */
  fits?: boolean;
}

export default function PricingCard({
  plan,
  name,
  price,
  features,
  isLoggedIn,
  isCurrent,
  isPopular = false,
  limit,
  fits = false,
}: PricingCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (plan === "free") {
      router.push("/sign-up");
      return;
    }

    if (!isLoggedIn) {
      router.push("/sign-in?redirect_url=/pricing");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
        setLoading(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setLoading(false);
    }
  };

  const priceLabel =
    price > 0
      ? `€${price.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : "€0";

  return (
    <article
      aria-label={`${name} plan${fits ? ", fits your team" : ""}`}
      className={cn(
        "relative flex flex-col gap-5 rounded-3xl border bg-card px-5 pb-[22px] pt-7 transition-[border-color,box-shadow] md:px-6 lg:px-7 lg:pb-7 lg:pt-8",
        fits
          ? "border-primary shadow-[0_0_0_1px_hsl(var(--primary)),var(--shadow-elevation)]"
          : isPopular
            ? "border-primary/40 shadow-[var(--shadow-elevation)]"
            : "",
      )}
    >
      {isPopular ? (
        <span className="absolute -top-[13px] left-1/2 inline-flex h-[26px] -translate-x-1/2 items-center whitespace-nowrap rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground">
          Most Popular
        </span>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <h2 className="font-cal text-2xl leading-[1.2]">{name}</h2>
        {fits ? (
          <span className="inline-flex h-[26px] items-center gap-1.5 rounded-full bg-success/10 px-2.5 text-xs font-semibold text-success-ink">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            Fits your team
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="flex items-baseline gap-1.5">
          <span className="text-[44px] font-bold leading-none tracking-[-0.02em] tabular-nums lg:text-5xl">
            {priceLabel}
          </span>
          {price > 0 ? (
            <span className="text-base text-muted-foreground">/month</span>
          ) : null}
        </span>
        <span className="text-sm text-muted-foreground">{limit}</span>
      </div>

      <button
        onClick={handleUpgrade}
        disabled={loading || isCurrent}
        className={cn(
          "flex h-12 items-center justify-center rounded-xl border text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
          isPopular
            ? "border-transparent bg-primary text-primary-foreground hover:bg-primary/90"
            : plan === "free"
              ? "border-field bg-card text-foreground hover:bg-accent"
              : "border-transparent bg-foreground text-background hover:bg-foreground/90",
        )}
      >
        {loading
          ? "Loading..."
          : isCurrent
            ? "Current Plan"
            : plan === "free"
              ? "Get Started Free"
              : `Upgrade to ${name}`}
      </button>

      <ul className="flex flex-col gap-3 border-t pt-5">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-[15px] leading-[1.45]"
          >
            <Check
              className="mt-0.5 h-[18px] w-[18px] shrink-0 text-success"
              aria-hidden="true"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
