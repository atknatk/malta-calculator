"use client";

import { useTheme } from "next-themes";
import * as React from "react";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

// Color Theme Types
type ColorTheme = "malta" | "fintech";

export const colorThemes: {
  id: ColorTheme;
  name: string;
  colors: string[];
}[] = [
  {
    id: "malta",
    name: "Malta Gold",
    colors: ["#f5a623", "#0099cc", "#e74c3c"],
  },
  {
    id: "fintech",
    name: "Fintech Blue",
    colors: ["#0066ff", "#38bdf8", "#10b981"],
  },
];

const themeModes = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "system", label: "System" },
] as const;

// next-themes server'da temayı bilmez; etiket ve seçili durum mount sonrası doğru olur
function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/** Renk teması localStorage'da tutulur, <html data-theme> ile uygulanır (Malta = attribute yok) */
export function useColorTheme(): [ColorTheme, (theme: ColorTheme) => void] {
  const [colorTheme, setColorTheme] = useState<ColorTheme>("malta");

  // Load saved color theme
  useEffect(() => {
    const saved = localStorage.getItem("color-theme") as ColorTheme;
    if (saved && colorThemes.find((t) => t.id === saved)) {
      setColorTheme(saved);
      document.documentElement.setAttribute(
        "data-theme",
        saved === "malta" ? "" : saved,
      );
    }
  }, []);

  const handleColorThemeChange = (newTheme: ColorTheme) => {
    setColorTheme(newTheme);
    localStorage.setItem("color-theme", newTheme);
    if (newTheme === "malta") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", newTheme);
    }
  };

  return [colorTheme, handleColorThemeChange];
}

/** Header'daki tek tık açık/koyu geçişi */
export function ThemeIconToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn("rounded-[10px] bg-card", className)}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <Moon className="h-[18px] w-[18px] dark:hidden" aria-hidden="true" />
      <Sun className="hidden h-[18px] w-[18px] dark:block" aria-hidden="true" />
    </Button>
  );
}

/** Mobil menüdeki "Dark theme" anahtarı */
export function DarkThemeSwitch({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const id = React.useId();

  return (
    <div
      className={cn(
        "flex h-14 items-center justify-between text-base font-medium",
        className,
      )}
    >
      <label htmlFor={id} className="flex-1 cursor-pointer">
        Dark theme
      </label>
      {/* Varsayılan bg-input izi zeminde ~1.2:1; kapalı durum için 3:1 üstü iz */}
      <Switch
        id={id}
        className="data-[state=unchecked]:bg-muted-foreground/70"
        checked={mounted && resolvedTheme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
    </div>
  );
}

/** Footer: Light / Dark / System segmented kontrol */
export function ThemeModeSegment({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  return (
    <ToggleGroup
      type="single"
      aria-label="Theme"
      value={mounted ? theme : undefined}
      onValueChange={(value) => value && setTheme(value)}
      className={cn("gap-0.5 rounded-[10px] bg-muted p-[3px]", className)}
    >
      {themeModes.map((mode) => (
        <ToggleGroupItem
          key={mode.id}
          value={mode.id}
          className="h-10 rounded-lg px-3 text-sm text-muted-foreground hover:bg-transparent hover:text-foreground data-[state=on]:bg-card data-[state=on]:font-semibold data-[state=on]:text-foreground data-[state=on]:shadow-sm md:h-[38px] md:text-[13px] lg:h-[30px]"
        >
          {mode.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

/** Footer: Malta Gold / Fintech Blue renk teması seçimi */
export function ColorThemePicker({ className }: { className?: string }) {
  const [colorTheme, setColorTheme] = useColorTheme();

  return (
    <div role="group" aria-label="Colour theme" className={cn(className)}>
      {colorThemes.map((ct) => {
        const isActive = colorTheme === ct.id;
        return (
          <button
            key={ct.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => setColorTheme(ct.id)}
            className={cn(
              "inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border bg-card px-3 text-sm font-semibold text-foreground ring-offset-background transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-[13px] lg:h-9",
              isActive ? "border-primary" : "border-border",
            )}
          >
            <span aria-hidden="true" className="flex">
              {ct.colors.map((color) => (
                <span
                  key={color}
                  className="-mr-[3px] h-2.5 w-2.5 rounded-full border-[1.5px] border-card"
                  style={{ backgroundColor: color }}
                />
              ))}
            </span>
            {ct.name}
          </button>
        );
      })}
    </div>
  );
}
