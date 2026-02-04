"use client";

import { useTheme } from "next-themes";
import * as React from "react";
import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";

import { Icons } from "@/components/icons";
import { Button } from "./ui/button";
import { Palette, Check } from "lucide-react";

// Color Theme Types
type ColorTheme = "malta" | "fintech";

const colorThemes: { id: ColorTheme; name: string; colors: string[] }[] = [
  {
    id: "malta",
    name: "Malta Gold",
    colors: ["#f5a623", "#0099cc", "#e74c3c"],
  },
  {
    id: "fintech",
    name: "Fintech Blue",
    colors: ["#667eea", "#764ba2", "#f093fb"],
  },
];

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="glass">
          <Icons.sun className="dark:-rotate-90 h-4 w-4 rotate-0 scale-100 transition-all dark:scale-0" />
          <Icons.moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass w-48">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Appearance
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Icons.sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {theme === "light" && (
            <Check className="ml-auto h-4 w-4 text-primary" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Icons.moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {theme === "dark" && (
            <Check className="ml-auto h-4 w-4 text-primary" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Icons.laptop className="mr-2 h-4 w-4" />
          <span>System</span>
          {theme === "system" && (
            <Check className="ml-auto h-4 w-4 text-primary" />
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center gap-2">
          <Palette className="h-3 w-3" />
          Color Palette
        </DropdownMenuLabel>
        {colorThemes.map((ct) => (
          <DropdownMenuItem
            key={ct.id}
            onClick={() => handleColorThemeChange(ct.id)}
          >
            <div className="flex items-center gap-2 mr-2">
              {ct.colors.map((color, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span>{ct.name}</span>
            {colorTheme === ct.id && (
              <Check className="ml-auto h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
