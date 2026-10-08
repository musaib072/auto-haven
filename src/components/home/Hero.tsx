import { ArrowRight, Droplet, FileCheck2, Handshake, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Handshake, label: ["Trusted", "Transactions"] },
  { icon: ShieldCheck, label: ["Professional", "Inspection"] },
  { icon: Droplet, label: ["Doorstep", "Car Spa"] },
  { icon: FileCheck2, label: ["Insurance", "Assistance"] },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/5" aria-labelledby="hero-title">
      {/* warm dusk glow behind the headline */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_70%_0%,rgba(201,164,103,0.16),transparent_70%)]" />

      <div className="relative h-[240px] sm:h-[340px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[60%]">
        <img
          src="/images/hero-car.webp"
          alt="Black luxury SUV on a mountain road at dusk"
          className="h-full w-full object-cover object-[60%_center]"
          fetchPriority="high"
          decoding="async"
          width={1437}
          height={918}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent lg:bg-[linear-gradient(90deg,hsl(var(--background))_0%,hsl(var(--background)/0.75)_18%,hsl(var(--background)/0.25)_36%,transparent_55%)]" />
        <div className="absolute inset-x-0 bottom-0 hidden h-24 bg-gradient-to-t from-background to-transparent lg:block" />
      </div>

      <div className="container relative flex flex-col justify-center pb-12 pt-2 lg:min-h-[540px] lg:py-20">
        <div className="max-w-[640px] animate-fade-up lg:max-w-[640px] xl:max-w-[820px]">
          <p className="eyebrow mb-4">Premium Automotive Services</p>
          <h1
            id="hero-title"
            className="font-display text-[34px] font-bold uppercase leading-[1.08] tracking-tight text-gold-gradient sm:text-5xl lg:text-[42px] xl:text-[52px]"
          >
            Buy. Sell. Inspect. Care.
          </h1>
          <p className="mt-5 text-lg text-foreground/90 sm:text-xl">Your complete car journey, under one roof.</p>

          <ul className="mt-8 grid max-w-[600px] grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-x-4">
            {features.map(({ icon: Icon, label }) => (
              <li key={label[0]} className="flex items-center gap-3">
                <span className="gold-ring-icon h-9 w-9">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                </span>
                <span className="text-xs leading-tight text-foreground/85">
                  {label[0]}
                  <br />
                  {label[1]}
                </span>
              </li>
            ))}
          </ul>

          <Button asChild variant="goldOutline" className="mt-10 h-12 px-7 text-xs">
            <a href="#services">
              Explore Services <ArrowRight />
            </a>
          </Button>
        </div>

        <p className="absolute bottom-8 right-6 hidden text-right font-display text-[11px] font-medium uppercase leading-relaxed tracking-luxe text-gold-light lg:block">
          Perfection
          <br />
          Delivered.
        </p>
      </div>
    </section>
  );
}
