import { Link } from "react-router-dom";
import { ArrowRight, Car, Droplet, IndianRupee, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceCard {
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
  alt: string;
  cta: string;
  href: string;
}

const serviceCards: ServiceCard[] = [
  {
    icon: Car,
    title: "Buy a Car",
    description: "Find your perfect ride. We help you get the right car at the right price.",
    image: "/images/card-buy.webp",
    alt: "Black premium sedan parked at dusk",
    cta: "Start Buying",
    href: "/buy",
  },
  {
    icon: IndianRupee,
    title: "Sell Your Car",
    description: "Get the best value for your car with our trusted and transparent process.",
    image: "/images/card-sell.webp",
    alt: "Black SUV in a modern showroom",
    cta: "Start Selling",
    href: "/sell",
  },
  {
    icon: Droplet,
    title: "Door-to-Door Car Spa",
    description: "Premium car care, at your doorstep. Clean. Protect. Maintain.",
    image: "/images/card-spa.webp",
    alt: "SUV being washed with a foam spray",
    cta: "Book a Wash",
    href: "/car-spa",
  },
];

export function ServiceCards() {
  return (
    <section id="services" aria-label="Our services" className="container scroll-mt-20 py-6 md:py-8">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {serviceCards.map(({ icon: Icon, ...c }) => (
          <article key={c.title} className="lux-card lux-card-hover group flex flex-col overflow-hidden">
            <div className="relative h-40 overflow-hidden sm:h-44 lg:h-40 xl:h-48">
              <img
                src={c.image}
                alt={c.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(240_6%_6%)] via-transparent to-transparent" />
            </div>
            <div className="relative -mt-7 flex flex-1 flex-col px-5 pb-6 xl:px-6">
              <div className="flex items-center gap-4">
                <span className="gold-ring-icon h-12 w-12">
                  <Icon className="h-6 w-6" strokeWidth={1.6} />
                </span>
                <h2 className="font-display text-lg font-semibold uppercase leading-tight tracking-wide text-gold-light xl:text-xl">{c.title}</h2>
              </div>
              <p className="mt-3 max-w-[32ch] pl-16 text-[13px] leading-relaxed text-foreground/80 xl:text-sm">{c.description}</p>
              <div className="mt-5">
                <Button asChild variant="gold" className="h-10 px-8 text-[13px]">
                  <Link to={c.href}>
                    {c.cta} <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
