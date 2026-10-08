import { SiteLayout } from "@/components/layout/SiteLayout";
import { Hero } from "@/components/home/Hero";
import { ServiceCards } from "@/components/home/ServiceCards";
import { InspectifyBanner } from "@/components/home/InspectifyBanner";
import { WhyUs } from "@/components/home/WhyUs";
import { BuyCarForm } from "@/components/forms/BuyCarForm";
import { SellCarForm } from "@/components/forms/SellCarForm";
import { CarSpaForm } from "@/components/forms/CarSpaForm";

const Index = () => (
  <SiteLayout>
    <Hero />
    <ServiceCards />

    <section aria-label="Get started" className="relative border-y border-white/5 bg-[hsl(240_6%_5.5%)] py-8 md:py-10">
      <div className="container grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
        <BuyCarForm id="buy-form" />
        <SellCarForm id="sell-form" />
        <CarSpaForm id="spa-form" />
      </div>
    </section>

    <div className="container pt-8 md:pt-10">
      <InspectifyBanner />
    </div>

    <WhyUs />
  </SiteLayout>
);

export default Index;
