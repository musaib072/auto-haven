import { useSearchParams } from "react-router-dom";
import { Armchair, BatteryCharging, Car, CircleGauge, Cog, FileText, Gauge, ScanLine, ShieldCheck, Wrench } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { InspectifyBanner } from "@/components/home/InspectifyBanner";
import { InspectionForm } from "@/components/forms/InspectionForm";

const areas = [
  { icon: Car, title: "Exterior & Body", desc: "Panel gaps, repaint detection, rust, dents and accident history signs." },
  { icon: Cog, title: "Engine & Transmission", desc: "Leaks, noises, smoke, gear shifts, clutch wear and mounts." },
  { icon: ScanLine, title: "OBD Diagnostics", desc: "Computer scan for stored error codes and hidden electronic faults." },
  { icon: CircleGauge, title: "Suspension & Steering", desc: "Shock absorbers, bushes, alignment and steering play." },
  { icon: Gauge, title: "Brakes & Tyres", desc: "Pad and disc wear, tyre tread depth, age and uneven wear." },
  { icon: BatteryCharging, title: "Electricals", desc: "Battery health, lights, power windows, infotainment and AC." },
  { icon: Armchair, title: "Interior", desc: "Seats, upholstery, odometer consistency and flood-damage signs." },
  { icon: FileText, title: "Documents", desc: "RC, insurance, service history and challan / hypothecation checks." },
];

const Inspectify = () => {
  const [params] = useSearchParams();
  const car = params.get("car") ?? undefined;
  return (
    <SiteLayout title="Inspectify — 299+ Point Car Inspection" description="Inspectify by AUTOFLEXII: a 299+ point used-car inspection with a detailed report, done wherever the car is. Know exactly what you're buying.">
      <section className="container pt-10 md:pt-14">
        <InspectifyBanner showCta={false} />
      </section>

      <section className="container py-12 md:py-16">
        <div className="max-w-2xl">
          <p className="eyebrow mb-3">What we check</p>
          <h1 className="section-title">A 299+ point inspection before you pay a rupee</h1>
          <p className="mt-3 text-sm leading-relaxed text-foreground/75">
            Our trained inspectors examine every critical system of the car you're planning to buy and share a detailed Inspectify report with photos, so you can negotiate with confidence — or walk away.
          </p>
        </div>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="lux-card p-5">
              <Icon className="h-6 w-6 text-gold" strokeWidth={1.5} aria-hidden="true" />
              <h2 className="mt-3 font-display text-sm font-semibold uppercase tracking-wide text-gold-light">{title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/70">{desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container grid grid-cols-1 gap-10 pb-16 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5">
          <h2 className="section-title">Why inspect first?</h2>
          {[
            { icon: ShieldCheck, t: "Avoid costly surprises", d: "Hidden accident repairs, flood damage or engine issues can cost lakhs later." },
            { icon: FileText, t: "Negotiate with facts", d: "Use the report to agree a fair price based on the car's real condition." },
            { icon: Wrench, t: "Know what to fix", d: "Get an honest list of upcoming maintenance before you take delivery." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="flex gap-4">
              <span className="gold-ring-icon h-10 w-10">
                <Icon className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <div>
                <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-gold-light">{t}</h3>
                <p className="mt-1 text-sm text-foreground/75">{d}</p>
              </div>
            </div>
          ))}
        </div>
        <InspectionForm id="book" defaultCar={car} />
      </section>
    </SiteLayout>
  );
};

export default Inspectify;
