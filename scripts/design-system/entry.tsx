// Design system bundle girişi: gerçek bileşenleri window.MaltaCalculator altında yayınlar.
// Yeni bir bileşen eklerken buraya export'unu, design-system/project/components/<Ad>/ altına
// README.md + preview.html ekle.
export * from "@/components/ui/button";
export * from "@/components/ui/input";
export * from "@/components/ui/numeric-input";
export * from "@/components/ui/label";
export * from "@/components/ui/checkbox";
export * from "@/components/ui/radio-group";
export * from "@/components/ui/switch";
export * from "@/components/ui/textarea";
export * from "@/components/ui/toggle";
export * from "@/components/ui/toggle-group";
export * from "@/components/ui/card";
export * from "@/components/ui/table";
export * from "@/components/ui/accordion";
export * from "@/components/ui/tooltip";
export * from "@/components/ui/separator";
export * from "@/components/ui/select";
export * from "@/components/ui/dialog";
export * from "@/components/ui/sheet";
export * from "@/components/ui/popover";
export * from "@/components/ui/dropdown-menu";
export {
  PremiumInput,
  PremiumToggleGroup,
  GlassSection,
  AdvancedSettings,
} from "@/components/salary/form-primitives";
export { CalculatorModeToggle } from "@/components/salary/mode-toggle";
export { Card as CalculatorCard } from "@/components/salary/card";
export { SummaryCard } from "@/app/salary/_components/summary-card";
export { cn } from "@/lib/utils";

// Önizlemelerin `icon` prop'una verdiği Lucide ikonları
import {
  ArrowDown,
  Briefcase,
  Calculator,
  Euro,
  Home,
  Info,
  Settings,
  Sparkles,
  TrendingDown,
  Wallet,
} from "lucide-react";

export const Icons = {
  ArrowDown,
  Briefcase,
  Calculator,
  Euro,
  Home,
  Info,
  Settings,
  Sparkles,
  TrendingDown,
  Wallet,
};
