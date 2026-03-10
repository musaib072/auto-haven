import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Gauge, Fuel, Calendar, Star, Phone, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CarCard } from "@/components/CarCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import type { Car } from "@/data/cars";
import { useDbCars } from "@/hooks/useCars";
import { useMemo } from "react";

const CarDetail = () => {
  const { id } = useParams();
  const { data: dbCars = [] } = useDbCars();
  const allCars = useMemo(() => [...dbCars, ...staticCars], [dbCars]);
  const car = allCars.find((c) => c.id === id);

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-semibold mb-2">Car not found</p>
            <Button asChild variant="outline"><Link to="/browse">Back to Browse</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  const similar = allCars.filter((c) => c.id !== car.id && (c.bodyType === car.bodyType || c.make === car.make)).slice(0, 3);

  const specs = [
    { label: "Year", value: car.year },
    { label: "Body Type", value: car.bodyType },
    { label: "Engine", value: car.engine },
    { label: "Transmission", value: car.transmission },
    { label: "Fuel Type", value: car.fuelType },
    { label: "Mileage", value: `${car.mileage.toLocaleString()} mi` },
    { label: "Color", value: car.color },
    { label: "Location", value: car.location },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <Link to="/browse" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Image + Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9]">
              <img src={car.image} alt={`${car.year} ${car.make} ${car.model}`} className="w-full h-full object-cover" />
              {car.featured && (
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground border-0">Featured</Badge>
              )}
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {car.year} {car.make} {car.model}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{car.location}</span>
                <span className="flex items-center gap-1"><Gauge className="h-4 w-4" />{car.mileage.toLocaleString()} mi</span>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>About This Vehicle</h2>
              <p className="text-muted-foreground leading-relaxed">{car.description}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {specs.map((spec) => (
                  <div key={spec.label} className="bg-muted/50 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground">{spec.label}</p>
                    <p className="font-medium text-sm mt-0.5">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {car.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-accent" /> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Price + Seller */}
          <div className="space-y-4">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div>
                  <p className="text-3xl font-bold text-accent" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    ${car.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Estimated payment: ${Math.round(car.price / 60).toLocaleString()}/mo</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-2">Seller Information</p>
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold">{car.seller.name}</p>
                    <p className="flex items-center gap-1 text-muted-foreground">
                      <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {car.seller.rating} rating
                    </p>
                    <p className="text-muted-foreground">Member since {car.seller.memberSince}</p>
                  </div>
                </div>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Phone className="h-4 w-4 mr-2" /> Contact Seller
                </Button>
                <Button variant="outline" className="w-full">Save to Favorites</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Similar Listings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map((c) => <CarCard key={c.id} car={c} />)}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CarDetail;
