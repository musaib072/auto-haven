import { Link } from "react-router-dom";
import { MapPin, Gauge, Fuel, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Car } from "@/data/cars";

export function CarCard({ car }: { car: Car }) {
  return (
    <Link to={`/car/${car.id}`}>
      <Card className="group overflow-hidden border-border/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-accent/40">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={car.image}
            alt={`${car.year} ${car.make} ${car.model}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {car.featured && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-0 text-xs font-semibold">
              Featured
            </Badge>
          )}
          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
          <p className="absolute bottom-3 right-3 text-white font-bold text-xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            ${car.price.toLocaleString()}
          </p>
        </div>
        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-base leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {car.year} {car.make} {car.model}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{car.color}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5" />{car.mileage.toLocaleString()} mi</span>
            <span className="flex items-center gap-1.5"><Fuel className="h-3.5 w-3.5" />{car.fuelType}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{car.transmission}</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{car.location.split(",")[0]}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
