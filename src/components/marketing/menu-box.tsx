import {
  Activity,
  Clock,
  FileCode,
  Gauge,
  Palette,
  PanelTop,
} from "lucide-react";

import type { CardProps } from "@/components/salary/card";
import { Card } from "@/components/salary/card";

export async function MenuBox() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 sm:grid-cols-2">
        {playgrounds.map((play, i) => {
          const isFirst = i === 0;
          return (
            <Card
              key={play.href}
              className={isFirst ? "sm:col-span-3" : undefined}
              {...play}
            />
          );
        })}
      </div>
  );
}

const playgrounds: CardProps[] = [
  {
    href: "/salary",
    title: "Salary Calculator",
    description:
      "Get speed insights for your api, website from multiple regions. No account needed.",
    icon: Gauge,
    variant: "primary",
  },
  {
    href: "/public/monitors/1",
    title: "Notice Calculator",
    description: "Get a demo of what data we collect for your monitor.",
    icon: Activity,
  },
  {
    href: "/play/status",
    title: "Pension Calculator",
    description: "Get a status page for your website or api.",
    icon: PanelTop,
  },
  {
    href: "/play/status",
    title: "Vocation Page",
    description:
      "Grab your API key and create a custom status page with our Astro starter.",
    icon: Palette,
  },
  {
    href: "/play/status",
    title: "Childcare Calculator",
    description:
      "The missing time picker for your next project. Supports 12 hour and 24 hour formats. Fully accessible.",
    icon: Clock,
  },
  {
    href: "/play/status",
    title: "Anasini Calculator",
    description:
      "Use the endpoint to return the desired error code for testing purposes.",
    icon: FileCode,
  },
];
