import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertTriangle, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { CarCard, CarCardSkeleton } from "@/components/CarCard";
import { PageHero, SiteLayout } from "@/components/layout/SiteLayout";
import { BuyCarForm } from "@/components/forms/BuyCarForm";
import { bodyTypes, fuelTypes, transmissionTypes } from "@/data/cars";
import { useDbCars } from "@/hooks/useCars";

const Browse = () => {
  const { data: dbCars = [], isLoading, isError, refetch } = useDbCars();
  const allCars = dbCars;
  const makes = useMemo(() => [...new Set(allCars.map(c => c.make))].sort(), [allCars]);

  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [bodyType, setBodyType] = useState(searchParams.get("bodyType") || "all");
  const [fuelType, setFuelType] = useState(searchParams.get("fuelType") || "all");
  const [transmission, setTransmission] = useState("all");
  const [make, setMake] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [sortBy, setSortBy] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const result = allCars.filter((car) => {
      const q = search.toLowerCase();
      const matchesSearch = !q || `${car.make} ${car.model} ${car.year} ${car.color} ${car.bodyType}`.toLowerCase().includes(q);
      const matchesBody = bodyType === "all" || car.bodyType === bodyType;
      const matchesFuel = fuelType === "all" || car.fuelType === fuelType;
      const matchesTrans = transmission === "all" || car.transmission === transmission;
      const matchesMake = make === "all" || car.make === make;
      const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1];
      return matchesSearch && matchesBody && matchesFuel && matchesTrans && matchesMake && matchesPrice;
    });

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "mileage") result.sort((a, b) => a.mileage - b.mileage);
    else result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return result;
  }, [search, bodyType, fuelType, transmission, make, priceRange, sortBy, allCars]);

  const clearFilters = () => {
    setSearch(""); setBodyType("all"); setFuelType("all"); setTransmission("all"); setMake("all"); setPriceRange([0, 10000000]); setSortBy("newest");
  };

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-[13px] font-medium text-foreground/90">Make</label>
        <Select value={make} onValueChange={setMake}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Makes</SelectItem>
            {makes.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-2 block text-[13px] font-medium text-foreground/90">Body Type</label>
        <Select value={bodyType} onValueChange={setBodyType}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {bodyTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-2 block text-[13px] font-medium text-foreground/90">Fuel Type</label>
        <Select value={fuelType} onValueChange={setFuelType}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fuels</SelectItem>
            {fuelTypes.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-2 block text-[13px] font-medium text-foreground/90">Transmission</label>
        <Select value={transmission} onValueChange={setTransmission}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {transmissionTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-2 block text-[13px] font-medium text-foreground/90">Price: ₹{priceRange[0].toLocaleString()} – ₹{priceRange[1].toLocaleString()}</label>
        <Slider min={0} max={10000000} step={50000} value={priceRange} onValueChange={setPriceRange} className="mt-3" />
      </div>
      <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">Clear All Filters</Button>
    </div>
  );

  return (
    <SiteLayout title="Buy a Car" description="Browse inspected pre-owned cars in Amravati with transparent pricing. Can't find your car? Tell AUTOFLEXII and we'll source it for you.">
      <PageHero
        eyebrow="Buy with AUTOFLEXII"
        title="Find your perfect ride"
        subtitle="Inspected pre-owned cars with transparent pricing — or tell us what you want and we'll find it."
        image="/images/card-buy.webp"
      />
      <div className="container py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="section-title">Available cars</h2>
            <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
              {isLoading ? "Loading vehicles…" : `${filtered.length} vehicle${filtered.length === 1 ? "" : "s"} found`}
            </p>
          </div>
          <Button variant="outline" className="lg:hidden" onClick={() => setFiltersOpen(!filtersOpen)}>
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
        </div>

        <div className="flex gap-8">
          <aside className="hidden w-64 shrink-0 lg:block" aria-label="Filters">
            <div className="lux-card sticky top-24 p-5">
              <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide2 text-gold-light">Filters</h3>
              {filterPanel}
            </div>
          </aside>

          {filtersOpen && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden" onClick={() => setFiltersOpen(false)}>
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Filters"
                className="absolute right-0 top-0 h-full w-80 max-w-[90vw] overflow-y-auto border-l border-gold/20 bg-card p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-display font-semibold uppercase tracking-wide2 text-gold-light">Filters</h3>
                  <Button variant="ghost" size="icon" onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {filterPanel}
              </div>
            </div>
          )}

          <div className="min-w-0 flex-1 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search make, model, colour…" aria-label="Search cars" className="sm:max-w-sm" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="sm:w-48" aria-label="Sort by"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="mileage">Lowest KM Driven</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <CarCardSkeleton key={i} />)}
              </div>
            ) : isError ? (
              <div className="lux-card flex flex-col items-center px-6 py-14 text-center">
                <AlertTriangle className="h-8 w-8 text-gold" aria-hidden="true" />
                <p className="mt-3 font-medium">We couldn't load the listings</p>
                <p className="mt-1 text-sm text-muted-foreground">Please check your connection and try again.</p>
                <Button variant="outline" className="mt-5" onClick={() => refetch()}>Retry</Button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="lux-card px-6 py-14 text-center">
                <p className="text-lg font-medium">No cars match your filters</p>
                <p className="mt-1 text-sm text-muted-foreground">Try adjusting the filters — or tell us what you're looking for below.</p>
                <Button variant="outline" className="mt-5" onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((car) => <CarCard key={car.id} car={car} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="border-t border-white/5 bg-[hsl(240_6%_5.5%)] py-12">
        <div className="container grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="eyebrow mb-3">Car sourcing</p>
            <h2 className="section-title">Didn't find the right car?</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/75">
              Share your budget and preferences. We'll shortlist inspected cars that match and call you with options — no obligation.
            </p>
          </div>
          <BuyCarForm id="find" />
        </div>
      </section>
    </SiteLayout>
  );
};

export default Browse;
