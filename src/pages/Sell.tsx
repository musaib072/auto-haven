import { BadgeIndianRupee, CalendarCheck, ClipboardCheck, FileSignature } from "lucide-react";
import { PageHero, SiteLayout } from "@/components/layout/SiteLayout";
import { Steps } from "@/components/layout/Steps";
import { SellCarForm } from "@/components/forms/SellCarForm";

const steps = [
  { icon: ClipboardCheck, title: "Share your car details", desc: "Fill in the form with your registration, model, kilometres and a few photos." },
  { icon: CalendarCheck, title: "Free evaluation", desc: "Our expert calls you and inspects the car at your place, at a time that suits you." },
  { icon: BadgeIndianRupee, title: "Get the best price", desc: "Receive a fair, transparent offer based on the car's real condition and market value." },
  { icon: FileSignature, title: "Payment & paperwork", desc: "We guide you through payment and RC transfer documentation so you can sell with zero hassle." },
];

const Sell = () => (
  <SiteLayout title="Sell Your Car" description="Sell your car in Amravati at the best price. Free doorstep evaluation, transparent offers and complete RC transfer support from AUTOFLEXII.">
    <PageHero
      eyebrow="Sell with AUTOFLEXII"
      title="Sell your car at the right price"
      subtitle="Free doorstep evaluation, a transparent offer and complete paperwork support — without the haggling."
      image="/images/card-sell.webp"
    />
    <section className="container grid grid-cols-1 gap-10 py-12 lg:grid-cols-[1fr_1.1fr] lg:py-16">
      <Steps title="How selling works" steps={steps} />
      <SellCarForm id="book" />
    </section>
  </SiteLayout>
);

export default Sell;
