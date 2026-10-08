import { Link } from "react-router-dom";
import { ArrowRight, FileText, ShieldCheck, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InspectifyShield } from "@/components/brand/Logo";

const stats = [
  { icon: Wrench, value: "299+", label: "Inspection Checkpoints" },
  { icon: FileText, value: "Detailed", label: "Inspectify Report" },
  { icon: ShieldCheck, value: "Complete", label: "Peace of Mind" },
];

export function InspectifyBanner({ showCta = true }: { showCta?: boolean }) {
  return (
    <section aria-labelledby="inspectify-title" className="lux-card overflow-hidden">
      <div className="grid grid-cols-1 items-stretch lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.25fr)_minmax(0,0.8fr)_minmax(0,0.9fr)]">
        <div className="relative h-56 lg:h-auto">
          <img src="/images/inspect-mechanic.webp" alt="Inspectify technician examining a car" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(240_6%_6%)] to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[hsl(240_6%_7%)]" />
        </div>

        <div className="flex flex-col justify-center px-6 py-8 lg:px-8">
          <div className="flex items-center gap-4">
            <InspectifyShield className="h-14 w-12 shrink-0" />
            <div>
              <h2 id="inspectify-title" className="font-display text-2xl font-medium uppercase tracking-[0.22em] text-foreground">
                Inspectify
              </h2>
              <p className="mt-1 text-[11px] tracking-wide text-foreground/80">
                Powered by <span className="font-display tracking-[0.18em]">AUTOFLEXII</span>
              </p>
            </div>
          </div>
          <p className="mt-6 text-lg font-medium text-foreground">Buying a pre-owned car?</p>
          <p className="mt-1 text-sm text-foreground/80">Get it professionally inspected before you buy.</p>
          {showCta && (
            <div className="mt-6">
              <Button asChild variant="gold" className="h-11 px-8 text-[13px]">
                <Link to="/inspectify#book">
                  Book Car Inspection <ArrowRight />
                </Link>
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center px-6 pb-8 lg:px-0 lg:py-8">
          <ul className="w-full space-y-5 rounded-lg border border-white/5 bg-black/30 p-5">
            {stats.map(({ icon: Icon, value, label }) => (
              <li key={label} className="flex items-center gap-3">
                <Icon className="h-5 w-5 shrink-0 text-gold" strokeWidth={1.6} aria-hidden="true" />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-foreground">{value}</p>
                  <p className="text-[11px] text-foreground/70">{label}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative hidden lg:block">
          <img src="/images/inspect-car.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(240_6%_7%)] via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
