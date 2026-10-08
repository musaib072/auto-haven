import { Droplet, FileCheck2, Handshake, ShieldCheck, ClipboardList, Star } from "lucide-react";

const whyItems = [
  { icon: ShieldCheck, label: ["Professional", "Inspection"] },
  { icon: Handshake, label: ["Transparent", "Car Buying & Selling"] },
  { icon: Droplet, label: ["Doorstep", "Car Spa"] },
  { icon: FileCheck2, label: ["Insurance", "Assistance"] },
  { icon: ClipboardList, label: ["PDI", "Services"] },
  { icon: Star, label: ["Premium", "Customer Experience"] },
];

export function WhyUs() {
  return (
    <section aria-labelledby="why-title" className="container py-12 md:py-16">
      <div className="text-center">
        <h2 id="why-title" className="font-display text-2xl font-semibold sm:text-3xl">
          Why <span className="text-gold">AUTOFLEXII?</span>
        </h2>
        <p className="mt-3 text-sm text-foreground/80 sm:text-base">More than just a service — it's a better way to own and care for your car.</p>
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-y-6 rounded-xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent px-4 py-6 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x lg:divide-white/10">
        {whyItems.map(({ icon: Icon, label }) => (
          <li key={label.join(" ")} className="flex items-center justify-center gap-3 px-3">
            <Icon className="h-8 w-8 shrink-0 text-gold" strokeWidth={1.3} aria-hidden="true" />
            <span className="text-[13px] leading-tight text-foreground/90">
              {label[0]}
              <br />
              {label[1]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
