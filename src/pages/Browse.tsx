import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { CarCard } from "@/components/CarCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cars as staticCars, bodyTypes, fuelTypes, transmissionTypes } from "@/data/cars";
import { useDbCars } from "@/hooks/useCars";

const Browse = () => {
  const { data: dbCars = [] } = useDbCars();
  const allCars = useMemo(() => [...dbCars, ...staticCars], [dbCars]);
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
    let result = allCars.filter((car) => {
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

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-2 block">Make</label>
        <Select value={make} onValueChange={setMake}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Makes</SelectItem>
            {makes.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Body Type</label>
        <Select value={bodyType} onValueChange={setBodyType}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {bodyTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Fuel Type</label>
        <Select value={fuelType} onValueChange={setFuelType}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fuels</SelectItem>
            {fuelTypes.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Transmission</label>
        <Select value={transmission} onValueChange={setTransmission}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {transmissionTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Price: ${priceRange[0].toLocaleString()} – ${priceRange[1].toLocaleString()}</label>
        <Slider min={0} max={200000} step={5000} value={priceRange} onValueChange={setPriceRange} className="mt-3" />
      </div>
      <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">Clear All Filters</Button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Browse Cars</h1>
            <p className="text-muted-foreground text-sm mt-1">{filtered.length} vehicles found</p>
          </div>
          <Button variant="outline" className="lg:hidden" onClick={() => setFiltersOpen(!filtersOpen)}>
            <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-card rounded-xl border p-5">
              <h3 className="font-semibold mb-4 text-sm">Filters</h3>
              <FilterPanel />
            </div>
          </aside>

          {/* Mobile filters */}
          {filtersOpen && (
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden" onClick={() => setFiltersOpen(false)}>
              <div className="absolute right-0 top-0 h-full w-80 bg-card border-l p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold">Filters</h3>
                  <Button variant="ghost" size="icon" onClick={() => setFiltersOpen(false)}><X className="h-4 w-4" /></Button>
                </div>
                <FilterPanel />
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 space-y-6">
            <div className="flex gap-3">
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search cars..." className="max-w-sm" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="mileage">Lowest Mileage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg font-medium mb-2">No cars found</p>
                <p className="text-muted-foreground text-sm">Try adjusting your filters</p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Browse;
