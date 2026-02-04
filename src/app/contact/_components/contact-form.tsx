"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Mail,
  User,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

interface FormState {
  success: boolean;
  message: string;
  errors?: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };
}

const WEB3FORMS_ACCESS_KEY = "9e01b73b-a474-4764-ae51-b1743c17eab4";

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function ContactForm() {
  const [state, setState] = useState<FormState | null>(null);
  const [isPending, setIsPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setState(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const honeypot = formData.get("botcheck") as string;

    // Honeypot check - bot protection
    if (honeypot) {
      setState({
        success: true,
        message: "Thank you for your message! We'll get back to you soon.",
      });
      setIsPending(false);
      return;
    }

    // Validate required fields
    const errors: FormState["errors"] = {};

    if (!name || name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!email || !isValidEmail(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!subject || subject.trim().length < 3) {
      errors.subject = "Subject must be at least 3 characters";
    }

    if (!message || message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    }

    if (Object.keys(errors).length > 0) {
      setState({
        success: false,
        message: "Please fix the errors below",
        errors,
      });
      setIsPending(false);
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: name.trim(),
          email: email.trim(),
          subject: `[Malta Calculator] ${subject.trim()}`,
          message: message.trim(),
          from_name: "Malta Calculator Contact Form",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setState({
          success: true,
          message:
            "Thank you for your message! We'll get back to you within 24-48 hours.",
        });
        formRef.current?.reset();
      } else {
        setState({
          success: false,
          message:
            result.message || "Something went wrong. Please try again later.",
        });
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      setState({
        success: false,
        message: "Failed to send message. Please try again later.",
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="relative">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-72 h-72 bg-gradient-to-tr from-blue-500/10 via-cyan-500/10 to-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="relative space-y-6 bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 md:p-8 shadow-xl"
      >
        {/* Honeypot field - hidden from users, visible to bots */}
        <input
          type="checkbox"
          name="botcheck"
          className="hidden"
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Success/Error Message */}
        {state && (
          <div
            className={cn(
              "flex items-start gap-3 p-4 rounded-xl border transition-all duration-300",
              state.success
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400",
            )}
          >
            {state.success ? (
              <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            )}
            <p className="text-sm font-medium">{state.message}</p>
          </div>
        )}

        {/* Name Field */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-foreground flex items-center gap-2"
          >
            <User className="w-4 h-4 text-muted-foreground" />
            Your Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            required
            minLength={2}
            className={cn(
              "h-12 bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-200",
              state?.errors?.name && "border-red-500/50 focus:border-red-500",
            )}
            disabled={isPending}
          />
          {state?.errors?.name && (
            <p className="text-xs text-red-500 mt-1">{state.errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground flex items-center gap-2"
          >
            <Mail className="w-4 h-4 text-muted-foreground" />
            Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            className={cn(
              "h-12 bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-200",
              state?.errors?.email && "border-red-500/50 focus:border-red-500",
            )}
            disabled={isPending}
          />
          {state?.errors?.email && (
            <p className="text-xs text-red-500 mt-1">{state.errors.email}</p>
          )}
        </div>

        {/* Subject Field */}
        <div className="space-y-2">
          <label
            htmlFor="subject"
            className="text-sm font-medium text-foreground flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            Subject
          </label>
          <Input
            id="subject"
            name="subject"
            type="text"
            placeholder="How can we help you?"
            required
            minLength={3}
            className={cn(
              "h-12 bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-200",
              state?.errors?.subject &&
                "border-red-500/50 focus:border-red-500",
            )}
            disabled={isPending}
          />
          {state?.errors?.subject && (
            <p className="text-xs text-red-500 mt-1">{state.errors.subject}</p>
          )}
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <label
            htmlFor="message"
            className="text-sm font-medium text-foreground flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            Message
          </label>
          <Textarea
            id="message"
            name="message"
            placeholder="Tell us more about your question or feedback..."
            required
            minLength={10}
            rows={5}
            className={cn(
              "bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-200 resize-none",
              state?.errors?.message &&
                "border-red-500/50 focus:border-red-500",
            )}
            disabled={isPending}
          />
          {state?.errors?.message && (
            <p className="text-xs text-red-500 mt-1">{state.errors.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary via-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all duration-300 group"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2 transition-transform group-hover:translate-x-1" />
              Send Message
            </>
          )}
        </Button>

        {/* Privacy note */}
        <p className="text-xs text-muted-foreground text-center">
          By submitting this form, you agree to our{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
          . We typically respond within 24-48 hours.
        </p>
      </form>
    </div>
  );
}
