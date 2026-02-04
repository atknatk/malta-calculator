"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DigitProps {
  value: number;
  label: string;
  showDays?: boolean;
}

// Smooth fade animation - minimal and elegant
function DigitCard({ digit }: { digit: string; index: number }) {
  return (
    <div
      className={cn(
        "relative w-12 h-16 md:w-16 md:h-20",
        "bg-gradient-to-br from-background to-muted/50",
        "rounded-lg border border-border/50",
        "shadow-sm"
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={digit}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
          className="absolute inset-0 flex items-center justify-center text-3xl md:text-4xl font-bold"
        >
          <span className="text-gradient">{digit}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function TimeUnit({ value, label }: DigitProps) {
  const digits = String(value).padStart(2, "0").split("");

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        {digits.map((digit, index) => (
          <DigitCard key={`${label}-${index}-${digit}`} digit={digit} index={index} />
        ))}
      </div>
      <span className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

interface CountdownDigitsProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  showDays?: boolean;
}

export function CountdownDigits({
  days,
  hours,
  minutes,
  seconds,
  showDays = false,
}: CountdownDigitsProps) {
  const separator = (
    <span className="text-3xl md:text-4xl font-bold text-muted-foreground/50 self-start mt-4 md:mt-5">
      :
    </span>
  );

  return (
    <div className="flex items-start justify-center gap-2 md:gap-4">
      {(showDays || days > 0) && (
        <>
          <TimeUnit value={days} label="Days" />
          {separator}
        </>
      )}
      <TimeUnit value={hours} label="Hours" />
      {separator}
      <TimeUnit value={minutes} label="Min" />
      {separator}
      <TimeUnit value={seconds} label="Sec" />
    </div>
  );
}
