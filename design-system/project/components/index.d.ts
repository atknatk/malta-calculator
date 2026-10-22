// Malta Calculator — component props, transcribed from the React sources.
// The bundle exposes them on window.MaltaCalculator (plus cn, buttonVariants, toggleVariants and Icons).
// In the app import from "@/components/ui/*" and "@/components/salary/*".
import type * as React from "react";
import type { LucideIcon } from "lucide-react";

/** ui/button.tsx */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  /** Render the child (e.g. a Next Link) with button styles. */
  asChild?: boolean;
}
export declare const Button: React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<HTMLButtonElement>
>;

/** globals.css .btn-glow — hero CTA, markup only. */
export interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/** ui/input.tsx */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/** ui/numeric-input.tsx */
export interface NumericInputProps extends Omit<
  InputProps,
  "value" | "onChange" | "type"
> {
  /** Number, or "" when empty. */
  value: number | "";
  onChange: (value: number | "") => void;
  /** Applied on blur. */
  min?: number;
  /** Applied on blur. */
  max?: number;
  /** Default true. */
  allowDecimals?: boolean;
  /** Default 1. */
  step?: number;
  /** Right-aligned unit, e.g. "€", "€/hr", "%". */
  suffix?: string;
  suffixClassName?: string;
}

/** salary/form-primitives.tsx */
export interface PremiumInputProps {
  icon?: LucideIcon;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  suffix?: string;
  description?: string;
  /** 64px headline field; also scrolls above the mobile keyboard. */
  large?: boolean;
  onFocusChange?: (focused: boolean) => void;
}

/** ui/label.tsx (Radix Label) */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

/** ui/checkbox.tsx (Radix Checkbox) */
export interface CheckboxProps {
  checked?: boolean | "indeterminate";
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
  disabled?: boolean;
  id?: string;
}

/** ui/radio-group.tsx (Radix RadioGroup) */
export interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

/** ui/switch.tsx (Radix Switch) */
export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
}

/** salary/form-primitives.tsx — segmented control */
export interface PremiumToggleGroupProps<T extends string = string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  labels?: Partial<Record<T, string>>;
  /** sm 40px · default 48px · lg 56px */
  size?: "sm" | "default" | "lg";
}

/** ui/textarea.tsx */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/** ui/card.tsx — Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

/** salary/card.tsx (exported there as Card) */
export interface CalculatorCardProps extends React.HTMLAttributes<HTMLDivElement> {
  href: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  variant?: "default" | "primary";
}

/** app/salary/_components/summary-card.tsx */
export interface SummaryCardProps {
  icon: LucideIcon;
  label: string;
  /** Preformatted, e.g. "€2,665.97". */
  value: string;
  variant?: "default" | "success" | "warning" | "danger";
}

/** salary/form-primitives.tsx */
export interface GlassSectionProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}

/** salary/mode-toggle.tsx */
export interface CalculatorModeToggleProps {
  active: "gross-to-net" | "net-to-gross";
  /** URL of the other mode, carrying year, taxType, sscCategory, childCount, birthYear, benefits, bonuses, allowance. */
  otherHref: string;
}

/** ui/table.tsx — Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption */
export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

/** ui/accordion.tsx (Radix Accordion) */
export interface AccordionProps {
  type: "single" | "multiple";
  collapsible?: boolean;
  children: React.ReactNode;
}

/** ui/tooltip.tsx (Radix Tooltip) — TooltipProvider, Tooltip, TooltipTrigger, TooltipContent */
export interface TooltipProps {
  /** On TooltipContent; default 4. */
  sideOffset?: number;
  children: React.ReactNode;
}

/** ui/separator.tsx */
export interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  /** Default true. */
  decorative?: boolean;
}

/** ui/toggle.tsx, ui/toggle-group.tsx (Radix) */
export interface ToggleGroupProps {
  type: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  children: React.ReactNode;
}

/** ui/dropdown-menu.tsx (Radix) — DropdownMenu, Trigger, Content, Item, CheckboxItem, RadioGroup, RadioItem, Label, Separator, Shortcut, Group, Sub, SubTrigger, SubContent */
export interface DropdownMenuProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  children: React.ReactNode;
}

/** ui/select.tsx (Radix) — Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel, SelectSeparator */
export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}

/** salary/form-primitives.tsx */
export interface AdvancedSettingsProps {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

/** ui/popover.tsx (Radix) — Popover, PopoverTrigger, PopoverContent */
export interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

/** ui/dialog.tsx (Radix) — Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose */
export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  children: React.ReactNode;
}

/** ui/sheet.tsx (Radix Dialog) — Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, SheetClose */
export interface SheetProps extends DialogProps {
  /** On SheetContent; default "right". */
  side?: "top" | "right" | "bottom" | "left";
}

/** marketing/hero.tsx inline pill */
export interface EyebrowPillProps {
  icon?: LucideIcon;
  children: React.ReactNode;
}
