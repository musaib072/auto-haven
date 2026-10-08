import { useState } from "react";
import { Check, Droplet, Leaf, ShieldCheck, Timer } from "lucide-react";
import { PageHero, SiteLayout } from "@/components/layout/SiteLayout";
import { CarSpaForm } from "@/components/forms/CarSpaForm";
import { spaPackages } from "@/data/options";
import { cn } from "@/lib/utils";

const promises = [
  { icon: Droplet, text: "Fully equipped doorstep team" },
  { icon: Leaf, text: "pH-neutral, paint-safe products" },
  { icon: ShieldCheck, text: "Trained, verified detailers" },
  { icon: Timer, text: "Pick a slot that suits you" },
];

const CarSpa = () => {
  const [selected, setSelected] = useState<string | undefined>();
  return (
    <SiteLayout title="Door-to-Door Car Spa" description="Premium doorstep car wash, interior detailing, polish and ceramic coating in Amravati. Book a slot online with AUTOFLEXII.">
      <PageHero
        eyebrow="Doorstep Car Spa"
        title="Premium car care, at your doorstep"
        subtitle="Clean. Protect. Maintain. Choose a package, pick a slot and our detailers come to you."
        image="/images/card-spa.webp"
      >
        <ul className="mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
          {promises.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm text-foreground/85">
              <Icon className="h-4 w-4 text-gold" aria-hidden="true" /> {text}
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="container grid grid-cols-1 gap-10 py-12 lg:grid-cols-[1.2fr_1fr] lg:py-16">
        <div>
          <h2 className="section-title">Our packages</h2>
          <p className="mt-2 text-sm text-muted-foreground">Tap a package to pre-select it in the booking form. Our team confirms pricing for your vehicle on call.</p>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {spaPackages.map((p) => {
              const active = selected === p.name;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(p.name);
                      document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    aria-pressed={active}
                    className={cn(
                      "lux-card lux-card-hover h-full w-full p-5 text-left",
                      active && "border-gold/70 shadow-gold",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-gold-light">{p.name}</h3>
                      {active && <Check className="h-4 w-4 text-gold" aria-hidden="true" />}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/75">{p.description}</p>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <CarSpaForm id="book" key={selected ?? "none"} defaultPackage={selected} />
      </section>
    </SiteLayout>
  );
};

export default CarSpa;
