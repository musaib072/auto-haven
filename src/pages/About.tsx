import { Link } from "react-router-dom";
import { ArrowRight, Car, ClipboardList, Droplet, FileCheck2, Handshake, IndianRupee, ShieldCheck } from "lucide-react";
import { PageHero, SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { WhyUs } from "@/components/home/WhyUs";
import { site } from "@/config/site";

const services = [
  { icon: Car, title: "Buy a Car", desc: "Hand-picked, inspected pre-owned cars — or tell us what you want and we'll source it.", href: "/buy" },
  { icon: IndianRupee, title: "Sell Your Car", desc: "Free doorstep evaluation, a fair offer and complete RC transfer support.", href: "/sell" },
  { icon: Droplet, title: "Door-to-Door Car Spa", desc: "Foam wash, interior detailing, polish and ceramic coating at your doorstep.", href: "/car-spa" },
  { icon: ShieldCheck, title: "Inspectify", desc: "299+ point inspection with a detailed report before you buy any used car.", href: "/inspectify" },
  { icon: FileCheck2, title: "Insurance Assistance", desc: "Renewals, claims support and the right cover for your car.", href: "/contact" },
  { icon: ClipboardList, title: "PDI Services", desc: "Pre-delivery inspection of your new car before you accept it from the dealer.", href: "/contact" },
];

const About = () => (
  <SiteLayout title="About Us" description="AUTOFLEXII is Amravati's one-stop automotive partner — buy, sell, inspect and care for your car with complete transparency.">
    <PageHero
      eyebrow="About AUTOFLEXII"
      title="Your complete car journey, under one roof"
      subtitle={`Based in ${site.address.display}, AUTOFLEXII brings buying, selling, inspection and car care together — with one promise: perfection delivered.`}
      image="/images/hero-car.webp"
    />

    <section className="container grid grid-cols-1 gap-10 py-12 lg:grid-cols-2 lg:py-16">
      <div>
        <p className="eyebrow mb-3">Our story</p>
        <h2 className="section-title">Built on trust and transparency</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/80">
          <p>
            Buying or selling a car shouldn't feel like a gamble. We started AUTOFLEXII to give car owners in Amravati an honest, professional partner for every stage of ownership.
          </p>
          <p>
            Every car we recommend is inspected, every price is explained and every promise is kept. From your first enquiry to the last signature on the RC transfer — and every wash in between — our team is on call.
          </p>
        </div>
      </div>
      <div className="lux-card grid grid-cols-2 gap-px overflow-hidden bg-gold/10 p-0">
        {[
          { icon: Handshake, k: "Transparent", v: "pricing & paperwork" },
          { icon: ShieldCheck, k: "299+", v: "inspection checkpoints" },
          { icon: Droplet, k: "Doorstep", v: "car spa at your convenience" },
          { icon: FileCheck2, k: "End-to-end", v: "RC & insurance support" },
        ].map(({ icon: Icon, k, v }) => (
          <div key={k} className="bg-card p-6">
            <Icon className="h-6 w-6 text-gold" strokeWidth={1.5} aria-hidden="true" />
            <p className="mt-3 font-display text-xl font-semibold text-gold-light">{k}</p>
            <p className="text-sm text-foreground/70">{v}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="container pb-4">
      <h2 className="section-title">What we do</h2>
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map(({ icon: Icon, title, desc, href }) => (
          <li key={title}>
            <Link to={href} className="lux-card lux-card-hover group flex h-full flex-col p-6">
              <span className="gold-ring-icon h-11 w-11">
                <Icon className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <h3 className="mt-4 font-display text-sm font-semibold uppercase tracking-wide text-gold-light">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/75">{desc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide2 text-gold">
                Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>

    <WhyUs />

    <section className="container pb-16">
      <div className="lux-card flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-xl font-semibold">Ready to get started?</h2>
          <p className="mt-1 text-sm text-foreground/75">Talk to our team — we'll guide you through every step.</p>
        </div>
        <Button asChild variant="gold" className="h-11 px-8">
          <Link to="/contact">
            Contact Us <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  </SiteLayout>
);

export default About;
