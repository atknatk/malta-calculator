import type { ValidIcon } from "@/components/icons";

export type Social = {
  title: string;
  href: string;
  icon: ValidIcon;
};

export const socialsConfig: Social[] = [
  {
    title: "GitHub",
    href: "https://github.com/atknatk",
    icon: "github",
  },
  {
    title: "LinkedIn",
    href: "https://www.linkedin.com/in/tuvana-atik",
    icon: "linkedin",
  },
];
