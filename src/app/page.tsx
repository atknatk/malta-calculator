import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Hero } from "@/components/marketing/hero";
import { MenuBox } from "@/components/marketing/menu-box";

export default function Home() {
  return (
    <MarketingLayout>
    <div className="grid gap-8">
      <Hero/>
      <MenuBox/>
    </div>
  </MarketingLayout>
  );
}
