"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface Props {
  id: string;
  value: number;
  onValueChange: (value: number) => void;
  /** lg: başlıktaki maaş alanı (64px), md: diğer tutarlar (48px), sm: tablo hücresi */
  size?: "lg" | "md" | "sm";
  prefix?: string | null;
  suffix?: string;
  placeholder?: string;
  /** 0 değeri boş göster (isteğe bağlı alanlar) */
  emptyWhenZero?: boolean;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

const formatter = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 });

function display(value: number, emptyWhenZero: boolean): string {
  if (!Number.isFinite(value) || (emptyWhenZero && value === 0)) return "";
  return formatter.format(value);
}

/** "35,000.50" → 35000.5 ; boş/geçersiz → 0 */
export function parseAmount(text: string): number {
  const parsed = parseFloat(text.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

// Yazarken sonuç anında güncellenir; odaktan çıkınca binlik ayraçla biçimlenir
export function MoneyField({
  id,
  value,
  onValueChange,
  size = "md",
  prefix = "€",
  suffix,
  placeholder,
  emptyWhenZero = false,
  disabled,
  className,
  ...aria
}: Props) {
  const [text, setText] = React.useState(() => display(value, emptyWhenZero));
  const focusedRef = React.useRef(false);

  React.useEffect(() => {
    if (!focusedRef.current) setText(display(value, emptyWhenZero));
  }, [value, emptyWhenZero]);

  return (
    <div
      className={cn(
        "flex items-center border border-field bg-card transition-[border-color,box-shadow] focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/20",
        size === "lg" && "h-16 gap-3 rounded-xl px-4 sm:px-5",
        size === "md" && "h-12 gap-2 rounded-xl px-3.5",
        size === "sm" && "h-9 gap-1 rounded-lg px-2.5",
        disabled && "cursor-not-allowed opacity-55",
        className,
      )}
    >
      {prefix ? (
        <span
          aria-hidden="true"
          className={cn(
            "text-muted-foreground",
            size === "lg" && "text-[22px] font-semibold sm:text-2xl",
          )}
        >
          {prefix}
        </span>
      ) : null}
      <input
        id={id}
        inputMode="decimal"
        autoComplete="off"
        // Varsayılan 20 karakterlik min-content tablo sütunlarını şişirmesin
        size={1}
        value={text}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => {
          focusedRef.current = true;
        }}
        onChange={(event) => {
          setText(event.target.value);
          onValueChange(parseAmount(event.target.value));
        }}
        onBlur={() => {
          focusedRef.current = false;
          setText(display(parseAmount(text), emptyWhenZero));
        }}
        className={cn(
          "h-full min-w-0 flex-1 bg-transparent tabular-nums text-foreground placeholder:text-muted-foreground/80 focus:outline-none disabled:cursor-not-allowed",
          size === "lg" &&
            "text-[26px] font-semibold tracking-[-0.01em] sm:text-[30px]",
          size === "md" && "text-base font-medium",
          size === "sm" && "text-right text-sm",
        )}
        {...aria}
      />
      {suffix ? (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}
