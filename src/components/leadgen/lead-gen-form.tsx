"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(1, "Required").max(120),
  email: z.string().email("Enter a valid email").max(200),
  phone: z.string().max(40).optional(),
  message: z.string().max(2000).optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please tick to continue" }),
  }),
  company: z.string().max(0).optional(), // honeypot
});

type FormValues = z.infer<typeof schema>;

interface LeadGenFormProps {
  purpose: string;
  cta: string;
  sourcePage?: string;
}

export function LeadGenForm({ purpose, cta, sourcePage }: LeadGenFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, purpose, sourcePage }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  };

  if (status === "ok") {
    return (
      <p className="text-sm text-foreground">
        Thanks — your request has been sent. A specialist may contact you soon.
      </p>
    );
  }

  const inputCls =
    "w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <input
            {...register("name")}
            placeholder="Your name"
            className={inputCls}
            aria-label="Your name"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className={inputCls}
            aria-label="Email"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>
      <input
        {...register("phone")}
        placeholder="Phone (optional)"
        className={inputCls}
        aria-label="Phone (optional)"
      />
      <textarea
        {...register("message")}
        placeholder="Anything we should know? (optional)"
        rows={2}
        className={inputCls}
        aria-label="Message (optional)"
      />

      {/* Honeypot — visually hidden, not for real users */}
      <input
        {...register("company")}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <label className="flex items-start gap-2 text-xs text-muted-foreground">
        <input type="checkbox" {...register("consent")} className="mt-0.5" />
        <span>
          I agree to be contacted about my enquiry and accept the{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            privacy policy
          </Link>
          .
        </span>
      </label>
      {errors.consent && (
        <p className="text-xs text-red-500">{errors.consent.message}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className={cn(
          "inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white",
          "hover:bg-primary/90 transition-colors disabled:opacity-60",
        )}
      >
        {status === "sending" ? "Sending…" : cta}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-500">
          Something went wrong. Please try again later.
        </p>
      )}
    </form>
  );
}
