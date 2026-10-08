import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Gauge, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarCard } from "@/components/CarCard";
import { ImageCarousel } from "@/components/ImageCarousel";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { useDbCars } from "@/hooks/useCars";
import { site, telHref, whatsappHref } from "@/config/site";

const CarDetail = () => {
  const { id } = useParams();
  const { data: cars = [], isLoading } = useDbCars();
  const car = cars.find((c) => c.id === id);

  if (isLoading) {
    return (
      <SiteLayout title="Loading…">
        <div className="container grid grid-cols-1 gap-8 py-10 lg:grid-cols-3" aria-busy="true">
          <div className="aspect-[16/9] animate-pulse rounded-xl bg-white/5 lg:col-span-2" />
          <div className="h-72 animate-pulse rounded-xl bg-white/5" />
        </div>
      </SiteLayout>
    );
  }

  if (!car) {
    return (
      <SiteLayout title="Car not found" noindex>
        <div className="container flex min-h-[50vh] flex-col items-center justify-center text-center">
          <p className="font-display text-2xl font-semibold">This car is no longer available</p>
          <p className="mt-2 text-sm text-muted-foreground">It may have been sold. Browse our other listings.</p>
          <Button asChild variant="gold" className="mt-6 h-11 px-8">
            <Link to="/buy">Browse Cars</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const name = `${car.year} ${car.make} ${car.model}`;
  const similar = cars.filter((c) => c.id !== car.id && (c.bodyType === car.bodyType || c.make === car.make)).slice(0, 3);
  const specs = [
    { label: "Year", value: car.year },
    { label: "Body Type", value: car.bodyType },
    { label: "Engine", value: car.engine },
    { label: "Transmission", value: car.transmission },
    { label: "Fuel Type", value: car.fuelType },
    { label: "KM Driven", value: `${car.mileage.toLocaleString("en-IN")} km` },
    { label: "Colour", value: car.color },
    { label: "Location", value: car.location },
  ].filter((s) => s.value !== "" && s.value !== undefined && s.value !== null);
  const waText = `Hi ${site.name}, I'm interested in the ${name} listed at ₹${car.price.toLocaleString("en-IN")}. ${window.location.href}`;

  return (
    <SiteLayout title={name} description={`${name} for ₹${car.price.toLocaleString("en-IN")} — ${car.mileage.toLocaleString("en-IN")} km, ${car.fuelType}, ${car.transmission}. Available at AUTOFLEXII.`}>
      <div className="container py-8">
        <Link to="/buy" className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/70 transition-colors hover:text-gold">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <ImageCarousel images={car.images} carName={name} featured={car.featured} />

            <div>
              <h1 className="font-display text-3xl font-bold md:text-4xl">{name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-foreground/70">
                {car.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-gold" />{car.location}</span>}
                <span className="flex items-center gap-1"><Gauge className="h-4 w-4 text-gold" />{car.mileage.toLocaleString("en-IN")} km</span>
              </div>
            </div>

            {car.description && (
              <section>
                <h2 className="mb-3 font-display text-lg font-semibold text-gold-light">About this vehicle</h2>
                <p className="whitespace-pre-line leading-relaxed text-foreground/80">{car.description}</p>
              </section>
            )}

            <section>
              <h2 className="mb-3 font-display text-lg font-semibold text-gold-light">Specifications</h2>
              <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {specs.map((s) => (
                  <div key={s.label} className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
                    <dt className="text-xs text-muted-foreground">{s.label}</dt>
                    <dd className="mt-0.5 text-sm font-medium">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {car.features.length > 0 && (
              <section>
                <h2 className="mb-3 font-display text-lg font-semibold text-gold-light">Features</h2>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {car.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground/85">
                      <Check className="h-4 w-4 text-gold" /> {f}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside>
            <div className="lux-card sticky top-24 space-y-6 p-6">
              <div>
                <p className="font-display text-3xl font-bold text-gold-light">₹{car.price.toLocaleString("en-IN")}</p>
                <p className="mt-1 text-xs text-muted-foreground">Indicative EMI from ₹{Math.round(car.price / 60).toLocaleString("en-IN")}/mo*</p>
              </div>
              <div className="space-y-3">
                <Button asChild variant="gold" className="h-11 w-full">
                  <a href={telHref(site.phones[0])}>
                    <Phone /> Call {site.phones[0]}
                  </a>
                </Button>
                <Button asChild variant="goldOutline" className="h-11 w-full normal-case tracking-normal">
                  <a href={whatsappHref(waText)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle /> Enquire on WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline" className="h-11 w-full rounded-full">
                  <Link to={`/inspectify?car=${encodeURIComponent(name)}#book`}>
                    <ShieldCheck className="text-gold" /> Book an Inspectify check
                  </Link>
                </Button>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">*EMI is indicative over 60 months and subject to lender approval.</p>
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="mt-16">
            <h2 className="section-title mb-6">Similar listings</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((c) => <CarCard key={c.id} car={c} />)}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
};

export default CarDetail;
