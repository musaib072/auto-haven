import { Link } from "react-router-dom";
import { MapPin, Gauge, Fuel, Cog } from "lucide-react";
import type { Car } from "@/data/cars";

export function CarCard({ car }: { car: Car }) {
  const name = `${car.year} ${car.make} ${car.model}`;
  return (
    <Link
      to={`/car/${car.id}`}
      className="lux-card lux-card-hover group block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-black">
        <img
          src={car.image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        {car.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-gold-gradient px-3 py-1 text-[10px] font-bold uppercase tracking-wide2 text-primary-foreground">
            Featured
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 to-transparent" />
        <p className="absolute bottom-3 right-4 font-display text-xl font-bold text-gold-light">₹{car.price.toLocaleString("en-IN")}</p>
      </div>
      <div className="space-y-3 p-5">
        <div>
          <h3 className="font-display text-base font-semibold leading-tight text-foreground">{name}</h3>
          {car.color && <p className="mt-0.5 text-xs text-muted-foreground">{car.color}</p>}
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-foreground/70">
          <span className="flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5 text-gold" />{car.mileage.toLocaleString("en-IN")} km</span>
          <span className="flex items-center gap-1.5"><Fuel className="h-3.5 w-3.5 text-gold" />{car.fuelType}</span>
          <span className="flex items-center gap-1.5"><Cog className="h-3.5 w-3.5 text-gold" />{car.transmission}</span>
          {car.location && <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-gold" />{car.location.split(",")[0]}</span>}
        </div>
      </div>
    </Link>
  );
}

export function CarCardSkeleton() {
  return (
    <div className="lux-card overflow-hidden" aria-hidden="true">
      <div className="aspect-[16/10] animate-pulse bg-white/5" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-white/5" />
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-3 animate-pulse rounded bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}
